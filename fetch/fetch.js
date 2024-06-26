/* Partial fill in for ??= */
  globalThis.OP = function(obj,param,op,val){
    switch(op){
      case '??=':
        obj[param] = obj[param] ?? val;
        return obj[param];
    }
  }

/** 
* Creates a new HTTP response simulation. 
* @param {string} body - The response body as a string. 
* @param {Object} options - Configuration options for the response. * @return {Object} The simulated HTTP response. 
*/
globalThis.NewHttpResponse = function(body, options) {
    let res = {};
    body = `${body}`;
    res.headers = options?.headers || {};
    res.status = options?.status || 200;
    res.getAllHeaders = function() {
        return this.headers;
    };
    res.getHeaders = function() {
        let flatHeaders = {};
        for (const h in res.headers) {
            flatHeaders[h] = `${res.headers[h]}`;
        }
        return flatHeaders;
    };

    res.body = body;
    res.bodyBlob = Utilities.newBlob(body);
    res.getContent = function() {
        return this.bodyBlob.getBytes();
    };
    res.getAs = function (type){
      return this.bodyBlob.getAs(type);
    }
    res.getContentText = function(charset) {
        if (!charset) {
            return this.body;
        }
        return this.bodyBlob.getDataAsString(charset);
    };
    res.toString = function(){
      return this.body;
    };
    res.getResponseCode = function() {
        return res.status;
    };
    return res;
}

/** 
 * Fetches a URL with the given options. 
 * @param {string} url - The URL to fetch. 
 * @param {Object} options - The options for the fetch operation. 
 * @return {GoogleAppsScript.URL_Fetch.HTTPResponse} The response from the URL fetch. 
 */
globalThis.UrlFetch = function(url, options) {
    options = options??{};
    OP(options,'validateHttpsCertificates','??=',false);
    OP(options,'muteHttpExceptions','??=',true);
    OP(options,'escaping','??=',false);
    return UrlFetchApp.fetch(url, options);
}

/** 
 * Wrapper for UrlFetch that handles exceptions by returning a custom error response.
 * @param {string} url - The URL to fetch. 
 * @param {Object} options - The options for the fetch operation. 
 * @return {Object} The response object, either from the fetch or an error response. 
 */
globalThis.zUrlFetch = function(url, options) {
    try {
        return UrlFetch(url, options);
    } catch (e) {
        return NewHttpResponse(`569 ${e.message}`, {
            status: 569
        });
    }
}


globalThis.NewHttpRequest = function(url, options) {
    options = options??{};
    OP(options,'validateHttpsCertificates','??=',false);
    OP(options,'muteHttpExceptions','??=',true);
    OP(options,'escaping','??=',false);
    let req = UrlFetchApp.getRequest(url, options); 
    req.validateHttpsCertificates = options.validateHttpsCertificates ?? false;
    req.muteHttpExceptions = options.muteHttpExceptions ?? true;
    req.escaping = options.escaping ?? false;
  return req;
}


globalThis.zNewHttpRequest = function(url, options) {
    options = options??{};
    OP(options,'validateHttpsCertificates','??=',false);
    OP(options,'muteHttpExceptions','??=',true);
    OP(options,'escaping','??=',false);
    console.log(options);
    let req = {}
    try{
      req = UrlFetchApp.getRequest(url, options); 
    }catch(e){
      req = UrlFetchApp.getRequest('https://www.google.com', options); 
      req.url = url;
    }
    try{delete req.headers['X-Forwarded-For']}catch(e){}
    req.validateHttpsCertificates = options.validateHttpsCertificates ?? false;
    req.muteHttpExceptions = options.muteHttpExceptions ?? true;
    req.escaping = options.escaping ?? false;
  return req;
}

globalThis.UrlFetchAll=function(requests){
  for(let i = 0;i<requests.length;i++){
      requests[i] = NewHttpRequest(requests[i].url,requests[i]);
      delete requests[i].headers['X-Forwarded-For'];
  }
  return UrlFetchApp.fetchAll(requests);
}

globalThis.zUrlFetchAllSync=function(requests){
  let responses = [];
    for(let i = 0;i<requests.length;i++){
      let req = zNewHttpRequest(requests[i].url,requests[i]);
        responses.push(zUrlFetch(req.url,req));
    }
    return responses;
}

globalThis.zUrlFetchAll=function(requests){
  try{
    return UrlFetchAll(requests);
  }catch(e){
    return zUrlFetchAllSync(requests);
  }
}

globalThis.HttpEvent=function(e){
  e = e ?? {};
  OP(e,'equeryString','??=','');
  OP(e,'parameter','??=',{});
  OP(e,'parameters','??=',{});
  OP(e,'pathInfo','??=','');
  OP(e,'contextPath','??=','');
  OP(e,'postData','??=',{});
  OP(e.postData,'contents','??=','');
  OP(e.postData,'length','??=',e?.postData?.contents?.length||0);
  OP(e,'contentLength','??=',e?.postData?.length||0);
  OP(e.postData,'type','??=',"text/plain");
  OP(e.postData,'name','??=',"postData");
  return e;
}

function test(e) {
  let req = NewHttpRequest('https://www.google.com');
  console.log(req)
  let req2 = zNewHttpRequest('asdf');
  delete req.headers['X-Forwarded-For'];
    console.log(zUrlFetchAll([req,req2]));
   // console.log(zUrlFetch('https://www.google.com'));
    // console.log(zUrlFetch('asdf'))
}
