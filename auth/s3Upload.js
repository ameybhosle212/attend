require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
const s3 = new S3({
    region:process.env.AWS_BUCKET_REGION,
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY
})


// upload image to s3 
exports.uploadFile = (file)=>{
    const fileStream = fs.createReadStream(file.path)
    const UploadParams = {
        Bucket : process.env.AWS_BUCKET_NAME,
        Body:fileStream,
        Key:file.filename
    }
    return s3.upload(UploadParams).promise()
}

// download image to s3 
exports.downloadImage = (file)=>{
    const downloadParams = {
        Key : file,
        Bucket:process.env.AWS_BUCKET_NAME
    }
    return s3.getObject(downloadParams).createReadStream()
}