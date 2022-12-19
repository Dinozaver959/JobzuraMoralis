import middleware from '../../../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
const fs = require("fs");
const AWS = require('aws-sdk');
var crypto = require("crypto");
import {GetWalletFromAlias} from '../../../../JS/auth/GetWalletFromAlias-Firebase';
import {ValidateAndReturnMessage, AnyEmpty} from "../../../../JS/auth/BackendValidation";
import admin from "../../../../_firebase-admin";
import {UploadImageToDigitalOcean} from "../../../../JS/uploadToDO";



const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log("--------------------------------")
  console.log(req.files)


  //------------------------------------------------------------------------------------------------
  //                           Authentication of the received data
  //------------------------------------------------------------------------------------------------

  const address = DOMPurify.sanitize(req.body.address[0].toString());

  const contractID = ValidateAndReturnMessage(address, req.body.message_contractID[0].toString(), req.body.signature_contractID[0].toString()).toLowerCase();
  const sender = ValidateAndReturnMessage(address, req.body.message_sender[0].toString(), req.body.signature_sender[0].toString()).toLowerCase();
  const receiver = ValidateAndReturnMessage(address, req.body.message_receiver[0].toString(), req.body.signature_receiver[0].toString()).toLowerCase();
  const message = ValidateAndReturnMessage(address, req.body.message_message[0].toString(), req.body.signature_message[0].toString());

  if(AnyEmpty([contractID, sender, receiver, message])){
    res.status(420).end("not all signatures are valid");
  }

  // check that the address is associated with the original address (seller)
  console.log("address.toLowerCase():")
  console.log(address.toLowerCase());
  
  const walletAssociatedWithAliasInDB = await GetWalletFromAlias(address.toLowerCase());                                                                        // check Alias
  console.log(`walletAssociatedWithAliasInDB:`);
  console.log(walletAssociatedWithAliasInDB);

  // if not - terminate
  if(walletAssociatedWithAliasInDB != sender){
    res.status(421).end("signatures are not from an Alias associated with this seller");
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------

  console.log(`contractID: ${contractID}`)
  console.log(`sender: ${sender}`)
  console.log(`receiver: ${receiver}`)
  console.log(`message: ${message}`)


  var images = [];
  if(req.files.hasOwnProperty('file0')){
    images.push(req.files.file0[0])
  }


  var imageLinks = [];

  for (let i = 0; i < images.length; i++) {
    //const fileName = images[i].originalFilename.replace(/\s/g, '');   // remove empty space
    const imageLink = await UploadImageToDigitalOcean(images[i].path);

    if(imageLink == ""){
      return res.status(500).send("Error uploading file");
    }

    console.log("link to the file on DO:")
    console.log(imageLink)
    imageLinks.push(imageLink)
  }




  await SaveMessageDisputeToFirebaseDB(contractID, sender, receiver, message, imageLinks);

  res.status(201).end("Message saved to DB");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute




async function SaveMessageDisputeToFirebaseDB(contractID, sender, receiver, message, imageLinks){

  console.log("SaveMessageDisputeToFirebaseDB...");

  const Message = {
    ContractID: contractID,
    MessageSender: sender,
    MessageReceiver: receiver,
    Message: message,
    ImageLinks: imageLinks,
    Created: new Date()
  }
  
  const epoch = new Date().getTime();
  await admin.firestore().collection('messagesDispute').doc(contractID).collection(contractID).doc(`${epoch}`).set(Message, { merge: false });

  console.log("SaveMessageDisputeToFirebaseDB  -  DONE");
}

