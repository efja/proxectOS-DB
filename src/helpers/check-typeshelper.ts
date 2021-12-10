import { Utils } from '@mikro-orm/core';
import moment from 'moment';
import { Types } from 'mongoose';
import {
    isJSONValue,
    isJSONObject,
    isJSONArray,
    isString,
    isNumber,
    isBoolean,
    isNull,
    isUndefined,
    JSONObject,
    JSONValue,
    JSONArray,
} from "types-json";

import { ResultCheckType } from '../interfaces/response-data.interface';

export function checkType(obj) : ResultCheckType {
    let result : ResultCheckType = {
        getObjectType   : (obj) ? Utils.getObjectType(obj) : false,
        isArray         : (obj) ? isJSONArray(obj) : false,
        isBoolean       : (obj) ? isBoolean(obj) : false,
        isCollection    : (obj) ? Utils.isCollection(obj) : false,
        isDate          : false,
        isDefined       : (obj) ? Utils.isDefined(obj) : false,
        isEntity        : (obj) ? Utils.isObject(obj) : false,
        isNull          : isNull(obj),
        isNumber        : (obj) ? isNumber(obj) : false,
        isObject        : (obj) ? Utils.isObject(obj) : false,
        isObjectID      : (obj) ? Utils.isObjectID(obj) : false,
        isString        : (obj) ? isString(obj) : false,
        isUndefined     : (obj != null) ? isUndefined(obj) : false,
    };

    if (obj) {
        try {
            if (!result.isArray && result.isString) {
                let aaa = JSON.parse(obj);
                result.isArray = isJSONArray(JSON.parse(obj));
            }
        } catch { }

        try {
            if (!result.isDate && !Utils.isObjectID(obj)) {
                result.isDate = moment(obj.toString(), true).isValid();
            }
        } catch { }

        try {
            if (!result.isObjectID && (result.isString)) {
                result.isObjectID = (String)(new Types.ObjectId(obj)) === obj;
            }
        } catch { }

        try {
            if (!result.isCollection && result.isString) {
                result.isCollection = (String)(new Types.ObjectId(obj)) === obj;
            }
        } catch { }
    }

    return result;
}