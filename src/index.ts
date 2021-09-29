// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import dotenv from 'dotenv';
dotenv.config(); // Carga das constantes de entorno (tense que facer ante de nada se non xerase unha excepción)

import { App } from "./services/api.service";

// ####################################################################################################
// ## INICIO DO PROGRAMA
// ####################################################################################################
const app = new App().dbConnection().start();
