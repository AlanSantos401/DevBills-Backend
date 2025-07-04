import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = (): void => {
	if (admin.apps.length > 0) return;

	const { FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY } =
		env;

	if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY) {
		throw new Error("🚨 Falha ao iniciar o firebase - Faltando as credenciais");
	}

	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: FIREBASE_PROJECT_ID,
				clientEmail: FIREBASE_CLIENT_EMAIL,
				privateKey: FIREBASE_PRIVATE_KEY,
			}),
		});
	} catch (err) {
		console.error("🚨 Falha ao conectar o firebase - ", err);
		process.exit(1);
	}
};

export default initializeFirebaseAdmin;
