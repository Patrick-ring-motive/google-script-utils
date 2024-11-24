
function myFunctionExample() {
  let myURL = 'poophttps://www.google.com';
  let x =  zUrlFetch(myURL);
  console.log(x.getResponseCode(),x.getContentText());
}

const contentTypes = {
    ".aac": "audio/aac",
    ".abw": "application/x-abiword",
    ".apng": "image/apng",
    ".arc": "application/x-freearc",
    ".avif": "image/avif",
    ".avi": "video/x-msvideo",
    ".azw": "application/vnd.amazon.ebook",
    ".bin": "application/octet-stream",
    ".bmp": "image/bmp",
    ".bz": "application/x-bzip",
    ".bz2": "application/x-bzip2",
    ".cda": "application/x-cdf",
    ".cgs": "text/javascript",
    ".cgsx": "text/javascript",
    ".cgsw": "text/javascript",
    ".cjs": "text/javascript",
    ".cjsx": "text/javascript",
    ".cjsw": "text/javascript",
    ".cts": "text/javascript",
    ".ctsx": "text/javascript",
    ".ctsw": "text/javascript",
    ".csh": "application/x-csh",
    ".css": "text/css",
    ".scss": "text/css",
    ".csv": "text/csv",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".eot": "application/vnd.ms-fontobject",
    ".epub": "application/epub+zip",
    ".gs": "text/javascript",
    ".gsx": "text/javascript",
    ".gsw": "text/javascript",
    ".gz": "application/gzip",
    ".gif": "image/gif",
    ".htm": "text/html",
    ".html": "text/html",
    ".ico": "image/vnd.microsoft.icon",
    ".ics": "text/calendar",
    ".jar": "application/java-archive",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript",
    ".jsx": "text/javascript",
    ".jsw": "text/javascript",
    ".json": "application/json",
    ".jsonld": "application/ld+json",
    ".mid": "audio/midi, audio/x-midi",
    ".midi": "audio/midi, audio/x-midi",
    ".mgs": "text/javascript",
    ".mgsx": "text/javascript",
    ".mgsw": "text/javascript",
    ".mjs": "text/javascript",
    ".mjsx": "text/javascript",
    ".mjsw": "text/javascript",
    ".mts": "text/javascript",
    ".mtsx": "text/javascript",
    ".mtsw": "text/javascript",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".mpeg": "video/mpeg",
    ".mpkg": "application/vnd.apple.installer+xml",
    ".odp": "application/vnd.oasis.opendocument.presentation",
    ".ods": "application/vnd.oasis.opendocument.spreadsheet",
    ".odt": "application/vnd.oasis.opendocument.text",
    ".oga": "audio/ogg",
    ".ogv": "video/ogg",
    ".ogx": "application/ogg",
    ".opus": "audio/ogg",
    ".otf": "font/otf",
    ".png": "image/png",
    ".pdf": "application/pdf",
    ".php": "application/x-httpd-php",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".rar": "application/vnd.rar",
    ".rtf": "application/rtf",
    ".sh": "application/x-sh",
    ".svg": "image/svg+xml",
    ".tar": "application/x-tar",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".ts": "text/javascript",
    ".tsx": "text/javascript",
    ".tsw": "text/javascript",
    ".ttf": "font/ttf",
    ".txt": "text/plain",
    ".vsd": "application/vnd.visio",
    ".wav": "audio/wav",
    ".weba": "audio/webm",
    ".webm": "video/webm",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".xhtml": "application/xhtml+xml",
    ".xjs": "text/javascript",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xml": "application/xml",
    ".xul": "application/vnd.mozilla.xul+xml",
    ".zip": "application/zip",
    ".3gp": "video/3gpp",
    ".3g2": "video/3gpp2",
    ".7z": "application/x-7z-compressed"
};



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
    objDefProp(resProto,'bodyBlob',Utilities.newBlob([...res.body].map(x=>x.charCodeAt())));
    res.getContent = function getContent() {
        return this?.bodyBlob?.getBytes?.();
    };
    res.getAs = function getAs(type){
      return this?.bodyBlob?.getAs?.(type);
    }
    res.getBlob = function getBlob(type){
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
  const end = String(url).split('?')[0].split('#')[0].split('.').pop();
  options.headers = options.headers ?? {};
  options.headers['content-type'] = 'text/html';
  if(contentTypes[end]){
    options.headers['content-type'] = contentTypes[end];
  }
  const response = sheetFetch(url);
  if(response == '#N/A'){throw response;}
  const res = NewHttpResponse(sheetFetch(response),options);
  return res;
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
        return UrlFetchAll(zNewHttpRequest(String(url), options))[0];
      } catch {
        try {
            return UrlSheetFetch(String(url), options);
        } catch {
            const match = fuzzyMatch(e.message);
            let code = 569;
            if (match[2] >= 2) {
              code = +match[0] || 569;
            }
            return NewHttpResponse(`${code} ${e.message}`, {
                status: code
            });
        }
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


