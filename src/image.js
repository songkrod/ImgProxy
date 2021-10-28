const createHmac = require("create-hmac");

const urlSafeBase64 = (string) => {
  return Buffer.from(string)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
const MAX_BYTES_3_MB = 1000000;

const hexDecode = (hex) => Buffer.from(hex, "hex");

const sign = (salt, target, secret) => {
  const hmac = createHmac("sha256", hexDecode(secret));
  hmac.update(hexDecode(salt));
  hmac.update(target);
  return urlSafeBase64(hmac.digest());
};

const KEY = `b5bed9c2d9e0b29275d572a40cb938fcc1f9d2bd598ed6737e3268f8bbcc7c5cd4d00dd79a7f98682ac98bd48c18eae162afea12cf52ff91f6b706f4e1cae1f7`;
const SALT = `a5ed15b8b76fe41ed101fe697977b915a86005b5fe30ef5471a13c77e8a0dfed6628a8928970c744a87ee7db46eeccaf5620efae3b6b387f4dae215dba104029`;

const signImageWithOptions = (imageUrl) => {
  let path = "w:3000/q:80/";

  const encoded_url = urlSafeBase64(imageUrl);
  const pathWithOptions = `/${path}${encoded_url}.jpg`;
  const signature = sign(SALT, pathWithOptions, KEY);
  const signatureImage = `https://imgproxy.droneinspect-qa.cloud.arv.co.th/${signature}${pathWithOptions}`;

  return signatureImage;
};

/**
 * size = [width, height]
 * offset = [x, y]
 * padding = [t, r, b, l]
 * cropSize = [width, height]
 */

export const getImageUrl = ({ imageUrl, padding, size, cropSize, offset }) => {
  // let options = "";

  const processSize = `rs:auto:${size.join(":")}:1:0:nowe:0:0/`;
  const processCrop = `c:${cropSize.join(":")}/g:nowe:${offset.join(":")}/`;
  const processPadding = `pd:${padding.join(":")}/bg:0:255:0/`;

  let options = `q:100/${processSize}${processCrop}${processPadding}`;

  const encoded_url = urlSafeBase64(imageUrl);
  const pathWithOptions = `/${options}${encoded_url}.jpg`;
  const signature = sign(SALT, pathWithOptions, KEY);
  const signatureImage = `https://imgproxy.droneinspect-qa.cloud.arv.co.th/${signature}${pathWithOptions}`;

  return signatureImage;
};
