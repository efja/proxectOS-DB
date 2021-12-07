// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { MikroORM, Options } from '@mikro-orm/core';
import { Configuration } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { MongoDriver, ObjectId } from '@mikro-orm/mongodb';
import { CustomBaseEntity } from '../../src/models/custom-base-entity.model';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';


// ##################################################################################################
// ## CLASE Priority
// ##################################################################################################
export class DBTestConnection {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected dbms      : string;
  protected host      : string;
  protected port      : number;

  protected dbName    : string;

  protected user      : string;
  protected password  : string;
  protected clientUrl : string;
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
    this.host     = host;
    this.port     = Number(port);
    this.dbName   = dbName;
    this.user     = user;
    this.password = password;

    this.options = {
      entities          : ['bin/models/*.js'],
      entitiesTs        : ['src/models/*.ts'],

      timezone          : '+02:00',

      metadataProvider  : TsMorphMetadataProvider,
      // debug             : true,
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
    let uriOptions = "";

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
   * Elimina os datos pasados por parámetro da BD.
   *
   * @param listObj Lista de objexectos a eliminar na BD
   */
  public async dropAllData(listObj: CustomBaseEntity[]) {
    if (this.orm) {
      try {
        await this.orm.em.removeAndFlush(listObj);
      } catch (error) {
        console.log('error dropAllData:>> ', error);
      }
    }
  }

  /**
   * Crea tódalas coleccións da BD balerias.
   */
  public async createCollections() {
    if (this.orm) {
      await this.orm.em.getDriver().createCollections();
    }
  }

  /**
   * Elimina tódalas coleccións da BD.
   */
  public async dropCollections() {
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
  public async inicializeData(listObj: any[], dropAllData: boolean = false) {
    if (this.orm) {
      if (dropAllData) {
        await this.dropAllData(listObj);
      }

      await this.createCollections();

      try {
        for (let obj of listObj) {
          if (obj.id != null) {
            if (obj.id){
              obj._id = new ObjectId(obj.id);
            }
          }
        }

        await this.orm.em.persistAndFlush(listObj);
      } catch (error) {
        console.log('error persistAndFlush:>> ', error);
      }
    } else {
      throw Error("Database connection not established");
    }
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
