const { S3 } = require('aws-sdk');
const AWS = require('aws-sdk');
const { join } = require('path');
const { promises: fsPromises } = require('fs');
const base64 = require('base-64');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env;

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
  });

const s3 = new AWS.S3();

exports.s3Uploadv2 = async (file, name, type) => {
    const s3 = new S3()

    if(type === 'docx'){

      // Save locally first
      const filePath = join(__dirname, `${name}.${type}`);
      await fsPromises.writeFile(filePath, file.buffer);

      // Read the file as a buffer
      const fileBuffer = await fsPromises.readFile(filePath);

      // Encode the file buffer to Base64
      const base64File = base64.encode(fileBuffer.toString('latin1'));

      const param = {
          Bucket: AWS_BUCKET_NAME,
          Key: `${type}/${name}.${type}`,
          Body: base64File
      }
      const uploadResponse = await s3.upload(param).promise();

      // Delete the local file after uploading
      await fsPromises.unlink(filePath);

      return uploadResponse

    }else{
      const param = {
        Bucket: AWS_BUCKET_NAME,
        Key: `${type}/${name}.${type}`,
        Body: file.buffer
      }
      return await s3.upload(param).promise();
    }
}

exports.readFileFromS3 = async (input) => {

  const filePath = input;
  try {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: filePath
    };

    const { Body } = await s3.getObject(params).promise();

    // Decode the Base64-encoded file
    const decodedFile = Buffer.from(Body.toString('latin1'), 'base64');

    // Extract the textual content from the DOCX file using docxtemplater
    const zip = new PizZip(decodedFile);
    const doc = new Docxtemplater(zip);
    doc.setData({}); // Set the data object if needed
    doc.render(); // Render the document
    const content = doc.getFullText();

    return {
      "message": "Success",
      "code": "000",
      "data": {
        "content":  content
      }
    }
  } catch (error) {
    console.log('Error reading file from S3:', error);
    throw error;
  }
}

exports.deleteFileFromS3 = async (input) => {
  const fileURL = input;
  try {
    for (let fileURL of input) {
      // Extract the key from the URL
      // The key includes the folder (docx or pdf) and the file name
      const key = fileURL.split('amazonaws.com/')[1];

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      };

      // Delete the file
      await s3.deleteObject(params).promise();
    }

    return {
      message: "Files deleted successfully",
      code: "000"
    };
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return {
      message: error.message,
      code: "001"
    };
  }
}

