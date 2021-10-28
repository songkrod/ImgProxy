import "./styles.css";
import React, { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getImageUrl } from "./image";

import { useImgProxy } from "./useImgProxy";

const IMAGE_URL =
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80";

const IMAGE_IN_RAW = {
  WIDTH: 1170,
  HEIGHT: 780
};

const CROP_SIZE = {
  WIDTH: 1170,
  HEIGHT: 1170
};

const getColumnUsed = () => {
  const cropRatio = CROP_SIZE.WIDTH / CROP_SIZE.HEIGHT;
  const imageRatio = IMAGE_IN_RAW.WIDTH / IMAGE_IN_RAW.HEIGHT;

  const newImageWidth =
    (IMAGE_IN_RAW.WIDTH / IMAGE_IN_RAW.HEIGHT) * CROP_SIZE.HEIGHT;
  const newImageHeight =
    (IMAGE_IN_RAW.HEIGHT / IMAGE_IN_RAW.WIDTH) * CROP_SIZE.WIDTH;

  // ratio > 1 = width > height
  if (cropRatio >= 1) {
    if (imageRatio >= 1) {
      return newImageHeight > CROP_SIZE.HEIGHT ? "HEIGHT" : "WIDTH";
    } else {
      return newImageWidth > CROP_SIZE.WIDTH ? "WIDTH" : "HEIGHT";
    }
  } else {
    if (imageRatio >= 1) {
      return newImageHeight > CROP_SIZE.HEIGHT ? "HEIGHT" : "WIDTH";
    } else {
      return newImageWidth > CROP_SIZE.WIDTH ? "WIDTH" : "HEIGHT";
    }
  }
};

const COLUMN = getColumnUsed();
const DEFAULT_IMAGE_ZOOM_LEVEL = CROP_SIZE[COLUMN] / IMAGE_IN_RAW[COLUMN];

export default function App() {
  const transformWrapperRef = useRef(null);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const IMAGE_CROP_SIZE = {
    WIDTH: IMAGE_IN_RAW.WIDTH * DEFAULT_IMAGE_ZOOM_LEVEL,
    HEIGHT: IMAGE_IN_RAW.HEIGHT * DEFAULT_IMAGE_ZOOM_LEVEL
  };
  const [resultUrl, setResultUrl] = useState("");

  const { generateImageUrl } = useImgProxy(
    IMAGE_IN_RAW,
    CROP_SIZE,
    IMAGE_CROP_SIZE
  );

  const onChangeButton = (reaction) => {
    reaction();
    setTimeout(() => {
      setPosX(transformWrapperRef.current.state.positionX);
      setPosY(transformWrapperRef.current.state.positionY);
      setZoom(transformWrapperRef.current.state.scale);
    }, 300);
  };

  const onChange = (ReactZoomPanPinchRef) => {
    setPosX(ReactZoomPanPinchRef.state.positionX);
    setPosY(ReactZoomPanPinchRef.state.positionY);
    setZoom(ReactZoomPanPinchRef.state.scale);
  };

  const handleClick = (event) => {
    const resultUrl = generateImageUrl(IMAGE_URL, posX, posY, zoom);
    setResultUrl(resultUrl);
  };

  return (
    <div className="App">
      {/* <div className='wrapper'> */}
      <TransformWrapper
        ref={transformWrapperRef}
        zoomAnimation={{ disabled: true }}
        alignmentAnimation={{ disabled: true }}
        velocityAnimation={{ disabled: true }}
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        onPanning={onChange}
        onZoom={onChange}
        onWheel={onChange}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, setTransform, ...rest }) => (
          <React.Fragment>
            <div className="tools">
              <button onClick={() => onChangeButton(() => zoomIn(0.3, 100))}>
                +
              </button>
              <button onClick={() => onChangeButton(() => zoomOut(0.3, 100))}>
                -
              </button>
              <button
                onClick={() => onChangeButton(() => setTransform(0, 0, 1, 100))}
              >
                x
              </button>
            </div>
            <TransformComponent
              wrapperStyle={{
                width: `${CROP_SIZE.WIDTH}px`,
                height: `${CROP_SIZE.HEIGHT}px`,
                background: "rgb(0, 255, 0)",
                border: "10px solid red"
              }}
              contentStyle={{
                height: `${IMAGE_CROP_SIZE.HEIGHT}px`,
                width: `${IMAGE_CROP_SIZE.WIDTH}px`
              }}
            >
              <img
                style={{
                  height: `${IMAGE_CROP_SIZE.HEIGHT}px`,
                  width: `${IMAGE_CROP_SIZE.WIDTH}px`
                  // transform: `scale(${zoom})`
                }}
                src={IMAGE_URL}
                alt="test"
              />
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
      {/* </div> */}
      <button onClick={handleClick}>Gen Image</button>
      <h3>Results:</h3>
      <img
        src={resultUrl}
        style={{
          border: "10px solid red"
        }}
        alt=""
      />
    </div>
  );
}
