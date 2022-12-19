import middleware from '../../../../middleware/middleware.js'
import nextConnect from 'next-connect'
const DOMPurify = require('isomorphic-dompurify');
import {GetWalletFromAlias} from '../../../../JS/auth/GetWalletFromAlias-Firebase';
import {ValidateAndReturnMessage, AnyEmpty} from "../../../../JS/auth/BackendValidation";
import admin from "../../../../_firebase-admin";


const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.post(async (req, res) => {
  console.log(req.body)
  console.log("--------------------------------")


  //------------------------------------------------------------------------------------------------
  //                           Authentication of the received data
  //------------------------------------------------------------------------------------------------

  const address = DOMPurify.sanitize(req.body.address[0].toString());

  const userWallet = ValidateAndReturnMessage(address, req.body.message_UserWallet[0].toString(), req.body.signature_UserWallet[0].toString()).toLowerCase();
  const rating = ValidateAndReturnMessage(address, req.body.message_rating[0].toString(), req.body.signature_rating[0].toString());
  const review = ValidateAndReturnMessage(address, req.body.message_review[0].toString(), req.body.signature_review[0].toString());
  const privateReview = ValidateAndReturnMessage(address, req.body.message_privateReview[0].toString(), req.body.signature_privateReview[0].toString());
  const contractId = ValidateAndReturnMessage(address, req.body.message_contractID[0].toString(), req.body.signature_contractID[0].toString());
  const jobId = ValidateAndReturnMessage(address, req.body.message_jobID[0].toString(), req.body.signature_jobID[0].toString());
  const sellerWallet = ValidateAndReturnMessage(address, req.body.message_contractSeller[0].toString(), req.body.signature_contractSeller[0].toString());
  const buyerWallet = ValidateAndReturnMessage(address, req.body.message_contractBuyer[0].toString(), req.body.signature_contractBuyer[0].toString());
  //const like = ValidateAndReturnMessage(address, req.body.message_like[0].toString(), req.body.signature_like[0].toString());
  //const dislike = ValidateAndReturnMessage(address, req.body.message_dislike[0].toString(), req.body.signature_dislike[0].toString());

  // like and dislike can be empty - so don't include them below

  if(AnyEmpty([userWallet, rating, review, privateReview, contractId, jobId, sellerWallet, buyerWallet])){
    res.status(420).end("not all signatures are valid");
    return;
  }

  // check that the address is associated with the original address (seller)
  const walletAssociatedWithAliasInDB = await GetWalletFromAlias(address.toLowerCase());                                                                        // check Alias
  console.log(`walletAssociatedWithAliasInDB:`);
  console.log(walletAssociatedWithAliasInDB);

  // if not - terminate
  if(walletAssociatedWithAliasInDB != userWallet){
    res.status(421).end("signatures are not from an Alias associated with this seller");
    return;
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------


  console.log(`userWallet: ${userWallet}`)
  console.log(`rating: ${rating}`)
  console.log(`review: ${review}`)
  console.log(`privateReview: ${privateReview}`)
  console.log(`contractId: ${contractId}`)
  console.log(`jobId: ${jobId}`)
  console.log(`sellerWallet: ${sellerWallet}`)
  console.log(`buyerWallet: ${buyerWallet}`)
  //console.log(`like: ${like}`)
  //console.log(`dislike: ${dislike}`)



  // TODO: add a check if this user is even eligible to give a reivew!!! -------------------------------------------------------------
  // smth...
  // check:   contract Seller and contract Buyer have to be the same as in the contractID and the userWallet has to be one of them
  const eligible = await CheckEligibility(res, userWallet, contractId, sellerWallet, buyerWallet);
  if(!eligible) throw "user not eligible";
  //if(!eligible){res.status(422).end("User is not eligible to give a review for this contract")}
  console.log("CheckEligibility - DONE");



  // working fine
  await SaveReviewToFirebaseDB(userWallet, rating, review, privateReview, contractId, sellerWallet, buyerWallet)
  console.log("SaveReviewToFirebaseDB - DONE");



  // TODO: add review to the Contract in DB
  await AppendReviewToContract(userWallet, rating, contractId, sellerWallet, buyerWallet);
  console.log("AppendReviewToContract - DONE");



  // TODO: needs to be adjusted
  await AppendReviewToJob(jobId, rating)
  console.log("AppendReviewToJob - DONE");



  res.status(201).json({ message: 'Rating Created' })
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



async function CheckEligibility(res, userWallet, contractId, sellerWallet, buyerWallet){

  const contract = (await admin.firestore().collection(`contracts`).doc(contractId).get())["_fieldsProto"]

  console.log("contract:")
  console.log(contract)
  console.log("---------------------------")

  // check that this person is eligible for giving a review
  if( contract.SellerWallet.stringValue != sellerWallet.toLowerCase() || 
      contract.BuyerWallet.stringValue != buyerWallet.toLowerCase() ||
      (
        sellerWallet.toLowerCase() != userWallet.toLowerCase() && 
        buyerWallet.toLowerCase() != userWallet.toLowerCase()
      )
  )
  {
    console.log("user not eligible to give a review");
    //return false;
    res.status(422).end("User is not eligible to give a review for this contract");
    return false;
  }


  // check that this person has not given a review yet
  if(sellerWallet.toLowerCase() == userWallet.toLowerCase()){
    if(contract.RatingForBuyer && contract.RatingForBuyer != null){
      res.status(423).end("User already gave the review");
      return false;
    }
  } else {
    if(contract.RatingForSeller && contract.RatingForSeller != null){
      res.status(423).end("User already gave the review");
      return false;
    }
  }

  return true;
}


async function SaveReviewToFirebaseDB(userWallet, rating, review, privateReview, contractId, sellerWallet, buyerWallet){

  console.log("SaveReviewToFirebaseDB...");

  const aReview = {
    UserWallet: userWallet, // not needed really...
    SellerWallet: sellerWallet,
    BuyerWallet: buyerWallet,    
    Review: review,
    PrivateReview: privateReview,
    Rating: rating,
    contractId: contractId,
    Created: new Date(),
    LastChanged: new Date(),    
  }

  if(userWallet.toLowerCase() == buyerWallet.toLowerCase()){
    //await admin.firestore().collection('reviews').doc('reviewsToSellers').collection(sellerWallet).doc(contractId).set(aReview, { merge: true });
    await admin.firestore().collection('reviewsToSellers').doc(contractId).set(aReview, { merge: true });
  }
  else {
    //await admin.firestore().collection('reviews').doc('reviewsToBuyers').collection(buyerWallet).doc(contractId).set(aReview, { merge: true });
    await admin.firestore().collection('reviewsToBuyers').doc(contractId).set(aReview, { merge: true });
  }
  

  /*     
  var aReview;

  if(userWallet.toLowerCase() == sellerWallet.toLowerCase()){
    aReview = {
      SellerWallet: sellerWallet,
      BuyerWallet: buyerWallet,    
      ReviewForBuyer: review,
      PrivateReviewForBuyer: privateReview,
      RatingForBuyer: rating,
      contractId: contractId,
      //Created: new Date(),
      LastChanged: new Date(),    
    }
  }
  else {
    aReview = {
      SellerWallet: sellerWallet,
      BuyerWallet: buyerWallet,    
      ReviewForSeller: review,
      PrivateReviewForSeller: privateReview,
      RatingForSeller: rating,
      contractId: contractId,
      //Created: new Date(),
      LastChanged: new Date(),    
    }
  }

  await admin.firestore().collection('reviews').doc(contractId).set(aReview, { merge: true });
  */
}


async function AppendReviewToContract(userWallet, rating, contractId, sellerWallet, buyerWallet){
  
  console.log("AppendReviewToContract...");

  var aReview;

  if(userWallet.toLowerCase() ==  sellerWallet.toLowerCase()){ // seller giving a review
    aReview = {
      RatingForBuyer: rating,
    }
  } else {
    aReview = {
      RatingForSeller: rating,
    }
  }

  await admin.firestore().collection('contracts').doc(contractId).set(aReview, { merge: true });
}


async function AppendReviewToJob(jobId, rating){

  console.log("AppendReviewToJob...");

  // can do the ratings in the Job like this:
  //    total score = sum of all ratings
  //    count of ratings = number of ratings given
  // then we can easily calculate the average rating at all times - scallable and efficient

  await admin.firestore().collection('jobs').doc(jobId).update({RatingsCounter : admin.firestore.FieldValue.increment(1)});
  await admin.firestore().collection('jobs').doc(jobId).update({RatingsSum : admin.firestore.FieldValue.increment(parseInt(rating))});

}