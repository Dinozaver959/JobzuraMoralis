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
  const contractId = ValidateAndReturnMessage(address, req.body.message_contractID[0].toString(), req.body.signature_contractID[0].toString());
  const eventName = ValidateAndReturnMessage(address, req.body.message_eventName[0].toString(), req.body.signature_eventName[0].toString());


  if(AnyEmpty([userWallet, eventName, contractId])){
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
  console.log(`contractId: ${contractId}`)
  console.log(`eventName: ${eventName}`)


  // TODO: add a check if this user is even eligible to read!!! -------------------------------------------------------------
  const eligible = await CheckEligibility(userWallet, contractId, eventName);
  if(!eligible) throw "user not eligible";
  //if(!eligible){res.status(422).end("User is not eligible to give a review for this contract")}
  console.log("CheckEligibility - DONE");


  // TODO: needs to be adjusted
  await ReadNotification(userWallet, contractId, eventName)
  console.log("ReadNotification - DONE");


  res.status(201).json({ message: 'Notification read' })
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



async function CheckEligibility(res, userWallet, contractId, sellerWallet, buyerWallet){

  // TODO:...

  return true;
}


async function ReadNotification(userWallet, contractId, eventName){

  console.log("ReadNotification...");

  const notification = {
    Read: "yes",
  }

  const uniqueEvent = contractId + "_" + eventName.toString();

  await admin.firestore().collection('notifications').doc(userWallet).collection(userWallet).doc(uniqueEvent).set(notification, {merge: true});
  await admin.firestore().collection("notifications").doc(userWallet).set({ Unread: admin.firestore.FieldValue.increment(-1) }, {merge: true});
}