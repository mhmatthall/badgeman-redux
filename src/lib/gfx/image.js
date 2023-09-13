import { generate } from "../auth/secret";

const { createCanvas, loadImage } = require("canvas");
const qr = require("qrcode");

const WLAN_SSID = "Badge City";
const HOST_IP_ADDRESS = "192.168.69.1";
const HOST_PORT = "3000";

export async function generateBlankBadge(badgeId) {
  // Create base canvas and context
  const cv = createCanvas(296, 128);
  const ctx = cv.getContext("2d");

  // Generate secret to display
  const secret = generate(badgeId);

  // Grab base blank badge template image
  const baseImg = await loadImage(
    `http://${HOST_IP_ADDRESS}:${HOST_PORT}/img/badge_template_blank.png`
  );

  // Generate QR code dataUrl (default size is 132x132px -- 100x100px QR with 16px border)
  const qrCode = await qr.toDataURL(`http://${HOST_IP_ADDRESS}:${HOST_PORT}`);

  // Load as image
  const qrCodeImg = await loadImage(qrCode);

  // ADD BADGE CONTENT
  // Draw base image on canvas
  ctx.drawImage(baseImg, 0, 0, 296, 128);

  // Draw QR code image on canvas
  ctx.drawImage(qrCodeImg, 16, 16, 100, 100, 113, 51, 70, 70);

  // Set text style
  ctx.textAlign = "center";
  ctx.font = 'bold 16px "Fira Code"';

  // I'm using few variables here to reduce the line count of this text draw
  // Insert SSID text
  if (ctx.measureText(WLAN_SSID).width > 55) {
    // If name is too long, split over two lines at first whitespace
    const ssidText = WLAN_SSID.split(/ (.*)/s);
    ctx.fillText(ssidText[0], 51, 94);
    ctx.fillText(ssidText[1], 51, 112);
  } else {
    // Name fits on one line, don't change
    ctx.fillText(WLAN_SSID, 51, 94);
  }

  // Insert badge secret text
  ctx.fillText(secret, 245, 113);

  ctx.font = 'bold 18px "Fira Code"';

  // Insert badge ID text
  ctx.fillText(badgeId, 260, 69);

  // Apply pre-processing for badge display
  const outputImage = await preProcess(cv, ctx);

  return outputImage;
}

export async function generateCompleteBadge(badgeData) {
  // Create base canvas and context
  const cv = createCanvas(296, 128);
  const ctx = cv.getContext("2d");

  // Grab base badge template image
  const baseImg = await loadImage(
    `http://${HOST_IP_ADDRESS}:${HOST_PORT}/img/badge_template_full.png`
  );

  // ADD BADGE CONTENT
  // Draw base image on canvas
  ctx.drawImage(baseImg, 0, 0, 296, 128);

  // Bigger name font size
  ctx.font = `36px "Inter"`;

  // Check width to make sure it hasn't spilt
  if (ctx.measureText(badgeData.name).width <= 270) {
    // Name fits on one line at 36px, draw
    ctx.fillText(badgeData.name, 22, 36);
  } else {
    // Smaller name font size
    ctx.font = `24px "Inter"`;

    // Check width to make sure it hasn't spilt onto profile image
    if (ctx.measureText(badgeData.name).width <= 270) {
      // Name fits on one line at 24px, draw
      ctx.fillText(badgeData.name, 22, 28);
    } else {
      // If name is still too long, split over two lines at first whitespace
      const nameArr = badgeData.name.split(/ (.*)/s);
      ctx.fillText(nameArr[0], 22, 28);
      ctx.fillText(nameArr[1], 22, 54);
    }
  }

  ctx.font = `bold 18px "Inter"`;
  ctx.fillText(badgeData.pronouns, 22, 76);

  ctx.font = `18px "Inter"`;
  ctx.fillText(badgeData.affiliation, 22, 96);

  ctx.font = `bold 18px "Inter"`;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(badgeData.message, 148, 122);

  // Apply pre-processing for badge display
  const outputImage = await preProcess(cv, ctx);

  return outputImage;
}

async function preProcess(cv, ctx) {
  // IMAGE PRE-PROCESSING FOR BADGE DISPLAY MODULE
  //    Uses lots of the rotation code written by Gustavo Carvalho for SO:
  //    https://stackoverflow.com/questions/16645801/

  // Copy current image state to temp var
  let originalImg = await loadImage(cv.toDataURL());

  // Save original width/height
  let cw = cv.width;
  let ch = cv.height;

  // Reset canvas layout to new dimensions
  cv.width = ch;
  cv.height = cw;
  cw = cv.width;
  ch = cv.height;
  ctx.save();

  // Translate and rotate canvas 90deg
  ctx.translate(cw, ch / cw);
  ctx.rotate(Math.PI / 2);

  // Draw the original image, now rotated
  ctx.drawImage(originalImg, 0, 0);
  ctx.restore();

  // Export the canvas as a raw array of pixels (RGBA)
  const rawImg = ctx.getImageData(0, 0, cv.width, cv.height).data;

  // Compress image as to not overwhelm badge memory
  return compress(rawImg);
}

/**
  Compress an image expressed as a raw array of RGBA values into a single hex string.

  @param {Array} rawImg A 1D array of integers in the format '[R0,G0,B0,A0,R1,G1,B1,A1,...]' where
  Rx, Gx, Bx, Ax are in the range '[0-256)'.
  
  @return {String} A string of hex chars of length '(rawImg / 16)'.
    
*/
function compress(rawImg) {
  // STEP 1: CONVERT TO BITSTRING WITH EFFECTIVE SIZE (WIDTH x HEIGHT) BYTES
  let pixels = [];

  // Take the average of the RGB colour values (ignoring A) and threshold to 0 or 1
  for (let i = 0; i < rawImg.length; i = i + 4) {
    let avgColour = (rawImg[i] + rawImg[i + 1] + rawImg[i + 2]) / 3;

    // Avg colours <128 get assigned white, >128 black
    avgColour < 128 ? pixels.push(0) : pixels.push(1);
  }

  let pixelsBin = pixels.join("");
  let pixelsHex = [];

  // STEP 2: CONVERT TO HEX CSV LIST WITH EFFECTIVE SIZE (WIDTH x HEIGHT) / 8 BYTES
  for (let i = 0; i < pixelsBin.length; i = i + 8) {
    // Read next 8 bits as a binary number, then convert to hex
    let hex = parseInt(pixelsBin.substring(i, i + 8), 2).toString(16);

    // Prepend 0 if hex value < 0xf to ensure two char representation (e.g. '0e' instead of 'e')
    if (hex.length == 1) {
      hex = "0" + hex;
    }

    // Push to array
    pixelsHex.push(hex);
  }

  // Condense hex array into a single string
  return pixelsHex.join("");
}
