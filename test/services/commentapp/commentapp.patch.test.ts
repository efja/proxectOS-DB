// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { CommentApp } from '../../../src/models/commentapp.model';

import {
    API_BASE,
    dataList,
    db,
    FAKE_TEXT,
    request,
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - CommentApps (PATCH)', () => {
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.comments);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Actualizar CommentApp: <${dataList.comments[0].id}>`, async() => {
        const commentApp0 = dataList.comments[0] as CommentApp;
        const commentApp1 = dataList.comments[0] as CommentApp;

        // Modificase o modelo CommentApp
        commentApp1.title = commentApp1.title + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(commentApp0, commentApp1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
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

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(commentApp0.id);
        expect(data.id).toBe(commentApp1.id);

        expect(data.message).toBeDefined();
        expect(data.message).toBe(commentApp0.message);
        expect(data.message).toBe(commentApp1.message);

        // Comprobanse algúns datos opcionais
        expect(data.expirationDate).toBe(commentApp0.expirationDate);
        expect(data.expirationDate).toBe(commentApp1.expirationDate);

        expect(message).toBe(i18next.t('COMMENT.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar CommentApp con datos erróneos:`, async() => {
        const commentApp0 = dataList.comments[0] as CommentApp;
        const commentApp1 = dataList.comments[0] as CommentApp;

        // Modificase o modelo CommentApp
        commentApp1.title = commentApp1.title + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(commentApp0, commentApp1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
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
