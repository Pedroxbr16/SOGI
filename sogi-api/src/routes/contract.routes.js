import { Router } from "express";
import {
    createContract,
    deleteContract,
    getContractById,
    getContracts,
    updateContract,
} from "../controllers/contractController.js";

const contractRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Contratos
 *   description: Endpoints de contratos
 */

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Lista contratos
 *     tags: [Contratos]
 *     responses:
 *       200:
 *         description: Lista de contratos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Contract' }
 *       500:
 *         description: Erro interno
 */
contractRouter.get("/", getContracts);

/**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     summary: Obtém contrato por ID
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contrato encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Contract' }
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro interno
 */
contractRouter.get("/:id", getContractById);

/**
 * @swagger
 * /contracts:
 *   post:
 *     summary: Cria contrato
 *     tags: [Contratos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [empresa, machine, status, coordenador, vencimento]
 *             properties:
 *               empresa:
 *                 type: string
 *                 example: "Contrato de testes"
 *               machine:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["Máquina 1", "Máquina 2"]
 *               status:
 *                 type: string
 *                 ref: '#/components/schemas/StatusContract'
 *                 example: "Status de testes"
 *               coordenador:
 *                 type: string
 *                 ref: '#/components/schemas/User'
 *                 example: "João Silva"
 *               vencimento:
 *                 type: string
 *                 format: date
 *                 example: "2022-01-01"
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Contract' }
 *       400:
 *         description: Erro de validação
 */
contractRouter.post("/", createContract);

/**
 * @swagger
 * /contracts/{id}:
 *   put:
 *     summary: Atualiza contrato
 *     tags: [Contratos]
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
 *               nome:
 *                 type: string
 *                 example: "Nome do contrato"
 *               machine:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["Máquina 1", "Máquina 2"]
 *               status:
 *                 type: string
 *                 ref: '#/components/schemas/StatusContract'
 *                 example: "Status de testes"
 *               coordenador:
 *                 type: string
 *                 ref: '#/components/schemas/User'
 *                 example: "João Silva"
 *               vencimento:
 *                 type: string
 *                 format: date
 *                 example: "2022-01-01"
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Contract' }
 *       400:
 *         description: Erro de validação
 */
contractRouter.put("/:id", updateContract);

/**
 * @swagger
 * /contracts/{id}:
 *   delete:
 *     summary: Deleta contrato
 *     tags: [Contratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deletado
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro interno
 */
contractRouter.delete("/:id", deleteContract);

export default contractRouter;