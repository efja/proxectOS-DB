// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import dotenv from 'dotenv';
dotenv.config(); // Carga das constantes de entorno (tense que facer ante de nada se non xerase unha excepción)

import { App } from './services/api.service';

const {
    DBMS,
    DB_HOST,
    DB_PORT,
    DB_NAME,

    DB_LOGIN,
    DB_PASS,
} = process.env;

// ##################################################################################################
// ## INICIO DO PROGRAMA
// ##################################################################################################
export const appProxectos = new App();

(async() => {
    appProxectos.setDbOptionsFromEnv();
    await appProxectos.dbConnection();

    appProxectos.start();
})();
