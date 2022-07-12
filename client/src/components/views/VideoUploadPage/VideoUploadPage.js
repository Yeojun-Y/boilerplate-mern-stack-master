import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';

// import Title from 'antd/lib/skeleton/Title';
import Dropzone from 'react-dropzone';
// import { response } from 'express';
// import axios from 'axios';
import Axios from 'axios';

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

function VideoUploadPage() {


    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    //const [Private, setPrivate] = useState(0)
    //const [Category, setCategory] = useState("Film & Animation")

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

        Axios.post('/api/video/uploads', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    message.success("성공적으로 업로드 했습니다.");

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.filename
                    }

                    Axios.post('/api/video/thumbnails', variable)

                        .then(response => {
                            if (response.data.success) {

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
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }} >
                <Title Level={2}>upload Video</Title>
            </div>

            <Form onSubmit>
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
                    <div>
                        <img src alt="" />
                    </div>
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
                <Button type="primary" size="large" onClick>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage
