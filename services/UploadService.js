const multer = require('multer');
const AWS = require('aws-sdk');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const imageUpload = (buffer, name) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'profilePic' + '/' + Date.now() + name,
        Body: buffer,
        ACL: 'public-read',
        // ContentEncoding: 'base64', // required
        // ContentType: `image/${type}`
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

exports.upload = upload
exports.imageUpload = imageUpload