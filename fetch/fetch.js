/** Short hand utils for objects */
const objDoProp = (obj, prop, def, enm, mut) => Object.defineProperty(obj, prop, {
    value: def,
    writable: mut,
    enumerable: enm,
    configurable: mut
});
const objDefProp=(obj, prop, def) => objDoProp (obj, prop, def, false, true);
const objDefEnum=(obj, prop, def) => objDoProp (obj, prop, def, true, true);
const objFrzProp=(obj, prop, def) => objDoProp (obj, prop, def, false, false);
const objFrzEnum=(obj, prop, def) => objDoProp (obj, prop, def, true, false);

const clearHeaders = function clearHeaders(headers = {}){
    headers = headers?.headers ?? headers;
    try{
      delete headers['X-Forwarded-For']
    }catch{
      try{
        if(headers['X-Forwarded-For']){
          objDefProp(headers,'X-Forwarded-For',undefined);
        }
      }catch{}
    }
    return headers;
};

/** 
* Creates a new HTTP response simulation. 
* @param {string} body - The response body as a string. 
* @param {Object} options - Configuration options for the response. * @return {Object} The simulated HTTP response. 
*/
globalThis.NewHttpResponse = function NewHttpResponse(body, options = {}) {
    const resProto = {};
    const res = Object.create(resProto);
    objDefProp(resProto,'body',String(body));
    objDefProp(resProto,'headers',options?.headers || {});
    objDefProp(resProto,'status',options?.status || 200);
    res.getAllHeaders = function getAllHeaders() {
        return this.headers;
    };
    res.getHeaders = function getHeaders() {
        const flatHeaders = {};
        for (const h in res.headers) {
            flatHeaders[h] = String(res.headers[h]);
        }
        return flatHeaders;
    };
    objDefProp(resProto,'bodyBlob',Utilities.newBlob(res.body));
    res.getContent = function getContent() {
        return this?.bodyBlob?.getBytes?.();
    };
    res.getAs = function getAs(type){
      return this?.bodyBlob?.getAs?.(type);
    }
    res.getBlob = function getAs(type){
      return this?.bodyBlob;
    }
    res.getContentText = function getContentText(charset) {
        if (!charset) {
            return this.body;
        }
        return this.bodyBlob.getDataAsString(charset);
    };
    res.toString = function toString(){
      return this.body;
    };
    res.getResponseCode = function getResponseCode() {
        return res.status;
    };
    return res;
};

/** 
 * Default options for http requests. 
 * Different from what google picks for defaults 
 */
const defaultOptions = {
  validateHttpsCertificates : false,
  muteHttpExceptions : true,
  escaping : false,
};

/** 
 * Fetches a URL with the given options. 
 * @param {string} url - The URL to fetch. 
 * @param {Object} options - The options for the fetch operation. 
 * @return {GoogleAppsScript.URL_Fetch.HTTPResponse} The response from the URL fetch. 
 */
globalThis.UrlFetch = function UrlFetch(url, options = {}) {
    return UrlFetchApp.fetch(url, {...defaultOptions, ...options});
};

globalThis.UrlSheetFetch = function UrlSheetFetch(url, options = {}){
  return NewHttpResponse(sheetFetch(url),options);
};

/** 
 * Wrapper for UrlFetch that handles exceptions by returning a custom error response.
 * @param {string} url - The URL to fetch. 
 * @param {Object} options - The options for the fetch operation. 
 * @return {Object} The response object, either from the fetch or an error response. 
 */
globalThis.zUrlFetch = function zUrlFetch(url, options) {
    try {
        return UrlFetch(String(url), options);
    } catch (e) {
      try {
          return UrlSheetFetch(String(url), options);
      } catch (e) {
          return NewHttpResponse(`569 ${e.message}`, {
              status: 569
          });
      }
    }
};


globalThis.NewHttpRequest = function NewHttpRequest(url, options = {}) {
    const allOptions = {...defaultOptions, ...options};
    return Object.assign(UrlFetchApp.getRequest(url, allOptions),allOptions);
};


