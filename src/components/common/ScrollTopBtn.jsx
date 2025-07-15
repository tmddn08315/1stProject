import React, { useEffect, useRef } from 'react'

const ScrollTopBtn = () => {
  const ref = useRef(null);
  const scrollTo = () => {
    window.scrollTo({
      top: 0,
      behavior:'smooth'
    })
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const btn = ref.current;

      if (!btn) return;

      if (scrollY > 200) {
        btn.style.display = 'block';
      } else {
        btn.style.display = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);

    if (ref.current) {
      ref.current.style.display = 'none'
    }
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      onClick={scrollTo}
      ref={ref}
      style={{
        zIndex:'999',
        display:'none',
        boxSizing:'border-box',
        padding:'0.5vw 1vw',
        bottom: '20px',
        right: '30px',
        position: 'fixed',
        background:'none',
        cursor:'pointer'
      }}
    >
      <img src="/images/scrollTopBtn3.png" alt="scrollTopBtn" />
    </div>
  )
}

export default ScrollTopBtn