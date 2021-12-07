// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import qs from 'qs';

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

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
describe('1: Probas DATOS API - CommentApps (GET)', () => {
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
    test('1.1: Consultar tódolos CommentApps:', async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = dataList.comments.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.comments[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('COMMENT.NAME_PLURAL') }));
    });

    test('1.2: Consultar tódolos CommentApps con parámetros de filtrado:', async() => {
        const valueFilter = 'voluptatem';
        const queryParameters = qs.stringify(
            {
                limit: 0,
                orderBy: [{ name: "ASC" }],
                title: valueFilter
            },
            { arrayFormat: 'repeat' }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}?${queryParameters}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const comments: CommentApp[] = (dataList.comments as CommentApp[]).filter(item => item.title.includes(valueFilter));

        const dataLength = comments.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(comments[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('COMMENT.NAME_PLURAL') }));
    });

    test(`1.3: Consultar CommentApp: <${dataList.comments[0].id}>`, async() => {
        const commentApp = dataList.comments[0] as CommentApp;

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${commentApp.id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

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

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('COMMENT.NAME'), id: commentApp.id }));
    });

    test(`1.4: Consultar CommentApp: <${dataList.comments[0].id}> con parámetros de filtrado`, async() => {
        const commentApp = dataList.comments[0] as CommentApp;
        const queryParameters = qs.stringify(
            {
                title: commentApp.title
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${commentApp.id}?${queryParameters}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

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

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('COMMENT.NAME'), id: dataList.comments[0].id }));
    });
});

describe('2: Probas DATOS API - CommentApps ERROS (GET)', () => {
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
    test('2.1: Consultar tódolos CommentApps con parámetros de filtrado :', async() => {
        const queryParameters = qs.stringify(
            {
                name: FAKE_TEXT
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}?${queryParameters}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = dataList.comments.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_LIST', { entity: i18next.t('COMMENT.NAME_PLURAL') }));
    });

    test(`2.2: Consultar CommentApp: <${dataList.comments[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                name: FAKE_TEXT
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.comments[0].id}?${queryParameters}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('COMMENT.NAME'), id: `${dataList.comments[0].id}` }));
    });

    test(`2.3: Consultar CommentApp inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.comments[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('COMMENT.NAME'), id: `${dataList.comments[0].id}${FAKE_TEXT}` }));
    });
});