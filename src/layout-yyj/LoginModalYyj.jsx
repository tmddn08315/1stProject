import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginModalYyj = ({ onClose }) => {
  
  const navigate = useNavigate()

  return (
    <div className="modalYj">
      <div className="modalYj-con">
        <h2>로그인 또는 회원가입을 해주세요.</h2>
        <div className="modalYj-button">          
          <button onClick={() => navigate('/auth/login')}>로그인</button>
          <button onClick={() => navigate('/auth/login')}>회원가입</button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  )
}

export default LoginModalYyj