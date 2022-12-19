import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import {ParsePathGiveParameter} from "../../../../JS/BackendFunctions";
import admin from "../../../../_firebase-admin"


const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const UserWallet = ParsePathGiveParameter(req.url);
  if(UserWallet == -1){res.end()}

  console.log("UserWallet: " + UserWallet);
  const jobs = await GetUserSellerReviews(UserWallet.toLowerCase());

  var packagedReviews = []
  //console.log("jobs.length: " + jobs.length);
  
  for(let i = 0; i < jobs.length; i++){
    packagedReviews.push({id: i+1, name : jobs[i]})
      //console.log("jobs[i]: " + jobs[i]);
  }

  res.end(JSON.stringify(packagedReviews, null, 3));
})
export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute





async function GetUserSellerReviews(userWallet) {
  const res = await admin.firestore().collection(`reviewsToSellers`).where('SellerWallet', '==', userWallet).get();
  return res.docs.map(doc => doc.data());
}