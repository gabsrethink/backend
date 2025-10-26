import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import tmdbApi from "../lib/tmdbApi";
import axios from "axios";

export const getSharedList = async (req: Request, res: Response) => {
  const { shareId } = req.params;

  try {
    const list = await prisma.favoriteList.findUnique({
      where: { shareId: shareId },
      select: {
        movieIds: true,
      },
    });

    if (!list) {
      return res
        .status(404)
        .json({ message: "Lista de compartilhamento não encontrada." });
    }

    if (list.movieIds.length === 0) {
      return res.status(200).json({
        movieDetails: [],
      });
    }
    const moviePromises = list.movieIds.map((id) =>
      tmdbApi.get(`/movie/${id}`, {
        params: { language: "pt-BR" },
      })
    );

    const movieResponses = await Promise.all(moviePromises);

    const movieDetails = movieResponses.map((response) => response.data);

    res.status(200).json({
      movieDetails: movieDetails,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res
        .status(502)
        .json({
          message: "Erro ao buscar dados no TMDb.",
          error: error.message,
        });
    }
    res.status(500).json({ message: "Erro ao buscar lista compartilhada." });
  }
};
