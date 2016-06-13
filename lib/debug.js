"use strict";
const RequestExtension = require('request-extension'),
  inspect = require('util').inspect,
  clone = require('clone');

function log(type, data, r, color) {
  var toLog = {};
  toLog[type] = data;
  console.error(inspect(toLog, {
    depth: null,
    colors: color
  }));
};

let debugId = 0;

module.exports = function(config) {
  config = config || {};
  if (typeof config.color === 'undefined') config.color = true;
  return RequestExtension({
    middleware: function(request, params, next) {
      if (params.debug && !request._debugId) {
        request.on('request', function(req) {
          var data = {
            debugId: request._debugId,
            uri: request.uri.href,
            method: request.method,
            headers: clone(request.headers)
          }
          if (request.body) {
            data.body = request.body.toString('utf8')
          }
          log('request', data, request, config.color);

        }).on('response', function(res) {
          if (request.callback) {
            // callback specified, request will buffer the body for
            // us, so wait until the complete event to do anything
          } else {
            // cannot get body since no callback specified
            log('response', {
              debugId: request._debugId,
              headers: clone(res.headers),
              statusCode: res.statusCode
            }, request, config.color);
          }

        }).on('complete', function(res, body) {
          if (request.callback) {
            log('response', {
              debugId: request._debugId,
              headers: clone(res.headers),
              statusCode: res.statusCode,
              body: res.body
            }, request, config.color);
          }

        }).on('redirect', function() {
          var type = (request.response.statusCode == 401 ? 'auth' : 'redirect')
          log(type, {
            debugId: request._debugId,
            statusCode: request.response.statusCode,
            headers: clone(request.response.headers),
            uri: request.uri.href
          }, request, config.color);
        });
        request._debugId = ++debugId;
      }
      next();
    }
  });
}
