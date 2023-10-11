const db = require('../../database/database-config');

class ContasDTO {
    banco;
    agencia;
    conta_corrente;
    receber;
    pagar;
}

module.exports = {
    getAllContas: async () => {
        return (
            await db.query('SELECT * FROM contas')
        ).rows;
    },

    getContaById: async (id) => {
        return (
            await db.query('SELECT * FROM contas WHERE id = $1 and deleted = false', [id])
        ).rows;
    },

    insertConta: async (contaBody) => {
        const contaDtoKeys = Object.keys(new ContasDTO());
        console.log(contaDtoKeys, contaBody)
        let msg = "ok";
        try {
            await db.query(
                `INSERT INTO contas (banco, agencia, conta_corrente, receber, pagar) VALUES (${contaDtoKeys.map((key, i) => (`$${i + 1}`)).join(', ')})`,
                contaDtoKeys.map((key) => contaBody[key])
            )
        } catch (err) {
            msg = 'contas.service.insertConta ' + err;
        }
        return { msg };
    },

    updateContaById: async (id, contaBody) => {
        const contaDtoKeys = Object.keys(new ContasDTO());
        let msg = "ok";
        try {
            await db.query(
                `UPDATE contas SET ${contaDtoKeys.map((key, i) => (`${key} = $${i + 1}`)).join(', ')} WHERE id = ${id}`,
                contaDtoKeys.map((key) => contaBody[key])
            )
        } catch (err) {
            msg = 'contas.service.updateContaById ' + err;
        }
        return { msg };
    },

    deleteContaById: async (id) => {
        let msg = "ok";
        try {
            await db.query(
                ` UPDATE contas SET deleted = true WHERE id = $1`,
                [id])
        } catch (err) {
            msg = 'contas.service.deleteContaById ' + err;
        }
        return { msg };
    }
}