import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])


    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                    setsideVideos(response.data.videos)
                } else {
                    alert('비디오 가져오기를 실패했습니다.')
                }
            })
    }, [])

    const renderSideVideo = sideVideos.map((video, index) => {

        var hours = Math.floor(video.duration / 60 / 60);
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - (minutes * 60));


        return <div key={index} style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}>
                <div style={{ width: '80%', marginLeft: '1rem' }}>
                    <a href>
                        <img style={{ width: '80%', height: '100%' }}
                            src={`http://localhost:5000/${video.thumbnail}`} alt />
                    </a>
                </div>
            
            <div style={{ width: '50%' }}>
                <a href style={{ color: 'gray' }}>
                    <span style={{ fontSize: '1rem', color: 'black' }}>{video.title} </span><br />
                    <span>{video.writer.name}</span> <br />
                    <span>{video.views} views</span> <br />
                    <span>{
                        hours >= 1 ? <span>{hours}: {minutes} : {seconds}</span> : <span>{minutes} : {seconds}</span>
                    }</span>
                </a>
            </div>
        </div >
    })

    return (

        <React.Fragment>
            <div style={{ marginTop: '3rem' }}></div>
            {renderSideVideo}
        </React.Fragment>


    )
}

export default SideVideo
