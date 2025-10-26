import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import tmdbApi from "../lib/tmdbApi";
import axios from "axios";

// GET /api/favorites
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const list = await prisma.favoriteList.findUnique({
      where: { userId: req.user!.id },
      select: {
        movieIds: true,
        shareId: true,
      },
    });

    if (!list) {
      return res.status(404).json({ message: "Lista não encontrada." });
    }

    //Retorna uma resposta vazia caso a lista esteja vazia
    if (list.movieIds.length === 0) {
      return res.status(200).json({
        movieDetails: [], 
        shareId: list.shareId,
      });
    }

    //Buscando os detalhes de cada filme no TMDb
    const moviePromises = list.movieIds.map((id) =>
      tmdbApi.get(`/movie/${id}`, {
        params: { language: 'pt-BR' },
      })
    );

    const movieResponses = await Promise.all(moviePromises);

    const movieDetails = movieResponses.map((response) => response.data);

    res.status(200).json({
      movieDetails: movieDetails,
      shareId: list.shareId,
    });

  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res.status(502).json({ message: 'Erro ao buscar dados no TMDb.', error: error.message });
    }
    res.status(500).json({ message: 'Erro ao buscar favoritos.' });
  }
};

// POST /api/favorites/add
export const addFavorite = async (req: Request, res: Response) => {
  const { movieId } = req.body;
  if (typeof movieId !== "number") {
    return res.status(400).json({ message: "movieId (number) é obrigatório." });
  }

  try {
    const updatedList = await prisma.favoriteList.update({
      where: { userId: req.user!.id },
      data: {
        movieIds: {
          push: movieId,
        },
      },
      select: { movieIds: true },
    });

    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar favorito." });
  }
};

// POST /api/favorites/remove
export const removeFavorite = async (req: Request, res: Response) => {
  const { movieId } = req.body;
  if (typeof movieId !== "number") {
    return res.status(400).json({ message: "movieId (number) é obrigatório." });
  }

  try {
    const currentList = await prisma.favoriteList.findUnique({
      where: { userId: req.user!.id },
      select: { movieIds: true },
    });

    if (!currentList) {
      return res.status(404).json({ message: "Lista não encontrada." });
    }

    const newMovieIds = currentList.movieIds.filter((id) => id !== movieId);

    const updatedList = await prisma.favoriteList.update({
      where: { userId: req.user!.id },
      data: {
        movieIds: newMovieIds,
      },
      select: { movieIds: true },
    });

    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover favorito." });
  }
};
