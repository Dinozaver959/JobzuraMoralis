import middleware from '../../../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
import { sha256 } from "js-sha256";
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
  const seller = ValidateAndReturnMessage(address, req.body.message_seller[0].toString(), req.body.signature_seller[0].toString()).toLowerCase();
  const jobId = ValidateAndReturnMessage(address, req.body.message_jobId[0].toString(), req.body.signature_jobId[0].toString()).toLowerCase();
  const title = ValidateAndReturnMessage(address, req.body.message_title[0].toString(), req.body.signature_title[0].toString());
  const description = ValidateAndReturnMessage(address, req.body.message_description[0].toString(), req.body.signature_description[0].toString());

  const price = ValidateAndReturnMessage(address, req.body.message_price[0].toString(), req.body.signature_price[0].toString());
  const currencyTicker = ValidateAndReturnMessage(address, req.body.message_currencyTicker[0].toString(), req.body.signature_currencyTicker[0].toString());  
  const descriptionBasic = ValidateAndReturnMessage(address, req.body.message_descriptionBasic[0].toString(), req.body.signature_descriptionBasic[0].toString());
  const timeToDeliver = ValidateAndReturnMessage(address, req.body.message_timeToDeliver[0].toString(), req.body.signature_timeToDeliver[0].toString());
  const customTimeToDeliver = ValidateAndReturnMessage(address, req.body.message_customTimeToDeliver[0].toString(), req.body.signature_customTimeToDeliver[0].toString());
  
  const priceStandard = ValidateAndReturnMessage(address, req.body.message_priceStandard[0].toString(), req.body.signature_priceStandard[0].toString());
  const currencyTickerStandard = ValidateAndReturnMessage(address, req.body.message_currencyTickerStandard[0].toString(), req.body.signature_currencyTickerStandard[0].toString());  
  const descriptionStandard = ValidateAndReturnMessage(address, req.body.message_descriptionStandard[0].toString(), req.body.signature_descriptionStandard[0].toString());
  const timeToDeliverStandard = ValidateAndReturnMessage(address, req.body.message_timeToDeliverStandard[0].toString(), req.body.signature_timeToDeliverStandard[0].toString());
  const customTimeToDeliverStandard = ValidateAndReturnMessage(address, req.body.message_customTimeToDeliverStandard[0].toString(), req.body.signature_customTimeToDeliverStandard[0].toString());

  const pricePremium = ValidateAndReturnMessage(address, req.body.message_pricePremium[0].toString(), req.body.signature_pricePremium[0].toString());
  const currencyTickerPremium = ValidateAndReturnMessage(address, req.body.message_currencyTickerPremium[0].toString(), req.body.signature_currencyTickerPremium[0].toString());  
  const descriptionPremium = ValidateAndReturnMessage(address, req.body.message_descriptionPremium[0].toString(), req.body.signature_descriptionPremium[0].toString());
  const timeToDeliverPremium = ValidateAndReturnMessage(address, req.body.message_timeToDeliverPremium[0].toString(), req.body.signature_timeToDeliverPremium[0].toString());
  const customTimeToDeliverPremium = ValidateAndReturnMessage(address, req.body.message_customTimeToDeliverPremium[0].toString(), req.body.signature_customTimeToDeliverPremium[0].toString());

  const category = ValidateAndReturnMessage(address, req.body.message_jobCategory[0].toString(), req.body.signature_jobCategory[0].toString());
  const skills = ValidateAndReturnMessage(address, req.body.message_jobSkills[0].toString(), req.body.signature_jobSkills[0].toString());

  if(AnyEmpty([seller, title, price, description, currencyTicker, category, skills, timeToDeliver])){
    res.status(420).end("not all signatures are valid");
  }


  // check that the address is associated with the original address (seller)
  console.log("address.toLowerCase():")
  console.log(address.toLowerCase());
  
  /*const walletAssociatedWithAliasInDB = await GetWalletFromAlias(address.toLowerCase());                                                                        // check Alias
  console.log(`walletAssociatedWithAliasInDB:`);
  console.log(walletAssociatedWithAliasInDB);

  // if not - terminate
  if(walletAssociatedWithAliasInDB != seller){
    res.status(421).end("signatures are not from an Alias associated with this seller");
  }*/


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------

  console.log(`seller: ${seller}`)
  console.log(`jobId: ${jobId}`)
  console.log(`title: ${title}`)
  console.log(`description: ${description}`)

  console.log(`descriptionBasic: ${descriptionBasic}`)
  console.log(`currencyTicker: ${currencyTicker}`)
  console.log(`price: ${price}`)
  console.log(`timeToDeliver: ${timeToDeliver}`)
 
  console.log(`descriptionStandard: ${descriptionStandard}`)
  console.log(`currencyTickerStandard: ${currencyTickerStandard}`)
  console.log(`priceStandard: ${priceStandard}`)
  console.log(`timeToDeliverStandard: ${timeToDeliverStandard}`)
 
  console.log(`descriptionPremium: ${descriptionPremium}`)
  console.log(`currencyTickerPremium: ${currencyTickerPremium}`)
  console.log(`pricePremium: ${pricePremium}`)
  console.log(`timeToDeliverPremium: ${timeToDeliverPremium}`)
 
  console.log(`category: ${category}`)
  console.log(`skills: ${skills}`)

  

  var images = [];
  if(req.files.hasOwnProperty('file0')){
    images.push(req.files.file0[0])
  }
  if(req.files.hasOwnProperty('file1')){
    images.push(req.files.file1[0])
  }
  if(req.files.hasOwnProperty('file2')){
    images.push(req.files.file2[0])
  }
  if(req.files.hasOwnProperty('file3')){
    images.push(req.files.file3[0])
  }
  if(req.files.hasOwnProperty('file4')){
    images.push(req.files.file4[0])
  }

  console.log("images:")
  console.log(images) // all images

  var imageLinks = [];

  for (let i = 0; i < images.length; i++) {
    //const fileName = images[i].originalFilename.replace(/\s/g, '');   // remove empty space
    const imageLink = await UploadImageToDigitalOcean(images[i].path)

    if(imageLink == ""){
      return res.status(500).send("Error uploading file");
    }

    console.log("link to the file on DO:")
    console.log(imageLink)
    imageLinks.push(imageLink)
  }

  await SaveJobToFirebaseDB(category, imageLinks, seller, skills, description, descriptionBasic, currencyTicker, price, timeToDeliver, customTimeToDeliver, descriptionStandard, currencyTickerStandard, priceStandard, timeToDeliverStandard, customTimeToDeliverStandard, descriptionPremium, currencyTickerPremium, pricePremium, timeToDeliverPremium, customTimeToDeliverPremium, title, jobId);

  res.status(201).end("job created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



async function SaveJobToFirebaseDB(category, imageLinks, seller, skills, description, descriptionBasic, currencyTicker, price, timeToDeliver, customTimeToDeliver, descriptionStandard, currencyTickerStandard, priceStandard, timeToDeliverStandard, customTimeToDeliverStandard, descriptionPremium, currencyTickerPremium, pricePremium, timeToDeliverPremium, customTimeToDeliverPremium, title, jobId){

  console.log("SaveJobToFirebaseDB...");


  if(jobId == ""){

    const epoch = new Date().getTime().toString();

    const aJob = {
      SellerWallet: seller,
      Title: title,
      /// HashOfDescription: sha256(description),
      Category: category,
      Skills: skills,
      Created: new Date(),
      LastChanged: new Date(),
      Description: description,

      DescriptionBasic: descriptionBasic,
      HashOfDescriptionBasic: sha256(descriptionBasic),
      CurrencyTicker: currencyTicker,
      Price: price,
      TimeToDeliver: timeToDeliver,
      CustomTimeToDeliver: customTimeToDeliver,

      DescriptionStandard: descriptionStandard,
      HashOfDescriptionStandard: sha256(descriptionStandard),
      CurrencyTickerStandard: currencyTickerStandard,
      PriceStandard: priceStandard,
      TimeToDeliverStandard: timeToDeliverStandard,
      CustomTimeToDeliverStandard: customTimeToDeliverStandard,

      DescriptionPremium: descriptionPremium,
      HashOfDescriptionPremium: sha256(descriptionPremium),
      CurrencyTickerPremium: currencyTickerPremium,
      PricePremium: pricePremium,
      TimeToDeliverPremium: timeToDeliverPremium,
      CustomTimeToDeliverPremium: customTimeToDeliverPremium,

      ImageLinks: imageLinks,
      RatingsSum: 0,
      RatingsCounter: 0,
      State: "active",
      //id_: epoch,
      //index: epoch,
      JobId: epoch,
    }

    // await admin.firestore().collection('uploads').doc('jobs').collection(seller).doc(epoch.toString()).set(aJob, { merge: false });
    await admin.firestore().collection('jobs').doc(epoch).set(aJob, { merge: false });

  } else {

    const aJob = {
      SellerWallet: seller,
      Title: title,
      //HashOfDescription: sha256(description),
      Category: category,
      Skills: skills,
      LastChanged: new Date(),
      Description: description,

      DescriptionBasic: descriptionBasic,
      HashOfDescriptionBasic: sha256(descriptionBasic),
      CurrencyTicker: currencyTicker,
      Price: price,
      TimeToDeliver: timeToDeliver,
      CustomTimeToDeliver: customTimeToDeliver,

      DescriptionStandard: descriptionStandard,
      HashOfDescriptionStandard: sha256(descriptionStandard),
      CurrencyTickerStandard: currencyTickerStandard,
      PriceStandard: priceStandard,
      TimeToDeliverStandard: timeToDeliverStandard,
      CustomTimeToDeliverStandard: customTimeToDeliverStandard,

      DescriptionPremium: descriptionPremium,
      HashOfDescriptionPremium: sha256(descriptionPremium),
      CurrencyTickerPremium: currencyTickerPremium,
      PricePremium: pricePremium,
      TimeToDeliverPremium: timeToDeliverPremium,
      CustomTimeToDeliverPremium: customTimeToDeliverPremium,

      ImageLinks: imageLinks,
    }

    await admin.firestore().collection('jobs').doc(jobId).set(aJob, { merge: true });
  }


}

