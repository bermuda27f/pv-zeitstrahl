import {useState, useEffect, useCallback} from 'react';

export function useWindowSize() {

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  function handleResize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEffect(() => {

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

  const downHandler = useCallback(({ key })=>{
    if (key === targetKey) {
      setKeyPressed(true);
    }
  },[targetKey])

  const upHandler = useCallback(({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  },[targetKey]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]);

  return keyPressed;
}