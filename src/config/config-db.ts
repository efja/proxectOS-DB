// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Configuration, EntityManager, EntityRepository, Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MongoDriver } from '@mikro-orm/mongodb';

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
  protected dbms        : string;
  protected host        : string;
  protected port        : number;

  protected dbName      : string;

  protected user        : string;
  protected password    : string;
  protected clientUrl   : string;

  protected protocol    : string;

  public options        : Options;

  public orm            : MikroORM<MongoDriver>;

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    this.setOptionsFromEnv();
  }

  // ************************************************************************************************
  // ** GETTERS
  // ************************************************************************************************
  public async getOrm() {
    if (!this.orm) {
      await this.init();
    }

    return this.orm;
  }

  /**
   * Devolve a cadea de conexión co SXBD.
   *
   * @returns string
   */
  public getConnectionString() {
    return `${this.protocol}://${this.user}:*******@${this.host}:${this.port}/${this.dbName}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
  }

  // ************************************************************************************************
  // ** MÉTODOS CONFIGURACIÓN
  // ************************************************************************************************
  /**
   * Establece a configuración da BD cos parámetros do entorno de execución.
   */
  public setOptionsFromEnv() {
    this.setOptions(DBMS, DB_HOST, DB_PORT, DB_NAME, DB_LOGIN, DB_PASS,);
  }

  /**
   * Establece a configuración da BD con parámetros personalizados.
   *
   * @param dbms Sistema Xestor de Base de Datos (siglas en inglés)
   * @param host Máquina do DBMS
   * @param port Porto do servicio do DBMS
   * @param dbName Nome da BD
   * @param user Usuario de conexión
   * @param password Contrasinal
   */
  public setOptions(
    dbms      : string,
    host      : string,
    port      : string,
    dbName    : string,

    user      : string,
    password  : string
  ) {
    this.dbms     = dbms;
    this.host     = host;
    this.port     = Number(port);
    this.dbName   = dbName;
    this.user     = user;
    this.password = password;

    this.configure();
  }

  /**
   * Incia os parámteros do SXBD segundo os parámetros pasados no construtor.
   */
  public configure(): void {
    let uriOptions = "";

    this.options = {
      entities          : ['bin/models/*.js'],
      entitiesTs        : ['src/models/*.ts'],

      timezone          : '+02:00',

      metadataProvider  : TsMorphMetadataProvider,
    };

    switch (this.dbms) {
      case 'postgresql':
      case 'pgsql':
      case 'mongodb':
      case 'mongo':
      default:
        this.protocol = 'mongodb';
        this.options.type = 'mongo';
        this.options.highlighter = new MongoHighlighter();
        uriOptions = "?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"
        break;
    }

    this.options.clientUrl = `${this.protocol}://${this.user}:${this.password}@${this.host}:${this.port}/${this.dbName}${uriOptions}`;
  }

  // ************************************************************************************************
  // ** MÉTODOS DE INICIO E PARADA
  // ************************************************************************************************
  /**
   * Inicia os parámetros da conexión co SXBD.
   *
   * @returns Promise<boolean>
   */
  public async init(): Promise<DBConnection> {
    this.orm = await MikroORM.init<MongoDriver>(new Configuration(this.options, false));

    return this;
  }

  /**
   * Inicia a conexión co SXBD e devolve un string cá cadea de conexión.
   *
   * @returns Promise<string>
   */
  public async startInfo(): Promise<string> {
    try {
      await this.init();

      if (this.orm) {
        return `Conexión á BD correcta. Cadea de conexión <${this.getConnectionString()}>`;
      } else {
        throw new Error(`Erro ó conectar coa BD. Cadea de conexión <${this.getConnectionString()}>`);
      }
    } catch (error) {
      let result = new Error(`Erro ó iniciar a BD. Cadea de conexión <${this.getConnectionString()}>`);
      result.stack = error;

      throw result;
    }
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

  // ************************************************************************************************
  // ** MÉTODOS CONEXIÓN Á BD
  // ************************************************************************************************
  /**
   * Remata a conexión co SXBD.
   */
  public async checkConnection() {
    let result = {
      isConnected: false,
      orm: null
    };

    if (!this.orm) {
      await this.init();
    }

    result = {
      isConnected:  await this.orm.isConnected(),
      orm: this.orm
    };

    await this.orm.em.getDriver().close();
    return result;
  }

  /**
   * Devolve un repositorio de Mikro-orm para MongoDB.
   *
   * @param entityName nome da entidade da que se quere devolver o repositorio
   * @returns repositorio de Mikro-orm
   */
   public getRepository(entityName) {
    let result = null;

    if (this.orm) {
      result = this.orm.em.getRepository(entityName);
    }

    return result;
  }
}
