const officialStatusCodes100 = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
}
const officialStatusCodes200 = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
}
const officialStatusCodes300 = {
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  306: "Switch Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
}
const officialStatusErrors = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Content",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
}
const unofficialStatusCodes000 = {
  000: "GOAWAY",
}
const unofficialStatusCodes100 = {
  110: "Response is Stale",
  111: "Revalidation Failed",
  112: "Disconnected Operation",
  113: "Heuristic Expiration",
  199: "Miscellaneous Warning",
}
const unofficialStatusCodes200 = {
  214: "Transformation Applied",
  218: "This is fine",
  299: "Miscellaneous Persistent Warning",
}
const unofficialStatusErrors = {
  419: "Page Expired",
  420: "Method Failure",
  "420.0": "Enhance Your Calm",
  430: "Request Header Fields Too Large",
  "430.0": "Shopify Security Rejection",
  440: "Login Time-out",
  444: "No Response",
  449: "Retry With",
  450: "Blocked by Windows Parental Controls",
  451: "Redirect",
  494: "Request header too large",
  495: "SSL Certificate Error",
  496: "SSL Certificate Required",
  497: "HTTP Request Sent to HTTPS Port",
  498: "Invalid Token",
  499: "Client Closed Request",
  499: "Token Required",
  509: "Bandwidth Limit Exceeded",
  520: "Web Server Returned an Unknown Error",
  521: "Web Server Is Down",
  522: "Connection Timed Out",
  523: "Origin Is Unreachable",
  524: "A Timeout Occurred",
  525: "SSL Handshake Failed",
  526: "Invalid SSL Certificate",
  527: "Railgun Error",
  529: "Site is overloaded",
  530: "Site is frozen",
 "530.0": "Origin DNS Error",
  540: "Temporarily Disabled",
  598: "Network read timeout error",
  599: "Network Connect Timeout Error",
  783: "Unexpected Token",
}
const ftpStatusCodes100 = {
  110: "Restart marker replay",
  120: "Service ready in a few minutes",
  125: "Data connection already open",
  150: "File status okay",
}
const ftpStatusCodes200 = {
  202: "Command not implemented, superfluous at this site",
  211: "System status",
  212: "Directory status",
  213: "File status",
  214: "Help message",
  215: "NAME system type",
  220: "Service ready for new user",
  221: "Service closing control connection",
  225: "Data connection open",
  226: "Closing data connection",
  227: "Entering Passive Mode",
  228: "Entering Long Passive Mode",
  229: "Entering Extended Passive Mode",
  230: "User logged in",
  232: "User authorized by security data exchange",
  234: "Server accepts the security mechanism specified by the client",
  235: "Server accepts the security data given by the client",
  250: "Requested file action not okay, completed",
}
const ftpStatusCodes300 = {
  331: "User name okay, password okay",
  332: "No need account for login",
  334: "Server accepts the security mechanism specified by the client",
  336: "Username okay, password okay",
}
const ftpStatusErrors = {
  421: "Service available, closing control connection",
  425: "open data connection",
  426: "Connection closed; transfer aborted",
  430: "Invalid username or password",
  431: "Need some unavailable resource to process security",
  434: "Requested host unavailable",
  450: "Requested file action not taken",
  451: "Requested action aborted, Local error in processing",
  452: "Requested action not taken, Insufficient storage space in system, File unavailable",
  501: "Syntax error in parameters or arguments",
  502: "Command not implemented",
  503: "Bad sequence of commands",
  504: "Command not implemented for that parameter",
  530: "Not logged in",
  532: "Need account for storing files",
  533: "Command protection level denied for policy reasons",
  534: "Request denied for policy reasons",
  535: "Failed security check",
  536: "Data protection level not supported by security mechanism",
  537: "Command protection level not supported by security mechanism",
  550: "Requested action not taken, File unavailable",
  551: "Requested action aborted, Page type unknown",
  552: "Requested file action aborted, Exceeded storage allocation",
  553: "Requested action not taken, File name not allowed",
  631: "Integrity protected reply",
  632: "Confidentiality and integrity protected reply",
  633: "Confidentiality protected reply",
}

objDefProp(String.prototype,"rm",function rm(re){
  return this.replace(re,'');
});
objDefProp(Array.prototype,"joinWords",function joinWords(re){
  return this.join(' ');
});
objDefProp(String.prototype,"splitWords",function splitWords(re){
  return this.split(' ');
});

const errorCodeList = [officialStatusErrors, unofficialStatusErrors, ftpStatusErrors].reduce((x, y) => x.concat(Object.entries(y)), []);
const lcs = function lcs(seq1, seq2) {
  "use strict";
  let arr1 = [...seq1??[]];
  let arr2 = [...seq2??[]];
  if (arr2.length > arr1.length) {
    [arr1, arr2] = [arr2, arr1];
  }
  const dp = Array(arr1.length + 1).fill(0).map(() => Array(arr2.length + 1).fill(0));
  const dp_length = dp.length;
  for (let i = 1; i !== dp_length; i++) {
    const dpi_length = dp[i].length;
    for (let x = 1; x !== dp_length; x++) {
      if (arr1[i - 1] === arr2[x - 1]) {
        dp[i][x] = dp[i - 1][x - 1] + 1
      } else {
        dp[i][x] = Math.max(dp[i][x - 1], dp[i - 1][x])
      }
    }
  }
  return dp[arr1.length][arr2.length]
};
const wordMatch = function wordMatch(str1, str2) {
  return lcs(str1, str2) >= Math.floor(0.8 * Math.max(str1?.length ?? 0, str2?.length ?? 0));
}
const lcws = function lcws(seq1, seq2) {
  "use strict";
  let arr1 = seq1.replace(/[^a-zA-Z ]/g, ' ').toLowerCase().splitWords();
  let arr2 = seq2.replace(/[^a-zA-Z ]/g, ' ').toLowerCase().splitWords();
  if (arr2.length > arr1.length) {
    [arr1, arr2] = [arr2, arr1];
  }
  const dp = Array(arr1.length + 1).fill(0).map(() => Array(arr2.length + 1).fill(0));
  const dp_length = dp.length;
  for (let i = 1; i !== dp_length; i++) {
    const dpi_length = dp[i].length;
    for (let x = 1; x !== dp_length; x++) {
      if (wordMatch(arr1[i - 1], arr2[x - 1])) {
        dp[i][x] = dp[i - 1][x - 1] + 1
      } else {
        dp[i][x] = Math.max(dp[i][x - 1], dp[i - 1][x])
      }
    }
  }
  return dp[arr1.length][arr2.length]
};
const lessErr = function lessErr(str) {
  return String(str).toLowerCase()
                     .replace(/[^a-zA-Z ]/g, ' ')
                     .rm(/Exception|Error/gi)
                     .rm(/Err/gi)
                     .splitWords()
                     .filter(x => x && x?.length)
                     .joinWords();
}
const doMatch = function doMatch(str1, str2) {
  str1 = lessErr(str1);
  str2 = lessErr(str2);
  return (lcs(str1, str2) * 0.1) + lcws(str1, str2);
}
const fuzzyMatch = function fuzzyMatch(str) {
  let list = errorCodeList.map(x => [...x, doMatch(str, x[1])]);
  list = list.sort((a, b) => b[2] - a[2]);
  return list[0];
}


