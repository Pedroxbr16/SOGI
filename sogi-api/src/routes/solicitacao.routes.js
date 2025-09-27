// src/routes/solicitacao.routes.js
import { Router } from "express";
import {
  createSolicitacaoCadastro,
  aprovarSolicitacaoCadastro,
  reprovarSolicitacaoCadastro,
} from "../controllers/solicitacaoController.js";
import { auth as requireAuth } from "../middlewares/auth.js";

const solicitacaoRouter = Router();

/** PUBLICO: criar solicitação de cadastro (sem JWT) */
solicitacaoRouter.post("/cadastro", createSolicitacaoCadastro);

/** A PARTIR DAQUI: exige JWT */
solicitacaoRouter.use(requireAuth);

solicitacaoRouter.post("/:id/aprovar", aprovarSolicitacaoCadastro);
solicitacaoRouter.post("/:id/reprovar", reprovarSolicitacaoCadastro);



export default solicitacaoRouter;
