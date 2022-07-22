import { Col, Avatar, Row, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Axios from 'axios';
import moment from 'moment';
// import { response } from 'express';
import React, { useEffect, useState } from 'react'
// import { FaCode } from "react-icons/fa";
const { Title } = Typography;

function LandingPage() {

    const [Video, setVideo] = useState([])


    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setVideo(response.data.videos)
                } else {
                    alert('비디오 가져오기를 실패했습니다.')
                }
            })
    }, [])

    const renderCards = Video.map((video, index) => {
        var hours = Math.floor(video.duration / 60 / 60);
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - (minutes * 60));

        return <Col lg={6} md={8} xs={24}>
            {/*large사이즈일 때 6사이즈로 24를 맞춤 4개가 보인다. */}
            {/*middel사이즈일 때 8사이즈로 24를 맞춤 3개가 보인다. */}
            <a href={`/video/${video._id}`} >
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} />
                    <div className="Duration">
                        {
                            hours >= 1 ? <span>{hours}: {minutes} : {seconds}</span> : <span>{minutes} : {seconds}</span>
                        }
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />  //유저이미지
                }
                title={video.title}
                description=""
            />
            <span>{video.writer.name} </span> <br />
            <span style={{ marginLeft: '3rem' }}>{video.views} views</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>

    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>


        </div>
    )
}


export default LandingPage
