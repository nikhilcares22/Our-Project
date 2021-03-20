const multer = require('multer');
const AWS = require('aws-sdk');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: image.originalname,
    Body: file,
    ContentType: image.mimetype,
    ACL: 'public-read'
};
