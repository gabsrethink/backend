import { Router } from "express";
import authRoutes from "./auth.routes";
import movieRoutes from "./movie.routes";
import favoriteRoutes from "./favorites.routes";
import shareRoutes from "./share.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/movies", movieRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/share", shareRoutes);

export default router;
