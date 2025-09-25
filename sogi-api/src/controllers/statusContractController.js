import statusContract from "../models/statusContractModel.js";
import { saveAccessLog, saveErrorLog, saveActionLog } from "../utils/services/logs.js";


export async function getStatusContracts(req, res) {
    try {
        await saveAccessLog(req.session?.userdata?._id, req, "Listar status de contratos");
        const statusContracts = await statusContract.find().lean();
        return ok(res, 200, statusContracts);
    } catch (err) {
        await saveErrorLog(req, `Erro ao listar status de contratos: ${err.message}`);
        return fail(req, res, 500, `Erro ao listar status de contratos: ${err.message}`);
    }
}

export async function getStatusContractById(req, res) {
    try {
        await saveAccessLog(req.session?.userdata?._id, req, "Buscar status de contrato por ID");
        const doc = await statusContract.findById(req.params.id).lean();
        if (!doc) return ok(res, 404, { message: "Status de contrato nao encontrado" });
        return ok(res, 200, doc);
    } catch (err) {
        await saveErrorLog(req, `Erro ao buscar status de contrato por ID: ${err.message}`);
        return fail(req, res, 500, `Erro ao buscar status de contrato por ID: ${err.message}`);
    }
}

export async function createStatusContract(req, res) {
    try {
        const data = pick(req.body);
        const created = await statusContract.create(data);
        await saveActionLog(req, `Criado status de contrato ${created._id}`);
        return ok(res, 201, created);
    } catch (err) {
        if (err?.code === 11000) {
            // duplicidade (índices unique)
            const dupField = Object.keys(err.keyPattern || {})[0] || "campo";
            await saveErrorLog(req, `Valor duplicado para ${dupField}`);
            return ok(res, 400, { message: `Valor duplicado para ${dupField}` });
        }
        await saveErrorLog(req, `Erro ao criar status de contrato: ${err.message}`);
        return fail(req, res, 400, `Erro ao criar status de contrato: ${err.message}`);
    }
}

export async function updateStatusContract(req, res) {
    try {
        const payload = pick(req.body);
        const updated = await statusContract.findByIdAndUpdate(
            req.params.id,
            { $set: payload },
            { new: true, runValidators: true }
        );
        if (!updated) return ok(res, 404, { message: "Status de contrato nao encontrado" });
        await saveActionLog(req, `Atualizado status de contrato ${updated._id}`);
        return ok(res, 200, updated);
    } catch (err) {
        if (err?.code === 11000) {
            const dupField = Object.keys(err.keyPattern || {})[0] || "campo";
            await saveErrorLog(req, `Valor duplicado para ${dupField}`);
            return ok(res, 400, { message: `Valor duplicado para ${dupField}` });
        }
        await saveErrorLog(req, `Erro ao atualizar status de contrato: ${err.message}`);
        return fail(req, res, 400, `Erro ao atualizar status de contrato: ${err.message}`);
    }
}


export async function deleteStatusContract(req, res) {
    try {
        const deleted = await statusContract.findByIdAndDelete(req.params.id);
        if (!deleted) return ok(res, 404, { message: "Status de contrato nao encontrado" });
        await saveActionLog(req, `Deletado status de contrato ${deleted._id}`);
        return ok(res, 200, deleted);
    } catch (err) {
        await saveErrorLog(req, `Erro ao deletar status de contrato: ${err.message}`);
        return fail(req, res, 400, `Erro ao deletar status de contrato: ${err.message}`);
    }
}

