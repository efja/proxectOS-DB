// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { DBTestConnection } from "../db/config-db";
import { app, runApp } from './commons';
import {
    API_BASE,
    api_name,
    api_version,

    DBMS,
    DB_HOST,
    DB_LOGIN,
    DB_NAME,
    DB_PASS,
    DB_PORT,

    FAKE_TEXT,
    request
} from "./commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas para ver se a BD está levantada', () => {
    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test('1.1: Conexión OK', async () => {
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

    test('1.2: Conexión KO', async () => {
        const conn = new DBTestConnection(
            DBMS,
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_LOGIN,
            `${DB_PASS}${FAKE_TEXT}`
        );
        let result = null;

        try {
            await conn.init();
        } catch (error) {
            result = error;
        }

        expect(result).not.toBeUndefined();
        expect(result.code).toBe(18);
        expect(result.codeName).toBe("AuthenticationFailed");
        expect(result.name).toBe("MongoError");
    });
});

describe('2: Probas básicas de conexión coa API (GET)', () => {
    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await runApp();
	});

	afterAll(async () => {
        await app.stop();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`2.1: Info API: <${API_BASE}>`, async() => {
        const response = await request.get(API_BASE);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBe(i18next.t('WELCOME', { app: api_name, version: api_version }));
    });

    test(`2.2: Conexión cá BD:`, async() => {
        const conn = await app.getDb().checkConnection();

        expect(conn.isConnected).toBe(true);
        expect(await conn.orm).toBeDefined();
    });

    test(`2.3: Info API URL errónea: <${API_BASE}${FAKE_TEXT}>`, async() => {
        const response = await request.get(`${API_BASE}${FAKE_TEXT}`);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(response.body).not.toBe(i18next.t('WELCOME', { app: api_name, version: api_version }));
    });
});
