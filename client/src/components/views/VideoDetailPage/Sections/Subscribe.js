import React, { useEffect, useState } from 'react'
import Axios from 'axios';


//구독버튼
function Subscribe(props) {

  const [SubscribeNumber, setSubscribeNumber] = useState(0)
  const [Subscribed, setSubscribed] = useState(false)  //false이면 subscribed 안한 상태 true면 한 상태

  useEffect(() => {

    let variable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

    Axios.post('/api/subscribe/SubscribeNumber', variable)
      .then(response => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber)
        } else {
          alert('구독자 수 정보를 받아오지 못했습니다.');
        }
      })
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem('userId')
    }

    Axios.post('/api/subscribe/subscribed', subscribedVariable)
      .then(response => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed)
        } else {
          alert('정보를 받아오지 못했습니다.')
        }
      })
  }, [])
console.log(Subscribed)
  const onSubscribe = () => {

    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom
    }
    if (Subscribed) { //이미 구독 중이라면
      Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
        .then(response => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1)
            setSubscribed(!Subscribed)
          } else {
            alert('구독 취소 실패')
          }
        })
    } else {  //구독 중이 아니라면
      Axios.post('/api/subscribe/subscribe', subscribedVariable)
        .then(response => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1 )
            setSubscribed(!Subscribed)
          } else {
            alert('구독 실패')
          }
        })
    }console.log(Subscribed)
  }
  return (
    <div>
      <button
        onClick={onSubscribe}
        style={{
          backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
          color: 'white', padding: '10px 16px', fontWeight: '500',
          fontSize: '1rem', textTransform: 'uppercase'
        }}

      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
        {/* 구독중이라면 Subscribed @@ 구독하지 않았다면 Subscribe로 보여준다*/}
      </button>
    </div>
  )
}

export default Subscribe
