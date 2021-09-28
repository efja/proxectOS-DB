// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { DBConnection } from "./mikro-orm.config";

// ####################################################################################################
// ## FUNCIÓNS
// ####################################################################################################
export const dbConnection = async() => {
    let db  : DBConnection = new DBConnection();

    try {
        await db.start();

        // const author = new PriorityMDB('adasfasf', '1111');
        // author.born = new Date();
        // // just persist books, author and publisher will be automatically cascade persisted
        // await db.orm.em.persistAndFlush([author]);

        return `Conexión á BD correcta. Cadea de conexión <${db.getConnectionString()}>`;
    } catch (error) {
        let result = new Error(`Erro ó conectar coa BD. Cadea de conexión <${db.getConnectionString()}>`);
        result.stack = error;

        throw result;
    }
}
