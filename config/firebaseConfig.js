import admin from "firebase-admin";
import { storageBucket } from "./config.js";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket,
});

export const bucket = admin.storage().bucket();
