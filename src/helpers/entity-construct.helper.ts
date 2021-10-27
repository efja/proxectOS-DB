import { Utils } from '@mikro-orm/core';
import { MODELS_PATHS } from './models-paths.helper';

export async function getEntityForUpdate<T>(entity: T, className: string) {
    let result = await createClassFromName(className);

    for (let i in entity) {
        if ( Utils.isEntity(entity[i])) {
            result[i] = entity[i][0];
        } else if ( Utils.isCollection(entity[i])) {
            // TODO: tratar coleccións
        } else if (i != 'createdBy') {
            result[i] = entity[i];
        }
    }

    return result;
}

export async function createClassFromName(name: string) {
    var ns = await import(`../models/${MODELS_PATHS[name]}`);

    return new ns[name]();
}
