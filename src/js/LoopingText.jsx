import React, { useEffect, useRef } from 'react';

const LoopingText = ({ text }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const lerp = (current, target, factor) => current * (1 - factor) + target * factor;

        const state = {
            el,
            lerp: {
                current: 0,
                target: 0
            },
            interpolationFactor: 0.1,
            speed: 0.1,
            direction: -1
        };

        state.el.style.cssText = 'position: relative; display: inline-flex; white-space: nowrap;';
        state.el.children[1].style.cssText = `position: absolute; left: ${100 * -state.direction}%;`;

        function animate() {
            state.lerp.target += state.speed;
            state.lerp.current = lerp(state.lerp.current, state.lerp.target, state.interpolationFactor);

            if (state.lerp.target > 100) {
                state.lerp.current -= state.lerp.target;
                state.lerp.target = 0;
            }

            const x = state.lerp.current * state.direction;
            state.el.style.transform = `translateX(${x}%)`;
        }

        function render() {
            animate();
            requestAnimationFrame(render);
        }

        render();
    }, []);

    return (
        <div className="loop-wrapper" style={{ overflow: 'hidden', width: '100%' }}>
            <div className="loop-container" ref={containerRef}>
                <span>{text}</span>
                <span>{text}</span>
            </div>
        </div>
    );
};

export default LoopingText;