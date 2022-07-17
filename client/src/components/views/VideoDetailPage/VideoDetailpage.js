import { Avatar, Col, Input, List, Row } from 'antd'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
// import { useParams } from "react-router-dom";
function VideoDetailpage(props) {

    const videoId = props.match.params.videoId

    // const videoId = useParams().videoId;
    const variable = { videoId: videoId }
    const [VideoDetail, setVideoDetail] = useState([])


    useEffect(() => {

        Axios.post('/api/video/getVideos', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setVideoDetail(response.data.VideoDetail)
                } else {
                    alert('비디오 정보 가져오는 것을 실패했습니다.')
                }
            })
    }, [Input])

    if (VideoDetail.writer) {
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }}
                            src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                        <List.Item
                            actions //like & dislike
                        >
                            <List.Item.Meta

                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        {/* Comment */}
                    </div>

                </Col>
                <Col lg={6} xs={24} >
                    Side Video
                </Col>
            </Row>
        )
    } else {
        return (
            <div> ... .. .</div>
        )
    }


}

export default VideoDetailpage
