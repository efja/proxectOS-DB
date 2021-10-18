// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { UserContactType } from '../../../src/models/user-contact-type.model';

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
describe('Probas DATOS API - UserContactTypes (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userContactTypes";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.userContactTypes);
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
    test(`Actualizar UserContactType: <${dataList.userContactTypes[0].id}>`, async() => {
        const userContactType0 = dataList.userContactTypes[0] as UserContactType;
        const userContactType1 = dataList.userContactTypes[0] as UserContactType;

        // Modificase o modelo UserContactType (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        userContactType1.description = userContactType1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(userContactType1);
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
        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(userContactType0.description);
        expect(data.description).toBe(userContactType1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContactType0.id);
        expect(data.id).toBe(userContactType1.id);


        expect(message).toBe(i18next.t('USER_CONTACT_TYPE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar UserContactType con datos erróneos:`, async() => {
        const userContactType0 = dataList.userContactTypes[0] as UserContactType;

        // Modificase o modelo UserContactType
        userContactType0.description = userContactType0.description + FAKE_TEXT;

        const userContactType1 = userContactType0 as any;
        userContactType1.startDate = userContactType0.description + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(userContactType1);
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

        expect(message).toBe(i18next.t('USER_CONTACT_TYPE.SERVICE.ERROR.UPDATE'));
    });
});
