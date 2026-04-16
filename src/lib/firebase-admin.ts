import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length === 0) {
    try {
      const keyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}';
      const serviceAccount = JSON.parse(keyString);
      
      if (!serviceAccount.project_id) {
        adminApp = initializeApp({ projectId: 'dummy-project-id' });
      } else {
        adminApp = initializeApp({ credential: cert(serviceAccount) });
      }
    } catch (error) {
      adminApp = initializeApp({ projectId: 'dummy-project-id' });
    }
  } else {
    adminApp = getApps()[0];
  }
  return adminApp;
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());
