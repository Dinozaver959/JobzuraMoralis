import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import admin from "../../../../_firebase-admin"
import {ParsePathGiveParameter} from "../../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  const UserWallet = ParsePathGiveParameter(req.url);
  if(UserWallet == -1){res.end()}

  const notifications = await GetUserNotifications(UserWallet.toLowerCase());

  var packagedNotifications = []
  
  for(let i = 0; i < notifications.length; i++){
    packagedNotifications.push({id: i+1, name : notifications[i]})
  }

  res.end(JSON.stringify(packagedNotifications, null, 3));
  
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute


async function GetUserNotifications(userWallet){
  // const res = await admin.firestore().collection('notifications').doc(userWallet).collection(userWallet).get()   // get all user's notifications
  const res = await admin.firestore().collection('notifications').doc(userWallet).collection(userWallet).where("Read", "==", "no").get()      // get user notifications that haven't been read yet
  const list = res.docs.map(doc => doc.data());
  return list;
}