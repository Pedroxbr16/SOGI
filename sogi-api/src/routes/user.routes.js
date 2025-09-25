import { Router } from "express";
import {
  getUsers,
  getUserById,
  getUsersByCpf,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários (senha nunca é retornada)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *       500:
 *         description: Erro interno
 */
userRouter.get("/", getUsers);

/**
 * @swagger
 * /users/cpf/{cpf}:
 *   get:
 *     summary: Busca usuários por CPF
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema: { type: string, example: "12345678900" }
 *     responses:
 *       200:
 *         description: Lista (possivelmente vazia) de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *       500:
 *         description: Erro interno
 */
userRouter.get("/cpf/:cpf", getUsersByCpf);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuário encontrado (senha nunca é retornada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Não encontrado
 *       500:
 *         description: Erro interno
 */
userRouter.get("/:id", getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cpf, nome, funcao, cargo, email, senha]
 *             properties:
 *               cpf:    { type: string, example: "12345678900" }
 *               nome:   { type: string, example: "João Silva" }
 *               funcao: { type: string, example: "Analista" }
 *               cargo:  { type: string, example: "Coordenador" }
 *               email:  { type: string, example: "joao@empresa.com" }
 *               senha:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "TroqueEste@123"
 *                 description: Senha em texto plano (será hasheada no servidor)
 *                 writeOnly: true
 *     responses:
 *       201:
 *         description: Criado (senha não é retornada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Erro de validação
 */
userRouter.post("/", createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza usuário
 *     tags: [Users]
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
 *               cpf:    { type: string, example: "12345678900" }
 *               nome:   { type: string, example: "João Silva" }
 *               funcao: { type: string, example: "Analista" }
 *               cargo:  { type: string, example: "Coordenador" }
 *               email:  { type: string, example: "joao@empresa.com" }
 *               senha:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "NovaSenha@123"
 *                 description: Opcional. Se informado, será hasheada no servidor.
 *                 writeOnly: true
 *     responses:
 *       200:
 *         description: Atualizado (senha não é retornada)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Não encontrado
 */
userRouter.put("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deletado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: Não encontrado
 */
userRouter.delete("/:id", deleteUser);

export default userRouter;

