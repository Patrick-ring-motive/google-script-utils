

globalThis.NewBlob=function(text){
  return HtmlService.createHtmlOutput(text).getAs('text/plain');
}


globalThis.NewHttpResponse=function(body,options){
  let res = {};
  body = `${body}`;
  res.headers = options?.headers||{};
  res.status = options?.status||200;
  res.getAllHeaders=function(){
	  return this.headers;
  };
  res.getHeaders=function(){
	 let flatHeaders={};
	 for (const h in res.headers) {
		flatHeaders[h]=`${res.headers[h]}`;
	}
	return flatHeaders;
  };
  
  res.body = body;
  res.bodyBlob = NewBlob(body);
  res.getContent = function(){
	  return this.bodyBlob.getBytes();
  };
  res.getContentText = function(charset){
	  if(!charset){
		  return this.body;
	  }
	  return this.bodyBlob.getDataAsString(charset);
  };
  res.getResponseCode=function(){
	return res.status;  
  };
  return res;
}


globalThis.UrlFetch = function(url,options){
  if(!options){
    options = {};
  }
    options.validateHttpsCertificates = false;
    options.mutHttpExceptions = true;
    options.escaping = false;
  return UrlFetchApp.fetch(url,options);
}

globalThis.zUrlFetch = function(url,options){
	try{
	  UrlFetchApp.fetch(url,options);
	}catch(e){
		return NewHttpResponse(`569 ${e.message}`,{status:569});
	}
}

function test() {
  console.log(zUrlFetch('asdf').getContentText());
}
