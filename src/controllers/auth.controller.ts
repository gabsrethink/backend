import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const syncUser = async (req: Request, res: Response) => {
  const firebaseUser = req.firebaseUser;

  if (!firebaseUser) {
    return res
      .status(401)
      .json({ message: "Usuário Firebase não encontrado." });
  }

  const { uid, email, name } = firebaseUser;

  try {
    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email: email || "",
          name: name,
          favoriteList: {
            create: {},
          },
        },
      });
      return res.status(201).json(user);
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao sincronizar usuário.", error });
  }
};
