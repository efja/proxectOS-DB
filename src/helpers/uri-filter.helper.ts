// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import qs from 'qs';
import moment from 'moment';
import { Types } from 'mongoose';
import { checkType } from './check-types.helper';

// ##################################################################################################
// ## CLASE AssignedResource
// ##################################################################################################
export class APIFilter {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    public arrayFilters: any[] = [];
    public booleanFilters: any[] = [];
    public dateFilters: any[] = [];
    public numberFilters: any[] = [];
    public objectIdFilters: any[] = [];
    public orderByFilters: any[] = [];
    public stringFilters: any[] = [];

    public special: any[] = [];
    public includes: boolean = false;
    public logicalOperator: string = ""; // TODO: implementar operacións OR, por defecto son AND
    public stringSensitive: boolean = false;

    // Relacións

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(filters?: any) {
        this.parseFilters(qs.parse(filters));
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
    /**
     * Extrae os filtros das propiedades dun obxecto e clasificaos polo tipo de datos.
     *
     * @param filters obxecto cunha colección de filtros como parámetros
     */
    private parseFilters(filters: any): void {
        for (let paramKey in filters as Object) {
            let paramValue = filters[paramKey];

            if (paramKey.toLowerCase() === 'sort' || paramKey.toLowerCase() === 'orderby') {
                this.orderByFilters = paramValue.split(',');
            } else if (paramKey.toLowerCase() === 'includes') {
                this.includes = Boolean(paramValue);
            } else if (paramKey.toLowerCase() === 'special') {
                this.special.push(paramValue);
            } else if (
                paramKey.toLowerCase() === 'logical' ||
                paramKey.toLowerCase() === 'operator' ||
                paramKey.toLowerCase() === 'op'
            ) {
                // só pode mandarse un operador lóxico.
                // Se se manda máis de un sobreescribese co valor do último
                this.logicalOperator = paramValue;
            } else {
                let checksTypes = checkType(paramValue);

                if (checksTypes.isBoolean) {
                    this.booleanFilters.push(
                        { [paramKey]: Boolean(paramValue) }
                    );
                } else if (checksTypes.isNumber) {
                    this.numberFilters.push(
                        { [paramKey]: Number(paramValue) }
                    );
                } else if (checksTypes.isDate) {
                    let date = moment(paramValue, true); // Modo estricto
                    let startDate = new Date(date.year(), date.month(), date.date(), 0, 0, 0);
                    let endDate = new Date(date.year(), date.month(), date.date(), 23, 59, 59);

                    this.dateFilters.push(
                        // Para buscar dentro do mesmo día poñemos un rango de búsqueda entre a primeira hora e a última do mesmo
                        { [paramKey]: { '$gte': startDate, '$lt': endDate } }
                    );
                } else if (checksTypes.isObjectID) {
                    this.objectIdFilters.push(
                        { [paramKey]: new Types.ObjectId(paramValue) }
                    );
                } else if (checksTypes.isCollection || checksTypes.isArray) {
                    this.arrayFilters.push(
                        { [paramKey]: paramValue }
                    );
                } else {
                    this.stringFilters.push(this.addStringFilter(paramKey, paramValue));
                }
            }
        }
    }

    /**
     * Devolve un obxecto coas distintas coleccións de parámetros de búsqueda.
     *
     * @returns Object
     */
    public getQueryObj(): Object {
        let result: Object = {};

        result['includes'] = this.includes;
        result['specialFilters'] = [];

        if (this.orderByFilters.length > 0) {
            result['orderBy'] = this.orderByFilters;
        }

        if (this.arrayFilters.length > 0) {
            result['specialFilters'].push(this.arrayFilters);
        }

        if (this.special.length > 0) {
            // Hai que meter por separado os valores de "this.special" para que non se intente acceder á unha propiedade
            // "special" nos modelos que non existe.
            result['specialFilters'].push(...this.special);
        }

        // if (this.logicalOperator != "") {
        //     result['logicalOperator'] = this.logicalOperator;
        // }

        this.getObjectKeyValue(this.booleanFilters, result);
        this.getObjectKeyValue(this.dateFilters, result);
        this.getObjectKeyValue(this.numberFilters, result);
        this.getObjectKeyValue(this.objectIdFilters, result);
        this.getObjectKeyValue(this.stringFilters, result);

        return result;
    }

    // **********************************************************************************************
    // ** UTILIDADES
    // **********************************************************************************************
    /**
     * Prepara un obxecto para un filtro de tipo string para engadir á colección.
     *
     * @param key clave do filtro
     * @param filter valores de filtrado
     * @param stringSensitive indica se se deben diferenciar as maiúsculas e minúsculas
     * @returns obxecto de filtrado por string
     */
    private addStringFilter(key: string, filter: string, stringSensitive: boolean = this.stringSensitive): Object {
        let options: string = "g";

        if (!stringSensitive) {
            options += "i";
        }

        return { [key]: { '$re': new RegExp(filter, options) } }
    }

    /**
     * Incorpora os atributos dun obxecto como elementos individuais dun array nominativo.
     *
     * @param obj obxecto a tratar
     * @param result array nominativo no que introducir os cambios
     */
    private getObjectKeyValue(obj: any[], result: Object) {
        for (let i = 0; i < obj.length; i++) {
            let property = obj[i];

            // Como indice do array empregase a key da propiedade e como valor todo o seu contido
            // o indice 0 é necesario porque Object.keys e Object.values devolve un array e neste caso de só un elemento
            result[Object.keys(property)[0]] = Object.values(property)[0];
        }
    }
}
