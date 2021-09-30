// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import colors from 'colors';
import cors from 'cors';
import express, { Application } from 'express';

import i18next from "i18next";
import i18nextBack from "i18next-fs-backend";
import i18nextMidd from "i18next-http-middleware";

import { routes } from '../routes';

import { DBConnection } from '../config/config-db';

// ####################################################################################################
// ## CONSTANTES DO ENTORNO
// ####################################################################################################
const {
    APP_HOST,
    APP_PORT,
    API_PREFIX,

    DBMS,
    DB_HOST,
    DB_PORT,
    DB_NAME,

    DB_LOGIN,
    DB_PASS,
} = process.env;

// ####################################################################################################
// ## CLASE APP
// ####################################################################################################
export class App {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    private app         : Application;
    private apiVersion  : string | number;
    private db          : DBConnection = new DBConnection(
        DBMS,
        DB_HOST,
        DB_PORT,
        DB_NAME,

        DB_LOGIN,
        DB_PASS,
    );

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor() {
        this.app        = express();
        this.apiVersion = this.getAPIVersion();

        this.middlewares();
        this.languages();
        this.routes();
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
    /**
     * Inicia a conexión coa Base de Datos
     */
    public dbConnection() {
        this.db.start();

        return this;
    }

    /**
     * Finaliza a conexión coa Base de Datos
     */
    public dbConnectionStop() {
        this.db.stop();

        return this;
    }

    /**
     * Toma o número de versión a partir da versión definida no ficheiro json
     */
    public getAPIVersion():string {
        let apiFullVersion = process.env.npm_package_version.split(".");
        let apiPrefix = API_PREFIX;

        let result = `${apiPrefix}${apiFullVersion[0]}`;

        return result;
    }

    /**
     * Inicializa os idiomas
     */
    public languages(): void {
        i18next
            .use(i18nextBack)
            .use(i18nextMidd.LanguageDetector)
            .init(
                {
                    fallbackLng: 'gl',
                    backend: {
                        loadPath: './locales/{{lng}}.json'
                    }
                }
            );
    }

    /**
     * Inicializa os middlewares
     */
    public middlewares(): void {
        this.app.use(cors());
        this.app.use(i18nextMidd.handle(i18next));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    /**
     * Inicializa as rutas
     */
    public routes(): void {
        this.app.use(`/api/${this.apiVersion}`, routes());
    }

    /**
     * Arranca a aplicación
     */
    public start(): void {
        this.app.listen(APP_PORT, () => {
            console.log(colors.bgBlue(`Aplicación levantada en: ${APP_HOST}:${APP_PORT}/api/${this.apiVersion}/`));
        });
    }

    /**
     * Para a aplicación
     */
    public stop(): void {
        this.dbConnectionStop();
        this.app.close();
    }

    /**
     * Devolve a instancia desta clase
     *
     * @returns unha instancia desta clase
     */
    public getApp(): Application {
        return this.app;
    }

    /**
     * Devolve a instancia desta clase
     *
     * @returns unha instancia desta clase
     */
    public getDb(): DBConnection {
        return this.db;
    }
}
