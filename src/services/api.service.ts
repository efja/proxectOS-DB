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

// ####################################################################################################
// ## CLASE APP
// ####################################################################################################
export class App {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    private app         : Application;
    private host        : string | number;
    private port        : string | number;
    private apiVersion  : string | number;

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor() {
        this.app        = express();
        this.host       = process.env.APP_HOST;
        this.port       = process.env.APP_PORT;
        this.apiVersion = this.getAPIVersion();

        this.middlewares();
        this.languages();
        this.routes();
        this.start();
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
    /**
     * Toma o número de versión a partir da versión definida no ficheiro json
     */
    public getAPIVersion():string {
        let apiFullVersion = process.env.npm_package_version.split(".");
        let apiPrefix = process.env.API_PREFIX;

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
        this.app.listen(this.port, () => {
            console.log(colors.bgBlue(`Aplicación levantada en: ${this.host}:${this.port}/api/${this.apiVersion}/`));
        });
    }

    /**
     * Devolve a instancia desta clase
     *
     * @returns unha instancia desta clase
     */
    public getApp(): Application {
        return this.app;
    }
}
