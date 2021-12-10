// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import qs from 'qs';
import moment from 'moment';
import { Types } from 'mongoose';
import { checkType } from './check-typeshelper';

// ##################################################################################################
// ## CLASE AssignedResource
// ##################################################################################################
export class APIFilter {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    public booleanFilters   : any[] = [];
    public dateFilters      : any[] = [];
    public numberFilters    : any[] = [];
    public objectIdFilters  : any[] = [];
    public orderByFilters   : any[] = [];
    public stringFilters    : any[] = [];

    public stringSensitive  : boolean = false;

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
            } else {
                let checksTypes = checkType(paramValue);

                if (checksTypes.isBoolean) {
                    this.booleanFilters.push(
                        { [paramKey] : Boolean(paramValue) }
                    );
                } else if (checksTypes.isNumber) {
                    this.numberFilters.push(
                        { [paramKey] : Number(paramValue) }
                    );
                } else if (checksTypes.isDate) {
                    let date = moment(paramValue, true); // Modo estricto

                    this.dateFilters.push(
                        // Para buscar dentro do mesmo día poñemos un rango de búsqueda entre a primeira hora e a última do mesmo
                        { [paramKey] : { '$gte' : date.startOf('day').toISOString(), '$lt': date.endOf('day').toISOString() } }
                    );
                } else if (checksTypes.isObjectID) {
                    this.objectIdFilters.push(
                        { [paramKey] : new Types.ObjectId(paramValue) }
                    );
                } else {
                    this.stringFilters.push(this.getStringFilter(paramKey, paramValue));
                }
            }
        }
    }

    private getStringFilter(key: string, filter: string, stringSensitive: boolean = this.stringSensitive): Object {
        let options : string = "g";

        if (!stringSensitive) {
            options += "i";
        }

        return { [key] : { '$re': new RegExp(filter, options) } }
    }

    private getObjectKeyValue(list: any[], result : Object) {
        for (let i = 0; i < list.length; i++) {
            let item = list[0];
            result[Object.keys(item)[0]] = Object.values(item)[0];
        }
    }

    public getQueryObj() {
        let result : Object = {};

        if (this.orderByFilters.length > 0) {
            result['orderBy'] = this.orderByFilters;
        }

        this.getObjectKeyValue(this.booleanFilters, result);
        this.getObjectKeyValue(this.numberFilters, result);
        this.getObjectKeyValue(this.dateFilters, result);
        this.getObjectKeyValue(this.stringFilters, result);
        this.getObjectKeyValue(this.objectIdFilters, result);

        return result;
    }
}
