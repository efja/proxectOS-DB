// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { CommentApp } from '../../../src/models/commentapp.model';

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    FAKE_TEXT,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - CommentApps (DELETE)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "comments";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.comments, true);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Borrar CommentApp: <${dataList.comments[0].id}>`, async() => {
        const response = await request.delete(`${API_BASE}/${ENDPOINT}/${dataList.comments[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const commentApp = dataList.comments[0] as CommentApp;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(commentApp.id);

        expect(data.title).toBeDefined();
        expect(data.title).toBe(commentApp.title);

        expect(data.message).toBeDefined();
        expect(data.message).toBe(commentApp.message);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.expirationDate)).toBe(date2LocaleISO(commentApp.expirationDate));

        expect(message).toBe(i18next.t('SUCCESS.DELETE', { entity: i18next.t('COMMENT.NAME') }));

        // --------------------------------------------------------------------------------------------
        // -- COMPROBASE QUE A ENTIDADE XA NON EXISTE NA BD
        // --------------------------------------------------------------------------------------------
        const responseGet = await request.get(`${API_BASE}/${ENDPOINT}/${data.id}`);
        const {
            code    : codeGet,
            data    : dataGet,
            message : messageGet,
            error   : errorGet,
        } = responseGet.body

        expect(errorGet).toBeDefined();
        expect(messageGet).toBeUndefined();

        expect(responseGet.status).toBe(HttpStatus.NOT_FOUND);
        expect(codeGet).toBe(HttpStatus.NOT_FOUND);
        expect(dataGet).toBeUndefined();

        expect(errorGet).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('COMMENT.NAME') }));
    });
});

describe('2: Probas DATOS API - CommentApps ERROS (DELETE)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "comments";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.comments, true);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`2.1: Borrar CommentApp inexistente:`, async() => {
        const response = await request.delete(`${API_BASE}/${ENDPOINT}/${dataList.comments[0].id}${FAKE_TEXT}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(error).toBe(i18next.t('ERROR.DELETE', { entity: i18next.t('COMMENT.NAME') }));
    });
});
