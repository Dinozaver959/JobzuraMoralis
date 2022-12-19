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
  console.log(req.files)


  //------------------------------------------------------------------------------------------------
  //                           Authentication of the received data
  //------------------------------------------------------------------------------------------------

  const address = DOMPurify.sanitize(req.body.address[0].toString());
  const seller = ValidateAndReturnMessage(address, req.body.message_seller[0].toString(), req.body.signature_seller[0].toString()).toLowerCase();
  const jobId = ValidateAndReturnMessage(address, req.body.message_jobId[0].toString(), req.body.signature_jobId[0].toString()).toLowerCase();


  if(AnyEmpty([seller, jobId])){
    res.status(420).end("not all signatures are valid");
  }


  // check that the address is associated with the original address (seller)
  console.log("address.toLowerCase():")
  console.log(address.toLowerCase());
  
  const walletAssociatedWithAliasInDB = await GetWalletFromAlias(address.toLowerCase());                                                                        // check Alias
  console.log(`walletAssociatedWithAliasInDB:`);
  console.log(walletAssociatedWithAliasInDB);

  // if not - terminate
  if(walletAssociatedWithAliasInDB != seller){
    res.status(421).end("signatures are not from an Alias associated with this seller");
  }


  //------------------------------------------------------------------------------------------------
  //                                     The main part
  //------------------------------------------------------------------------------------------------

  console.log(`seller: ${seller}`)
  console.log(`jobId: ${jobId}`)


  await DeleteJobFromFirebaseDB(jobId);

  res.status(201).end("job created");
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apiRoute



async function DeleteJobFromFirebaseDB(jobId){
  console.log("DeleteJobFromFirebaseDB...");
  await admin.firestore().collection('jobs').doc(jobId).delete();
}

