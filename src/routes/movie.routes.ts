import { Router } from "express";
import * as moviesController from "../controllers/movies.controller";
import { decodeFirebaseToken } from "../middlewares/decodeFirebaseToken";
import { findUserInDb } from "../middlewares/findUserInDB";

const router = Router();
const protectedRoute = [decodeFirebaseToken, findUserInDb];

router.get("/search", protectedRoute, moviesController.searchMovies);
router.get("/details/:id", protectedRoute, moviesController.getMovieDetails);
router.get('/trending', protectedRoute, moviesController.getTrendingMovies);

export default router;
