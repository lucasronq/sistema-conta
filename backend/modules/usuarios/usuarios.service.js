const db = require('../../database/database-config');

module.exports = {
    getCredencial: async (loginPar) => {
        return (
            await db.query(
                "select username, password " +
                "from usuarios where username = $1",
                [loginPar]
            )
        ).rows;
    },

    register: async (username, password) => {
        let msg = 'ok';
        try {
            await db.query(
                `INSERT INTO usuarios (username, password) VALUES ($1, $2)`,
                [username, password]
            )
        } catch (err) {
            msg = 'usuarios.service.register ' + err;
        }
        return { msg };
    }
}