import { Router } from "express";
import { decodeFirebaseToken } from "../middlewares/decodeFirebaseToken";
import { findUserInDb } from "../middlewares/findUserInDB";
import * as favoritesController from "../controllers/favorites.controller";

const router = Router();
const protectedRoute = [decodeFirebaseToken, findUserInDb];

router.get("/", protectedRoute, favoritesController.getFavorites);
router.post("/add", protectedRoute, favoritesController.addFavorite);
router.post("/remove", protectedRoute, favoritesController.removeFavorite);

export default router;
