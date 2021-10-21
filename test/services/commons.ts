// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import supertest from 'supertest';

import { App } from '../../src/services/api.service';
import { DBTestConnection } from '../db/config-db';
import { ObjectFactory } from '../db/load-data';

// ####################################################################################################
// ## CONSTANTES
// ####################################################################################################
// CONSTANTES DO ENTORNO
export const {
    APP_NAME,
    API_PREFIX,

    DBMS,
    DB_HOST,
    DB_PORT,
    DB_NAME,

    DB_LOGIN,
    DB_PASS,
} = process.env;

// OUTRAS CONSTANTES
export const api_name = APP_NAME;
export const api_version = process.env.npm_package_version;
export const apiVersion = getAPIVersion();

export const FAKE_TEXT = "_fake";

export const API_BASE = `/api/${apiVersion}`;

export const db: DBTestConnection = new DBTestConnection(
    DBMS,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_LOGIN,
    DB_PASS
);

// Aplicación
export const app = new App();

export async function runApp() {
    app.setDbOptions(
        DBMS,
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_LOGIN,
        DB_PASS
    );
    await app.dbConnection();
    await app.start();
}

// Request para testing
export const request = supertest(app.getAppExpress());

// Lista de datos
export const dataList = new ObjectFactory();

// ####################################################################################################
// ## UTILIDADES
// ####################################################################################################
export function getAPIVersion () {
    let apiFullVersion = process.env.npm_package_version.split(".");
    let apiPrefix = API_PREFIX;

    let result = `${apiPrefix}${apiFullVersion[0]}`;

    return result;
};

export function changeDate(originDate: Date, seed: string = "2021-12-27T21:38:21.000+01:00"): Date {

    // Comprobase se a data de Comezo está definida e se non é inicializase o seu valor
    let result: Date = originDate
        ? new Date(originDate)
        : new Date(seed);

    // Modificase a nova data para garantir que é diferente á anterior
    if (result.getDate() >= 1 && result.getDate() < 28) {
        result.setDate(result.getDate() + 1);
    } else {
        result.setDate(28);
    }

    return result;
}
