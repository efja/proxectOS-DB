// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import supertest from 'supertest';

import { App } from '../../src/services/api.service';
import { DBTestConnection } from "../db/config-db";
import { ObjectFactory } from '../db/load-data';

// ####################################################################################################
// ## CONSTANTES
// ####################################################################################################
// CONSTANTES DO ENTORNO
const {
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
const api_name = APP_NAME;
const api_version = process.env.npm_package_version;
const apiVersion = getAPIVersion();

const API_BASE = `/api/${apiVersion}`;

// Aplicación
const app = new App();

// Request para testing
const request = supertest(app.getApp());

// ####################################################################################################
// ## UTILIDADES
// ####################################################################################################
function getAPIVersion () {
    let apiFullVersion = process.env.npm_package_version.split(".");
    let apiPrefix = API_PREFIX;

    let result = `${apiPrefix}${apiFullVersion[0]}`;

    return result;
};

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas básicas de conexión cá BD', () => {
    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test('conexión OK', async () => {
        const conn = await new DBTestConnection(
            DBMS,
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_LOGIN,
            DB_PASS
        ).init();

        expect(await conn.orm.isConnected()).toBe(true);
    });

    test('conexión: KO', async () => {
        const conn = new DBTestConnection(
            DBMS,
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_LOGIN,
            `fake_${DB_PASS}`
        );
        let result = null;

        try {
            await conn.init();
        } catch (error) {
            result = error;
        }

        expect(result).not.toBeNull();
        expect(result.code).toBe(18);
        expect(result.codeName).toBe("AuthenticationFailed");
        expect(result.name).toBe("MongoError");
    });
});

describe('Probas básicas de conexión da API', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const db: DBTestConnection = new DBTestConnection(
        DBMS,
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_LOGIN,
        DB_PASS
    );

    // Lista de datos
    const dataList = new ObjectFactory();

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropAllData();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.allModels, true);
	});

	afterAll(async () => {
		// await db.dropAllData();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test('Info API (GET)', async() => {
        const response = await request.get(API_BASE);

        expect(response.status).toBe(200);
        expect(response.body).toBe(i18next.t('WELCOME', { app: api_name, version: api_version }));
    });

    test('All Projets (GET)', async() => {
        const response = await request.get(`${API_BASE}/projects`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(response.status).toBe(200);
        expect(code).toBe(200);
        expect(data).toBeDefined();
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);
        expect(message).toBe(i18next.t('PROJECT.SERVICE.SUCCESS.GET_ALL'));
        // expect(error).toBe(i18next.t('PROJECT.SERVICE.ERROR.GET_ALL'));
    });
});
