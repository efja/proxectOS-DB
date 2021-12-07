// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import moment, { Moment } from "moment";

// ##################################################################################################
// ## FUNCIÓNS DE TRATAMENTO DE DATAS
// ##################################################################################################
/**
 * Convirte unha data (en formtato Moment | Date | string ) a un string co formato ISO 8601.
 *
 * @param date data a convertir
 * @param locale localización que se desexa empregar, por defecto España
 * @returns string
 */
export function date2LocaleISO(date: Moment | Date | string, locale: string = "es") {
    return  moment(date).locale(locale).toISOString();
}
