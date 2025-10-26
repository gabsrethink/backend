import { Router } from "express";
import * as shareController from "../controllers/share.controller";

const router = Router();

router.get("/:shareId", shareController.getSharedList);

export default router;
