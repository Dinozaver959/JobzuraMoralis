import admin from "../../_firebase-admin"


export async function GetWalletFromAlias(alias){
  const res = await admin.firestore().collection('aliases').doc(alias).get();
  return res['_fieldsProto'].WalletAddress.stringValue;
}