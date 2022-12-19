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


  if(AnyEmpty([userWallet])){
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

  await ReadAllNotification(userWallet)
  console.log("ReadAllNotification - DONE");


  res.status(201).json({ message: 'All Notifications read' })
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



async function ReadAllNotification(userWallet){

  console.log("ReadAllNotification...");

  const notification = {
    Read: "yes",
  }
  

  const batch = admin.firestore().batch()

  admin.firestore().collection('notifications').doc(userWallet).collection(userWallet).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          const docRef = admin.firestore().collection('notifications').doc(userWallet).collection(userWallet).doc(doc.id)
          batch.update(docRef, { Read: "yes" })
      });

      batch.commit();
  });


  await admin.firestore().collection("notifications").doc(userWallet).set({ Unread: 0 }, {merge: true});
}