// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { MikroORM, Options } from '@mikro-orm/core';
import { Configuration } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { MongoDriver } from '@mikro-orm/mongodb';
import { CustomBaseEntity } from '../../src/models/base-entity.model';


// ####################################################################################################
// ## CLASE Priority
// ####################################################################################################
export class DBTestConnection {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected dbms      : string;
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
    this.dbms     = dbms;

    this.options = {
      entities    : ['bin/models/*.js'],
      entitiesTs  : ['src/models/*.ts'],

      clientUrl   : `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`,

      timezone    : '+02:00',
    }

    // Inicialización do servicio
    this.configure();
  }

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  /**
   * Incia os parámteros do SXBD segundo os parámetros pasados no construtor.
   */
  configure(): void {
    switch (this.dbms) {
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

  /**
   * Inicia os parámetros da conexión co SXBD.
   *
   * @returns Promise<boolean>
   */
  public async init() {
    this.orm = await MikroORM.init<MongoDriver>(new Configuration(this.options, false));

    return this;
  }

  /**
   * Remata a conexión co SXBD.
   */
  public async close() {
    if (this.orm) {
      await this.orm.em.getDriver().close();
    }

    return this;
  }

  /**
   * Elimina tódalas coleccións da BD.
   */
  public async dropAllData() {
    if (this.orm) {
      await this.orm.em.getDriver().dropCollections();
    }
  }

  /**
   * Inicializa a BD cos datos pasados como parámetro.
   *
   * @param listObj Lista de objexectos a introducir na BD
   * @param dropAllData Flag para decidir se debe borrar a información previa da BD ou non.
   */
  public async inicializeData(listObj: CustomBaseEntity[], dropAllData: boolean = false) {
    if (this.orm) {
      if (dropAllData) {
        try {
          await this.orm.em.removeAndFlush(listObj);
        } catch (error) {
          console.log('error dropAllData:>> ', error);
        }
      }

      await this.orm.em.getDriver().createCollections();

      try {
        await this.orm.em.persistAndFlush(listObj);
      } catch (error) {
        console.log('error persistAndFlush:>> ', error);
      }
    } else {
      throw Error("Database connection not established");
    }
  }
}
