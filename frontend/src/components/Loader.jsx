import React from 'react';

function Loader() {
  const loaderStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100px',
    position: 'relative',
    margin: '0 auto',
  };

  const dotStyles = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#FF6F61', // Modern warm color (perfect for e-commerce)
    opacity: '0.8',
    animation: 'move 2s infinite ease-in-out, fade 2s infinite ease-in-out',
  };

  const dotOneStyles = {
    ...dotStyles,
    animationDelay: '0s',
  };

  const dotTwoStyles = {
    ...dotStyles,
    animationDelay: '0.3s',
  };

  const dotThreeStyles = {
    ...dotStyles,
    animationDelay: '0.6s',
  };

  const moveAnimation = `
    @keyframes move {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(20px);
      }
      50% {
        transform: translateX(40px);
      }
      75% {
        transform: translateX(20px);
      }
    }
  `;

  const fadeAnimation = `
    @keyframes fade {
      0% {
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.3;
      }
    }
  `;

  // Inject the CSS animations into the head
  React.useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = moveAnimation + fadeAnimation;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div style={loaderStyles}>
      <div style={dotOneStyles}></div>
      <div style={dotTwoStyles}></div>
      <div style={dotThreeStyles}></div>
    </div>
  );
}

export default Loader;
