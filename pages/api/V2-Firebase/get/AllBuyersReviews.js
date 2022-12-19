import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import admin from "../../../../_firebase-admin"

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  console.log(req.body)

  const reviews = await GetAllBuyersReviews();
  console.log(reviews)

  var packagedJobs = []
  
  for(let i = 0; i < reviews.length; i++){
    packagedJobs.push({id: i+1, name : reviews[i]})
  }

  res.end(JSON.stringify(packagedJobs, null, 3));
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute



async function GetAllBuyersReviews() {
  const res = await admin.firestore().collection('reviewsToBuyers').get();
  const list = res.docs.map(doc => doc.data());

  console.log(list);
  return list;
}