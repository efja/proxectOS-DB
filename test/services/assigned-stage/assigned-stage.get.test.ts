// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import qs from 'qs';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { AssignedStage } from '../../../src/models/assigned-stage.model';

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
describe('1: Probas DATOS API - AssignedStages (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedStages";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.assignedStages, true);
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
    test('1.1: Consultar tódolos AssignedStages:', async() => {
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

        const dataLength = dataList.assignedStages.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.assignedStages[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('ASSIGNED_STAGE.NAME_PLURAL') }));
    });

    test('1.2: Consultar tódolos AssignedStages con parámetros de filtrado:', async() => {
        const queryParameters = qs.stringify(
            {
                limit: 0,
                orderBy: [{ stage: "ASC" }],
                stage: '616b561b41663da69a3fc807'
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

        const dataLength = 1;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.assignedStages[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('ASSIGNED_STAGE.NAME_PLURAL') }));
    });

    test(`1.3: Consultar AssignedStage: <${dataList.assignedStages[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedStages[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const assignedStage = dataList.assignedStages[0] as AssignedStage;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedStage.id);

        expect(data.stage).toBeDefined();
        expect(data.stage).toBe(assignedStage.stage.id);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(assignedStage.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(assignedStage.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('ASSIGNED_STAGE.NAME'), id: assignedStage.id }));
    });

    test(`1.4: Consultar AssignedStage: <${dataList.assignedStages[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                stage: '616b561b41663da69a3fc807'
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedStages[0].id}?${queryParameters}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const assignedStage = dataList.assignedStages[0] as AssignedStage;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedStage.id);

        expect(data.stage).toBeDefined();
        expect(data.stage).toBe(assignedStage.stage.id);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(assignedStage.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(assignedStage.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('ASSIGNED_STAGE.NAME'), id: dataList.assignedStages[0].id }));
    });
});

describe('2: Probas DATOS API - AssignedStages ERROS (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedStages";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.assignedStages, true);
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
    test('2.1: Consultar tódolos AssignedStages con parámetros de filtrado :', async() => {
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

        const dataLength = dataList.assignedStages.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_LIST', { entity: i18next.t('ASSIGNED_STAGE.NAME_PLURAL') }));
    });

    test(`2.2: Consultar AssignedStage: <${dataList.assignedStages[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                name: FAKE_TEXT
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedStages[0].id}?${queryParameters}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('ASSIGNED_STAGE.NAME'), id: dataList.assignedStages[0].id }));
    });

    test(`2.3: Consultar AssignedStage inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedStages[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('ASSIGNED_STAGE.NAME'), id: `${dataList.assignedStages[0].id}${FAKE_TEXT}` }));
    });
});
