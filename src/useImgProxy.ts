import { useMemo, useState } from "react";
import { getImageUrl } from "./image";

type ISize = {
  WIDTH: number;
  HEIGHT: number;
};

export const useImgProxy = (
  imageOriginalSize: ISize,
  cropSize: ISize,
  imageCropSize: ISize
) => {
  const [zoomScale, setZoomScale] = useState<number>(1);

  const toZoomScale = (num: number): number => {
    return Math.floor(num * zoomScale);
  };

  const imageWithZoom = useMemo(() => {
    return {
      WIDTH: imageCropSize.WIDTH,
      HEIGHT: imageCropSize.HEIGHT
    };
  }, [imageCropSize, zoomScale]);

  function setZoom(zoom: number) {
    setZoomScale(zoom);
  }

  const toOriginalScale = (num: number): number => {
    return (num / cropSize.WIDTH) * imageOriginalSize.WIDTH;
  };

  const isClipTop = (posY: number): boolean => {
    return posY < 0;
  };

  const isClipLeft = (posX: number): boolean => {
    return posX < 0;
  };

  const isClipRight = (posX: number): boolean => {
    return toZoomScale(imageWithZoom.WIDTH + posX) > cropSize.WIDTH;
  };

  const isClipBottom = (posY: number): boolean => {
    return toZoomScale(imageWithZoom.HEIGHT + posY) > cropSize.HEIGHT;
  };

  const getClipLeft = (posX: number): number => {
    return isClipLeft(posX) ? Math.abs(posX) : 0;
  };

  const getClipTop = (posY: number): number => {
    return isClipTop(posY) ? Math.abs(posY) : 0;
  };

  const getClipRight = (posX: number): number => {
    let diff = 0;
    if (isClipLeft(posX)) {
      if (isClipRight(posX)) {
        diff = Math.abs(
          Math.abs(imageWithZoom.WIDTH - getClipLeft(posX)) - cropSize.WIDTH
        );
      } else {
        diff =
          Math.abs(imageWithZoom.WIDTH - getClipLeft(posX)) - cropSize.WIDTH;
      }
    } else {
      diff = imageWithZoom.WIDTH + posX - cropSize.WIDTH;
    }
    console.log("getClipLeft(posX)", getClipLeft(posX));
    console.log("diff ::", diff);
    return diff > 0 ? diff : 0;
  };

  const getClipBottom = (posY: number): number => {
    let diff = 0;
    if (isClipTop(posY)) {
      diff =
        Math.abs(imageWithZoom.HEIGHT - getClipTop(posY)) - cropSize.HEIGHT;
    } else {
      diff = imageWithZoom.HEIGHT + posY - cropSize.HEIGHT;
    }

    return diff > 0 ? diff : 0;
  };

  const getClipSize = (
    posX: number,
    posY: number
  ): [number, number, number, number] => {
    const clipLeft = getClipLeft(posX);
    const clipTop = getClipTop(posY);
    const clipRight = getClipRight(posX);
    const clipBottom = getClipBottom(posY);

    return [clipLeft, clipTop, clipRight, clipBottom];
  };

  const roundAll = (nums: number[]): number[] => {
    return nums.map((num) => Math.floor(num));
  };

  const calSize = (posX: number, posY: number): [number, number] => {
    const [clipLeft, clipTop, clipRight, clipBottom] = getClipSize(posX, posY);

    const width = toZoomScale(imageWithZoom.WIDTH) - clipLeft - clipRight;
    const height = toZoomScale(imageWithZoom.HEIGHT) - clipTop - clipBottom;

    return [width, height];
  };

  const calCropSize = (posX: number, posY: number): [number, number] => {
    const [clipLeft, clipTop, clipRight, clipBottom] = getClipSize(posX, posY);

    const clipLeftOrigin = toOriginalScale(clipLeft);
    const clipTopOrigin = toOriginalScale(clipTop);
    const clipRightOrigin = toOriginalScale(clipRight);
    const clipBottomOrigin = toOriginalScale(clipBottom);

    const spaceWidth =
      imageOriginalSize.WIDTH - clipLeftOrigin - clipRightOrigin;
    const spaceHeight =
      imageOriginalSize.HEIGHT - clipTopOrigin - clipBottomOrigin;

    return [spaceWidth, spaceHeight];
  };

  const calOffset = (posX: number, posY: number): [number, number] => {
    const x = posX < 0 ? Math.abs(posX) : 0;
    const y = posY < 0 ? Math.abs(posY) : 0;

    const xOrigin = toOriginalScale(x);
    const yOrigin = toOriginalScale(y);

    return [xOrigin, yOrigin];
  };

  const calPadding = (
    posX: number,
    posY: number,
    size: ISize
  ): [number, number, number, number] => {
    const top = posY < 0 ? 0 : posY;
    const left = posX < 0 ? 0 : posX;
    const right =
      size.WIDTH + left >= cropSize.WIDTH
        ? 0
        : cropSize.WIDTH - (size.WIDTH + left);
    const bottom =
      size.HEIGHT + top >= cropSize.HEIGHT
        ? 0
        : cropSize.HEIGHT - (size.HEIGHT + top);

    return [top, right, bottom, left];
  };

  const generateImageUrl = (
    imageUrl: string,
    xWithZoom: number,
    yWithZoom: number,
    zoom: number
  ): string => {
    const x = xWithZoom / zoom;
    const y = yWithZoom / zoom;

    setZoom(zoom);
    const size = roundAll(calSize(x, y));
    const cropSize = roundAll(calCropSize(x, y));
    const offset = roundAll(calOffset(x, y));
    const padding = roundAll(
      calPadding(x, y, {
        WIDTH: size[0],
        HEIGHT: size[1]
      })
    );

    return getImageUrl({
      imageUrl,
      size,
      cropSize,
      offset,
      padding
    });
  };

  return { generateImageUrl };
};
