import React, { useEffect, useState } from 'react'
import Axios from 'axios';


//구독버튼
function Subscribe(props) {

  const [SubscribeNumber, setSubscribeNumber] = useState(0)
  const [Subscribed, setSubscribed] = useState(false)  //false이면 subscribed 안한 상태 true면 한 상태

  useEffect(() => {

    let variable = { userTo: props.userTo }

    Axios.post('/api/subscribe/SubscribeNumber', variable)
      .then(response => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber)
        } else {
          alert('구독자 수 정보를 받아오지 못했습니다.');
        }
      })
      let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

Axios.post('/api/subscribe/subscribed', subscribedVariable)
.then(response => {
  if(response.data.success) {
setSubscribed(response.data.subscribed)
  } else {
    alert('정보를 받아오지 못했습니다.')
  }
})
  },[])


  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribe ? '#CC0000' : '#AAAAAA' }`, borderRadius: '4px',
          color: 'white', padding: '10px 16px', fontWeight: '500',
          fontSize: '1rem', textTransform: 'uppercase'
        }}
        onClick
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}  
        {/* 구독중이라면 Subscribed @@ 구독하지 않았다면 Subscribe로 보여준다*/}
      </button>
    </div>
  )
}

export default Subscribe
