globalThis.UrlFetch = function(url,options){
  return UrlFetchApp.fetch(url,{validateHttpsCertificates:false,muteHttpExceptions:true,escaping:false});
}
