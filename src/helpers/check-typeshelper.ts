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
        isArray         : (obj) ? isArray(obj) : false,
        isBoolean       : (obj) ? isBoolean(obj) : false,
        isCollection    : (obj) ? Utils.isCollection(obj) : false,
        isDate          : (obj) ? isDate(obj) : false,
        isDefined       : (obj) ? Utils.isDefined(obj) : false,
        isEntity        : (obj) ? Utils.isObject(obj) : false,
        isNull          : isNull(obj),
        isNumber        : (obj) ? isNumber(obj) : false,
        isObject        : (obj) ? Utils.isObject(obj) : false,
        isObjectID      : (obj) ? isObjectID(obj) : false,
        isString        : (obj) ? isString(obj) : false,
        isUndefined     : (obj != null) ? isUndefined(obj) : false,
    };

    return result;
}

export function isArray(obj) {
    let result = false;

    if (obj) {
        try {
            if (isString(obj)) {
                result = isJSONArray(JSON.parse(obj));
            } else {
                result = isJSONArray(obj);
            }
        } catch {
            result = false;
        }
    }

    return result;
}

export function isDate(obj) {
    let result = false;

    if (obj) {
        try {
            if (
                !isString(obj) &&
                !isObjectID(obj)
            ) {
                result = moment(new Date(obj.toString()), true).isValid();
            }
        } catch {
            result = false;
        }
    }

    return result;
}

export function isObjectID(obj) {
    let result = false;

    if (obj) {
        try {
            if (isString(obj)) {
                result = (String)(new Types.ObjectId(obj)) === obj;
            } else {
                result = Utils.isObjectID(obj);
            }
        } catch {
            result = false;
        }
    }

    return result;
}
