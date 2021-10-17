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

// Aplicación
export const app = new App();

// Request para testing
export const request = supertest(app.getApp());

export const db: DBTestConnection = new DBTestConnection(
    DBMS,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_LOGIN,
    DB_PASS
);

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
