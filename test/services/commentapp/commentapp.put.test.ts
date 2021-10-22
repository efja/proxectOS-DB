// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

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
import { date2LocaleISO } from "../../../src/helpers/date.helper";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - CommentApps (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "commentApps";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.comments);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
	});

	afterAll(async () => {
        await app.stop();

		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar CommentApp: <${dataList.comments[0].id}>`, async() => {
        const commentApp0 = dataList.comments[0] as CommentApp;
        const commentApp1 = dataList.comments[0] as CommentApp;

        // Modificase o modelo CommentApp (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        commentApp1.title = commentApp1.title + FAKE_TEXT;
        commentApp1.message = commentApp1.message + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(commentApp1);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // ** Datos cambiados
        expect(data.title).toBeDefined();
        expect(data.title).not.toBe(commentApp0.title);
        expect(data.title).toBe(commentApp1.title);

        expect(data.message).toBeDefined();
        expect(data.message).not.toBe(commentApp0.message);
        expect(data.message).toBe(commentApp1.message);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(commentApp0.id);
        expect(data.id).toBe(commentApp1.id);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.expirationDate)).toBe(date2LocaleISO(commentApp0.expirationDate));
        expect(date2LocaleISO(data.expirationDate)).toBe(date2LocaleISO(commentApp1.expirationDate));

        expect(message).toBe(i18next.t('COMMENT.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar CommentApp con datos erróneos:`, async() => {
        const commentApp0 = dataList.comments[0] as CommentApp;

        // Modificase o modelo CommentApp
        commentApp0.title = commentApp0.title + FAKE_TEXT;

        const commentApp1 = commentApp0 as any;
        commentApp1.expirationDate = commentApp0.title + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(commentApp1);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);
        expect(data).toBeUndefined();

        expect(message).toBe(i18next.t('COMMENT.SERVICE.ERROR.UPDATE'));
    });
});
