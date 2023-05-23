const { S3 } = require('aws-sdk');
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;

exports.s3Uploadv2 = async (file) => {
    const s3 = new S3()
    const param = {
        Bucket: AWS_BUCKET_NAME,
        Key: `test/${file.originalname}`,
        Body: file.buffer
    }
    return await s3.upload(param).promise();
}