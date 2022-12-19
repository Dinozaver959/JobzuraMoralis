const fs = require("fs");
const AWS = require('aws-sdk');
var crypto = require("crypto");


const DO_SPACES_ID="PMPSVLSBZWCFNIRNYBYM"
const DO_SPACES_SECRET="MRWAGMp+cj3b9ObGuq2EvHH235LjEEY+8+v6dlrjALc"
const DO_SPACES_URL="https://fra1.digitaloceanspaces.com"
const DO_SPACES_BUCKET="easylaunchnftdospace1"
const PUBLIC_URL="https://easylaunchnftdospace1.fra1.digitaloceanspaces.com"

const s3Client = new AWS.S3({
  endpoint: DO_SPACES_URL,
  region: "fra1",
  credentials: {
    accessKeyId: DO_SPACES_ID,
    secretAccessKey: DO_SPACES_SECRET
  }
});




export async function UploadImageToDigitalOcean(filePath){

  // get random string for key
  const ext = filePath.split(".");
  const fileName = crypto.randomBytes(20).toString('hex') + "." + ext[ext.length - 1];

  try {
    s3Client.putObject({ // await
    Bucket: DO_SPACES_BUCKET + "/Jobzura",
    Key: fileName,
    Body: fs.createReadStream(filePath),
    ACL: "public-read"
    }, (err, data) => {
      console.log(err)
      console.log(data)
      //console.log("saved file at server: " + fileName)
      //const imageLink = `https://easylaunchnftdospace1.fra1.digitaloceanspaces.com/Jobzura/${fileName}`;
      //return imageLink;
    }) //.promise();

    const imageLink = `https://easylaunchnftdospace1.fra1.digitaloceanspaces.com/Jobzura/${fileName}`;
    return imageLink;

  } catch {
    console.log(e);
    // res.status(500).send("Error uploading file");
    return "";
  } 
}