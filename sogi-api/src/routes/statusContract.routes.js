import { Router } from "express";
import {
    createStatusContract,
    deleteStatusContract,
    getStatusContract,
    getStatusContractById,
    updateStatusContract
} from "../controllers/statusContractController.js";

const statusContractRouter = Router();

/**
 * @swagger
 * /status-contract:
 *   get:
 *     summary: Listar contratos de status
 *     tags: [StatusContract]
 *     responses:
 *       200:
 *         description: Listagem de contratos de status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/StatusContract' }
 *       500:
 *         description: Erro ao listar contratos de status
 */
statusContractRouter.get("/", getStatusContracts);

/**
 * @swagger
 * /status-contract:
 *   post:
 *     summary: Cria contrato de status
 *     tags: [StatusContract]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Status de testes"
 *     responses:
 *       201:
 *         description: Criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/StatusContract' }
 *       400:
 *         description: Erro de validação
 */
statusContractRouter.post("/", createStatusContract);

/**
 * @swagger
 * /status-contract/{id}:
 *   get:
 *     summary: Obtém contrato de status por ID
 *     tags: [StatusContract]
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
 *             schema: { $ref: '#/components/schemas/StatusContract' }
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro interno
 */
statusContractRouter.get("/:id", getStatusContractById);

/**
 * @swagger
 * /status-contract:
 *   get:
 *     summary: Obtém todos os contratos de status
 *     tags: [StatusContract]
 *     responses:
 *       200:
 *         description: Contratos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/StatusContract' }
 *       500:
 *         description: Erro interno
 */
statusContractRouter.get("/", getStatusContract);

/**
 * @swagger
 * /status-contract/{id}:
 *   put:
 *     summary: Atualiza contrato de status
 *     tags: [StatusContract]
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
 *                 example: "Status de testes"
 *     responses:
 *       200:
 *         description: Atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/StatusContract' }
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro interno
 */
statusContractRouter.put("/:id", updateStatusContract);

/**
 * @swagger
 * /status-contract/{id}:
 *   delete:
 *     summary: Deleta contrato de status
 *     tags: [StatusContract]
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
statusContractRouter.delete("/:id", deleteStatusContract);
