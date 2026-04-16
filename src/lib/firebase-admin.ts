import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length === 0) {
    const keyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!keyString || keyString === '{}') {
      adminApp = initializeApp({ projectId: 'dummy' });
    } else {
      adminApp = initializeApp({
        credential: cert(JSON.parse(keyString)),
      });
    }
  } else {
    adminApp = getApps()[0];
  }
  return adminApp;
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());
