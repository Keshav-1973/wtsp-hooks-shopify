import admin, { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const { FIREBASE_PROJECT_ID, SERVICE_KEY } = process.env;

const key = (): ServiceAccount | null => {
  if (SERVICE_KEY) {
    try {
      const serviceKey = JSON.parse(SERVICE_KEY);
      return {
        projectId: serviceKey?.project_id,
        clientEmail: serviceKey?.client_email,
        privateKey: serviceKey?.private_key,
      };
    } catch (error) {
      console.error(error, "key parse error");
      return null;
    }
  } else {
    return null;
  }
};

const credentials = key();

if (credentials) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: FIREBASE_PROJECT_ID,
  });
}

export { admin as fireStoreAdmin };
export const fireStoreDb = admin.firestore();
