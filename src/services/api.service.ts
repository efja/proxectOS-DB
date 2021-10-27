// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import colors from 'colors';
import cors from 'cors';
import express, { Application } from 'express';

import i18next from "i18next";
import i18nextBack from "i18next-fs-backend";
import i18nextMidd from "i18next-http-middleware";

import queryType from 'query-types';

import { routes } from '../routes';

import { DBConnection } from '../config/config-db';
import { RequestContext } from '@mikro-orm/core';

// ####################################################################################################
// ## CONSTANTES DO ENTORNO
// ####################################################################################################
const {
    APP_HOST,
    APP_PORT,
    API_PREFIX,
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
    private db          : DBConnection;
    private appServer   : any;

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
    // ** GETTERS
    // ************************************************************************************************
    /**
     * Devolve a instancia desta clase
     *
     * @returns unha instancia desta clase
     */
    public getApp(): App {
        return this;
    }

    /**
     * Devolve a instancia de express manexado por esta clase.
     *
     * @returns unha instancia desta clase
     */
    public getAppExpress(): Application {
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

    // ************************************************************************************************
    // ** MÉTODOS DE CONFIGURACIÓN
    // ************************************************************************************************
    /**
     * Inicializa os middlewares
     */
    public middlewares(): void {
        this.app.use(cors());
        this.app.use(i18nextMidd.handle(i18next));
        this.app.use(queryType.middleware())
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    /**
     * Inicializa as rutas
     */
    public routes(): void {
        this.app.use(`/api/${this.apiVersion}`, routes());
    }

    // ************************************************************************************************
    // ** MÉTODOS DE INICIO PARADA
    // ************************************************************************************************
    /**
     * Arranca a aplicación
     */
    public start(): App {
        this.appServer = this.app.listen(APP_PORT, () => {
            console.log(colors.bgBlue(`Aplicación levantada en: ${APP_HOST}:${APP_PORT}/api/${this.apiVersion}/`));
        });

        return this;
    }

    /**
     * Para a aplicación
     */
    public async stop() {
        await this.dbConnectionStop();
        this.appServer.close();
    }

    // ************************************************************************************************
    // ** MÉTODOS DE BASE DE DATOS
    // ************************************************************************************************
    /**
     * Inicia a conexión coa Base de Datos
     */
    public async dbConnection() {
        await this.db.startInfo();

        return this;
    }

    /**
     * Establece a configuración da BD cos parámetros do entorno de execución.
     */
    public async setDbOptionsFromEnv() {
        this.db = new DBConnection();

        await this.db.init();

        this.app.use((req, res, next) => {
            RequestContext.create(this.db.orm.em, next);
        });

        return this;
    }

    /**
     * Establece a configuración da BD con parámetros personalizados.
     *
     * @param dbms Sistema Xestor de Base de Datos (siglas en inglés)
     * @param host Máquina do DBMS
     * @param port Porto do servicio do DBMS
     * @param dbName Nome da BD
     * @param user Usuario de conexión
     * @param password Contrasinal
     */
    public async setDbOptions(
      dbms      : string,
      host      : string,
      port      : string,
      dbName    : string,

      user      : string,
      password  : string
    ) {
        this.db = new DBConnection();
        this.db .setOptions(
            dbms,
            host,
            port,
            dbName,
            user,
            password
          );

        await this.db.init();

        this.app.use((req, res, next) => {
            RequestContext.create(this.db.orm.em, next);
        });

        return this;
    }

    /**
     * Finaliza a conexión coa Base de Datos
     */
    public async dbConnectionStop() {
        await this.db.close();

        return this;
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

    // ************************************************************************************************
    // ** UTILIDADES
    // ************************************************************************************************
    /**
     * Toma o número de versión a partir da versión definida no ficheiro json
     */
    public getAPIVersion():string {
        let apiFullVersion = process.env.npm_package_version.split(".");
        let apiPrefix = API_PREFIX;

        let result = `${apiPrefix}${apiFullVersion[0]}`;

        return result;
    }

}
