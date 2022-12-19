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
  const userWallet = ValidateAndReturnMessage(address, req.body.message_userWallet[0].toString(), req.body.signature_userWallet[0].toString()).toLowerCase();  
  const contractID = ValidateAndReturnMessage(address, req.body.message_contractID[0].toString(), req.body.signature_contractID[0].toString());
  const reviewStatus = ValidateAndReturnMessage(address, req.body.message_reviewStatus[0].toString(), req.body.signature_reviewStatus[0].toString());
  const action = ValidateAndReturnMessage(address, req.body.message_action[0].toString(), req.body.signature_action[0].toString());
  const toSeller = ValidateAndReturnMessage(address, req.body.message_toSeller[0].toString(), req.body.signature_toSeller[0].toString());



  if(AnyEmpty([userWallet, contractID, reviewStatus, action, toSeller])){
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
  console.log(`contractID: ${contractID}`)
  console.log(`reviewStatus: ${reviewStatus}`)
  console.log(`action: ${action}`)
  console.log(`toSeller: ${toSeller}`)


  await UpdateReviewLikedDisliked(userWallet, contractID, reviewStatus, action, toSeller)
  console.log("UpdateReviewLikedDisliked - DONE");

  res.status(201).json({ message: 'Rating Created' })
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute




async function UpdateReviewLikedDisliked(userWallet, contractId, reviewStatus, action, toSeller){

  console.log("UpdateReviewLikedDisliked...");
  

  if(toSeller == "true"){

    var reviewRef = admin.firestore().collection('reviewsToSellers').doc(contractId);

    const doc = await reviewRef.get();
    if (!doc.exists) {
      console.log('No such document (review) exists!');

    } else {
      console.log('document exists - updating review!');

      if(reviewStatus == "like"){

        if(action == "select"){
          await reviewRef.update({Likes : admin.firestore.FieldValue.increment(1)});
          await reviewRef.update({LikesBy : admin.firestore.FieldValue.arrayUnion(userWallet)});
        } else {
          await reviewRef.update({Likes : admin.firestore.FieldValue.increment(-1)});
          await reviewRef.update({LikesBy : admin.firestore.FieldValue.arrayRemove(userWallet)});        
        }

      } else {

        if(action == "select"){
          await reviewRef.update({Dislikes : admin.firestore.FieldValue.increment(1)});
          await reviewRef.update({DislikesBy : admin.firestore.FieldValue.arrayUnion(userWallet)});
        } else {
          await reviewRef.update({Dislikes : admin.firestore.FieldValue.increment(-1)});
          await reviewRef.update({DislikesBy : admin.firestore.FieldValue.arrayRemove(userWallet)});        
        }
      }
    }


  } else {

    var reviewRef = admin.firestore().collection('reviewsToBuyers').doc(contractId);

    const doc = await reviewRef.get();
    if (!doc.exists) {
      console.log('No such document (review) exists!');

    } else {
      console.log('document exists - updating review!');

      if(reviewStatus == "like"){

        if(action == "select"){
          await reviewRef.update({Likes : admin.firestore.FieldValue.increment(1)});
          await reviewRef.update({LikesBy : admin.firestore.FieldValue.arrayUnion(userWallet)});
        } else {
          await reviewRef.update({Likes : admin.firestore.FieldValue.increment(-1)});
          await reviewRef.update({LikesBy : admin.firestore.FieldValue.arrayRemove(userWallet)});        
        }

      } else {

        if(action == "select"){
          await reviewRef.update({Dislikes : admin.firestore.FieldValue.increment(1)});
          await reviewRef.update({DislikesBy : admin.firestore.FieldValue.arrayUnion(userWallet)});
        } else {
          await reviewRef.update({Dislikes : admin.firestore.FieldValue.increment(-1)});
          await reviewRef.update({DislikesBy : admin.firestore.FieldValue.arrayRemove(userWallet)});        
        }
      }
    }
    
  }
}