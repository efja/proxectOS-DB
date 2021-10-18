// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { DBTestConnection } from "../db/config-db";
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

    test('conexión KO', async () => {
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

        expect(result).not.toBeNull();
        expect(result.code).toBe(18);
        expect(result.codeName).toBe("AuthenticationFailed");
        expect(result.name).toBe("MongoError");
    });
});

describe('Probas básicas de conexión coa API (GET)', () => {
    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Info API: <${API_BASE}>`, async() => {
        const response = await request.get(API_BASE);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toBe(i18next.t('WELCOME', { app: api_name, version: api_version }));
    });

    test(`Info API URL errónea: <${API_BASE}${FAKE_TEXT}>`, async() => {
        const response = await request.get(`${API_BASE}${FAKE_TEXT}`);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(response.body).not.toBe(i18next.t('WELCOME', { app: api_name, version: api_version }));
    });
});
