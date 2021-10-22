// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { BaseEntity, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

// ####################################################################################################
// ## CLASE Priority
// ####################################################################################################
export abstract class CustomBaseEntity extends BaseEntity<CustomBaseEntity, 'id'> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************

  @PrimaryKey()
  public _id!       : ObjectId;

  @SerializedPrimaryKey()
  public id!        : string;

  @Property()
  public createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  public updatedAt  : Date = new Date();

  // Relacións

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
}