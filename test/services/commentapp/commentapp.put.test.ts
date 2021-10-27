// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

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
describe('1: Probas DATOS API - CommentApps (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "comments";

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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar CommentApp: <${dataList.comments[0].id}>`, async() => {
        const commentApp0 = new CommentApp(dataList.comments[0]);
        const commentApp1 = new CommentApp(dataList.comments[0]);

        // Modificase o modelo CommentApp (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        commentApp1.title = commentApp1.title + FAKE_TEXT;
        commentApp1.message = commentApp1.message + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.comments[0].id}`).send(commentApp1);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);
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

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('COMMENT.NAME'), id: commentApp1.id }));
    });
});

describe('1: Probas DATOS API - CommentApps ERROS (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "comments";

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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************

    test(`2.1: Actualizar CommentApp con datos erróneos:`, async() => {
        const commentApp0 = new CommentApp(dataList.comments[0]);

        // Modificase o modelo CommentApp
        commentApp0.title = commentApp0.title + FAKE_TEXT;

        const commentApp1 = commentApp0 as any;
        commentApp1.createdAt = commentApp0.title + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${commentApp0.id}`).send(commentApp1);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);
        expect(data).toBeUndefined();

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('COMMENT.NAME'), id: commentApp0.id }));
    });

    test(`2.2: Actualizar CommentApp que non existe:`, async() => {
        const commentApp0 = new CommentApp(dataList.comments[0]);

        // Modificase o modelo CommentApp
        commentApp0.title = commentApp0.title + FAKE_TEXT;

        do {
            commentApp0.id = new ObjectId();
        } while (commentApp0.id == dataList.comments[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${commentApp0.id}`).send(commentApp0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('COMMENT.NAME'), id: commentApp0.id }));
    });
});