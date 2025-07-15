import React, { useRef, useState } from 'react'

const ImageSlider = ({images = [], imageSlideInterval = 3000}) => {
  const [currentImage, setCurrentImage] = useState(0)
  const total = images.length
  const sliderRef = useRef()
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const prevSlide = () => {
    // if (currentImage > 0) {
    setCurrentImage(prev => (prev === 0 ? total -1 : prev - 1))
  }
  const nextSlide = () => {
    // if (currentImage < total -1){
    setCurrentImage(prev => (prev + 1) % total)
  }

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const onTouchEnd = () => {
    const touchee = touchStartX.current - touchEndX.current
    if (touchee > 50) nextSlide()
    if (touchee < -50)  prevSlide()
  }


  const goTo = (el) => setCurrentImage(el) 

  return (
    <div className="imageSlider">
      <div 
        className="imageSlider-con"
        ref={sliderRef}
        style={{transform: `translateX(-${currentImage * 100}%)`}}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        >
          <ul>
            {images.map((img, idx) => (
              <li
                key={idx}
                
              >
                <img src={img} alt={`slide-${idx}`} />
              </li>
            ))}
          </ul>
      </div>
      <div className="bottom-con">
        <div className="dots">
          <ul>
            {images.map((el, idx) => (
              <li
                key={idx}
                className={currentImage === idx ? 'one' : ''}
                onClick={() => goTo(idx)}
                ></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ImageSlider