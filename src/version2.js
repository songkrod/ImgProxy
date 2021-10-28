const IMAGE_IN_RAW = {
  WIDTH: 1170,
  HEIGHT: 780
};

export const CROP_SIZE = {
  WIDTH: 300,
  HEIGHT: 300
};

const isRatioByWidth = true;

export const DEFAULT_ZOOM = Math.min(
  CROP_SIZE.HEIGHT / IMAGE_IN_RAW.HEIGHT,
  CROP_SIZE.WIDTH / IMAGE_IN_RAW.WIDTH
);

const CROP_SIZE_IN_RAW = {
  WIDTH: IMAGE_IN_RAW.WIDTH,
  HEIGHT: Math.round((CROP_SIZE.HEIGHT / CROP_SIZE.WIDTH) * IMAGE_IN_RAW.WIDTH)
};

const IMAGE = {
  WIDTH: CROP_SIZE.WIDTH,
  HEIGHT: Math.round(
    (IMAGE_IN_RAW.HEIGHT / IMAGE_IN_RAW.WIDTH) * CROP_SIZE.WIDTH
  )
};

export const calSize = (posX, posY) => {
  const _posX = Math.abs(posX);
  const _posY = Math.abs(posY);

  const width = Math.round(IMAGE.WIDTH - _posX);
  const height = Math.round(IMAGE.HEIGHT - _posY);

  return [width, height];
};

export const calCropSize = (posX, posY) => {
  const xInRaw = Math.round((posX / CROP_SIZE.WIDTH) * IMAGE_IN_RAW.WIDTH);
  const xAbs = Math.abs(xInRaw);
  let clipWidth = 0;
  if (xAbs <= 0) {
    if (IMAGE_IN_RAW.WIDTH - xAbs < CROP_SIZE_IN_RAW.WIDTH) {
      clipWidth = xAbs;
    } else {
      clipWidth = xAbs + (CROP_SIZE_IN_RAW.WIDTH - IMAGE_IN_RAW.WIDTH - xAbs);
    }
  } else {
    if (IMAGE_IN_RAW.WIDTH + xAbs < CROP_SIZE_IN_RAW.WIDTH) {
      // ไม่ทะลุเลย ทั้งซ้าย ทั้งขวา
      clipWidth = 0;
    } else {
      clipWidth = IMAGE_IN_RAW.WIDTH + xAbs - CROP_SIZE_IN_RAW.WIDTH;
    }
  }

  const yInRaw = Math.round((posY / CROP_SIZE.HEIGHT) * IMAGE_IN_RAW.HEIGHT);
  const yAbs = Math.abs(yInRaw);
  let clipHeight = 0;
  if (yInRaw <= 0) {
    if (IMAGE_IN_RAW.HEIGHT - yAbs < CROP_SIZE_IN_RAW.HEIGHT) {
      clipHeight = yAbs;
    } else {
      clipHeight =
        yAbs + (CROP_SIZE_IN_RAW.HEIGHT - IMAGE_IN_RAW.HEIGHT - yAbs);
    }
  } else {
    if (IMAGE_IN_RAW.HEIGHT + yAbs < CROP_SIZE_IN_RAW.HEIGHT) {
      // ไม่ทะลุเลย ทั้งบน ทั้งล่าง
      clipHeight = 0;
    } else {
      clipHeight = IMAGE_IN_RAW.HEIGHT + yAbs - CROP_SIZE_IN_RAW.HEIGHT;
    }
  }

  const spaceWidth = IMAGE_IN_RAW.WIDTH - clipWidth;
  const spaceHeight = IMAGE_IN_RAW.HEIGHT - clipHeight;

  return [spaceWidth, spaceHeight];
};

export const calOffset = (posX, posY) => {
  const x = posX < 0 ? Math.abs(posX) : 0;
  const y = posY < 0 ? Math.abs(posY) : 0;

  return [x, y];
};

export const calOffsetInRaw = (posX, posY) => {
  const [x, y] = calOffset(posX, posY);

  const xInRaw = Math.round((x / CROP_SIZE.WIDTH) * IMAGE_IN_RAW.WIDTH);
  const yInRaw = Math.round((y / CROP_SIZE.HEIGHT) * IMAGE_IN_RAW.HEIGHT);

  return [xInRaw, yInRaw];
};

export const calPadding = (posX, posY) => {
  const _top = Math.round(posY);
  const _left = Math.round(posX);

  const top = _top < 0 ? 0 : _top;
  const left = _left < 0 ? 0 : _left;

  const diffWidht = Math.round(Math.abs(CROP_SIZE.WIDTH - IMAGE.WIDTH + _left));
  const diffHeight = Math.round(
    Math.abs(CROP_SIZE.HEIGHT - IMAGE.HEIGHT + _top)
  );

  let right = 0;
  if (left <= 0) {
    if (IMAGE.WIDTH + _left < CROP_SIZE.WIDTH) {
      right = CROP_SIZE.WIDTH - IMAGE.WIDTH - _left;
    }
  } else {
    if (IMAGE.WIDTH + _left < CROP_SIZE.WIDTH) {
      right = diffWidht;
    }
  }

  let bottom = 0;
  if (top <= 0) {
    if (IMAGE.HEIGHT + _top < CROP_SIZE.HEIGHT) {
      bottom = CROP_SIZE.HEIGHT - IMAGE.HEIGHT - _top;
    }
  } else {
    if (IMAGE.HEIGHT + _top < CROP_SIZE.HEIGHT) {
      bottom = diffHeight;
    }
  }

  return [top, right, bottom, left];
};
