import { Router } from "express";
import {
  getCargos,
  getCargoById,
  createCargo,
  updateCargo,
  deleteCargo,
} from "../controllers/cargoController.js";

const cargoRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Cargos
 *   description: Endpoints de cargos
 */

/**
 * @swagger
 * /cargos:
 *   get:
 *     summary: Lista todos os cargos
 *     tags: [Cargos]
 *     responses:
 *       200:
 *         description: Lista de cargos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Cargo' }
 *       500:
 *         description: Erro interno
 */
cargoRouter.get("/", getCargos);

/**
 * @swagger
 * /cargos/{id}:
 *   get:
 *     summary: Obtém um cargo por ID
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cargo encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cargo' }
 *       404:
 *         description: Cargo não encontrado
 *       500:
 *         description: Erro interno
 */
cargoRouter.get("/:id", getCargoById);

/**
 * @swagger
 * /cargos:
 *   post:
 *     summary: Cria um novo cargo
 *     tags: [Cargos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome: { type: string, example: "Analista" }
 *     responses:
 *       201:
 *         description: Cargo criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cargo' }
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno
 */
cargoRouter.post("/", createCargo);

/**
 * @swagger
 * /cargos/{id}:
 *   put:
 *     summary: Atualiza um cargo
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string, example: "Analista" }
 *     responses:
 *       200:
 *         description: Cargo atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cargo' }
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Cargo não encontrado
 *       500:
 *         description: Erro interno
 */
cargoRouter.put("/:id", updateCargo);

/**
 * @swagger
 * /cargos/{id}:
 *   delete:
 *     summary: Deleta um cargo
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cargo deletado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Cargo' }
 *       404:
 *         description: Cargo não encontrado
 *       500:
 *         description: Erro interno
 */
cargoRouter.delete("/:id", deleteCargo);

export default cargoRouter;
