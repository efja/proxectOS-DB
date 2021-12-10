import { Utils } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { MODELS_PATHS } from './models-paths.helper';
import { checkType } from './check-typeshelper';
import { DBConnection } from '../config/config-db';

export async function getEntityForUpdate<T>(original: T, newData: T, className: any, db: DBConnection) {
    let result = new className();

    for (let prop of Object.keys(newData)) {
        let property = newData[prop];

        let checksProperty = checkType(property);

        try {
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
                result[prop] = getReference(db, propClass.type, new ObjectId(property));

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
                    result[prop] = getReference(db, propClass.type, new ObjectId(id));
                }
            } else {
                result[prop] = property;
            }

        } catch (error) {
            let aa = ""
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

    for (let index in list) {
        let value = list[index];
        let objId = null;
        let checksValue = checkType(value);

        if (checksValue.isObjectID) {
            objId = new ObjectId(value);
        } else if (checksValue.isObject) {
            objId = value._id;
        }

        if (objId) {
            let item = getReference(db, itemType, objId);
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

export function getClassName(item) {
    return item.__meta.name
}


/**
 * Devolve unha referencia a un obxecto de Mikro-orm para MongoDB.
 *
 * @param entityName nome da entidade da que se quere devolver o repositorio
 * @returns referencia de Mikro-orm
 */
export function getReference(db, entityName, objId: ObjectId) {
    let result = null;

    const repo = db.getRepository(entityName);
    result = repo.getReference(objId, true); // Non sei porque dá fallo o lintern

    return result;
}
