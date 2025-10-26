import admin from "firebase-admin";

if (!process.env.FIREBASE_ADMIN_SDK_CONFIG) {
  throw new Error(
    "A variável de ambiente FIREBASE_ADMIN_SDK_CONFIG não está definida."
  );
}

const serviceAccountConfig = JSON.parse(
  process.env.FIREBASE_ADMIN_SDK_CONFIG as string
);

// Inicializa o app do Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig),
  });
}

export default admin;
