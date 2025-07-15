import React, { useEffect, useRef } from 'react'

const KakaoMapCustom = ({lat, lng}) => {
  const mapRef = useRef(null)

  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        setTimeout(loadMap, 100)
        return
      }
      window.kakao.maps.load(() => {
        const container = document.getElementById('mapRef')

        if(!container) return

        const options = {
          center: new window.kakao.maps.LatLng(Number(lat), Number(lng)),
          level: 3,
        }

        const map = new window.kakao.maps.Map(container, options)

        const imageSrc = '/images/marker2.png'
        const imageSize = new window.kakao.maps.Size(70,71)
        const imageOption = { offset: new window.kakao.maps.Point(20,42)}

        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

        new window.kakao.maps.Marker({
          map,
          position: options.center,
          image: markerImage
        });

        setTimeout(() => {
          window.kakao.maps.event.trigger(map, 'resize')
          map.setCenter(options.center)
        }, 500)
      });
    };


    if (!document.getElementById('kakao-map-cus')) {
      const script = document.createElement('script')
      script.id = 'kakao-map-cus'
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c332ab2c70659f81a39b7d3b752e808e&autoload=false`
      script.async = true
      script.onload = loadMap
      document.head.appendChild(script)
    } else {
      loadMap()
    }
  }, [lat, lng])
  
  return (
    <div
      id="mapRef"
      style={{
        width: '400px',
        height: '300px',
        borderTop: '1px solid #cccccc',
        borderBottom: '1px solid #cccccc'
      }}></div>
  )
}

export default KakaoMapCustom