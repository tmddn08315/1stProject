import React, { useEffect } from 'react'
import KakaoMapCustom from './KakaoMapCustom'

const KakaoMapModal = ({ isOpen, onClose, lat, lng, address }) => {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY

      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollY}px`
      document.body.style.overflowY = 'scroll'

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.overflowY = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])
  if (!isOpen) return null

  return (
    <div className="kakaoMapModal">
      <div className="kakaoMapModal-con">
        <div className="kakaoMapModal-btn">          
          <button onClick={onClose}>닫기</button>
        </div>
        <div className="kakaoMapModal-map">
          <KakaoMapCustom
            lat={lat}
            lng={lng}
            markerImage='/images/markerK.png'
          />
        </div>
        <div className="kakaoMapModal-address">
          <p>주소: {address}</p>
        </div>
      </div>
    </div>
  )
}

export default KakaoMapModal