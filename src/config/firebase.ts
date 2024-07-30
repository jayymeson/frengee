import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = process.env.SERVICE_ACCOUNT;

if (!serviceAccount) {
  throw new Error("SERVICE_ACCOUNT environment variable is not defined");
}

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(serviceAccount) as admin.ServiceAccount
  ),
  storageBucket: "frengee-3bef2.appspot.com",
});

export default admin;
