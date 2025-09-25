import { Router } from "express";
import userRouter from "./user.routes.js";
import StatusContract from "../models/statusContractModel.js";
import Contract from "./contract.routes.js";
import cargo from "./cargo.routes.js";
const router = Router();

router.use("/users", userRouter);
router.use("/status-contract", StatusContract);
router.use("/contracts", Contract);
router.use("/cargos", cargo);

export default router;
