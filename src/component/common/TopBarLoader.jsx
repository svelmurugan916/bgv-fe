import React, { useEffect, useState } from 'react';

const TopBarLoader = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const startTimeout = setTimeout(() => setProgress(25), 50);
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 90) return oldProgress + 0.2; // Very slow crawl near the end
                const increment = Math.random() * 4 + 1;
                return Math.min(oldProgress + increment, 90);
            });
        }, 300);

        return () => {
            clearTimeout(startTimeout);
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none">
            <div
                className="h-[3px] bg-[#5D4591] transition-all duration-[600ms] ease-[cubic-bezier(0.21,0.01,0,1)]"
                style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 10px rgba(93, 69, 145, 0.7)'
                }}
            />
            <div
                className="absolute top-0 h-[3px] w-[100px] right-0 transition-all duration-[600ms] ease-[cubic-bezier(0.21,0.01,0,1)]"
                style={{
                    width: '100px',
                    right: `${100 - progress}%`,
                    boxShadow: '0 0 10px #5D4591, 0 0 5px #5D4591',
                    opacity: progress > 0 ? 1 : 0,
                    transform: 'rotate(3deg) translate(0px, -4px)'
                }}
            />
        </div>
    );
};

export default TopBarLoader;
