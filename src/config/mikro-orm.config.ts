// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { MikroORM } from '@mikro-orm/core';

// ####################################################################################################
// ## CONSTANTES
// ####################################################################################################
const {
    DBMS,
    DB_HOST,
    DB_PORT,
    DB_NAME,

    DB_LOGIN,
    DB_PASS,
} = process.env;

// ####################################################################################################
// ## CLASE Priority
// ####################################################################################################
export class DBConnection {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private options: Options = {
    entities    : ['bin/models/*.js'],
    entitiesTs  : ['src/models/mongodb/*.ts'],

    host        : DB_HOST,
    port        : Number(DB_PORT),
    dbName      : DB_NAME,
    password    : DB_PASS,
    user        : DB_LOGIN,
  };

  private protocol  : string;
  public orm        : MikroORM;

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    this.configure();
  }

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  configure() {

    switch (DBMS) {
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

  async start() {
    this.orm = await MikroORM.init(this.options);
  }

  async stop() {
    await this.orm.close();
  }

  getConnectionString() {
    return `${this.protocol}://${this.options.host}:${this.options.port}/${this.options.dbName}`;
  }
}
