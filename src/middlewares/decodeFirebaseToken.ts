import { Request, Response, NextFunction } from "express";
import admin from "../lib/firebaseAdmin";
//import { DecodedIdToken } from "firebase-admin/auth";

/*//Token pra testar em DEV no Postman
const DEV_TEST_TOKEN = "SUPER_SECRET_TOKEN_FOR_POSTMAN";*/

export const decodeFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token de autorização ausente ou mal formatado." });
  }

  const idToken = authHeader.split("Bearer ")[1];

/*  // Atalho pra testar no Postman em DEV
  if (idToken === DEV_TEST_TOKEN) {
    console.log("[AUTH] Usando token de teste de desenvolvimento!");
    req.firebaseUser = {
      uid: "POSTMAN_USER_UID",
      email: "teste@postman.com",
    } as DecodedIdToken; 

    return next();
  }
  // Fim do atalho */

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken; //Anexa o usuário do Firebase
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
