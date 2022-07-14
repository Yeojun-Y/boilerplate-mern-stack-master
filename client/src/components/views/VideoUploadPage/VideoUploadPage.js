import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';

// import Title from 'antd/lib/skeleton/Title';
import Dropzone from 'react-dropzone';
// import axios from 'axios';
import Axios from 'axios';
import { useSelector } from 'react-redux';
// import { response } from 'express';
// import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Title } = Typography;
const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
];

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
]

function VideoUploadPage(props) {

    const user = useSelector(state => state.user);
    // const navigate = useNavigate();

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [filePath, setfilePath] = useState("")
    const [Category, setCategory] = useState("Film & Animation")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }
    const onsetDescription = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onCategoryChange = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            Headers: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])
        console.log(files);
        Axios.post('/api/video/uploads', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    message.success("성공적으로 업로드 했습니다.");

                    let variable = {
                        url: response.data.filePath,
                        fileName: response.data.filename
                    }
                    setfilePath(response.data.filePath)

                    Axios.post('/api/video/thumbnails', variable)

                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)
                                console.log(response.data);

                            } else {
                                alert('썸네일 생성에 실패 했습니다.')
                            }
                        })
                } else {
                    alert('비디오 업로드를 실패했습니다.')
                };
            })
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: filePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath,

        }
        //비디오 업로드
        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    message.success('업로드 성공!')

                    setTimeout(() => {
                        // navigate("/")
                        props.history.push('/')
                    }, 3000);

                } else {
                    alert('비디오 업로드에 실패 했습니다.!!')
                }
            })
    }
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }} >
                <Title Level={2}>upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone*/}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={100000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{
                                width: '300px', height: '240px',
                                border: '1px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>
                    {/*Thumbnails*/}

                    {ThumbnailPath &&  //썸네일이 있을 때 렌더링되도록
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />

                <label>Description</label>
                <br />
                <TextArea
                    onChange={onsetDescription}
                    value={Description}
                />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>

                    ))}
                </select>

                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value} >{item.label}</option>

                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage
