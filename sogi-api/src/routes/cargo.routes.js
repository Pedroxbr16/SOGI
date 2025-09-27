import { Router } from "express";
import {
  getCargos,
  getCargoById,
  createCargo,
  updateCargo,
  deleteCargo,
} from "../controllers/cargoController.js";
import { auth as requireAuth } from "../middlewares/auth.js";

const cargoRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Cargos
 *   description: Endpoints de cargos
 */

// GETs públicos (para popular selects sem token)
cargoRouter.get("/", getCargos);
cargoRouter.get("/:id", getCargoById);

// Daqui pra baixo exige token
cargoRouter.use(requireAuth);
cargoRouter.post("/", createCargo);
cargoRouter.put("/:id", updateCargo);
cargoRouter.delete("/:id", deleteCargo);

export default cargoRouter;
