import { Utils } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { MODELS_PATHS } from './models-paths.helper';
import { checkType } from './check-typeshelper';
import { DBConnection } from '../config/config-db';

export async function getEntityForUpdate<T>(entity: T, className: string, db: DBConnection) {
    let result = await createClassFromName(className);
    let temp = clearEntity(entity);

    for (let prop of Object.keys(temp)) {
        let property = entity[prop]; // Tómase a propiedade da entidade orixinal porque o Utils.copy(entity) de @mikro-orm/core
                                     // empregado en clearEntity non conserva ben as propiedades das coleccións

        let checksProperty = checkType(property);

        if (checksProperty.isBoolean) {
            result[prop] = Boolean(property);

        } else if (
            (checksProperty.isCollection || checksProperty.isArray) &&
            !checksProperty.isObjectID
        ) {
            await assingObjectIdsToCollection(property, result[prop], db);

        } else if (checksProperty.isDate) {
            result[prop] = new Date(property.toString());

        } else if (checksProperty.isEntity) {
            result[prop] = new ObjectId(property["id"]);

        } else if (checksProperty.isNumber) {
            result[prop] = Number(property);

        } else if (checksProperty.isObjectID) {
            let propClass = getClassProperty(result, prop);
            result[prop] = db.getReference(propClass.type, new ObjectId(property));

        } else if (checksProperty.isString) {
            result[prop] = property;

        } else if (checksProperty.isObject || checksProperty.isPlainObject) {
            let propClass = getClassProperty(result, prop);
            let id = "";

            if (property["id"]) {
                id = property["id"];
            } else if (property["_id"]) {
                id = property["_id"];
            }

            if (id != "") {
                result[prop] = db.getReference(propClass.type, new ObjectId(id));
            }
        } else {
            result[prop] = property;
        }
    }

    return result;
}

export function clearEntity<T>(entity: T) {
    let result = Utils.copy(entity);

    for (let prop of Object.keys(entity)) {
        let property = entity[prop];
        let checksProperty = checkType(property);

        // Eliminase para evitar conflictos
        if (checksProperty.isUndefined || checksProperty.isNull) {
          delete result[prop];
        } else if (checksProperty.isCollection) {
            if (property.length == 0) {
                delete result[prop];
            }
        }
    }

    return result;
}

export async function assingObjectIdsToCollection(list: any, result, db: DBConnection) {
    let itemType = result.property.type;
    let listIsCollection = Utils.isCollection(list);

    let listValues = (listIsCollection)
        ? list.getItems()
        : list;

    for (let value of listValues) {
        let objId = null;

        if (listIsCollection) {
            objId = value._id;
        } else  {
            let checksObjId = checkType(value);

            if (checksObjId.isObjectID)
            {
                objId = new ObjectId(objId);
            }
        }


        if (objId)
        {
            let item = db.getReference(itemType, objId);
            result.add(item);
        }
    }
}

export async function createClassFromName(name: string, params?) {
    var ns = await import(`../models/${MODELS_PATHS[name]}`);

    return new ns[name](params);
}

export function getClassProperty(item, prop) {
    return item.__meta.props.find(x => x.name == prop)
}