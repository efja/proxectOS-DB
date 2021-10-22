// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { CommentApp } from '../../../src/models/commentapp.model';
import { User } from "../../../src/models/user.model";

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
describe('1: Probas DATOS API - CommentApps (POST)', () => {
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
        await db.createCollections();
	});

	afterEach(async () => {
		await db.dropCollections();
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Crear CommentApp: <${dataList.comments[0].id}>`, async() => {
        const commentApp = dataList.comments[0] as CommentApp;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(commentApp);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);
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

        expect(message).toBe(i18next.t('COMMENT.SERVICE.SUCCESS.CREATE'));
    });

    test(`1.2: Crear CommentApp con datos erróneos:`, async() => {
        const badCommentApp = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badCommentApp);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeUndefined();

        expect(message).toBe(i18next.t('COMMENT.SERVICE.ERROR.CREATE'));
    });

    test('1.3: Crear lista de CommentApps:', async() => {
        const commentApps = [
            dataList.comments[0] as CommentApp,
            dataList.comments[0] as CommentApp,
        ];

        // Se cambian los identificadores para evitar conflictos
        commentApps[0]._id = "616c6b4c9c7900e7011c9615";
        commentApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        commentApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        commentApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(commentApps);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(commentApps.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(commentApps[0]);
        expect(data[0].id).not.toBe(commentApps[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(commentApps[1]);
        expect(data[1].id).not.toBe(commentApps[0]);

        expect(total).toBe(dataList.comments.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('COMMENT.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('1.4: Crear lista de CommentApps algúns con datos erróneos:', async() => {
        const badCommentApps = [
            dataList.comments[0] as CommentApp,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badCommentApps[0]._id = "616c6b4c9c7900e7011c9615";
        badCommentApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badCommentApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        badCommentApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badCommentApps);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();
        expect(data).not.toHaveLength(badCommentApps.length);

        expect(total).not.toBe(badCommentApps.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('COMMENT.SERVICE.ERROR.CREATE_LIST'));
    });
});
