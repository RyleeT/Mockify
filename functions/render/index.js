var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/node-fetch/lib/index.js
var require_lib = __commonJS({
  "node_modules/node-fetch/lib/index.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var Stream2 = _interopDefault(require("stream"));
    var http2 = _interopDefault(require("http"));
    var Url = _interopDefault(require("url"));
    var https2 = _interopDefault(require("https"));
    var zlib2 = _interopDefault(require("zlib"));
    var Readable2 = Stream2.Readable;
    var BUFFER = Symbol("buffer");
    var TYPE = Symbol("type");
    var Blob2 = class {
      constructor() {
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options2 = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
          const a = blobParts;
          const length = Number(a.length);
          for (let i = 0; i < length; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof Blob2) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === "string" ? element : String(element));
            }
            size += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options2 && options2.type !== void 0 && String(options2.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
          this[TYPE] = type;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable = new Readable2();
        readable._read = function() {
        };
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size + start, 0);
        } else {
          relativeStart = Math.min(start, size);
        }
        if (end === void 0) {
          relativeEnd = size;
        } else if (end < 0) {
          relativeEnd = Math.max(size + end, 0);
        } else {
          relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob2([], { type: arguments[2] });
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob2.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob2.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError2(message, type, systemError) {
      Error.call(this, message);
      this.message = message;
      this.type = type;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError2.prototype = Object.create(Error.prototype);
    FetchError2.prototype.constructor = FetchError2;
    FetchError2.prototype.name = "FetchError";
    var convert;
    try {
      convert = require("encoding").convert;
    } catch (e) {
    }
    var INTERNALS2 = Symbol("Body internals");
    var PassThrough2 = Stream2.PassThrough;
    function Body2(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
      let size = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob2(body))
        ;
      else if (Buffer.isBuffer(body))
        ;
      else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream2)
        ;
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS2] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size;
      this.timeout = timeout;
      if (body instanceof Stream2) {
        body.on("error", function(err) {
          const error3 = err.name === "AbortError" ? err : new FetchError2(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
          _this[INTERNALS2].error = error3;
        });
      }
    }
    Body2.prototype = {
      get body() {
        return this[INTERNALS2].body;
      },
      get bodyUsed() {
        return this[INTERNALS2].disturbed;
      },
      arrayBuffer() {
        return consumeBody2.call(this).then(function(buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      blob() {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody2.call(this).then(function(buf) {
          return Object.assign(new Blob2([], {
            type: ct.toLowerCase()
          }), {
            [BUFFER]: buf
          });
        });
      },
      json() {
        var _this2 = this;
        return consumeBody2.call(this).then(function(buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body2.Promise.reject(new FetchError2(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
          }
        });
      },
      text() {
        return consumeBody2.call(this).then(function(buffer) {
          return buffer.toString();
        });
      },
      buffer() {
        return consumeBody2.call(this);
      },
      textConverted() {
        var _this3 = this;
        return consumeBody2.call(this).then(function(buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body2.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body2.mixIn = function(proto) {
      for (const name of Object.getOwnPropertyNames(Body2.prototype)) {
        if (!(name in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body2.prototype, name);
          Object.defineProperty(proto, name, desc);
        }
      }
    };
    function consumeBody2() {
      var _this4 = this;
      if (this[INTERNALS2].disturbed) {
        return Body2.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS2].disturbed = true;
      if (this[INTERNALS2].error) {
        return Body2.Promise.reject(this[INTERNALS2].error);
      }
      let body = this.body;
      if (body === null) {
        return Body2.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob2(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body2.Promise.resolve(body);
      }
      if (!(body instanceof Stream2)) {
        return Body2.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body2.Promise(function(resolve2, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function() {
            abort = true;
            reject(new FetchError2(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
          }, _this4.timeout);
        }
        body.on("error", function(err) {
          if (err.name === "AbortError") {
            abort = true;
            reject(err);
          } else {
            reject(new FetchError2(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
          }
        });
        body.on("data", function(chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(new FetchError2(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on("end", function() {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve2(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(new FetchError2(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
          }
        });
      });
    }
    function convertBody(buffer, headers2) {
      if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
      }
      const ct = headers2.get("content-type");
      let charset = "utf-8";
      let res, str;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str = buffer.slice(0, 1024).toString();
      if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
      }
      if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
      }
      if (res) {
        charset = res.pop();
        if (charset === "gb2312" || charset === "gbk") {
          charset = "gb18030";
        }
      }
      return convert(buffer, "UTF-8", charset).toString();
    }
    function isURLSearchParams(obj) {
      if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
      }
      return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
    }
    function isBlob2(obj) {
      return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
    }
    function clone2(instance) {
      let p1, p2;
      let body = instance.body;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream2 && typeof body.getBoundary !== "function") {
        p1 = new PassThrough2();
        p2 = new PassThrough2();
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS2].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType2(body) {
      if (body === null) {
        return null;
      } else if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob2(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream2) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes2(instance) {
      const body = instance.body;
      if (body === null) {
        return 0;
      } else if (isBlob2(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === "function") {
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream2(dest, instance) {
      const body = instance.body;
      if (body === null) {
        dest.end();
      } else if (isBlob2(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body2.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name) {
      name = `${name}`;
      if (invalidTokenRegex.test(name) || name === "") {
        throw new TypeError(`${name} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find(map, name) {
      name = name.toLowerCase();
      for (const key in map) {
        if (key.toLowerCase() === name) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol("map");
    var Headers2 = class {
      constructor() {
        let init2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = Object.create(null);
        if (init2 instanceof Headers2) {
          const rawHeaders = init2.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init2 == null)
          ;
        else if (typeof init2 === "object") {
          const method = init2[Symbol.iterator];
          if (method != null) {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const pairs = [];
            for (const pair of init2) {
              if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                throw new TypeError("Each header pair must be iterable");
              }
              pairs.push(Array.from(pair));
            }
            for (const pair of pairs) {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init2)) {
              const value = init2[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(", ");
      }
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs = getHeaders(this);
        let i = 0;
        while (i < pairs.length) {
          var _pairs$i = pairs[i];
          const name = _pairs$i[0], value = _pairs$i[1];
          callback.call(thisArg, value, name, this);
          pairs = getHeaders(this);
          i++;
        }
      }
      set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== void 0 ? key : name] = [value];
      }
      append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name] = [value];
        }
      }
      has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== void 0;
      }
      delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      raw() {
        return this[MAP];
      }
      keys() {
        return createHeadersIterator(this, "key");
      }
      values() {
        return createHeadersIterator(this, "value");
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    };
    Headers2.prototype.entries = Headers2.prototype[Symbol.iterator];
    Object.defineProperty(Headers2.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers2.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(headers2) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
      const keys = Object.keys(headers2[MAP]).sort();
      return keys.map(kind === "key" ? function(k) {
        return k.toLowerCase();
      } : kind === "value" ? function(k) {
        return headers2[MAP][k].join(", ");
      } : function(k) {
        return [k.toLowerCase(), headers2[MAP][k].join(", ")];
      });
    }
    var INTERNAL = Symbol("internal");
    function createHeadersIterator(target, kind) {
      const iterator = Object.create(HeadersIteratorPrototype);
      iterator[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index2 = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index2 >= len) {
          return {
            value: void 0,
            done: true
          };
        }
        this[INTERNAL].index = index2 + 1;
        return {
          value: values[index2],
          done: false
        };
      }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers2) {
      const obj = Object.assign({ __proto__: null }, headers2[MAP]);
      const hostHeaderKey = find(headers2[MAP], "Host");
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers2 = new Headers2();
      for (const name of Object.keys(obj)) {
        if (invalidTokenRegex.test(name)) {
          continue;
        }
        if (Array.isArray(obj[name])) {
          for (const val of obj[name]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers2[MAP][name] === void 0) {
              headers2[MAP][name] = [val];
            } else {
              headers2[MAP][name].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
          headers2[MAP][name] = [obj[name]];
        }
      }
      return headers2;
    }
    var INTERNALS$12 = Symbol("Response internals");
    var STATUS_CODES = http2.STATUS_CODES;
    var Response3 = class {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body2.call(this, body, opts);
        const status = opts.status || 200;
        const headers2 = new Headers2(opts.headers);
        if (body != null && !headers2.has("Content-Type")) {
          const contentType = extractContentType2(body);
          if (contentType) {
            headers2.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$12] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers: headers2,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$12].url || "";
      }
      get status() {
        return this[INTERNALS$12].status;
      }
      get ok() {
        return this[INTERNALS$12].status >= 200 && this[INTERNALS$12].status < 300;
      }
      get redirected() {
        return this[INTERNALS$12].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$12].statusText;
      }
      get headers() {
        return this[INTERNALS$12].headers;
      }
      clone() {
        return new Response3(clone2(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body2.mixIn(Response3.prototype);
    Object.defineProperties(Response3.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response3.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$22 = Symbol("Request internals");
    var parse_url = Url.parse;
    var format_url = Url.format;
    var streamDestructionSupported = "destroy" in Stream2.Readable.prototype;
    function isRequest2(input) {
      return typeof input === "object" && typeof input[INTERNALS$22] === "object";
    }
    function isAbortSignal2(signal) {
      const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === "AbortSignal");
    }
    var Request2 = class {
      constructor(input) {
        let init2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest2(input)) {
          if (input && input.href) {
            parsedURL = parse_url(input.href);
          } else {
            parsedURL = parse_url(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parse_url(input.url);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest2(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init2.body != null ? init2.body : isRequest2(input) && input.body !== null ? clone2(input) : null;
        Body2.call(this, inputBody, {
          timeout: init2.timeout || input.timeout || 0,
          size: init2.size || input.size || 0
        });
        const headers2 = new Headers2(init2.headers || input.headers || {});
        if (inputBody != null && !headers2.has("Content-Type")) {
          const contentType = extractContentType2(inputBody);
          if (contentType) {
            headers2.append("Content-Type", contentType);
          }
        }
        let signal = isRequest2(input) ? input.signal : null;
        if ("signal" in init2)
          signal = init2.signal;
        if (signal != null && !isAbortSignal2(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$22] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers: headers2,
          parsedURL,
          signal
        };
        this.follow = init2.follow !== void 0 ? init2.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress = init2.compress !== void 0 ? init2.compress : input.compress !== void 0 ? input.compress : true;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$22].method;
      }
      get url() {
        return format_url(this[INTERNALS$22].parsedURL);
      }
      get headers() {
        return this[INTERNALS$22].headers;
      }
      get redirect() {
        return this[INTERNALS$22].redirect;
      }
      get signal() {
        return this[INTERNALS$22].signal;
      }
      clone() {
        return new Request2(this);
      }
    };
    Body2.mixIn(Request2.prototype);
    Object.defineProperty(Request2.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions2(request) {
      const parsedURL = request[INTERNALS$22].parsedURL;
      const headers2 = new Headers2(request[INTERNALS$22].headers);
      if (!headers2.has("Accept")) {
        headers2.set("Accept", "*/*");
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (request.signal && request.body instanceof Stream2.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
      }
      let contentLengthValue = null;
      if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body != null) {
        const totalBytes = getTotalBytes2(request);
        if (typeof totalBytes === "number") {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers2.set("Content-Length", contentLengthValue);
      }
      if (!headers2.has("User-Agent")) {
        headers2.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
      }
      if (request.compress && !headers2.has("Accept-Encoding")) {
        headers2.set("Accept-Encoding", "gzip,deflate");
      }
      let agent = request.agent;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers2.has("Connection") && !agent) {
        headers2.set("Connection", "close");
      }
      return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers2),
        agent
      });
    }
    function AbortError2(message) {
      Error.call(this, message);
      this.type = "aborted";
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError2.prototype = Object.create(Error.prototype);
    AbortError2.prototype.constructor = AbortError2;
    AbortError2.prototype.name = "AbortError";
    var PassThrough$1 = Stream2.PassThrough;
    var resolve_url = Url.resolve;
    function fetch3(url, opts) {
      if (!fetch3.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      }
      Body2.Promise = fetch3.Promise;
      return new fetch3.Promise(function(resolve2, reject) {
        const request = new Request2(url, opts);
        const options2 = getNodeRequestOptions2(request);
        const send = (options2.protocol === "https:" ? https2 : http2).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort2() {
          let error3 = new AbortError2("The user aborted a request.");
          reject(error3);
          if (request.body && request.body instanceof Stream2.Readable) {
            request.body.destroy(error3);
          }
          if (!response || !response.body)
            return;
          response.body.emit("error", error3);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options2);
        let reqTimeout;
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request.timeout) {
          req.once("socket", function(socket) {
            reqTimeout = setTimeout(function() {
              reject(new FetchError2(`network timeout at: ${request.url}`, "request-timeout"));
              finalize();
            }, request.timeout);
          });
        }
        req.on("error", function(err) {
          reject(new FetchError2(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
          finalize();
        });
        req.on("response", function(res) {
          clearTimeout(reqTimeout);
          const headers2 = createHeadersLenient(res.headers);
          if (fetch3.isRedirect(res.statusCode)) {
            const location = headers2.get("Location");
            const locationURL = location === null ? null : resolve_url(request.url, location);
            switch (request.redirect) {
              case "error":
                reject(new FetchError2(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  try {
                    headers2.set("Location", locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case "follow":
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError2(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers2(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: request.body,
                  signal: request.signal,
                  timeout: request.timeout,
                  size: request.size
                };
                if (res.statusCode !== 303 && request.body && getTotalBytes2(request) === null) {
                  reject(new FetchError2("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                  requestOpts.method = "GET";
                  requestOpts.body = void 0;
                  requestOpts.headers.delete("content-length");
                }
                resolve2(fetch3(new Request2(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once("end", function() {
            if (signal)
              signal.removeEventListener("abort", abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: headers2,
            size: request.size,
            timeout: request.timeout,
            counter: request.counter
          };
          const codings = headers2.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
            response = new Response3(body, response_options);
            resolve2(response);
            return;
          }
          const zlibOptions = {
            flush: zlib2.Z_SYNC_FLUSH,
            finishFlush: zlib2.Z_SYNC_FLUSH
          };
          if (codings == "gzip" || codings == "x-gzip") {
            body = body.pipe(zlib2.createGunzip(zlibOptions));
            response = new Response3(body, response_options);
            resolve2(response);
            return;
          }
          if (codings == "deflate" || codings == "x-deflate") {
            const raw = res.pipe(new PassThrough$1());
            raw.once("data", function(chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib2.createInflate());
              } else {
                body = body.pipe(zlib2.createInflateRaw());
              }
              response = new Response3(body, response_options);
              resolve2(response);
            });
            return;
          }
          if (codings == "br" && typeof zlib2.createBrotliDecompress === "function") {
            body = body.pipe(zlib2.createBrotliDecompress());
            response = new Response3(body, response_options);
            resolve2(response);
            return;
          }
          response = new Response3(body, response_options);
          resolve2(response);
        });
        writeToStream2(req, request);
      });
    }
    fetch3.isRedirect = function(code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch3.Promise = global.Promise;
    module2.exports = exports = fetch3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports;
    exports.Headers = Headers2;
    exports.Request = Request2;
    exports.Response = Response3;
    exports.FetchError = FetchError2;
  }
});

// node_modules/cross-fetch/dist/node-ponyfill.js
var require_node_ponyfill = __commonJS({
  "node_modules/cross-fetch/dist/node-ponyfill.js"(exports, module2) {
    var nodeFetch = require_lib();
    var realFetch = nodeFetch.default || nodeFetch;
    var fetch3 = function(url, options2) {
      if (/^\/\//.test(url)) {
        url = "https:" + url;
      }
      return realFetch.call(this, url, options2);
    };
    fetch3.ponyfill = true;
    module2.exports = exports = fetch3;
    exports.fetch = fetch3;
    exports.Headers = nodeFetch.Headers;
    exports.Request = nodeFetch.Request;
    exports.Response = nodeFetch.Response;
    exports.default = fetch3;
  }
});

// node_modules/cross-fetch/dist/node-polyfill.js
var require_node_polyfill = __commonJS({
  "node_modules/cross-fetch/dist/node-polyfill.js"() {
    var fetchNode = require_node_ponyfill();
    var fetch3 = fetchNode.fetch.bind({});
    fetch3.polyfill = true;
    if (!global.fetch) {
      global.fetch = fetch3;
      global.Response = fetchNode.Response;
      global.Headers = fetchNode.Headers;
      global.Request = fetchNode.Request;
    }
  }
});

// node_modules/meilisearch/dist/bundles/meilisearch.umd.js
var require_meilisearch_umd = __commonJS({
  "node_modules/meilisearch/dist/bundles/meilisearch.umd.js"(exports, module2) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? factory(exports, require_node_polyfill()) : typeof define === "function" && define.amd ? define(["exports", "cross-fetch/polyfill"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.window = global2.window || {}));
    })(exports, function(exports2) {
      "use strict";
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      }
      var __assign = function() {
        __assign = Object.assign || function __assign2(t) {
          for (var s2, i = 1, n = arguments.length; i < n; i++) {
            s2 = arguments[i];
            for (var p in s2)
              if (Object.prototype.hasOwnProperty.call(s2, p))
                t[p] = s2[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      }
      function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      }
      var MeiliSearchError = function(_super) {
        __extends(MeiliSearchError2, _super);
        function MeiliSearchError2(message) {
          var _this = _super.call(this, message) || this;
          _this.name = "MeiliSearchError";
          _this.type = "MeiliSearchError";
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchError2);
          }
          return _this;
        }
        return MeiliSearchError2;
      }(Error);
      var MeiliSearchTimeOutError = function(_super) {
        __extends(MeiliSearchTimeOutError2, _super);
        function MeiliSearchTimeOutError2(message) {
          var _this = _super.call(this, message) || this;
          _this.name = "MeiliSearchTimeOutError";
          _this.type = _this.constructor.name;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchTimeOutError2);
          }
          return _this;
        }
        return MeiliSearchTimeOutError2;
      }(Error);
      function removeUndefinedFromObject(obj) {
        return Object.entries(obj).reduce(function(acc, curEntry) {
          var key = curEntry[0], val = curEntry[1];
          if (val !== void 0)
            acc[key] = val;
          return acc;
        }, {});
      }
      function sleep(ms) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [
                  4,
                  new Promise(function(resolve2) {
                    return setTimeout(resolve2, ms);
                  })
                ];
              case 1:
                return [
                  2,
                  _a.sent()
                ];
            }
          });
        });
      }
      var MeiliSearchCommunicationError = function(_super) {
        __extends(MeiliSearchCommunicationError2, _super);
        function MeiliSearchCommunicationError2(message, body) {
          var _this = _super.call(this, message) || this;
          _this.name = "MeiliSearchCommunicationError";
          _this.type = "MeiliSearchCommunicationError";
          if (body instanceof Response) {
            _this.message = body.statusText;
            _this.statusCode = body.status;
          }
          if (body instanceof Error) {
            _this.errno = body.errno;
            _this.code = body.code;
          }
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchCommunicationError2);
          }
          return _this;
        }
        return MeiliSearchCommunicationError2;
      }(Error);
      var MeiliSearchApiError = function(_super) {
        __extends(class_1, _super);
        function class_1(error3, status) {
          var _this = _super.call(this, error3.message) || this;
          _this.type = "MeiliSearchApiError";
          _this.name = "MeiliSearchApiError";
          _this.errorCode = error3.errorCode;
          _this.errorType = error3.errorType;
          _this.errorLink = error3.errorLink;
          _this.message = error3.message;
          _this.httpStatus = status;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchApiError);
          }
          return _this;
        }
        return class_1;
      }(Error);
      function httpResponseErrorHandler(response) {
        return __awaiter(this, void 0, void 0, function() {
          var err;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!!response.ok)
                  return [
                    3,
                    5
                  ];
                err = void 0;
                _a.label = 1;
              case 1:
                _a.trys.push([1, 3, , 4]);
                return [
                  4,
                  response.json()
                ];
              case 2:
                err = _a.sent();
                return [
                  3,
                  4
                ];
              case 3:
                _a.sent();
                throw new MeiliSearchCommunicationError(response.statusText, response);
              case 4:
                throw new MeiliSearchApiError(err, response.status);
              case 5:
                return [
                  2,
                  response
                ];
            }
          });
        });
      }
      function httpErrorHandler(response) {
        if (response.type !== "MeiliSearchApiError") {
          throw new MeiliSearchCommunicationError(response.message, response);
        }
        throw response;
      }
      var HttpRequests = function() {
        function HttpRequests2(config) {
          this.headers = __assign(__assign(__assign({}, config.headers || {}), {
            "Content-Type": "application/json"
          }), config.apiKey ? {
            "X-Meili-API-Key": config.apiKey
          } : {});
          this.url = new URL(config.host);
        }
        HttpRequests2.addTrailingSlash = function(url) {
          if (!url.endsWith("/")) {
            url += "/";
          }
          return url;
        };
        HttpRequests2.prototype.request = function(_a) {
          var method = _a.method, url = _a.url, params = _a.params, body = _a.body, config = _a.config;
          return __awaiter(this, void 0, void 0, function() {
            var constructURL, queryParams_1, response, parsedBody, parsedJson, e_1;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _b.trys.push([0, 3, , 4]);
                  constructURL = new URL(url, this.url);
                  if (params) {
                    queryParams_1 = new URLSearchParams();
                    Object.keys(params).filter(function(x) {
                      return params[x] !== null;
                    }).map(function(x) {
                      return queryParams_1.set(x, params[x]);
                    });
                    constructURL.search = queryParams_1.toString();
                  }
                  return [
                    4,
                    fetch(constructURL.toString(), __assign(__assign({}, config), {
                      method,
                      body: JSON.stringify(body),
                      headers: this.headers
                    })).then(function(res) {
                      return httpResponseErrorHandler(res);
                    })
                  ];
                case 1:
                  response = _b.sent();
                  return [
                    4,
                    response.text()
                  ];
                case 2:
                  parsedBody = _b.sent();
                  try {
                    parsedJson = JSON.parse(parsedBody);
                    return [
                      2,
                      parsedJson
                    ];
                  } catch (_) {
                    return [
                      2
                    ];
                  }
                  return [
                    3,
                    4
                  ];
                case 3:
                  e_1 = _b.sent();
                  httpErrorHandler(e_1);
                  return [
                    3,
                    4
                  ];
                case 4:
                  return [
                    2
                  ];
              }
            });
          });
        };
        HttpRequests2.prototype.get = function(url, params, config) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.request({
                      method: "GET",
                      url,
                      params,
                      config
                    })
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        HttpRequests2.prototype.post = function(url, data, params, config) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.request({
                      method: "POST",
                      url,
                      body: data,
                      params,
                      config
                    })
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        HttpRequests2.prototype.put = function(url, data, params, config) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.request({
                      method: "PUT",
                      url,
                      body: data,
                      params,
                      config
                    })
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        HttpRequests2.prototype["delete"] = function(url, data, params, config) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.request({
                      method: "DELETE",
                      url,
                      body: data,
                      params,
                      config
                    })
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        return HttpRequests2;
      }();
      var Index = function() {
        function Index2(config, uid, primaryKey) {
          this.uid = uid;
          this.primaryKey = primaryKey;
          this.httpRequest = new HttpRequests(config);
        }
        Index2.prototype.waitForPendingUpdate = function(updateId, _a) {
          var _b = _a === void 0 ? {} : _a, _c = _b.timeOutMs, timeOutMs = _c === void 0 ? 5e3 : _c, _d = _b.intervalMs, intervalMs = _d === void 0 ? 50 : _d;
          return __awaiter(this, void 0, void 0, function() {
            var startingTime, response;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  startingTime = Date.now();
                  _e.label = 1;
                case 1:
                  if (!(Date.now() - startingTime < timeOutMs))
                    return [
                      3,
                      4
                    ];
                  return [
                    4,
                    this.getUpdateStatus(updateId)
                  ];
                case 2:
                  response = _e.sent();
                  if (response.status !== "enqueued")
                    return [
                      2,
                      response
                    ];
                  return [
                    4,
                    sleep(intervalMs)
                  ];
                case 3:
                  _e.sent();
                  return [
                    3,
                    1
                  ];
                case 4:
                  throw new MeiliSearchTimeOutError("timeout of " + timeOutMs + "ms has exceeded on process " + updateId + " when waiting for pending update to resolve.");
              }
            });
          });
        };
        Index2.prototype.search = function(query, options2, method, config) {
          if (method === void 0) {
            method = "POST";
          }
          return __awaiter(this, void 0, void 0, function() {
            var url, params, getParams;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/search";
                  params = {
                    q: query,
                    offset: options2 === null || options2 === void 0 ? void 0 : options2.offset,
                    limit: options2 === null || options2 === void 0 ? void 0 : options2.limit,
                    cropLength: options2 === null || options2 === void 0 ? void 0 : options2.cropLength,
                    filters: options2 === null || options2 === void 0 ? void 0 : options2.filters,
                    matches: options2 === null || options2 === void 0 ? void 0 : options2.matches,
                    facetFilters: options2 === null || options2 === void 0 ? void 0 : options2.facetFilters,
                    facetsDistribution: options2 === null || options2 === void 0 ? void 0 : options2.facetsDistribution,
                    attributesToRetrieve: options2 === null || options2 === void 0 ? void 0 : options2.attributesToRetrieve,
                    attributesToCrop: options2 === null || options2 === void 0 ? void 0 : options2.attributesToCrop,
                    attributesToHighlight: options2 === null || options2 === void 0 ? void 0 : options2.attributesToHighlight
                  };
                  if (!(method.toUpperCase() === "POST"))
                    return [
                      3,
                      2
                    ];
                  return [
                    4,
                    this.httpRequest.post(url, removeUndefinedFromObject(params), void 0, config)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
                case 2:
                  if (!(method.toUpperCase() === "GET"))
                    return [
                      3,
                      4
                    ];
                  getParams = __assign(__assign({}, params), {
                    facetFilters: Array.isArray(options2 === null || options2 === void 0 ? void 0 : options2.facetFilters) && (options2 === null || options2 === void 0 ? void 0 : options2.facetFilters) ? JSON.stringify(options2.facetFilters) : void 0,
                    facetsDistribution: (options2 === null || options2 === void 0 ? void 0 : options2.facetsDistribution) ? JSON.stringify(options2.facetsDistribution) : void 0,
                    attributesToRetrieve: (options2 === null || options2 === void 0 ? void 0 : options2.attributesToRetrieve) ? options2.attributesToRetrieve.join(",") : void 0,
                    attributesToCrop: (options2 === null || options2 === void 0 ? void 0 : options2.attributesToCrop) ? options2.attributesToCrop.join(",") : void 0,
                    attributesToHighlight: (options2 === null || options2 === void 0 ? void 0 : options2.attributesToHighlight) ? options2.attributesToHighlight.join(",") : void 0
                  });
                  return [
                    4,
                    this.httpRequest.get(url, removeUndefinedFromObject(getParams), config)
                  ];
                case 3:
                  return [
                    2,
                    _a.sent()
                  ];
                case 4:
                  throw new MeiliSearchError("method parameter should be either POST or GET");
              }
            });
          });
        };
        Index2.prototype.getRawInfo = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url, res;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid;
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  res = _a.sent();
                  this.primaryKey = res.primaryKey;
                  return [
                    2,
                    res
                  ];
              }
            });
          });
        };
        Index2.prototype.fetchInfo = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.getRawInfo()
                  ];
                case 1:
                  _a.sent();
                  return [
                    2,
                    this
                  ];
              }
            });
          });
        };
        Index2.prototype.fetchPrimaryKey = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _a = this;
                  return [
                    4,
                    this.getRawInfo()
                  ];
                case 1:
                  _a.primaryKey = _b.sent().primaryKey;
                  return [
                    2,
                    this.primaryKey
                  ];
              }
            });
          });
        };
        Index2.create = function(config, uid, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var url, req, index2;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes";
                  req = new HttpRequests(config);
                  return [
                    4,
                    req.post(url, __assign(__assign({}, options2), {
                      uid
                    }))
                  ];
                case 1:
                  index2 = _a.sent();
                  return [
                    2,
                    new Index2(config, uid, index2.primaryKey)
                  ];
              }
            });
          });
        };
        Index2.prototype.update = function(data) {
          return __awaiter(this, void 0, void 0, function() {
            var url, index2;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid;
                  return [
                    4,
                    this.httpRequest.put(url, data)
                  ];
                case 1:
                  index2 = _a.sent();
                  this.primaryKey = index2.primaryKey;
                  return [
                    2,
                    this
                  ];
              }
            });
          });
        };
        Index2.prototype["delete"] = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid;
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.deleteIfExists = function() {
          return __awaiter(this, void 0, void 0, function() {
            var e_1;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [
                    4,
                    this["delete"]()
                  ];
                case 1:
                  _a.sent();
                  return [
                    2,
                    true
                  ];
                case 2:
                  e_1 = _a.sent();
                  if (e_1.errorCode === "index_not_found") {
                    return [
                      2,
                      false
                    ];
                  }
                  throw e_1;
                case 3:
                  return [
                    2
                  ];
              }
            });
          });
        };
        Index2.prototype.getAllUpdateStatus = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/updates";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getUpdateStatus = function(updateId) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/updates/" + updateId;
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getStats = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/stats";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getDocuments = function(options2) {
          return __awaiter(this, void 0, void 0, function() {
            var url, attr;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/documents";
                  if (options2 !== void 0 && Array.isArray(options2.attributesToRetrieve)) {
                    attr = options2.attributesToRetrieve.join(",");
                  }
                  return [
                    4,
                    this.httpRequest.get(url, __assign(__assign({}, options2), attr !== void 0 ? {
                      attributesToRetrieve: attr
                    } : {}))
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getDocument = function(documentId) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/documents/" + documentId;
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.addDocuments = function(documents, options2) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/documents";
                  return [
                    4,
                    this.httpRequest.post(url, documents, options2)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateDocuments = function(documents, options2) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/documents";
                  return [
                    4,
                    this.httpRequest.put(url, documents, options2)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.deleteDocument = function(documentId) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/documents/" + documentId;
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.deleteDocuments = function(documentsIds) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/documents/delete-batch";
                  return [
                    4,
                    this.httpRequest.post(url, documentsIds)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.deleteAllDocuments = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/documents";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getSettings = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateSettings = function(settings) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings";
                  return [
                    4,
                    this.httpRequest.post(url, settings)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetSettings = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getSynonyms = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/synonyms";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateSynonyms = function(synonyms) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/synonyms";
                  return [
                    4,
                    this.httpRequest.post(url, synonyms)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetSynonyms = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/synonyms";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getStopWords = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/stop-words";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateStopWords = function(stopWords) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/stop-words";
                  return [
                    4,
                    this.httpRequest.post(url, stopWords)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetStopWords = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/stop-words";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getRankingRules = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/ranking-rules";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateRankingRules = function(rankingRules) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/ranking-rules";
                  return [
                    4,
                    this.httpRequest.post(url, rankingRules)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetRankingRules = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/ranking-rules";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getDistinctAttribute = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/distinct-attribute";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateDistinctAttribute = function(distinctAttribute) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/distinct-attribute";
                  return [
                    4,
                    this.httpRequest.post(url, distinctAttribute)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetDistinctAttribute = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/distinct-attribute";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getAttributesForFaceting = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/attributes-for-faceting";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateAttributesForFaceting = function(attributesForFaceting) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/attributes-for-faceting";
                  return [
                    4,
                    this.httpRequest.post(url, attributesForFaceting)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetAttributesForFaceting = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/attributes-for-faceting";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getSearchableAttributes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/searchable-attributes";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateSearchableAttributes = function(searchableAttributes) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/searchable-attributes";
                  return [
                    4,
                    this.httpRequest.post(url, searchableAttributes)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetSearchableAttributes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/searchable-attributes";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getDisplayedAttributes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/displayed-attributes";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateDisplayedAttributes = function(displayedAttributes) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/displayed-attributes";
                  return [
                    4,
                    this.httpRequest.post(url, displayedAttributes)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetDisplayedAttributes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes/" + this.uid + "/settings/displayed-attributes";
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        return Index2;
      }();
      var MeiliSearch2 = function() {
        function MeiliSearch3(config) {
          config.host = HttpRequests.addTrailingSlash(config.host);
          this.config = config;
          this.httpRequest = new HttpRequests(config);
        }
        MeiliSearch3.prototype.index = function(indexUid) {
          return new Index(this.config, indexUid);
        };
        MeiliSearch3.prototype.getIndex = function(indexUid) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [
                2,
                new Index(this.config, indexUid).fetchInfo()
              ];
            });
          });
        };
        MeiliSearch3.prototype.getOrCreateIndex = function(uid, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var index2, e_1;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [
                    4,
                    this.getIndex(uid)
                  ];
                case 1:
                  index2 = _a.sent();
                  return [
                    2,
                    index2
                  ];
                case 2:
                  e_1 = _a.sent();
                  if (e_1.errorCode === "index_not_found") {
                    return [
                      2,
                      this.createIndex(uid, options2)
                    ];
                  }
                  throw new MeiliSearchApiError(e_1, e_1.status);
                case 3:
                  return [
                    2
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.listIndexes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "indexes";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.createIndex = function(uid, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    Index.create(this.config, uid, options2)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.updateIndex = function(uid, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [
                2,
                new Index(this.config, uid).update(options2)
              ];
            });
          });
        };
        MeiliSearch3.prototype.deleteIndex = function(uid) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [
                2,
                new Index(this.config, uid)["delete"]()
              ];
            });
          });
        };
        MeiliSearch3.prototype.deleteIndexIfExists = function(uid) {
          return __awaiter(this, void 0, void 0, function() {
            var e_2;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [
                    4,
                    this.deleteIndex(uid)
                  ];
                case 1:
                  _a.sent();
                  return [
                    2,
                    true
                  ];
                case 2:
                  e_2 = _a.sent();
                  if (e_2.errorCode === "index_not_found") {
                    return [
                      2,
                      false
                    ];
                  }
                  throw e_2;
                case 3:
                  return [
                    2
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.getKeys = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "keys";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.health = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "health";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.isHealthy = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  url = "health";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  _a.sent();
                  return [
                    2,
                    true
                  ];
                case 2:
                  _a.sent();
                  return [
                    2,
                    false
                  ];
                case 3:
                  return [
                    2
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.stats = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "stats";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.version = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "version";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.createDump = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "dumps";
                  return [
                    4,
                    this.httpRequest.post(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.getDumpStatus = function(dumpUid) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "dumps/" + dumpUid + "/status";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        return MeiliSearch3;
      }();
      exports2.MeiliSearch = MeiliSearch2;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/dayjs/dayjs.min.js
var require_dayjs_min = __commonJS({
  "node_modules/dayjs/dayjs.min.js"(exports, module2) {
    !function(t, e) {
      typeof exports == "object" && typeof module2 != "undefined" ? module2.exports = e() : typeof define == "function" && define.amd ? define(e) : (t = typeof globalThis != "undefined" ? globalThis : t || self).dayjs = e();
    }(exports, function() {
      "use strict";
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s2 = "minute", u = "hour", a = "day", o = "week", f = "month", h = "quarter", c = "year", d = "date", $ = "Invalid Date", l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_") }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, g = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date())
          return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, f), s3 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s3 ? -1 : 1), f);
        return +(-(r2 + (n2 - i2) / (s3 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: f, y: c, w: o, d: a, D: d, h: u, m: s2, s: i, ms: r, Q: h }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return t2 === void 0;
      } }, D = "en", v = {};
      v[D] = M;
      var p = function(t2) {
        return t2 instanceof _;
      }, S = function(t2, e2, n2) {
        var r2;
        if (!t2)
          return D;
        if (typeof t2 == "string")
          v[t2] && (r2 = t2), e2 && (v[t2] = e2, r2 = t2);
        else {
          var i2 = t2.name;
          v[i2] = t2, r2 = i2;
        }
        return !n2 && r2 && (D = r2), r2 || !n2 && D;
      }, w = function(t2, e2) {
        if (p(t2))
          return t2.clone();
        var n2 = typeof e2 == "object" ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, O = g;
      O.l = S, O.i = p, O.w = function(t2, e2) {
        return w(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = function() {
        function M2(t2) {
          this.$L = S(t2.locale, null, true), this.parse(t2);
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (e2 === null)
              return new Date(NaN);
            if (O.u(e2))
              return new Date();
            if (e2 instanceof Date)
              return new Date(e2);
            if (typeof e2 == "string" && !/Z$/i.test(e2)) {
              var r2 = e2.match(l);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s3 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s3)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s3);
              }
            }
            return new Date(e2);
          }(t2), this.$x = t2.x || {}, this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return O;
        }, m2.isValid = function() {
          return !(this.$d.toString() === $);
        }, m2.isSame = function(t2, e2) {
          var n2 = w(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return w(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < w(t2);
        }, m2.$g = function(t2, e2, n2) {
          return O.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!O.u(e2) || e2, h2 = O.p(t2), $2 = function(t3, e3) {
            var i2 = O.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, l2 = function(t3, e3) {
            return O.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, g2 = "set" + (this.$u ? "UTC" : "");
          switch (h2) {
            case c:
              return r2 ? $2(1, 0) : $2(31, 11);
            case f:
              return r2 ? $2(1, M3) : $2(0, M3 + 1);
            case o:
              var D2 = this.$locale().weekStart || 0, v2 = (y2 < D2 ? y2 + 7 : y2) - D2;
              return $2(r2 ? m3 - v2 : m3 + (6 - v2), M3);
            case a:
            case d:
              return l2(g2 + "Hours", 0);
            case u:
              return l2(g2 + "Minutes", 1);
            case s2:
              return l2(g2 + "Seconds", 2);
            case i:
              return l2(g2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = O.p(t2), h2 = "set" + (this.$u ? "UTC" : ""), $2 = (n2 = {}, n2[a] = h2 + "Date", n2[d] = h2 + "Date", n2[f] = h2 + "Month", n2[c] = h2 + "FullYear", n2[u] = h2 + "Hours", n2[s2] = h2 + "Minutes", n2[i] = h2 + "Seconds", n2[r] = h2 + "Milliseconds", n2)[o2], l2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === f || o2 === c) {
            var y2 = this.clone().set(d, 1);
            y2.$d[$2](l2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else
            $2 && this.$d[$2](l2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[O.p(t2)]();
        }, m2.add = function(r2, h2) {
          var d2, $2 = this;
          r2 = Number(r2);
          var l2 = O.p(h2), y2 = function(t2) {
            var e2 = w($2);
            return O.w(e2.date(e2.date() + Math.round(t2 * r2)), $2);
          };
          if (l2 === f)
            return this.set(f, this.$M + r2);
          if (l2 === c)
            return this.set(c, this.$y + r2);
          if (l2 === a)
            return y2(1);
          if (l2 === o)
            return y2(7);
          var M3 = (d2 = {}, d2[s2] = e, d2[u] = n, d2[i] = t, d2)[l2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return O.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this;
          if (!this.isValid())
            return $;
          var n2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", r2 = O.z(this), i2 = this.$locale(), s3 = this.$H, u2 = this.$m, a2 = this.$M, o2 = i2.weekdays, f2 = i2.months, h2 = function(t3, r3, i3, s4) {
            return t3 && (t3[r3] || t3(e2, n2)) || i3[r3].substr(0, s4);
          }, c2 = function(t3) {
            return O.s(s3 % 12 || 12, t3, "0");
          }, d2 = i2.meridiem || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          }, l2 = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: O.s(a2 + 1, 2, "0"), MMM: h2(i2.monthsShort, a2, f2, 3), MMMM: h2(f2, a2), D: this.$D, DD: O.s(this.$D, 2, "0"), d: String(this.$W), dd: h2(i2.weekdaysMin, this.$W, o2, 2), ddd: h2(i2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s3), HH: O.s(s3, 2, "0"), h: c2(1), hh: c2(2), a: d2(s3, u2, true), A: d2(s3, u2, false), m: String(u2), mm: O.s(u2, 2, "0"), s: String(this.$s), ss: O.s(this.$s, 2, "0"), SSS: O.s(this.$ms, 3, "0"), Z: r2 };
          return n2.replace(y, function(t3, e3) {
            return e3 || l2[t3] || r2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, $2) {
          var l2, y2 = O.p(d2), M3 = w(r2), m3 = (M3.utcOffset() - this.utcOffset()) * e, g2 = this - M3, D2 = O.m(this, M3);
          return D2 = (l2 = {}, l2[c] = D2 / 12, l2[f] = D2, l2[h] = D2 / 3, l2[o] = (g2 - m3) / 6048e5, l2[a] = (g2 - m3) / 864e5, l2[u] = g2 / n, l2[s2] = g2 / e, l2[i] = g2 / t, l2)[y2] || g2, $2 ? D2 : O.a(D2);
        }, m2.daysInMonth = function() {
          return this.endOf(f).$D;
        }, m2.$locale = function() {
          return v[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2)
            return this.$L;
          var n2 = this.clone(), r2 = S(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return O.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      }(), b = _.prototype;
      return w.prototype = b, [["$ms", r], ["$s", i], ["$m", s2], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function(t2) {
        b[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), w.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, w), t2.$i = true), w;
      }, w.locale = S, w.isDayjs = p, w.unix = function(t2) {
        return w(1e3 * t2);
      }, w.en = v[D], w.Ls = v, w.p = {}, w;
    });
  }
});

// node_modules/dayjs/plugin/duration.js
var require_duration = __commonJS({
  "node_modules/dayjs/plugin/duration.js"(exports, module2) {
    !function(t, s2) {
      typeof exports == "object" && typeof module2 != "undefined" ? module2.exports = s2() : typeof define == "function" && define.amd ? define(s2) : (t = typeof globalThis != "undefined" ? globalThis : t || self).dayjs_plugin_duration = s2();
    }(exports, function() {
      "use strict";
      var t, s2, n = 1e3, i = 6e4, e = 36e5, r = 864e5, o = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, u = 31536e6, h = 2592e6, a = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, d = { years: u, months: h, days: r, hours: e, minutes: i, seconds: n, milliseconds: 1, weeks: 6048e5 }, c = function(t2) {
        return t2 instanceof p;
      }, f = function(t2, s3, n2) {
        return new p(t2, n2, s3.$l);
      }, m = function(t2) {
        return s2.p(t2) + "s";
      }, l = function(t2) {
        return t2 < 0;
      }, $ = function(t2) {
        return l(t2) ? Math.ceil(t2) : Math.floor(t2);
      }, y = function(t2) {
        return Math.abs(t2);
      }, g = function(t2, s3) {
        return t2 ? l(t2) ? { negative: true, format: "" + y(t2) + s3 } : { negative: false, format: "" + t2 + s3 } : { negative: false, format: "" };
      }, p = function() {
        function l2(t2, s3, n2) {
          var i2 = this;
          if (this.$d = {}, this.$l = n2, t2 === void 0 && (this.$ms = 0, this.parseFromMilliseconds()), s3)
            return f(t2 * d[m(s3)], this);
          if (typeof t2 == "number")
            return this.$ms = t2, this.parseFromMilliseconds(), this;
          if (typeof t2 == "object")
            return Object.keys(t2).forEach(function(s4) {
              i2.$d[m(s4)] = t2[s4];
            }), this.calMilliseconds(), this;
          if (typeof t2 == "string") {
            var e2 = t2.match(a);
            if (e2) {
              var r2 = e2.slice(2).map(function(t3) {
                return Number(t3);
              });
              return this.$d.years = r2[0], this.$d.months = r2[1], this.$d.weeks = r2[2], this.$d.days = r2[3], this.$d.hours = r2[4], this.$d.minutes = r2[5], this.$d.seconds = r2[6], this.calMilliseconds(), this;
            }
          }
          return this;
        }
        var y2 = l2.prototype;
        return y2.calMilliseconds = function() {
          var t2 = this;
          this.$ms = Object.keys(this.$d).reduce(function(s3, n2) {
            return s3 + (t2.$d[n2] || 0) * d[n2];
          }, 0);
        }, y2.parseFromMilliseconds = function() {
          var t2 = this.$ms;
          this.$d.years = $(t2 / u), t2 %= u, this.$d.months = $(t2 / h), t2 %= h, this.$d.days = $(t2 / r), t2 %= r, this.$d.hours = $(t2 / e), t2 %= e, this.$d.minutes = $(t2 / i), t2 %= i, this.$d.seconds = $(t2 / n), t2 %= n, this.$d.milliseconds = t2;
        }, y2.toISOString = function() {
          var t2 = g(this.$d.years, "Y"), s3 = g(this.$d.months, "M"), n2 = +this.$d.days || 0;
          this.$d.weeks && (n2 += 7 * this.$d.weeks);
          var i2 = g(n2, "D"), e2 = g(this.$d.hours, "H"), r2 = g(this.$d.minutes, "M"), o2 = this.$d.seconds || 0;
          this.$d.milliseconds && (o2 += this.$d.milliseconds / 1e3);
          var u2 = g(o2, "S"), h2 = t2.negative || s3.negative || i2.negative || e2.negative || r2.negative || u2.negative, a2 = e2.format || r2.format || u2.format ? "T" : "", d2 = (h2 ? "-" : "") + "P" + t2.format + s3.format + i2.format + a2 + e2.format + r2.format + u2.format;
          return d2 === "P" || d2 === "-P" ? "P0D" : d2;
        }, y2.toJSON = function() {
          return this.toISOString();
        }, y2.format = function(t2) {
          var n2 = t2 || "YYYY-MM-DDTHH:mm:ss", i2 = { Y: this.$d.years, YY: s2.s(this.$d.years, 2, "0"), YYYY: s2.s(this.$d.years, 4, "0"), M: this.$d.months, MM: s2.s(this.$d.months, 2, "0"), D: this.$d.days, DD: s2.s(this.$d.days, 2, "0"), H: this.$d.hours, HH: s2.s(this.$d.hours, 2, "0"), m: this.$d.minutes, mm: s2.s(this.$d.minutes, 2, "0"), s: this.$d.seconds, ss: s2.s(this.$d.seconds, 2, "0"), SSS: s2.s(this.$d.milliseconds, 3, "0") };
          return n2.replace(o, function(t3, s3) {
            return s3 || String(i2[t3]);
          });
        }, y2.as = function(t2) {
          return this.$ms / d[m(t2)];
        }, y2.get = function(t2) {
          var s3 = this.$ms, n2 = m(t2);
          return n2 === "milliseconds" ? s3 %= 1e3 : s3 = n2 === "weeks" ? $(s3 / d[n2]) : this.$d[n2], s3 === 0 ? 0 : s3;
        }, y2.add = function(t2, s3, n2) {
          var i2;
          return i2 = s3 ? t2 * d[m(s3)] : c(t2) ? t2.$ms : f(t2, this).$ms, f(this.$ms + i2 * (n2 ? -1 : 1), this);
        }, y2.subtract = function(t2, s3) {
          return this.add(t2, s3, true);
        }, y2.locale = function(t2) {
          var s3 = this.clone();
          return s3.$l = t2, s3;
        }, y2.clone = function() {
          return f(this.$ms, this);
        }, y2.humanize = function(s3) {
          return t().add(this.$ms, "ms").locale(this.$l).fromNow(!s3);
        }, y2.milliseconds = function() {
          return this.get("milliseconds");
        }, y2.asMilliseconds = function() {
          return this.as("milliseconds");
        }, y2.seconds = function() {
          return this.get("seconds");
        }, y2.asSeconds = function() {
          return this.as("seconds");
        }, y2.minutes = function() {
          return this.get("minutes");
        }, y2.asMinutes = function() {
          return this.as("minutes");
        }, y2.hours = function() {
          return this.get("hours");
        }, y2.asHours = function() {
          return this.as("hours");
        }, y2.days = function() {
          return this.get("days");
        }, y2.asDays = function() {
          return this.as("days");
        }, y2.weeks = function() {
          return this.get("weeks");
        }, y2.asWeeks = function() {
          return this.as("weeks");
        }, y2.months = function() {
          return this.get("months");
        }, y2.asMonths = function() {
          return this.as("months");
        }, y2.years = function() {
          return this.get("years");
        }, y2.asYears = function() {
          return this.as("years");
        }, l2;
      }();
      return function(n2, i2, e2) {
        t = e2, s2 = e2().$utils(), e2.duration = function(t2, s3) {
          var n3 = e2.locale();
          return f(t2, { $l: n3 }, s3);
        }, e2.isDuration = c;
        var r2 = i2.prototype.add, o2 = i2.prototype.subtract;
        i2.prototype.add = function(t2, s3) {
          return c(t2) && (t2 = t2.asMilliseconds()), r2.bind(this)(t2, s3);
        }, i2.prototype.subtract = function(t2, s3) {
          return c(t2) && (t2 = t2.asMilliseconds()), o2.bind(this)(t2, s3);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/utc.js
var require_utc = __commonJS({
  "node_modules/dayjs/plugin/utc.js"(exports, module2) {
    !function(t, i) {
      typeof exports == "object" && typeof module2 != "undefined" ? module2.exports = i() : typeof define == "function" && define.amd ? define(i) : (t = typeof globalThis != "undefined" ? globalThis : t || self).dayjs_plugin_utc = i();
    }(exports, function() {
      "use strict";
      var t = "minute", i = /[+-]\d\d(?::?\d\d)?/g, e = /([+-]|\d\d)/g;
      return function(s2, f, n) {
        var u = f.prototype;
        n.utc = function(t2) {
          var i2 = { date: t2, utc: true, args: arguments };
          return new f(i2);
        }, u.utc = function(i2) {
          var e2 = n(this.toDate(), { locale: this.$L, utc: true });
          return i2 ? e2.add(this.utcOffset(), t) : e2;
        }, u.local = function() {
          return n(this.toDate(), { locale: this.$L, utc: false });
        };
        var o = u.parse;
        u.parse = function(t2) {
          t2.utc && (this.$u = true), this.$utils().u(t2.$offset) || (this.$offset = t2.$offset), o.call(this, t2);
        };
        var r = u.init;
        u.init = function() {
          if (this.$u) {
            var t2 = this.$d;
            this.$y = t2.getUTCFullYear(), this.$M = t2.getUTCMonth(), this.$D = t2.getUTCDate(), this.$W = t2.getUTCDay(), this.$H = t2.getUTCHours(), this.$m = t2.getUTCMinutes(), this.$s = t2.getUTCSeconds(), this.$ms = t2.getUTCMilliseconds();
          } else
            r.call(this);
        };
        var a = u.utcOffset;
        u.utcOffset = function(s3, f2) {
          var n2 = this.$utils().u;
          if (n2(s3))
            return this.$u ? 0 : n2(this.$offset) ? a.call(this) : this.$offset;
          if (typeof s3 == "string" && (s3 = function(t2) {
            t2 === void 0 && (t2 = "");
            var s4 = t2.match(i);
            if (!s4)
              return null;
            var f3 = ("" + s4[0]).match(e) || ["-", 0, 0], n3 = f3[0], u3 = 60 * +f3[1] + +f3[2];
            return u3 === 0 ? 0 : n3 === "+" ? u3 : -u3;
          }(s3)) === null)
            return this;
          var u2 = Math.abs(s3) <= 16 ? 60 * s3 : s3, o2 = this;
          if (f2)
            return o2.$offset = u2, o2.$u = s3 === 0, o2;
          if (s3 !== 0) {
            var r2 = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
            (o2 = this.local().add(u2 + r2, t)).$offset = u2, o2.$x.$localOffset = r2;
          } else
            o2 = this.utc();
          return o2;
        };
        var h = u.format;
        u.format = function(t2) {
          var i2 = t2 || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return h.call(this, i2);
        }, u.valueOf = function() {
          var t2 = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || new Date().getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * t2;
        }, u.isUTC = function() {
          return !!this.$u;
        }, u.toISOString = function() {
          return this.toDate().toISOString();
        }, u.toString = function() {
          return this.toDate().toUTCString();
        };
        var l = u.toDate;
        u.toDate = function(t2) {
          return t2 === "s" && this.$offset ? n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : l.call(this);
        };
        var c = u.diff;
        u.diff = function(t2, i2, e2) {
          if (t2 && this.$u === t2.$u)
            return c.call(this, t2, i2, e2);
          var s3 = this.local(), f2 = n(t2).local();
          return c.call(s3, f2, i2, e2);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/timezone.js
var require_timezone = __commonJS({
  "node_modules/dayjs/plugin/timezone.js"(exports, module2) {
    !function(t, e) {
      typeof exports == "object" && typeof module2 != "undefined" ? module2.exports = e() : typeof define == "function" && define.amd ? define(e) : (t = typeof globalThis != "undefined" ? globalThis : t || self).dayjs_plugin_timezone = e();
    }(exports, function() {
      "use strict";
      var t = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 }, e = {};
      return function(n, i, o) {
        var r, a = function(t2, n2, i2) {
          i2 === void 0 && (i2 = {});
          var o2 = new Date(t2);
          return function(t3, n3) {
            n3 === void 0 && (n3 = {});
            var i3 = n3.timeZoneName || "short", o3 = t3 + "|" + i3, r2 = e[o3];
            return r2 || (r2 = new Intl.DateTimeFormat("en-US", { hour12: false, timeZone: t3, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: i3 }), e[o3] = r2), r2;
          }(n2, i2).formatToParts(o2);
        }, u = function(e2, n2) {
          for (var i2 = a(e2, n2), r2 = [], u2 = 0; u2 < i2.length; u2 += 1) {
            var f2 = i2[u2], s3 = f2.type, m = f2.value, c = t[s3];
            c >= 0 && (r2[c] = parseInt(m, 10));
          }
          var d = r2[3], l = d === 24 ? 0 : d, v = r2[0] + "-" + r2[1] + "-" + r2[2] + " " + l + ":" + r2[4] + ":" + r2[5] + ":000", h = +e2;
          return (o.utc(v).valueOf() - (h -= h % 1e3)) / 6e4;
        }, f = i.prototype;
        f.tz = function(t2, e2) {
          t2 === void 0 && (t2 = r);
          var n2 = this.utcOffset(), i2 = this.toDate(), a2 = i2.toLocaleString("en-US", { timeZone: t2 }), u2 = Math.round((i2 - new Date(a2)) / 1e3 / 60), f2 = o(a2).$set("millisecond", this.$ms).utcOffset(15 * -Math.round(i2.getTimezoneOffset() / 15) - u2, true);
          if (e2) {
            var s3 = f2.utcOffset();
            f2 = f2.add(n2 - s3, "minute");
          }
          return f2.$x.$timezone = t2, f2;
        }, f.offsetName = function(t2) {
          var e2 = this.$x.$timezone || o.tz.guess(), n2 = a(this.valueOf(), e2, { timeZoneName: t2 }).find(function(t3) {
            return t3.type.toLowerCase() === "timezonename";
          });
          return n2 && n2.value;
        };
        var s2 = f.startOf;
        f.startOf = function(t2, e2) {
          if (!this.$x || !this.$x.$timezone)
            return s2.call(this, t2, e2);
          var n2 = o(this.format("YYYY-MM-DD HH:mm:ss:SSS"));
          return s2.call(n2, t2, e2).tz(this.$x.$timezone, true);
        }, o.tz = function(t2, e2, n2) {
          var i2 = n2 && e2, a2 = n2 || e2 || r, f2 = u(+o(), a2);
          if (typeof t2 != "string")
            return o(t2).tz(a2);
          var s3 = function(t3, e3, n3) {
            var i3 = t3 - 60 * e3 * 1e3, o2 = u(i3, n3);
            if (e3 === o2)
              return [i3, e3];
            var r2 = u(i3 -= 60 * (o2 - e3) * 1e3, n3);
            return o2 === r2 ? [i3, o2] : [t3 - 60 * Math.min(o2, r2) * 1e3, Math.max(o2, r2)];
          }(o.utc(t2, i2).valueOf(), f2, a2), m = s3[0], c = s3[1], d = o(m).utcOffset(c);
          return d.$x.$timezone = a2, d;
        }, o.tz.guess = function() {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }, o.tz.setDefault = function(t2) {
          r = t2;
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/localizedFormat.js
var require_localizedFormat = __commonJS({
  "node_modules/dayjs/plugin/localizedFormat.js"(exports, module2) {
    !function(e, t) {
      typeof exports == "object" && typeof module2 != "undefined" ? module2.exports = t() : typeof define == "function" && define.amd ? define(t) : (e = typeof globalThis != "undefined" ? globalThis : e || self).dayjs_plugin_localizedFormat = t();
    }(exports, function() {
      "use strict";
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" };
      return function(t, o, n) {
        var r = o.prototype, i = r.format;
        n.en.formats = e, r.format = function(t2) {
          t2 === void 0 && (t2 = "YYYY-MM-DDTHH:mm:ssZ");
          var o2 = this.$locale().formats, n2 = function(t3, o3) {
            return t3.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t4, n3, r2) {
              var i2 = r2 && r2.toUpperCase();
              return n3 || o3[r2] || e[r2] || o3[i2].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t5, o4) {
                return t5 || o4.slice(1);
              });
            });
          }(t2, o2 === void 0 ? {} : o2);
          return i.call(this, n2);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/relativeTime.js
var require_relativeTime = __commonJS({
  "node_modules/dayjs/plugin/relativeTime.js"(exports, module2) {
    !function(r, e) {
      typeof exports == "object" && typeof module2 != "undefined" ? module2.exports = e() : typeof define == "function" && define.amd ? define(e) : (r = typeof globalThis != "undefined" ? globalThis : r || self).dayjs_plugin_relativeTime = e();
    }(exports, function() {
      "use strict";
      return function(r, e, t) {
        r = r || {};
        var n = e.prototype, o = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
        function i(r2, e2, t2, o2) {
          return n.fromToBase(r2, e2, t2, o2);
        }
        t.en.relativeTime = o, n.fromToBase = function(e2, n2, i2, d2, u) {
          for (var f, a, s2, l = i2.$locale().relativeTime || o, h = r.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h.length, c = 0; c < m; c += 1) {
            var y = h[c];
            y.d && (f = d2 ? t(e2).diff(i2, y.d, true) : i2.diff(e2, y.d, true));
            var p = (r.rounding || Math.round)(Math.abs(f));
            if (s2 = f > 0, p <= y.r || !y.r) {
              p <= 1 && c > 0 && (y = h[c - 1]);
              var v = l[y.l];
              u && (p = u("" + p)), a = typeof v == "string" ? v.replace("%d", p) : v(p, n2, y.l, s2);
              break;
            }
          }
          if (n2)
            return a;
          var M = s2 ? l.future : l.past;
          return typeof M == "function" ? M(a) : M.replace("%s", a);
        }, n.to = function(r2, e2) {
          return i(r2, e2, this, true);
        }, n.from = function(r2, e2) {
          return i(r2, e2, this);
        };
        var d = function(r2) {
          return r2.$u ? t.utc() : t();
        };
        n.toNow = function(r2) {
          return this.to(d(this), r2);
        }, n.fromNow = function(r2) {
          return this.from(d(this), r2);
        };
      };
    });
  }
});

// node_modules/dayjs/plugin/calendar.js
var require_calendar = __commonJS({
  "node_modules/dayjs/plugin/calendar.js"(exports, module2) {
    !function(e, t) {
      typeof exports == "object" && typeof module2 != "undefined" ? module2.exports = t() : typeof define == "function" && define.amd ? define(t) : (e = typeof globalThis != "undefined" ? globalThis : e || self).dayjs_plugin_calendar = t();
    }(exports, function() {
      "use strict";
      return function(e, t, a) {
        var n = "h:mm A", d = { lastDay: "[Yesterday at] " + n, sameDay: "[Today at] " + n, nextDay: "[Tomorrow at] " + n, nextWeek: "dddd [at] " + n, lastWeek: "[Last] dddd [at] " + n, sameElse: "MM/DD/YYYY" };
        t.prototype.calendar = function(e2, t2) {
          var n2 = t2 || this.$locale().calendar || d, o = a(e2 || void 0).startOf("d"), s2 = this.diff(o, "d", true), i = "sameElse", f = s2 < -6 ? i : s2 < -1 ? "lastWeek" : s2 < 0 ? "lastDay" : s2 < 1 ? "sameDay" : s2 < 2 ? "nextDay" : s2 < 7 ? "nextWeek" : i, l = n2[f] || d[f];
          return typeof l == "function" ? l.call(this, a()) : this.format(l);
        };
      };
    });
  }
});

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers2 = []) {
  return new Headers(headers2.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response2 = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers2 = new Headers(options2.headers);
    if (body !== null && !headers2.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers2.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers: headers2,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response2(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response2(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response2.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers2 = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers2.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers2.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers: headers2,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers2 = new Headers(request[INTERNALS].headers);
  if (!headers2.has("Accept")) {
    headers2.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers2.set("Content-Length", contentLengthValue);
  }
  if (!headers2.has("User-Agent")) {
    headers2.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers2.has("Accept-Encoding")) {
    headers2.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers2.has("Connection") && !agent) {
    headers2.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers2[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers2 = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers2.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers2.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch2(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers: headers2,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers2.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
globalThis.fetch = fetch2;
globalThis.Response = Response2;
globalThis.Request = Request;
globalThis.Headers = Headers;

// node_modules/@sveltejs/kit/dist/ssr.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  branch,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (branch) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${branch.map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2.path)},
						query: new URLSearchParams(${s$1(page2.query.toString())}),
						params: ${s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    return body2 ? `<script type="svelte-data" url="${url}" body="${hash(body2)}">${json}<\/script>` : `<script type="svelte-data" url="${url}">${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers2 = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers2["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers2["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers: headers2,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  if (loaded.error) {
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
function resolve(base, path) {
  const baseparts = path[0] === "/" ? [] : base.slice(1).split("/");
  const pathparts = path[0] === "/" ? path.slice(1).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  return `/${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page: page2,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        if (options2.read && url.startsWith(options2.paths.assets)) {
          url = url.replace(options2.paths.assets, "");
        }
        if (url.startsWith("//")) {
          throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
        }
        let response;
        if (/^[a-zA-Z]+:/.test(url)) {
          response = await fetch(url, opts);
        } else {
          const [path, search] = url.split("?");
          const resolved = resolve(request.path, path);
          const filename = resolved.slice(1);
          const filename_html = `${filename}/index.html`;
          const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
          if (asset) {
            if (options2.read) {
              response = new Response(options2.read(asset.file), {
                headers: {
                  "content-type": asset.type
                }
              });
            } else {
              response = await fetch(`http://${page2.host}/${asset.file}`, opts);
            }
          }
          if (!response) {
            const headers2 = { ...opts.headers };
            if (opts.credentials !== "omit") {
              uses_credentials = true;
              headers2.cookie = request.headers.cookie;
              if (!headers2.authorization) {
                headers2.authorization = request.headers.authorization;
              }
            }
            if (opts.body && typeof opts.body !== "string") {
              throw new Error("Request body must be a string");
            }
            const rendered = await respond({
              host: request.host,
              method: opts.method || "GET",
              headers: headers2,
              path: resolved,
              rawBody: opts.body,
              query: new URLSearchParams(search)
            }, options2, {
              fetched: url,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(resolved, rendered);
              }
              response = new Response(rendered.body, {
                status: rendered.status,
                headers: rendered.headers
              });
            }
          }
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers2 = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers2[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers2)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded.context,
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page: page2
    });
  } catch (error4) {
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
async function respond$1({ request, options: options2, state, $session, route }) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page: page2,
              node,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page: page2,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        branch.push(loaded);
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error3,
      branch: branch && branch.filter(Boolean),
      page: page2
    });
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return {
        status: 500,
        headers: {},
        body: `Bad request in load function: failed to fetch ${state.fetched}`
      };
    }
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler2) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler2({ ...request, params });
    if (response) {
      if (typeof response !== "object") {
        return error(`Invalid response from route ${request.path}: expected an object, got ${typeof response}`);
      }
      let { status = 200, body, headers: headers2 = {} } = response;
      headers2 = lowercase_keys(headers2);
      const type = headers2["content-type"];
      if (type === "application/octet-stream" && !(body instanceof Uint8Array)) {
        return error(`Invalid response from route ${request.path}: body must be an instance of Uint8Array if content type is application/octet-stream`);
      }
      if (body instanceof Uint8Array && type !== "application/octet-stream") {
        return error(`Invalid response from route ${request.path}: Uint8Array body must be accompanied by content-type: application/octet-stream header`);
      }
      let normalized_body;
      if (typeof body === "object" && (!type || type === "application/json")) {
        headers2 = { ...headers2, "content-type": "application/json" };
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      return { status, body: normalized_body, headers: headers2 };
    }
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield key;
      }
    }
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value;
      }
    }
  }
};
function parse_body(raw, headers2) {
  if (!raw)
    return raw;
  const [type, ...directives] = headers2["content-type"].split(/;\s*/);
  if (typeof raw === "string") {
    switch (type) {
      case "text/plain":
        return raw;
      case "application/json":
        return JSON.parse(raw);
      case "application/x-www-form-urlencoded":
        return get_urlencoded(raw);
      case "multipart/form-data": {
        const boundary = directives.find((directive) => directive.startsWith("boundary="));
        if (!boundary)
          throw new Error("Missing boundary");
        return get_multipart(raw, boundary.slice("boundary=".length));
      }
      default:
        throw new Error(`Invalid Content-Type ${type}`);
    }
  }
  return raw;
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !incoming.path.split("/").pop().includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers2 = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers: headers2,
        body: parse_body(incoming.rawBody, headers2),
        params: null,
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// node_modules/svelte/internal/index.mjs
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function set_store_value(store, ret, value = ret) {
  store.set(value);
  return ret;
}
var tasks = new Set();
function custom_event(type, detail) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, false, false, detail);
  return e;
}
var active_docs = new Set();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function beforeUpdate(fn) {
  get_current_component().$$.before_update.push(fn);
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var flushing = false;
var seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = new Set();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${String(value).replace(/"/g, "&#34;").replace(/'/g, "&#39;")}"`;
    }
  });
  return str;
}
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
  return classes ? ` class="${classes}"` : "";
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop2;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index2 = callbacks.indexOf(callback);
        if (index2 !== -1)
          callbacks.splice(index2, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}

// node_modules/svelte/store/index.mjs
var subscriber_queue2 = [];
function writable2(value, start = noop2) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue2.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue2.length; i += 2) {
            subscriber_queue2[i][0](subscriber_queue2[i + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}

// .svelte-kit/output/server/app.js
var import_meilisearch = __toModule(require_meilisearch_umd());
var import_dayjs = __toModule(require_dayjs_min());
var import_duration = __toModule(require_duration());
var import_utc = __toModule(require_utc());
var import_timezone = __toModule(require_timezone());
var import_localizedFormat = __toModule(require_localizedFormat());
var import_relativeTime = __toModule(require_relativeTime());
var import_calendar = __toModule(require_calendar());
var css$m = {
  code: "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}</style>"],"names":[],"mappings":"AAqDO,gCAAiB,CAAC,KAAK,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,kBAAkB,MAAM,GAAG,CAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,MAAM,CAAC,MAAM,GAAG,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title || "untitled page";
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$m);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1pdgbjn"}">${navigated ? `${escape2(title)}` : ``}</div>` : ``}`;
});
function set_paths(paths) {
}
var prerendering = false;
function set_prerendering(value) {
  prerendering = value;
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <link rel="icon" href="/favicon.png" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n\n    ' + head + '\n  </head>\n  <body>\n    <div id="mockify-app">' + body + "</div>\n  </body>\n</html>\n";
var options = null;
function init(settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-2a69f771.js",
      css: ["/./_app/assets/start-0826e215.css", "/./_app/assets/vendor-119c9bb3.css"],
      js: ["/./_app/start-2a69f771.js", "/./_app/chunks/vendor-651d64e5.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    read: settings.read,
    root: Root,
    router: true,
    ssr: true,
    target: "#mockify-app",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "img/chess-bg.svg", "size": 675276, "type": "image/svg+xml" }, { "file": "img/chess.jpg", "size": 184504, "type": "image/jpeg" }, { "file": "img/countlive.png", "size": 7258, "type": "image/png" }, { "file": "img/marth.png", "size": 307457, "type": "image/png" }, { "file": "img/mew2king.png", "size": 230459, "type": "image/png" }, { "file": "img/mkleo.png", "size": 122758, "type": "image/png" }, { "file": "img/piano.png", "size": 106067, "type": "image/png" }, { "file": "img/spoons.png", "size": 125397, "type": "image/png" }, { "file": "robots.txt", "size": 67, "type": "text/plain" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/courses\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/courses/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request))
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/courses/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-ccb1b7fd.js", "css": ["/./_app/assets/pages/__layout.svelte-6e9a02eb.css", "/./_app/assets/vendor-119c9bb3.css", "/./_app/assets/FormControl.svelte_svelte&type=style&lang-0beea450.css", "/./_app/assets/tooltip-2429a9d1.css"], "js": ["/./_app/pages/__layout.svelte-ccb1b7fd.js", "/./_app/chunks/vendor-651d64e5.js", "/./_app/chunks/FormControl.svelte_svelte&type=style&lang-cb9a3b64.js", "/./_app/chunks/tooltip-2ca14cb7.js"], "styles": null }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-79e1257e.js", "css": ["/./_app/assets/vendor-119c9bb3.css"], "js": ["/./_app/error.svelte-79e1257e.js", "/./_app/chunks/vendor-651d64e5.js"], "styles": null }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-68e526e0.js", "css": ["/./_app/assets/pages/index.svelte-487c1378.css", "/./_app/assets/vendor-119c9bb3.css", "/./_app/assets/FormControl.svelte_svelte&type=style&lang-0beea450.css", "/./_app/assets/Button-c2a8032f.css", "/./_app/assets/tooltip-2429a9d1.css"], "js": ["/./_app/pages/index.svelte-68e526e0.js", "/./_app/chunks/vendor-651d64e5.js", "/./_app/chunks/FormControl.svelte_svelte&type=style&lang-cb9a3b64.js", "/./_app/chunks/Button-44c9b716.js", "/./_app/chunks/tooltip-2ca14cb7.js"], "styles": null }, "src/routes/courses/index.svelte": { "entry": "/./_app/pages/courses/index.svelte-2805877b.js", "css": ["/./_app/assets/pages/courses/index.svelte-33843b93.css", "/./_app/assets/vendor-119c9bb3.css", "/./_app/assets/FormControl.svelte_svelte&type=style&lang-0beea450.css", "/./_app/assets/Button-c2a8032f.css"], "js": ["/./_app/pages/courses/index.svelte-2805877b.js", "/./_app/chunks/vendor-651d64e5.js", "/./_app/chunks/FormControl.svelte_svelte&type=style&lang-cb9a3b64.js", "/./_app/chunks/Button-44c9b716.js"], "styles": null } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
init({ paths: { "base": "", "assets": "/." } });
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var browser = false;
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var GOOGLE_ID = "G-NLJYTV81QQ";
var EnvironmentScripts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  onMount(() => {
    if (window.gtag) {
      window.gtag("js", new Date());
      window.gtag("config", GOOGLE_ID);
    }
  });
  $$unsubscribe_page();
  return `${$$result.head += `${`
    
    <script data-svelte="svelte-1imp5s3">!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="3BRVSxAfJiK8y3PWrX1Le8lJP6CH2j9l";analytics.SNIPPET_VERSION="4.13.2";
      analytics.load("3BRVSxAfJiK8y3PWrX1Le8lJP6CH2j9l");
      analytics.page();
      }}();
    <\/script>
    
    
    <script async src="${"https://www.googletagmanager.com/gtag/js?id=G-NLJYTV81QQ"}" data-svelte="svelte-1imp5s3"><\/script>
    <script data-svelte="svelte-1imp5s3">window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
    <\/script>`}`, ""}`;
});
var PageLoader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let progress = 0;
  onMount(() => {
    function next() {
      progress += 0.1;
      const remaining = 1 - progress;
      if (remaining > 0.15) {
        setTimeout(next, 500 / remaining);
      }
    }
    setTimeout(next, 250);
  });
  return `



<div class="${"bg-functional-r20 h-1 fixed top-0 left-0 z-50 transition-all duration-300"}" style="${"width: " + escape2(progress * 100) + "%"}"></div>`;
});
var BASE_APP_URL = "https://staging.metafy.gg";
var STATIC_URL = "https://static-staging.metafy.gg";
var SEARCH_URL = "https://search-staging.metafy.gg";
var BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};
var MEILISEARCH_KEY = "bc05189c89b579db2c024537f4420ddf78bc586dc1303956d5c979983fbff21c";
function createRemovableStore() {
  const { subscribe: subscribe2, update: update2 } = writable2([]);
  let genId = 0;
  return {
    subscribe: subscribe2,
    push: (options2 = {}) => {
      const item = { ...options2, id: genId++ };
      update2((value) => [...value, item]);
      return item;
    },
    remove: (item) => {
      update2((value) => value.filter((x) => x.id !== item.id));
    }
  };
}
function createPersistedStore(key, initialValue = {}) {
  const { subscribe: subscribe2, set, update: update2 } = writable2(initialValue);
  const store = {
    subscribe: subscribe2,
    set: (value) => {
      set(value);
    },
    get: () => {
      return get_store_value(store);
    },
    update: (fn) => {
      const result = get_store_value(store);
      const value = fn(result);
      store.set(value);
    },
    clear: () => {
      set(initialValue);
    }
  };
  return store;
}
var Toasts = createRemovableStore();
writable2({});
writable2(null);
writable2(null);
writable2([]);
writable2({
  liveBookings: [],
  replayBookings: [],
  payment: { totalCents: 0 }
});
var chatState = writable2({
  instance: null,
  enabled: true,
  participants: {},
  conversation: null,
  expanded: false,
  hasUnread: false
});
writable2({
  selectedTeamId: null,
  mobileVisible: false,
  sidebarIsExpanded: true
});
writable2(null);
createPersistedStore("mfy_promo_code", null);
var Toasts_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let toasts;
  let $Toasts, $$unsubscribe_Toasts;
  $$unsubscribe_Toasts = subscribe(Toasts, (value) => $Toasts = value);
  const placementClass = {
    left: "mr-auto",
    right: "ml-auto",
    center: "mx-auto"
  };
  const KIND_CLASSES = {
    info: {
      background: "bg-neutrals-l40",
      color: "text-white"
    },
    attention: {
      background: "bg-functional-y20",
      color: "text-functional-y20"
    },
    error: {
      background: "bg-functional-r50",
      color: "text-functional-r50"
    },
    success: {
      background: "bg-functional-g30",
      color: "text-functional-g30"
    }
  };
  function getOpacity(index2) {
    const opacities = ["opacity-40", "opacity-65", "opacity-100"];
    return opacities[3 - toasts.length + index2];
  }
  function getPlacementClass(toast) {
    return placementClass[toast.placement || "right"];
  }
  toasts = $Toasts.slice(Math.min(Math.max($Toasts.length - 3, 0), $Toasts.length));
  $$unsubscribe_Toasts();
  return `
<div class="${"fixed w-full pointer-events-none left-0 bottom-0 p-6 sm:p-5 z-toast"}"><div class="${"flex flex-col items-start space-y-5"}">${each(toasts, (toast, index2) => `<button class="${escape2(KIND_CLASSES[toast.kind].background) + " " + escape2(getOpacity(index2)) + " " + escape2(getPlacementClass(toast)) + " bg-opacity-25 relative w-full sm:w-auto pointer-events-auto inline-flex items-center shadow-lg rounded-lg p-3 pr-5 backdrop-filter backdrop-blur-md"}">
        <span>${toast.kind === "info" ? `<svg width="${"32"}" height="${"32"}" viewBox="${"0 0 32 32"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><rect width="${"32"}" height="${"32"}" rx="${"8"}" fill="${"#21252A"}"></rect><rect x="${"15"}" y="${"15"}" width="${"2"}" height="${"8"}" rx="${"1"}" fill="${"white"}"></rect><circle cx="${"15.9998"}" cy="${"11.3333"}" r="${"1.33333"}" fill="${"white"}"></circle></svg>` : `${toast.kind === "attention" ? `<svg width="${"32"}" height="${"32"}" viewBox="${"0 0 32 32"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><rect width="${"32"}" height="${"32"}" rx="${"8"}" fill="${"#EE6B0D"}"></rect><path d="${"M13.827 10.2537C13.6948 9.32809 14.413 8.5 15.348 8.5H16.7612C17.6961 8.5 18.4143 9.32809 18.2821 10.2536L17.3029 17.1083C17.2141 17.7295 16.6821 18.191 16.0546 18.191C15.427 18.191 14.895 17.7295 14.8063 17.1083L13.827 10.2537Z"}" stroke="${"white"}"></path><circle cx="${"16.0544"}" cy="${"22.7637"}" r="${"1.53637"}" stroke="${"white"}"></circle></svg>` : `${toast.kind === "error" ? `<svg width="${"32"}" height="${"32"}" viewBox="${"0 0 32 32"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><rect width="${"32"}" height="${"32"}" rx="${"8"}" fill="${"#F14343"}"></rect><path d="${"M11.1819 11.1818L21.2099 21.2099"}" stroke="${"white"}" stroke-width="${"1.77273"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><path d="${"M21.2099 11.1818L11.1818 21.2099"}" stroke="${"white"}" stroke-width="${"1.77273"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path></svg>` : `${toast.kind === "success" ? `<svg width="${"32"}" height="${"32"}" viewBox="${"0 0 32 32"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><rect width="${"32"}" height="${"32"}" rx="${"8"}" fill="${"#239F5C"}"></rect><path d="${"M9.55093 17.3099L14.0047 21.4211L22.9123 11.4"}" stroke="${"white"}" stroke-width="${"2.14737"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path></svg>` : ``}`}`}`}</span>

        <div class="${"flex items-center ml-3"}">${toast.content ? `<p class="${"font-medium text-neutrals-l00 text-left"}">${escape2(toast.content)}
            </p>` : ``}
          
          ${toast.actions ? `<div class="${"w-px flex-shrink-0 h-6 bg-neutrals-l50 bg-opacity-25 mx-3"}"></div>
            ${each(toast.actions, (action, idx) => `<button class="${"font-medium text-sm md:text-base leading-none " + escape2(KIND_CLASSES[toast.kind].color)}">${escape2(action.content)}
              </button>`)}` : ``}</div>
      </button>`)}</div></div>`;
});
var expanded = createPersistedStore("sidebar_expanded", false);
var isSidebarHiddenMobile = writable2(false);
var Browse_games = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "21" },
    { height: "13" },
    { viewBox: "0 0 21 13" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><circle cx="${"15.2445"}" cy="${"7.90482"}" r="${"3.40482"}" fill="${"var(--primaryColor, currentColor)"}" fill-opacity="${"0.24"}" stroke="${"var(--primaryColor, currentColor)"}"></circle><path d="${"M17.7294 10.3896L20 12.5"}" stroke="${"var(--primaryColor, currentColor)"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><path d="${"M16.389 1H9.46396H5.54707C3.82036 1 2.35578 2.26831 2.10902 3.9773L1.30672 9.53401C1.14492 10.6546 2.01411 11.6583 3.14634 11.6583V11.6583C3.73257 11.6583 4.28444 11.3818 4.63532 10.9121L6.56249 8.33281C6.69365 8.15728 6.89992 8.05391 7.11904 8.05391H9.46396"}" stroke="${"var(--primaryColor, currentColor)"}" stroke-linecap="${"round"}"></path></svg>`;
});
var League = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "14" },
    { height: "16" },
    { viewBox: "0 0 14 16" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M2.09971 0C2.03471 0 1.97099 0.0188053 1.9157 0.0543088C1.8604 0.0898123 1.81572 0.140611 1.78665 0.201013C1.75758 0.261415 1.74527 0.329034 1.75111 0.396293C1.75695 0.463552 1.7807 0.527793 1.8197 0.581818L2.79972 1.93891V14.0611L1.46969 15.4182C1.43069 15.4722 1.40694 15.5364 1.4011 15.6037C1.39527 15.671 1.40757 15.7386 1.43664 15.799C1.46571 15.8594 1.51039 15.9102 1.56569 15.9457C1.62098 15.9812 1.6847 16 1.7497 16H11.8999C12.0063 16 12.1068 15.9498 12.1733 15.8636L13.9233 14.0455C13.9643 13.9919 13.9899 13.9274 13.9972 13.8594C14.0045 13.7915 13.9933 13.7227 13.9648 13.6611C13.9362 13.5994 13.8916 13.5474 13.8359 13.5108C13.7803 13.4743 13.7158 13.4548 13.65 13.4545H6.29981V0.363636C6.29981 0.267194 6.26293 0.174702 6.19729 0.106507C6.13165 0.0383116 6.04263 0 5.9498 0H2.09971ZM6.99983 1.45455V2.18182C10.4737 2.18182 13.3 5.11818 13.3 8.72727C13.3 10.2342 12.8026 11.6196 11.9759 12.7273H12.8401C13.5972 11.5416 14.0007 10.1502 14 8.72727C14 4.71709 10.8597 1.45455 6.99983 1.45455ZM6.99983 2.90909V12.7273H11.0564C12.0105 11.6836 12.6 10.2771 12.6 8.72727C12.6 5.51927 10.0876 2.90909 6.99983 2.90909ZM2.09971 3.54182C0.890076 4.776 0.107107 6.46 0.0101545 8.33164C-0.00757797 8.67586 -0.00208107 9.02094 0.0266049 9.36436C0.175359 11.1389 0.942227 12.7316 2.09971 13.9127V12.8316C1.19333 11.6711 0.698972 10.2218 0.699671 8.72727C0.698972 7.23274 1.19333 5.78347 2.09971 4.62291V3.54182ZM2.09971 5.91673C1.64001 6.77644 1.39907 7.74381 1.39969 8.72727C1.39969 9.74618 1.65484 10.704 2.09971 11.5378V5.91636V5.91673Z"}" fill="${"white"}"></path></svg>`;
});
var Overwatch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "17" },
    { height: "17" },
    { viewBox: "0 0 17 17" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><circle cx="${"8.00464"}" cy="${"9"}" r="${"8"}" fill="${"#515E6C"}"></circle><path d="${"M7.9135 0.996468C6.13275 1.00788 4.37228 1.64268 2.98916 2.759L4.50041 4.5136C5.77587 3.50705 7.49443 3.09687 9.08838 3.41375C9.96436 3.58227 10.7979 3.96691 11.5012 4.5136L13.0124 2.759C11.5818 1.60458 9.7555 0.968865 7.9135 0.996468Z"}" fill="${"#FA9C1E"}"></path><path d="${"M2.49719 3.19034C0.904804 4.68633 -0.0288637 6.86099 0.000680764 9.05458C0.00162493 11.3316 1.0403 13.5682 2.76523 15.0476C4.35968 16.4421 6.52819 17.1524 8.64526 16.9727C10.9393 16.8019 13.1167 15.5766 14.4628 13.715C15.773 11.9459 16.2863 9.61301 15.8514 7.44965C15.5317 5.79358 14.6634 4.2588 13.4286 3.11804L11.9174 4.87264C13.1351 6.02043 13.8 7.71468 13.6746 9.38611C13.6198 10.2142 13.3793 11.0315 12.9728 11.7588L9.89296 8.7839L8.33908 5.43443L8.33675 10.5068L11.4492 13.5187C10.0622 14.5963 8.15918 14.9537 6.47288 14.476C5.78625 14.2845 5.13606 13.9631 4.57097 13.5319L7.70456 10.5068C7.6991 8.85764 7.7237 7.07743 7.70455 5.42898L6.14835 8.7839L3.04209 11.7835C2.09444 10.1292 2.07177 7.99051 2.9839 6.31776C3.26904 5.78188 3.64644 5.29283 4.08427 4.87264L2.57302 3.11804C2.54774 3.14214 2.52247 3.16624 2.49719 3.19034Z"}" fill="${"white"}"></path></svg>`;
});
import_dayjs.default.extend(import_duration.default);
import_dayjs.default.extend(import_utc.default);
import_dayjs.default.extend(import_timezone.default);
import_dayjs.default.extend(import_localizedFormat.default);
import_dayjs.default.extend(import_relativeTime.default);
import_dayjs.default.extend(import_calendar.default);
var originaltz = import_dayjs.default.tz;
import_dayjs.default.tz = function() {
  try {
    return originaltz(...arguments);
  } catch (error22) {
    Toasts.push({
      duration: 0,
      kind: "error",
      content: "Your time zone is considered invalid by your web browser."
    });
    return (0, import_dayjs.default)();
  }
};
Object.keys(originaltz).forEach((key) => {
  import_dayjs.default.tz[key] = originaltz[key];
});
var headers = { "content-type": "application/json" };
{
  headers = { ...headers, "x-metafy-client": 1 };
}
function resizeUrl(url, opts = {}) {
  if (!opts.width && !opts.height) {
    throw new Error("Must provide width or height to resizeImage");
  }
  let query = "";
  ["width", "height", "dpr", "fit", "gravity", "quality", "format", "sharpen"].forEach((key) => {
    if (key in opts && opts[key] !== void 0) {
      query = `${query},${key}=${opts[key]}`;
    }
  });
  query = query.slice(1);
  if (!opts.format) {
    query = `${query},format=auto`;
  }
  return `${STATIC_URL}/img/${query}/${url.replace(`${STATIC_URL}/`, "")}`;
}
var matchers = {};
var matchersJit = {};
["DEFAULT", ...Object.keys(BREAKPOINTS)].forEach((bp) => {
  const bpKey = bp === "DEFAULT" ? "" : bp + ":";
  matchers[bp] = {};
  matchersJit[bp] = {};
  ["w", "h"].forEach((sizeKey) => {
    matchers[bp][sizeKey] = new RegExp(bpKey + sizeKey + "-([0-9.]+)");
    matchersJit[bp][sizeKey] = new RegExp(bpKey + sizeKey + "-\\[([0-9]+)\\px]");
  });
});
function extractSize(classes, key, bp) {
  let match = classes.match(matchers[bp][key]);
  if (match) {
    return parseFloat(match[1], 10) * 4;
  }
  match = classes.match(matchersJit[bp][key]);
  return match ? parseInt(match[1], 10) : void 0;
}
function extractSizes(size) {
  const sizes = {};
  ["DEFAULT", ...Object.keys(BREAKPOINTS)].forEach((bp) => {
    const width = extractSize(size, "w", bp);
    const height2 = extractSize(size, "h", bp);
    if (width !== void 0 || height2 !== void 0) {
      sizes[bp] = { width, height: height2 };
    }
  });
  return sizes;
}
function resizeImage(url, size, opts) {
  if (size.length === 0 || !url || url.length === 0 || url.split(".").pop() === "svg") {
    return {};
  }
  const sizes = extractSizes(size);
  if (Object.keys(sizes).length === 0) {
    return {};
  }
  if (Object.values(sizes).every(({ width }) => width === void 0)) {
    const biggest = Object.values(sizes).reduce((acc, v) => {
      if (v.height > acc.height) {
        return v;
      }
      return acc;
    }, { width: -Infinity, height: -Infinity });
    return {
      src: resizeUrl(url, { ...opts, ...biggest }),
      attributes: biggest
    };
  }
  let srcsetItems = [];
  let sizesItems = [];
  const resized = {};
  for (const [bp, { width, height: height2 }] of Object.entries(sizes)) {
    resized[bp] = resizeUrl(url, { ...opts, width, height: height2 });
    srcsetItems.push(`${resized[bp]} ${width}w`);
    if (bp === "DEFAULT") {
      sizesItems.push(width + "px");
    } else {
      sizesItems.push(`(min-width: ${BREAKPOINTS[bp]}px) ${width}px`);
    }
  }
  const smallestSize = Object.values(sizes).reduce((acc, v) => {
    if (v.width !== void 0 && v.width < acc.width || v.height !== void 0 && v.height < acc.height) {
      return v;
    }
    return acc;
  }, { width: Infinity, height: Infinity });
  return {
    srcResized: resized,
    src: resized["DEFAULT"],
    srcset: srcsetItems.join(", "),
    sizes: sizesItems.reverse().join(", "),
    attributes: smallestSize
  };
}
var MAX_RETRY_ATTEMPTS = 2;
var retryAttempts = 0;
var client;
async function searchIndex(index2, query = "", options2 = {}) {
  var _a, _b;
  try {
    if (!browser) {
      throw new Error("Search can only be invoked from the browser");
    }
    if (!index2) {
      throw new Error("Must provide an index");
    }
    if (!client) {
      client = new import_meilisearch.MeiliSearch({ host: SEARCH_URL, apiKey: MEILISEARCH_KEY });
    }
    try {
      return client.index(index2).search(query, options2);
    } catch (error22) {
      if ((error22 == null ? void 0 : error22.type) === "MeiliSearchCommunicationError") {
        if (retryAttempts < MAX_RETRY_ATTEMPTS) {
          retryAttempts += 1;
          const value = await searchIndex(index2, query, options2);
          if (value) {
            retryAttempts = 0;
            return value;
          }
        }
      } else {
        console.error(error22, { extra: { retryAttempts } });
      }
    } finally {
      retryAttempts = 0;
    }
  } catch (error22) {
    if (!((_b = (_a = error22 == null ? void 0 : error22.message) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, "Operation not supported"))) {
      console.error(error22);
    }
    return {};
  }
}
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { target = "body" } = $$props;
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  return `




<div hidden>${slots.default ? slots.default({}) : ``}</div>`;
});
var Remove = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "11" },
    { height: "11" },
    { viewBox: "0 0 11 11" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M1.20831 0.625L10.375 9.79167"}" stroke="${"currentColor"}" stroke-miterlimit="${"10"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><path d="${"M10.375 0.625L1.20831 9.79167"}" stroke="${"currentColor"}" stroke-miterlimit="${"10"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path></svg>`;
});
var css$l = {
  code: ".modal.center.svelte-a45qsx{left:50%;top:50%;transform:translate(-50%,-50%)}.modal.center.limitHeight.svelte-a45qsx{max-height:calc(100vh - 4rem)}.modal.right.svelte-a45qsx{height:100%;right:0;top:0}",
  map: `{"version":3,"file":"Modal.svelte","sources":["Modal.svelte"],"sourcesContent":["<svelte:options immutable={true} />\\n\\n<script>\\n  import { createEventDispatcher, onMount, onDestroy, afterUpdate } from 'svelte';\\n  import { fly, fade } from 'svelte/transition';\\n  import { cubicInOut } from 'svelte/easing';\\n  import { toggleBodyScroll } from '@metafy/lib/utils';\\n  import { BREAKPOINTS } from '@metafy/lib/constants';\\n  import { portal } from '@metafy/components/Portal.svelte';\\n  import Remove from '@metafy/assets/svgs/remove.svg';\\n\\n  const dispatch = createEventDispatcher();\\n\\n  export let isVisible = false;\\n  /** @type {'center' | 'right'} */\\n  export let placement = 'center';\\n  export let widthClass = 'w-11/12 md:w-7/12 xl:w-9/12';\\n  export let backgroundClass = 'bg-black bg-opacity-90';\\n  export let backgroundZindex = 'z-modal-backdrop';\\n  export let modalZindex = 'z-modal';\\n  export let portalTarget = null;\\n  export let limitHeight = true;\\n  export let hasBackground = true;\\n  export let closeButton = true;\\n  export let closeOnClickOutside = true;\\n  export let closeOnEscape = true;\\n  let className = 'bg-neutrals-d10 shadow';\\n  export { className as class };\\n  export let overflow = 'overflow-auto';\\n  export let rounded = 'rounded-3xl';\\n  export let ariaLabel = 'modal';\\n  /** @type {boolean | 'mobile'} */\\n  export let disableScroll = true;\\n\\n  let innerWidth;\\n  let el;\\n  $: if (\\n    isVisible &&\\n    (disableScroll || (disableScroll === 'mobile' && innerWidth < BREAKPOINTS['xl']))\\n  ) {\\n    // Prevent body scrolling when modal is open\\n    toggleBodyScroll(false);\\n    dispatch('open', { el });\\n  } else {\\n    // TODO: Only re-enable scrolling after ALL modals are closed.\\n    // Re-enable body scrolling after modal is closed\\n    toggleBodyScroll(true);\\n    dispatch('close');\\n  }\\n  $: flyCoords = placement === 'center' ? { y: 100 } : { x: 100 };\\n\\n  function onKeyDown(event) {\\n    // Close on escape key\\n    if (!closeOnEscape || event.isComposing || event.keyCode !== 27) {\\n      return;\\n    }\\n\\n    close();\\n  }\\n\\n  function close() {\\n    isVisible = false;\\n  }\\n\\n  onMount(() => {\\n    if (isVisible) {\\n      toggleBodyScroll(false);\\n    }\\n  });\\n\\n  afterUpdate(() => {\\n    if (isVisible) {\\n      dispatch('afterVisible');\\n    }\\n  });\\n\\n  onDestroy(() => {\\n    toggleBodyScroll(true);\\n  });\\n<\/script>\\n\\n<svelte:window on:keydown={onKeyDown} bind:innerWidth />\\n\\n<!-- Sometimes we need to use a portal to render the Modal outside of its parent component\\n  For example, when the Modal is a child of an element that has the \`transform\` property set, it breaks the modal behaviour. -->\\n{#if isVisible}\\n  <div class=\\"absolute\\" use:portal={portalTarget}>\\n    {#if hasBackground}\\n      <!-- Background -->\\n      <div\\n        class=\\"block fixed top-0 left-0 w-full h-full {backgroundClass} {backgroundZindex}\\"\\n        transition:fade|local={{ duration: 150 }}\\n        on:click={() => {\\n          dispatch('clickoutside');\\n\\n          if (closeOnClickOutside) {\\n            close();\\n          }\\n        }}\\n      />\\n    {/if}\\n    <!-- Modal -->\\n    <div\\n      bind:this={el}\\n      class=\\"modal fixed {modalZindex} {className} {overflow} {widthClass} {rounded}\\"\\n      class:center={placement === 'center'}\\n      class:right={placement === 'right'}\\n      class:limitHeight\\n      role=\\"dialog\\"\\n      aria-modal=\\"true\\"\\n      aria-label={ariaLabel}\\n      transition:fly|local={{ ...flyCoords, duration: 400, easing: cubicInOut }}\\n    >\\n      <!-- Close button -->\\n      {#if closeButton}\\n        <button\\n          type=\\"button\\"\\n          class=\\"absolute top-7.5 right-7.5 appearance-none focus:outline-none\\"\\n          on:click={close}\\n        >\\n          <Remove class=\\"w-7.5 h-7.5 text-neutrals-l30\\" />\\n        </button>\\n      {/if}\\n\\n      <!-- Content -->\\n      <slot />\\n    </div>\\n  </div>\\n{/if}\\n\\n<style>.modal.center{left:50%;top:50%;transform:translate(-50%,-50%)}.modal.center.limitHeight{max-height:calc(100vh - 4rem)}.modal.right{height:100%;right:0;top:0}</style>\\n"],"names":[],"mappings":"AAkIO,MAAM,qBAAO,CAAC,KAAK,GAAG,CAAC,IAAI,GAAG,CAAC,UAAU,UAAU,IAAI,CAAC,IAAI,CAAC,CAAC,MAAM,OAAO,0BAAY,CAAC,WAAW,KAAK,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,oBAAM,CAAC,OAAO,IAAI,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,CAAC"}`
};
var Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const dispatch = createEventDispatcher();
  let { isVisible: isVisible2 = false } = $$props;
  let { placement = "center" } = $$props;
  let { widthClass = "w-11/12 md:w-7/12 xl:w-9/12" } = $$props;
  let { backgroundClass = "bg-black bg-opacity-90" } = $$props;
  let { backgroundZindex = "z-modal-backdrop" } = $$props;
  let { modalZindex = "z-modal" } = $$props;
  let { portalTarget = null } = $$props;
  let { limitHeight = true } = $$props;
  let { hasBackground = true } = $$props;
  let { closeButton = true } = $$props;
  let { closeOnClickOutside = true } = $$props;
  let { closeOnEscape = true } = $$props;
  let { class: className = "bg-neutrals-d10 shadow" } = $$props;
  let { overflow = "overflow-auto" } = $$props;
  let { rounded = "rounded-3xl" } = $$props;
  let { ariaLabel = "modal" } = $$props;
  let { disableScroll = true } = $$props;
  let innerWidth;
  let el;
  onMount(() => {
  });
  afterUpdate(() => {
    if (isVisible2) {
      dispatch("afterVisible");
    }
  });
  onDestroy(() => {
  });
  if ($$props.isVisible === void 0 && $$bindings.isVisible && isVisible2 !== void 0)
    $$bindings.isVisible(isVisible2);
  if ($$props.placement === void 0 && $$bindings.placement && placement !== void 0)
    $$bindings.placement(placement);
  if ($$props.widthClass === void 0 && $$bindings.widthClass && widthClass !== void 0)
    $$bindings.widthClass(widthClass);
  if ($$props.backgroundClass === void 0 && $$bindings.backgroundClass && backgroundClass !== void 0)
    $$bindings.backgroundClass(backgroundClass);
  if ($$props.backgroundZindex === void 0 && $$bindings.backgroundZindex && backgroundZindex !== void 0)
    $$bindings.backgroundZindex(backgroundZindex);
  if ($$props.modalZindex === void 0 && $$bindings.modalZindex && modalZindex !== void 0)
    $$bindings.modalZindex(modalZindex);
  if ($$props.portalTarget === void 0 && $$bindings.portalTarget && portalTarget !== void 0)
    $$bindings.portalTarget(portalTarget);
  if ($$props.limitHeight === void 0 && $$bindings.limitHeight && limitHeight !== void 0)
    $$bindings.limitHeight(limitHeight);
  if ($$props.hasBackground === void 0 && $$bindings.hasBackground && hasBackground !== void 0)
    $$bindings.hasBackground(hasBackground);
  if ($$props.closeButton === void 0 && $$bindings.closeButton && closeButton !== void 0)
    $$bindings.closeButton(closeButton);
  if ($$props.closeOnClickOutside === void 0 && $$bindings.closeOnClickOutside && closeOnClickOutside !== void 0)
    $$bindings.closeOnClickOutside(closeOnClickOutside);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.overflow === void 0 && $$bindings.overflow && overflow !== void 0)
    $$bindings.overflow(overflow);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.disableScroll === void 0 && $$bindings.disableScroll && disableScroll !== void 0)
    $$bindings.disableScroll(disableScroll);
  $$result.css.add(css$l);
  {
    if (isVisible2 && (disableScroll || disableScroll === "mobile" && innerWidth < BREAKPOINTS["xl"])) {
      dispatch("open", { el });
    } else {
      dispatch("close");
    }
  }
  return `






${isVisible2 ? `<div class="${"absolute"}">${hasBackground ? `
      <div class="${"block fixed top-0 left-0 w-full h-full " + escape2(backgroundClass) + " " + escape2(backgroundZindex) + " svelte-a45qsx"}"></div>` : ``}
    
    <div class="${[
    "modal fixed " + escape2(modalZindex) + " " + escape2(className) + " " + escape2(overflow) + " " + escape2(widthClass) + " " + escape2(rounded) + " svelte-a45qsx",
    (placement === "center" ? "center" : "") + " " + (placement === "right" ? "right" : "") + " " + (limitHeight ? "limitHeight" : "")
  ].join(" ").trim()}" role="${"dialog"}" aria-modal="${"true"}"${add_attribute("aria-label", ariaLabel, 0)}${add_attribute("this", el, 1)}>
      ${closeButton ? `<button type="${"button"}" class="${"absolute top-7.5 right-7.5 appearance-none focus:outline-none"}">${validate_component(Remove, "Remove").$$render($$result, { class: "w-7.5 h-7.5 text-neutrals-l30" }, {}, {})}</button>` : ``}

      
      ${slots.default ? slots.default({}) : ``}</div></div>` : ``}`;
});
var Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let resized;
  let { src: src2 = null } = $$props;
  let { alt = "" } = $$props;
  let { lazy = true } = $$props;
  let { class: className = "" } = $$props;
  let { size = "" } = $$props;
  let { fit = "contain" } = $$props;
  let { gravity = "" } = $$props;
  let { border = "" } = $$props;
  let { rounded = "" } = $$props;
  let { align = "self-start" } = $$props;
  if ($$props.src === void 0 && $$bindings.src && src2 !== void 0)
    $$bindings.src(src2);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.lazy === void 0 && $$bindings.lazy && lazy !== void 0)
    $$bindings.lazy(lazy);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.fit === void 0 && $$bindings.fit && fit !== void 0)
    $$bindings.fit(fit);
  if ($$props.gravity === void 0 && $$bindings.gravity && gravity !== void 0)
    $$bindings.gravity(gravity);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  resized = resizeImage(src2, size, {
    fit,
    gravity,
    sharpen: "1",
    quality: "100"
  });
  return `<img${spread([
    { src: escape2(resized.src || src2) },
    { srcset: escape2(resized.srcset || "") },
    { sizes: escape2(resized.sizes || "") },
    resized.attributes,
    { alt: escape2(alt) },
    { loading: escape2(lazy ? "lazy" : "eager") },
    {
      class: escape2(className) + " " + escape2(size) + " " + escape2(align) + " " + escape2(border) + " " + escape2(border !== "" ? "box-content" : "") + " " + escape2(rounded) + " flex-shrink-0"
    }
  ])}>`;
});
var GamePoster = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { game = {} } = $$props;
  let { class: className = "" } = $$props;
  let { size } = $$props;
  let { border = "" } = $$props;
  let { rounded = "" } = $$props;
  let { square = true } = $$props;
  let { link = true } = $$props;
  if ($$props.game === void 0 && $$bindings.game && game !== void 0)
    $$bindings.game(game);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.square === void 0 && $$bindings.square && square !== void 0)
    $$bindings.square(square);
  if ($$props.link === void 0 && $$bindings.link && link !== void 0)
    $$bindings.link(link);
  return `
${link ? `<a href="${"/" + escape2(game.slug)}" class="${"flex-shrink-0 " + escape2(className) + " " + escape2(rounded)}" sveltekit:prefetch>${validate_component(Image, "Image").$$render($$result, {
    src: game.poster,
    alt: game.title.en,
    class: square ? "object-cover" : "",
    size,
    border,
    rounded,
    fit: square ? "crop" : "cover"
  }, {}, {})}</a>` : `${validate_component(Image, "Image").$$render($$result, {
    src: game.poster,
    alt: game.title.en,
    class: (square ? "object-cover" : "") + " " + className,
    size,
    border,
    rounded,
    fit: square ? "crop" : "cover"
  }, {}, {})}`}`;
});
var css$k = {
  code: ".item.svelte-1bv8nba{color:var(--itemColor,inherit);cursor:default;height:var(--height,42px);line-height:var(--height,42px);overflow:hidden;padding:var(--itemPadding,0 20px);text-overflow:ellipsis;white-space:nowrap}.groupHeader.svelte-1bv8nba{text-transform:var(--groupTitleTextTransform,uppercase)}.groupItem.svelte-1bv8nba{padding-left:var(--groupItemPaddingLeft,40px)}.item.svelte-1bv8nba:active{background:var(--itemActiveBackground,#b9daff)}.item.active.svelte-1bv8nba{background:var(--itemIsActiveBG,#007aff);color:var(--itemIsActiveColor,#fff)}.item.first.svelte-1bv8nba{border-radius:var(--itemFirstBorderRadius,4px 4px 0 0)}.item.hover.svelte-1bv8nba:not(.active){background:var(--itemHoverBG,#e7f2ff)}",
  map: `{"version":3,"file":"Item.svelte","sources":["Item.svelte"],"sourcesContent":["<script>\\n  export let isActive = false;\\n  export let isFirst = false;\\n  export let isHover = false;\\n  export let getOptionLabel = undefined;\\n  export let item = undefined;\\n  export let filterText = '';\\n\\n  let itemClasses = '';\\n\\n  $: {\\n    const classes = [];\\n    if (isActive) { classes.push('active'); }\\n    if (isFirst) { classes.push('first'); }\\n    if (isHover) { classes.push('hover'); }\\n    if (item.isGroupHeader) { classes.push('groupHeader'); }\\n    if (item.isGroupItem) { classes.push('groupItem'); }\\n    itemClasses = classes.join(' ');\\n  }\\n<\/script>\\n\\n<style>.item{color:var(--itemColor,inherit);cursor:default;height:var(--height,42px);line-height:var(--height,42px);overflow:hidden;padding:var(--itemPadding,0 20px);text-overflow:ellipsis;white-space:nowrap}.groupHeader{text-transform:var(--groupTitleTextTransform,uppercase)}.groupItem{padding-left:var(--groupItemPaddingLeft,40px)}.item:active{background:var(--itemActiveBackground,#b9daff)}.item.active{background:var(--itemIsActiveBG,#007aff);color:var(--itemIsActiveColor,#fff)}.item.first{border-radius:var(--itemFirstBorderRadius,4px 4px 0 0)}.item.hover:not(.active){background:var(--itemHoverBG,#e7f2ff)}</style>\\n\\n\\n\\n<div class=\\"item {itemClasses}\\">\\n  {@html getOptionLabel(item, filterText)}\\n</div>\\n"],"names":[],"mappings":"AAqBO,oBAAK,CAAC,MAAM,IAAI,WAAW,CAAC,OAAO,CAAC,CAAC,OAAO,OAAO,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,SAAS,MAAM,CAAC,QAAQ,IAAI,aAAa,CAAC,MAAM,CAAC,CAAC,cAAc,QAAQ,CAAC,YAAY,MAAM,CAAC,2BAAY,CAAC,eAAe,IAAI,yBAAyB,CAAC,SAAS,CAAC,CAAC,yBAAU,CAAC,aAAa,IAAI,sBAAsB,CAAC,IAAI,CAAC,CAAC,oBAAK,OAAO,CAAC,WAAW,IAAI,sBAAsB,CAAC,OAAO,CAAC,CAAC,KAAK,sBAAO,CAAC,WAAW,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,mBAAmB,CAAC,IAAI,CAAC,CAAC,KAAK,qBAAM,CAAC,cAAc,IAAI,uBAAuB,CAAC,WAAW,CAAC,CAAC,KAAK,qBAAM,KAAK,OAAO,CAAC,CAAC,WAAW,IAAI,aAAa,CAAC,OAAO,CAAC,CAAC"}`
};
var Item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isActive = false } = $$props;
  let { isFirst = false } = $$props;
  let { isHover = false } = $$props;
  let { getOptionLabel = void 0 } = $$props;
  let { item = void 0 } = $$props;
  let { filterText = "" } = $$props;
  let itemClasses = "";
  if ($$props.isActive === void 0 && $$bindings.isActive && isActive !== void 0)
    $$bindings.isActive(isActive);
  if ($$props.isFirst === void 0 && $$bindings.isFirst && isFirst !== void 0)
    $$bindings.isFirst(isFirst);
  if ($$props.isHover === void 0 && $$bindings.isHover && isHover !== void 0)
    $$bindings.isHover(isHover);
  if ($$props.getOptionLabel === void 0 && $$bindings.getOptionLabel && getOptionLabel !== void 0)
    $$bindings.getOptionLabel(getOptionLabel);
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  if ($$props.filterText === void 0 && $$bindings.filterText && filterText !== void 0)
    $$bindings.filterText(filterText);
  $$result.css.add(css$k);
  {
    {
      const classes = [];
      if (isActive) {
        classes.push("active");
      }
      if (isFirst) {
        classes.push("first");
      }
      if (isHover) {
        classes.push("hover");
      }
      if (item.isGroupHeader) {
        classes.push("groupHeader");
      }
      if (item.isGroupItem) {
        classes.push("groupItem");
      }
      itemClasses = classes.join(" ");
    }
  }
  return `<div class="${"item " + escape2(itemClasses) + " svelte-1bv8nba"}">${getOptionLabel(item, filterText)}</div>`;
});
var css$j = {
  code: "svelte-virtual-list-viewport.svelte-1kdxoed{-webkit-overflow-scrolling:touch;display:block;overflow-y:auto;position:relative}svelte-virtual-list-contents.svelte-1kdxoed,svelte-virtual-list-row.svelte-1kdxoed{display:block}svelte-virtual-list-row.svelte-1kdxoed{overflow:hidden}",
  map: `{"version":3,"file":"VirtualList.svelte","sources":["VirtualList.svelte"],"sourcesContent":["<script>\\n\\timport { onMount, tick } from 'svelte';\\n\\n\\t// props\\n\\texport let items = undefined;\\n\\texport let height = '100%';\\n\\texport let itemHeight = 40;\\n\\texport let hoverItemIndex = 0;\\n\\n\\t// read-only, but visible to consumers via bind:start\\n\\texport let start = 0;\\n\\texport let end = 0;\\n\\n\\t// local state\\n\\tlet height_map = [];\\n\\tlet rows;\\n\\tlet viewport;\\n\\tlet contents;\\n\\tlet viewport_height = 0;\\n\\tlet visible;\\n\\tlet mounted;\\n\\n\\tlet top = 0;\\n\\tlet bottom = 0;\\n\\tlet average_height;\\n\\n\\t$: visible = items.slice(start, end).map((data, i) => {\\n\\t\\treturn { index: i + start, data };\\n\\t});\\n\\n\\t// whenever \`items\` changes, invalidate the current heightmap\\n\\t$: if (mounted) refresh(items, viewport_height, itemHeight);\\n\\n\\tasync function refresh(items, viewport_height, itemHeight) {\\n\\t\\tconst { scrollTop } = viewport;\\n\\n\\t\\tawait tick(); // wait until the DOM is up to date\\n\\n\\t\\tlet content_height = top - scrollTop;\\n\\t\\tlet i = start;\\n\\n\\t\\twhile (content_height < viewport_height && i < items.length) {\\n\\t\\t\\tlet row = rows[i - start];\\n\\n\\t\\t\\tif (!row) {\\n\\t\\t\\t\\tend = i + 1;\\n\\t\\t\\t\\tawait tick(); // render the newly visible row\\n\\t\\t\\t\\trow = rows[i - start];\\n\\t\\t\\t}\\n\\n\\t\\t\\tconst row_height = height_map[i] = itemHeight || row.offsetHeight;\\n\\t\\t\\tcontent_height += row_height;\\n\\t\\t\\ti += 1;\\n\\t\\t}\\n\\n\\t\\tend = i;\\n\\n\\t\\tconst remaining = items.length - end;\\n\\t\\taverage_height = (top + content_height) / end;\\n\\n\\t\\tbottom = remaining * average_height;\\n\\t\\theight_map.length = items.length;\\n\\n\\t\\tviewport.scrollTop = 0;\\n\\t}\\n\\n\\tasync function handle_scroll() {\\n\\t\\tconst { scrollTop } = viewport;\\n\\n\\t\\tconst old_start = start;\\n\\n\\t\\tfor (let v = 0; v < rows.length; v += 1) {\\n\\t\\t\\theight_map[start + v] = itemHeight || rows[v].offsetHeight;\\n\\t\\t}\\n\\n\\t\\tlet i = 0;\\n\\t\\tlet y = 0;\\n\\n\\t\\twhile (i < items.length) {\\n\\t\\t\\tconst row_height = height_map[i] || average_height;\\n\\t\\t\\tif (y + row_height > scrollTop) {\\n\\t\\t\\t\\tstart = i;\\n\\t\\t\\t\\ttop = y;\\n\\n\\t\\t\\t\\tbreak;\\n\\t\\t\\t}\\n\\n\\t\\t\\ty += row_height;\\n\\t\\t\\ti += 1;\\n\\t\\t}\\n\\n\\t\\twhile (i < items.length) {\\n\\t\\t\\ty += height_map[i] || average_height;\\n\\t\\t\\ti += 1;\\n\\n\\t\\t\\tif (y > scrollTop + viewport_height) break;\\n\\t\\t}\\n\\n\\t\\tend = i;\\n\\n\\t\\tconst remaining = items.length - end;\\n\\t\\taverage_height = y / end;\\n\\n\\t\\twhile (i < items.length) height_map[i++] = average_height;\\n\\t\\tbottom = remaining * average_height;\\n\\n\\t\\t// prevent jumping if we scrolled up into unknown territory\\n\\t\\tif (start < old_start) {\\n\\t\\t\\tawait tick();\\n\\n\\t\\t\\tlet expected_height = 0;\\n\\t\\t\\tlet actual_height = 0;\\n\\n\\t\\t\\tfor (let i = start; i < old_start; i += 1) {\\n\\t\\t\\t\\tif (rows[i - start]) {\\n\\t\\t\\t\\t\\texpected_height += height_map[i];\\n\\t\\t\\t\\t\\tactual_height += itemHeight || rows[i - start].offsetHeight;\\n\\t\\t\\t\\t}\\n\\t\\t\\t}\\n\\n\\t\\t\\tconst d = actual_height - expected_height;\\n\\t\\t\\tviewport.scrollTo(0, scrollTop + d);\\n\\t\\t}\\n\\n\\t\\t// TODO if we overestimated the space these\\n\\t\\t// rows would occupy we may need to add some\\n\\t\\t// more. maybe we can just call handle_scroll again?\\n\\t}\\n\\n\\t// trigger initial refresh\\n\\tonMount(() => {\\n\\t\\trows = contents.getElementsByTagName('svelte-virtual-list-row');\\n\\t\\tmounted = true;\\n\\t});\\n<\/script>\\n\\n<style>svelte-virtual-list-viewport{-webkit-overflow-scrolling:touch;display:block;overflow-y:auto;position:relative}svelte-virtual-list-contents,svelte-virtual-list-row{display:block}svelte-virtual-list-row{overflow:hidden}</style>\\n\\n<svelte-virtual-list-viewport bind:this={viewport} bind:offsetHeight={viewport_height} on:scroll={handle_scroll}\\n\\tstyle=\\"height: {height};\\">\\n\\t<svelte-virtual-list-contents bind:this={contents} style=\\"padding-top: {top}px; padding-bottom: {bottom}px;\\">\\n\\t\\t{#each visible as row (row.index)}\\n\\t\\t\\t<svelte-virtual-list-row>\\n\\t\\t\\t\\t<slot item={row.data} i={row.index} {hoverItemIndex}>Missing template</slot>\\n\\t\\t\\t</svelte-virtual-list-row>\\n\\t\\t{/each}\\n\\t</svelte-virtual-list-contents>\\n</svelte-virtual-list-viewport>\\n"],"names":[],"mappings":"AAwIO,2CAA4B,CAAC,2BAA2B,KAAK,CAAC,QAAQ,KAAK,CAAC,WAAW,IAAI,CAAC,SAAS,QAAQ,CAAC,2CAA4B,CAAC,sCAAuB,CAAC,QAAQ,KAAK,CAAC,sCAAuB,CAAC,SAAS,MAAM,CAAC"}`
};
var VirtualList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { items = void 0 } = $$props;
  let { height: height2 = "100%" } = $$props;
  let { itemHeight = 40 } = $$props;
  let { hoverItemIndex = 0 } = $$props;
  let { start = 0 } = $$props;
  let { end = 0 } = $$props;
  let height_map = [];
  let rows;
  let viewport;
  let contents;
  let viewport_height = 0;
  let visible;
  let mounted;
  let top = 0;
  let bottom = 0;
  let average_height;
  async function refresh(items2, viewport_height2, itemHeight2) {
    const { scrollTop } = viewport;
    await tick();
    let content_height = top - scrollTop;
    let i = start;
    while (content_height < viewport_height2 && i < items2.length) {
      let row = rows[i - start];
      if (!row) {
        end = i + 1;
        await tick();
        row = rows[i - start];
      }
      const row_height = height_map[i] = itemHeight2 || row.offsetHeight;
      content_height += row_height;
      i += 1;
    }
    end = i;
    const remaining = items2.length - end;
    average_height = (top + content_height) / end;
    bottom = remaining * average_height;
    height_map.length = items2.length;
    viewport.scrollTop = 0;
  }
  onMount(() => {
    rows = contents.getElementsByTagName("svelte-virtual-list-row");
    mounted = true;
  });
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.height === void 0 && $$bindings.height && height2 !== void 0)
    $$bindings.height(height2);
  if ($$props.itemHeight === void 0 && $$bindings.itemHeight && itemHeight !== void 0)
    $$bindings.itemHeight(itemHeight);
  if ($$props.hoverItemIndex === void 0 && $$bindings.hoverItemIndex && hoverItemIndex !== void 0)
    $$bindings.hoverItemIndex(hoverItemIndex);
  if ($$props.start === void 0 && $$bindings.start && start !== void 0)
    $$bindings.start(start);
  if ($$props.end === void 0 && $$bindings.end && end !== void 0)
    $$bindings.end(end);
  $$result.css.add(css$j);
  visible = items.slice(start, end).map((data, i) => {
    return { index: i + start, data };
  });
  {
    if (mounted)
      refresh(items, viewport_height, itemHeight);
  }
  return `<svelte-virtual-list-viewport style="${"height: " + escape2(height2) + ";"}" class="${"svelte-1kdxoed"}"${add_attribute("this", viewport, 1)}><svelte-virtual-list-contents style="${"padding-top: " + escape2(top) + "px; padding-bottom: " + escape2(bottom) + "px;"}" class="${"svelte-1kdxoed"}"${add_attribute("this", contents, 1)}>${each(visible, (row) => `<svelte-virtual-list-row class="${"svelte-1kdxoed"}">${slots.default ? slots.default({
    item: row.data,
    i: row.index,
    hoverItemIndex
  }) : `Missing template`}
			</svelte-virtual-list-row>`)}</svelte-virtual-list-contents></svelte-virtual-list-viewport>`;
});
var css$i = {
  code: ".listContainer.svelte-eclidh{background:var(--listBackground,#fff);border-radius:var(--listBorderRadius,4px);box-shadow:var(--listShadow,0 2px 3px 0 rgba(44,62,80,.24));max-height:var(--listMaxHeight,250px);overflow-y:auto}.virtualList.svelte-eclidh{height:var(--virtualListHeight,200px)}.listGroupTitle.svelte-eclidh{color:var(--groupTitleColor,#8f8f8f);cursor:default;font-size:var(--groupTitleFontSize,12px);font-weight:var(--groupTitleFontWeight,600);height:var(--height,42px);line-height:var(--height,42px);overflow-x:hidden;padding:var(--groupTitlePadding,0 20px);text-overflow:ellipsis;text-transform:var(--groupTitleTextTransform,uppercase);white-space:nowrap}.empty.svelte-eclidh{color:var(--listEmptyColor,#78848f);padding:var(--listEmptyPadding,20px 0);text-align:var(--listEmptyTextAlign,center)}",
  map: `{"version":3,"file":"List.svelte","sources":["List.svelte"],"sourcesContent":["<script>\\n  import { beforeUpdate, createEventDispatcher, onDestroy, onMount, tick } from 'svelte';\\n\\n  const dispatch = createEventDispatcher();\\n\\n  export let container = undefined;\\n\\n  import ItemComponent from './Item.svelte';\\n  import VirtualList from './VirtualList.svelte';\\n\\n  export let Item = ItemComponent;\\n  export let isVirtualList = false;\\n  export let items = [];\\n  export let getOptionLabel = (option, filterText) => {\\n    if (option) return option.isCreator ? \`Create \\\\\\"\${filterText}\\\\\\"\` : option.label;\\n  };\\n  export let getGroupHeaderLabel = (option) => { return option.label };\\n  export let itemHeight = 40;\\n  export let hoverItemIndex = 0;\\n  export let selectedValue = undefined;\\n  export let optionIdentifier = 'value';\\n  export let hideEmptyState = false;\\n  export let noOptionsMessage = 'No options';\\n  export let isMulti = false;\\n  export let activeItemIndex = 0;\\n  export let filterText = '';\\n\\n  let isScrollingTimer = 0;\\n  let isScrolling = false;\\n  let prev_items;\\n  let prev_activeItemIndex;\\n  let prev_selectedValue;\\n\\n  onMount(() => {\\n    if (items.length > 0 && !isMulti && selectedValue) {\\n      const _hoverItemIndex = items.findIndex((item) => item[optionIdentifier] === selectedValue[optionIdentifier]);\\n\\n      if (_hoverItemIndex) {\\n        hoverItemIndex = _hoverItemIndex;\\n      }\\n    }\\n\\n    scrollToActiveItem('active');\\n\\n\\n    container.addEventListener('scroll', () => {\\n      clearTimeout(isScrollingTimer);\\n\\n      isScrollingTimer = setTimeout(() => {\\n        isScrolling = false;\\n      }, 100);\\n    }, false);\\n  });\\n\\n  onDestroy(() => {\\n    // clearTimeout(isScrollingTimer);\\n  });\\n\\n  beforeUpdate(() => {\\n\\n    if (items !== prev_items && items.length > 0) {\\n      hoverItemIndex = 0;\\n    }\\n\\n\\n    // if (prev_activeItemIndex && activeItemIndex > -1) {\\n    //   hoverItemIndex = activeItemIndex;\\n\\n    //   scrollToActiveItem('active');\\n    // }\\n    // if (prev_selectedValue && selectedValue) {\\n    //   scrollToActiveItem('active');\\n\\n    //   if (items && !isMulti) {\\n    //     const hoverItemIndex = items.findIndex((item) => item[optionIdentifier] === selectedValue[optionIdentifier]);\\n\\n    //     if (hoverItemIndex) {\\n    //       hoverItemIndex = hoverItemIndex;\\n    //     }\\n    //   }\\n    // }\\n\\n    prev_items = items;\\n    prev_activeItemIndex = activeItemIndex;\\n    prev_selectedValue = selectedValue;\\n  });\\n\\n  function itemClasses(hoverItemIndex, item, itemIndex, items, selectedValue, optionIdentifier, isMulti) {\\n    return \`\${selectedValue && !isMulti && (selectedValue[optionIdentifier] === item[optionIdentifier]) ? 'active ' : ''}\${hoverItemIndex === itemIndex || items.length === 1 ? 'hover' : ''}\`;\\n  }\\n\\n  function handleSelect(item) {\\n    if (item.isCreator) return;\\n    dispatch('itemSelected', item);\\n  }\\n\\n  function handleHover(i) {\\n    if (isScrolling) return;\\n    hoverItemIndex = i;\\n  }\\n\\n  function handleClick(args) {\\n    const { item, i, event } = args;\\n    event.stopPropagation();\\n\\n    if (selectedValue && !isMulti && selectedValue[optionIdentifier] === item[optionIdentifier]) return closeList();\\n\\n    if (item.isCreator) {\\n      dispatch('itemCreated', filterText);\\n    } else {\\n      activeItemIndex = i;\\n      hoverItemIndex = i;\\n      handleSelect(item);\\n    }\\n  }\\n\\n  function closeList() {\\n    dispatch('closeList');\\n  }\\n\\n  async function updateHoverItem(increment) {\\n    if (isVirtualList) return;\\n\\n    let isNonSelectableItem = true;\\n\\n    while (isNonSelectableItem) {\\n      if (increment > 0 && hoverItemIndex === (items.length - 1)) {\\n        hoverItemIndex = 0;\\n      }\\n      else if (increment < 0 && hoverItemIndex === 0) {\\n        hoverItemIndex = items.length - 1;\\n      }\\n      else {\\n        hoverItemIndex = hoverItemIndex + increment;\\n      }\\n\\n      isNonSelectableItem = items[hoverItemIndex].isGroupHeader && !items[hoverItemIndex].isSelectable;\\n    }\\n\\n    await tick();\\n\\n    scrollToActiveItem('hover');\\n  }\\n\\n  function handleKeyDown(e) {\\n    switch (e.key) {\\n      case 'ArrowDown':\\n        e.preventDefault();\\n        items.length && updateHoverItem(1);\\n        break;\\n      case 'ArrowUp':\\n        e.preventDefault();\\n        items.length && updateHoverItem(-1);\\n        break;\\n      case 'Enter':\\n        e.preventDefault();\\n        if (items.length === 0) break;\\n        const hoverItem = items[hoverItemIndex];\\n        if (selectedValue && !isMulti && selectedValue[optionIdentifier] === hoverItem[optionIdentifier]) {\\n          closeList();\\n          break;\\n        }\\n\\n        if (hoverItem.isCreator) {\\n          dispatch('itemCreated', filterText);\\n        } else {\\n          activeItemIndex = hoverItemIndex;\\n          handleSelect(items[hoverItemIndex]);\\n        }\\n        break;\\n      case 'Tab':\\n        e.preventDefault();\\n        if (items.length === 0) break;\\n        if (selectedValue && selectedValue[optionIdentifier] === items[hoverItemIndex][optionIdentifier]) return closeList();\\n        activeItemIndex = hoverItemIndex;\\n        handleSelect(items[hoverItemIndex]);\\n        break;\\n    }\\n  }\\n\\n  function scrollToActiveItem(className) {\\n    if (isVirtualList || !container) return;\\n\\n    let offsetBounding;\\n    const focusedElemBounding = container.querySelector(\`.listItem .\${className}\`);\\n\\n    if (focusedElemBounding) {\\n      offsetBounding = container.getBoundingClientRect().bottom - focusedElemBounding.getBoundingClientRect().bottom;\\n    }\\n\\n    container.scrollTop -= offsetBounding;\\n  }\\n\\n  function isItemActive(item, selectedValue, optionIdentifier) {\\n    return selectedValue && (selectedValue[optionIdentifier] === item[optionIdentifier]);\\n  };\\n\\n  function isItemFirst(itemIndex) {\\n    return itemIndex === 0;\\n  };\\n\\n  function isItemHover(hoverItemIndex, item, itemIndex, items) {\\n    return hoverItemIndex === itemIndex || items.length === 1;\\n  }\\n\\n<\/script>\\n\\n<svelte:window on:keydown=\\"{handleKeyDown}\\" />\\n\\n{#if isVirtualList}\\n<div class=\\"listContainer virtualList\\" bind:this={container}>\\n\\n  <VirtualList {items} {itemHeight} let:item let:i>\\n\\n    <div on:mouseover=\\"{() => handleHover(i)}\\" on:click=\\"{event => handleClick({item, i, event})}\\"\\n        class=\\"listItem\\">\\n          <svelte:component\\n            this=\\"{Item}\\"\\n            {item}\\n            {filterText}\\n            {getOptionLabel}\\n            isFirst=\\"{isItemFirst(i)}\\"\\n            isActive=\\"{isItemActive(item, selectedValue, optionIdentifier)}\\"\\n            isHover=\\"{isItemHover(hoverItemIndex, item, i, items)}\\"\\n          />\\n    </div>\\n\\n</VirtualList>\\n</div>\\n{/if}\\n\\n{#if !isVirtualList}\\n<div class=\\"listContainer\\" bind:this={container}>\\n  {#each items as item, i}\\n    {#if item.isGroupHeader && !item.isSelectable}\\n      <div class=\\"listGroupTitle\\">{getGroupHeaderLabel(item)}</div>\\n    { :else }\\n    <div\\n      on:mouseover=\\"{() => handleHover(i)}\\"\\n      on:click=\\"{event => handleClick({item, i, event})}\\"\\n      class=\\"listItem\\"\\n    >\\n      <svelte:component\\n        this=\\"{Item}\\"\\n        {item}\\n        {filterText}\\n        {getOptionLabel}\\n        isFirst=\\"{isItemFirst(i)}\\"\\n        isActive=\\"{isItemActive(item, selectedValue, optionIdentifier)}\\"\\n        isHover=\\"{isItemHover(hoverItemIndex, item, i, items)}\\"\\n      />\\n    </div>\\n    {/if}\\n  {:else}\\n    {#if !hideEmptyState}\\n      <div class=\\"empty\\">{noOptionsMessage}</div>\\n    {/if}\\n  {/each}\\n</div>\\n{/if}\\n\\n<style>.listContainer{background:var(--listBackground,#fff);border-radius:var(--listBorderRadius,4px);box-shadow:var(--listShadow,0 2px 3px 0 rgba(44,62,80,.24));max-height:var(--listMaxHeight,250px);overflow-y:auto}.virtualList{height:var(--virtualListHeight,200px)}.listGroupTitle{color:var(--groupTitleColor,#8f8f8f);cursor:default;font-size:var(--groupTitleFontSize,12px);font-weight:var(--groupTitleFontWeight,600);height:var(--height,42px);line-height:var(--height,42px);overflow-x:hidden;padding:var(--groupTitlePadding,0 20px);text-overflow:ellipsis;text-transform:var(--groupTitleTextTransform,uppercase);white-space:nowrap}.empty{color:var(--listEmptyColor,#78848f);padding:var(--listEmptyPadding,20px 0);text-align:var(--listEmptyTextAlign,center)}</style>\\n"],"names":[],"mappings":"AAqQO,4BAAc,CAAC,WAAW,IAAI,gBAAgB,CAAC,IAAI,CAAC,CAAC,cAAc,IAAI,kBAAkB,CAAC,GAAG,CAAC,CAAC,WAAW,IAAI,YAAY,CAAC,8BAA8B,CAAC,CAAC,WAAW,IAAI,eAAe,CAAC,KAAK,CAAC,CAAC,WAAW,IAAI,CAAC,0BAAY,CAAC,OAAO,IAAI,mBAAmB,CAAC,KAAK,CAAC,CAAC,6BAAe,CAAC,MAAM,IAAI,iBAAiB,CAAC,OAAO,CAAC,CAAC,OAAO,OAAO,CAAC,UAAU,IAAI,oBAAoB,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,sBAAsB,CAAC,GAAG,CAAC,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,mBAAmB,CAAC,MAAM,CAAC,CAAC,cAAc,QAAQ,CAAC,eAAe,IAAI,yBAAyB,CAAC,SAAS,CAAC,CAAC,YAAY,MAAM,CAAC,oBAAM,CAAC,MAAM,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,kBAAkB,CAAC,MAAM,CAAC,CAAC,WAAW,IAAI,oBAAoB,CAAC,MAAM,CAAC,CAAC"}`
};
function isItemActive(item, selectedValue, optionIdentifier) {
  return selectedValue && selectedValue[optionIdentifier] === item[optionIdentifier];
}
function isItemFirst(itemIndex) {
  return itemIndex === 0;
}
function isItemHover(hoverItemIndex, item, itemIndex, items) {
  return hoverItemIndex === itemIndex || items.length === 1;
}
var List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { container = void 0 } = $$props;
  let { Item: Item$1 = Item } = $$props;
  let { isVirtualList = false } = $$props;
  let { items = [] } = $$props;
  let { getOptionLabel = (option, filterText2) => {
    if (option)
      return option.isCreator ? `Create "${filterText2}"` : option.label;
  } } = $$props;
  let { getGroupHeaderLabel = (option) => {
    return option.label;
  } } = $$props;
  let { itemHeight = 40 } = $$props;
  let { hoverItemIndex = 0 } = $$props;
  let { selectedValue = void 0 } = $$props;
  let { optionIdentifier = "value" } = $$props;
  let { hideEmptyState = false } = $$props;
  let { noOptionsMessage = "No options" } = $$props;
  let { isMulti = false } = $$props;
  let { activeItemIndex = 0 } = $$props;
  let { filterText = "" } = $$props;
  let isScrollingTimer = 0;
  let prev_items;
  onMount(() => {
    if (items.length > 0 && !isMulti && selectedValue) {
      const _hoverItemIndex = items.findIndex((item) => item[optionIdentifier] === selectedValue[optionIdentifier]);
      if (_hoverItemIndex) {
        hoverItemIndex = _hoverItemIndex;
      }
    }
    scrollToActiveItem("active");
    container.addEventListener("scroll", () => {
      clearTimeout(isScrollingTimer);
      isScrollingTimer = setTimeout(() => {
      }, 100);
    }, false);
  });
  onDestroy(() => {
  });
  beforeUpdate(() => {
    if (items !== prev_items && items.length > 0) {
      hoverItemIndex = 0;
    }
    prev_items = items;
  });
  function scrollToActiveItem(className) {
    if (isVirtualList || !container)
      return;
    let offsetBounding;
    const focusedElemBounding = container.querySelector(`.listItem .${className}`);
    if (focusedElemBounding) {
      offsetBounding = container.getBoundingClientRect().bottom - focusedElemBounding.getBoundingClientRect().bottom;
    }
    container.scrollTop -= offsetBounding;
  }
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.Item === void 0 && $$bindings.Item && Item$1 !== void 0)
    $$bindings.Item(Item$1);
  if ($$props.isVirtualList === void 0 && $$bindings.isVirtualList && isVirtualList !== void 0)
    $$bindings.isVirtualList(isVirtualList);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.getOptionLabel === void 0 && $$bindings.getOptionLabel && getOptionLabel !== void 0)
    $$bindings.getOptionLabel(getOptionLabel);
  if ($$props.getGroupHeaderLabel === void 0 && $$bindings.getGroupHeaderLabel && getGroupHeaderLabel !== void 0)
    $$bindings.getGroupHeaderLabel(getGroupHeaderLabel);
  if ($$props.itemHeight === void 0 && $$bindings.itemHeight && itemHeight !== void 0)
    $$bindings.itemHeight(itemHeight);
  if ($$props.hoverItemIndex === void 0 && $$bindings.hoverItemIndex && hoverItemIndex !== void 0)
    $$bindings.hoverItemIndex(hoverItemIndex);
  if ($$props.selectedValue === void 0 && $$bindings.selectedValue && selectedValue !== void 0)
    $$bindings.selectedValue(selectedValue);
  if ($$props.optionIdentifier === void 0 && $$bindings.optionIdentifier && optionIdentifier !== void 0)
    $$bindings.optionIdentifier(optionIdentifier);
  if ($$props.hideEmptyState === void 0 && $$bindings.hideEmptyState && hideEmptyState !== void 0)
    $$bindings.hideEmptyState(hideEmptyState);
  if ($$props.noOptionsMessage === void 0 && $$bindings.noOptionsMessage && noOptionsMessage !== void 0)
    $$bindings.noOptionsMessage(noOptionsMessage);
  if ($$props.isMulti === void 0 && $$bindings.isMulti && isMulti !== void 0)
    $$bindings.isMulti(isMulti);
  if ($$props.activeItemIndex === void 0 && $$bindings.activeItemIndex && activeItemIndex !== void 0)
    $$bindings.activeItemIndex(activeItemIndex);
  if ($$props.filterText === void 0 && $$bindings.filterText && filterText !== void 0)
    $$bindings.filterText(filterText);
  $$result.css.add(css$i);
  return `

${isVirtualList ? `<div class="${"listContainer virtualList svelte-eclidh"}"${add_attribute("this", container, 1)}>${validate_component(VirtualList, "VirtualList").$$render($$result, { items, itemHeight }, {}, {
    default: ({ item, i }) => `<div class="${"listItem"}">${validate_component(Item$1 || missing_component, "svelte:component").$$render($$result, {
      item,
      filterText,
      getOptionLabel,
      isFirst: isItemFirst(i),
      isActive: isItemActive(item, selectedValue, optionIdentifier),
      isHover: isItemHover(hoverItemIndex, item, i, items)
    }, {}, {})}</div>`
  })}</div>` : ``}

${!isVirtualList ? `<div class="${"listContainer svelte-eclidh"}"${add_attribute("this", container, 1)}>${items.length ? each(items, (item, i) => `${item.isGroupHeader && !item.isSelectable ? `<div class="${"listGroupTitle svelte-eclidh"}">${escape2(getGroupHeaderLabel(item))}</div>` : `<div class="${"listItem"}">${validate_component(Item$1 || missing_component, "svelte:component").$$render($$result, {
    item,
    filterText,
    getOptionLabel,
    isFirst: isItemFirst(i),
    isActive: isItemActive(item, selectedValue, optionIdentifier),
    isHover: isItemHover(hoverItemIndex, item, i, items)
  }, {}, {})}
    </div>`}`) : `${!hideEmptyState ? `<div class="${"empty svelte-eclidh"}">${escape2(noOptionsMessage)}</div>` : ``}`}</div>` : ``}`;
});
var css$h = {
  code: ".selection.svelte-1tpioco{overflow-x:hidden;text-overflow:ellipsis;white-space:nowrap}",
  map: '{"version":3,"file":"Selection.svelte","sources":["Selection.svelte"],"sourcesContent":["<script>\\n  export let getSelectionLabel = undefined;\\n  export let item = undefined;\\n<\/script>\\n\\n<style>.selection{overflow-x:hidden;text-overflow:ellipsis;white-space:nowrap}</style>\\n\\n<div class=\\"selection\\">\\n  {@html getSelectionLabel(item)}\\n</div>\\n"],"names":[],"mappings":"AAKO,yBAAU,CAAC,WAAW,MAAM,CAAC,cAAc,QAAQ,CAAC,YAAY,MAAM,CAAC"}'
};
var Selection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { getSelectionLabel = void 0 } = $$props;
  let { item = void 0 } = $$props;
  if ($$props.getSelectionLabel === void 0 && $$bindings.getSelectionLabel && getSelectionLabel !== void 0)
    $$bindings.getSelectionLabel(getSelectionLabel);
  if ($$props.item === void 0 && $$bindings.item && item !== void 0)
    $$bindings.item(item);
  $$result.css.add(css$h);
  return `<div class="${"selection svelte-1tpioco"}">${getSelectionLabel(item)}</div>`;
});
var css$g = {
  code: ".multiSelectItem.svelte-1oaubvy.svelte-1oaubvy{background:var(--multiItemBG,#ebedef);border-radius:var(--multiItemBorderRadius,16px);cursor:default;display:flex;height:var(--multiItemHeight,32px);line-height:var(--multiItemHeight,32px);margin:var(--multiItemMargin,5px 5px 0 0);max-width:100%;padding:var(--multiItemPadding,0 10px 0 15px)}.multiSelectItem_label.svelte-1oaubvy.svelte-1oaubvy{margin:var(--multiLabelMargin,0 5px 0 0);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.multiSelectItem.active.svelte-1oaubvy.svelte-1oaubvy,.multiSelectItem.svelte-1oaubvy.svelte-1oaubvy:hover{background-color:var(--multiItemActiveBG,#006fff);color:var(--multiItemActiveColor,#fff)}.multiSelectItem.disabled.svelte-1oaubvy.svelte-1oaubvy:hover{background:var(--multiItemDisabledHoverBg,#ebedef);color:var(--multiItemDisabledHoverColor,#c1c6cc)}.multiSelectItem_clear.svelte-1oaubvy.svelte-1oaubvy{background:var(--multiClearBG,#52616f);border-radius:var(--multiClearRadius,50%);height:var(--multiClearHeight,16px);max-width:var(--multiClearWidth,16px);min-width:var(--multiClearWidth,16px);padding:var(--multiClearPadding,1px);position:relative;text-align:var(--multiClearTextAlign,center);top:var(--multiClearTop,8px)}.active.svelte-1oaubvy .multiSelectItem_clear.svelte-1oaubvy,.multiSelectItem_clear.svelte-1oaubvy.svelte-1oaubvy:hover{background:var(--multiClearHoverBG,#fff)}.active.svelte-1oaubvy .multiSelectItem_clear svg.svelte-1oaubvy,.multiSelectItem_clear.svelte-1oaubvy:hover svg.svelte-1oaubvy{fill:var(--multiClearHoverFill,#006fff)}.multiSelectItem_clear.svelte-1oaubvy svg.svelte-1oaubvy{fill:var(--multiClearFill,#ebedef);vertical-align:top}",
  map: `{"version":3,"file":"MultiSelection.svelte","sources":["MultiSelection.svelte"],"sourcesContent":["<script>\\n  import { createEventDispatcher } from 'svelte';\\n\\n  const dispatch = createEventDispatcher();\\n\\n  export let selectedValue = [];\\n  export let activeSelectedValue = undefined;\\n  export let isDisabled = false;\\n  export let multiFullItemClearable = false;\\n  export let getSelectionLabel = undefined;\\n\\n  function handleClear(i, event) {\\n    event.stopPropagation();\\n    dispatch('multiItemClear', {i});\\n  }\\n<\/script>\\n\\n{#each selectedValue as value, i}\\n<div class=\\"multiSelectItem {activeSelectedValue === i ? 'active' : ''} {isDisabled ? 'disabled' : ''}\\" on:click={event => multiFullItemClearable ? handleClear(i, event) : {}}>\\n  <div class=\\"multiSelectItem_label\\">\\n    {@html getSelectionLabel(value)}\\n  </div>\\n  {#if !isDisabled && !multiFullItemClearable}\\n  <div class=\\"multiSelectItem_clear\\" on:click=\\"{event => handleClear(i, event)}\\">\\n    <svg width=\\"100%\\" height=\\"100%\\" viewBox=\\"-2 -2 50 50\\" focusable=\\"false\\" role=\\"presentation\\">\\n      <path\\n        d=\\"M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z\\"></path>\\n    </svg>\\n  </div>\\n  {/if}\\n</div>\\n{/each}\\n\\n\\n\\n<style>.multiSelectItem{background:var(--multiItemBG,#ebedef);border-radius:var(--multiItemBorderRadius,16px);cursor:default;display:flex;height:var(--multiItemHeight,32px);line-height:var(--multiItemHeight,32px);margin:var(--multiItemMargin,5px 5px 0 0);max-width:100%;padding:var(--multiItemPadding,0 10px 0 15px)}.multiSelectItem_label{margin:var(--multiLabelMargin,0 5px 0 0);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.multiSelectItem.active,.multiSelectItem:hover{background-color:var(--multiItemActiveBG,#006fff);color:var(--multiItemActiveColor,#fff)}.multiSelectItem.disabled:hover{background:var(--multiItemDisabledHoverBg,#ebedef);color:var(--multiItemDisabledHoverColor,#c1c6cc)}.multiSelectItem_clear{background:var(--multiClearBG,#52616f);border-radius:var(--multiClearRadius,50%);height:var(--multiClearHeight,16px);max-width:var(--multiClearWidth,16px);min-width:var(--multiClearWidth,16px);padding:var(--multiClearPadding,1px);position:relative;text-align:var(--multiClearTextAlign,center);top:var(--multiClearTop,8px)}.active .multiSelectItem_clear,.multiSelectItem_clear:hover{background:var(--multiClearHoverBG,#fff)}.active .multiSelectItem_clear svg,.multiSelectItem_clear:hover svg{fill:var(--multiClearHoverFill,#006fff)}.multiSelectItem_clear svg{fill:var(--multiClearFill,#ebedef);vertical-align:top}</style>\\n"],"names":[],"mappings":"AAmCO,8CAAgB,CAAC,WAAW,IAAI,aAAa,CAAC,OAAO,CAAC,CAAC,cAAc,IAAI,uBAAuB,CAAC,IAAI,CAAC,CAAC,OAAO,OAAO,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,iBAAiB,CAAC,WAAW,CAAC,CAAC,UAAU,IAAI,CAAC,QAAQ,IAAI,kBAAkB,CAAC,aAAa,CAAC,CAAC,oDAAsB,CAAC,OAAO,IAAI,kBAAkB,CAAC,SAAS,CAAC,CAAC,SAAS,MAAM,CAAC,cAAc,QAAQ,CAAC,YAAY,MAAM,CAAC,gBAAgB,qCAAO,CAAC,8CAAgB,MAAM,CAAC,iBAAiB,IAAI,mBAAmB,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,sBAAsB,CAAC,IAAI,CAAC,CAAC,gBAAgB,uCAAS,MAAM,CAAC,WAAW,IAAI,0BAA0B,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,6BAA6B,CAAC,OAAO,CAAC,CAAC,oDAAsB,CAAC,WAAW,IAAI,cAAc,CAAC,OAAO,CAAC,CAAC,cAAc,IAAI,kBAAkB,CAAC,GAAG,CAAC,CAAC,OAAO,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,UAAU,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,UAAU,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,QAAQ,IAAI,mBAAmB,CAAC,GAAG,CAAC,CAAC,SAAS,QAAQ,CAAC,WAAW,IAAI,qBAAqB,CAAC,MAAM,CAAC,CAAC,IAAI,IAAI,eAAe,CAAC,GAAG,CAAC,CAAC,sBAAO,CAAC,qCAAsB,CAAC,oDAAsB,MAAM,CAAC,WAAW,IAAI,mBAAmB,CAAC,IAAI,CAAC,CAAC,sBAAO,CAAC,sBAAsB,CAAC,kBAAG,CAAC,qCAAsB,MAAM,CAAC,kBAAG,CAAC,KAAK,IAAI,qBAAqB,CAAC,OAAO,CAAC,CAAC,qCAAsB,CAAC,kBAAG,CAAC,KAAK,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,eAAe,GAAG,CAAC"}`
};
var MultiSelection = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { selectedValue = [] } = $$props;
  let { activeSelectedValue = void 0 } = $$props;
  let { isDisabled = false } = $$props;
  let { multiFullItemClearable = false } = $$props;
  let { getSelectionLabel = void 0 } = $$props;
  if ($$props.selectedValue === void 0 && $$bindings.selectedValue && selectedValue !== void 0)
    $$bindings.selectedValue(selectedValue);
  if ($$props.activeSelectedValue === void 0 && $$bindings.activeSelectedValue && activeSelectedValue !== void 0)
    $$bindings.activeSelectedValue(activeSelectedValue);
  if ($$props.isDisabled === void 0 && $$bindings.isDisabled && isDisabled !== void 0)
    $$bindings.isDisabled(isDisabled);
  if ($$props.multiFullItemClearable === void 0 && $$bindings.multiFullItemClearable && multiFullItemClearable !== void 0)
    $$bindings.multiFullItemClearable(multiFullItemClearable);
  if ($$props.getSelectionLabel === void 0 && $$bindings.getSelectionLabel && getSelectionLabel !== void 0)
    $$bindings.getSelectionLabel(getSelectionLabel);
  $$result.css.add(css$g);
  return `${each(selectedValue, (value, i) => `<div class="${"multiSelectItem " + escape2(activeSelectedValue === i ? "active" : "") + " " + escape2(isDisabled ? "disabled" : "") + " svelte-1oaubvy"}"><div class="${"multiSelectItem_label svelte-1oaubvy"}">${getSelectionLabel(value)}</div>
  ${!isDisabled && !multiFullItemClearable ? `<div class="${"multiSelectItem_clear svelte-1oaubvy"}"><svg width="${"100%"}" height="${"100%"}" viewBox="${"-2 -2 50 50"}" focusable="${"false"}" role="${"presentation"}" class="${"svelte-1oaubvy"}"><path d="${"M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"}"></path></svg>
  </div>` : ``}
</div>`)}`;
});
function isOutOfViewport(elem) {
  const bounding = elem.getBoundingClientRect();
  const out = {};
  out.top = bounding.top < 0;
  out.left = bounding.left < 0;
  out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
  out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
  out.any = out.top || out.left || out.bottom || out.right;
  return out;
}
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    let context = this;
    let args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate)
        func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow)
      func.apply(context, args);
  };
}
var ClearIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg width="${"100%"}" height="${"100%"}" viewBox="${"-2 -2 50 50"}" focusable="${"false"}" role="${"presentation"}"><path fill="${"currentColor"}" d="${"M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124\n    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"}"></path></svg>`;
});
var { Object: Object_1 } = globals;
var css$f = {
  code: ".selectContainer.svelte-djkls6.svelte-djkls6{--padding:0 16px;align-items:center;background:var(--background,#fff);border:var(--border,1px solid #d8dbdf);border-radius:var(--borderRadius,3px);display:flex;height:var(--height,42px);padding:var(--padding);position:relative}.selectContainer.svelte-djkls6 input.svelte-djkls6{background:transparent;border:none;color:var(--inputColor,#3f4f5f);cursor:default;font-size:var(--inputFontSize,14px);height:var(--height,42px);left:var(--inputLeft,0);letter-spacing:var(--inputLetterSpacing,-.08px);line-height:var(--height,42px);padding:var(--inputPadding,var(--padding));position:absolute;width:100%}.selectContainer.svelte-djkls6 input.svelte-djkls6::-moz-placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer.svelte-djkls6 input.svelte-djkls6:-ms-input-placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer.svelte-djkls6 input.svelte-djkls6::placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer.svelte-djkls6 input.svelte-djkls6:focus{outline:none}.selectContainer.svelte-djkls6.svelte-djkls6:hover{border-color:var(--borderHoverColor,#b2b8bf)}.selectContainer.focused.svelte-djkls6.svelte-djkls6{border-color:var(--borderFocusColor,#006fe8)}.selectContainer.disabled.svelte-djkls6.svelte-djkls6{background:var(--disabledBackground,#ebedef);border-color:var(--disabledBorderColor,#ebedef);color:var(--disabledColor,#c1c6cc)}.selectContainer.disabled.svelte-djkls6 input.svelte-djkls6::-moz-placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectContainer.disabled.svelte-djkls6 input.svelte-djkls6:-ms-input-placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectContainer.disabled.svelte-djkls6 input.svelte-djkls6::placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectedItem.svelte-djkls6.svelte-djkls6{height:var(--height,42px);line-height:var(--height,42px);overflow-x:hidden;padding:var(--selectedItemPadding,0 20px 0 0)}.selectedItem.svelte-djkls6.svelte-djkls6:focus{outline:none}.clearSelect.svelte-djkls6.svelte-djkls6{bottom:var(--clearSelectBottom,11px);color:var(--clearSelectColor,#c5cacf);flex:none!important;position:absolute;right:var(--clearSelectRight,10px);top:var(--clearSelectTop,11px);width:var(--clearSelectWidth,20px)}.clearSelect.svelte-djkls6.svelte-djkls6:hover{color:var(--clearSelectHoverColor,#2c3e50)}.selectContainer.focused.svelte-djkls6 .clearSelect.svelte-djkls6{color:var(--clearSelectFocusColor,#3f4f5f)}.indicator.svelte-djkls6.svelte-djkls6{color:var(--indicatorColor,#c5cacf);height:var(--indicatorHeight,20px);position:absolute;right:var(--indicatorRight,10px);top:var(--indicatorTop,11px);width:var(--indicatorWidth,20px)}.indicator.svelte-djkls6 svg.svelte-djkls6{fill:var(--indicatorFill,currentcolor);stroke:var(--indicatorStroke,currentcolor);stroke-width:0;display:inline-block;line-height:1}.spinner.svelte-djkls6.svelte-djkls6{-webkit-animation:svelte-djkls6-rotate .75s linear infinite;animation:svelte-djkls6-rotate .75s linear infinite;color:var(--spinnerColor,#51ce6c);height:var(--spinnerHeight,20px);position:absolute;right:var(--spinnerRight,10px);top:var(--spinnerLeft,11px);width:var(--spinnerWidth,20px)}.spinner_icon.svelte-djkls6.svelte-djkls6{bottom:0;display:block;height:100%;left:0;margin:auto;position:absolute;right:0;top:0;-webkit-transform:none;transform-origin:center center;width:100%}.spinner_path.svelte-djkls6.svelte-djkls6{stroke-dasharray:90;stroke-linecap:round}.multiSelect.svelte-djkls6.svelte-djkls6{align-items:stretch;display:flex;flex-wrap:wrap;height:auto;padding:var(--multiSelectPadding,0 35px 0 16px)}.multiSelect.svelte-djkls6>.svelte-djkls6{flex:1 1 50px}.selectContainer.multiSelect.svelte-djkls6 input.svelte-djkls6{margin:var(--multiSelectInputMargin,0);padding:var(--multiSelectInputPadding,0);position:relative}.hasError.svelte-djkls6.svelte-djkls6{background:var(--errorBackground,#fff);border:var(--errorBorder,1px solid #ff2d55)}@-webkit-keyframes svelte-djkls6-rotate{to{transform:rotate(1turn)}}@keyframes svelte-djkls6-rotate{to{transform:rotate(1turn)}}",
  map: '{"version":3,"file":"Select.svelte","sources":["Select.svelte"],"sourcesContent":["<script>\\n  import {\\n    beforeUpdate,\\n    createEventDispatcher,\\n    onDestroy,\\n    onMount,\\n    tick\\n  } from \\"svelte\\";\\n  import List from \\"./List.svelte\\";\\n  import ItemComponent from \\"./Item.svelte\\";\\n  import SelectionComponent from \\"./Selection.svelte\\";\\n  import MultiSelectionComponent from \\"./MultiSelection.svelte\\";\\n  import isOutOfViewport from \\"./utils/isOutOfViewport\\";\\n  import debounce from \\"./utils/debounce\\";\\n  import DefaultClearIcon from \\"./ClearIcon.svelte\\";\\n\\n  const dispatch = createEventDispatcher();\\n  export let container = undefined;\\n  export let input = undefined;\\n  export let Item = ItemComponent;\\n  export let Selection = SelectionComponent;\\n  export let MultiSelection = MultiSelectionComponent;\\n  export let isMulti = false;\\n  export let multiFullItemClearable = false;\\n  export let isDisabled = false;\\n  export let isCreatable = false;\\n  export let isFocused = false;\\n  export let selectedValue = undefined;\\n  export let filterText = \\"\\";\\n  export let placeholder = \\"Select...\\";\\n  export let items = [];\\n  export let itemFilter = (label, filterText, option) =>\\n    label.toLowerCase().includes(filterText.toLowerCase());\\n  export let groupBy = undefined;\\n  export let groupFilter = groups => groups;\\n  export let isGroupHeaderSelectable = false;\\n  export let getGroupHeaderLabel = option => {\\n    return option.label;\\n  };\\n  export let getOptionLabel = (option, filterText) => {\\n    return option.isCreator ? `Create \\\\\\"${filterText}\\\\\\"` : option.label;\\n  };\\n  export let optionIdentifier = \\"value\\";\\n  export let loadOptions = undefined;\\n  export let hasError = false;\\n  export let containerStyles = \\"\\";\\n  export let getSelectionLabel = option => {\\n    if (option) return option.label;\\n  };\\n\\n  export let createGroupHeaderItem = groupValue => {\\n    return {\\n      value: groupValue,\\n      label: groupValue\\n    };\\n  };\\n\\n  export let createItem = filterText => {\\n    return {\\n      value: filterText,\\n      label: filterText\\n    };\\n  };\\n\\n  export let isSearchable = true;\\n  export let inputStyles = \\"\\";\\n  export let isClearable = true;\\n  export let isWaiting = false;\\n  export let listPlacement = \\"auto\\";\\n  export let listOpen = false;\\n  export let list = undefined;\\n  export let isVirtualList = false;\\n  export let loadOptionsInterval = 300;\\n  export let noOptionsMessage = \\"No options\\";\\n  export let hideEmptyState = false;\\n  export let filteredItems = [];\\n  export let inputAttributes = {};\\n  export let listAutoWidth = true;\\n  export let itemHeight = 40;\\n  export let Icon = undefined;\\n  export let iconProps = {};\\n  export let showChevron = false;\\n  export let showIndicator = false;\\n  export let containerClasses = \\"\\";\\n  export let indicatorSvg = undefined;\\n  export let ClearIcon = DefaultClearIcon;\\n\\n  let target;\\n  let activeSelectedValue;\\n  let _items = [];\\n  let originalItemsClone;\\n  let prev_selectedValue;\\n  let prev_listOpen;\\n  let prev_filterText;\\n  let prev_isFocused;\\n  let prev_filteredItems;\\n\\n  async function resetFilter() {\\n    await tick();\\n    filterText = \\"\\";\\n  }\\n\\n  let getItemsHasInvoked = false;\\n  const getItems = debounce(async () => {\\n    getItemsHasInvoked = true;\\n    isWaiting = true;\\n\\n    let res = await loadOptions(filterText).catch(err => {\\n      console.warn(\'svelte-select loadOptions error :>> \', err);\\n      dispatch(\\"error\\", { type: \'loadOptions\', details: err });\\n    });\\n    \\n    if (res && !res.cancelled) {\\n      if (res) {\\n        items = [...res];\\n        dispatch(\\"loaded\\", { items });\\n      } else {\\n        items = [];\\n      }\\n\\n      isWaiting = false;\\n      isFocused = true;\\n      listOpen = true;\\n    }\\n    \\n  }, loadOptionsInterval);\\n\\n  $: disabled = isDisabled;\\n\\n  $: updateSelectedValueDisplay(items);\\n\\n  $: {\\n    if (typeof selectedValue === \\"string\\") {\\n      selectedValue = {\\n        [optionIdentifier]: selectedValue,\\n        label: selectedValue\\n      };\\n    } else if (isMulti && Array.isArray(selectedValue) && selectedValue.length > 0) {\\n      selectedValue = selectedValue.map(item => typeof item === \\"string\\" ? ({ value: item, label: item }) : item);\\n    }\\n  }\\n\\n  $: {\\n    if (noOptionsMessage && list) list.$set({ noOptionsMessage });\\n  }\\n\\n  $: showSelectedItem = selectedValue && filterText.length === 0;\\n\\n  $: placeholderText = selectedValue ? \\"\\" : placeholder;\\n\\n  let _inputAttributes = {};\\n  $: {\\n    _inputAttributes = Object.assign({\\n      autocomplete: \\"off\\",\\n      autocorrect: \\"off\\",\\n      spellcheck: false\\n    }, inputAttributes);\\n\\n    if (!isSearchable) {\\n      _inputAttributes.readonly = true;\\n    }\\n  }\\n\\n  $: {\\n    let _filteredItems;\\n    let _items = items;\\n\\n    if (items && items.length > 0 && typeof items[0] !== \\"object\\") {\\n      _items = items.map((item, index) => {\\n        return {\\n          index,\\n          value: item,\\n          label: item\\n        };\\n      });\\n    }\\n\\n    if (loadOptions && filterText.length === 0 && originalItemsClone) {\\n      _filteredItems = JSON.parse(originalItemsClone);\\n      _items = JSON.parse(originalItemsClone);\\n    } else {\\n      _filteredItems = loadOptions\\n        ? filterText.length === 0\\n          ? []\\n          : _items\\n        : _items.filter(item => {\\n            let keepItem = true;\\n\\n            if (isMulti && selectedValue) {\\n              keepItem = !selectedValue.some(value => {\\n                return value[optionIdentifier] === item[optionIdentifier];\\n              });\\n            }\\n\\n            if (!keepItem) return false;\\n            if (filterText.length < 1) return true;\\n            return itemFilter(\\n              getOptionLabel(item, filterText),\\n              filterText,\\n              item\\n            );\\n          });\\n    }\\n\\n    if (groupBy) {\\n      const groupValues = [];\\n      const groups = {};\\n\\n      _filteredItems.forEach(item => {\\n        const groupValue = groupBy(item);\\n\\n        if (!groupValues.includes(groupValue)) {\\n          groupValues.push(groupValue);\\n          groups[groupValue] = [];\\n\\n          if (groupValue) {\\n            groups[groupValue].push(\\n              Object.assign(createGroupHeaderItem(groupValue, item), {\\n                id: groupValue,\\n                isGroupHeader: true,\\n                isSelectable: isGroupHeaderSelectable\\n              })\\n            );\\n          }\\n        }\\n\\n        groups[groupValue].push(\\n          Object.assign({ isGroupItem: !!groupValue }, item)\\n        );\\n      });\\n\\n      const sortedGroupedItems = [];\\n\\n      groupFilter(groupValues).forEach(groupValue => {\\n        sortedGroupedItems.push(...groups[groupValue]);\\n      });\\n\\n      filteredItems = sortedGroupedItems;\\n    } else {\\n      filteredItems = _filteredItems;\\n    }\\n  }\\n\\n  beforeUpdate(() => {\\n    if (isMulti && selectedValue && selectedValue.length > 1) {\\n      checkSelectedValueForDuplicates();\\n    }\\n\\n    if (!isMulti && selectedValue && prev_selectedValue !== selectedValue) {\\n      if (\\n        !prev_selectedValue ||\\n        JSON.stringify(selectedValue[optionIdentifier]) !==\\n          JSON.stringify(prev_selectedValue[optionIdentifier])\\n      ) {\\n        dispatch(\\"select\\", selectedValue);\\n      }\\n    }\\n\\n    if (\\n      isMulti &&\\n      JSON.stringify(selectedValue) !== JSON.stringify(prev_selectedValue)\\n    ) {\\n      if (checkSelectedValueForDuplicates()) {\\n        dispatch(\\"select\\", selectedValue);\\n      }\\n    }\\n\\n    if (container && listOpen !== prev_listOpen) {\\n      if (listOpen) {\\n        loadList();\\n      } else {\\n        removeList();\\n      }\\n    }\\n\\n    if (filterText !== prev_filterText) {\\n      if (filterText.length > 0) {\\n        isFocused = true;\\n        listOpen = true;\\n\\n        if (loadOptions) {\\n          getItems();\\n        } else {\\n          loadList();\\n          listOpen = true;\\n\\n          if (isMulti) {\\n            activeSelectedValue = undefined;\\n          }\\n        }\\n      } else {\\n        setList([]);\\n      }\\n\\n      if (list) {\\n        list.$set({\\n          filterText\\n        });\\n      }\\n    }\\n\\n    if (isFocused !== prev_isFocused) {\\n      if (isFocused || listOpen) {\\n        handleFocus();\\n      } else {\\n        resetFilter();\\n        if (input) input.blur();\\n      }\\n    }\\n\\n    if (prev_filteredItems !== filteredItems) {\\n      let _filteredItems = [...filteredItems];\\n\\n      if (isCreatable && filterText) {\\n        const itemToCreate = createItem(filterText);\\n        itemToCreate.isCreator = true;\\n\\n        const existingItemWithFilterValue = _filteredItems.find(item => {\\n          return item[optionIdentifier] === itemToCreate[optionIdentifier];\\n        });\\n\\n        let existingSelectionWithFilterValue;\\n\\n        if (selectedValue) {\\n          if (isMulti) {\\n            existingSelectionWithFilterValue = selectedValue.find(selection => {\\n              return (\\n                selection[optionIdentifier] === itemToCreate[optionIdentifier]\\n              );\\n            });\\n          } else if (\\n            selectedValue[optionIdentifier] === itemToCreate[optionIdentifier]\\n          ) {\\n            existingSelectionWithFilterValue = selectedValue;\\n          }\\n        }\\n\\n        if (!existingItemWithFilterValue && !existingSelectionWithFilterValue) {\\n          _filteredItems = [..._filteredItems, itemToCreate];\\n        }\\n      }\\n\\n      setList(_filteredItems);\\n    }\\n\\n    prev_selectedValue = selectedValue;\\n    prev_listOpen = listOpen;\\n    prev_filterText = filterText;\\n    prev_isFocused = isFocused;\\n    prev_filteredItems = filteredItems;\\n  });\\n\\n  function checkSelectedValueForDuplicates() {\\n    let noDuplicates = true;\\n    if (selectedValue) {\\n      const ids = [];\\n      const uniqueValues = [];\\n\\n      selectedValue.forEach(val => {\\n        if (!ids.includes(val[optionIdentifier])) {\\n          ids.push(val[optionIdentifier]);\\n          uniqueValues.push(val);\\n        } else {\\n          noDuplicates = false;\\n        }\\n      });\\n\\n      if (!noDuplicates)\\n        selectedValue = uniqueValues;\\n    }\\n    return noDuplicates;\\n  }\\n\\n  function findItem(selection) {\\n    let matchTo = selection ? selection[optionIdentifier] : selectedValue[optionIdentifier];\\n    return items.find(item => item[optionIdentifier] === matchTo);\\n  } \\n\\n  function updateSelectedValueDisplay(items) {\\n    if (!items || items.length === 0 || items.some(item => typeof item !== \\"object\\")) return;\\n    if (!selectedValue || (isMulti ? selectedValue.some(selection => !selection || !selection[optionIdentifier]) : !selectedValue[optionIdentifier])) return;\\n\\n    if (Array.isArray(selectedValue)) {\\n      selectedValue = selectedValue.map(selection => findItem(selection) || selection);\\n    } else {\\n      selectedValue = findItem() || selectedValue;\\n    }\\n  }\\n\\n  async function setList(items) {\\n    await tick();\\n    if (!listOpen) return;\\n    if (list) return list.$set({ items });\\n    if (loadOptions && getItemsHasInvoked && items.length > 0) loadList();\\n  }\\n\\n  function handleMultiItemClear(event) {\\n    const { detail } = event;\\n    const itemToRemove =\\n      selectedValue[detail ? detail.i : selectedValue.length - 1];\\n\\n    if (selectedValue.length === 1) {\\n      selectedValue = undefined;\\n    } else {\\n      selectedValue = selectedValue.filter(item => {\\n        return item !== itemToRemove;\\n      });\\n    }\\n\\n    dispatch(\\"clear\\", itemToRemove);\\n\\n    getPosition();\\n  }\\n\\n  async function getPosition() {\\n    await tick();\\n    if (!target || !container) return;\\n    const { top, height, width } = container.getBoundingClientRect();\\n\\n    target.style[\\"min-width\\"] = `${width}px`;\\n    target.style.width = `${listAutoWidth ? \\"auto\\" : \\"100%\\"}`;\\n    target.style.left = \\"0\\";\\n\\n    if (listPlacement === \\"top\\") {\\n      target.style.bottom = `${height + 5}px`;\\n    } else {\\n      target.style.top = `${height + 5}px`;\\n    }\\n\\n    target = target;\\n\\n    if (listPlacement === \\"auto\\" && isOutOfViewport(target).bottom) {\\n      target.style.top = ``;\\n      target.style.bottom = `${height + 5}px`;\\n    }\\n\\n    target.style.visibility = \\"\\";\\n  }\\n\\n  function handleKeyDown(e) {\\n    if (!isFocused) return;\\n\\n    switch (e.key) {\\n      case \\"ArrowDown\\":\\n        e.preventDefault();\\n        listOpen = true;\\n        activeSelectedValue = undefined;\\n        break;\\n      case \\"ArrowUp\\":\\n        e.preventDefault();\\n        listOpen = true;\\n        activeSelectedValue = undefined;\\n        break;\\n      case \\"Tab\\":\\n        if (!listOpen) isFocused = false;\\n        break;\\n      case \\"Backspace\\":\\n        if (!isMulti || filterText.length > 0) return;\\n        if (isMulti && selectedValue && selectedValue.length > 0) {\\n          handleMultiItemClear(\\n            activeSelectedValue !== undefined\\n              ? activeSelectedValue\\n              : selectedValue.length - 1\\n          );\\n          if (activeSelectedValue === 0 || activeSelectedValue === undefined)\\n            break;\\n          activeSelectedValue =\\n            selectedValue.length > activeSelectedValue\\n              ? activeSelectedValue - 1\\n              : undefined;\\n        }\\n        break;\\n      case \\"ArrowLeft\\":\\n        if (list) list.$set({ hoverItemIndex: -1 });\\n        if (!isMulti || filterText.length > 0) return;\\n\\n        if (activeSelectedValue === undefined) {\\n          activeSelectedValue = selectedValue.length - 1;\\n        } else if (\\n          selectedValue.length > activeSelectedValue &&\\n          activeSelectedValue !== 0\\n        ) {\\n          activeSelectedValue -= 1;\\n        }\\n        break;\\n      case \\"ArrowRight\\":\\n        if (list) list.$set({ hoverItemIndex: -1 });\\n        if (\\n          !isMulti ||\\n          filterText.length > 0 ||\\n          activeSelectedValue === undefined\\n        )\\n          return;\\n        if (activeSelectedValue === selectedValue.length - 1) {\\n          activeSelectedValue = undefined;\\n        } else if (activeSelectedValue < selectedValue.length - 1) {\\n          activeSelectedValue += 1;\\n        }\\n        break;\\n    }\\n  }\\n\\n  function handleFocus() {\\n    isFocused = true;\\n    if (input) input.focus();\\n  }\\n\\n  function removeList() {\\n    resetFilter();\\n    activeSelectedValue = undefined;\\n\\n    if (!list) return;\\n    list.$destroy();\\n    list = undefined;\\n\\n    if (!target) return;\\n    if (target.parentNode) target.parentNode.removeChild(target);\\n    target = undefined;\\n\\n    list = list;\\n    target = target;\\n  }\\n\\n  function handleWindowClick(event) {\\n    if (!container) return;\\n    const eventTarget =\\n      event.path && event.path.length > 0 ? event.path[0] : event.target;\\n    if (container.contains(eventTarget)) return;\\n    isFocused = false;\\n    listOpen = false;\\n    activeSelectedValue = undefined;\\n    if (input) input.blur();\\n  }\\n\\n  function handleClick() {\\n    if (isDisabled) return;\\n    isFocused = true;\\n    listOpen = !listOpen;\\n  }\\n\\n  export function handleClear() {\\n    selectedValue = undefined;\\n    listOpen = false;\\n    dispatch(\\"clear\\", selectedValue);\\n    handleFocus();\\n  }\\n\\n  async function loadList() {\\n    await tick();\\n    if (target && list) return;\\n\\n    const data = {\\n      Item,\\n      filterText,\\n      optionIdentifier,\\n      noOptionsMessage,\\n      hideEmptyState,\\n      isVirtualList,\\n      selectedValue,\\n      isMulti,\\n      getGroupHeaderLabel,\\n      items: filteredItems,\\n      itemHeight\\n    };\\n\\n    if (getOptionLabel) {\\n      data.getOptionLabel = getOptionLabel;\\n    }\\n\\n    target = document.createElement(\\"div\\");\\n\\n    Object.assign(target.style, {\\n      position: \\"absolute\\",\\n      \\"z-index\\": 2,\\n      visibility: \\"hidden\\"\\n    });\\n\\n    list = list;\\n    target = target;\\n    if (container) container.appendChild(target);\\n\\n    list = new List({\\n      target,\\n      props: data\\n    });\\n\\n    list.$on(\\"itemSelected\\", event => {\\n      const { detail } = event;\\n\\n      if (detail) {\\n        const item = Object.assign({}, detail);\\n\\n        if (!item.isGroupHeader || item.isSelectable) {\\n\\n          if (isMulti) {\\n            selectedValue = selectedValue ? selectedValue.concat([item]) : [item];\\n          } else {\\n            selectedValue = item;\\n          }\\n\\n          resetFilter();\\n          selectedValue = selectedValue;\\n\\n          setTimeout(() => {\\n            listOpen = false;\\n            activeSelectedValue = undefined;\\n          });\\n        }\\n      }\\n    });\\n\\n    list.$on(\\"itemCreated\\", event => {\\n      const { detail } = event;\\n      if (isMulti) {\\n        selectedValue = selectedValue || [];\\n        selectedValue = [...selectedValue, createItem(detail)];\\n      } else {\\n        selectedValue = createItem(detail);\\n      }\\n      \\n      dispatch(\'itemCreated\', detail);\\n      filterText = \\"\\";\\n      listOpen = false;\\n      activeSelectedValue = undefined;\\n      resetFilter();\\n    });\\n\\n    list.$on(\\"closeList\\", () => {\\n      listOpen = false;\\n    });\\n\\n    (list = list), (target = target);\\n    getPosition();\\n  }\\n\\n  onMount(() => {\\n    if (isFocused) input.focus();\\n    if (listOpen) loadList();\\n\\n    if (items && items.length > 0) {\\n      originalItemsClone = JSON.stringify(items);\\n    }\\n  });\\n\\n  onDestroy(() => {\\n    removeList();\\n  });\\n<\/script>\\n\\n<style>.selectContainer{--padding:0 16px;align-items:center;background:var(--background,#fff);border:var(--border,1px solid #d8dbdf);border-radius:var(--borderRadius,3px);display:flex;height:var(--height,42px);padding:var(--padding);position:relative}.selectContainer input{background:transparent;border:none;color:var(--inputColor,#3f4f5f);cursor:default;font-size:var(--inputFontSize,14px);height:var(--height,42px);left:var(--inputLeft,0);letter-spacing:var(--inputLetterSpacing,-.08px);line-height:var(--height,42px);padding:var(--inputPadding,var(--padding));position:absolute;width:100%}.selectContainer input::-moz-placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer input:-ms-input-placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer input::placeholder{color:var(--placeholderColor,#78848f);opacity:var(--placeholderOpacity,1)}.selectContainer input:focus{outline:none}.selectContainer:hover{border-color:var(--borderHoverColor,#b2b8bf)}.selectContainer.focused{border-color:var(--borderFocusColor,#006fe8)}.selectContainer.disabled{background:var(--disabledBackground,#ebedef);border-color:var(--disabledBorderColor,#ebedef);color:var(--disabledColor,#c1c6cc)}.selectContainer.disabled input::-moz-placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectContainer.disabled input:-ms-input-placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectContainer.disabled input::placeholder{color:var(--disabledPlaceholderColor,#c1c6cc);opacity:var(--disabledPlaceholderOpacity,1)}.selectedItem{height:var(--height,42px);line-height:var(--height,42px);overflow-x:hidden;padding:var(--selectedItemPadding,0 20px 0 0)}.selectedItem:focus{outline:none}.clearSelect{bottom:var(--clearSelectBottom,11px);color:var(--clearSelectColor,#c5cacf);flex:none!important;position:absolute;right:var(--clearSelectRight,10px);top:var(--clearSelectTop,11px);width:var(--clearSelectWidth,20px)}.clearSelect:hover{color:var(--clearSelectHoverColor,#2c3e50)}.selectContainer.focused .clearSelect{color:var(--clearSelectFocusColor,#3f4f5f)}.indicator{color:var(--indicatorColor,#c5cacf);height:var(--indicatorHeight,20px);position:absolute;right:var(--indicatorRight,10px);top:var(--indicatorTop,11px);width:var(--indicatorWidth,20px)}.indicator svg{fill:var(--indicatorFill,currentcolor);stroke:var(--indicatorStroke,currentcolor);stroke-width:0;display:inline-block;line-height:1}.spinner{-webkit-animation:rotate .75s linear infinite;animation:rotate .75s linear infinite;color:var(--spinnerColor,#51ce6c);height:var(--spinnerHeight,20px);position:absolute;right:var(--spinnerRight,10px);top:var(--spinnerLeft,11px);width:var(--spinnerWidth,20px)}.spinner_icon{bottom:0;display:block;height:100%;left:0;margin:auto;position:absolute;right:0;top:0;-webkit-transform:none;transform-origin:center center;width:100%}.spinner_path{stroke-dasharray:90;stroke-linecap:round}.multiSelect{align-items:stretch;display:flex;flex-wrap:wrap;height:auto;padding:var(--multiSelectPadding,0 35px 0 16px)}.multiSelect>*{flex:1 1 50px}.selectContainer.multiSelect input{margin:var(--multiSelectInputMargin,0);padding:var(--multiSelectInputPadding,0);position:relative}.hasError{background:var(--errorBackground,#fff);border:var(--errorBorder,1px solid #ff2d55)}@-webkit-keyframes rotate{to{transform:rotate(1turn)}}@keyframes rotate{to{transform:rotate(1turn)}}</style>\\n\\n<svelte:window\\n  on:click={handleWindowClick}\\n  on:keydown={handleKeyDown}\\n  on:resize={getPosition} />\\n\\n<div\\n  class=\\"selectContainer {containerClasses}\\"\\n  class:hasError\\n  class:multiSelect={isMulti}\\n  class:disabled={isDisabled}\\n  class:focused={isFocused}\\n  style={containerStyles}\\n  on:click={handleClick}\\n  bind:this={container}>\\n\\n  {#if Icon}\\n    <svelte:component this={Icon} {...iconProps} />\\n  {/if}\\n\\n  {#if isMulti && selectedValue && selectedValue.length > 0}\\n    <svelte:component\\n      this={MultiSelection}\\n      {selectedValue}\\n      {getSelectionLabel}\\n      {activeSelectedValue}\\n      {isDisabled}\\n      {multiFullItemClearable}\\n      on:multiItemClear={handleMultiItemClear}\\n      on:focus={handleFocus} />\\n  {/if}\\n\\n  {#if isDisabled}\\n    <input\\n      {..._inputAttributes}\\n      bind:this={input}\\n      on:focus={handleFocus}\\n      bind:value={filterText}\\n      placeholder={placeholderText}\\n      style={inputStyles}\\n      disabled />\\n  {:else}\\n    <input\\n      {..._inputAttributes}\\n      bind:this={input}\\n      on:focus={handleFocus}\\n      bind:value={filterText}\\n      placeholder={placeholderText}\\n      style={inputStyles} />\\n  {/if}\\n\\n  {#if !isMulti && showSelectedItem}\\n    <div class=\\"selectedItem\\" on:focus={handleFocus}>\\n      <svelte:component\\n        this={Selection}\\n        item={selectedValue}\\n        {getSelectionLabel} />\\n    </div>\\n  {/if}\\n\\n  {#if showSelectedItem && isClearable && !isDisabled && !isWaiting}\\n    <div class=\\"clearSelect\\" on:click|preventDefault={handleClear}>\\n      <svelte:component this={ClearIcon} /> \\n    </div>\\n  {/if}\\n\\n  {#if showIndicator || (showChevron && !selectedValue || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}\\n    <div class=\\"indicator\\">\\n      {#if indicatorSvg}\\n        {@html indicatorSvg}\\n      {:else}\\n        <svg\\n          width=\\"100%\\"\\n          height=\\"100%\\"\\n          viewBox=\\"0 0 20 20\\"\\n          focusable=\\"false\\">\\n          <path\\n            d=\\"M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747\\n            3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0\\n            1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502\\n            0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0\\n            0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z\\" />\\n        </svg>\\n      {/if}\\n    </div>\\n  {/if}\\n\\n  {#if isWaiting}\\n    <div class=\\"spinner\\">\\n      <svg class=\\"spinner_icon\\" viewBox=\\"25 25 50 50\\">\\n        <circle\\n          class=\\"spinner_path\\"\\n          cx=\\"50\\"\\n          cy=\\"50\\"\\n          r=\\"20\\"\\n          fill=\\"none\\"\\n          stroke=\\"currentColor\\"\\n          stroke-width=\\"5\\"\\n          stroke-miterlimit=\\"10\\" />\\n      </svg>\\n    </div>\\n  {/if}\\n</div>\\n"],"names":[],"mappings":"AAyoBO,4CAAgB,CAAC,UAAU,MAAM,CAAC,YAAY,MAAM,CAAC,WAAW,IAAI,YAAY,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,QAAQ,CAAC,iBAAiB,CAAC,CAAC,cAAc,IAAI,cAAc,CAAC,GAAG,CAAC,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,SAAS,QAAQ,CAAC,8BAAgB,CAAC,mBAAK,CAAC,WAAW,WAAW,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,YAAY,CAAC,OAAO,CAAC,CAAC,OAAO,OAAO,CAAC,UAAU,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,KAAK,IAAI,WAAW,CAAC,CAAC,CAAC,CAAC,eAAe,IAAI,oBAAoB,CAAC,MAAM,CAAC,CAAC,YAAY,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,QAAQ,IAAI,cAAc,CAAC,cAAc,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,8BAAgB,CAAC,mBAAK,kBAAkB,CAAC,MAAM,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,oBAAoB,CAAC,CAAC,CAAC,CAAC,8BAAgB,CAAC,mBAAK,sBAAsB,CAAC,MAAM,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,oBAAoB,CAAC,CAAC,CAAC,CAAC,8BAAgB,CAAC,mBAAK,aAAa,CAAC,MAAM,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,oBAAoB,CAAC,CAAC,CAAC,CAAC,8BAAgB,CAAC,mBAAK,MAAM,CAAC,QAAQ,IAAI,CAAC,4CAAgB,MAAM,CAAC,aAAa,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,gBAAgB,oCAAQ,CAAC,aAAa,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,gBAAgB,qCAAS,CAAC,WAAW,IAAI,oBAAoB,CAAC,OAAO,CAAC,CAAC,aAAa,IAAI,qBAAqB,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,eAAe,CAAC,OAAO,CAAC,CAAC,gBAAgB,uBAAS,CAAC,mBAAK,kBAAkB,CAAC,MAAM,IAAI,0BAA0B,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,4BAA4B,CAAC,CAAC,CAAC,CAAC,gBAAgB,uBAAS,CAAC,mBAAK,sBAAsB,CAAC,MAAM,IAAI,0BAA0B,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,4BAA4B,CAAC,CAAC,CAAC,CAAC,gBAAgB,uBAAS,CAAC,mBAAK,aAAa,CAAC,MAAM,IAAI,0BAA0B,CAAC,OAAO,CAAC,CAAC,QAAQ,IAAI,4BAA4B,CAAC,CAAC,CAAC,CAAC,yCAAa,CAAC,OAAO,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,IAAI,QAAQ,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,qBAAqB,CAAC,UAAU,CAAC,CAAC,yCAAa,MAAM,CAAC,QAAQ,IAAI,CAAC,wCAAY,CAAC,OAAO,IAAI,mBAAmB,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAAC,KAAK,IAAI,UAAU,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,IAAI,IAAI,gBAAgB,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,wCAAY,MAAM,CAAC,MAAM,IAAI,uBAAuB,CAAC,OAAO,CAAC,CAAC,gBAAgB,sBAAQ,CAAC,0BAAY,CAAC,MAAM,IAAI,uBAAuB,CAAC,OAAO,CAAC,CAAC,sCAAU,CAAC,MAAM,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,OAAO,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,gBAAgB,CAAC,IAAI,CAAC,CAAC,IAAI,IAAI,cAAc,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,gBAAgB,CAAC,IAAI,CAAC,CAAC,wBAAU,CAAC,iBAAG,CAAC,KAAK,IAAI,eAAe,CAAC,YAAY,CAAC,CAAC,OAAO,IAAI,iBAAiB,CAAC,YAAY,CAAC,CAAC,aAAa,CAAC,CAAC,QAAQ,YAAY,CAAC,YAAY,CAAC,CAAC,oCAAQ,CAAC,kBAAkB,oBAAM,CAAC,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,oBAAM,CAAC,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,MAAM,IAAI,cAAc,CAAC,OAAO,CAAC,CAAC,OAAO,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,cAAc,CAAC,IAAI,CAAC,CAAC,IAAI,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,cAAc,CAAC,IAAI,CAAC,CAAC,yCAAa,CAAC,OAAO,CAAC,CAAC,QAAQ,KAAK,CAAC,OAAO,IAAI,CAAC,KAAK,CAAC,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,CAAC,kBAAkB,IAAI,CAAC,iBAAiB,MAAM,CAAC,MAAM,CAAC,MAAM,IAAI,CAAC,yCAAa,CAAC,iBAAiB,EAAE,CAAC,eAAe,KAAK,CAAC,wCAAY,CAAC,YAAY,OAAO,CAAC,QAAQ,IAAI,CAAC,UAAU,IAAI,CAAC,OAAO,IAAI,CAAC,QAAQ,IAAI,oBAAoB,CAAC,aAAa,CAAC,CAAC,0BAAY,CAAC,cAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,gBAAgB,0BAAY,CAAC,mBAAK,CAAC,OAAO,IAAI,wBAAwB,CAAC,CAAC,CAAC,CAAC,QAAQ,IAAI,yBAAyB,CAAC,CAAC,CAAC,CAAC,SAAS,QAAQ,CAAC,qCAAS,CAAC,WAAW,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,aAAa,CAAC,iBAAiB,CAAC,CAAC,mBAAmB,oBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,oBAAM,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}'
};
var Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showSelectedItem;
  let placeholderText;
  const dispatch = createEventDispatcher();
  let { container = void 0 } = $$props;
  let { input = void 0 } = $$props;
  let { Item: Item$1 = Item } = $$props;
  let { Selection: Selection$1 = Selection } = $$props;
  let { MultiSelection: MultiSelection$1 = MultiSelection } = $$props;
  let { isMulti = false } = $$props;
  let { multiFullItemClearable = false } = $$props;
  let { isDisabled = false } = $$props;
  let { isCreatable = false } = $$props;
  let { isFocused = false } = $$props;
  let { selectedValue = void 0 } = $$props;
  let { filterText = "" } = $$props;
  let { placeholder = "Select..." } = $$props;
  let { items = [] } = $$props;
  let { itemFilter = (label, filterText2, option) => label.toLowerCase().includes(filterText2.toLowerCase()) } = $$props;
  let { groupBy = void 0 } = $$props;
  let { groupFilter = (groups) => groups } = $$props;
  let { isGroupHeaderSelectable = false } = $$props;
  let { getGroupHeaderLabel = (option) => {
    return option.label;
  } } = $$props;
  let { getOptionLabel = (option, filterText2) => {
    return option.isCreator ? `Create "${filterText2}"` : option.label;
  } } = $$props;
  let { optionIdentifier = "value" } = $$props;
  let { loadOptions = void 0 } = $$props;
  let { hasError = false } = $$props;
  let { containerStyles = "" } = $$props;
  let { getSelectionLabel = (option) => {
    if (option)
      return option.label;
  } } = $$props;
  let { createGroupHeaderItem = (groupValue) => {
    return { value: groupValue, label: groupValue };
  } } = $$props;
  let { createItem = (filterText2) => {
    return { value: filterText2, label: filterText2 };
  } } = $$props;
  let { isSearchable = true } = $$props;
  let { inputStyles = "" } = $$props;
  let { isClearable = true } = $$props;
  let { isWaiting = false } = $$props;
  let { listPlacement = "auto" } = $$props;
  let { listOpen = false } = $$props;
  let { list = void 0 } = $$props;
  let { isVirtualList = false } = $$props;
  let { loadOptionsInterval = 300 } = $$props;
  let { noOptionsMessage = "No options" } = $$props;
  let { hideEmptyState = false } = $$props;
  let { filteredItems = [] } = $$props;
  let { inputAttributes = {} } = $$props;
  let { listAutoWidth = true } = $$props;
  let { itemHeight = 40 } = $$props;
  let { Icon = void 0 } = $$props;
  let { iconProps = {} } = $$props;
  let { showChevron = false } = $$props;
  let { showIndicator = false } = $$props;
  let { containerClasses = "" } = $$props;
  let { indicatorSvg = void 0 } = $$props;
  let { ClearIcon: ClearIcon$1 = ClearIcon } = $$props;
  let target;
  let activeSelectedValue;
  let originalItemsClone;
  let prev_selectedValue;
  let prev_listOpen;
  let prev_filterText;
  let prev_isFocused;
  let prev_filteredItems;
  async function resetFilter() {
    await tick();
    filterText = "";
  }
  let getItemsHasInvoked = false;
  const getItems = debounce(async () => {
    getItemsHasInvoked = true;
    isWaiting = true;
    let res = await loadOptions(filterText).catch((err) => {
      console.warn("svelte-select loadOptions error :>> ", err);
      dispatch("error", { type: "loadOptions", details: err });
    });
    if (res && !res.cancelled) {
      if (res) {
        items = [...res];
        dispatch("loaded", { items });
      } else {
        items = [];
      }
      isWaiting = false;
      isFocused = true;
      listOpen = true;
    }
  }, loadOptionsInterval);
  let _inputAttributes = {};
  beforeUpdate(() => {
    if (isMulti && selectedValue && selectedValue.length > 1) {
      checkSelectedValueForDuplicates();
    }
    if (!isMulti && selectedValue && prev_selectedValue !== selectedValue) {
      if (!prev_selectedValue || JSON.stringify(selectedValue[optionIdentifier]) !== JSON.stringify(prev_selectedValue[optionIdentifier])) {
        dispatch("select", selectedValue);
      }
    }
    if (isMulti && JSON.stringify(selectedValue) !== JSON.stringify(prev_selectedValue)) {
      if (checkSelectedValueForDuplicates()) {
        dispatch("select", selectedValue);
      }
    }
    if (container && listOpen !== prev_listOpen) {
      if (listOpen) {
        loadList();
      } else {
        removeList();
      }
    }
    if (filterText !== prev_filterText) {
      if (filterText.length > 0) {
        isFocused = true;
        listOpen = true;
        if (loadOptions) {
          getItems();
        } else {
          loadList();
          listOpen = true;
          if (isMulti) {
            activeSelectedValue = void 0;
          }
        }
      } else {
        setList([]);
      }
      if (list) {
        list.$set({ filterText });
      }
    }
    if (isFocused !== prev_isFocused) {
      if (isFocused || listOpen) {
        handleFocus();
      } else {
        resetFilter();
        if (input)
          input.blur();
      }
    }
    if (prev_filteredItems !== filteredItems) {
      let _filteredItems = [...filteredItems];
      if (isCreatable && filterText) {
        const itemToCreate = createItem(filterText);
        itemToCreate.isCreator = true;
        const existingItemWithFilterValue = _filteredItems.find((item) => {
          return item[optionIdentifier] === itemToCreate[optionIdentifier];
        });
        let existingSelectionWithFilterValue;
        if (selectedValue) {
          if (isMulti) {
            existingSelectionWithFilterValue = selectedValue.find((selection) => {
              return selection[optionIdentifier] === itemToCreate[optionIdentifier];
            });
          } else if (selectedValue[optionIdentifier] === itemToCreate[optionIdentifier]) {
            existingSelectionWithFilterValue = selectedValue;
          }
        }
        if (!existingItemWithFilterValue && !existingSelectionWithFilterValue) {
          _filteredItems = [..._filteredItems, itemToCreate];
        }
      }
      setList(_filteredItems);
    }
    prev_selectedValue = selectedValue;
    prev_listOpen = listOpen;
    prev_filterText = filterText;
    prev_isFocused = isFocused;
    prev_filteredItems = filteredItems;
  });
  function checkSelectedValueForDuplicates() {
    let noDuplicates = true;
    if (selectedValue) {
      const ids = [];
      const uniqueValues = [];
      selectedValue.forEach((val) => {
        if (!ids.includes(val[optionIdentifier])) {
          ids.push(val[optionIdentifier]);
          uniqueValues.push(val);
        } else {
          noDuplicates = false;
        }
      });
      if (!noDuplicates)
        selectedValue = uniqueValues;
    }
    return noDuplicates;
  }
  function findItem(selection) {
    let matchTo = selection ? selection[optionIdentifier] : selectedValue[optionIdentifier];
    return items.find((item) => item[optionIdentifier] === matchTo);
  }
  function updateSelectedValueDisplay(items2) {
    if (!items2 || items2.length === 0 || items2.some((item) => typeof item !== "object"))
      return;
    if (!selectedValue || (isMulti ? selectedValue.some((selection) => !selection || !selection[optionIdentifier]) : !selectedValue[optionIdentifier]))
      return;
    if (Array.isArray(selectedValue)) {
      selectedValue = selectedValue.map((selection) => findItem(selection) || selection);
    } else {
      selectedValue = findItem() || selectedValue;
    }
  }
  async function setList(items2) {
    await tick();
    if (!listOpen)
      return;
    if (list)
      return list.$set({ items: items2 });
    if (loadOptions && getItemsHasInvoked && items2.length > 0)
      loadList();
  }
  async function getPosition() {
    await tick();
    if (!target || !container)
      return;
    const { top, height: height2, width } = container.getBoundingClientRect();
    target.style["min-width"] = `${width}px`;
    target.style.width = `${listAutoWidth ? "auto" : "100%"}`;
    target.style.left = "0";
    if (listPlacement === "top") {
      target.style.bottom = `${height2 + 5}px`;
    } else {
      target.style.top = `${height2 + 5}px`;
    }
    target = target;
    if (listPlacement === "auto" && isOutOfViewport(target).bottom) {
      target.style.top = ``;
      target.style.bottom = `${height2 + 5}px`;
    }
    target.style.visibility = "";
  }
  function handleFocus() {
    isFocused = true;
    if (input)
      input.focus();
  }
  function removeList() {
    resetFilter();
    activeSelectedValue = void 0;
    if (!list)
      return;
    list.$destroy();
    list = void 0;
    if (!target)
      return;
    if (target.parentNode)
      target.parentNode.removeChild(target);
    target = void 0;
    list = list;
    target = target;
  }
  function handleClear() {
    selectedValue = void 0;
    listOpen = false;
    dispatch("clear", selectedValue);
    handleFocus();
  }
  async function loadList() {
    await tick();
    if (target && list)
      return;
    const data = {
      Item: Item$1,
      filterText,
      optionIdentifier,
      noOptionsMessage,
      hideEmptyState,
      isVirtualList,
      selectedValue,
      isMulti,
      getGroupHeaderLabel,
      items: filteredItems,
      itemHeight
    };
    if (getOptionLabel) {
      data.getOptionLabel = getOptionLabel;
    }
    target = document.createElement("div");
    Object.assign(target.style, {
      position: "absolute",
      "z-index": 2,
      visibility: "hidden"
    });
    list = list;
    target = target;
    if (container)
      container.appendChild(target);
    list = new List({ target, props: data });
    list.$on("itemSelected", (event) => {
      const { detail } = event;
      if (detail) {
        const item = Object.assign({}, detail);
        if (!item.isGroupHeader || item.isSelectable) {
          if (isMulti) {
            selectedValue = selectedValue ? selectedValue.concat([item]) : [item];
          } else {
            selectedValue = item;
          }
          resetFilter();
          selectedValue = selectedValue;
          setTimeout(() => {
            listOpen = false;
            activeSelectedValue = void 0;
          });
        }
      }
    });
    list.$on("itemCreated", (event) => {
      const { detail } = event;
      if (isMulti) {
        selectedValue = selectedValue || [];
        selectedValue = [...selectedValue, createItem(detail)];
      } else {
        selectedValue = createItem(detail);
      }
      dispatch("itemCreated", detail);
      filterText = "";
      listOpen = false;
      activeSelectedValue = void 0;
      resetFilter();
    });
    list.$on("closeList", () => {
      listOpen = false;
    });
    list = list, target = target;
    getPosition();
  }
  onMount(() => {
    if (isFocused)
      input.focus();
    if (listOpen)
      loadList();
    if (items && items.length > 0) {
      originalItemsClone = JSON.stringify(items);
    }
  });
  onDestroy(() => {
    removeList();
  });
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.input === void 0 && $$bindings.input && input !== void 0)
    $$bindings.input(input);
  if ($$props.Item === void 0 && $$bindings.Item && Item$1 !== void 0)
    $$bindings.Item(Item$1);
  if ($$props.Selection === void 0 && $$bindings.Selection && Selection$1 !== void 0)
    $$bindings.Selection(Selection$1);
  if ($$props.MultiSelection === void 0 && $$bindings.MultiSelection && MultiSelection$1 !== void 0)
    $$bindings.MultiSelection(MultiSelection$1);
  if ($$props.isMulti === void 0 && $$bindings.isMulti && isMulti !== void 0)
    $$bindings.isMulti(isMulti);
  if ($$props.multiFullItemClearable === void 0 && $$bindings.multiFullItemClearable && multiFullItemClearable !== void 0)
    $$bindings.multiFullItemClearable(multiFullItemClearable);
  if ($$props.isDisabled === void 0 && $$bindings.isDisabled && isDisabled !== void 0)
    $$bindings.isDisabled(isDisabled);
  if ($$props.isCreatable === void 0 && $$bindings.isCreatable && isCreatable !== void 0)
    $$bindings.isCreatable(isCreatable);
  if ($$props.isFocused === void 0 && $$bindings.isFocused && isFocused !== void 0)
    $$bindings.isFocused(isFocused);
  if ($$props.selectedValue === void 0 && $$bindings.selectedValue && selectedValue !== void 0)
    $$bindings.selectedValue(selectedValue);
  if ($$props.filterText === void 0 && $$bindings.filterText && filterText !== void 0)
    $$bindings.filterText(filterText);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.itemFilter === void 0 && $$bindings.itemFilter && itemFilter !== void 0)
    $$bindings.itemFilter(itemFilter);
  if ($$props.groupBy === void 0 && $$bindings.groupBy && groupBy !== void 0)
    $$bindings.groupBy(groupBy);
  if ($$props.groupFilter === void 0 && $$bindings.groupFilter && groupFilter !== void 0)
    $$bindings.groupFilter(groupFilter);
  if ($$props.isGroupHeaderSelectable === void 0 && $$bindings.isGroupHeaderSelectable && isGroupHeaderSelectable !== void 0)
    $$bindings.isGroupHeaderSelectable(isGroupHeaderSelectable);
  if ($$props.getGroupHeaderLabel === void 0 && $$bindings.getGroupHeaderLabel && getGroupHeaderLabel !== void 0)
    $$bindings.getGroupHeaderLabel(getGroupHeaderLabel);
  if ($$props.getOptionLabel === void 0 && $$bindings.getOptionLabel && getOptionLabel !== void 0)
    $$bindings.getOptionLabel(getOptionLabel);
  if ($$props.optionIdentifier === void 0 && $$bindings.optionIdentifier && optionIdentifier !== void 0)
    $$bindings.optionIdentifier(optionIdentifier);
  if ($$props.loadOptions === void 0 && $$bindings.loadOptions && loadOptions !== void 0)
    $$bindings.loadOptions(loadOptions);
  if ($$props.hasError === void 0 && $$bindings.hasError && hasError !== void 0)
    $$bindings.hasError(hasError);
  if ($$props.containerStyles === void 0 && $$bindings.containerStyles && containerStyles !== void 0)
    $$bindings.containerStyles(containerStyles);
  if ($$props.getSelectionLabel === void 0 && $$bindings.getSelectionLabel && getSelectionLabel !== void 0)
    $$bindings.getSelectionLabel(getSelectionLabel);
  if ($$props.createGroupHeaderItem === void 0 && $$bindings.createGroupHeaderItem && createGroupHeaderItem !== void 0)
    $$bindings.createGroupHeaderItem(createGroupHeaderItem);
  if ($$props.createItem === void 0 && $$bindings.createItem && createItem !== void 0)
    $$bindings.createItem(createItem);
  if ($$props.isSearchable === void 0 && $$bindings.isSearchable && isSearchable !== void 0)
    $$bindings.isSearchable(isSearchable);
  if ($$props.inputStyles === void 0 && $$bindings.inputStyles && inputStyles !== void 0)
    $$bindings.inputStyles(inputStyles);
  if ($$props.isClearable === void 0 && $$bindings.isClearable && isClearable !== void 0)
    $$bindings.isClearable(isClearable);
  if ($$props.isWaiting === void 0 && $$bindings.isWaiting && isWaiting !== void 0)
    $$bindings.isWaiting(isWaiting);
  if ($$props.listPlacement === void 0 && $$bindings.listPlacement && listPlacement !== void 0)
    $$bindings.listPlacement(listPlacement);
  if ($$props.listOpen === void 0 && $$bindings.listOpen && listOpen !== void 0)
    $$bindings.listOpen(listOpen);
  if ($$props.list === void 0 && $$bindings.list && list !== void 0)
    $$bindings.list(list);
  if ($$props.isVirtualList === void 0 && $$bindings.isVirtualList && isVirtualList !== void 0)
    $$bindings.isVirtualList(isVirtualList);
  if ($$props.loadOptionsInterval === void 0 && $$bindings.loadOptionsInterval && loadOptionsInterval !== void 0)
    $$bindings.loadOptionsInterval(loadOptionsInterval);
  if ($$props.noOptionsMessage === void 0 && $$bindings.noOptionsMessage && noOptionsMessage !== void 0)
    $$bindings.noOptionsMessage(noOptionsMessage);
  if ($$props.hideEmptyState === void 0 && $$bindings.hideEmptyState && hideEmptyState !== void 0)
    $$bindings.hideEmptyState(hideEmptyState);
  if ($$props.filteredItems === void 0 && $$bindings.filteredItems && filteredItems !== void 0)
    $$bindings.filteredItems(filteredItems);
  if ($$props.inputAttributes === void 0 && $$bindings.inputAttributes && inputAttributes !== void 0)
    $$bindings.inputAttributes(inputAttributes);
  if ($$props.listAutoWidth === void 0 && $$bindings.listAutoWidth && listAutoWidth !== void 0)
    $$bindings.listAutoWidth(listAutoWidth);
  if ($$props.itemHeight === void 0 && $$bindings.itemHeight && itemHeight !== void 0)
    $$bindings.itemHeight(itemHeight);
  if ($$props.Icon === void 0 && $$bindings.Icon && Icon !== void 0)
    $$bindings.Icon(Icon);
  if ($$props.iconProps === void 0 && $$bindings.iconProps && iconProps !== void 0)
    $$bindings.iconProps(iconProps);
  if ($$props.showChevron === void 0 && $$bindings.showChevron && showChevron !== void 0)
    $$bindings.showChevron(showChevron);
  if ($$props.showIndicator === void 0 && $$bindings.showIndicator && showIndicator !== void 0)
    $$bindings.showIndicator(showIndicator);
  if ($$props.containerClasses === void 0 && $$bindings.containerClasses && containerClasses !== void 0)
    $$bindings.containerClasses(containerClasses);
  if ($$props.indicatorSvg === void 0 && $$bindings.indicatorSvg && indicatorSvg !== void 0)
    $$bindings.indicatorSvg(indicatorSvg);
  if ($$props.ClearIcon === void 0 && $$bindings.ClearIcon && ClearIcon$1 !== void 0)
    $$bindings.ClearIcon(ClearIcon$1);
  if ($$props.handleClear === void 0 && $$bindings.handleClear && handleClear !== void 0)
    $$bindings.handleClear(handleClear);
  $$result.css.add(css$f);
  {
    updateSelectedValueDisplay(items);
  }
  {
    {
      if (typeof selectedValue === "string") {
        selectedValue = {
          [optionIdentifier]: selectedValue,
          label: selectedValue
        };
      } else if (isMulti && Array.isArray(selectedValue) && selectedValue.length > 0) {
        selectedValue = selectedValue.map((item) => typeof item === "string" ? { value: item, label: item } : item);
      }
    }
  }
  {
    {
      if (noOptionsMessage && list)
        list.$set({ noOptionsMessage });
    }
  }
  showSelectedItem = selectedValue && filterText.length === 0;
  placeholderText = selectedValue ? "" : placeholder;
  {
    {
      _inputAttributes = Object.assign({
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: false
      }, inputAttributes);
      if (!isSearchable) {
        _inputAttributes.readonly = true;
      }
    }
  }
  {
    {
      let _filteredItems;
      let _items = items;
      if (items && items.length > 0 && typeof items[0] !== "object") {
        _items = items.map((item, index2) => {
          return { index: index2, value: item, label: item };
        });
      }
      if (loadOptions && filterText.length === 0 && originalItemsClone) {
        _filteredItems = JSON.parse(originalItemsClone);
        _items = JSON.parse(originalItemsClone);
      } else {
        _filteredItems = loadOptions ? filterText.length === 0 ? [] : _items : _items.filter((item) => {
          let keepItem = true;
          if (isMulti && selectedValue) {
            keepItem = !selectedValue.some((value) => {
              return value[optionIdentifier] === item[optionIdentifier];
            });
          }
          if (!keepItem)
            return false;
          if (filterText.length < 1)
            return true;
          return itemFilter(getOptionLabel(item, filterText), filterText, item);
        });
      }
      if (groupBy) {
        const groupValues = [];
        const groups = {};
        _filteredItems.forEach((item) => {
          const groupValue = groupBy(item);
          if (!groupValues.includes(groupValue)) {
            groupValues.push(groupValue);
            groups[groupValue] = [];
            if (groupValue) {
              groups[groupValue].push(Object.assign(createGroupHeaderItem(groupValue, item), {
                id: groupValue,
                isGroupHeader: true,
                isSelectable: isGroupHeaderSelectable
              }));
            }
          }
          groups[groupValue].push(Object.assign({ isGroupItem: !!groupValue }, item));
        });
        const sortedGroupedItems = [];
        groupFilter(groupValues).forEach((groupValue) => {
          sortedGroupedItems.push(...groups[groupValue]);
        });
        filteredItems = sortedGroupedItems;
      } else {
        filteredItems = _filteredItems;
      }
    }
  }
  return `

<div class="${[
    "selectContainer " + escape2(containerClasses) + " svelte-djkls6",
    (hasError ? "hasError" : "") + " " + (isMulti ? "multiSelect" : "") + " " + (isDisabled ? "disabled" : "") + " " + (isFocused ? "focused" : "")
  ].join(" ").trim()}"${add_attribute("style", containerStyles, 0)}${add_attribute("this", container, 1)}>${Icon ? `${validate_component(Icon || missing_component, "svelte:component").$$render($$result, Object_1.assign(iconProps), {}, {})}` : ``}

  ${isMulti && selectedValue && selectedValue.length > 0 ? `${validate_component(MultiSelection$1 || missing_component, "svelte:component").$$render($$result, {
    selectedValue,
    getSelectionLabel,
    activeSelectedValue,
    isDisabled,
    multiFullItemClearable
  }, {}, {})}` : ``}

  ${isDisabled ? `<input${spread([
    _inputAttributes,
    { placeholder: escape2(placeholderText) },
    { style: escape2(inputStyles) },
    { disabled: true }
  ], "svelte-djkls6")}${add_attribute("this", input, 1)}${add_attribute("value", filterText, 1)}>` : `<input${spread([
    _inputAttributes,
    { placeholder: escape2(placeholderText) },
    { style: escape2(inputStyles) }
  ], "svelte-djkls6")}${add_attribute("this", input, 1)}${add_attribute("value", filterText, 1)}>`}

  ${!isMulti && showSelectedItem ? `<div class="${"selectedItem svelte-djkls6"}">${validate_component(Selection$1 || missing_component, "svelte:component").$$render($$result, { item: selectedValue, getSelectionLabel }, {}, {})}</div>` : ``}

  ${showSelectedItem && isClearable && !isDisabled && !isWaiting ? `<div class="${"clearSelect svelte-djkls6"}">${validate_component(ClearIcon$1 || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>` : ``}

  ${showIndicator || (showChevron && !selectedValue || !isSearchable && !isDisabled && !isWaiting && (showSelectedItem && !isClearable || !showSelectedItem)) ? `<div class="${"indicator svelte-djkls6"}">${indicatorSvg ? `${indicatorSvg}` : `<svg width="${"100%"}" height="${"100%"}" viewBox="${"0 0 20 20"}" focusable="${"false"}" class="${"svelte-djkls6"}"><path d="${"M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747\n            3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0\n            1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502\n            0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0\n            0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"}"></path></svg>`}</div>` : ``}

  ${isWaiting ? `<div class="${"spinner svelte-djkls6"}"><svg class="${"spinner_icon svelte-djkls6"}" viewBox="${"25 25 50 50"}"><circle class="${"spinner_path svelte-djkls6"}" cx="${"50"}" cy="${"50"}" r="${"20"}" fill="${"none"}" stroke="${"currentColor"}" stroke-width="${"5"}" stroke-miterlimit="${"10"}"></circle></svg></div>` : ``}</div>`;
});
var css$e = {
  code: '.select.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{--background:#181a1e;--border:1px solid #181a1e;--borderFocusColor:#be3434;--borderHoverColor:#181a1e;--borderRadius:0.5rem;--clearSelectColor:#8293a4;--clearSelectFocusColor:#8293a4;--clearSelectHoverColor:#8293a4;--clearSelectWidth:16px;--disabledBackground:transparent;--disabledBorderColor:rgba(121,134,148,0.15);--disabledColor:hsla(0,0%,100%,0.4);--disabledPlaceholderColor:rgba(121,134,148,0.6);--errorBorder:1px solid #db3a3a;--height:50px;--indicatorColor:#8293a4;--indicatorFill:#8293a4;--indicatorRight:16px;--inputColor:#fff;--inputFontSize:1rem;--inputLetterSpacing:0em;--itemActiveBackground:#1a1e23;--itemFirstBorderRadius:0.25rem;--itemHoverBG:#1a1e23;--itemIsActiveBG:#1a1e23;--itemColor:#fff;--listBackground:#21252a;--listBorderRadius:0.5rem;--listShadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);--multiClearBG:#0d0f10;--multiClearFill:#8293a4;--multiClearHoverBG:#0d0f10;--multiClearHoverFill:#8293a4;--multiClearRadius:0.25rem;--multiClearTop:9px;--multiItemActiveBG:#0d0f10;--multiItemActiveColor:#fff;--multiItemDisabledHoverBg:#0d0f10;--multiItemDisabledHoverColor:#fff;--multiItemBG:#0d0f10;--multiItemBorderRadius:0.25rem;--multiItemHeight:32px;--multiItemMargin:10px 10px 0 0;--multiLabelMargin:0 5px 0 0;--placeholderColor:rgba(121,134,148,0.6);color:#fff}@media(min-width:768px){.select.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{--inputFontSize:1rem;--height:60px;--multiItemMargin:14px 12px 0 0}}.selectContainer.selectContainer.selectContainer{font-size:.875rem;line-height:1.25rem}@media(min-width:768px){.selectContainer.selectContainer.selectContainer{font-size:1rem;line-height:1.5rem}}.selectContainer.selectContainer.selectContainer{transition-duration:.15s;transition-duration:.2s;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl.selectContainer input::-moz-placeholder{font-size:.875rem;line-height:1.25rem;opacity:1}.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl.selectContainer input:-ms-input-placeholder{font-size:.875rem;line-height:1.25rem;opacity:1}.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl.selectContainer input::placeholder{font-size:.875rem;line-height:1.25rem;opacity:1}@media(min-width:768px){.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl.selectContainer input::-moz-placeholder{font-size:1rem;line-height:1.5rem}.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl.selectContainer input:-ms-input-placeholder{font-size:1rem;line-height:1.5rem}.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl.selectContainer input::placeholder{font-size:1rem;line-height:1.5rem}}.selectContainer .selectedItem{align-items:center;display:flex;overflow-y:hidden}.toggle-label.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{display:inline-block;flex-shrink:0;height:16px;position:relative;width:34px}.toggle-label.svelte-jhuanl input.form-toggle.svelte-jhuanl.svelte-jhuanl{display:none}.toggle-label.svelte-jhuanl input.form-toggle.svelte-jhuanl:checked+.slider.svelte-jhuanl{--tw-border-opacity:0;background-color:#be3434}.toggle-label.svelte-jhuanl input.form-toggle.svelte-jhuanl:checked+.slider.svelte-jhuanl:before{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity));transform:translate(20px,2px)}.toggle-label.svelte-jhuanl .slider.svelte-jhuanl.svelte-jhuanl{background-color:transparent;cursor:pointer;height:100%;left:0;position:absolute;top:0;transition-duration:.15s;transition-duration:.3s;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);width:100%}.toggle-label.svelte-jhuanl .slider.svelte-jhuanl.svelte-jhuanl:before{content:"";height:12px;transform:translate(2px,2px);transition-duration:.15s;transition-duration:.3s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);width:12px}.toggle-label.isBigToggle.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{height:24px;width:48px}.toggle-label.isBigToggle.svelte-jhuanl .slider.svelte-jhuanl.svelte-jhuanl{border-radius:1rem}.toggle-label.isBigToggle.svelte-jhuanl input.form-toggle.svelte-jhuanl:checked+.slider.svelte-jhuanl:before{transform:translate(26px,3px)}.toggle-label.isBigToggle.svelte-jhuanl .slider.svelte-jhuanl.svelte-jhuanl:before{height:18px;transform:translate(4px,3px);width:18px}input.hasInlineText.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{padding-right:var(--inline-text-padding)}.inline-text.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{bottom:13.5px}@media(min-width:768px){.inline-text.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{bottom:18px}}input.isCurrencyInput.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{--defaultPadding:0.75rem;--currencyPadding:13px;padding-left:calc(var(--defaultPadding) + var(--currencyPadding))}@media(min-width:768px){input.isCurrencyInput.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{--defaultPadding:1rem;--currencyPadding:9px}}.currency-symbol.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{bottom:15px}@media(min-width:768px){.currency-symbol.svelte-jhuanl.svelte-jhuanl.svelte-jhuanl{bottom:16px}}',
  map: `{"version":3,"file":"FormControl.svelte","sources":["FormControl.svelte"],"sourcesContent":["<script>\\n  import { createEventDispatcher } from 'svelte';\\n  import { uuidv4 } from '@metafy/lib/utils';\\n  import Select from 'svelte-select';\\n  import SelectionComponent from 'svelte-select/src/Selection.svelte';\\n\\n  const dispatch = createEventDispatcher();\\n\\n  // Base options\\n  export let id = \`a\${uuidv4()}\`;\\n  export let label = null;\\n  export let type = 'text';\\n  export let placeholder = '';\\n  export let help = null;\\n  export let disabled = false;\\n  export let required = false;\\n  export let action = null;\\n  export let actionLink = false;\\n  export let actionCustom = false;\\n  export let value = null;\\n  export let checked = null;\\n  let className = '';\\n  export { className as class };\\n  let el;\\n  export function focus(moveCursorToEnd = false) {\\n    el.focus();\\n    if (moveCursorToEnd) {\\n      el.setSelectionRange(el.value.length, el.value.length);\\n    }\\n  }\\n\\n  // Input options\\n  export let maxlength = undefined;\\n  export let max = undefined;\\n  export let min = undefined;\\n  export let readonly = false;\\n  // Note that to be able to use \`inlineText\`, or \`isCurrencyInput\`, we need to wrap the FormControl\\n  // in a \\"relative\\" div, from outside the component.\\n  export let inlineText = null;\\n  export let inlineTextPadding = null;\\n  export let isCurrencyInput = false;\\n\\n  // Select options\\n  export let items = [];\\n  export let isMulti = false;\\n  export let isClearable = true;\\n  export let isCreatable = false;\\n  export let isSearchable = true;\\n  export let selectedValue = null;\\n  export let noOptionsMessage = 'No items found.';\\n  export let listPlacement = 'auto';\\n  export let listAutoWidth = true;\\n  export let loadOptions = undefined;\\n  export let showIndicator = false;\\n  export let Selection = SelectionComponent;\\n\\n  // Icon options\\n  export let leftIcon = null;\\n  export let iconProps = {};\\n\\n  // Textarea options\\n  export let rows = 2;\\n\\n  // Toggle options\\n  export let labelClass = '';\\n  export let isBigToggle = false;\\n<\/script>\\n\\n{#if label || action}\\n  <div class=\\"flex flex-row justify-between items-end mb-2 md:mb-3\\">\\n    {#if label}\\n      <label\\n        for={id}\\n        class=\\"formcontrol-label text-sm md:text-base leading-none tracking-0.01 text-neutrals-l40 block\\"\\n        >{label}</label\\n      >\\n    {/if}\\n    {#if action}\\n      {#if actionLink}\\n        <a\\n          href={actionLink}\\n          tabindex={-1}\\n          class=\\"font-semibold text-xs leading-4 text-functional-r00 hover:text-functional-r20 transition-colors\\n            duration-200 block focus:outline-none\\"\\n        >\\n          {action}\\n        </a>\\n      {:else}\\n        <button\\n          type=\\"button\\"\\n          class=\\"font-semibold text-xs leading-4 text-functional-r00 hover:text-functional-r20 transition-colors\\n            duration-200 block focus:outline-none\\"\\n          on:click={() => dispatch('action')}\\n        >\\n          {action}\\n        </button>\\n      {/if}\\n    {:else if actionCustom}\\n      <slot name=\\"action\\" />\\n    {/if}\\n  </div>\\n{/if}\\n{#if type === 'select'}\\n  <span class=\\"select block text-neutrals-d30 {className}\\">\\n    <Select\\n      {items}\\n      {placeholder}\\n      {isClearable}\\n      {isCreatable}\\n      {isSearchable}\\n      {isMulti}\\n      {noOptionsMessage}\\n      {selectedValue}\\n      {listPlacement}\\n      {listAutoWidth}\\n      {loadOptions}\\n      {showIndicator}\\n      {Selection}\\n      isDisabled={disabled}\\n      inputAttributes={{ id, required, disabled }}\\n      on:select\\n      on:clear\\n    />\\n  </span>\\n{:else if type === 'textarea'}\\n  <!-- TODO: Make textarea use on:change too, for consistency. -->\\n  <textarea\\n    bind:this={el}\\n    {id}\\n    {placeholder}\\n    {disabled}\\n    {required}\\n    {maxlength}\\n    bind:value\\n    {rows}\\n    class=\\"textarea {className}\\"\\n    on:input\\n    on:keyup\\n    on:keydown\\n    on:paste\\n  />\\n{:else if type === 'checkbox'}\\n  <input\\n    bind:this={el}\\n    {id}\\n    type=\\"checkbox\\"\\n    {placeholder}\\n    {disabled}\\n    {required}\\n    bind:checked\\n    class=\\"w-6 h-6 text-transparent bg-transparent focus:ring-0 focus:ring-offset-0 border border-neutrals-l50 border-opacity-35 rounded cursor-pointer transition-colors duration-200 {className}\\"\\n    on:change\\n  />\\n{:else if type === 'toggle'}\\n  <label for={id} class=\\"toggle-label {labelClass}\\" class:isBigToggle>\\n    <input\\n      bind:this={el}\\n      {id}\\n      type=\\"checkbox\\"\\n      {placeholder}\\n      {disabled}\\n      {required}\\n      bind:checked\\n      class=\\"form-toggle cursor-pointer {className}\\"\\n      on:change\\n    />\\n    <div class=\\"slider\\" />\\n  </label>\\n{:else if type === 'custom'}\\n  <slot />\\n{:else}\\n  {#if leftIcon}\\n    <span class=\\"absolute left-0 top-1/2 transform -translate-y-1/2 ml-3\\">\\n      <svelte:component this={leftIcon} class=\\"w-4 h-4 text-neutrals-l30\\" {...iconProps} />\\n    </span>\\n  {/if}\\n  {#if isCurrencyInput}\\n    <span\\n      class=\\"currency-symbol absolute left-3 pointer-events-none text-base text-neutrals-l40 tracking-0.01 leading-none\\"\\n    >\\n      $\\n    </span>\\n  {/if}\\n  <!-- Compiler won't allow dynamic types... hackish bypass -->\\n  <input\\n    {...{ type }}\\n    bind:this={el}\\n    {id}\\n    {placeholder}\\n    {disabled}\\n    {required}\\n    {maxlength}\\n    {min}\\n    {max}\\n    {readonly}\\n    bind:value\\n    class=\\"input {className}\\"\\n    class:hasInlineText={inlineTextPadding !== null}\\n    class:isCurrencyInput\\n    class:pl-10={leftIcon}\\n    style={inlineTextPadding !== null ? \`--inline-text-padding: \${inlineTextPadding}px;\` : ''}\\n    on:input\\n    on:change\\n    on:keyup\\n    on:keydown\\n    on:blur\\n    on:paste\\n  />\\n  {#if inlineText}<span class=\\"inline-text text-sm text-neutrals-l40 absolute right-4\\"\\n      >{inlineText}</span\\n    >{/if}\\n{/if}\\n{#if help}\\n  <span class=\\"text-xs leading-4 text-neutrals-l30 block mt-2 md:mt-3\\">{@html help}</span>\\n{/if}\\n\\n<style>.select{--background:#181a1e;--border:1px solid #181a1e;--borderFocusColor:#be3434;--borderHoverColor:#181a1e;--borderRadius:0.5rem;--clearSelectColor:#8293a4;--clearSelectFocusColor:#8293a4;--clearSelectHoverColor:#8293a4;--clearSelectWidth:16px;--disabledBackground:transparent;--disabledBorderColor:rgba(121,134,148,0.15);--disabledColor:hsla(0,0%,100%,0.4);--disabledPlaceholderColor:rgba(121,134,148,0.6);--errorBorder:1px solid #db3a3a;--height:50px;--indicatorColor:#8293a4;--indicatorFill:#8293a4;--indicatorRight:16px;--inputColor:#fff;--inputFontSize:1rem;--inputLetterSpacing:0em;--itemActiveBackground:#1a1e23;--itemFirstBorderRadius:0.25rem;--itemHoverBG:#1a1e23;--itemIsActiveBG:#1a1e23;--itemColor:#fff;--listBackground:#21252a;--listBorderRadius:0.5rem;--listShadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);--multiClearBG:#0d0f10;--multiClearFill:#8293a4;--multiClearHoverBG:#0d0f10;--multiClearHoverFill:#8293a4;--multiClearRadius:0.25rem;--multiClearTop:9px;--multiItemActiveBG:#0d0f10;--multiItemActiveColor:#fff;--multiItemDisabledHoverBg:#0d0f10;--multiItemDisabledHoverColor:#fff;--multiItemBG:#0d0f10;--multiItemBorderRadius:0.25rem;--multiItemHeight:32px;--multiItemMargin:10px 10px 0 0;--multiLabelMargin:0 5px 0 0;--placeholderColor:rgba(121,134,148,0.6);color:#fff}@media (min-width:768px){.select{--inputFontSize:1rem;--height:60px;--multiItemMargin:14px 12px 0 0}}:global(.selectContainer.selectContainer.selectContainer){font-size:.875rem;line-height:1.25rem}@media (min-width:768px){:global(.selectContainer.selectContainer.selectContainer){font-size:1rem;line-height:1.5rem}}:global(.selectContainer.selectContainer.selectContainer){transition-duration:.15s;transition-duration:.2s;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}:global(.selectContainer input)::-moz-placeholder{font-size:.875rem;line-height:1.25rem;opacity:1}:global(.selectContainer input):-ms-input-placeholder{font-size:.875rem;line-height:1.25rem;opacity:1}:global(.selectContainer input)::placeholder{font-size:.875rem;line-height:1.25rem;opacity:1}@media (min-width:768px){:global(.selectContainer input)::-moz-placeholder{font-size:1rem;line-height:1.5rem}:global(.selectContainer input):-ms-input-placeholder{font-size:1rem;line-height:1.5rem}:global(.selectContainer input)::placeholder{font-size:1rem;line-height:1.5rem}}:global(.selectContainer .selectedItem){align-items:center;display:flex;overflow-y:hidden}.toggle-label{display:inline-block;flex-shrink:0;height:16px;position:relative;width:34px}.toggle-label input.form-toggle{display:none}.toggle-label input.form-toggle:checked+.slider{--tw-border-opacity:0;background-color:#be3434}.toggle-label input.form-toggle:checked+.slider:before{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity));transform:translate(20px,2px)}.toggle-label .slider{background-color:transparent;cursor:pointer;height:100%;left:0;position:absolute;top:0;transition-duration:.15s;transition-duration:.3s;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);width:100%}.toggle-label .slider:before{content:\\"\\";height:12px;transform:translate(2px,2px);transition-duration:.15s;transition-duration:.3s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);width:12px}.toggle-label.isBigToggle{height:24px;width:48px}.toggle-label.isBigToggle .slider{border-radius:1rem}.toggle-label.isBigToggle input.form-toggle:checked+.slider:before{transform:translate(26px,3px)}.toggle-label.isBigToggle .slider:before{height:18px;transform:translate(4px,3px);width:18px}input.hasInlineText{padding-right:var(--inline-text-padding)}.inline-text{bottom:13.5px}@media (min-width:768px){.inline-text{bottom:18px}}input.isCurrencyInput{--defaultPadding:0.75rem;--currencyPadding:13px;padding-left:calc(var(--defaultPadding) + var(--currencyPadding))}@media (min-width:768px){input.isCurrencyInput{--defaultPadding:1rem;--currencyPadding:9px}}.currency-symbol{bottom:15px}@media (min-width:768px){.currency-symbol{bottom:16px}}</style>\\n"],"names":[],"mappings":"AAwNO,iDAAO,CAAC,aAAa,OAAO,CAAC,SAAS,iBAAiB,CAAC,mBAAmB,OAAO,CAAC,mBAAmB,OAAO,CAAC,eAAe,MAAM,CAAC,mBAAmB,OAAO,CAAC,wBAAwB,OAAO,CAAC,wBAAwB,OAAO,CAAC,mBAAmB,IAAI,CAAC,qBAAqB,WAAW,CAAC,sBAAsB,sBAAsB,CAAC,gBAAgB,mBAAmB,CAAC,2BAA2B,qBAAqB,CAAC,cAAc,iBAAiB,CAAC,SAAS,IAAI,CAAC,iBAAiB,OAAO,CAAC,gBAAgB,OAAO,CAAC,iBAAiB,IAAI,CAAC,aAAa,IAAI,CAAC,gBAAgB,IAAI,CAAC,qBAAqB,GAAG,CAAC,uBAAuB,OAAO,CAAC,wBAAwB,OAAO,CAAC,cAAc,OAAO,CAAC,iBAAiB,OAAO,CAAC,YAAY,IAAI,CAAC,iBAAiB,OAAO,CAAC,mBAAmB,MAAM,CAAC,aAAa,8DAA8D,CAAC,eAAe,OAAO,CAAC,iBAAiB,OAAO,CAAC,oBAAoB,OAAO,CAAC,sBAAsB,OAAO,CAAC,mBAAmB,OAAO,CAAC,gBAAgB,GAAG,CAAC,oBAAoB,OAAO,CAAC,uBAAuB,IAAI,CAAC,2BAA2B,OAAO,CAAC,8BAA8B,IAAI,CAAC,cAAc,OAAO,CAAC,wBAAwB,OAAO,CAAC,kBAAkB,IAAI,CAAC,kBAAkB,aAAa,CAAC,mBAAmB,SAAS,CAAC,mBAAmB,qBAAqB,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,iDAAO,CAAC,gBAAgB,IAAI,CAAC,SAAS,IAAI,CAAC,kBAAkB,aAAa,CAAC,CAAC,AAAQ,gDAAgD,AAAC,CAAC,UAAU,OAAO,CAAC,YAAY,OAAO,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,AAAQ,gDAAgD,AAAC,CAAC,UAAU,IAAI,CAAC,YAAY,MAAM,CAAC,CAAC,AAAQ,gDAAgD,AAAC,CAAC,oBAAoB,IAAI,CAAC,oBAAoB,GAAG,CAAC,oBAAoB,gBAAgB,CAAC,YAAY,CAAC,KAAK,CAAC,IAAI,CAAC,MAAM,CAAC,2BAA2B,aAAa,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,0CAAQ,sBAAsB,AAAC,kBAAkB,CAAC,UAAU,OAAO,CAAC,YAAY,OAAO,CAAC,QAAQ,CAAC,CAAC,0CAAQ,sBAAsB,AAAC,sBAAsB,CAAC,UAAU,OAAO,CAAC,YAAY,OAAO,CAAC,QAAQ,CAAC,CAAC,0CAAQ,sBAAsB,AAAC,aAAa,CAAC,UAAU,OAAO,CAAC,YAAY,OAAO,CAAC,QAAQ,CAAC,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,0CAAQ,sBAAsB,AAAC,kBAAkB,CAAC,UAAU,IAAI,CAAC,YAAY,MAAM,CAAC,0CAAQ,sBAAsB,AAAC,sBAAsB,CAAC,UAAU,IAAI,CAAC,YAAY,MAAM,CAAC,0CAAQ,sBAAsB,AAAC,aAAa,CAAC,UAAU,IAAI,CAAC,YAAY,MAAM,CAAC,CAAC,AAAQ,8BAA8B,AAAC,CAAC,YAAY,MAAM,CAAC,QAAQ,IAAI,CAAC,WAAW,MAAM,CAAC,uDAAa,CAAC,QAAQ,YAAY,CAAC,YAAY,CAAC,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,2BAAa,CAAC,KAAK,wCAAY,CAAC,QAAQ,IAAI,CAAC,2BAAa,CAAC,KAAK,0BAAY,QAAQ,CAAC,qBAAO,CAAC,oBAAoB,CAAC,CAAC,iBAAiB,OAAO,CAAC,2BAAa,CAAC,KAAK,0BAAY,QAAQ,CAAC,qBAAO,OAAO,CAAC,gBAAgB,CAAC,CAAC,iBAAiB,KAAK,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,eAAe,CAAC,CAAC,CAAC,UAAU,UAAU,IAAI,CAAC,GAAG,CAAC,CAAC,2BAAa,CAAC,mCAAO,CAAC,iBAAiB,WAAW,CAAC,OAAO,OAAO,CAAC,OAAO,IAAI,CAAC,KAAK,CAAC,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,oBAAoB,IAAI,CAAC,oBAAoB,GAAG,CAAC,oBAAoB,gBAAgB,CAAC,YAAY,CAAC,KAAK,CAAC,IAAI,CAAC,MAAM,CAAC,2BAA2B,aAAa,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,2BAAa,CAAC,mCAAO,OAAO,CAAC,QAAQ,EAAE,CAAC,OAAO,IAAI,CAAC,UAAU,UAAU,GAAG,CAAC,GAAG,CAAC,CAAC,oBAAoB,IAAI,CAAC,oBAAoB,GAAG,CAAC,oBAAoB,GAAG,CAAC,2BAA2B,aAAa,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,aAAa,sDAAY,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,aAAa,0BAAY,CAAC,mCAAO,CAAC,cAAc,IAAI,CAAC,aAAa,0BAAY,CAAC,KAAK,0BAAY,QAAQ,CAAC,qBAAO,OAAO,CAAC,UAAU,UAAU,IAAI,CAAC,GAAG,CAAC,CAAC,aAAa,0BAAY,CAAC,mCAAO,OAAO,CAAC,OAAO,IAAI,CAAC,UAAU,UAAU,GAAG,CAAC,GAAG,CAAC,CAAC,MAAM,IAAI,CAAC,KAAK,wDAAc,CAAC,cAAc,IAAI,qBAAqB,CAAC,CAAC,sDAAY,CAAC,OAAO,MAAM,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,sDAAY,CAAC,OAAO,IAAI,CAAC,CAAC,KAAK,0DAAgB,CAAC,iBAAiB,OAAO,CAAC,kBAAkB,IAAI,CAAC,aAAa,KAAK,IAAI,gBAAgB,CAAC,CAAC,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,KAAK,0DAAgB,CAAC,iBAAiB,IAAI,CAAC,kBAAkB,GAAG,CAAC,CAAC,0DAAgB,CAAC,OAAO,IAAI,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,0DAAgB,CAAC,OAAO,IAAI,CAAC,CAAC"}`
};
var FormControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { id = `a${uuidv4()}` } = $$props;
  let { label = null } = $$props;
  let { type = "text" } = $$props;
  let { placeholder = "" } = $$props;
  let { help = null } = $$props;
  let { disabled = false } = $$props;
  let { required = false } = $$props;
  let { action = null } = $$props;
  let { actionLink = false } = $$props;
  let { actionCustom = false } = $$props;
  let { value = null } = $$props;
  let { checked = null } = $$props;
  let { class: className = "" } = $$props;
  let el;
  function focus(moveCursorToEnd = false) {
    el.focus();
    if (moveCursorToEnd) {
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }
  let { maxlength = void 0 } = $$props;
  let { max = void 0 } = $$props;
  let { min = void 0 } = $$props;
  let { readonly = false } = $$props;
  let { inlineText = null } = $$props;
  let { inlineTextPadding = null } = $$props;
  let { isCurrencyInput = false } = $$props;
  let { items = [] } = $$props;
  let { isMulti = false } = $$props;
  let { isClearable = true } = $$props;
  let { isCreatable = false } = $$props;
  let { isSearchable = true } = $$props;
  let { selectedValue = null } = $$props;
  let { noOptionsMessage = "No items found." } = $$props;
  let { listPlacement = "auto" } = $$props;
  let { listAutoWidth = true } = $$props;
  let { loadOptions = void 0 } = $$props;
  let { showIndicator = false } = $$props;
  let { Selection: Selection$1 = Selection } = $$props;
  let { leftIcon = null } = $$props;
  let { iconProps = {} } = $$props;
  let { rows = 2 } = $$props;
  let { labelClass = "" } = $$props;
  let { isBigToggle = false } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.help === void 0 && $$bindings.help && help !== void 0)
    $$bindings.help(help);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.actionLink === void 0 && $$bindings.actionLink && actionLink !== void 0)
    $$bindings.actionLink(actionLink);
  if ($$props.actionCustom === void 0 && $$bindings.actionCustom && actionCustom !== void 0)
    $$bindings.actionCustom(actionCustom);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.maxlength === void 0 && $$bindings.maxlength && maxlength !== void 0)
    $$bindings.maxlength(maxlength);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0)
    $$bindings.readonly(readonly);
  if ($$props.inlineText === void 0 && $$bindings.inlineText && inlineText !== void 0)
    $$bindings.inlineText(inlineText);
  if ($$props.inlineTextPadding === void 0 && $$bindings.inlineTextPadding && inlineTextPadding !== void 0)
    $$bindings.inlineTextPadding(inlineTextPadding);
  if ($$props.isCurrencyInput === void 0 && $$bindings.isCurrencyInput && isCurrencyInput !== void 0)
    $$bindings.isCurrencyInput(isCurrencyInput);
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.isMulti === void 0 && $$bindings.isMulti && isMulti !== void 0)
    $$bindings.isMulti(isMulti);
  if ($$props.isClearable === void 0 && $$bindings.isClearable && isClearable !== void 0)
    $$bindings.isClearable(isClearable);
  if ($$props.isCreatable === void 0 && $$bindings.isCreatable && isCreatable !== void 0)
    $$bindings.isCreatable(isCreatable);
  if ($$props.isSearchable === void 0 && $$bindings.isSearchable && isSearchable !== void 0)
    $$bindings.isSearchable(isSearchable);
  if ($$props.selectedValue === void 0 && $$bindings.selectedValue && selectedValue !== void 0)
    $$bindings.selectedValue(selectedValue);
  if ($$props.noOptionsMessage === void 0 && $$bindings.noOptionsMessage && noOptionsMessage !== void 0)
    $$bindings.noOptionsMessage(noOptionsMessage);
  if ($$props.listPlacement === void 0 && $$bindings.listPlacement && listPlacement !== void 0)
    $$bindings.listPlacement(listPlacement);
  if ($$props.listAutoWidth === void 0 && $$bindings.listAutoWidth && listAutoWidth !== void 0)
    $$bindings.listAutoWidth(listAutoWidth);
  if ($$props.loadOptions === void 0 && $$bindings.loadOptions && loadOptions !== void 0)
    $$bindings.loadOptions(loadOptions);
  if ($$props.showIndicator === void 0 && $$bindings.showIndicator && showIndicator !== void 0)
    $$bindings.showIndicator(showIndicator);
  if ($$props.Selection === void 0 && $$bindings.Selection && Selection$1 !== void 0)
    $$bindings.Selection(Selection$1);
  if ($$props.leftIcon === void 0 && $$bindings.leftIcon && leftIcon !== void 0)
    $$bindings.leftIcon(leftIcon);
  if ($$props.iconProps === void 0 && $$bindings.iconProps && iconProps !== void 0)
    $$bindings.iconProps(iconProps);
  if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0)
    $$bindings.rows(rows);
  if ($$props.labelClass === void 0 && $$bindings.labelClass && labelClass !== void 0)
    $$bindings.labelClass(labelClass);
  if ($$props.isBigToggle === void 0 && $$bindings.isBigToggle && isBigToggle !== void 0)
    $$bindings.isBigToggle(isBigToggle);
  $$result.css.add(css$e);
  return `${label || action ? `<div class="${"flex flex-row justify-between items-end mb-2 md:mb-3 svelte-jhuanl"}">${label ? `<label${add_attribute("for", id, 0)} class="${"formcontrol-label text-sm md:text-base leading-none tracking-0.01 text-neutrals-l40 block svelte-jhuanl"}">${escape2(label)}</label>` : ``}
    ${action ? `${actionLink ? `<a${add_attribute("href", actionLink, 0)}${add_attribute("tabindex", -1, 0)} class="${"font-semibold text-xs leading-4 text-functional-r00 hover:text-functional-r20 transition-colors\n            duration-200 block focus:outline-none svelte-jhuanl"}">${escape2(action)}</a>` : `<button type="${"button"}" class="${"font-semibold text-xs leading-4 text-functional-r00 hover:text-functional-r20 transition-colors\n            duration-200 block focus:outline-none svelte-jhuanl"}">${escape2(action)}</button>`}` : `${actionCustom ? `${slots.action ? slots.action({}) : ``}` : ``}`}</div>` : ``}
${type === "select" ? `<span class="${"select block text-neutrals-d30 " + escape2(className) + " svelte-jhuanl"}">${validate_component(Select, "Select").$$render($$result, {
    items,
    placeholder,
    isClearable,
    isCreatable,
    isSearchable,
    isMulti,
    noOptionsMessage,
    selectedValue,
    listPlacement,
    listAutoWidth,
    loadOptions,
    showIndicator,
    Selection: Selection$1,
    isDisabled: disabled,
    inputAttributes: { id, required, disabled }
  }, {}, {})}</span>` : `${type === "textarea" ? `
  <textarea${add_attribute("id", id, 0)}${add_attribute("placeholder", placeholder, 0)} ${disabled ? "disabled" : ""} ${required ? "required" : ""}${add_attribute("maxlength", maxlength, 0)}${add_attribute("rows", rows, 0)} class="${"textarea " + escape2(className) + " svelte-jhuanl"}"${add_attribute("this", el, 1)}>${value || ""}</textarea>` : `${type === "checkbox" ? `<input${add_attribute("id", id, 0)} type="${"checkbox"}"${add_attribute("placeholder", placeholder, 0)} ${disabled ? "disabled" : ""} ${required ? "required" : ""} class="${"w-6 h-6 text-transparent bg-transparent focus:ring-0 focus:ring-offset-0 border border-neutrals-l50 border-opacity-35 rounded cursor-pointer transition-colors duration-200 " + escape2(className) + " svelte-jhuanl"}"${add_attribute("this", el, 1)}${add_attribute("checked", checked, 1)}>` : `${type === "toggle" ? `<label${add_attribute("for", id, 0)} class="${[
    "toggle-label " + escape2(labelClass) + " svelte-jhuanl",
    isBigToggle ? "isBigToggle" : ""
  ].join(" ").trim()}"><input${add_attribute("id", id, 0)} type="${"checkbox"}"${add_attribute("placeholder", placeholder, 0)} ${disabled ? "disabled" : ""} ${required ? "required" : ""} class="${"form-toggle cursor-pointer " + escape2(className) + " svelte-jhuanl"}"${add_attribute("this", el, 1)}${add_attribute("checked", checked, 1)}>
    <div class="${"slider svelte-jhuanl"}"></div></label>` : `${type === "custom" ? `${slots.default ? slots.default({}) : ``}` : `${leftIcon ? `<span class="${"absolute left-0 top-1/2 transform -translate-y-1/2 ml-3 svelte-jhuanl"}">${validate_component(leftIcon || missing_component, "svelte:component").$$render($$result, Object.assign({ class: "w-4 h-4 text-neutrals-l30" }, iconProps), {}, {})}</span>` : ``}
  ${isCurrencyInput ? `<span class="${"currency-symbol absolute left-3 pointer-events-none text-base text-neutrals-l40 tracking-0.01 leading-none svelte-jhuanl"}">$
    </span>` : ``}
  
  <input${spread([
    { type },
    { id: escape2(id) },
    { placeholder: escape2(placeholder) },
    { disabled: disabled || null },
    { required: required || null },
    { maxlength: escape2(maxlength) },
    { min: escape2(min) },
    { max: escape2(max) },
    { readonly: readonly || null },
    { class: "input " + escape2(className) },
    {
      style: escape2(inlineTextPadding !== null ? `--inline-text-padding: ${inlineTextPadding}px;` : "")
    }
  ], (inlineTextPadding !== null ? "hasInlineText" : "") + " " + (isCurrencyInput ? "isCurrencyInput" : "") + " " + (leftIcon ? "pl-10" : "") + " svelte-jhuanl")}${add_attribute("this", el, 1)}${add_attribute("value", value, 1)}>
  ${inlineText ? `<span class="${"inline-text text-sm text-neutrals-l40 absolute right-4 svelte-jhuanl"}">${escape2(inlineText)}</span>` : ``}`}`}`}`}`}
${help ? `<span class="${"text-xs leading-4 text-neutrals-l30 block mt-2 md:mt-3 svelte-jhuanl"}">${help}</span>` : ``}`;
});
var observer$1;
var PaginationSentinel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const dispatch = createEventDispatcher();
  let { disabled = false } = $$props;
  let el = null;
  function onHit(event) {
    dispatch("hit", event);
  }
  onMount(() => {
    observer$1.observe(el);
    el.addEventListener("visible", onHit);
    return () => {
      observer$1.unobserve(el);
      el.removeEventListener("visible", onHit);
    };
  });
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  return `<div class="${["h-1 w-full", disabled ? "hidden" : ""].join(" ").trim()}"${add_attribute("this", el, 1)}></div>`;
});
var Close_browse_games = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "36" },
    { height: "36" },
    { viewBox: "0 0 36 36" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><circle cx="${"18"}" cy="${"18"}" r="${"16.8"}" stroke="${"#798694"}" stroke-opacity="${"0.24"}" stroke-width="${"1.6"}"></circle><path d="${"M14 14L23.051 23.051"}" stroke="${"white"}" stroke-width="${"1.4"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><path d="${"M23.0508 14L13.9998 23.051"}" stroke="${"white"}" stroke-width="${"1.4"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path></svg>`;
});
var Search_browse_games = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "16" },
    { height: "17" },
    { viewBox: "0 0 16 17" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7ZM0 7C0 10.866 3.13401 14 7 14C8.31399 14 9.54341 13.638 10.594 13.0082L14.2929 16.7071C14.6834 17.0976 15.3166 17.0976 15.7071 16.7071C16.0976 16.3166 16.0976 15.6834 15.7071 15.2929L12.1525 11.7383C13.2996 10.4917 14 8.82763 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7Z"}" fill="${"#F14343"}"></path></svg>`;
});
var css$d = {
  code: ".game.svelte-gj0l70:hover{background:linear-gradient(46.33deg,rgba(190,52,52,0) 3.72%,#be3434 51.18%,rgba(190,52,52,0) 98.74%)}.scroll-overlay.svelte-gj0l70{background:linear-gradient(180deg,#030404 9.2%,rgba(3,4,4,.64) 35.48%,rgba(3,4,4,0) 54.12%)}",
  map: `{"version":3,"file":"BrowseGamesModal.svelte","sources":["BrowseGamesModal.svelte"],"sourcesContent":["<script context=\\"module\\">\\n  import { writable } from 'svelte/store';\\n\\n  let isVisible = writable(false);\\n\\n  export function open() {\\n    isVisible.set(true);\\n  }\\n<\/script>\\n\\n<script>\\n  import { onMount } from 'svelte';\\n  import { searchIndex } from '@metafy/lib/utils';\\n\\n  import Modal from '@metafy/components/Modal.svelte';\\n  import Image from '@metafy/components/Image.svelte';\\n  import GamePoster from '@metafy/components/GamePoster.svelte';\\n  import FormControl from '@metafy/components/FormControl.svelte';\\n  import PaginationSentinel from '@metafy/components/PaginationSentinel.svelte';\\n\\n  import IconClose from '@metafy/assets/svgs/close_browse_games.svg';\\n  import IconSearch from '@metafy/assets/svgs/search_browse_games.svg';\\n\\n  let query = '';\\n  let games = [];\\n  let hasNextPage = false;\\n  let showScrollOverlay = false;\\n  let scrollOverlayWidth;\\n  let focus;\\n\\n  async function loadNextPage({ detail: { detail } }) {\\n    if (detail && hasNextPage) {\\n      const results = await doSearch({ offset: games.length, limit: 20 });\\n      games = [...games, ...results?.hits];\\n      hasNextPage = games.length < results?.nbHits;\\n    }\\n  }\\n\\n  async function doSearch(options = {}) {\\n    return await searchIndex('games', query, { filters: 'coach_count >= 1', ...options });\\n  }\\n\\n  onMount(async () => {\\n    const results = await doSearch({ limit: 20 });\\n    games = [...results?.hits];\\n    hasNextPage = results?.nbHits > 20;\\n  });\\n<\/script>\\n\\n<Modal\\n  bind:isVisible={$isVisible}\\n  closeButton={false}\\n  closeOnClickOutside={false}\\n  class=\\"\\"\\n  widthClass=\\"container h-full\\"\\n  backgroundClass=\\"bg-neutrals-d30\\"\\n  limitHeight={false}\\n  overflow=\\"overflow-hidden\\"\\n  on:afterVisible={focus}\\n>\\n  <div class=\\"h-full max-w-7xl flex flex-col mx-auto pt-6 md:pt-8 xl:pt-12 pb-3\\">\\n    <div class=\\"flex items-center mb-4 md:mb-6 xl:mb-10\\">\\n      <h2 class=\\"font-medium text-xl md:text-1.5xl xl:text-3.25xl text-neutrals-l00 leading-none\\">\\n        Browse games\\n      </h2>\\n      <button class=\\"w-8 h-8 xl:w-10 xl:h-10 ml-auto\\" on:click={() => ($isVisible = false)}>\\n        <svelte:component this={IconClose} class=\\"w-full h-full\\" />\\n      </button>\\n    </div>\\n\\n    <div class=\\"relative mb-6 md:mb-8 xl:mb-10\\">\\n      <div\\n        class=\\"absolute left-0 inset-y-0 w-14 flex items-center justify-center pointer-events-none\\"\\n      >\\n        <svelte:component this={IconSearch} />\\n      </div>\\n      <FormControl\\n        type=\\"text\\"\\n        placeholder=\\"What\u2019s your game?\\"\\n        class=\\"h-12 text-sm pl-14 md:h-16 md:text-xl\\"\\n        on:input={async (event) => {\\n          query = event.target.value;\\n          hasNextPage = false;\\n          const results = await doSearch({ limit: 20 });\\n          games = [...results.hits];\\n          hasNextPage = results.nbHits > 20;\\n        }}\\n        bind:focus\\n      />\\n    </div>\\n    <div\\n      class=\\"grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-4 md:gap-y-6 relative overflow-y-auto\\"\\n      bind:clientWidth={scrollOverlayWidth}\\n      on:scroll={(event) => (showScrollOverlay = event.target.scrollTop > 0)}\\n    >\\n      <div\\n        class=\\"scroll-overlay fixed z-1 w-full h-[106px] xl:h-[146px] -mt-px pointer-events-none transition-opacity duration-300 ease-linear {showScrollOverlay\\n          ? 'opacity-100'\\n          : 'opacity-0'}\\"\\n        style=\\"width: {scrollOverlayWidth}px\\"\\n      />\\n      {#each games as game (game.id)}\\n        <a\\n          class=\\"game p-px w-full bg-neutrals-d10 bg-opacity-80 rounded-3xl text-center mx-auto\\"\\n          href=\\"/{game.slug}\\"\\n          on:click={() => ($isVisible = false)}\\n        >\\n          <div class=\\"flex flex-col h-full bg-neutrals-d10 rounded-3xl p-4 pb-3 space-y-3\\">\\n            <div class=\\"relative overflow-hidden w-full pt-[135%] rounded-lg bg-neutrals-d30\\">\\n              <GamePoster\\n                {game}\\n                class=\\"absolute top-0 left-0\\"\\n                size=\\"w-full h-full\\"\\n                square={false}\\n                link={false}\\n              />\\n            </div>\\n            <div class=\\"flex-1 flex items-center justify-center text-center\\">\\n              <h2 class=\\"text-white -tracking-0.01 line-clamp-2\\">\\n                {game.title.en}\\n              </h2>\\n            </div>\\n          </div>\\n        </a>\\n      {/each}\\n      <PaginationSentinel on:hit={loadNextPage} />\\n    </div>\\n  </div>\\n</Modal>\\n\\n<style>.game:hover{background:linear-gradient(46.33deg,rgba(190,52,52,0) 3.72%,#be3434 51.18%,rgba(190,52,52,0) 98.74%)}.scroll-overlay{background:linear-gradient(180deg,#030404 9.2%,rgba(3,4,4,.64) 35.48%,rgba(3,4,4,0) 54.12%)}</style>\\n"],"names":[],"mappings":"AAkIO,mBAAK,MAAM,CAAC,WAAW,gBAAgB,QAAQ,CAAC,KAAK,GAAG,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,KAAK,GAAG,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,6BAAe,CAAC,WAAW,gBAAgB,MAAM,CAAC,OAAO,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC"}`
};
var isVisible = writable2(false);
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isVisible, $$unsubscribe_isVisible;
  $$unsubscribe_isVisible = subscribe(isVisible, (value) => $isVisible = value);
  let query = "";
  let games = [];
  let scrollOverlayWidth;
  let focus;
  async function doSearch(options2 = {}) {
    return await searchIndex("games", query, { filters: "coach_count >= 1", ...options2 });
  }
  onMount(async () => {
    const results = await doSearch({ limit: 20 });
    games = [...results == null ? void 0 : results.hits];
    (results == null ? void 0 : results.nbHits) > 20;
  });
  $$result.css.add(css$d);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Modal, "Modal").$$render($$result, {
      closeButton: false,
      closeOnClickOutside: false,
      class: "",
      widthClass: "container h-full",
      backgroundClass: "bg-neutrals-d30",
      limitHeight: false,
      overflow: "overflow-hidden",
      isVisible: $isVisible
    }, {
      isVisible: ($$value) => {
        $isVisible = $$value;
        $$settled = false;
      }
    }, {
      default: () => `<div class="${"h-full max-w-7xl flex flex-col mx-auto pt-6 md:pt-8 xl:pt-12 pb-3"}"><div class="${"flex items-center mb-4 md:mb-6 xl:mb-10"}"><h2 class="${"font-medium text-xl md:text-1.5xl xl:text-3.25xl text-neutrals-l00 leading-none"}">Browse games
      </h2>
      <button class="${"w-8 h-8 xl:w-10 xl:h-10 ml-auto"}">${validate_component(Close_browse_games || missing_component, "svelte:component").$$render($$result, { class: "w-full h-full" }, {}, {})}</button></div>

    <div class="${"relative mb-6 md:mb-8 xl:mb-10"}"><div class="${"absolute left-0 inset-y-0 w-14 flex items-center justify-center pointer-events-none"}">${validate_component(Search_browse_games || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div>
      ${validate_component(FormControl, "FormControl").$$render($$result, {
        type: "text",
        placeholder: "What\u2019s your game?",
        class: "h-12 text-sm pl-14 md:h-16 md:text-xl",
        focus
      }, {
        focus: ($$value) => {
          focus = $$value;
          $$settled = false;
        }
      }, {})}</div>
    <div class="${"grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-4 md:gap-y-6 relative overflow-y-auto"}"><div class="${"scroll-overlay fixed z-1 w-full h-[106px] xl:h-[146px] -mt-px pointer-events-none transition-opacity duration-300 ease-linear " + escape2("opacity-0") + " svelte-gj0l70"}" style="${"width: " + escape2(scrollOverlayWidth) + "px"}"></div>
      ${each(games, (game) => `<a class="${"game p-px w-full bg-neutrals-d10 bg-opacity-80 rounded-3xl text-center mx-auto svelte-gj0l70"}" href="${"/" + escape2(game.slug)}"><div class="${"flex flex-col h-full bg-neutrals-d10 rounded-3xl p-4 pb-3 space-y-3"}"><div class="${"relative overflow-hidden w-full pt-[135%] rounded-lg bg-neutrals-d30"}">${validate_component(GamePoster, "GamePoster").$$render($$result, {
        game,
        class: "absolute top-0 left-0",
        size: "w-full h-full",
        square: false,
        link: false
      }, {}, {})}</div>
            <div class="${"flex-1 flex items-center justify-center text-center"}"><h2 class="${"text-white -tracking-0.01 line-clamp-2"}">${escape2(game.title.en)}</h2>
            </div></div>
        </a>`)}
      ${validate_component(PaginationSentinel, "PaginationSentinel").$$render($$result, {}, {}, {})}</div></div>`
    })}`;
  } while (!$$settled);
  $$unsubscribe_isVisible();
  return $$rendered;
});
var css$c = {
  code: "button.svelte-xomk01.svelte-xomk01{height:48px;width:64px}@media(min-width:1280px){button.svelte-xomk01.svelte-xomk01{transition-duration:.3s;transition-timing-function:cubic-bezier(.4,0,.2,1)}}@media(min-width:768px){button.svelte-xomk01.svelte-xomk01{width:129px}}@media(min-width:1280px){button.svelte-xomk01.svelte-xomk01{height:auto;transition-property:width,border-color;width:163px}button.svelte-xomk01.svelte-xomk01:hover{width:200px}}button.compact.svelte-xomk01.svelte-xomk01{height:32px}button.compact.svelte-xomk01 .icon.svelte-xomk01{height:24px;width:24px}@media(min-width:1280px){button.compact.svelte-xomk01 .icon.svelte-xomk01{height:32px;margin-right:0;width:32px}button.compact.svelte-xomk01 span.text.svelte-xomk01{margin-left:.75rem}button.compact.svelte-xomk01.svelte-xomk01{height:42px;width:40px}button.expanded.svelte-xomk01 span.text.svelte-xomk01{margin-right:auto}button.expanded.svelte-xomk01.svelte-xomk01{width:100%}button.expanded.svelte-xomk01 .icon.overwatch.svelte-xomk01{right:153px}button.expanded.svelte-xomk01 .icon.browse.svelte-xomk01{margin-left:49px}}@media(min-width:1536px){button.isLoggedIn.svelte-xomk01 .icon.overwatch.svelte-xomk01{left:22px;right:0}}.icon.svelte-xomk01.svelte-xomk01{border-color:#181a1e;border-radius:.375rem;border-style:solid;border-width:3px;box-sizing:content-box;flex-shrink:0;height:32px;width:32px}.icon.league.svelte-xomk01.svelte-xomk01{background-color:#1173c6;z-index:0}.icon.overwatch.svelte-xomk01.svelte-xomk01{background-color:#313a44;right:16px;z-index:1}@media(min-width:768px){.icon.overwatch.svelte-xomk01.svelte-xomk01{right:83px}}@media(min-width:1280px){.icon.overwatch.svelte-xomk01.svelte-xomk01{right:140px}}.icon.browse.svelte-xomk01.svelte-xomk01{z-index:2}.icon.browse.svelte-xomk01 svg{height:10px;width:15px}@media(min-width:1280px){.icon.browse.svelte-xomk01 svg{height:13px;width:21px}}button.isMobile.svelte-xomk01.svelte-xomk01{border-style:none;width:100%}button.isMobile.svelte-xomk01 .icon.league.svelte-xomk01{left:-3px}button.isMobile.svelte-xomk01 .icon.overwatch.svelte-xomk01{left:17px}button.isMobile.svelte-xomk01 .icon.browse.svelte-xomk01{left:37px;margin:0}button.isMobile.svelte-xomk01 .text.svelte-xomk01{display:inline;left:85px;position:absolute}button.isMobile.svelte-xomk01 .text span.svelte-xomk01{display:inline}",
  map: `{"version":3,"file":"BrowseGamesButton.svelte","sources":["BrowseGamesButton.svelte"],"sourcesContent":["<script>\\n  import IconBrowseGames from '@metafy/assets/svgs/home/browse_games.svg';\\n  import IconLeague from '@metafy/assets/svgs/home/league.svg';\\n  import IconOverwatch from '@metafy/assets/svgs/home/overwatch.svg';\\n  import { open } from '@metafy/components/BrowseGamesModal.svelte';\\n\\n  export let compact = false;\\n  export let expanded = false;\\n  export let isLoggedIn = false;\\n  export let isMobile = false;\\n<\/script>\\n\\n<button\\n  class=\\"flex items-center relative overflow-hidden text-neutrals-l00 font-medium text-sm leading-none bg-neutrals-d10 border border-neutrals-l50 border-opacity-35 hover:border-opacity-50 rounded-md md:pr-3\\"\\n  class:compact\\n  class:expanded\\n  class:isLoggedIn\\n  class:isMobile\\n  on:click={open}\\n>\\n  <div class=\\"icon league absolute left-0 flex\\">\\n    <svelte:component this={IconLeague} class=\\"m-auto\\" />\\n  </div>\\n  <div class=\\"icon overwatch absolute flex\\">\\n    <svelte:component this={IconOverwatch} class=\\"m-auto\\" />\\n  </div>\\n  <div class=\\"icon browse flex relative text-white bg-functional-r20 ml-auto md:mr-3\\">\\n    <svelte:component this={IconBrowseGames} class=\\"m-auto\\" />\\n  </div>\\n  <span class=\\"text whitespace-nowrap hidden md:inline\\" class:xl:hidden={compact && !expanded}\\n    ><span class=\\"hidden xl:inline\\">Browse</span>\\n    Games</span\\n  >\\n</button>\\n\\n<style>button{height:48px;width:64px}@media (min-width:1280px){button{transition-duration:.3s;transition-timing-function:cubic-bezier(.4,0,.2,1)}}@media (min-width:768px){button{width:129px}}@media (min-width:1280px){button{height:auto;transition-property:width,border-color;width:163px}button:hover{width:200px}}button.compact{height:32px}button.compact .icon{height:24px;width:24px}@media (min-width:1280px){button.compact .icon{height:32px;margin-right:0;width:32px}button.compact span.text{margin-left:.75rem}button.compact{height:42px;width:40px}button.expanded span.text{margin-right:auto}button.expanded{width:100%}button.expanded .icon.overwatch{right:153px}button.expanded .icon.browse{margin-left:49px}}@media (min-width:1536px){button.isLoggedIn .icon.overwatch{left:22px;right:0}}.icon{border-color:#181a1e;border-radius:.375rem;border-style:solid;border-width:3px;box-sizing:content-box;flex-shrink:0;height:32px;width:32px}.icon.league{background-color:#1173c6;z-index:0}.icon.overwatch{background-color:#313a44;right:16px;z-index:1}@media (min-width:768px){.icon.overwatch{right:83px}}@media (min-width:1280px){.icon.overwatch{right:140px}}.icon.browse{z-index:2}.icon.browse :global(svg){height:10px;width:15px}@media (min-width:1280px){.icon.browse :global(svg){height:13px;width:21px}}button.isMobile{border-style:none;width:100%}button.isMobile .icon.league{left:-3px}button.isMobile .icon.overwatch{left:17px}button.isMobile .icon.browse{left:37px;margin:0}button.isMobile .text{display:inline;left:85px;position:absolute}button.isMobile .text span{display:inline}</style>\\n"],"names":[],"mappings":"AAmCO,kCAAM,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,kCAAM,CAAC,oBAAoB,GAAG,CAAC,2BAA2B,aAAa,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,kCAAM,CAAC,MAAM,KAAK,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,kCAAM,CAAC,OAAO,IAAI,CAAC,oBAAoB,KAAK,CAAC,YAAY,CAAC,MAAM,KAAK,CAAC,kCAAM,MAAM,CAAC,MAAM,KAAK,CAAC,CAAC,MAAM,oCAAQ,CAAC,OAAO,IAAI,CAAC,MAAM,sBAAQ,CAAC,mBAAK,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,MAAM,sBAAQ,CAAC,mBAAK,CAAC,OAAO,IAAI,CAAC,aAAa,CAAC,CAAC,MAAM,IAAI,CAAC,MAAM,sBAAQ,CAAC,IAAI,mBAAK,CAAC,YAAY,MAAM,CAAC,MAAM,oCAAQ,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,uBAAS,CAAC,IAAI,mBAAK,CAAC,aAAa,IAAI,CAAC,MAAM,qCAAS,CAAC,MAAM,IAAI,CAAC,MAAM,uBAAS,CAAC,KAAK,wBAAU,CAAC,MAAM,KAAK,CAAC,MAAM,uBAAS,CAAC,KAAK,qBAAO,CAAC,YAAY,IAAI,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,MAAM,yBAAW,CAAC,KAAK,wBAAU,CAAC,KAAK,IAAI,CAAC,MAAM,CAAC,CAAC,CAAC,iCAAK,CAAC,aAAa,OAAO,CAAC,cAAc,OAAO,CAAC,aAAa,KAAK,CAAC,aAAa,GAAG,CAAC,WAAW,WAAW,CAAC,YAAY,CAAC,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,KAAK,mCAAO,CAAC,iBAAiB,OAAO,CAAC,QAAQ,CAAC,CAAC,KAAK,sCAAU,CAAC,iBAAiB,OAAO,CAAC,MAAM,IAAI,CAAC,QAAQ,CAAC,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,KAAK,sCAAU,CAAC,MAAM,IAAI,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,KAAK,sCAAU,CAAC,MAAM,KAAK,CAAC,CAAC,KAAK,mCAAO,CAAC,QAAQ,CAAC,CAAC,KAAK,qBAAO,CAAC,AAAQ,GAAG,AAAC,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,KAAK,qBAAO,CAAC,AAAQ,GAAG,AAAC,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,CAAC,MAAM,qCAAS,CAAC,aAAa,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,uBAAS,CAAC,KAAK,qBAAO,CAAC,KAAK,IAAI,CAAC,MAAM,uBAAS,CAAC,KAAK,wBAAU,CAAC,KAAK,IAAI,CAAC,MAAM,uBAAS,CAAC,KAAK,qBAAO,CAAC,KAAK,IAAI,CAAC,OAAO,CAAC,CAAC,MAAM,uBAAS,CAAC,mBAAK,CAAC,QAAQ,MAAM,CAAC,KAAK,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,uBAAS,CAAC,KAAK,CAAC,kBAAI,CAAC,QAAQ,MAAM,CAAC"}`
};
var BrowseGamesButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { compact = false } = $$props;
  let { expanded: expanded2 = false } = $$props;
  let { isLoggedIn: isLoggedIn2 = false } = $$props;
  let { isMobile: isMobile2 = false } = $$props;
  if ($$props.compact === void 0 && $$bindings.compact && compact !== void 0)
    $$bindings.compact(compact);
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded2 !== void 0)
    $$bindings.expanded(expanded2);
  if ($$props.isLoggedIn === void 0 && $$bindings.isLoggedIn && isLoggedIn2 !== void 0)
    $$bindings.isLoggedIn(isLoggedIn2);
  if ($$props.isMobile === void 0 && $$bindings.isMobile && isMobile2 !== void 0)
    $$bindings.isMobile(isMobile2);
  $$result.css.add(css$c);
  return `<button class="${[
    "flex items-center relative overflow-hidden text-neutrals-l00 font-medium text-sm leading-none bg-neutrals-d10 border border-neutrals-l50 border-opacity-35 hover:border-opacity-50 rounded-md md:pr-3 svelte-xomk01",
    (compact ? "compact" : "") + " " + (expanded2 ? "expanded" : "") + " " + (isLoggedIn2 ? "isLoggedIn" : "") + " " + (isMobile2 ? "isMobile" : "")
  ].join(" ").trim()}"><div class="${"icon league absolute left-0 flex svelte-xomk01"}">${validate_component(League || missing_component, "svelte:component").$$render($$result, { class: "m-auto" }, {}, {})}</div>
  <div class="${"icon overwatch absolute flex svelte-xomk01"}">${validate_component(Overwatch || missing_component, "svelte:component").$$render($$result, { class: "m-auto" }, {}, {})}</div>
  <div class="${"icon browse flex relative text-white bg-functional-r20 ml-auto md:mr-3 svelte-xomk01"}">${validate_component(Browse_games || missing_component, "svelte:component").$$render($$result, { class: "m-auto" }, {}, {})}</div>
  <span class="${[
    "text whitespace-nowrap hidden md:inline svelte-xomk01",
    compact && !expanded2 ? "xl:hidden" : ""
  ].join(" ").trim()}"><span class="${"hidden xl:inline svelte-xomk01"}">Browse</span>
    Games</span>
</button>`;
});
var css$b = {
  code: "a.svelte-14pnk1t.svelte-14pnk1t,button.svelte-14pnk1t.svelte-14pnk1t{align-items:center;border-radius:.375rem;display:flex;height:40px;padding-left:.625rem;padding-right:.625rem;transition-duration:.15s;transition-duration:.1s;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);width:40px}a.svelte-14pnk1t svg,button.svelte-14pnk1t svg{--primaryColor:#798694;--accentColor:#fff;flex-shrink:0;height:20px;width:20px}a.svelte-14pnk1t span.svelte-14pnk1t,button.svelte-14pnk1t span.svelte-14pnk1t{color:#fff;font-size:1rem;line-height:1.5rem;line-height:1;white-space:nowrap}@media(min-width:1280px){a.svelte-14pnk1t span.svelte-14pnk1t,button.svelte-14pnk1t span.svelte-14pnk1t{color:#798694;font-size:.875rem;font-weight:500;letter-spacing:.01em;line-height:1.25rem}}a.active.svelte-14pnk1t.svelte-14pnk1t:not(.expanded),button.active.svelte-14pnk1t.svelte-14pnk1t:not(.expanded){background-color:#21242a}a.active.svelte-14pnk1t span.svelte-14pnk1t,button.active.svelte-14pnk1t span.svelte-14pnk1t{color:#fff}a.active.svelte-14pnk1t svg,button.active.svelte-14pnk1t svg{--primaryColor:#f14343;--accentColor:#fff}a.expanded.svelte-14pnk1t.svelte-14pnk1t,button.expanded.svelte-14pnk1t.svelte-14pnk1t{width:100%}a.expanded.svelte-14pnk1t span.svelte-14pnk1t,button.expanded.svelte-14pnk1t span.svelte-14pnk1t{margin-left:1.25rem}a.svelte-14pnk1t.svelte-14pnk1t:hover,button.svelte-14pnk1t.svelte-14pnk1t:hover{background-color:#21242a}a.isMobile.svelte-14pnk1t.svelte-14pnk1t,button.isMobile.svelte-14pnk1t.svelte-14pnk1t{background-color:transparent;border-radius:.5rem;height:2.25rem;justify-content:center;padding-left:0;padding-right:0;width:2.25rem}a.isMobile.svelte-14pnk1t svg,button.isMobile.svelte-14pnk1t svg{--accentColor:#798694}a.isMobile.active.svelte-14pnk1t.svelte-14pnk1t,button.isMobile.active.svelte-14pnk1t.svelte-14pnk1t{background-color:#be3434}a.isMobile.active.svelte-14pnk1t svg,button.isMobile.active.svelte-14pnk1t svg{--primaryColor:#fff;--accentColor:#fff}",
  map: `{"version":3,"file":"SidebarButton.svelte","sources":["SidebarButton.svelte"],"sourcesContent":["<script>\\n  import { fly } from 'svelte/transition';\\n  import { page } from '$app/stores';\\n  import { tooltip } from '@metafy/lib/directives/tooltip';\\n  import { chatState } from '@metafy/lib/stores';\\n\\n  let className = '';\\n  export { className as class };\\n  export let href = null;\\n  export let content = '';\\n  export let icon;\\n  export let expanded = false;\\n  export let activeStartsWith = [];\\n  export let isMobile = false;\\n  export let noticeCount = 0;\\n  export let buttonActive = false;\\n\\n  let active;\\n  $: if (href !== null) {\\n    active = $chatState.expanded\\n      ? false\\n      : activeStartsWith.length > 0\\n      ? $page.path === href || activeStartsWith.some((x) => $page.path.startsWith(\`/account/\${x}\`))\\n      : href === $page.path;\\n  }\\n  $: tooltipContent = expanded ? '' : content;\\n<\/script>\\n\\n<!-- Need to re-render the whole thing each time we expand/unexpand because we only want to show the\\n  tooltip when the sidebar is collapsed, but the parameters for \`use\` directives are not reactive. -->\\n{#key expanded}\\n  {#if href}\\n    <a\\n      {href}\\n      class={className}\\n      on:click\\n      class:active\\n      class:expanded\\n      class:isMobile\\n      sveltekit:prefetch\\n      use:tooltip={{ content: tooltipContent, disableMobile: true }}\\n    >\\n      <svelte:component this={icon} {noticeCount} {isMobile} />\\n      {#if expanded}<span in:fly|local={{ x: -50, duration: 200 }}>{content}</span>{/if}\\n    </a>\\n  {:else}\\n    <button\\n      class={className}\\n      class:active={active || buttonActive}\\n      class:expanded\\n      class:isMobile\\n      on:click\\n      use:tooltip={{ content: tooltipContent, disableMobile: true }}\\n    >\\n      <svelte:component this={icon} {noticeCount} {isMobile} />\\n      {#if expanded}<span in:fly|local={{ x: -50, duration: 200 }}>{content}</span>{/if}\\n    </button>\\n  {/if}\\n{/key}\\n\\n<!-- Need to re-render the whole thing each time we expand/unexpand because we only want to show the\\n  tooltip when the sidebar is collapsed, but the parameters for \`use\` directives are not reactive. -->\\n<style>a,button{align-items:center;border-radius:.375rem;display:flex;height:40px;padding-left:.625rem;padding-right:.625rem;transition-duration:.15s;transition-duration:.1s;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);width:40px}a :global(svg),button :global(svg){--primaryColor:#798694;--accentColor:#fff;flex-shrink:0;height:20px;width:20px}a span,button span{color:#fff;font-size:1rem;line-height:1.5rem;line-height:1;white-space:nowrap}@media (min-width:1280px){a span,button span{color:#798694;font-size:.875rem;font-weight:500;letter-spacing:.01em;line-height:1.25rem}}a.active:not(.expanded),button.active:not(.expanded){background-color:#21242a}a.active span,button.active span{color:#fff}a.active :global(svg),button.active :global(svg){--primaryColor:#f14343;--accentColor:#fff}a.expanded,button.expanded{width:100%}a.expanded span,button.expanded span{margin-left:1.25rem}a:hover,button:hover{background-color:#21242a}a.isMobile,button.isMobile{background-color:transparent;border-radius:.5rem;height:2.25rem;justify-content:center;padding-left:0;padding-right:0;width:2.25rem}a.isMobile :global(svg),button.isMobile :global(svg){--accentColor:#798694}a.isMobile.active,button.isMobile.active{background-color:#be3434}a.isMobile.active :global(svg),button.isMobile.active :global(svg){--primaryColor:#fff;--accentColor:#fff}</style>\\n"],"names":[],"mappings":"AA8DO,+BAAC,CAAC,oCAAM,CAAC,YAAY,MAAM,CAAC,cAAc,OAAO,CAAC,QAAQ,IAAI,CAAC,OAAO,IAAI,CAAC,aAAa,OAAO,CAAC,cAAc,OAAO,CAAC,oBAAoB,IAAI,CAAC,oBAAoB,GAAG,CAAC,oBAAoB,gBAAgB,CAAC,YAAY,CAAC,KAAK,CAAC,IAAI,CAAC,MAAM,CAAC,2BAA2B,aAAa,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,gBAAC,CAAC,AAAQ,GAAG,AAAC,CAAC,qBAAM,CAAC,AAAQ,GAAG,AAAC,CAAC,eAAe,OAAO,CAAC,cAAc,IAAI,CAAC,YAAY,CAAC,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,gBAAC,CAAC,mBAAI,CAAC,qBAAM,CAAC,mBAAI,CAAC,MAAM,IAAI,CAAC,UAAU,IAAI,CAAC,YAAY,MAAM,CAAC,YAAY,CAAC,CAAC,YAAY,MAAM,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,gBAAC,CAAC,mBAAI,CAAC,qBAAM,CAAC,mBAAI,CAAC,MAAM,OAAO,CAAC,UAAU,OAAO,CAAC,YAAY,GAAG,CAAC,eAAe,KAAK,CAAC,YAAY,OAAO,CAAC,CAAC,CAAC,qCAAO,KAAK,SAAS,CAAC,CAAC,MAAM,qCAAO,KAAK,SAAS,CAAC,CAAC,iBAAiB,OAAO,CAAC,CAAC,sBAAO,CAAC,mBAAI,CAAC,MAAM,sBAAO,CAAC,mBAAI,CAAC,MAAM,IAAI,CAAC,CAAC,sBAAO,CAAC,AAAQ,GAAG,AAAC,CAAC,MAAM,sBAAO,CAAC,AAAQ,GAAG,AAAC,CAAC,eAAe,OAAO,CAAC,cAAc,IAAI,CAAC,CAAC,uCAAS,CAAC,MAAM,uCAAS,CAAC,MAAM,IAAI,CAAC,CAAC,wBAAS,CAAC,mBAAI,CAAC,MAAM,wBAAS,CAAC,mBAAI,CAAC,YAAY,OAAO,CAAC,+BAAC,MAAM,CAAC,oCAAM,MAAM,CAAC,iBAAiB,OAAO,CAAC,CAAC,uCAAS,CAAC,MAAM,uCAAS,CAAC,iBAAiB,WAAW,CAAC,cAAc,KAAK,CAAC,OAAO,OAAO,CAAC,gBAAgB,MAAM,CAAC,aAAa,CAAC,CAAC,cAAc,CAAC,CAAC,MAAM,OAAO,CAAC,CAAC,wBAAS,CAAC,AAAQ,GAAG,AAAC,CAAC,MAAM,wBAAS,CAAC,AAAQ,GAAG,AAAC,CAAC,cAAc,OAAO,CAAC,CAAC,SAAS,qCAAO,CAAC,MAAM,SAAS,qCAAO,CAAC,iBAAiB,OAAO,CAAC,CAAC,SAAS,sBAAO,CAAC,AAAQ,GAAG,AAAC,CAAC,MAAM,SAAS,sBAAO,CAAC,AAAQ,GAAG,AAAC,CAAC,eAAe,IAAI,CAAC,cAAc,IAAI,CAAC"}`
};
var SidebarButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $chatState, $$unsubscribe_chatState;
  let $page, $$unsubscribe_page;
  $$unsubscribe_chatState = subscribe(chatState, (value) => $chatState = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { class: className = "" } = $$props;
  let { href = null } = $$props;
  let { content = "" } = $$props;
  let { icon } = $$props;
  let { expanded: expanded2 = false } = $$props;
  let { activeStartsWith = [] } = $$props;
  let { isMobile: isMobile2 = false } = $$props;
  let { noticeCount = 0 } = $$props;
  let { buttonActive = false } = $$props;
  let active;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.content === void 0 && $$bindings.content && content !== void 0)
    $$bindings.content(content);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded2 !== void 0)
    $$bindings.expanded(expanded2);
  if ($$props.activeStartsWith === void 0 && $$bindings.activeStartsWith && activeStartsWith !== void 0)
    $$bindings.activeStartsWith(activeStartsWith);
  if ($$props.isMobile === void 0 && $$bindings.isMobile && isMobile2 !== void 0)
    $$bindings.isMobile(isMobile2);
  if ($$props.noticeCount === void 0 && $$bindings.noticeCount && noticeCount !== void 0)
    $$bindings.noticeCount(noticeCount);
  if ($$props.buttonActive === void 0 && $$bindings.buttonActive && buttonActive !== void 0)
    $$bindings.buttonActive(buttonActive);
  $$result.css.add(css$b);
  {
    if (href !== null) {
      active = $chatState.expanded ? false : activeStartsWith.length > 0 ? $page.path === href || activeStartsWith.some((x) => $page.path.startsWith(`/account/${x}`)) : href === $page.path;
    }
  }
  $$unsubscribe_chatState();
  $$unsubscribe_page();
  return `
${href ? `<a${add_attribute("href", href, 0)} class="${[
    escape2(null_to_empty(className)) + " svelte-14pnk1t",
    (active ? "active" : "") + " " + (expanded2 ? "expanded" : "") + " " + (isMobile2 ? "isMobile" : "")
  ].join(" ").trim()}" sveltekit:prefetch>${validate_component(icon || missing_component, "svelte:component").$$render($$result, { noticeCount, isMobile: isMobile2 }, {}, {})}
      ${expanded2 ? `<span class="${"svelte-14pnk1t"}">${escape2(content)}</span>` : ``}</a>` : `<button class="${[
    escape2(null_to_empty(className)) + " svelte-14pnk1t",
    (active || buttonActive ? "active" : "") + " " + (expanded2 ? "expanded" : "") + " " + (isMobile2 ? "isMobile" : "")
  ].join(" ").trim()}">${validate_component(icon || missing_component, "svelte:component").$$render($$result, { noticeCount, isMobile: isMobile2 }, {}, {})}
      ${expanded2 ? `<span class="${"svelte-14pnk1t"}">${escape2(content)}</span>` : ``}</button>`}

`;
});
var Dashboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "22" },
    { height: "20" },
    { viewBox: "0 0 22 20" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M4 10V12.1V16.9C4 17.7284 4.67157 18.4 5.5 18.4H9.25M18 10V12.1V16.9C18 17.7284 17.3284 18.4 16.5 18.4H13.45"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.5"}"></path><path d="${"M13.8 19.15V15.075C13.8 13.7219 12.7031 12.625 11.35 12.625V12.625C9.99693 12.625 8.90002 13.7219 8.90002 15.075V19.15"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.5"}"></path><path d="${"M1 8L10.4265 1.40142C10.7709 1.1604 11.2291 1.1604 11.5735 1.40142L21 8"}" stroke="${"var(--accentColor)"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path></svg>`;
});
var Wallet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "20" },
    { height: "18" },
    { viewBox: "0 0 20 18" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M1 3V14.1864C1 15.7403 2.25969 17 3.81361 17H16.1864C17.7403 17 19 15.7403 19 14.1864V5"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.5"}"></path><path d="${"M17 1H3C1.89543 1 1 1.89543 1 3V3C1 4.10457 1.89543 5 3 5H19"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><circle cx="${"14"}" cy="${"11"}" r="${"1.5"}" stroke="${"var(--accentColor)"}"></circle></svg>`;
});
var Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "22" },
    { height: "22" },
    { viewBox: "0 0 22 22" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M9.21333 3.64828C10.3853 3.33562 11.6147 3.33562 12.7867 3.64828L14.0157 1.44907C14.1531 1.20315 14.4665 1.11927 14.7084 1.26364L17.316 2.81991C17.5484 2.95859 17.6283 3.25697 17.4963 3.49318L16.2533 5.71724C17.1057 6.61433 17.7249 7.71988 18.0533 8.93103H20.5C20.7761 8.93103 21 9.15489 21 9.43103V12.569C21 12.8451 20.7761 13.069 20.5 13.069H18.0533C17.7249 14.2801 17.1057 15.3857 16.2533 16.2828L17.4963 18.5068C17.6283 18.743 17.5484 19.0414 17.316 19.1801L14.7084 20.7364C14.4665 20.8807 14.1531 20.7969 14.0157 20.5509L12.7867 18.3517C11.6147 18.6644 10.3853 18.6644 9.21333 18.3517L7.9843 20.5509C7.84686 20.7969 7.5335 20.8807 7.29159 20.7364L4.68397 19.1801C4.4516 19.0414 4.37173 18.743 4.50374 18.5068L5.74667 16.2828C4.89427 15.3857 4.27507 14.2801 3.94667 13.069H1.5C1.22386 13.069 1 12.8451 1 12.569V9.43103C1 9.15489 1.22386 8.93103 1.5 8.93103H3.94667C4.27507 7.71988 4.89427 6.61433 5.74667 5.71724L4.50374 3.49318C4.37173 3.25697 4.4516 2.95859 4.68397 2.81991L7.29159 1.26364C7.5335 1.11927 7.84686 1.20315 7.9843 1.44907L9.21333 3.64828Z"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><path d="${"M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z"}" stroke="${"var(--accentColor)"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path></svg>`;
});
var Sessions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "20" },
    { height: "20" },
    { viewBox: "0 0 20 20" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><rect x="${"5.04809"}" y="${"0.681818"}" width="${"3.11255"}" height="${"5.67038"}" rx="${"1.55628"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.36364"}"></rect><rect x="${"12.0819"}" y="${"0.681818"}" width="${"3.11255"}" height="${"5.67038"}" rx="${"1.55628"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.36364"}"></rect><path d="${"M5.00568 3.19739H3.72677C2.31412 3.19739 1.16895 4.34257 1.16895 5.75521V16.626C1.16895 18.0386 2.31412 19.1838 3.72677 19.1838H16.5159C17.9285 19.1838 19.0737 18.0386 19.0737 16.626V5.75521C19.0737 4.34256 17.9285 3.19739 16.5159 3.19739H15.237M8.20296 3.19739H10.1213H12.0397"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.36364"}"></path><path d="${"M5.00537 11.5763H7.62133"}" stroke="${"var(--accentColor)"}" stroke-width="${"1.36364"}" stroke-linecap="${"round"}" stroke-linejoin="${"bevel"}"></path><path d="${"M12.8533 11.5763H15.4692"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.36364"}" stroke-linecap="${"round"}" stroke-linejoin="${"bevel"}"></path></svg>`;
});
var Lessons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "16" },
    { height: "17" },
    { viewBox: "0 0 16 17" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M4.15137 5.96664H10.4847"}" stroke="${"var(--accentColor)"}" stroke-width="${"1.26667"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><path d="${"M4.15137 9.76666H7.95137"}" stroke="${"var(--accentColor)"}" stroke-width="${"1.26667"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><path d="${"M0.984652 3.93999C0.984652 2.61083 2.06215 1.53333 3.39132 1.53333H7.95132H12.5113C13.8405 1.53333 14.918 2.61083 14.918 3.93999V13.06C14.918 14.3892 13.8405 15.4667 12.5113 15.4667H3.39132C2.06215 15.4667 0.984652 14.3892 0.984652 13.06V3.93999Z"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.26667"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path></svg>`;
});
var UserNav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { expanded: expanded2 = false } = $$props;
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded2 !== void 0)
    $$bindings.expanded(expanded2);
  return `<nav><ul class="${"flex flex-col"}"><li class="${"mb-4"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    href: "/account",
    content: "Dashboard",
    icon: Dashboard,
    expanded: expanded2
  }, {}, {})}</li>
    
    
    <li class="${"mb-4"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    href: "/account/sessions",
    content: "Live sessions",
    icon: Sessions,
    expanded: expanded2,
    activeStartsWith: ["sessions"]
  }, {}, {})}</li>
    <li class="${"mb-4"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    href: "/account/plans",
    content: "Training Plans",
    icon: Lessons,
    expanded: expanded2,
    activeStartsWith: ["plans", "plan"]
  }, {}, {})}</li>
    <li class="${"mb-4"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    href: "/account/wallet",
    content: "My wallet",
    icon: Wallet,
    expanded: expanded2
  }, {}, {})}</li>
    <li class="${"mb-4"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    href: "/account/settings/general",
    content: "Settings",
    icon: Settings,
    expanded: expanded2,
    activeStartsWith: ["settings"]
  }, {}, {})}</li></ul></nav>`;
});
var Arrow_external = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "8" },
    { height: "8" },
    { viewBox: "0 0 8 8" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M6.40701 1.00005L1.11198 6.58137"}" stroke="${"#DB3A3A"}" stroke-width="${"1.25"}"></path><path d="${"M1.5 1H6.5V6"}" stroke="${"#DB3A3A"}" stroke-width="${"1.25"}"></path></svg>`;
});
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const PAGES = [
    { href: "/gift-cards", label: "Gift Cards" },
    {
      href: "https://form.typeform.com/to/Wr6mNRlH",
      label: "Become a Coach"
    },
    {
      href: "https://metafy.gg/careers",
      label: "Careers"
    },
    {
      href: "https://medium.com/metafy",
      label: "Blog"
    },
    {
      href: "mailto:support@metafy.gg",
      label: "Support"
    }
  ];
  const isExternal = (url) => url.includes("https://");
  return `<nav><ul class="${"flex flex-col space-y-4"}">${each(PAGES, ({ href, label }) => `<li class="${"flex"}"><a class="${"flex w-full py-4 text-base leading-none text-neutrals-l00"}"${add_attribute("rel", isExternal(href) ? "noopener noreferrer" : "preload", 0)}${add_attribute("target", isExternal(href) ? "_blank" : "_self", 0)}${add_attribute("href", href, 0)}>${escape2(label)}
          ${isExternal(href) ? `${validate_component(Arrow_external, "ArrowExternal").$$render($$result, { class: "w-1 h-1" }, {}, {})}` : ``}</a>
      </li>`)}</ul></nav>`;
});
var Chat$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "26" },
    { height: "22" },
    { viewBox: "0 0 26 22" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M9.74177 12.893H9.49165L9.31058 13.0656L5.65915 16.5454C5.59887 16.6028 5.49893 16.5717 5.48195 16.4902L4.83619 13.3905L4.73254 12.893H4.22433H1.48239C1.01992 12.893 0.64502 12.5181 0.64502 12.0556V1.81906C0.64502 1.35659 1.01992 0.981689 1.48239 0.981689H15.3749C15.8373 0.981689 16.2122 1.35659 16.2122 1.81906V12.0556C16.2122 12.5181 15.8373 12.893 15.3749 12.893H9.74177Z"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.25"}" stroke-linecap="${"round"}"></path><path d="${"M10.9909 17.9098H16.4064L20.1007 21.1964C20.2127 21.2961 20.3907 21.2373 20.4213 21.0904L21.0839 17.9098H23.278C23.9243 17.9098 24.4482 17.3859 24.4482 16.7396V8.54814C24.4482 7.90185 23.9243 7.37793 23.278 7.37793H20.0647"}" stroke="${"var(--primaryColor)"}" stroke-width="${"1.25"}" stroke-linecap="${"round"}"></path></svg>`;
});
var isMobile = true;
var MobileNavs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $chatState, $$unsubscribe_chatState;
  $$unsubscribe_chatState = subscribe(chatState, (value) => $chatState = value);
  $$unsubscribe_chatState();
  return `<div class="${"flex items-center justify-center space-x-6 sm:space-x-14 md:space-x-24"}"><div class="${"nav-item"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    href: "/account",
    content: "Dashboard",
    icon: Dashboard,
    isMobile
  }, {}, {})}</div>
  <div class="${"nav-item"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    content: "Chat",
    icon: Chat$1,
    buttonActive: $chatState.expanded,
    isMobile
  }, {}, {})}</div>
  
  
  
  

  </div>`;
});
var Metafy_symbol = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "65" },
    { height: "59" },
    { viewBox: "0 0 65 59" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M33.9249 0.537063C33.6016 0.338543 33.2757 0.138399 32.9286 1.96793e-05C32.6067 -0.00161115 32.2873 0.198853 31.9932 0.383398C31.8957 0.444572 31.801 0.503997 31.7099 0.553732C27.9476 2.79258 24.1837 5.02871 20.4197 7.26484C16.6562 9.50075 12.8926 11.7367 9.13069 13.9753C8.80383 14.1707 8.54191 14.4009 8.53325 14.8134C8.52335 15.8867 8.52477 16.9614 8.52618 18.0363C8.52724 18.8425 8.5283 19.6489 8.52459 20.4548C8.52459 20.8022 8.63499 21.0867 8.94886 21.2647C10.1279 21.9865 11.3202 22.6909 12.5124 23.3953C13.6337 24.0578 14.7548 24.7202 15.8648 25.3969C15.9092 25.4185 15.9581 25.4486 16.0098 25.4804C16.1978 25.596 16.4214 25.7335 16.5878 25.5598C16.6721 25.3273 16.6579 25.0509 16.6441 24.7811C16.6366 24.6351 16.6293 24.491 16.6376 24.3568C16.6438 23.7526 16.64 23.1476 16.6361 22.5424C16.6292 21.4663 16.6224 20.3899 16.6722 19.317C17.0077 19.3606 17.2926 19.5417 17.579 19.7237C17.6771 19.786 17.7753 19.8484 17.8758 19.9054C18.6627 20.373 19.4493 20.8404 20.2358 21.3077C24.2524 23.6941 28.2646 26.078 32.2814 28.4695C32.6017 28.6649 32.8853 28.754 33.2338 28.5542C37.9873 25.7292 42.7409 22.9041 47.4922 20.0813C47.6345 20.0001 47.7693 19.9149 47.9022 19.8309C48.2385 19.6183 48.563 19.4132 48.9663 19.2996C49.0561 19.794 49.0473 20.2722 49.0384 20.7612C49.035 20.9444 49.0317 21.1292 49.0334 21.3168C49.0373 22.6226 49.0365 23.9267 49.0358 25.2307C49.0352 26.0996 49.0347 26.9684 49.0356 27.8376C49.0248 28.3414 49.3408 28.5455 49.7304 28.7757C50.9034 29.4679 52.0724 30.1657 53.2409 30.8631C54.5136 31.6227 55.7857 32.3821 57.062 33.1337C57.4755 33.3769 57.8261 33.214 58.1941 32.9882C59.204 32.38 60.2207 31.7758 61.2372 31.1718C62.4451 30.454 63.6527 29.7364 64.8482 29.0124C65.1896 28.784 64.8791 28.5834 64.659 28.4412C64.6404 28.4292 64.6226 28.4177 64.6058 28.4065C63.5886 27.8033 62.5718 27.1991 61.5549 26.5949C60.3061 25.8529 59.057 25.1107 57.8067 24.3699C57.4668 24.1614 57.1205 23.9464 57.1313 23.4948C57.127 20.5981 57.1313 17.6927 57.1356 14.7961C57.1616 14.3965 56.8066 14.1468 56.5079 13.9601C52.8129 11.7659 49.1185 9.5695 45.424 7.37313C41.7295 5.17672 38.035 2.98031 34.3399 0.786073C34.2011 0.70668 34.0632 0.62202 33.9249 0.537063ZM11.6616 28.0701C10.4307 27.3361 9.20039 26.6024 7.97432 25.8756C7.6781 25.6888 7.38619 25.7106 7.09429 25.893C4.87151 27.2176 2.65739 28.5336 0.434609 29.8539C0.227035 29.9559 0.0821649 30.1145 0 30.3316C1.08948 30.9862 2.19654 31.6441 3.30553 32.3032C4.71663 33.1419 6.13086 33.9824 7.51593 34.8202C7.88351 35.0612 7.92027 35.3674 7.92027 35.7822C7.91378 37.1578 7.91432 38.534 7.91486 39.9105C7.9154 41.287 7.91594 42.6638 7.90945 44.0406C7.88783 44.4705 8.04351 44.7615 8.41542 44.9787C9.4022 45.5663 10.3889 46.154 11.3755 46.7416C15.0046 48.9031 18.6332 51.0642 22.2645 53.224C22.3609 53.2775 22.4579 53.3391 22.5561 53.4015C22.7972 53.5548 23.0459 53.7129 23.3132 53.7669C23.3932 53.6844 23.4711 53.5997 23.5489 53.5128C23.5143 53.6388 23.4797 53.7626 23.4451 53.8842C24.9855 54.8536 26.5567 55.7826 28.1275 56.7113C29.2555 57.3783 30.3833 58.0451 31.4994 58.7267C31.8584 58.9417 32.1935 59.1284 32.6 58.8852C34.5179 57.744 36.436 56.6029 38.3542 55.4618C43.9403 52.1386 49.527 48.8151 55.1089 45.4868C55.2238 45.4161 55.3389 45.3515 55.4523 45.2879C55.8403 45.0701 56.2077 44.864 56.4754 44.464C56.4549 43.2633 56.4587 42.0612 56.4625 40.8593C56.4651 40.033 56.4677 39.2069 56.4624 38.3815C56.4862 38.071 56.1511 37.8191 55.9197 37.6714C54.6423 36.9005 53.3623 36.1404 52.0826 35.3804C51.0012 34.7383 49.92 34.0962 48.8406 33.4478C48.6416 33.324 48.4946 33.3392 48.3995 33.4955C48.3634 34.5311 48.3708 35.573 48.3782 36.6148C48.385 37.5719 48.3918 38.5289 48.3649 39.4803C48.3301 39.8695 48.0928 40.0147 47.8214 40.1807C47.7551 40.2212 47.6868 40.263 47.6189 40.3098C45.6188 41.489 43.6231 42.679 41.6295 43.869C41.5026 43.9379 41.3856 44.0156 41.2711 44.0917C40.974 44.2891 40.6943 44.475 40.3041 44.464C40.2491 42.5862 40.2565 40.7034 40.2638 38.8218C40.2683 37.668 40.2728 36.5146 40.263 35.3631C40.1616 35.1215 39.8904 35.2727 39.7196 35.3678C39.7045 35.3762 39.6903 35.3841 39.677 35.3913C38.5247 36.0818 37.3713 36.769 36.2179 37.4562C35.0642 38.1436 33.9105 38.8309 32.7579 39.5216C32.4162 39.7279 32.1092 39.7995 31.7438 39.5824C30.5997 38.9158 29.462 38.2347 28.3241 37.5534C27.0598 36.7965 25.7953 36.0394 24.5219 35.3023C24.3965 35.198 24.2581 35.2176 24.1068 35.3609C24.0793 36.692 24.0871 38.0256 24.0949 39.3591C24.1049 41.0691 24.1149 42.7791 24.0505 44.4836C23.6586 44.4468 23.3747 44.2626 23.0725 44.0666C22.9646 43.9966 22.8543 43.925 22.7359 43.8581C22.1052 43.4835 21.4748 43.1082 20.8443 42.7328C19.4796 41.9203 18.1146 41.1077 16.7465 40.3012C16.6951 40.2654 16.6394 40.2302 16.5825 40.1942C16.311 40.0228 16.0118 39.8339 16.0243 39.4803C16.0027 36.729 16.0113 33.9689 16.02 31.2154C16.0373 30.7789 15.7951 30.5184 15.4362 30.3164C14.18 29.572 12.9205 28.8208 11.6616 28.0701Z"}" fill="${"currentColor"}"></path></svg>`;
});
var Metafy_logotype = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "62" },
    { height: "12" },
    { viewBox: "0 0 62 12" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><g opacity="${"0.98"}"><path d="${"M12.9754 11.3631H20.2986V9.69217H14.9073V6.7362H19.3185V5.0959H14.9073V2.30776H20.2986V0.636841H12.9754V11.3631Z"}" fill="${"white"}"></path><path d="${"M22.1203 2.32247H25.4474V11.3631H27.3793V2.32247H30.7052V0.636841H22.1203V2.32247Z"}" fill="${"white"}"></path><path d="${"M35.1323 0.638184L30.8178 11.3632H32.6872L33.7125 8.88133H38.4252L39.4652 11.3632H41.4865L37.0348 0.638184H35.1323ZM34.3667 7.3182L36.0756 2.63006L37.7906 7.3182H34.3667Z"}" fill="${"white"}"></path><path d="${"M59.3167 0.636841L56.1402 5.86277L52.9956 0.636841H50.8628L55.0818 7.60964V11.3631H57.0761V7.57902L61.2804 0.636841H59.3167Z"}" fill="${"white"}"></path><path d="${"M43.2591 11.3631H45.1909V8.94981V7.25683H48.5916V5.57121H45.1909V2.30776H49.5716V0.636841H43.2591V11.3631Z"}" fill="${"white"}"></path><path d="${"M2.67029e-05 11.3633H1.84368V7.85238L2.67029e-05 5.60938V11.3633Z"}" fill="${"white"}"></path><path d="${"M5.23328 6.90035L7.62939e-06 0.638062V1.85328V3.33555L2.918 6.87095L5.20266 9.53537L8.56288 5.52588L8.57758 11.3631H10.4053L10.3906 0.638062L5.23328 6.90035Z"}" fill="${"white"}"></path></g></svg>`;
});
var Account = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "18" },
    { height: "21" },
    { viewBox: "0 0 18 21" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><circle cx="${"8.81546"}" cy="${"5.04385"}" r="${"3.79385"}" stroke="${"white"}" stroke-width="${"1.5"}"></circle><path d="${"M17 20C17 16.134 13.4183 13 9 13C4.58172 13 1 16.134 1 20"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path></svg>`;
});
var Expand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "21" },
    { height: "18" },
    { viewBox: "0 0 21 18" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M0.840027 1.28003H10.92"}" stroke="${"#798694"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><path d="${"M0.840088 9H18.4801"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><path d="${"M15.9601 5.64001L19.3201 9.00001L15.9601 12.36"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><path d="${"M0.840027 16.72H10.92"}" stroke="${"#798694"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path></svg>`;
});
var Collapse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "21" },
    { height: "18" },
    { viewBox: "0 0 21 18" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M20.16 16.72L10.08 16.72"}" stroke="${"#798694"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><path d="${"M20.16 9L2.51997 9"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><path d="${"M5.03997 12.36L1.67997 8.99999L5.03997 5.63999"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><path d="${"M20.16 1.28003L10.08 1.28003"}" stroke="${"#798694"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path></svg>`;
});
var Chat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "24" },
    { height: "21" },
    { viewBox: "0 0 24 21" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M9.17352 12.3168H8.89147L8.68728 12.5114L5.30786 15.7319L4.71325 12.8778L4.59637 12.3168H4.02327H1.4638C1.09916 12.3168 0.803557 12.0212 0.803557 11.6565V2.10119C0.803557 1.73655 1.09916 1.44095 1.4638 1.44095H14.4318C14.7964 1.44095 15.092 1.73655 15.092 2.10119V11.6565C15.092 12.0212 14.7964 12.3168 14.4318 12.3168H9.17352Z"}" fill="${"#F14343"}" fill-opacity="${"0.12"}" stroke="${"#F14343"}" stroke-width="${"1.4096"}"></path><path d="${"M10.3393 17.1206H15.3945L18.8429 20.1884C18.9475 20.2815 19.1136 20.2266 19.1421 20.0896L19.7607 17.1206H21.8088C22.4121 17.1206 22.9011 16.6315 22.9011 16.0283V8.38194C22.9011 7.77867 22.4121 7.28961 21.8088 7.28961H18.8093"}" stroke="${"white"}" stroke-width="${"1.4096"}"></path></svg>`;
});
var Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "20" },
    { height: "18" },
    { viewBox: "0 0 20 18" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M1 1H19"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><path d="${"M1 9H19"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path><path d="${"M1 17H19"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path></svg>`;
});
create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "18" },
    { height: "18" },
    { viewBox: "0 0 18 18" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M1 1L16.3137 16.3137"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path><path d="${"M16.3137 1L0.999988 16.3137"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}" stroke-linejoin="${"round"}"></path></svg>`;
});
var css$a = {
  code: "header.navbar.svelte-1thf4e3.svelte-1thf4e3{background-color:#141619;height:calc(64px + env(safe-area-inset-bottom, 0px));padding-bottom:env(safe-area-inset-bottom,0);width:100%}@media(min-width:1280px){header.navbar.svelte-1thf4e3.svelte-1thf4e3{height:100vh;transition-duration:.2s;transition-property:width;transition-timing-function:cubic-bezier(.4,0,.2,1);width:64px}}header.navbar.svelte-1thf4e3 .metafy-symbol{flex-shrink:0;height:30px;width:34px}@media(min-width:1280px){header.navbar.svelte-1thf4e3 .metafy-symbol{height:34px;width:38px}}@media(min-width:1536px){header.navbar.expanded.svelte-1thf4e3.svelte-1thf4e3{width:240px}}header.navbar.isHiddenMobile.svelte-1thf4e3.svelte-1thf4e3{display:none}@media(min-width:1280px){header.navbar.isHiddenMobile.svelte-1thf4e3.svelte-1thf4e3{display:flex}}header.navbar+*{margin-bottom:64px}@media(min-width:1280px){header.navbar+*{margin-bottom:0}}header.navbar.isHiddenMobile+*{margin-bottom:0}@media(min-width:1280px){header.navbar:not(.mobile-only)+*{margin-left:64px}}@media(min-width:1536px){header.navbar.expanded:not(.mobile-only)+*{margin-left:240px}}@media(min-width:1280px){header.navbar:not(.mobile-only)+div .container,header.navbar:not(.mobile-only)+div .lg\\:container,header.navbar:not(.mobile-only)+div .xl\\:container{max-width:1150px}}@media(min-width:1367px){header.navbar:not(.mobile-only)+div .container,header.navbar:not(.mobile-only)+div .lg\\:container,header.navbar:not(.mobile-only)+div .xl\\:container{max-width:1280px}}@media(min-width:1536px){header.navbar:not(.mobile-only)+div .container,header.navbar:not(.mobile-only)+div .lg\\:container,header.navbar:not(.mobile-only)+div .xl\\:container{max-width:1450px}}@media(min-width:1536px){header.navbar.expanded:not(.mobile-only)+div .container,header.navbar.expanded:not(.mobile-only)+div .lg\\:container,header.navbar.expanded:not(.mobile-only)+div .xl\\:container{max-width:1275px}}@media(min-width:1280px){.links.svelte-1thf4e3 li.svelte-1thf4e3{width:100%}}.menu.svelte-1thf4e3.svelte-1thf4e3{background-color:#040505;bottom:calc(64px + env(safe-area-inset-bottom, 0px))}",
  map: `{"version":3,"file":"Sidebar.svelte","sources":["Sidebar.svelte"],"sourcesContent":["<script>\\n  import { getContext } from 'svelte';\\n  import { fly } from 'svelte/transition';\\n  import { expanded, isSidebarHiddenMobile } from './_helpers/stores.js';\\n  import { chatState } from '@metafy/lib/stores';\\n  import { BREAKPOINTS, STATIC_URL } from '@metafy/lib/constants';\\n\\n  import BrowseGamesButton from '@metafy/components/BrowseGamesButton.svelte';\\n  import SidebarButton from './SidebarButton.svelte';\\n  import UserNav from './UserNav.svelte';\\n  import GuestNav from './GuestNav.svelte';\\n  // import UserDropdown from './UserDropdown.svelte';\\n  // import Notification from './Notification.svelte';\\n  import MobileNavs from './MobileNavs.svelte';\\n\\n  import MetafySymbol from '@metafy/assets/svgs/metafy_symbol.svg';\\n  import MetafyLogotype from '@metafy/assets/svgs/metafy_logotype.svg';\\n  import IconAccount from '@metafy/assets/svgs/sidebar/account.svg';\\n  import IconExpand from '@metafy/assets/svgs/sidebar/expand.svg';\\n  import IconCollapse from '@metafy/assets/svgs/sidebar/collapse.svg';\\n  import IconChat from '@metafy/assets/svgs/chat/chat.svg';\\n  import IconMenu from '@metafy/assets/svgs/sidebar/menu.svg';\\n  import IconMenuClose from '@metafy/assets/svgs/sidebar/menu_close.svg';\\n\\n  let className = '';\\n  export { className as class };\\n  export let isLoggedIn;\\n\\n  let opened = false;\\n  let innerWidth;\\n\\n  // When breakpoint is less than \`2xl\`, force sidebar to unexpand.\\n  $: if (innerWidth < BREAKPOINTS['2xl']) {\\n    $expanded = false;\\n  }\\n\\n  function close() {\\n    opened = false;\\n  }\\n<\/script>\\n\\n<svelte:window bind:innerWidth />\\n\\n<header\\n  class=\\"navbar z-sidebar fixed left-0 bottom-0 xl:bottom-auto xl:top-0 flex flex-col border-t xl:border-t-0 border-neutrals-l50 border-opacity-35 {className}\\"\\n  class:expanded={$expanded}\\n  class:isHiddenMobile={$isSidebarHiddenMobile}\\n>\\n  <ul class=\\"links flex items-center h-full xl:flex-col xl:py-4 pl-6 pr-5 xl:px-3\\">\\n    <li\\n      class=\\"flex justify-start xl:border-b border-neutrals-l50 border-opacity-15 xl:pb-3 xl:mb-4\\"\\n    >\\n      <a\\n        href={isLoggedIn ? '/account' : '/'}\\n        on:click={close}\\n        class=\\"flex items-center\\"\\n        sveltekit:prefetch\\n      >\\n        <MetafySymbol class=\\"metafy-symbol text-brands-metafy\\" />\\n        {#if $expanded}\\n          <div transition:fly|local={{ x: -50, duration: 200 }}>\\n            <MetafyLogotype class=\\"ml-3\\" />\\n          </div>\\n        {/if}\\n      </a>\\n    </li>\\n\\n    <!-- prettier-ignore -->\\n    <!-- TODO-2.1: Notifications -->\\n    <!-- prettier-ignore -->\\n    <!-- <li class=\\"hidden xl:flex xl:justify-center mb-4 pb-2 border-b border-neutrals-l50 border-opacity-15\\">\\n      <SidebarButton on:click content=\\"Notifications\\" icon={Notification} expanded={$expanded} noticeCount={0} />\\n    </li> -->\\n    <!-- Browse games button - visible on both mobile and desktop, for both users and guests. -->\\n    <li class=\\"hidden xl:block xl:mb-4 ml-4 xl:ml-0\\">\\n      <BrowseGamesButton compact expanded={$expanded} {isLoggedIn} />\\n    </li>\\n\\n    {#if isLoggedIn}\\n      <!-- User nav, visible only on desktop and when the user is logged in. -->\\n      <li class=\\"hidden xl:block\\">\\n        <UserNav expanded={$expanded} />\\n      </li>\\n\\n      <!-- Mobile nav, visible only on mobile and when the user is logged in. -->\\n      <li class=\\"xl:hidden flex-1\\">\\n        <MobileNavs />\\n      </li>\\n\\n      <!-- Chat, visible only on xl and up. -->\\n      <li class=\\"hidden xl:block mt-auto relative\\">\\n        <SidebarButton\\n          content=\\"Chat\\"\\n          icon={IconChat}\\n          expanded={$expanded}\\n          on:click={() => {\\n            chatState.update((s) => ({ ...s, expanded: !$chatState.expanded }));\\n          }}\\n        />\\n        <div\\n          class=\\"bg-functional-r50 rounded-full w-[6px] h-[6px] mb-2 absolute top-2 right-2\\"\\n          class:hidden={!$chatState.hasUnread}\\n        />\\n      </li>\\n\\n      <!-- Expand/collapse sidebar button - visible only on 2xl and up. -->\\n      <li class=\\"hidden 2xl:block mt-4\\">\\n        <SidebarButton\\n          on:click={() => ($expanded = !$expanded)}\\n          content={$expanded ? 'Collapse' : 'Expand'}\\n          icon={$expanded ? IconCollapse : IconExpand}\\n          expanded={$expanded}\\n        />\\n      </li>\\n    {/if}\\n\\n    <!-- Mobile only -->\\n    {#if isLoggedIn}\\n      <!-- <li class=\\"flex xl:hidden\\">\\n        <UserDropdown user={$account.data.session} expanded={false} />\\n      </li> -->\\n    {:else}\\n      <li class=\\"flex xl:hidden ml-6\\">\\n        <a\\n          href=\\"/auth/account/login\\"\\n          class=\\"w-8 h-8 flex items-center justify-center\\"\\n          sveltekit:prefetch\\n        >\\n          <IconAccount />\\n        </a>\\n      </li>\\n    {/if}\\n\\n    <!-- Hamburger menu button - visible only on mobile, for both users and guests -->\\n    {#if !isLoggedIn}\\n      <li class=\\"flex xl:hidden ml-6\\">\\n        <button\\n          class=\\"w-8 h-8 flex items-center justify-center\\"\\n          on:click={() => (opened = !opened)}\\n        >\\n          {#if opened}\\n            <IconMenuClose />\\n          {:else}\\n            <IconMenu />\\n          {/if}\\n        </button>\\n      </li>\\n    {/if}\\n  </ul>\\n\\n  {#if isLoggedIn}\\n    <!-- Desktop only -->\\n    <!-- <div class=\\"hidden xl:block\\">\\n      <UserDropdown user={$account.data.session} expanded={$expanded} />\\n    </div> -->\\n  {/if}\\n\\n  <!-- Menu drawer - visible only on mobile, if opened.\\n  If the user is logged in, show UserButtons, otherwise show GuestButtons. -->\\n  {#if opened}\\n    <div class=\\"menu xl:hidden fixed w-full py-6 px-5\\">\\n      {#if !isLoggedIn}\\n        <GuestNav on:click={close} />\\n      {/if}\\n    </div>\\n  {/if}\\n</header>\\n\\n<style>header.navbar{background-color:#141619;height:calc(64px + env(safe-area-inset-bottom, 0px));padding-bottom:env(safe-area-inset-bottom,0);width:100%}@media (min-width:1280px){header.navbar{height:100vh;transition-duration:.2s;transition-property:width;transition-timing-function:cubic-bezier(.4,0,.2,1);width:64px}}header.navbar :global(.metafy-symbol){flex-shrink:0;height:30px;width:34px}@media (min-width:1280px){header.navbar :global(.metafy-symbol){height:34px;width:38px}}@media (min-width:1536px){header.navbar.expanded{width:240px}}header.navbar.isHiddenMobile{display:none}@media (min-width:1280px){header.navbar.isHiddenMobile{display:flex}}:global(header.navbar+*){margin-bottom:64px}@media (min-width:1280px){:global(header.navbar+*){margin-bottom:0}}:global(header.navbar.isHiddenMobile+*){margin-bottom:0}@media (min-width:1280px){:global(header.navbar:not(.mobile-only)+*){margin-left:64px}}@media (min-width:1536px){:global(header.navbar.expanded:not(.mobile-only)+*){margin-left:240px}}@media (min-width:1280px){:global(header.navbar:not(.mobile-only)+div .container),:global(header.navbar:not(.mobile-only)+div .lg\\\\:container),:global(header.navbar:not(.mobile-only)+div .xl\\\\:container){max-width:1150px}}@media (min-width:1367px){:global(header.navbar:not(.mobile-only)+div .container),:global(header.navbar:not(.mobile-only)+div .lg\\\\:container),:global(header.navbar:not(.mobile-only)+div .xl\\\\:container){max-width:1280px}}@media (min-width:1536px){:global(header.navbar:not(.mobile-only)+div .container),:global(header.navbar:not(.mobile-only)+div .lg\\\\:container),:global(header.navbar:not(.mobile-only)+div .xl\\\\:container){max-width:1450px}}@media (min-width:1536px){:global(header.navbar.expanded:not(.mobile-only)+div .container),:global(header.navbar.expanded:not(.mobile-only)+div .lg\\\\:container),:global(header.navbar.expanded:not(.mobile-only)+div .xl\\\\:container){max-width:1275px}}@media (min-width:1280px){.links li{width:100%}}.menu{background-color:#040505;bottom:calc(64px + env(safe-area-inset-bottom, 0px))}</style>\\n"],"names":[],"mappings":"AAwKO,MAAM,qCAAO,CAAC,iBAAiB,OAAO,CAAC,OAAO,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,sBAAsB,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,eAAe,IAAI,sBAAsB,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,MAAM,qCAAO,CAAC,OAAO,KAAK,CAAC,oBAAoB,GAAG,CAAC,oBAAoB,KAAK,CAAC,2BAA2B,aAAa,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,CAAC,MAAM,sBAAO,CAAC,AAAQ,cAAc,AAAC,CAAC,YAAY,CAAC,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,MAAM,sBAAO,CAAC,AAAQ,cAAc,AAAC,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,MAAM,OAAO,uCAAS,CAAC,MAAM,KAAK,CAAC,CAAC,MAAM,OAAO,6CAAe,CAAC,QAAQ,IAAI,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,MAAM,OAAO,6CAAe,CAAC,QAAQ,IAAI,CAAC,CAAC,AAAQ,eAAe,AAAC,CAAC,cAAc,IAAI,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAQ,eAAe,AAAC,CAAC,cAAc,CAAC,CAAC,CAAC,AAAQ,8BAA8B,AAAC,CAAC,cAAc,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAQ,iCAAiC,AAAC,CAAC,YAAY,IAAI,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAQ,0CAA0C,AAAC,CAAC,YAAY,KAAK,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAQ,8CAA8C,AAAC,CAAC,AAAQ,kDAAkD,AAAC,CAAC,AAAQ,kDAAkD,AAAC,CAAC,UAAU,MAAM,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAQ,8CAA8C,AAAC,CAAC,AAAQ,kDAAkD,AAAC,CAAC,AAAQ,kDAAkD,AAAC,CAAC,UAAU,MAAM,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAQ,8CAA8C,AAAC,CAAC,AAAQ,kDAAkD,AAAC,CAAC,AAAQ,kDAAkD,AAAC,CAAC,UAAU,MAAM,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAQ,uDAAuD,AAAC,CAAC,AAAQ,2DAA2D,AAAC,CAAC,AAAQ,2DAA2D,AAAC,CAAC,UAAU,MAAM,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,qBAAM,CAAC,iBAAE,CAAC,MAAM,IAAI,CAAC,CAAC,mCAAK,CAAC,iBAAiB,OAAO,CAAC,OAAO,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,sBAAsB,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC"}`
};
var Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $expanded, $$unsubscribe_expanded;
  let $isSidebarHiddenMobile, $$unsubscribe_isSidebarHiddenMobile;
  let $chatState, $$unsubscribe_chatState;
  $$unsubscribe_expanded = subscribe(expanded, (value) => $expanded = value);
  $$unsubscribe_isSidebarHiddenMobile = subscribe(isSidebarHiddenMobile, (value) => $isSidebarHiddenMobile = value);
  $$unsubscribe_chatState = subscribe(chatState, (value) => $chatState = value);
  let { class: className = "" } = $$props;
  let { isLoggedIn: isLoggedIn2 } = $$props;
  let innerWidth;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.isLoggedIn === void 0 && $$bindings.isLoggedIn && isLoggedIn2 !== void 0)
    $$bindings.isLoggedIn(isLoggedIn2);
  $$result.css.add(css$a);
  {
    if (innerWidth < BREAKPOINTS["2xl"]) {
      set_store_value(expanded, $expanded = false, $expanded);
    }
  }
  $$unsubscribe_expanded();
  $$unsubscribe_isSidebarHiddenMobile();
  $$unsubscribe_chatState();
  return `

<header class="${[
    "navbar z-sidebar fixed left-0 bottom-0 xl:bottom-auto xl:top-0 flex flex-col border-t xl:border-t-0 border-neutrals-l50 border-opacity-35 " + escape2(className) + " svelte-1thf4e3",
    ($expanded ? "expanded" : "") + " " + ($isSidebarHiddenMobile ? "isHiddenMobile" : "")
  ].join(" ").trim()}"><ul class="${"links flex items-center h-full xl:flex-col xl:py-4 pl-6 pr-5 xl:px-3 svelte-1thf4e3"}"><li class="${"flex justify-start xl:border-b border-neutrals-l50 border-opacity-15 xl:pb-3 xl:mb-4 svelte-1thf4e3"}"><a${add_attribute("href", isLoggedIn2 ? "/account" : "/", 0)} class="${"flex items-center"}" sveltekit:prefetch>${validate_component(Metafy_symbol, "MetafySymbol").$$render($$result, {
    class: "metafy-symbol text-brands-metafy"
  }, {}, {})}
        ${$expanded ? `<div>${validate_component(Metafy_logotype, "MetafyLogotype").$$render($$result, { class: "ml-3" }, {}, {})}</div>` : ``}</a></li>

    
    
    
    
    
    <li class="${"hidden xl:block xl:mb-4 ml-4 xl:ml-0 svelte-1thf4e3"}">${validate_component(BrowseGamesButton, "BrowseGamesButton").$$render($$result, {
    compact: true,
    expanded: $expanded,
    isLoggedIn: isLoggedIn2
  }, {}, {})}</li>

    ${isLoggedIn2 ? `
      <li class="${"hidden xl:block svelte-1thf4e3"}">${validate_component(UserNav, "UserNav").$$render($$result, { expanded: $expanded }, {}, {})}</li>

      
      <li class="${"xl:hidden flex-1 svelte-1thf4e3"}">${validate_component(MobileNavs, "MobileNavs").$$render($$result, {}, {}, {})}</li>

      
      <li class="${"hidden xl:block mt-auto relative svelte-1thf4e3"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    content: "Chat",
    icon: Chat,
    expanded: $expanded
  }, {}, {})}
        <div class="${[
    "bg-functional-r50 rounded-full w-[6px] h-[6px] mb-2 absolute top-2 right-2",
    !$chatState.hasUnread ? "hidden" : ""
  ].join(" ").trim()}"></div></li>

      
      <li class="${"hidden 2xl:block mt-4 svelte-1thf4e3"}">${validate_component(SidebarButton, "SidebarButton").$$render($$result, {
    content: $expanded ? "Collapse" : "Expand",
    icon: $expanded ? Collapse : Expand,
    expanded: $expanded
  }, {}, {})}</li>` : ``}

    
    ${isLoggedIn2 ? `` : `<li class="${"flex xl:hidden ml-6 svelte-1thf4e3"}"><a href="${"/auth/account/login"}" class="${"w-8 h-8 flex items-center justify-center"}" sveltekit:prefetch>${validate_component(Account, "IconAccount").$$render($$result, {}, {}, {})}</a></li>`}

    
    ${!isLoggedIn2 ? `<li class="${"flex xl:hidden ml-6 svelte-1thf4e3"}"><button class="${"w-8 h-8 flex items-center justify-center"}">${`${validate_component(Menu, "IconMenu").$$render($$result, {}, {}, {})}`}</button></li>` : ``}</ul>

  ${isLoggedIn2 ? `
    ` : ``}

  
  ${``}
</header>`;
});
function exclude(obj, exclude2) {
  Object.keys(obj).filter((key) => exclude2.includes(key)).forEach((key) => delete obj[key]);
  return obj;
}
var Inline_svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const dispatch = createEventDispatcher();
  let { src: src2 } = $$props;
  let { transformSrc = (svg) => svg } = $$props;
  onMount(() => {
    inline(src2);
  });
  let cache = {};
  let isLoaded = false;
  let svgAttrs = {};
  let svgContent;
  function download(url) {
    return new Promise((resolve2, reject) => {
      const request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          try {
            const parser = new DOMParser();
            const result = parser.parseFromString(request.responseText, "text/xml");
            let svgEl = result.querySelector("svg");
            if (svgEl) {
              svgEl = transformSrc(svgEl);
              resolve2(svgEl);
            } else {
              reject(new Error('Loaded file is not valid SVG"'));
            }
          } catch (error22) {
            reject(error22);
          }
        } else {
          reject(new Error("Error loading SVG"));
        }
      };
      request.onerror = reject;
      request.send();
    });
  }
  function inline(src22) {
    if (!cache[src22]) {
      if (isLoaded) {
        isLoaded = false;
        dispatch("unloaded");
      }
      cache[src22] = download(src22);
    }
    cache[src22].then(async (svg) => {
      const attrs = svg.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        svgAttrs[attrs[i].name] = attrs[i].value;
      }
      svgContent = svg.innerHTML;
      await tick();
      isLoaded = true;
      dispatch("loaded");
    }).catch((error22) => {
      delete cache[src22];
      console.error(error22);
    });
  }
  if ($$props.src === void 0 && $$bindings.src && src2 !== void 0)
    $$bindings.src(src2);
  if ($$props.transformSrc === void 0 && $$bindings.transformSrc && transformSrc !== void 0)
    $$bindings.transformSrc(transformSrc);
  return `<svg${spread([
    { xmlns: "http://www.w3.org/2000/svg" },
    svgAttrs,
    exclude($$props, ["src", "transformSrc"]),
    { contenteditable: "true" }
  ])}>${(($$value) => $$value === void 0 ? `` : $$value)(svgContent)}</svg>`;
});
var height = 64;
var GuestNavbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"container relative z-guest-navbar hidden xl:block"}" style="${"height: " + escape2(height) + "px"}"><nav class="${"flex items-center pt-6"}"><a href="${"/"}" sveltekit:prefetch>${validate_component(Inline_svg, "InlineSVG").$$render($$result, {
    class: "w-11.5 h-10 text-brands-metafy mr-8",
    src: Metafy_symbol
  }, {}, {})}</a>
    ${validate_component(BrowseGamesButton, "BrowseGamesButton").$$render($$result, {}, {}, {})}

    <ul class="${"flex items-center text-neutrals-l00 leading-none space-x-10 ml-auto mr-10"}"><li><a href="${"/gift-cards"}" sveltekit:prefetch>Gift Cards</a></li>
      <li><a href="${"https://form.typeform.com/to/Wr6mNRlH"}" rel="${"noopener noreferrer"}">Become a Coach</a></li></ul>

    <a href="${"/auth/account/login"}" class="${"mr-4"}" sveltekit:prefetch><button class="${"w-[88px] h-10 font-medium text-neutrals-l00 text-xs uppercase tracking-0.08 border border-neutrals-l50 border-opacity-35 rounded-md leading-none"}">Login
      </button></a>
    <a href="${"/auth/account/create"}" sveltekit:prefetch><button class="${"w-[88px] h-10 font-medium text-functional-r50 text-xs uppercase tracking-0.08 border border-functional-r50 rounded-md leading-none"}">Sign up
      </button></a></nav></div>`;
});
var isLoggedIn = true;
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let path;
  let isEmptyPage;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const EMPTY_PAGES = ["/auth/", /@.+\/schedule/, "/swt"];
  path = $page.path;
  isEmptyPage = EMPTY_PAGES.some((page2) => {
    var _a;
    return !!((_a = path.match(page2)) == null ? void 0 : _a.length);
  });
  $$unsubscribe_page();
  return `
${validate_component(EnvironmentScripts, "EnvironmentScripts").$$render($$result, {}, {}, {})}


${prerendering ? `${validate_component(PageLoader, "PageLoader").$$render($$result, {}, {}, {})}` : ``}


<div class="${"flex w-full min-h-screen bg-neutrals-d03"}">${validate_component(Sidebar, "Sidebar").$$render($$result, {
    class: "",
    isLoggedIn
  }, {}, {})}
  <div class="${"flex-1"}">${!isEmptyPage && !isLoggedIn ? `${validate_component(GuestNavbar, "GuestNavbar").$$render($$result, {}, {}, {})}` : ``}

    ${slots.default ? slots.default({}) : ``}</div></div>


${validate_component(Toasts_1, "Toasts").$$render($$result, {}, {}, {})}








`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<p>${escape2(error22.message)}</p>


${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var siteName = "Metafy";
var siteUrl = "https://metafy.gg";
var imageFallback = "https://static.metafy.gg/meta/home-cover-alt.jpg";
var MetaTags = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let metaTags;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { pageTitle = void 0 } = $$props;
  let { title = pageTitle === void 0 ? siteName : `${pageTitle} - ${siteName}` } = $$props;
  let { url = `${BASE_APP_URL}${$page.path}` || siteUrl } = $$props;
  let { description = void 0 } = $$props;
  let { image = imageFallback } = $$props;
  let { imageAlt = siteName } = $$props;
  if ($$props.pageTitle === void 0 && $$bindings.pageTitle && pageTitle !== void 0)
    $$bindings.pageTitle(pageTitle);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0)
    $$bindings.description(description);
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.imageAlt === void 0 && $$bindings.imageAlt && imageAlt !== void 0)
    $$bindings.imageAlt(imageAlt);
  metaTags = {
    "twitter:site": "@TryMetafy",
    "og:type": "website",
    "og:url": url,
    "twitter:url": url,
    "og:title": title || "",
    "twitter:title": title || "",
    ...description ? {
      description: description || "",
      "og:description": description || "",
      "twitter:description": description || ""
    } : {},
    "og:image": image || imageFallback,
    "twitter:image": image || imageFallback,
    "twitter:image:alt": imageAlt || "",
    "og:locale": "en_US"
  };
  $$unsubscribe_page();
  return `${$$result.head += `${$$result.title = `<title>${escape2(title)}</title>`, ""}${`${each(Object.entries(metaTags), ([property, content]) => `${property === "description" ? `<meta${add_attribute("name", property, 0)}${add_attribute("content", content, 0)} data-svelte="svelte-p7x5hk">` : `<meta${add_attribute("property", property, 0)}${add_attribute("content", content, 0)} data-svelte="svelte-p7x5hk">`}`)}
    <link rel="${"canonical"}"${add_attribute("href", url, 0)} data-svelte="svelte-p7x5hk">`}`, ""}`;
});
var css$9 = {
  code: ".gradientBorder.svelte-zt16cv{background-clip:content-box,border-box;background-image:linear-gradient(hsla(0,0%,100%,0),hsla(0,0%,100%,0)),linear-gradient(90deg,#f14343,#7dc1f4,#f14343);background-origin:border-box;background-size:200% 200%;border:1px solid transparent}.gradientBorder.spinner.svelte-zt16cv{-webkit-animation:svelte-zt16cv-gradient 4s ease infinite;animation:svelte-zt16cv-gradient 4s ease infinite}@-webkit-keyframes svelte-zt16cv-gradient{0%{background-position:0 50%}50%{background-position:100% 50%}to{background-position:0 50%}}@keyframes svelte-zt16cv-gradient{0%{background-position:0 50%}50%{background-position:100% 50%}to{background-position:0 50%}}",
  map: `{"version":3,"file":"Button.svelte","sources":["Button.svelte"],"sourcesContent":["<script>\\n  // Button state\\n  let className = '';\\n  export { className as class };\\n  export let type = 'button';\\n  export let disabled = false;\\n  export let loading = false;\\n  export let href = null;\\n  export let target = null;\\n  export let rel = null;\\n  export let preload = false;\\n  // Button style\\n  export let kind = 'basic';\\n  export let padding = 'px-12 py-2';\\n  export let border = '';\\n  export let rounded = 'rounded-md';\\n  export let fontWeight = 'font-medium';\\n  export let textSize = 'text-sm';\\n  export let backgroundColor = '';\\n  export let size = '';\\n\\n  const kindClasses = {\\n    default:\\n      'appearance-none text-center focus:outline-none transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50',\\n    basic: 'bg-neutrals-d20 text-neutrals-l40 border border-neutrals-l30 border-opacity-20',\\n    primary: 'bg-functional-r20 text-neutrals-l00 hover:bg-functional-r30',\\n    'primary-outline': 'text-functional-r50',\\n    destructive:\\n      'bg-transparent text-neutrals-l40 border border-neutrals-l30 border-opacity-25 hover:border-opacity-50',\\n    outline:\\n      'border border-opacity-25 leading-none bg-opacity-0 hover:bg-opacity-10 hover:border-opacity-35 transition-colors',\\n    'blue-outline':\\n      'text-functional-b10 border border-neutrals-l50 border-opacity-25 leading-none bg-opacity-0 hover:bg-opacity-10 hover:border-opacity-35 transition-colors',\\n    gradient: 'relative z-0 overflow-hidden text-neutrals-l00'\\n  };\\n  if (kind === 'primary-outline') {\\n    border = 'border border-functional-r50 border-opacity-25 hover:border-opacity-50';\\n  } else if (kind === 'gradient') {\\n    if (backgroundColor === '') {\\n      backgroundColor = 'bg-neutrals-d10';\\n    }\\n  }\\n\\n  let klass;\\n  $: {\\n    const commonClasses = \`\${padding} \${border} \${rounded} \${fontWeight} \${textSize} \${backgroundColor} \${size} \${className}\`;\\n    if (kind !== 'custom') {\\n      klass = \`\${kindClasses.default} \${kindClasses[kind]} \${commonClasses}\`;\\n    } else {\\n      klass = \`\${kindClasses.default} \${commonClasses}\`;\\n    }\\n  }\\n  $: isDisabled = disabled || loading;\\n<\/script>\\n\\n{#if href}\\n  <a\\n    class=\\"inline-flex justify-center items-center {klass}\\"\\n    {href}\\n    {target}\\n    {rel}\\n    {disabled}\\n    role=\\"button\\"\\n    class:spinner={loading}\\n    class:gradientBorder={kind === 'gradient'}\\n    on:click\\n    on:mouseenter\\n    on:mouseleave\\n    {...preload ? { sveltekit: 'prefetch' } : {}}\\n  >\\n    {#if kind === 'gradient'}\\n      <span class=\\"absolute inset-0 w-full h-full -z-1 {backgroundColor}\\" />\\n    {/if}\\n\\n    <slot />\\n  </a>\\n{:else}\\n  <button\\n    {type}\\n    class={klass}\\n    class:spinner={loading}\\n    class:gradientBorder={kind === 'gradient'}\\n    disabled={isDisabled}\\n    on:click\\n    on:mouseenter\\n    on:mouseleave\\n  >\\n    {#if kind === 'gradient'}\\n      <span class=\\"absolute inset-0 w-full h-full -z-1 {backgroundColor}\\" />\\n    {/if}\\n    <slot />\\n  </button>\\n{/if}\\n\\n<style>.gradientBorder{background-clip:content-box,border-box;background-image:linear-gradient(hsla(0,0%,100%,0),hsla(0,0%,100%,0)),linear-gradient(90deg,#f14343,#7dc1f4,#f14343);background-origin:border-box;background-size:200% 200%;border:1px solid transparent}.gradientBorder.spinner{-webkit-animation:gradient 4s ease infinite;animation:gradient 4s ease infinite}@-webkit-keyframes gradient{0%{background-position:0 50%}50%{background-position:100% 50%}to{background-position:0 50%}}@keyframes gradient{0%{background-position:0 50%}50%{background-position:100% 50%}to{background-position:0 50%}}</style>\\n"],"names":[],"mappings":"AA8FO,6BAAe,CAAC,gBAAgB,WAAW,CAAC,UAAU,CAAC,iBAAiB,gBAAgB,KAAK,CAAC,CAAC,EAAE,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,EAAE,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,gBAAgB,KAAK,CAAC,OAAO,CAAC,OAAO,CAAC,OAAO,CAAC,CAAC,kBAAkB,UAAU,CAAC,gBAAgB,IAAI,CAAC,IAAI,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,WAAW,CAAC,eAAe,sBAAQ,CAAC,kBAAkB,sBAAQ,CAAC,EAAE,CAAC,IAAI,CAAC,QAAQ,CAAC,UAAU,sBAAQ,CAAC,EAAE,CAAC,IAAI,CAAC,QAAQ,CAAC,mBAAmB,sBAAQ,CAAC,EAAE,CAAC,oBAAoB,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,oBAAoB,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,oBAAoB,CAAC,CAAC,GAAG,CAAC,CAAC,WAAW,sBAAQ,CAAC,EAAE,CAAC,oBAAoB,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,oBAAoB,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,oBAAoB,CAAC,CAAC,GAAG,CAAC,CAAC"}`
};
var Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isDisabled;
  let { class: className = "" } = $$props;
  let { type = "button" } = $$props;
  let { disabled = false } = $$props;
  let { loading = false } = $$props;
  let { href = null } = $$props;
  let { target = null } = $$props;
  let { rel = null } = $$props;
  let { preload = false } = $$props;
  let { kind = "basic" } = $$props;
  let { padding = "px-12 py-2" } = $$props;
  let { border = "" } = $$props;
  let { rounded = "rounded-md" } = $$props;
  let { fontWeight = "font-medium" } = $$props;
  let { textSize = "text-sm" } = $$props;
  let { backgroundColor = "" } = $$props;
  let { size = "" } = $$props;
  const kindClasses = {
    default: "appearance-none text-center focus:outline-none transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
    basic: "bg-neutrals-d20 text-neutrals-l40 border border-neutrals-l30 border-opacity-20",
    primary: "bg-functional-r20 text-neutrals-l00 hover:bg-functional-r30",
    "primary-outline": "text-functional-r50",
    destructive: "bg-transparent text-neutrals-l40 border border-neutrals-l30 border-opacity-25 hover:border-opacity-50",
    outline: "border border-opacity-25 leading-none bg-opacity-0 hover:bg-opacity-10 hover:border-opacity-35 transition-colors",
    "blue-outline": "text-functional-b10 border border-neutrals-l50 border-opacity-25 leading-none bg-opacity-0 hover:bg-opacity-10 hover:border-opacity-35 transition-colors",
    gradient: "relative z-0 overflow-hidden text-neutrals-l00"
  };
  if (kind === "primary-outline") {
    border = "border border-functional-r50 border-opacity-25 hover:border-opacity-50";
  } else if (kind === "gradient") {
    if (backgroundColor === "") {
      backgroundColor = "bg-neutrals-d10";
    }
  }
  let klass;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.loading === void 0 && $$bindings.loading && loading !== void 0)
    $$bindings.loading(loading);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  if ($$props.rel === void 0 && $$bindings.rel && rel !== void 0)
    $$bindings.rel(rel);
  if ($$props.preload === void 0 && $$bindings.preload && preload !== void 0)
    $$bindings.preload(preload);
  if ($$props.kind === void 0 && $$bindings.kind && kind !== void 0)
    $$bindings.kind(kind);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.fontWeight === void 0 && $$bindings.fontWeight && fontWeight !== void 0)
    $$bindings.fontWeight(fontWeight);
  if ($$props.textSize === void 0 && $$bindings.textSize && textSize !== void 0)
    $$bindings.textSize(textSize);
  if ($$props.backgroundColor === void 0 && $$bindings.backgroundColor && backgroundColor !== void 0)
    $$bindings.backgroundColor(backgroundColor);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$9);
  {
    {
      const commonClasses = `${padding} ${border} ${rounded} ${fontWeight} ${textSize} ${backgroundColor} ${size} ${className}`;
      if (kind !== "custom") {
        klass = `${kindClasses.default} ${kindClasses[kind]} ${commonClasses}`;
      } else {
        klass = `${kindClasses.default} ${commonClasses}`;
      }
    }
  }
  isDisabled = disabled || loading;
  return `${href ? `<a${spread([
    {
      class: "inline-flex justify-center items-center " + escape2(klass)
    },
    { href: escape2(href) },
    { target: escape2(target) },
    { rel: escape2(rel) },
    { disabled: disabled || null },
    { role: "button" },
    preload ? { sveltekit: "prefetch" } : {}
  ], (loading ? "spinner" : "") + " " + (kind === "gradient" ? "gradientBorder" : "") + " svelte-zt16cv")}>${kind === "gradient" ? `<span class="${"absolute inset-0 w-full h-full -z-1 " + escape2(backgroundColor) + " svelte-zt16cv"}"></span>` : ``}

    ${slots.default ? slots.default({}) : ``}</a>` : `<button${add_attribute("type", type, 0)} class="${[
    escape2(null_to_empty(klass)) + " svelte-zt16cv",
    (loading ? "spinner" : "") + " " + (kind === "gradient" ? "gradientBorder" : "")
  ].join(" ").trim()}" ${isDisabled ? "disabled" : ""}>${kind === "gradient" ? `<span class="${"absolute inset-0 w-full h-full -z-1 " + escape2(backgroundColor) + " svelte-zt16cv"}"></span>` : ``}
    ${slots.default ? slots.default({}) : ``}</button>`}`;
});
var observer;
var OnIntersect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let isVisible2 = false;
  let el = null;
  let showDirectly = false;
  let scrollY;
  let isMounted = false;
  function changeVisibility(event) {
    if (!isVisible2) {
      isVisible2 = event.detail;
    }
  }
  onMount(() => {
    isMounted = true;
    showDirectly = scrollY > 0;
    observer.observe(el);
    el.addEventListener("visible", changeVisibility);
    return () => {
      observer.unobserve(el);
      el.removeEventListener("visible", changeVisibility);
    };
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `

<div${add_attribute("class", className, 0)}${add_attribute("this", el, 1)}>${isVisible2 || showDirectly ? `${slots.default ? slots.default({}) : ``}` : `<div${add_classes([isMounted ? "opacity-0" : ""].join(" ").trim())}>${slots.default ? slots.default({}) : ``}</div>`}</div>`;
});
var FeaturedCoach = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { slug } = $$props;
  let { name } = $$props;
  let { image } = $$props;
  let { bio } = $$props;
  let { startingPrice } = $$props;
  `
    <div class="flex items-center mb-4">
      <img src="${resizeImage(image, "w-8 h-8", {
    fit: "crop",
    sharpen: "1",
    quality: "100"
  }).src}" class="w-8 h-8 object-cover object-top rounded-lg mr-3" width="36" height="36" />
      <div class="flex-col">
        <h3 class="text-sm font-medium leading-none mb-1">
          ${name}
        </h3>
        <p class="text-xs text-neutrals-l40 leading-none">
          Starting at <span class="font-medium text-functional-r50">$${startingPrice}</span>
        </p>
      </div>
    </div>
    <p class="text-sm text-neutrals-l30 leading-normal mb-4">
      ${bio}
    </p>
    <a href="/@${slug}" class="text-xs font-medium text-functional-r50 uppercase tracking-0.08 leading-none" sveltekit:prefetch>
      See full profile
    </a>
  `;
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.bio === void 0 && $$bindings.bio && bio !== void 0)
    $$bindings.bio(bio);
  if ($$props.startingPrice === void 0 && $$bindings.startingPrice && startingPrice !== void 0)
    $$bindings.startingPrice(startingPrice);
  return `<a href="${"/@" + escape2(slug)}" class="${"text-neutrals-l00 hover:text-functional-r50 underline italic whitespace-nowrap"}">${escape2(name)}</a>`;
});
var css$8 = {
  code: ".featured-game.svelte-66531x.svelte-66531x{background-position:50%;background-size:cover;height:322px;padding:1px;transition-duration:.15s;transition-duration:.2s;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);width:230px}@media(min-width:1280px){.featured-game.svelte-66531x.svelte-66531x{height:480px;width:100%}}.featured-game.small.svelte-66531x.svelte-66531x{height:172px;width:100%}.featured-game.small.svelte-66531x .category.svelte-66531x{margin-bottom:.5rem;margin-top:.5rem}.featured-game.small.svelte-66531x .title.svelte-66531x{font-size:1.25rem;line-height:1.75rem;margin-bottom:1.25rem}.featured-game.small.svelte-66531x .badges.svelte-66531x{margin-top:auto}.featured-game.small.svelte-66531x .badge.svelte-66531x{font-size:.75rem;line-height:1rem;padding-bottom:.5rem;padding-top:.5rem}.featured-game.small.svelte-66531x .gradient-overlay.svelte-66531x{margin-bottom:auto;margin-top:auto;padding-left:1rem;padding-right:1rem}.featured-game.small.svelte-66531x .red-gradient-overlay.svelte-66531x{z-index:11}.featured-game.small.svelte-66531x .artwork,.featured-game.small.svelte-66531x .cutout,.featured-game.small.svelte-66531x .logotype{display:none}.featured-game.svelte-66531x.svelte-66531x:hover{background:linear-gradient(46.33deg,rgba(190,52,52,0) 3.72%,#be3434 51.18%,rgba(190,52,52,0) 98.74%)}.featured-game.svelte-66531x:hover .red-gradient-overlay.svelte-66531x{opacity:1}.category.svelte-66531x.svelte-66531x{font-size:10px}a.svelte-66531x .artwork{filter:grayscale(1)}.gradient-overlay.svelte-66531x.svelte-66531x{background:linear-gradient(180deg,#181a1e,rgba(24,26,30,0) 103.16%)}.red-gradient-overlay.svelte-66531x.svelte-66531x{background:linear-gradient(269.94deg,rgba(48,82,107,.16) -8.83%,rgba(190,51,51,.051) 46.3%,rgba(40,63,84,.16) 106.38%);z-index:9}.bottom-gradient-overlay.svelte-66531x.svelte-66531x{background:linear-gradient(180deg,#030404,rgba(24,26,30,0));height:92px;transform:rotate(-180deg);z-index:11}",
  map: `{"version":3,"file":"FeaturedGame.svelte","sources":["FeaturedGame.svelte"],"sourcesContent":["<script>\\n  import Image from '@metafy/components/Image.svelte';\\n\\n  export let game = {};\\n  export let small = false;\\n<\/script>\\n\\n<a\\n  href=\\"/{game.slug}\\"\\n  class=\\"featured-game flex text-left bg-neutrals-d10 rounded-3xl overflow-hidden focus:outline-none\\"\\n  class:small\\n>\\n  <div class=\\"flex relative w-full h-full bg-neutrals-d10 rounded-3xl\\">\\n    <!-- Background artwork -->\\n    <Image\\n      class=\\"artwork absolute top-0 left-0 w-full h-full opacity-15 object-cover object-center\\"\\n      size=\\"w-[440px] xl:w-[469px] h-full\\"\\n      rounded=\\"rounded-3xl\\"\\n      src={game.artwork}\\n      alt={game.title.en}\\n    />\\n\\n    <div class=\\"gradient-overlay relative z-10 flex w-full rounded-3xl\\">\\n      <Image\\n        class=\\"{!small ? 'hidden' : ''} object-cover rounded-2xl mr-5\\"\\n        size=\\"w-[140px] h-[140px]\\"\\n        fit=\\"crop\\"\\n        src={game.poster}\\n        alt={game.title.en}\\n      />\\n\\n      <div class=\\"flex flex-col rounded-3xl {small ? 'p-0' : 'pt-4 px-4 xl:pt-8 xl:px-6'}\\">\\n        <p\\n          class=\\"category xl:text-xs font-medium text-functional-b10 uppercase leading-none tracking-0.12 mb-2 xl:mb-4\\"\\n        >\\n          {game.category}\\n        </p>\\n        <h3\\n          class=\\"title text-xl xl:text-1.5xl font-medium text-neutrals-l00 leading-normal mb-4 xl:mb-6\\"\\n        >\\n          {game.title.en}\\n        </h3>\\n        <div class=\\"badges flex\\">\\n          <div\\n            class=\\"badge text-xs xl:text-base text-neutrals-l00 text-opacity-90 bg-neutrals-d10 -tracking-0.01 leading-none border border-neutrals-l40 border-opacity-25 rounded-md p-2 xl:p-3 mr-2 xl:mr-3\\"\\n          >\\n            <span class=\\"font-medium\\">{game.featuredCoachCount}</span>\\n            Coach{game.featuredCoachCount > 1 || game.featuredCoachCount === 0 ? 'es' : ''}\\n          </div>\\n        </div>\\n      </div>\\n    </div>\\n\\n    <div\\n      class=\\"red-gradient-overlay absolute top-0 left-0 w-full h-full rounded-3xl opacity-0 transition-opacity ease-linear duration-200\\"\\n    />\\n\\n    <!-- Logotype -->\\n    <Image\\n      class=\\"logotype absolute z-20 object-contain object-center\\"\\n      src={game.logotype}\\n      alt={game.title.en}\\n      size=\\"w-[70px] h-6.5 left-4 bottom-4 xl:w-[108px] xl:h-[39px] left-6 bottom-11.5\\"\\n    />\\n    <!-- Gradient overlay -->\\n    <div class=\\"bottom-gradient-overlay xl:hidden absolute w-full bottom-0 left-0 rounded-t-3xl\\" />\\n    <!-- Cutout -->\\n    <Image\\n      class=\\"cutout absolute z-10 bottom-0 xl:right-0 object-contain object-center xl:object-bottom rounded-br-3xl\\"\\n      size=\\"w-full h-[166px] xl:w-[246px] xl:h-[200px]\\"\\n      src={game.cutout}\\n      alt={game.title.en}\\n    />\\n  </div>\\n</a>\\n\\n<style>.featured-game{background-position:50%;background-size:cover;height:322px;padding:1px;transition-duration:.15s;transition-duration:.2s;transition-property:background-color,border-color,color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);width:230px}@media (min-width:1280px){.featured-game{height:480px;width:100%}}.featured-game.small{height:172px;width:100%}.featured-game.small .category{margin-bottom:.5rem;margin-top:.5rem}.featured-game.small .title{font-size:1.25rem;line-height:1.75rem;margin-bottom:1.25rem}.featured-game.small .badges{margin-top:auto}.featured-game.small .badge{font-size:.75rem;line-height:1rem;padding-bottom:.5rem;padding-top:.5rem}.featured-game.small .gradient-overlay{margin-bottom:auto;margin-top:auto;padding-left:1rem;padding-right:1rem}.featured-game.small .red-gradient-overlay{z-index:11}.featured-game.small :global(.artwork),.featured-game.small :global(.cutout),.featured-game.small :global(.logotype){display:none}.featured-game:hover{background:linear-gradient(46.33deg,rgba(190,52,52,0) 3.72%,#be3434 51.18%,rgba(190,52,52,0) 98.74%)}.featured-game:hover .red-gradient-overlay{opacity:1}.category{font-size:10px}a :global(.artwork){filter:grayscale(1)}.gradient-overlay{background:linear-gradient(180deg,#181a1e,rgba(24,26,30,0) 103.16%)}.red-gradient-overlay{background:linear-gradient(269.94deg,rgba(48,82,107,.16) -8.83%,rgba(190,51,51,.051) 46.3%,rgba(40,63,84,.16) 106.38%);z-index:9}.bottom-gradient-overlay{background:linear-gradient(180deg,#030404,rgba(24,26,30,0));height:92px;transform:rotate(-180deg);z-index:11}</style>\\n"],"names":[],"mappings":"AA4EO,0CAAc,CAAC,oBAAoB,GAAG,CAAC,gBAAgB,KAAK,CAAC,OAAO,KAAK,CAAC,QAAQ,GAAG,CAAC,oBAAoB,IAAI,CAAC,oBAAoB,GAAG,CAAC,oBAAoB,gBAAgB,CAAC,YAAY,CAAC,KAAK,CAAC,IAAI,CAAC,MAAM,CAAC,2BAA2B,aAAa,EAAE,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,MAAM,KAAK,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,0CAAc,CAAC,OAAO,KAAK,CAAC,MAAM,IAAI,CAAC,CAAC,cAAc,kCAAM,CAAC,OAAO,KAAK,CAAC,MAAM,IAAI,CAAC,cAAc,oBAAM,CAAC,uBAAS,CAAC,cAAc,KAAK,CAAC,WAAW,KAAK,CAAC,cAAc,oBAAM,CAAC,oBAAM,CAAC,UAAU,OAAO,CAAC,YAAY,OAAO,CAAC,cAAc,OAAO,CAAC,cAAc,oBAAM,CAAC,qBAAO,CAAC,WAAW,IAAI,CAAC,cAAc,oBAAM,CAAC,oBAAM,CAAC,UAAU,MAAM,CAAC,YAAY,IAAI,CAAC,eAAe,KAAK,CAAC,YAAY,KAAK,CAAC,cAAc,oBAAM,CAAC,+BAAiB,CAAC,cAAc,IAAI,CAAC,WAAW,IAAI,CAAC,aAAa,IAAI,CAAC,cAAc,IAAI,CAAC,cAAc,oBAAM,CAAC,mCAAqB,CAAC,QAAQ,EAAE,CAAC,cAAc,oBAAM,CAAC,AAAQ,QAAQ,AAAC,CAAC,cAAc,oBAAM,CAAC,AAAQ,OAAO,AAAC,CAAC,cAAc,oBAAM,CAAC,AAAQ,SAAS,AAAC,CAAC,QAAQ,IAAI,CAAC,0CAAc,MAAM,CAAC,WAAW,gBAAgB,QAAQ,CAAC,KAAK,GAAG,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,KAAK,GAAG,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,4BAAc,MAAM,CAAC,mCAAqB,CAAC,QAAQ,CAAC,CAAC,qCAAS,CAAC,UAAU,IAAI,CAAC,eAAC,CAAC,AAAQ,QAAQ,AAAC,CAAC,OAAO,UAAU,CAAC,CAAC,CAAC,6CAAiB,CAAC,WAAW,gBAAgB,MAAM,CAAC,OAAO,CAAC,KAAK,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,iDAAqB,CAAC,WAAW,gBAAgB,SAAS,CAAC,KAAK,EAAE,CAAC,EAAE,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,MAAM,CAAC,KAAK,GAAG,CAAC,EAAE,CAAC,EAAE,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,KAAK,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,GAAG,CAAC,CAAC,OAAO,CAAC,CAAC,QAAQ,CAAC,CAAC,oDAAwB,CAAC,WAAW,gBAAgB,MAAM,CAAC,OAAO,CAAC,KAAK,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,OAAO,IAAI,CAAC,UAAU,OAAO,OAAO,CAAC,CAAC,QAAQ,EAAE,CAAC"}`
};
var FeaturedGame = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { game = {} } = $$props;
  let { small = false } = $$props;
  if ($$props.game === void 0 && $$bindings.game && game !== void 0)
    $$bindings.game(game);
  if ($$props.small === void 0 && $$bindings.small && small !== void 0)
    $$bindings.small(small);
  $$result.css.add(css$8);
  return `<a href="${"/" + escape2(game.slug)}" class="${[
    "featured-game flex text-left bg-neutrals-d10 rounded-3xl overflow-hidden focus:outline-none svelte-66531x",
    small ? "small" : ""
  ].join(" ").trim()}"><div class="${"flex relative w-full h-full bg-neutrals-d10 rounded-3xl"}">
    ${validate_component(Image, "Image").$$render($$result, {
    class: "artwork absolute top-0 left-0 w-full h-full opacity-15 object-cover object-center",
    size: "w-[440px] xl:w-[469px] h-full",
    rounded: "rounded-3xl",
    src: game.artwork,
    alt: game.title.en
  }, {}, {})}

    <div class="${"gradient-overlay relative z-10 flex w-full rounded-3xl svelte-66531x"}">${validate_component(Image, "Image").$$render($$result, {
    class: (!small ? "hidden" : "") + " object-cover rounded-2xl mr-5",
    size: "w-[140px] h-[140px]",
    fit: "crop",
    src: game.poster,
    alt: game.title.en
  }, {}, {})}

      <div class="${"flex flex-col rounded-3xl " + escape2(small ? "p-0" : "pt-4 px-4 xl:pt-8 xl:px-6")}"><p class="${"category xl:text-xs font-medium text-functional-b10 uppercase leading-none tracking-0.12 mb-2 xl:mb-4 svelte-66531x"}">${escape2(game.category)}</p>
        <h3 class="${"title text-xl xl:text-1.5xl font-medium text-neutrals-l00 leading-normal mb-4 xl:mb-6 svelte-66531x"}">${escape2(game.title.en)}</h3>
        <div class="${"badges flex svelte-66531x"}"><div class="${"badge text-xs xl:text-base text-neutrals-l00 text-opacity-90 bg-neutrals-d10 -tracking-0.01 leading-none border border-neutrals-l40 border-opacity-25 rounded-md p-2 xl:p-3 mr-2 xl:mr-3 svelte-66531x"}"><span class="${"font-medium"}">${escape2(game.featuredCoachCount)}</span>
            Coach${escape2(game.featuredCoachCount > 1 || game.featuredCoachCount === 0 ? "es" : "")}</div></div></div></div>

    <div class="${"red-gradient-overlay absolute top-0 left-0 w-full h-full rounded-3xl opacity-0 transition-opacity ease-linear duration-200 svelte-66531x"}"></div>

    
    ${validate_component(Image, "Image").$$render($$result, {
    class: "logotype absolute z-20 object-contain object-center",
    src: game.logotype,
    alt: game.title.en,
    size: "w-[70px] h-6.5 left-4 bottom-4 xl:w-[108px] xl:h-[39px] left-6 bottom-11.5"
  }, {}, {})}
    
    <div class="${"bottom-gradient-overlay xl:hidden absolute w-full bottom-0 left-0 rounded-t-3xl svelte-66531x"}"></div>
    
    ${validate_component(Image, "Image").$$render($$result, {
    class: "cutout absolute z-10 bottom-0 xl:right-0 object-contain object-center xl:object-bottom rounded-br-3xl",
    size: "w-full h-[166px] xl:w-[246px] xl:h-[200px]",
    src: game.cutout,
    alt: game.title.en
  }, {}, {})}</div>
</a>`;
});
var css$7 = {
  code: ".session.svelte-1092fth .poly.svelte-1092fth{top:104px;z-index:0}.session.svelte-1092fth .bg.svelte-1092fth{width:327px;z-index:1}@media(min-width:768px){.session.svelte-1092fth .bg.svelte-1092fth{height:381px;width:454px}}.session.svelte-1092fth .game.svelte-1092fth{height:72.17px;left:7.22px;top:33.38px;width:310.31px;z-index:2}@media(min-width:768px){.session.svelte-1092fth .game.svelte-1092fth{height:101px;left:10px;top:46px;width:432px}}.session.svelte-1092fth .coach.svelte-1092fth{height:42px;width:42px}@media(min-width:768px){.session.svelte-1092fth .coach.svelte-1092fth{height:58px;width:58px}}.bg.svelte-1092fth.svelte-1092fth,.session.svelte-1092fth.svelte-1092fth{height:274px}@media(min-width:768px){.bg.svelte-1092fth.svelte-1092fth,.session.svelte-1092fth.svelte-1092fth{height:381px}}",
  map: `{"version":3,"file":"Session.svelte","sources":["Session.svelte"],"sourcesContent":["<script>\\n  import { onMount } from 'svelte';\\n  import { fade } from 'svelte/transition';\\n  import { parallax } from '@metafy/lib/directives/parallax.js';\\n\\n  const CHANGE_DURATION = 5000;\\n  const states = [\\n    {\\n      game: 'https://static.metafy.gg/home/session/mordhau.png',\\n      coach: 'https://static.metafy.gg/home/session/coach_1.png',\\n    },\\n    {\\n      game: 'https://static.metafy.gg/home/session/tft.png',\\n      coach: 'https://static.metafy.gg/home/session/coach_2.png',\\n    },\\n    {\\n      game: 'https://static.metafy.gg/home/session/mtg.png',\\n      coach: 'https://static.metafy.gg/home/session/coach_3.png',\\n    },\\n  ];\\n\\n  let showing = 0;\\n  $: state = states[showing];\\n\\n  onMount(() => {\\n    const intervalId = setInterval(() => {\\n      showing++;\\n      if (showing === states.length) {\\n        showing = 0;\\n      }\\n    }, CHANGE_DURATION);\\n    return () => clearInterval(intervalId);\\n  });\\n<\/script>\\n\\n<div class=\\"session flex xl:w-1/2 relative\\" use:parallax={{ y: 300, mobile: { y: 0 } }}>\\n  <img\\n    class=\\"poly hidden md:block absolute left-0\\"\\n    src=\\"https://static.metafy.gg/home/session/poly.png\\"\\n    alt=\\"Metafy - Win More\\"\\n    width=\\"194\\"\\n    height=\\"194\\"\\n  />\\n  <div class=\\"mx-auto relative\\">\\n    <img class=\\"bg relative\\" src=\\"https://static.metafy.gg/home/session/bg.png\\" alt=\\"Metafy - Win More\\" />\\n    {#key showing}\\n      <img class=\\"game absolute\\" src={state.game} transition:fade|local={{ duration: 200 }} alt=\\"Game session\\" />\\n      <img\\n        class=\\"coach absolute left-0 bottom-0\\"\\n        src={state.coach}\\n        transition:fade|local={{ duration: 200 }}\\n        alt=\\"Coach\\"\\n      />\\n    {/key}\\n  </div>\\n</div>\\n\\n<style>.session .poly{top:104px;z-index:0}.session .bg{width:327px;z-index:1}@media (min-width:768px){.session .bg{height:381px;width:454px}}.session .game{height:72.17px;left:7.22px;top:33.38px;width:310.31px;z-index:2}@media (min-width:768px){.session .game{height:101px;left:10px;top:46px;width:432px}}.session .coach{height:42px;width:42px}@media (min-width:768px){.session .coach{height:58px;width:58px}}.bg,.session{height:274px}@media (min-width:768px){.bg,.session{height:381px}}</style>\\n"],"names":[],"mappings":"AAyDO,uBAAQ,CAAC,oBAAK,CAAC,IAAI,KAAK,CAAC,QAAQ,CAAC,CAAC,uBAAQ,CAAC,kBAAG,CAAC,MAAM,KAAK,CAAC,QAAQ,CAAC,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,uBAAQ,CAAC,kBAAG,CAAC,OAAO,KAAK,CAAC,MAAM,KAAK,CAAC,CAAC,uBAAQ,CAAC,oBAAK,CAAC,OAAO,OAAO,CAAC,KAAK,MAAM,CAAC,IAAI,OAAO,CAAC,MAAM,QAAQ,CAAC,QAAQ,CAAC,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,uBAAQ,CAAC,oBAAK,CAAC,OAAO,KAAK,CAAC,KAAK,IAAI,CAAC,IAAI,IAAI,CAAC,MAAM,KAAK,CAAC,CAAC,uBAAQ,CAAC,qBAAM,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,uBAAQ,CAAC,qBAAM,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,CAAC,iCAAG,CAAC,sCAAQ,CAAC,OAAO,KAAK,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,iCAAG,CAAC,sCAAQ,CAAC,OAAO,KAAK,CAAC,CAAC"}`
};
var CHANGE_DURATION = 5e3;
var Session = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let state;
  const states = [
    {
      game: "https://static.metafy.gg/home/session/mordhau.png",
      coach: "https://static.metafy.gg/home/session/coach_1.png"
    },
    {
      game: "https://static.metafy.gg/home/session/tft.png",
      coach: "https://static.metafy.gg/home/session/coach_2.png"
    },
    {
      game: "https://static.metafy.gg/home/session/mtg.png",
      coach: "https://static.metafy.gg/home/session/coach_3.png"
    }
  ];
  let showing = 0;
  onMount(() => {
    const intervalId = setInterval(() => {
      showing++;
      if (showing === states.length) {
        showing = 0;
      }
    }, CHANGE_DURATION);
    return () => clearInterval(intervalId);
  });
  $$result.css.add(css$7);
  state = states[showing];
  return `<div class="${"session flex xl:w-1/2 relative svelte-1092fth"}"><img class="${"poly hidden md:block absolute left-0 svelte-1092fth"}" src="${"https://static.metafy.gg/home/session/poly.png"}" alt="${"Metafy - Win More"}" width="${"194"}" height="${"194"}">
  <div class="${"mx-auto relative"}"><img class="${"bg relative svelte-1092fth"}" src="${"https://static.metafy.gg/home/session/bg.png"}" alt="${"Metafy - Win More"}">
    <img class="${"game absolute svelte-1092fth"}"${add_attribute("src", state.game, 0)} alt="${"Game session"}">
      <img class="${"coach absolute left-0 bottom-0 svelte-1092fth"}"${add_attribute("src", state.coach, 0)} alt="${"Coach"}"></div>
</div>`;
});
var topGames = [
  {
    id: "21c1b417-0a53-4ef0-8d03-bded528d0fe9",
    slug: "super-smash-bros-ultimate",
    title: {
      en: "Super Smash Bros. Ultimate"
    },
    __typename: "Game"
  },
  {
    id: "4849def1-ca06-4200-b02b-08f269cf7cf5",
    slug: "super-smash-bros-melee",
    title: {
      en: "Super Smash Bros. Melee"
    },
    __typename: "Game"
  },
  {
    id: "a14a40e0-7bd2-4ee0-8131-63c76b8d61ce",
    slug: "pokemon-sword-shield",
    title: {
      en: "Pok\xE9mon Sword and Shield"
    },
    __typename: "Game"
  },
  {
    id: "8c4060b4-af1f-43a6-8eb8-cb4f2a19d513",
    slug: "magic-the-gathering-arena",
    title: {
      en: "Magic: The Gathering Arena"
    },
    __typename: "Game"
  }
];
var css$6 = {
  code: "@media(min-width:1280px){.hero.svelte-x3a71e.svelte-x3a71e{padding-top:112px}}.hero.svelte-x3a71e .hero-left.svelte-x3a71e{z-index:25}@media(min-width:1280px){.hero.svelte-x3a71e h1.svelte-x3a71e{font-size:50px;line-height:130%}}.hero.svelte-x3a71e h2.svelte-x3a71e{line-height:160%}.hero.svelte-x3a71e .start-winning-more{height:56px;width:100%}@media(min-width:768px){.hero.svelte-x3a71e .start-winning-more{height:64px;width:282px}}@media(min-width:1280px){.hero.svelte-x3a71e .absolute-video-container.svelte-x3a71e{left:53%;right:0}}@media(min-width:2000px){.hero.svelte-x3a71e .absolute-video-container.svelte-x3a71e{right:auto;width:910px}}.hero.svelte-x3a71e video.svelte-x3a71e{width:100%}@media(min-width:2000px){.hero.svelte-x3a71e video.svelte-x3a71e{max-width:910px}}@media(min-width:1280px){.hero.svelte-x3a71e .overlay.svelte-x3a71e,.hero.svelte-x3a71e video.svelte-x3a71e{border-radius:20px 0 0 20px}}@media(min-width:2000px){.hero.svelte-x3a71e .overlay.svelte-x3a71e,.hero.svelte-x3a71e video.svelte-x3a71e{border-radius:20px}}.hero.svelte-x3a71e .gradient-overlay.svelte-x3a71e{background:linear-gradient(90deg,#000 14.06%,transparent 70.05%)}.hero.svelte-x3a71e .gradient-overlay.svelte-x3a71e,.hero.svelte-x3a71e .overlay.svelte-x3a71e,.hero.svelte-x3a71e video.svelte-x3a71e{height:480px}@media(min-width:1280px){.hero.svelte-x3a71e .gradient-overlay.svelte-x3a71e,.hero.svelte-x3a71e .overlay.svelte-x3a71e,.hero.svelte-x3a71e video.svelte-x3a71e{height:420px}}.flexible-learning.svelte-x3a71e .step.svelte-x3a71e{-webkit-animation:svelte-x3a71e-bounceIn 5s infinite;animation:svelte-x3a71e-bounceIn 5s infinite;height:32px;width:32px}@media(min-width:768px){.flexible-learning.svelte-x3a71e .step.svelte-x3a71e{height:40px;width:40px}}.flexible-learning.svelte-x3a71e .step-separator.svelte-x3a71e{border-color:#798694;border-left-width:1px;margin-left:1rem;width:100%}@media(min-width:768px){.flexible-learning.svelte-x3a71e .step-separator.svelte-x3a71e{border-left-width:0;border-top-width:1px;margin-left:1.25rem;margin-right:1.25rem;margin-top:1.25rem}}@media(min-width:1280px){.flexible-learning.svelte-x3a71e .step-separator.svelte-x3a71e{border-left-width:1px;border-top-width:0;margin-left:1.25rem;margin-right:0;margin-top:.5rem}}.flexible-learning.svelte-x3a71e .step-separator.svelte-x3a71e{height:20px}@media(min-width:768px){.flexible-learning.svelte-x3a71e .step-separator.svelte-x3a71e{height:1px}}@media(min-width:1280px){.flexible-learning.svelte-x3a71e .step-separator.svelte-x3a71e{height:32px}}.flexible-learning.svelte-x3a71e .book-here{height:56px;width:250px}@media(min-width:768px){.flexible-learning.svelte-x3a71e .book-here{height:64px}}@-webkit-keyframes svelte-x3a71e-bounceIn{0%,30%,40%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{transform:scaleX(1)}10%{transform:scale3d(1.2,1.2,1.2)}15%{transform:scaleX(1)}to{transform:scaleX(1)}}@keyframes svelte-x3a71e-bounceIn{0%,30%,40%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{transform:scaleX(1)}10%{transform:scale3d(1.2,1.2,1.2)}15%{transform:scaleX(1)}to{transform:scaleX(1)}}.recent-bookings.svelte-x3a71e .background.svelte-x3a71e{height:414px}.recent-bookings.svelte-x3a71e .find-a-coach{height:56px;width:250px}@media(min-width:768px){.recent-bookings.svelte-x3a71e .find-a-coach{height:64px}}@media(min-width:1280px){}@media(min-width:1280px){}@media(min-width:768px){}@media(min-width:1280px){}@media(min-width:768px){}@media(min-width:1280px){}@media(min-width:1280px){}@media(min-width:768px){}@media(min-width:768px){}@media(min-width:768px){}@media(min-width:768px){}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<!-- <script context=\\"module\\">\\n\\timport { client, query } from '@metafy/lib/apollo';\\n\\timport { HOME_PAGE } from '@metafy/graphql/queries';\\n\\n\\texport async function preload() {\\n\\t\\tconst { data } = await client.query({ query: HOME_PAGE });\\n\\t\\treturn { cache: data };\\n\\t}\\n<\/script> -->\\n<script>\\n  import { fly } from 'svelte/transition';\\n  // import { countUp } from '@metafy/lib/transitions';\\n  // import { coachTestimonials } from './_helpers/data';\\n  import { BREAKPOINTS, STATIC_URL } from '@metafy/lib/constants';\\n\\n  import MetaTags from '@metafy/components/MetaTags.svelte';\\n  // import { Slider, Slide } from '@metafy/components/Slider.svelte';\\n  import Button from '@metafy/components/Button.svelte';\\n  // import Image from '@metafy/components/Image.svelte';\\n  // import GamePoster from '@metafy/components/GamePoster.svelte';\\n  // import Footer from '@metafy/components/Footer/Footer.svelte';\\n  // import JoinDiscordButton from '@metafy/components/JoinDiscordButton.svelte';\\n  import { open as openBrowseGames } from '@metafy/components/BrowseGamesModal.svelte';\\n  import OnIntersect from '@metafy/components/OnIntersect.svelte';\\n  // import Announcement from './_components/Announcement.svelte';\\n  import FeaturedCoach from './_components/FeaturedCoach.svelte';\\n  import FeaturedGame from './_components/FeaturedGame.svelte';\\n  // import MoreGamesButton from './_components/MoreGamesButton.svelte';\\n  import Session from './_components/Session.svelte';\\n  // import RecentBooking from './_components/RecentBooking.svelte';\\n  // import FlippablePosters from './_components/FlippablePosters.svelte';\\n  // import TwitterTestimonial from './_components/TwitterTestimonial.svelte';\\n  import { topGames } from '@metafy/lib/mock/topGames';\\n\\n  // import IconCoaches from '@metafy/assets/svgs/home/coaches.svg';\\n  // import IconGames from '@metafy/assets/svgs/home/games.svg';\\n\\n  // export let cache = {};\\n  // const response = query({ query: HOME_PAGE, data: cache });\\n\\n  let innerWidth;\\n  let gameBadgeCount;\\n\\n  $: isDesktop = innerWidth >= BREAKPOINTS.xl;\\n  // // $: games = ($response.data?.games?.edges || []).map((e) => e.node);\\n  // $: {\\n  // \\t// 15 badges on mobile.\\n  // \\tgameBadgeCount = 15;\\n  // \\tif (innerWidth >= BREAKPOINTS.md) {\\n  // \\t\\t// 20 badges on tablet.\\n  // \\t\\tgameBadgeCount = 20;\\n  // \\t}\\n  // }\\n<\/script>\\n\\n<svelte:window bind:innerWidth />\\n\\n<MetaTags\\n  pageTitle=\\"Play and Learn from the Best Pro Gamers in the World\\"\\n  description=\\"Learn from the world's best players\\"\\n/>\\n\\n<main>\\n  <!-- Hero -->\\n  <section class=\\"hero relative pt-12\\">\\n    <div class=\\"container flex\\">\\n      <div class=\\"hero-left xl:w-1/2 flex flex-col relative xl:static xl:-mt-4\\">\\n        <!-- Announcement -->\\n        <!-- {#if $response.data.announcement}\\n\\t\\t\\t\\t\\t\\t<Announcement\\n\\t\\t\\t\\t\\t\\t\\ttext={$response.data.announcement.content}\\n\\t\\t\\t\\t\\t\\t\\turl={$response.data.announcement.link}\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t{/if} -->\\n\\n        <h1\\n          class=\\"text-3xl md:text-3.5xl text-neutrals-l00 font-medium leading-tight md:leading-tight mb-3 md:mb-4 xl:mb-5\\"\\n        >\\n          <span class=\\"font-normal\\">Get coached by the</span><br />\\n          Players kicking your ass*\\n        </h1>\\n        <h2 class=\\"w-full md:w-4/5 text-base md:text-xl xl:text-1.5xl mb-8 md:mb-10\\">\\n          <span class=\\"italic\\">Metafy</span>\\n          grants you private 1-on-1 access to champion-level coaches at rates starting out at just $15/\\n          hour.\\n        </h2>\\n        <Button\\n          kind=\\"primary\\"\\n          class=\\"start-winning-more self-start uppercase leading-none tracking-0.08 whitespace-nowrap\\"\\n          on:click={openBrowseGames}\\n          fontWeight=\\"font-semibold\\"\\n          textSize=\\"text-sm md:text-base\\"\\n          padding=\\"pt-1\\">Start winning more</Button\\n        >\\n\\n        <!-- Static Content -->\\n        <p\\n          class=\\"w-11/12 md:w-full xl:w-2/3 text-center md:text-left text-sm md:text-base leading-normal text-neutrals-l30 mt-4 md:mt-5 mx-auto md:mx-0\\"\\n        >\\n          *We\u2019re talking...\\n          <FeaturedCoach\\n            slug=\\"mew2king\\"\\n            name=\\"Mew2King\\"\\n            image=\\"{STATIC_URL}/home/mew2king.jpg\\"\\n            startingPrice=\\"80\\"\\n            bio=\\"Widely considered best overall Smash Bros. player. World Record holder for most tournaments won in eSports. Forbes 30-under-30. Melee God.\\"\\n          />,\\n          <FeaturedCoach\\n            slug=\\"insaynehayne\\"\\n            name=\\"InsayneHayne\\"\\n            image=\\"{STATIC_URL}/home/insaynehayne.jpg\\"\\n            startingPrice=\\"84\\"\\n            bio=\\"2012 Rookie of the Year, Inaugural MPL player, 3 PT t8s, PT Avacyn Champion and 5-time GP Champion\\"\\n          />,\\n          <FeaturedCoach\\n            slug=\\"countlive\\"\\n            name=\\"GM Cristian Chiril\u0103\\"\\n            image=\\"{STATIC_URL}/home/countlive.jpg\\"\\n            startingPrice=\\"110\\"\\n            bio=\\"Head Coach at the University of Missouri & Former Coach of World's #2 player Fabiano Caruana. Let's take your game to the next level!\\"\\n          />, and more.\\n        </p>\\n      </div>\\n\\n      <div\\n        class=\\"absolute-video-container absolute w-full h-full xl:w-auto xl:h-auto left-0 top-0 xl:top-auto\\"\\n      >\\n        <video\\n          class=\\"object-cover flex-shrink-0\\"\\n          src=\\"https://static.metafy.gg/home/hero_video.mp4\\"\\n          loop\\n          autoplay\\n          playsinline\\n          muted\\n        />\\n        <!-- Gray overlay -->\\n        <div class=\\"overlay absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-65\\" />\\n        <div class=\\"gradient-overlay absolute z-10 top-0 left-0 w-full h-full xl:hidden\\" />\\n      </div>\\n    </div>\\n  </section>\\n\\n  <!-- Featured games -->\\n  <OnIntersect>\\n    <section class=\\"pt-52 md:pt-36 xl:pt-36\\" in:fly|local={{ y: 50, duration: 600 }}>\\n      <div class=\\"container\\">\\n        <div class=\\"md:text-center mb-6 md:mb-10 xl:mb-16\\">\\n          <h2\\n            class=\\"font-medium text-1.5xl md:text-3.25xl xl:text-3.5xl text-neutrals-l00 leading-relaxed xl:leading-none -tracking-0.01 mb-2 md:mb-3 xl:mb-6\\"\\n          >\\n            Pick your\\n            <span class=\\"text-functional-b10\\">poison</span>\\n          </h2>\\n          <p class=\\"text-sm md:text-xl text-neutrals-l40 leading-none tracking-0.01\\">\\n            <!-- (Choose from\\n\\t\\t\\t\\t\\t\\t{$response.data?.homeStats?.games}+ games and counting\u2026) -->\\n          </p>\\n        </div>\\n      </div>\\n      <div class=\\"grid xl:container\\">\\n        <div\\n          class=\\"grid gap-x-6 xl:gap-x-8 gap-y-16 grid-flow-col xl:grid-flow-row xl:grid-cols-3 xl:gris-rows-2 overflow-x-auto pl-4 md:pl-10 xl:pl-0\\"\\n        >\\n          {#each topGames.slice(0, 5) as game, idx}\\n            <FeaturedGame {game} small={isDesktop && idx > 2} />\\n          {/each}\\n          <!-- <div class=\\"hidden xl:block\\">\\n            <MoreGamesButton on:click={openBrowseGames} />\\n          </div> -->\\n        </div>\\n      </div>\\n      <!-- <div class=\\"container xl:hidden mt-5 md:mt-8\\">\\n\\t\\t\\t\\t<MoreGamesButton on:click={openBrowseGames} />\\n\\t\\t\\t</div> -->\\n    </section>\\n  </OnIntersect>\\n\\n  <!-- Flexible learning -->\\n  <OnIntersect>\\n    <section\\n      class=\\"flexible-learning container pt-16 md:pt-28 xl:pt-44 pb-32\\"\\n      in:fly|local={{ y: 50, duration: 600 }}\\n    >\\n      <div class=\\"flex flex-col-reverse xl:flex-row\\">\\n        <Session />\\n        <div class=\\"xl:w-1/2 md:text-center xl:text-left\\">\\n          <h1\\n            class=\\"font-medium text-neutrals-l00 text-1.5xl md:text-3.25xl xl:text-3.5xl leading-normal md:leading-relaxed xl:leading-relaxed -tracking-0.01 mb-3 md:mb-4\\"\\n          >\\n            Book your first session<br />\\n            <span class=\\"text-functional-b10\\">(in less than 3-minutes)</span>\\n          </h1>\\n          <p\\n            class=\\"text-sm md:text-xl text-neutrals-l40 leading-normal md:leading-normal mb-6 md:mb-14 xl:mb-10\\"\\n          >\\n            With Metafy you book your sessions, instantly, and chat<br class=\\"hidden md:block\\" />\\n            with coaches in real time\\n            <span class=\\"italic\\">(without breaking the bank).</span>\\n          </p>\\n\\n          <div\\n            class=\\"flex flex-col md:flex-row xl:flex-col space-y-1 md:space-y-0 xl:space-y-2 mb-12 md:mb-20 xl:mb-0\\"\\n          >\\n            <div class=\\"flex md:flex-col xl:flex-row items-center\\">\\n              <div\\n                class=\\"step flex bg-functional-r20 rounded-full flex-shrink-0\\"\\n                style=\\"animation-delay: 0.5s;\\"\\n              >\\n                <p\\n                  class=\\"font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto\\"\\n                >\\n                  1\\n                </p>\\n              </div>\\n              <p\\n                class=\\"text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8\\"\\n              >\\n                Choose your game.\\n              </p>\\n            </div>\\n            <div class=\\"step-separator\\" />\\n            <div class=\\"flex md:flex-col xl:flex-row items-center\\">\\n              <div\\n                class=\\"step flex bg-functional-r20 rounded-full flex-shrink-0\\"\\n                style=\\"animation-delay: 1s;\\"\\n              >\\n                <p\\n                  class=\\"font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto\\"\\n                >\\n                  2\\n                </p>\\n              </div>\\n              <p\\n                class=\\"text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8\\"\\n              >\\n                Choose your Coach.\\n              </p>\\n            </div>\\n            <div class=\\"step-separator\\" />\\n            <div class=\\"flex md:flex-col xl:flex-row items-center\\">\\n              <div\\n                class=\\"step flex bg-functional-r20 rounded-full flex-shrink-0\\"\\n                style=\\"animation-delay: 1.5s;\\"\\n              >\\n                <p\\n                  class=\\"font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto\\"\\n                >\\n                  3\\n                </p>\\n              </div>\\n              <p\\n                class=\\"text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8\\"\\n              >\\n                Choose a time.\\n              </p>\\n            </div>\\n          </div>\\n        </div>\\n      </div>\\n      <div class=\\"flex xl:w-1/2 xl:ml-auto mt-10 md:mt-16\\">\\n        <Button\\n          kind=\\"primary\\"\\n          class=\\"book-here self-start uppercase leading-none tracking-0.08 whitespace-nowrap mx-auto xl:mx-0\\"\\n          on:click={() => console.log('openBrowseGames')}\\n          fontWeight=\\"font-semibold\\"\\n          textSize=\\"text-sm md:text-base\\"\\n          padding=\\"pt-1\\">Book, here.</Button\\n        >\\n      </div>\\n    </section>\\n  </OnIntersect>\\n\\n  <!-- Recent bookings -->\\n  <OnIntersect>\\n    <section\\n      class=\\"recent-bookings relative pt-8 md:pt-14 xl:pt-24\\"\\n      in:fly|local={{ y: 50, duration: 600 }}\\n    >\\n      <div class=\\"background absolute top-0 left-0 w-full bg-neutrals-d10\\" />\\n      <div class=\\"container flex flex-col relative z-10\\">\\n        <div class=\\"md:text-center mb-10 md:mb-14 xl:mb-16\\">\\n          <h1\\n            class=\\"font-medium text-1.5xl md:text-3.25xl xl:text-3.5xl text-neutrals-l00 -tracking-0.01 leading-tight mb-4\\"\\n          >\\n            While you\u2019ve been reading,<br />\\n            <span class=\\"font-medium\\">your competition has been busy</span>\\n          </h1>\\n          <p\\n            class=\\"md:w-3/4 xl:w-1/2 text-sm md:text-xl text-neutrals-l40 leading-normal tracking-0.01 md:mx-auto\\"\\n          >\\n            Here are the coaches your rivals have been training under while you\u2019ve been scrolling\\n            this page.\\n          </p>\\n        </div>\\n\\n        <!-- {#if $response.data.recentBookings.length > 1}\\n\\t\\t\\t\\t\\t<Slider\\n\\t\\t\\t\\t\\t\\tloop\\n\\t\\t\\t\\t\\t\\tnavigation\\n\\t\\t\\t\\t\\t\\tgrabCursor\\n\\t\\t\\t\\t\\t\\tslidesPerView={1}\\n\\t\\t\\t\\t\\t\\tbreakpoints={{\\n\\t\\t\\t\\t\\t\\t\\t[BREAKPOINTS.md]: { slidesPerView: 2 },\\n\\t\\t\\t\\t\\t\\t\\t[BREAKPOINTS.xl]: { slidesPerView: 3 },\\n\\t\\t\\t\\t\\t\\t\\t1367: { slidesPerView: 4 }\\n\\t\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t{#each $response.data.recentBookings as booking (booking.id)}\\n\\t\\t\\t\\t\\t\\t\\t<Slide>\\n\\t\\t\\t\\t\\t\\t\\t\\t<RecentBooking {booking} />\\n\\t\\t\\t\\t\\t\\t\\t</Slide>\\n\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t</Slider>\\n\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t{#each $response.data.recentBookings as booking (booking.id)}\\n\\t\\t\\t\\t\\t\\t<RecentBooking {booking} />\\n\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t{/if} -->\\n\\n        <div class=\\"flex flex-col mx-auto mt-8 xl:mt-14\\">\\n          <Button\\n            kind=\\"primary\\"\\n            class=\\"find-a-coach self-start uppercase leading-none tracking-0.08 whitespace-nowrap mx-auto\\"\\n            on:click={() => console.log('openBrowseGames')}\\n            fontWeight=\\"font-semibold\\"\\n            textSize=\\"text-sm md:text-base\\"\\n            padding=\\"pt-1\\">Find a Coach</Button\\n          >\\n          <p\\n            class=\\"w-2/3 md:w-full text-center text-neutrals-l40 italic mt-4 md:mt-5 mx-auto md:mx-0\\"\\n          >\\n            <!-- Did we mention we have {$response.data?.homeStats?.coaches}+ coaches to choose from? -->\\n          </p>\\n        </div>\\n      </div>\\n    </section>\\n  </OnIntersect>\\n</main>\\n\\n<!-- <Footer /> -->\\n<style>@media (min-width:1280px){.hero{padding-top:112px}}.hero .hero-left{z-index:25}@media (min-width:1280px){.hero h1{font-size:50px;line-height:130%}}.hero h2{line-height:160%}.hero :global(.start-winning-more){height:56px;width:100%}@media (min-width:768px){.hero :global(.start-winning-more){height:64px;width:282px}}@media (min-width:1280px){.hero .absolute-video-container{left:53%;right:0}}@media (min-width:2000px){.hero .absolute-video-container{right:auto;width:910px}}.hero video{width:100%}@media (min-width:2000px){.hero video{max-width:910px}}@media (min-width:1280px){.hero .overlay,.hero video{border-radius:20px 0 0 20px}}@media (min-width:2000px){.hero .overlay,.hero video{border-radius:20px}}.hero .gradient-overlay{background:linear-gradient(90deg,#000 14.06%,transparent 70.05%)}.hero .gradient-overlay,.hero .overlay,.hero video{height:480px}@media (min-width:1280px){.hero .gradient-overlay,.hero .overlay,.hero video{height:420px}.hero .hero-testimonial{left:57%;top:438px;width:384px}}.flexible-learning .step{-webkit-animation:bounceIn 5s infinite;animation:bounceIn 5s infinite;height:32px;width:32px}@media (min-width:768px){.flexible-learning .step{height:40px;width:40px}}.flexible-learning .step-separator{border-color:#798694;border-left-width:1px;margin-left:1rem;width:100%}@media (min-width:768px){.flexible-learning .step-separator{border-left-width:0;border-top-width:1px;margin-left:1.25rem;margin-right:1.25rem;margin-top:1.25rem}}@media (min-width:1280px){.flexible-learning .step-separator{border-left-width:1px;border-top-width:0;margin-left:1.25rem;margin-right:0;margin-top:.5rem}}.flexible-learning .step-separator{height:20px}@media (min-width:768px){.flexible-learning .step-separator{height:1px}}@media (min-width:1280px){.flexible-learning .step-separator{height:32px}}.flexible-learning :global(.book-here){height:56px;width:250px}@media (min-width:768px){.flexible-learning :global(.book-here){height:64px}}@-webkit-keyframes bounceIn{0%,30%,40%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{transform:scaleX(1)}10%{transform:scale3d(1.2,1.2,1.2)}15%{transform:scaleX(1)}to{transform:scaleX(1)}}@keyframes bounceIn{0%,30%,40%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{transform:scaleX(1)}10%{transform:scale3d(1.2,1.2,1.2)}15%{transform:scaleX(1)}to{transform:scaleX(1)}}.recent-bookings .background{height:414px}.recent-bookings :global(.find-a-coach){height:56px;width:250px}@media (min-width:768px){.recent-bookings :global(.find-a-coach){height:64px}}.stat .icon-box{height:85px;width:85px}@media (min-width:1280px){.stat .icon-box{height:120px;width:120px}}.stat .icon-box :global(svg){height:30px;width:34px}@media (min-width:1280px){.stat .icon-box :global(svg){height:45px;width:50px}}.social{background-image:url(https://static.metafy.gg/home/social_bg.png);background-position-x:255px;background-position-y:0;background-repeat:no-repeat;background-size:610px}@media (min-width:768px){.social{background-position-x:right;background-size:400px}}@media (min-width:1280px){.social{background-size:520px}}.coaching-everything{height:600px}@media (min-width:768px){.coaching-everything{height:985px}}.coaching-everything video{filter:grayscale(1);opacity:.4}.coaching-everything .overlay-gradient-top{background:linear-gradient(180deg,rgba(3,4,4,0),#030404 85.03%);height:364px;left:0;pointer-events:none;position:absolute;top:0;transform:rotate(-180deg);width:100%;z-index:1}.coaching-everything .overlay-gradient-bottom{background:linear-gradient(180deg,rgba(3,4,4,0),#030404 89.97%);bottom:0;height:364px;left:0;pointer-events:none;position:absolute;width:100%;z-index:1}.coaching-everything h2{line-height:130%}@media (min-width:1280px){.coaching-everything .coaching-card{height:460px}}.game-badges .game-badges-wrap{margin-left:-50%;width:180%}@media (min-width:1280px){.game-badges .game-badges-wrap{margin-left:0;width:auto}}.game-badges .overlay-gradient-top{transform:rotate(-180deg)}.game-badges .overlay-gradient-bottom,.game-badges .overlay-gradient-top{background:linear-gradient(180deg,rgba(3,4,4,0) 21.04%,rgba(3,4,4,.501) 60.59%,#030404);height:240px}.game-badges :global(.browse-all-games){height:56px;width:250px}@media (min-width:768px){.game-badges :global(.browse-all-games){height:64px}}.coach-testimonials :global(.wanna-coach){background-color:transparent;border-color:#f14343;border-width:1px;color:#f14343;height:56px;width:250px}@media (min-width:768px){.coach-testimonials :global(.wanna-coach){height:64px}}.coach-testimonials .testimonials{height:720px}@media (min-width:768px){.coach-testimonials .testimonials{height:500px}}.coach-testimonials .coach-tweets{height:400px}@media (min-width:768px){.coach-testimonials .coach-tweets{height:100%}}.coach-testimonials .coach-tweets :global(.swiper-container){width:100%}</style>\\n"],"names":[],"mappings":"AAoVO,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,iCAAK,CAAC,YAAY,KAAK,CAAC,CAAC,mBAAK,CAAC,wBAAU,CAAC,QAAQ,EAAE,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,mBAAK,CAAC,gBAAE,CAAC,UAAU,IAAI,CAAC,YAAY,IAAI,CAAC,CAAC,mBAAK,CAAC,gBAAE,CAAC,YAAY,IAAI,CAAC,mBAAK,CAAC,AAAQ,mBAAmB,AAAC,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,mBAAK,CAAC,AAAQ,mBAAmB,AAAC,CAAC,OAAO,IAAI,CAAC,MAAM,KAAK,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,mBAAK,CAAC,uCAAyB,CAAC,KAAK,GAAG,CAAC,MAAM,CAAC,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,mBAAK,CAAC,uCAAyB,CAAC,MAAM,IAAI,CAAC,MAAM,KAAK,CAAC,CAAC,mBAAK,CAAC,mBAAK,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,mBAAK,CAAC,mBAAK,CAAC,UAAU,KAAK,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,mBAAK,CAAC,sBAAQ,CAAC,mBAAK,CAAC,mBAAK,CAAC,cAAc,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,mBAAK,CAAC,sBAAQ,CAAC,mBAAK,CAAC,mBAAK,CAAC,cAAc,IAAI,CAAC,CAAC,mBAAK,CAAC,+BAAiB,CAAC,WAAW,gBAAgB,KAAK,CAAC,IAAI,CAAC,MAAM,CAAC,WAAW,CAAC,MAAM,CAAC,CAAC,mBAAK,CAAC,+BAAiB,CAAC,mBAAK,CAAC,sBAAQ,CAAC,mBAAK,CAAC,mBAAK,CAAC,OAAO,KAAK,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,mBAAK,CAAC,+BAAiB,CAAC,mBAAK,CAAC,sBAAQ,CAAC,mBAAK,CAAC,mBAAK,CAAC,OAAO,KAAK,CAAC,AAAuD,CAAC,gCAAkB,CAAC,mBAAK,CAAC,kBAAkB,sBAAQ,CAAC,EAAE,CAAC,QAAQ,CAAC,UAAU,sBAAQ,CAAC,EAAE,CAAC,QAAQ,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,gCAAkB,CAAC,mBAAK,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,CAAC,gCAAkB,CAAC,6BAAe,CAAC,aAAa,OAAO,CAAC,kBAAkB,GAAG,CAAC,YAAY,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,gCAAkB,CAAC,6BAAe,CAAC,kBAAkB,CAAC,CAAC,iBAAiB,GAAG,CAAC,YAAY,OAAO,CAAC,aAAa,OAAO,CAAC,WAAW,OAAO,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,gCAAkB,CAAC,6BAAe,CAAC,kBAAkB,GAAG,CAAC,iBAAiB,CAAC,CAAC,YAAY,OAAO,CAAC,aAAa,CAAC,CAAC,WAAW,KAAK,CAAC,CAAC,gCAAkB,CAAC,6BAAe,CAAC,OAAO,IAAI,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,gCAAkB,CAAC,6BAAe,CAAC,OAAO,GAAG,CAAC,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,gCAAkB,CAAC,6BAAe,CAAC,OAAO,IAAI,CAAC,CAAC,gCAAkB,CAAC,AAAQ,UAAU,AAAC,CAAC,OAAO,IAAI,CAAC,MAAM,KAAK,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,gCAAkB,CAAC,AAAQ,UAAU,AAAC,CAAC,OAAO,IAAI,CAAC,CAAC,mBAAmB,sBAAQ,CAAC,EAAE,CAAC,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,kCAAkC,aAAa,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,0BAA0B,aAAa,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,CAAC,WAAW,sBAAQ,CAAC,EAAE,CAAC,GAAG,CAAC,GAAG,CAAC,EAAE,CAAC,kCAAkC,aAAa,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,0BAA0B,aAAa,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,QAAQ,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,CAAC,CAAC,CAAC,CAAC,8BAAgB,CAAC,yBAAW,CAAC,OAAO,KAAK,CAAC,8BAAgB,CAAC,AAAQ,aAAa,AAAC,CAAC,OAAO,IAAI,CAAC,MAAM,KAAK,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,8BAAgB,CAAC,AAAQ,aAAa,AAAC,CAAC,OAAO,IAAI,CAAC,CAAC,AAAuC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAyC,CAAC,AAAoD,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAoD,CAAC,AAAgL,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,AAA0D,CAAC,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAA8B,CAAC,AAAkC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,AAAkC,CAAC,AAAmgB,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAiD,CAAC,AAA2D,MAAM,AAAC,WAAW,MAAM,CAAC,CAAC,AAAwD,CAAC,AAA2S,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,AAAoD,CAAC,AAAmJ,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,AAAsD,CAAC,AAA+C,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,AAA+C,CAAC,AAA+C,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,AAA8C,CAAC"}`
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isDesktop;
  let innerWidth;
  $$result.css.add(css$6);
  isDesktop = innerWidth >= BREAKPOINTS.xl;
  return `




${validate_component(MetaTags, "MetaTags").$$render($$result, {
    pageTitle: "Play and Learn from the Best Pro Gamers in the World",
    description: "Learn from the world's best players"
  }, {}, {})}

<main>
  <section class="${"hero relative pt-12 svelte-x3a71e"}"><div class="${"container flex"}"><div class="${"hero-left xl:w-1/2 flex flex-col relative xl:static xl:-mt-4 svelte-x3a71e"}">
        

        <h1 class="${"text-3xl md:text-3.5xl text-neutrals-l00 font-medium leading-tight md:leading-tight mb-3 md:mb-4 xl:mb-5 svelte-x3a71e"}"><span class="${"font-normal"}">Get coached by the</span><br>
          Players kicking your ass*
        </h1>
        <h2 class="${"w-full md:w-4/5 text-base md:text-xl xl:text-1.5xl mb-8 md:mb-10 svelte-x3a71e"}"><span class="${"italic"}">Metafy</span>
          grants you private 1-on-1 access to champion-level coaches at rates starting out at just $15/
          hour.
        </h2>
        ${validate_component(Button, "Button").$$render($$result, {
    kind: "primary",
    class: "start-winning-more self-start uppercase leading-none tracking-0.08 whitespace-nowrap",
    fontWeight: "font-semibold",
    textSize: "text-sm md:text-base",
    padding: "pt-1"
  }, {}, { default: () => `Start winning more` })}

        
        <p class="${"w-11/12 md:w-full xl:w-2/3 text-center md:text-left text-sm md:text-base leading-normal text-neutrals-l30 mt-4 md:mt-5 mx-auto md:mx-0"}">*We\u2019re talking...
          ${validate_component(FeaturedCoach, "FeaturedCoach").$$render($$result, {
    slug: "mew2king",
    name: "Mew2King",
    image: STATIC_URL + "/home/mew2king.jpg",
    startingPrice: "80",
    bio: "Widely considered best overall Smash Bros. player. World Record holder for most tournaments won in eSports. Forbes 30-under-30. Melee God."
  }, {}, {})},
          ${validate_component(FeaturedCoach, "FeaturedCoach").$$render($$result, {
    slug: "insaynehayne",
    name: "InsayneHayne",
    image: STATIC_URL + "/home/insaynehayne.jpg",
    startingPrice: "84",
    bio: "2012 Rookie of the Year, Inaugural MPL player, 3 PT t8s, PT Avacyn Champion and 5-time GP Champion"
  }, {}, {})},
          ${validate_component(FeaturedCoach, "FeaturedCoach").$$render($$result, {
    slug: "countlive",
    name: "GM Cristian Chiril\u0103",
    image: STATIC_URL + "/home/countlive.jpg",
    startingPrice: "110",
    bio: "Head Coach at the University of Missouri & Former Coach of World's #2 player Fabiano Caruana. Let's take your game to the next level!"
  }, {}, {})}, and more.
        </p></div>

      <div class="${"absolute-video-container absolute w-full h-full xl:w-auto xl:h-auto left-0 top-0 xl:top-auto svelte-x3a71e"}"><video class="${"object-cover flex-shrink-0 svelte-x3a71e"}" src="${"https://static.metafy.gg/home/hero_video.mp4"}" loop autoplay playsinline muted></video>
        
        <div class="${"overlay absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-65 svelte-x3a71e"}"></div>
        <div class="${"gradient-overlay absolute z-10 top-0 left-0 w-full h-full xl:hidden svelte-x3a71e"}"></div></div></div></section>

  
  ${validate_component(OnIntersect, "OnIntersect").$$render($$result, {}, {}, {
    default: () => `<section class="${"pt-52 md:pt-36 xl:pt-36"}"><div class="${"container"}"><div class="${"md:text-center mb-6 md:mb-10 xl:mb-16"}"><h2 class="${"font-medium text-1.5xl md:text-3.25xl xl:text-3.5xl text-neutrals-l00 leading-relaxed xl:leading-none -tracking-0.01 mb-2 md:mb-3 xl:mb-6"}">Pick your
            <span class="${"text-functional-b10"}">poison</span></h2>
          <p class="${"text-sm md:text-xl text-neutrals-l40 leading-none tracking-0.01"}"></p></div></div>
      <div class="${"grid xl:container"}"><div class="${"grid gap-x-6 xl:gap-x-8 gap-y-16 grid-flow-col xl:grid-flow-row xl:grid-cols-3 xl:gris-rows-2 overflow-x-auto pl-4 md:pl-10 xl:pl-0"}">${each(topGames.slice(0, 5), (game, idx) => `${validate_component(FeaturedGame, "FeaturedGame").$$render($$result, { game, small: isDesktop && idx > 2 }, {}, {})}`)}
          </div></div>
      </section>`
  })}

  
  ${validate_component(OnIntersect, "OnIntersect").$$render($$result, {}, {}, {
    default: () => `<section class="${"flexible-learning container pt-16 md:pt-28 xl:pt-44 pb-32 svelte-x3a71e"}"><div class="${"flex flex-col-reverse xl:flex-row"}">${validate_component(Session, "Session").$$render($$result, {}, {}, {})}
        <div class="${"xl:w-1/2 md:text-center xl:text-left"}"><h1 class="${"font-medium text-neutrals-l00 text-1.5xl md:text-3.25xl xl:text-3.5xl leading-normal md:leading-relaxed xl:leading-relaxed -tracking-0.01 mb-3 md:mb-4"}">Book your first session<br>
            <span class="${"text-functional-b10"}">(in less than 3-minutes)</span></h1>
          <p class="${"text-sm md:text-xl text-neutrals-l40 leading-normal md:leading-normal mb-6 md:mb-14 xl:mb-10"}">With Metafy you book your sessions, instantly, and chat<br class="${"hidden md:block"}">
            with coaches in real time
            <span class="${"italic"}">(without breaking the bank).</span></p>

          <div class="${"flex flex-col md:flex-row xl:flex-col space-y-1 md:space-y-0 xl:space-y-2 mb-12 md:mb-20 xl:mb-0"}"><div class="${"flex md:flex-col xl:flex-row items-center"}"><div class="${"step flex bg-functional-r20 rounded-full flex-shrink-0 svelte-x3a71e"}" style="${"animation-delay: 0.5s;"}"><p class="${"font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto"}">1
                </p></div>
              <p class="${"text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8"}">Choose your game.
              </p></div>
            <div class="${"step-separator svelte-x3a71e"}"></div>
            <div class="${"flex md:flex-col xl:flex-row items-center"}"><div class="${"step flex bg-functional-r20 rounded-full flex-shrink-0 svelte-x3a71e"}" style="${"animation-delay: 1s;"}"><p class="${"font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto"}">2
                </p></div>
              <p class="${"text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8"}">Choose your Coach.
              </p></div>
            <div class="${"step-separator svelte-x3a71e"}"></div>
            <div class="${"flex md:flex-col xl:flex-row items-center"}"><div class="${"step flex bg-functional-r20 rounded-full flex-shrink-0 svelte-x3a71e"}" style="${"animation-delay: 1.5s;"}"><p class="${"font-medium text-base md:text-xl text-neutrals-l00 -tracking-0.01 leading-none m-auto"}">3
                </p></div>
              <p class="${"text-base xl:text-1.5xl text-neutrals-l00 -tracking-0.01 ml-4 md:ml-0 md:mt-3 xl:mt-0 xl:ml-8"}">Choose a time.
              </p></div></div></div></div>
      <div class="${"flex xl:w-1/2 xl:ml-auto mt-10 md:mt-16"}">${validate_component(Button, "Button").$$render($$result, {
      kind: "primary",
      class: "book-here self-start uppercase leading-none tracking-0.08 whitespace-nowrap mx-auto xl:mx-0",
      fontWeight: "font-semibold",
      textSize: "text-sm md:text-base",
      padding: "pt-1"
    }, {}, { default: () => `Book, here.` })}</div></section>`
  })}

  
  ${validate_component(OnIntersect, "OnIntersect").$$render($$result, {}, {}, {
    default: () => `<section class="${"recent-bookings relative pt-8 md:pt-14 xl:pt-24 svelte-x3a71e"}"><div class="${"background absolute top-0 left-0 w-full bg-neutrals-d10 svelte-x3a71e"}"></div>
      <div class="${"container flex flex-col relative z-10"}"><div class="${"md:text-center mb-10 md:mb-14 xl:mb-16"}"><h1 class="${"font-medium text-1.5xl md:text-3.25xl xl:text-3.5xl text-neutrals-l00 -tracking-0.01 leading-tight mb-4"}">While you\u2019ve been reading,<br>
            <span class="${"font-medium"}">your competition has been busy</span></h1>
          <p class="${"md:w-3/4 xl:w-1/2 text-sm md:text-xl text-neutrals-l40 leading-normal tracking-0.01 md:mx-auto"}">Here are the coaches your rivals have been training under while you\u2019ve been scrolling
            this page.
          </p></div>

        

        <div class="${"flex flex-col mx-auto mt-8 xl:mt-14"}">${validate_component(Button, "Button").$$render($$result, {
      kind: "primary",
      class: "find-a-coach self-start uppercase leading-none tracking-0.08 whitespace-nowrap mx-auto",
      fontWeight: "font-semibold",
      textSize: "text-sm md:text-base",
      padding: "pt-1"
    }, {}, { default: () => `Find a Coach` })}
          <p class="${"w-2/3 md:w-full text-center text-neutrals-l40 italic mt-4 md:mt-5 mx-auto md:mx-0"}"></p></div></div></section>`
  })}</main>

`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var featuredCourse = {
  category: "Strategy",
  description: "Everything you need to know to master an intensive training plan to dramatically improve Marth.",
  instructor: {
    name: "Magnus Carlsen"
  },
  title: {
    en: "Learn the Queens Gambit: Cambridge Springs and Orthodox Defense"
  }
};
var highlightedCourses = [
  {
    category: "Gaming",
    description: "Everything you need to know to master an intensive training plan to dramatically improve Marth.",
    instructor: {
      name: "Mew2King",
      picture: "/img/mew2king.png"
    },
    title: {
      en: "Master Marth: The Exceptional Swordfighter"
    }
  },
  {
    category: "Gaming",
    description: "Over the course of 8 weeks, I\u2019ll teach you everything you need to know to master an intensive training plan to dramatically improve your overall smash gameplay.",
    instructor: {
      name: "MkLeo",
      picture: "/img/mkleo.png"
    },
    title: {
      en: "Mastering Joker"
    }
  }
];
var courses = [
  {
    bgPoster: "/img/chess-bg.svg",
    category: "Strategy",
    description: "",
    lessonCount: 6,
    instructor: {
      name: "Countlive",
      picture: "/img/countlive.png"
    },
    poster: "/img/chess.jpg",
    title: {
      en: "Learn Chess: From Beginner to Advanced at Warp Speed"
    }
  },
  {
    bgPoster: "",
    category: "Cooking",
    description: "",
    lessonCount: 6,
    instructor: {
      name: "John",
      picture: ""
    },
    poster: "/img/spoons.png",
    title: {
      en: "Learn All the Basics of Cooking"
    }
  },
  {
    bgPoster: "",
    category: "Gaming",
    description: "",
    lessonCount: 6,
    instructor: {
      name: "Mew2King",
      picture: ""
    },
    poster: "/img/marth.png",
    title: {
      en: "Intro to Super Smash Bros. Melee"
    }
  },
  {
    bgPoster: "",
    category: "Music",
    description: "",
    lessonCount: 6,
    instructor: {
      name: "John",
      picture: ""
    },
    poster: "/img/piano.png",
    title: {
      en: "Incredible New Way To Learn Piano & Keyboard"
    }
  }
];
var spotlight = {
  name: "MkLeo",
  picture: "/img/mkleo.png"
};
var css$5 = {
  code: ".my-container.svelte-1ykbv5v{min-width:357.33px}",
  map: `{"version":3,"file":"BigCourse.svelte","sources":["BigCourse.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Image from '@metafy/components/Image.svelte';\\r\\n;\\r\\nlet className = '';\\r\\nexport { className as class };\\r\\nexport let course;\\r\\n<\/script>\\r\\n\\r\\n<!-- TODO: Add hover state -->\\r\\n<a\\r\\n  class=\\"{className} bg-neutrals-d01 flex flex-col justify-between overflow-hidden px-5 py-6 md:p-8 xl:pt-10 rounded-xl relative \\"\\r\\n  href=\\"/\\"\\r\\n>\\r\\n  <!-- <Image\\r\\n      class=\\"object-cover rounded-2xl mr-5\\"\\r\\n      size=\\"w-[140px] h-[140px]\\"\\r\\n      fit=\\"crop\\"\\r\\n      src={course.poster}\\r\\n      alt={course.title.en}\\r\\n    /> -->\\r\\n\\r\\n  <!-- Gradient & Background-->\\r\\n  <div class=\\"absolute top-1/2 right-0 bg-gradient-to-b from-neutrals-d01 w-full h-1/2\\" />\\r\\n  <Image\\r\\n    class=\\"absolute top-1/2 right-0 w-full h-full object-cover object-center\\"\\r\\n    size=\\"w-[440px] xl:w-[469px] h-full\\"\\r\\n    rounded=\\"rounded-xl\\"\\r\\n    src={course.bgPoster}\\r\\n    alt={course.bgPoster}\\r\\n  />\\r\\n\\r\\n  <!-- Main Content -->\\r\\n  <p\\r\\n    class=\\"font-bold leading-none mb-4 xl:mb-8 text-brands-metafy-alt text-xs md:text-sm tracking-0.12 uppercase\\"\\r\\n  >\\r\\n    {course.category}\\r\\n  </p>\\r\\n  <h3\\r\\n    class=\\"leading-7 md:leading-9.75 mb-5 md:mb-6 xl:mb-8.5 text-neutrals-l00 text-xl md:text-2.5xl tracking-0.02 z-1\\"\\r\\n  >\\r\\n    {course.title.en}\\r\\n  </h3>\\r\\n  <div class=\\"flex z-1\\">\\r\\n    <Image\\r\\n      class=\\"mr-5 object-cover rounded-xl w-10 md:w-14 h-10 md:h-14\\"\\r\\n      src={course.instructor.picture}\\r\\n      alt={course.title.en}\\r\\n    />\\r\\n    <div class=\\"flex flex-col justify-between mt-0.5 md:mt-2.5 mb-0.5 md:mb-1\\">\\r\\n      <p class=\\"leading-none text-base text-neutrals-l00 tracking-0.01\\">\\r\\n        {course.instructor.name}\\r\\n      </p>\\r\\n      <p class=\\"leading-none text-neutrals-l01 text-sm md:text-base tracking-0.01\\">\\r\\n        {course.lessonCount} lessons\\r\\n      </p>\\r\\n    </div>\\r\\n  </div>\\r\\n</a>\\r\\n\\r\\n<style>.my-container{min-width:357.33px}</style>\\r\\n"],"names":[],"mappings":"AA0DO,4BAAa,CAAC,UAAU,QAAQ,CAAC"}`
};
var BigCourse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { course } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.course === void 0 && $$bindings.course && course !== void 0)
    $$bindings.course(course);
  $$result.css.add(css$5);
  return `
<a class="${escape2(className) + " bg-neutrals-d01 flex flex-col justify-between overflow-hidden px-5 py-6 md:p-8 xl:pt-10 rounded-xl relative  svelte-1ykbv5v"}" href="${"/"}">

  
  <div class="${"absolute top-1/2 right-0 bg-gradient-to-b from-neutrals-d01 w-full h-1/2"}"></div>
  ${validate_component(Image, "Image").$$render($$result, {
    class: "absolute top-1/2 right-0 w-full h-full object-cover object-center",
    size: "w-[440px] xl:w-[469px] h-full",
    rounded: "rounded-xl",
    src: course.bgPoster,
    alt: course.bgPoster
  }, {}, {})}

  
  <p class="${"font-bold leading-none mb-4 xl:mb-8 text-brands-metafy-alt text-xs md:text-sm tracking-0.12 uppercase"}">${escape2(course.category)}</p>
  <h3 class="${"leading-7 md:leading-9.75 mb-5 md:mb-6 xl:mb-8.5 text-neutrals-l00 text-xl md:text-2.5xl tracking-0.02 z-1"}">${escape2(course.title.en)}</h3>
  <div class="${"flex z-1"}">${validate_component(Image, "Image").$$render($$result, {
    class: "mr-5 object-cover rounded-xl w-10 md:w-14 h-10 md:h-14",
    src: course.instructor.picture,
    alt: course.title.en
  }, {}, {})}
    <div class="${"flex flex-col justify-between mt-0.5 md:mt-2.5 mb-0.5 md:mb-1"}"><p class="${"leading-none text-base text-neutrals-l00 tracking-0.01"}">${escape2(course.instructor.name)}</p>
      <p class="${"leading-none text-neutrals-l01 text-sm md:text-base tracking-0.01"}">${escape2(course.lessonCount)} lessons
      </p></div></div>
</a>`;
});
var css$4 = {
  code: ".featured-course.svelte-p0st5f{background:linear-gradient(98.72deg,#b8dcfe 15.96%,#ffbeb0 83.28%);-webkit-background-clip:text;background-clip:text;color:transparent}",
  map: `{"version":3,"file":"FeaturedCourse.svelte","sources":["FeaturedCourse.svelte"],"sourcesContent":["<script lang=\\"ts\\">;\\r\\nlet className = '';\\r\\nexport { className as class };\\r\\nexport let course;\\r\\n<\/script>\\r\\n\\r\\n<!-- TODO: Add hover state or button for clickthrough -->\\r\\n<a\\r\\n  class=\\"{className} bg-neutrals-d02 col-span-2 flex flex-col px-5 py-6 md:p-8 xl:p-10 rounded-xl\\"\\r\\n  href=\\"/\\"\\r\\n>\\r\\n  <!-- <Image\\r\\n        class=\\"object-cover rounded-2xl mr-5\\"\\r\\n        size=\\"w-[140px] h-[140px]\\"\\r\\n        fit=\\"crop\\"\\r\\n        src={course.poster}\\r\\n        alt={course.title.en}\\r\\n      /> -->\\r\\n  <p class=\\"font-bold leading-none mb-6 text-neutrals-l00 text-sm tracking-0.12 uppercase\\">\\r\\n    Featured\\r\\n  </p>\\r\\n  <h3 class=\\"featured-course leading-13 mb-4 text-4xl tracking-0.01\\">\\r\\n    {course.title.en}\\r\\n  </h3>\\r\\n  <p text-neutrals-l01>\\r\\n    {course.description}\\r\\n  </p>\\r\\n</a>\\r\\n\\r\\n<style>.featured-course{background:linear-gradient(98.72deg,#b8dcfe 15.96%,#ffbeb0 83.28%);-webkit-background-clip:text;background-clip:text;color:transparent}</style>\\r\\n"],"names":[],"mappings":"AA6BO,8BAAgB,CAAC,WAAW,gBAAgB,QAAQ,CAAC,OAAO,CAAC,MAAM,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,wBAAwB,IAAI,CAAC,gBAAgB,IAAI,CAAC,MAAM,WAAW,CAAC"}`
};
var FeaturedCourse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { course } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.course === void 0 && $$bindings.course && course !== void 0)
    $$bindings.course(course);
  $$result.css.add(css$4);
  return `
<a class="${escape2(className) + " bg-neutrals-d02 col-span-2 flex flex-col px-5 py-6 md:p-8 xl:p-10 rounded-xl svelte-p0st5f"}" href="${"/"}">
  <p class="${"font-bold leading-none mb-6 text-neutrals-l00 text-sm tracking-0.12 uppercase"}">Featured
  </p>
  <h3 class="${"featured-course leading-13 mb-4 text-4xl tracking-0.01 svelte-p0st5f"}">${escape2(course.title.en)}</h3>
  <p text-neutrals-l01>${escape2(course.description)}</p>
</a>`;
});
var Arrow = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "13" },
    { height: "11" },
    { viewBox: "0 0 13 11" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path d="${"M1.18201 5.33472H10.6127"}" stroke="${"white"}" stroke-width="${"1.5"}"></path><path d="${"M7.63505 1.36377L11.606 5.33468L7.63505 9.30559"}" stroke="${"white"}" stroke-width="${"1.5"}" stroke-linecap="${"round"}"></path></svg>`;
});
var css$3 = {
  code: ".shineContainer.svelte-1rc4oi{-webkit-animation-delay:0s;animation-delay:0s;-webkit-animation-duration:10s;animation-duration:10s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-name:svelte-1rc4oi-Shine;animation-name:svelte-1rc4oi-Shine;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;bottom:0;color:hsla(0,0%,100%,.1);left:-50%;position:absolute;right:0;top:-50%}.shine.svelte-1rc4oi{background-color:currentColor;height:300%;position:relative;top:-100%;transform:rotate(30deg);width:56px}.shineInner.svelte-1rc4oi{background-color:currentColor;height:100%;width:1rem}@-webkit-keyframes svelte-1rc4oi-Shine{0%{transform:translate3d(-50%,0,0)}20%{transform:translate3d(200%,0,0)}to{transform:translate3d(200%,0,0)}}@keyframes svelte-1rc4oi-Shine{0%{transform:translate3d(-50%,0,0)}20%{transform:translate3d(200%,0,0)}to{transform:translate3d(200%,0,0)}}",
  map: `{"version":3,"file":"KnowMoreButton.svelte","sources":["KnowMoreButton.svelte"],"sourcesContent":["<script>\\r\\n  import Button from '@metafy/components/Button.svelte';\\r\\n  import Arrow from '@metafy/assets/svgs/arrow.svg';\\r\\n\\r\\n  let className = '';\\r\\n  export { className as class };\\r\\n  export let text = 'Know More';\\r\\n  export let icon = true;\\r\\n  export let size = 'h-10 sm:h-12';\\r\\n  export let padding = 'px-6';\\r\\n  export let textSize = 'text-xs sm:text-sm';\\r\\n  export let uppercase = 'uppercase';\\r\\n  export let fontWeight = 'font-semibold';\\r\\n  export let letterSpacing = 'tracking-0.08';\\r\\n  export let backgroundColor = 'bg-neutrals-d03';\\r\\n  export let hasShine = true;\\r\\n<\/script>\\r\\n\\r\\n<Button\\r\\n  kind=\\"primary\\"\\r\\n  href=\\"/\\"\\r\\n  on:click\\r\\n  class=\\"overflow-hidden relative self-start whitespace-nowrap z-2 {letterSpacing} {uppercase} {className}\\"\\r\\n  {size}\\r\\n  {fontWeight}\\r\\n  {textSize}\\r\\n  {padding}\\r\\n  {backgroundColor}\\r\\n>\\r\\n  {#if hasShine}\\r\\n    <div class=\\"shineContainer\\">\\r\\n      <div class=\\"shine flex flex-auto\\">\\r\\n        <div class=\\"shineInner\\" />\\r\\n      </div>\\r\\n    </div>\\r\\n  {/if}\\r\\n  <div class=\\"relative z-10 flex justify-center items-center\\">\\r\\n    {text}\\r\\n    {#if icon}\\r\\n      <Arrow class=\\"ml-3\\" />\\r\\n    {/if}\\r\\n    <slot />\\r\\n  </div>\\r\\n</Button>\\r\\n\\r\\n<style>.shineContainer{-webkit-animation-delay:0s;animation-delay:0s;-webkit-animation-duration:10s;animation-duration:10s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-name:Shine;animation-name:Shine;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;bottom:0;color:hsla(0,0%,100%,.1);left:-50%;position:absolute;right:0;top:-50%}.shine{background-color:currentColor;height:300%;position:relative;top:-100%;transform:rotate(30deg);width:56px}.shineInner{background-color:currentColor;height:100%;width:1rem}@-webkit-keyframes Shine{0%{transform:translate3d(-50%,0,0)}20%{transform:translate3d(200%,0,0)}to{transform:translate3d(200%,0,0)}}@keyframes Shine{0%{transform:translate3d(-50%,0,0)}20%{transform:translate3d(200%,0,0)}to{transform:translate3d(200%,0,0)}}</style>\\r\\n"],"names":[],"mappings":"AA6CO,6BAAe,CAAC,wBAAwB,EAAE,CAAC,gBAAgB,EAAE,CAAC,2BAA2B,GAAG,CAAC,mBAAmB,GAAG,CAAC,kCAAkC,QAAQ,CAAC,0BAA0B,QAAQ,CAAC,uBAAuB,mBAAK,CAAC,eAAe,mBAAK,CAAC,kCAAkC,WAAW,CAAC,0BAA0B,WAAW,CAAC,OAAO,CAAC,CAAC,MAAM,KAAK,CAAC,CAAC,EAAE,CAAC,IAAI,CAAC,EAAE,CAAC,CAAC,KAAK,IAAI,CAAC,SAAS,QAAQ,CAAC,MAAM,CAAC,CAAC,IAAI,IAAI,CAAC,oBAAM,CAAC,iBAAiB,YAAY,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,IAAI,KAAK,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,IAAI,CAAC,yBAAW,CAAC,iBAAiB,YAAY,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,mBAAmB,mBAAK,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,WAAW,mBAAK,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,UAAU,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC"}`
};
var KnowMoreButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { text = "Know More" } = $$props;
  let { icon = true } = $$props;
  let { size = "h-10 sm:h-12" } = $$props;
  let { padding = "px-6" } = $$props;
  let { textSize = "text-xs sm:text-sm" } = $$props;
  let { uppercase = "uppercase" } = $$props;
  let { fontWeight = "font-semibold" } = $$props;
  let { letterSpacing = "tracking-0.08" } = $$props;
  let { backgroundColor = "bg-neutrals-d03" } = $$props;
  let { hasShine = true } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.textSize === void 0 && $$bindings.textSize && textSize !== void 0)
    $$bindings.textSize(textSize);
  if ($$props.uppercase === void 0 && $$bindings.uppercase && uppercase !== void 0)
    $$bindings.uppercase(uppercase);
  if ($$props.fontWeight === void 0 && $$bindings.fontWeight && fontWeight !== void 0)
    $$bindings.fontWeight(fontWeight);
  if ($$props.letterSpacing === void 0 && $$bindings.letterSpacing && letterSpacing !== void 0)
    $$bindings.letterSpacing(letterSpacing);
  if ($$props.backgroundColor === void 0 && $$bindings.backgroundColor && backgroundColor !== void 0)
    $$bindings.backgroundColor(backgroundColor);
  if ($$props.hasShine === void 0 && $$bindings.hasShine && hasShine !== void 0)
    $$bindings.hasShine(hasShine);
  $$result.css.add(css$3);
  return `${validate_component(Button, "Button").$$render($$result, {
    kind: "primary",
    href: "/",
    class: "overflow-hidden relative self-start whitespace-nowrap z-2 " + letterSpacing + " " + uppercase + " " + className,
    size,
    fontWeight,
    textSize,
    padding,
    backgroundColor
  }, {}, {
    default: () => `${hasShine ? `<div class="${"shineContainer svelte-1rc4oi"}"><div class="${"shine flex flex-auto svelte-1rc4oi"}"><div class="${"shineInner svelte-1rc4oi"}"></div></div></div>` : ``}
  <div class="${"relative z-10 flex justify-center items-center"}">${escape2(text)}
    ${icon ? `${validate_component(Arrow, "Arrow").$$render($$result, { class: "ml-3" }, {}, {})}` : ``}
    ${slots.default ? slots.default({}) : ``}</div>`
  })}`;
});
var Background_decoration_light_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread([
    $$props,
    { width: "595" },
    { height: "333" },
    { viewBox: "0 0 595 333" },
    { fill: "none" },
    { xmlns: "http://www.w3.org/2000/svg" }
  ])}><path opacity="${"0.32"}" d="${"M49.9594 432.993C67.582 426.739 54.8948 441.6 220.368 271.037C343.764 143.846 364.988 -2.84482 367.796 -7.94551C370.043 -12.0261 385.606 -14.539 393.107 -15.2855C397.464 -1.23982 379.624 126.774 309.093 221.493C332.933 189.891 391.64 117.876 461.208 97.7015C571.942 65.5891 585.776 45.289 602.509 -15.2856L607.783 2.90194C627.413 18.3552 641.448 61.0347 540.546 108.127C414.419 166.992 309.685 234.462 268.91 351.438C187.467 585.086 87.2276 446.188 0.451798 472.21L49.9594 432.993Z"}" fill="${"white"}"></path></svg>`;
});
var css$2 = {
  code: ".highlighted-course.svelte-1ei1m5m{background:linear-gradient(94.87deg,#b8dcfe .47%,#ffbeb0 94.4%)}",
  map: `{"version":3,"file":"HighlightedCourse.svelte","sources":["HighlightedCourse.svelte"],"sourcesContent":["<!-- TODO: This component should probably be a carousel -->\\r\\n<script lang=\\"ts\\">import Image from '@metafy/components/Image.svelte';\\r\\n;\\r\\nimport KnowMoreButton from './KnowMoreButton.svelte';\\r\\nimport BackgroundDecoration from '@metafy/assets/svgs/background_decoration_light_1.svg';\\r\\nlet className = '';\\r\\nexport { className as class };\\r\\nexport let course;\\r\\n<\/script>\\r\\n\\r\\n<div class=\\"{className} highlighted-course flex px-5 py-6 md:p-8 xl:p-10 relative rounded-xl\\">\\r\\n  <!-- Main Content -->\\r\\n  <div class=\\"flex flex-col w-2/3\\">\\r\\n    <p\\r\\n      class=\\"font-bold leading-none mb-4 sm:mb-6 text-neutrals-d03 text-xs md:text-sm uppercase tracking-0.12 \\"\\r\\n    >\\r\\n      {course.instructor.name} <span class=\\"text-neutrals-l02\\">//</span>\\r\\n      {course.category}\\r\\n    </p>\\r\\n    <h3\\r\\n      class=\\"leading-7.8 md:leading-10.5 xl:leading-12 mb-5 sm:mb-3 text-2xl md:text-3.5xl xl:text-4xl text-neutrals-d03 tracking-0.01 z-2\\"\\r\\n    >\\r\\n      {course.title.en}\\r\\n    </h3>\\r\\n    <p class=\\"line-clamp-2 mb-5 text-neutrals-l03 xs:hidden z-2\\">\\r\\n      {course.description}\\r\\n    </p>\\r\\n    <KnowMoreButton />\\r\\n  </div>\\r\\n\\r\\n  <!-- Background Image and Decoration -->\\r\\n  <BackgroundDecoration class=\\"absolute w-full h-full top-0 left-0\\" />\\r\\n  <Image\\r\\n    class=\\"absolute bottom-0 max-h-9/10 max-w-9/20 pointer-events-none right-0 rounded-br-xl z-1\\"\\r\\n    src={course.instructor.picture}\\r\\n    alt={course.title.en}\\r\\n  />\\r\\n</div>\\r\\n\\r\\n<style>.highlighted-course{background:linear-gradient(94.87deg,#b8dcfe .47%,#ffbeb0 94.4%)}</style>\\r\\n"],"names":[],"mappings":"AAuCO,kCAAmB,CAAC,WAAW,gBAAgB,QAAQ,CAAC,OAAO,CAAC,IAAI,CAAC,OAAO,CAAC,KAAK,CAAC,CAAC"}`
};
var HighlightedCourse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { course } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.course === void 0 && $$bindings.course && course !== void 0)
    $$bindings.course(course);
  $$result.css.add(css$2);
  return `


<div class="${escape2(className) + " highlighted-course flex px-5 py-6 md:p-8 xl:p-10 relative rounded-xl svelte-1ei1m5m"}">
  <div class="${"flex flex-col w-2/3"}"><p class="${"font-bold leading-none mb-4 sm:mb-6 text-neutrals-d03 text-xs md:text-sm uppercase tracking-0.12 "}">${escape2(course.instructor.name)} <span class="${"text-neutrals-l02"}">//</span>
      ${escape2(course.category)}</p>
    <h3 class="${"leading-7.8 md:leading-10.5 xl:leading-12 mb-5 sm:mb-3 text-2xl md:text-3.5xl xl:text-4xl text-neutrals-d03 tracking-0.01 z-2"}">${escape2(course.title.en)}</h3>
    <p class="${"line-clamp-2 mb-5 text-neutrals-l03 xs:hidden z-2"}">${escape2(course.description)}</p>
    ${validate_component(KnowMoreButton, "KnowMoreButton").$$render($$result, {}, {}, {})}</div>

  
  ${validate_component(Background_decoration_light_1, "BackgroundDecoration").$$render($$result, {
    class: "absolute w-full h-full top-0 left-0"
  }, {}, {})}
  ${validate_component(Image, "Image").$$render($$result, {
    class: "absolute bottom-0 max-h-9/10 max-w-9/20 pointer-events-none right-0 rounded-br-xl z-1",
    src: course.instructor.picture,
    alt: course.title.en
  }, {}, {})}
</div>`;
});
var css$1 = {
  code: ".my-container.svelte-1ykbv5v{min-width:357.33px}",
  map: `{"version":3,"file":"Course.svelte","sources":["Course.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Image from '@metafy/components/Image.svelte';\\r\\n;\\r\\nexport let course;\\r\\n<\/script>\\r\\n\\r\\n<a class=\\"my-container pop-transition bg-neutrals-d01 flex p-3 rounded-xl\\" href=\\"/\\">\\r\\n  <Image class=\\"mr-5 object-cover rounded-xl w-29\\" src={course.poster} alt={course.title.en} />\\r\\n\\r\\n  <div class=\\" flex flex-col justify-between my-3\\">\\r\\n    <p class=\\"font-bold leading-none text-brands-metafy-alt text-xs tracking-0.12 uppercase\\">\\r\\n      {course.category}\\r\\n    </p>\\r\\n    <h3 class=\\"font-semibold line-clamp-2 text-base text-neutrals-l00 tracking-0.02\\">\\r\\n      {course.title.en}\\r\\n    </h3>\\r\\n    <p class=\\"leading-none text-neutrals-l01 text-sm tracking-0.01\\">\\r\\n      {course.instructor.name} \u2022 {course.lessonCount} lessons\\r\\n    </p>\\r\\n  </div>\\r\\n</a>\\r\\n\\r\\n<style>.my-container{min-width:357.33px}</style>\\r\\n"],"names":[],"mappings":"AAqBO,4BAAa,CAAC,UAAU,QAAQ,CAAC"}`
};
var Course = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { course } = $$props;
  if ($$props.course === void 0 && $$bindings.course && course !== void 0)
    $$bindings.course(course);
  $$result.css.add(css$1);
  return `<a class="${"my-container pop-transition bg-neutrals-d01 flex p-3 rounded-xl svelte-1ykbv5v"}" href="${"/"}">${validate_component(Image, "Image").$$render($$result, {
    class: "mr-5 object-cover rounded-xl w-29",
    src: course.poster,
    alt: course.title.en
  }, {}, {})}

  <div class="${" flex flex-col justify-between my-3"}"><p class="${"font-bold leading-none text-brands-metafy-alt text-xs tracking-0.12 uppercase"}">${escape2(course.category)}</p>
    <h3 class="${"font-semibold line-clamp-2 text-base text-neutrals-l00 tracking-0.02"}">${escape2(course.title.en)}</h3>
    <p class="${"leading-none text-neutrals-l01 text-sm tracking-0.01"}">${escape2(course.instructor.name)} \u2022 ${escape2(course.lessonCount)} lessons
    </p></div>
</a>`;
});
var css = {
  code: ".spotlight.svelte-i2iwxj{background:linear-gradient(78.89deg,#e2fbe4 2.43%,#ffc0b3 92.58%)}",
  map: `{"version":3,"file":"Spotlight.svelte","sources":["Spotlight.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Image from '@metafy/components/Image.svelte';\\r\\n;\\r\\nlet className = '';\\r\\nexport { className as class };\\r\\nexport let coach;\\r\\n<\/script>\\r\\n\\r\\n<!-- TODO: Finish this component-->\\r\\n<a class=\\"{className} spotlight bg-neutrals-d10 flex p-3 relative rounded-xl\\" href=\\"/\\">\\r\\n  <div class=\\"flex flex-col\\">\\r\\n    <p\\r\\n      class=\\"border border-neutrals-d03 font-semibold leading-none mb-3 px-3 py-2 rounded text-neutrals-d03 text-tiny tracking-0.12 uppercase\\"\\r\\n    >\\r\\n      Spotlight\\r\\n    </p>\\r\\n    <h3 class=\\"font-semibold leading-7.8 text-2xl text-neutrals-d03 tracking-0.02\\">\\r\\n      {coach.name}\\r\\n    </h3>\\r\\n  </div>\\r\\n</a>\\r\\n\\r\\n<style>.spotlight{background:linear-gradient(78.89deg,#e2fbe4 2.43%,#ffc0b3 92.58%)}</style>\\r\\n"],"names":[],"mappings":"AAqBO,wBAAU,CAAC,WAAW,gBAAgB,QAAQ,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC"}`
};
var Spotlight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { coach } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.coach === void 0 && $$bindings.coach && coach !== void 0)
    $$bindings.coach(coach);
  $$result.css.add(css);
  return `
<a class="${escape2(className) + " spotlight bg-neutrals-d10 flex p-3 relative rounded-xl svelte-i2iwxj"}" href="${"/"}"><div class="${"flex flex-col"}"><p class="${"border border-neutrals-d03 font-semibold leading-none mb-3 px-3 py-2 rounded text-neutrals-d03 text-tiny tracking-0.12 uppercase"}">Spotlight
    </p>
    <h3 class="${"font-semibold leading-7.8 text-2xl text-neutrals-d03 tracking-0.02"}">${escape2(coach.name)}</h3></div>
</a>`;
});
var Courses = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main class="${"container py-8 xl:py-10 space-y-6 sm:space-y-8"}">
  <div class="${"flex justify-between"}"><h1 class="${"font-semibold leading-none text-2xl text-neutrals-l00 tracking-0.01"}">Courses</h1>
    </div>
  

  
  <div class="${"courses flex flex-col xl:flex-row"}">${validate_component(HighlightedCourse, "HighlightedCourse").$$render($$result, {
    class: "mb-6 md:mb-8 xl:mb-0 xl:mr-14 xl:w-3/5",
    course: highlightedCourses[0]
  }, {}, {})}
    ${validate_component(BigCourse, "BigCourse").$$render($$result, { class: "xl:w-2/5", course: courses[0] }, {}, {})}</div>

  
  <div class="${"col-span-3"}"><h2 class="${"leading-none text-white text-xl tracking-0.02"}">Latest</h2>
    
    <div class="${"grid xl:container"}"><div class="${"grid xs:gap-x-4 gap-x-8 grid-flow-col overflow-x-auto xl:overflow-y-visible xl:pl-0 pt-6"}">${each(courses.slice(1, 4), (course) => `${validate_component(Course, "Course").$$render($$result, { course }, {}, {})}`)}</div></div>
    <div class="${"flex justify-end"}"><h2 class="${"cursor-pointer font-semibold leading-none mt-5 text-brands-metafy-alt tracking-0.02"}">See more courses
      </h2></div></div>

  
  <div class="${"flex flex-col xl:flex-row"}">${validate_component(FeaturedCourse, "FeaturedCourse").$$render($$result, {
    class: "mb-6 md:mb-8 xl:mb-0 xl:mr-8 xl:w-3/4",
    course: featuredCourse
  }, {}, {})}
    ${validate_component(Spotlight, "Spotlight").$$render($$result, { class: "xl:w-1/4", coach: spotlight }, {}, {})}</div></main>

${validate_component(MetaTags, "MetaTags").$$render($$result, { pageTitle: "Courses" }, {}, {})}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Courses
});

// .svelte-kit/netlify/entry.js
async function handler(event) {
  const { path, httpMethod, headers: headers2, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const rawBody = headers2["content-type"] === "application/octet-stream" ? new TextEncoder("base64").encode(body) : isBase64Encoded ? Buffer.from(body, "base64").toString() : body;
  const rendered = await render({
    method: httpMethod,
    headers: headers2,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      headers: rendered.headers,
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
