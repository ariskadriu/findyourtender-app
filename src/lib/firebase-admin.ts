import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    adminApp = getApps()[0];
  }
  return adminApp;
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());
