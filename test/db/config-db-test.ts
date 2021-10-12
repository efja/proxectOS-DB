// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { SchemaGenerator } from '@mikro-orm/knex';
import { DBConnection } from '../../src/config/config-db';
import { BaseEntity } from '../../src/models/base-entity.model';
import { ConnectionOptions, MikroORM, Options, QueryResult } from '@mikro-orm/core';
import { Configuration, Connection } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { MongoDriver } from '@mikro-orm/mongodb';

// ####################################################################################################
// ## CLASE Priority
// ####################################################################################################
export class DBTestConnection {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  public options      : Options;
  public orm          : MikroORM<MongoDriver>;
  protected protocol  : string;

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor(
    dbms      : string,
    host      : string,
    port      : string,
    dbName    : string,

    user      : string,
    password  : string
  ) {
    this.options = {
      entities          : ['bin/models/*.js'],
      entitiesTs        : ['src/models/*.ts'],

      clientUrl: `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`,

      timezone          : '+02:00',
    }

    switch (dbms) {
      case 'postgresql':
      case 'pgsql':
        this.options.type = 'postgresql';
        this.protocol = 'postgres';
        break;
      case 'mongodb':
      case 'mongo':
      default:
        this.options.type = 'mongo';
        this.options.highlighter = new MongoHighlighter();
        this.protocol = 'mongodb';
        break;
    }
  }

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public async init() {
    this.orm = await MikroORM.init<MongoDriver>(new Configuration(this.options, false));

    return this;
  }

  public async close() {
    await this.orm.em.getDriver().close();

    return this;
  }

  public async dropAllData() {
    await this.orm.em.getDriver().dropCollections();
  }

  public async inicializeData(listObj: BaseEntity[], dropAllData: boolean = false) {
    if (this.orm) {
      if (dropAllData) {
          await this.dropAllData();
      }

      await this.orm.em.getDriver().createCollections();

      await this.orm.em.persist(listObj);
    } else {
      throw Error("Database connection not established");
    }
  }
}
