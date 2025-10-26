import axios from "axios";

if (!process.env.TMDB_API_READ_TOKEN) {
  throw new Error(
    "A variável de ambiente TMDB_API_READ_TOKEN não está definida."
  );
}

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

export default tmdbApi;
