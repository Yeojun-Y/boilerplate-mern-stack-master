const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
const path = require('path');
const { auth } = require("../middleware/auth");
const multer = require("multer");

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
            return res.json({ success: true, filePath: res.req.file.path, 
                            filename: res.req.file.filename })
        }
    })
})


module.exports = router;
