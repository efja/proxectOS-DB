// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from "@mikro-orm/mongodb";

import { Stage } from '../../../src/models/stage.model';
import { User } from "../../../src/models/user.model";

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    request
} from "../commons";

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
describe('1: Probas DATOS API - Stages (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "stages";

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
        await db.createCollections();
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
    test(`1.1: Crear Stage: <${dataList.stages[0].id}>`, async() => {
        const stage = dataList.stages[0] as Stage;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(stage);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(stage.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(stage.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(stage.description);

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('STAGE.NAME') }));
    });

    test('1.2: Crear lista de Stages:', async() => {
        const stages = [
            new Stage(dataList.stages[0]),
            new Stage(dataList.stages[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        stages[0]._id = new ObjectId("616c6b4c9c7900e7011c9615");
        stages[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        stages[1]._id = new ObjectId("616c6b6602067b3bd0d5ffbc");
        stages[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(stages);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = stages.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(stages[0].id);
        expect(data[0].id).not.toBe(stages[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(stages[1].id);
        expect(data[1].id).not.toBe(stages[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('STAGE.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - Stages ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "stages";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.stages, true);
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
    test(`2.1: Crear Stage con datos erróneos:`, async() => {
        const badStage = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badStage);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('STAGE.NAME') }));
    });

    test(`2.2: Crear Stage: <${dataList.stages[0].id}> QUE XA EXISTE`, async() => {
        const stage = dataList.stages[0] as Stage;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(stage);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('STAGE.NAME'), id: stage.id }));
    });

    test('2.3: Crear lista de Stages algúns con datos erróneos:', async() => {
        const badStages = [
            new Stage(dataList.stages[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badStages[0]._id = new ObjectId("616c6b4c9c7900e7011c9615");
        badStages[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badStages[1]._id = new ObjectId("616c6b6602067b3bd0d5ffbc");
        badStages[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badStages);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badStages.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('STAGE.NAME_PLURAL') }));
    });
});