import {useState, useEffect} from 'react';

export function useWindowSize() {

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
      
    window.addEventListener("resize", handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize();

    return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize); 
      }
    }, []);

    return windowSize;
}


export function useKeyPress(targetKey) {

  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
}