// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Project } from '../../../src/models/project.model';

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
import { ObjectId } from '@mikro-orm/mongodb';

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - Projects (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "projects";

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
        await db.inicializeData(dataList.projects);
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
    test(`1.1: Actualizar Project: <${dataList.projects[0].id}>`, async() => {
        const project0 = new Project(dataList.projects[0]);
        const project1 = new Project(dataList.projects[0]);

        // Modificase o modelo Project (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        project1.name = project1.name + FAKE_TEXT;
        project1.description = project1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.projects[0].id}`).send(project1);
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
        expect(data.name).toBeDefined();
        expect(data.name).not.toBe(project0.name);
        expect(data.name).toBe(project1.name);

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(project0.description);
        expect(data.description).toBe(project1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(project0.id);
        expect(data.id).toBe(project1.id);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(project0.startDate));
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(project1.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(project0.targetFinishDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(project1.targetFinishDate));

        expect(message).toBe(i18next.t('PROJECT.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar Project con datos erróneos:`, async() => {
        const project0 = new Project(dataList.projects[0]);

        // Modificase o modelo Project
        project0.name = project0.name + FAKE_TEXT;

        const project1 = project0 as any;
        project1.startDate = project0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${project0.id}`).send(project1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('PROJECT.NAME'), id: project0.id }));
    });

    test(`1.3: Actualizar Project que non existe:`, async() => {
        const project0 = new Project(dataList.projects[0]);

        // Modificase o modelo Project
        project0.name = project0.name + FAKE_TEXT;

        do {
            project0.id = new ObjectId();
        } while (project0.id == dataList.projects[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${project0.id}`).send(project0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_MALE', { entity: i18next.t('PROJECT.NAME'), id: project0.id }));
    });
});
