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
