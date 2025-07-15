import React, { useEffect } from 'react';

const KakaoMap = ({ lat, lng }) => {
  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        setTimeout(loadMap, 100);
        return;
      }

      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) return;

        const options = {
          center: new window.kakao.maps.LatLng(Number(lat), Number(lng)),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        new window.kakao.maps.Marker({
          map,
          position: options.center,
        });
      });
    };

    // 스크립트가 없을 경우 로드
    if (!document.getElementById('kakao-map-sdk')) {
      const script = document.createElement('script');
      script.id = 'kakao-map-sdk';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=ec3131ab336878c64b31afabbac1136a&autoload=false`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }
  }, [lat, lng]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '300px',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    />
  );
};

export default KakaoMap;