export interface ResponseData {
    code        : number,
    data        : any,
    total?      : number,
    from?       : number,
    limit?      : number,
    message?    : string,
    error?      : string,
}

export interface ResultQuery {
  code    : number,
  data    : any,
  from?   : number,
  limit?  : number,
}

export interface ResultCheckType {
  getObjectType   : any,
  isArray         : boolean,
  isBoolean       : boolean,
  isCollection    : boolean,
  isDate          : boolean,
  isDefined       : boolean,
  isEntity        : boolean,
  isNull          : boolean,
  isNumber        : boolean,
  isObject        : boolean,
  isObjectID      : boolean,
  isString        : boolean,
  isUndefined     : boolean,
}
