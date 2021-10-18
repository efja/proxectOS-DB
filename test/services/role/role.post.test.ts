// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Role } from '../../../src/models/role.model';
import { User } from "../../../src/models/user.model";

import {
    API_BASE,
    dataList,
    db,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - Roles (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "roles";

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
    test(`Crear Role: <${dataList.roles[0].id}>`, async() => {
        const role = dataList.roles[0] as Role;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(role);
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
        expect(data.id).toBe(role.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(role.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(role.description);

        // Comprobanse algúns datos opcionais
        expect(data.create).toBe(role.create);
        expect(data.delete).toBe(role.delete);

        expect(message).toBe(i18next.t('ROLE.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear Role con datos erróneos:`, async() => {
        const badRole = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badRole);
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

        expect(message).toBe(i18next.t('ROLE.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de Roles:', async() => {
        const roles = [
            dataList.roles[0] as Role,
            dataList.roles[0] as Role,
        ];

        // Se cambian los identificadores para evitar conflictos
        roles[0]._id = "616c6b4c9c7900e7011c9615";
        roles[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        roles[1]._id = "616c6b6602067b3bd0d5ffbc";
        roles[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(roles);
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
        expect(data).toHaveLength(roles.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(roles[0]);
        expect(data[0].id).not.toBe(roles[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(roles[1]);
        expect(data[1].id).not.toBe(roles[0]);

        expect(total).toBe(dataList.roles.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ROLE.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de Roles algúns con datos erróneos:', async() => {
        const badRoles = [
            dataList.roles[0] as Role,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badRoles[0]._id = "616c6b4c9c7900e7011c9615";
        badRoles[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badRoles[1]._id = "616c6b6602067b3bd0d5ffbc";
        badRoles[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badRoles);
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
        expect(data).not.toHaveLength(badRoles.length);

        expect(total).not.toBe(badRoles.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ROLE.SERVICE.ERROR.CREATE_LIST'));
    });
});
