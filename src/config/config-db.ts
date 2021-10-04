// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { EntityManager, EntityRepository, Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

// ####################################################################################################
// ## CLASE Priority
// ####################################################################################################
export class DBConnection {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected dbms      : string;
  protected host      : string;
  protected port      : number;

  protected dbName    : string;

  protected user      : string;
  protected password  : string;

  protected protocol  : string;

  public options      : Options;

  public orm          : MikroORM;

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
    // Inicialización de atriburtos
    this.dbms     = dbms;
    this.host     = host;
    this.port     = Number(port);
    this.dbName   = dbName;
    this.user     = user;
    this.password = password;

    this.options = {
      entities          : ['bin/models/*.js'],
      entitiesTs        : ['src/models/*.ts'],

      host              : this.host,
      port              : this.port,
      dbName            : this.dbName,
      user              : this.user,
      password          : this.password,

      timezone          : '+02:00',

      metadataProvider  : TsMorphMetadataProvider,
    };

    // Inicialización do servicio
    this.configure();
  }

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  /**
   * Incia os parámteros do SXBD segundo os parámetros pasados no construtor.
   */
  configure() {
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
  public async init():Promise<boolean> {
    let result:boolean = true;

    try {
      this.orm = await MikroORM.init(this.options);
    } catch (error) {
      result = false;
    }

    return result;
  }

  /**
   * Inicia a conexión co SXBD
   *
   * @returns string
   */
  async start() {
    try {
      let connected = await this.init();

      if (connected) {
        return `Conexión á BD correcta. Cadea de conexión <${this.getConnectionString()}>`;
      } else {
        throw new Error(`Erro ó conectar coa BD. Cadea de conexión <${this.getConnectionString()}>`);
      }
    } catch (error) {
      let result = new Error(`Erro ó conectar coa BD. Cadea de conexión <${this.getConnectionString()}>`);
      result.stack = error;

      throw result;
    }
  }

  /**
   * Remata a conexión co SXBD
   */
  async stop() {
    if (this.orm) {
      await this.orm.close();
    }
  }

  /**
   * Devolve a cadea de conexión co SXBD
   *
   * @returns string
   */
  getConnectionString() {
    return `${this.protocol}://${this.options.host}:${this.options.port}/${this.options.dbName}`;
  }
}
