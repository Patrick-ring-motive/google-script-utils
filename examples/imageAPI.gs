
globalThis.btoa = function btoa(data){
  return Utilities.base64Encode(...arguments);
};

function doPost(req={}) {
  return doRequest(req,'POST');
}

function doGet(req={}) {
  return doRequest(req,'GET');
}

function doRequest(req,method='GET') {
  const query = decodeURIComponent(String(req?.parameter?.query));
  const res = googleSearch(query);
  const contentType = `${res?.getHeaders?.()?.['Content-Type']}`;
  return  ContentService.createTextOutput(`data:${contentType};base64,${btoa(res.getContent())}`);
}

function googleSearch(query){
  const cx = '836a4d6acf6874cef';
  const cxurl = 'https://cse.google.com/cse.js?hpg=1&cx=' + cx;
  const google_cse_tok = JSONExtract(zUrlFetch(cxurl).getContentText(),"cse_token");
  const cse_url = `https://cse.google.com/cse/element/v1?rsz=1&num=1&hl=en&source=gcsc&gss=.com&cx=${cx}&q=${query}&safe=off&cse_tok=${google_cse_tok}&lr=&cr=&gl=&filter=1&sort=&as_oq=&as_sitesearch=&exp=csqr%2Ccc&oq=${query}&nfpr=1&cseclient=hosted-page-client&callback=google.search.cse.api&searchType=image&num=1`;
  const searchResult = zUrlFetch(cse_url).getContentText();
  const imageURL = JSONExtract(searchResult,searchResult.match(/ogImage|src/)?.[0]??'url');
  return zUrlFetch(imageURL);
}

function JSONExtract(raw, key) {
  const $ = String;
  const json_key = '"' + key + '"';
  const json_val = $($(raw).split($(json_key))[1]).split('"')[1];
  return json_val;
}
