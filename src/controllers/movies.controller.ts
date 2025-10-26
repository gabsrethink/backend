import { Request, Response } from "express";
import tmdbApi from "../lib/tmdbApi";
import axios from "axios";

export const searchMovies = async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query) {
    return res
      .status(400)
      .json({ message: 'Parâmetro "query" é obrigatório.' });
  }

  try {
    const { data } = await tmdbApi.get("/search/movie", {
      params: {
        query: query,
        language: "pt-BR",
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar no TMDb.", error });
  }
};

export const getMovieDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID do filme é obrigatório." });
  }

  try {
    const { data } = await tmdbApi.get(`/movie/${id}`, {
      params: {
        language: "pt-BR",
        append_to_response: "credits,release_dates",
      },
    });
    res.status(200).json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        return res
          .status(404)
          .json({ message: "Filme não encontrado no TMDb." });
      }
      return res
        .status(error.response?.status || 502)
        .json({
          message: "Erro ao buscar detalhes no TMDb.",
          error: error.message,
        });
    }
    res
      .status(500)
      .json({ message: "Erro interno ao buscar detalhes do filme.", error });
  }
};

export const getTrendingMovies = async (req: Request, res: Response) => {
  try {
    const { data } = await tmdbApi.get("/trending/movie/day", {
      params: {
        language: "pt-BR",
      },
    });
    res.status(200).json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res
        .status(502)
        .json({ message: "Erro ao buscar no TMDb.", error: error.message });
    }
    res.status(500).json({ message: "Erro ao buscar filmes em alta.", error });
  }
};
