/** ScriptID for Library import: 1wV9VS-iD51TTBseNrW6dzSF3l6x_gayn7ETOJIjx0YIAb4N_WhxLhED4 **/
/** 
* Creates a new Blob from the given text. 
* @param {string} text - The text to create a Blob from. 
* @return {GoogleAppsScript.Base.Blob} The created Blob. 
*/
globalThis.NewBlob = function(text) {
    return HtmlService.createHtmlOutput(text).getAs('text/plain');
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
    res.bodyBlob = NewBlob(body);
    res.getContent = function() {
        return this.bodyBlob.getBytes();
    };
    res.getContentText = function(charset) {
        if (!charset) {
            return this.body;
        }
        return this.bodyBlob.getDataAsString(charset);
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
    if (!options) {
        options = {};
    }
    options.validateHttpsCertificates = false;
    options.mutHttpExceptions = true;
    options.escaping = false;
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
        return UrlFetchApp.fetch(url, options);
    } catch (e) {
        return NewHttpResponse(`569 ${e.message}`, {
            status: 569
        });
    }
}

function test() {
    console.log(zUrlFetch('asdf').getContentText());
}
