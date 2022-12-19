import middleware from '../../../../middleware/middleware'
import nextConnect from 'next-connect'
import admin from "../../../../_firebase-admin"
import {ParsePathGiveParameter} from "../../../../JS/BackendFunctions";

const apiRoute = nextConnect()
apiRoute.use(middleware)


apiRoute.get(async (req, res) => {     
  const UserWallet = ParsePathGiveParameter(req.url);
  if(UserWallet == -1){res.end()}

  const notificationsUnreadCounter = await GetUserNotificationsUnreadCounter(UserWallet.toLowerCase());


  res.end(JSON.stringify(notificationsUnreadCounter, null, 3));
  
})

export const config = {
  api: {
    bodyParser: false
  }
} 
export default apiRoute


async function GetUserNotificationsUnreadCounter(userWallet){
  const res = await admin.firestore().collection('notifications').doc(userWallet).get()
  return res['_fieldsProto'].Unread.integerValue;
}