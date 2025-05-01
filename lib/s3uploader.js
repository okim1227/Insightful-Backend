const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,     // personal account (free), stored in .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // also stored in .env
});

const BUCKET = process.env.AWS_BUCKET_NAME; 

async function uploadScreenshot(base64Image, employeeId) {
  const buffer = Buffer.from(base64Image, 'base64');
  const key = `${employeeId}/${uuidv4()}.png`;

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  };

  await s3.upload(params).promise();
  return key;
}

module.exports = { uploadScreenshot };