globalThis.zNewHttpRequest = function zNewHttpRequest(url, options = {}) {
    const allOptions = {...defaultOptions, ...options};
    let req = {};
    try{
      req = Object.assign(UrlFetchApp.getRequest(String(url), allOptions),allOptions);
    }catch(e){
      req = Object.assign(UrlFetchApp.getRequest('https://www.google.com', allOptions),allOptions); 
      req.url = url;
    }
    clearHeaders(req);
  return req;
};

globalThis.UrlFetchAll = function UrlFetchAll(requests){
 return UrlFetchApp.fetchAll(requests.map(x=>{
    const req = NewHttpRequest(x.url,x);
    clearHeaders(req);
    return req;
  }));
};

globalThis.zUrlFetchAllSync = function zUrlFetchAllSync(requests = []){
  return requests.map(x=>{
    const req = zNewHttpRequest(x.url,x);
    clearHeaders(req);
    return zUrlFetch(req.url,req);
  });
};

globalThis.zUrlFetchAll = function zUrlFetchAll(requests){
  try{
    return UrlFetchAll(requests);
  }catch(e){
    return zUrlFetchAllSync(requests);
  }
};

const defaultEvent = { 
  equeryString: '',
  parameter: {},
  parameters: {},
  pathInfo: '',
  contextPath: '',
  postData: {
     contents: '', 
     length: 0, 
     type: 'text/plain', 
     name: 'postData' 
  },
  contentLength: 0 
};

globalThis.HttpEvent = function HttpEvent(e = {}){
  return {...defaultEvent, ...e};
};

function sheetFetch(url){
  const sheetFetchFile = SpreadsheetApp.openById('118Ty5Y5humiZz3G9xOHbW9zgZCh3NkdSRI3oLIZ3lQQ');
  const sheetFetchService = sheetFetchFile.getSheetByName("fetch");
    let col;
    let cell;
    const columns = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  try{
    col = getColumnLock(sheetFetchFile,sheetFetchService);
    cell = sheetFetchFile.setCurrentCell(sheetFetchService.getRange(`${col}2`));
    cell.setValue(`=IMPORTDATA("${url}","${decodeURIComponent('%EE%87%AF')}")`);
    SpreadsheetApp.flush();
    const cells = sheetFetchService.getRange(2,columns.indexOf(col)+1,sheetFetchService.getLastRow(),1).getValues();
    const fetchedValue = cells.join('\n').trim();
    return fetchedValue;
  }catch(e){
    return e.message;
  }finally{
    (async ()=>{
      cell.setValue('');
      cell = sheetFetchFile.setCurrentCell(sheetFetchService.getRange(`${col}1`));
      cell.setValue('');
    })();
  }
}

function getColumnLock(sheetFetchFile,sheetFetchService){
  const myID = new Date().getTime();
  const columns = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let col = 'A';
  let cell;

  for(let i = 0;i<1000;i++){
    col = columns[getRandomInt(26)];
    cell = sheetFetchFile.setCurrentCell(sheetFetchService.getRange(`${col}1`));
    cell.setValue(myID);
    if(cell.getValues()[0] == myID){
      return col;
    }
  }
  return col;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function test(e) {
  let req = NewHttpRequest('https://www.google.com');
  console.log('req',req)
  let req2 = zNewHttpRequest('asdf');
  console.log('req.headers1',req.headers);
  delete req.headers['X-Forwarded-For'];
  console.log('req.headers2',req.headers);
  const res1 = UrlFetch('https://www.google.com',{validateHttpsCertificates:true,poop:false});
  console.log('res1',res1);
  console.log('res1text',res1.getContentText());
  const res2 = UrlSheetFetch('https://www.google.com',{validateHttpsCertificates:true,poop:false});
  console.log('res2',res1);
  console.log('res2text',res2.getContentText());
  console.log('asdf',zUrlFetch('asdf'))
  console.log('res1status',res1.getHeaders().constructor);
}
