import { IMAGE_INFO } from "./App";

export const CROP_SIZE = {
  WIDTH: 960 / 2,
  HEIGHT: 648 / 2
};

export const calSize = (posX, posY) => {
  const _posX = Math.abs(posX);
  const _posY = Math.abs(posY);

  const width = Math.round(CROP_SIZE.WIDTH - _posX);
  const height = Math.round(CROP_SIZE.HEIGHT - _posY);

  return [width, height];
};

export const calCropSize = (posX, posY) => {
  const xInRaw = Math.abs(
    Math.round((posX / CROP_SIZE.WIDTH) * IMAGE_INFO.WIDTH)
  );
  const yInRaw = Math.abs(
    Math.round((posY / CROP_SIZE.HEIGHT) * IMAGE_INFO.HEIGHT)
  );

  const spaceWidth = IMAGE_INFO.WIDTH - xInRaw;
  const spaceHeight = IMAGE_INFO.HEIGHT - yInRaw;

  return [spaceWidth, spaceHeight];
};

export const calOffset = (posX, posY) => {
  const x = posX < 0 ? Math.abs(posX) : 0;
  const y = posY < 0 ? Math.abs(posY) : 0;

  return [x, y];
};

export const calOffsetInRaw = (posX, posY) => {
  const [x, y] = calOffset(posX, posY);

  const xInRaw = Math.round((x / CROP_SIZE.WIDTH) * IMAGE_INFO.WIDTH);
  const yInRaw = Math.round((y / CROP_SIZE.HEIGHT) * IMAGE_INFO.HEIGHT);

  return [xInRaw, yInRaw];
};

export const calPadding = (posX, posY) => {
  const _top = Math.round(posY);
  const _left = Math.round(posX);

  const top = _top < 0 ? 0 : _top;
  const left = _left < 0 ? 0 : _left;

  const [right, bottom] = calOffset(posX, posY);

  return [top, right, bottom, left];
};
