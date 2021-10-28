const COLUMNS = {
  WIDHT: "WIDTH",
  HEIGHT: "HEIGHT"
};

export const IMAGE_IN_RAW = {
  WIDTH: 1170,
  HEIGHT: 780
};

export const CROP_SIZE = {
  WIDTH: 300,
  HEIGHT: 300
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
      return newImageHeight > CROP_SIZE.HEIGHT ? COLUMNS.HEIGHT : COLUMNS.WIDHT;
    } else {
      return newImageWidth > CROP_SIZE.WIDTH ? COLUMNS.WIDHT : COLUMNS.HEIGHT;
    }
  } else {
    if (imageRatio >= 1) {
      return newImageHeight > CROP_SIZE.HEIGHT ? COLUMNS.HEIGHT : COLUMNS.WIDHT;
    } else {
      return newImageWidth > CROP_SIZE.WIDTH ? COLUMNS.WIDHT : COLUMNS.HEIGHT;
    }
  }
};

const COLUMN = getColumnUsed();

const CROP_ZOOM_LEVEL = IMAGE_IN_RAW[COLUMN] / CROP_SIZE[COLUMN];

export const DEFAULT_IMAGE_ZOOM_LEVEL =
  CROP_SIZE[COLUMN] / IMAGE_IN_RAW[COLUMN];

const CROP_SIZE_IN_RAW = {
  WIDTH:
    COLUMN === COLUMNS.WIDHT
      ? IMAGE_IN_RAW.WIDTH
      : Math.round(CROP_SIZE.WIDTH * CROP_ZOOM_LEVEL),
  HEIGHT:
    COLUMN === COLUMNS.HEIGHT
      ? IMAGE_IN_RAW.HEIGHT
      : Math.round(CROP_SIZE.WIDTH * CROP_ZOOM_LEVEL)
};

const IMAGE = {
  WIDTH:
    COLUMN === COLUMNS.WIDHT
      ? CROP_SIZE.WIDTH
      : Math.round(IMAGE_IN_RAW.WIDTH * DEFAULT_IMAGE_ZOOM_LEVEL),
  HEIGHT:
    COLUMN === COLUMNS.HEIGHT
      ? CROP_SIZE.HEIGHT
      : Math.round(IMAGE_IN_RAW.HEIGHT * DEFAULT_IMAGE_ZOOM_LEVEL)
};

const toRawScale = (a, b) => {
  const aInRaw = Math.round((a / CROP_SIZE.WIDTH) * IMAGE_IN_RAW.WIDTH);
  const bInRaw = Math.round((b / CROP_SIZE.HEIGHT) * IMAGE_IN_RAW.HEIGHT);

  return [aInRaw, bInRaw];
};

const isClipTop = (posY) => {
  return posY < 0;
};

const isClipLeft = (posX) => {
  return posX < 0;
};

const isClipRight = (posX) => {
  return IMAGE.WIDTH + posX > CROP_SIZE.WIDTH;
};

const isClipBottom = (posY) => {
  return IMAGE.HEIGHT + posY > CROP_SIZE.HEIGHT;
};

const getClipSize = (posX, posY) => {
  let clipWidth = 0;
  let clipHeight = 0;

  const _posX = Math.abs(posX);
  const _posY = Math.abs(posY);

  if (isClipLeft(posX)) {
    if (isClipRight(posX)) {
      clipWidth = _posX + (CROP_SIZE.WIDTH - IMAGE.WIDTH - _posX);
    } else {
      clipWidth = _posX;
    }
  } else {
    if (isClipRight(posX)) {
      clipWidth = IMAGE.WIDTH + _posX - CROP_SIZE.WIDTH;
    } else {
      clipWidth = 0;
    }
  }

  if (isClipTop(posY)) {
    if (isClipBottom(posY)) {
      clipHeight = _posY + (CROP_SIZE.HEIGHT - IMAGE.HEIGHT - _posY);
    } else {
      clipHeight = _posY;
    }
  } else {
    if (isClipBottom(posY)) {
      clipHeight = IMAGE.HEIGHT + _posY - CROP_SIZE.HEIGHT;
    } else {
      clipHeight = 0;
    }
  }

  return [clipWidth, clipHeight];
};

export const calSize = (posX, posY) => {
  let width = IMAGE.WIDTH;
  let height = IMAGE.HEIGHT;

  const [clipWidth, clipHeight] = getClipSize(posX, posY);

  width = Math.round(IMAGE.WIDTH - clipWidth);
  height = Math.round(IMAGE.HEIGHT - clipHeight);

  return [width, height];
};

export const calCropSize = (posX, posY) => {
  const [clipWidth, clipHeight] = getClipSize(posX, posY);
  const [clipWidthInRaw, clipHeightInRaw] = toRawScale(clipWidth, clipHeight);

  const spaceWidth = IMAGE_IN_RAW.WIDTH - clipWidthInRaw;
  const spaceHeight = IMAGE_IN_RAW.HEIGHT - clipHeightInRaw;

  return [spaceWidth, spaceHeight];
};

export const calOffset = (posX, posY) => {
  const x = posX < 0 ? Math.abs(posX) : 0;
  const y = posY < 0 ? Math.abs(posY) : 0;

  return [x, y];
};

export const calOffsetInRaw = (posX, posY) => {
  const [x, y] = calOffset(posX, posY);
  const [xInRaw, yInRaw] = toRawScale(x, y);

  return [xInRaw, yInRaw];
};

export const calPadding = (posX, posY) => {
  const _top = Math.round(posY);
  const _left = Math.round(posX);

  const top = _top < 0 ? 0 : _top;
  const left = _left < 0 ? 0 : _left;

  let right = 0;
  const leftAbs = Math.abs(_left);
  if (isClipLeft(posX)) {
    if (!isClipRight(posX)) {
      right = CROP_SIZE.WIDTH - IMAGE.WIDTH + leftAbs;
    }
  } else {
    if (!isClipRight(posX)) {
      right = CROP_SIZE.WIDTH - IMAGE.WIDTH + leftAbs;
    }
  }

  let bottom = 0;
  const topAbs = Math.abs(_top);
  if (isClipTop(posY)) {
    if (!isClipBottom(posY)) {
      bottom = CROP_SIZE.HEIGHT - IMAGE.HEIGHT + topAbs;
    }
  } else {
    if (!isClipBottom(posY)) {
      bottom = CROP_SIZE.HEIGHT - IMAGE.HEIGHT - topAbs;
    }
  }

  return [top, right, bottom, left];
};
