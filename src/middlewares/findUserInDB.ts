import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const findUserInDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.firebaseUser) {
    return res.status(401).json({
      message: "Nenhuma informação de usuário do Firebase encontrada.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.firebaseUser.uid },
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuário não sincronizado. Chame /api/auth/sync primeiro.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar usuário no banco de dados." });
  }
};
