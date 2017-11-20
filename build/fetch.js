'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryParameters = exports.jsonApiHttpClient = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _HttpError = require('./HttpError');

var _HttpError2 = _interopRequireDefault(_HttpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchJson = function fetchJson(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var requestHeaders = options.headers || new Headers();
    if (!requestHeaders.has('Accept')) {
        requestHeaders.set('Accept', 'application/vnd.api+json');
    }
    if (!(options && options.body && options.body instanceof FormData) && !requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/vnd.api+json');
    }
    if (options.user && options.user.authenticated && options.user.token && !requestHeaders.has('Authorization')) {
        requestHeaders.set('Authorization', options.user.token);
    }
    return fetch(url, _extends({}, options, { headers: requestHeaders })).then(function (response) {
        return response.text().then(function (text) {
            return {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: text
            };
        });
    }).then(function (_ref) {
        var status = _ref.status,
            statusText = _ref.statusText,
            headers = _ref.headers,
            body = _ref.body;

        var json = void 0;
        try {
            json = JSON.parse(body);
        } catch (e) {
            // not json, no big deal
        }
        if (status < 200 || status >= 300) {
            return Promise.reject(new _HttpError2.default(json && json.message || statusText, status));
        }
        return { status: status, headers: headers, body: body, json: json };
    });
};

var jsonApiHttpClient = exports.jsonApiHttpClient = function jsonApiHttpClient(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!options.headers) {
        options.headers = new Headers({ 'Accept': 'application/vnd.api+json' });
    }
    if (!options.headers.has('Content-Type')) {
        options.headers.set('Content-Type', 'application/vnd.api+json');
    }
    return fetchJson(url, options);
};

var queryParameters = exports.queryParameters = function queryParameters(data) {
    return Object.keys(data).map(function (key) {
        return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
};
