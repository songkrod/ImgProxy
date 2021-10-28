import "./styles.css";
import React, { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getImageUrl } from "./image";

import {
  calCropSize,
  calOffsetInRaw,
  calPadding,
  calSize,
  CROP_SIZE,
  IMAGE_IN_RAW,
  DEFAULT_IMAGE_ZOOM_LEVEL
} from "./version3";

const IMAGE_URL =
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80";

export default function App() {
  const transformWrapperRef = useRef(null);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [info, setInfo] = useState({});
  const [imageInfo, setImageInfo] = useState(IMAGE_IN_RAW);
  const [resultUrl, setResultUrl] = useState("");

  const onChangeButton = (reaction) => {
    reaction();
    console.log(transformWrapperRef.current.state);
    setTimeout(() => {
      setPosX(transformWrapperRef.current.state.positionX);
      setPosY(transformWrapperRef.current.state.positionY);
      setZoom(transformWrapperRef.current.state.scale);
    }, 300);
  };

  const onChange = (ReactZoomPanPinchRef) => {
    console.log("Ref", ReactZoomPanPinchRef.state);
    setInfo(ReactZoomPanPinchRef.state);
    setPosX(ReactZoomPanPinchRef.state.positionX);
    setPosY(ReactZoomPanPinchRef.state.positionY);
    setZoom(ReactZoomPanPinchRef.state.scale);
  };

  useEffect(() => {
    const width = IMAGE_IN_RAW.WIDTH * DEFAULT_IMAGE_ZOOM_LEVEL;
    const height = IMAGE_IN_RAW.HEIGHT * DEFAULT_IMAGE_ZOOM_LEVEL;

    console.log(DEFAULT_IMAGE_ZOOM_LEVEL, width, height);

    setImageInfo({
      WIDTH: width,
      HEIGHT: height
    });
  }, []);

  const handleClick = (event) => {
    const size = calSize(posX, posY);
    const crop = calCropSize(posX, posY);
    const padding = calPadding(posX, posY);
    const offset = calOffsetInRaw(posX, posY);

    setResultUrl(
      getImageUrl({
        imageUrl: IMAGE_URL,
        padding: padding,
        size: size,
        offset: offset,
        cropSize: crop
      })
    );
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
        onPanningStop={onChange}
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
                height: `${imageInfo.HEIGHT}px`,
                width: `${imageInfo.WIDTH}px`
              }}
            >
              <img
                style={{
                  height: `${imageInfo.HEIGHT}px`,
                  width: `${imageInfo.WIDTH}px`
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
      <h3>Actions:</h3>
      <pre>
        {JSON.stringify(
          {
            cropSize: calCropSize(posX, posY),
            size: calSize(posX, posY),
            padding: calPadding(posX, posY),
            offset: calOffsetInRaw(posX, posY)
          },
          null
        )}
      </pre>
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
