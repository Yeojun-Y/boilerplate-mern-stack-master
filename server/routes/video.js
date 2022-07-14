const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const path = require('path');
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath("B:\\Users\\ikm32\\Downloads\\ffmpeg-5.0.1-essentials_build\\bin\\ffmpeg.exe");

// STORAGE MULTER CONFIG
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     }, 
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname)
//         if (ext !== '.mp4') {
//             return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
//         }
//         cb(null, true)
//     }
// });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    // mime type 체크하여 원하는 타입만 필터링
    if (file.mimetype == 'video/mp4') {
        cb(null, true);
    } else {
        cb({ msg: 'mp4 파일만 업로드 가능합니다.' }, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file");

//=================================
//            Video
//=================================

router.post('/uploads', (req, res) => {
    // client에서 받은 비디오를 서버에 저장

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        } else {
            return res.json({
                success: true,
                filePath: res.req.file.path,
                filename: res.req.file.filename
            })
        }
    })
})

router.post('/uploadVideo', (req, res) => {
    // 비디오 정보들 저장
    const video = new Video(req.body)

    video.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})
router.post('/thumbnails', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임 가져오기

    let filePath = ""
    let fileDuration = ""

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    //썸네일 생성
    ffmpeg(req.body.url) //<- uploads폴더의 경로를 가져온다
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () {  //썸네일을 생성하고 무엇을 할 것인지
            console.log('Screenshots taken')
            return res.json({
                success: true, url: filePath, fileDuration: fileDuration
            })
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({ success: false, err })
        })
        .screenshot({
            // Will take screenshots at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',

            filename: 'thumbnail-%b.png'
        })
})


module.exports = router;
