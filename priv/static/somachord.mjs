var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to2, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key3 of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to2, key3) && key3 !== except)
        __defProp(to2, key3, { get: () => from2[key3], enumerable: !(desc = __getOwnPropDesc(from2, key3)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target3) => (target3 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target3, "default", { value: mod, enumerable: true }) : target3,
  mod
));

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
  }
});

// (disabled):node_modules/buffer/index.js
var require_buffer = __commonJS({
  "(disabled):node_modules/buffer/index.js"() {
  }
});

// node_modules/js-md5/src/md5.js
var require_md5 = __commonJS({
  "node_modules/js-md5/src/md5.js"(exports, module) {
    (function() {
      "use strict";
      var INPUT_ERROR = "input is invalid type";
      var FINALIZE_ERROR = "finalize already called";
      var WINDOW = typeof window === "object";
      var root3 = WINDOW ? window : {};
      if (root3.JS_MD5_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === "object";
      var NODE_JS = !root3.JS_MD5_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
      if (NODE_JS) {
        root3 = global;
      } else if (WEB_WORKER) {
        root3 = self;
      }
      var COMMON_JS = !root3.JS_MD5_NO_COMMON_JS && typeof module === "object" && module.exports;
      var AMD = typeof define === "function" && define.amd;
      var ARRAY_BUFFER = !root3.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
      var HEX_CHARS = "0123456789abcdef".split("");
      var EXTRA = [128, 32768, 8388608, -2147483648];
      var SHIFT2 = [0, 8, 16, 24];
      var OUTPUT_TYPES = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"];
      var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
      var blocks = [], buffer8;
      if (ARRAY_BUFFER) {
        var buffer = new ArrayBuffer(68);
        buffer8 = new Uint8Array(buffer);
        blocks = new Uint32Array(buffer);
      }
      var isArray = Array.isArray;
      if (root3.JS_MD5_NO_NODE_JS || !isArray) {
        isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      var isView = ArrayBuffer.isView;
      if (ARRAY_BUFFER && (root3.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !isView)) {
        isView = function(obj) {
          return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }
      var formatMessage = function(message2) {
        var type = typeof message2;
        if (type === "string") {
          return [message2, true];
        }
        if (type !== "object" || message2 === null) {
          throw new Error(INPUT_ERROR);
        }
        if (ARRAY_BUFFER && message2.constructor === ArrayBuffer) {
          return [new Uint8Array(message2), false];
        }
        if (!isArray(message2) && !isView(message2)) {
          throw new Error(INPUT_ERROR);
        }
        return [message2, false];
      };
      var createOutputMethod = function(outputType) {
        return function(message2) {
          return new Md5(true).update(message2)[outputType]();
        };
      };
      var createMethod = function() {
        var method = createOutputMethod("hex");
        if (NODE_JS) {
          method = nodeWrap(method);
        }
        method.create = function() {
          return new Md5();
        };
        method.update = function(message2) {
          return method.create().update(message2);
        };
        for (var i2 = 0; i2 < OUTPUT_TYPES.length; ++i2) {
          var type = OUTPUT_TYPES[i2];
          method[type] = createOutputMethod(type);
        }
        return method;
      };
      var nodeWrap = function(method) {
        var crypto = require_crypto();
        var Buffer2 = require_buffer().Buffer;
        var bufferFrom;
        if (Buffer2.from && !root3.JS_MD5_NO_BUFFER_FROM) {
          bufferFrom = Buffer2.from;
        } else {
          bufferFrom = function(message2) {
            return new Buffer2(message2);
          };
        }
        var nodeMethod = function(message2) {
          if (typeof message2 === "string") {
            return crypto.createHash("md5").update(message2, "utf8").digest("hex");
          } else {
            if (message2 === null || message2 === void 0) {
              throw new Error(INPUT_ERROR);
            } else if (message2.constructor === ArrayBuffer) {
              message2 = new Uint8Array(message2);
            }
          }
          if (isArray(message2) || isView(message2) || message2.constructor === Buffer2) {
            return crypto.createHash("md5").update(bufferFrom(message2)).digest("hex");
          } else {
            return method(message2);
          }
        };
        return nodeMethod;
      };
      var createHmacOutputMethod = function(outputType) {
        return function(key3, message2) {
          return new HmacMd5(key3, true).update(message2)[outputType]();
        };
      };
      var createHmacMethod = function() {
        var method = createHmacOutputMethod("hex");
        method.create = function(key3) {
          return new HmacMd5(key3);
        };
        method.update = function(key3, message2) {
          return method.create(key3).update(message2);
        };
        for (var i2 = 0; i2 < OUTPUT_TYPES.length; ++i2) {
          var type = OUTPUT_TYPES[i2];
          method[type] = createHmacOutputMethod(type);
        }
        return method;
      };
      function Md5(sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
          this.buffer8 = buffer8;
        } else {
          if (ARRAY_BUFFER) {
            var buffer2 = new ArrayBuffer(68);
            this.buffer8 = new Uint8Array(buffer2);
            this.blocks = new Uint32Array(buffer2);
          } else {
            this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
        }
        this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
      }
      Md5.prototype.update = function(message2) {
        if (this.finalized) {
          throw new Error(FINALIZE_ERROR);
        }
        var result = formatMessage(message2);
        message2 = result[0];
        var isString = result[1];
        var code2, index5 = 0, i2, length5 = message2.length, blocks2 = this.blocks;
        var buffer82 = this.buffer8;
        while (index5 < length5) {
          if (this.hashed) {
            this.hashed = false;
            blocks2[0] = blocks2[16];
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          if (isString) {
            if (ARRAY_BUFFER) {
              for (i2 = this.start; index5 < length5 && i2 < 64; ++index5) {
                code2 = message2.charCodeAt(index5);
                if (code2 < 128) {
                  buffer82[i2++] = code2;
                } else if (code2 < 2048) {
                  buffer82[i2++] = 192 | code2 >>> 6;
                  buffer82[i2++] = 128 | code2 & 63;
                } else if (code2 < 55296 || code2 >= 57344) {
                  buffer82[i2++] = 224 | code2 >>> 12;
                  buffer82[i2++] = 128 | code2 >>> 6 & 63;
                  buffer82[i2++] = 128 | code2 & 63;
                } else {
                  code2 = 65536 + ((code2 & 1023) << 10 | message2.charCodeAt(++index5) & 1023);
                  buffer82[i2++] = 240 | code2 >>> 18;
                  buffer82[i2++] = 128 | code2 >>> 12 & 63;
                  buffer82[i2++] = 128 | code2 >>> 6 & 63;
                  buffer82[i2++] = 128 | code2 & 63;
                }
              }
            } else {
              for (i2 = this.start; index5 < length5 && i2 < 64; ++index5) {
                code2 = message2.charCodeAt(index5);
                if (code2 < 128) {
                  blocks2[i2 >>> 2] |= code2 << SHIFT2[i2++ & 3];
                } else if (code2 < 2048) {
                  blocks2[i2 >>> 2] |= (192 | code2 >>> 6) << SHIFT2[i2++ & 3];
                  blocks2[i2 >>> 2] |= (128 | code2 & 63) << SHIFT2[i2++ & 3];
                } else if (code2 < 55296 || code2 >= 57344) {
                  blocks2[i2 >>> 2] |= (224 | code2 >>> 12) << SHIFT2[i2++ & 3];
                  blocks2[i2 >>> 2] |= (128 | code2 >>> 6 & 63) << SHIFT2[i2++ & 3];
                  blocks2[i2 >>> 2] |= (128 | code2 & 63) << SHIFT2[i2++ & 3];
                } else {
                  code2 = 65536 + ((code2 & 1023) << 10 | message2.charCodeAt(++index5) & 1023);
                  blocks2[i2 >>> 2] |= (240 | code2 >>> 18) << SHIFT2[i2++ & 3];
                  blocks2[i2 >>> 2] |= (128 | code2 >>> 12 & 63) << SHIFT2[i2++ & 3];
                  blocks2[i2 >>> 2] |= (128 | code2 >>> 6 & 63) << SHIFT2[i2++ & 3];
                  blocks2[i2 >>> 2] |= (128 | code2 & 63) << SHIFT2[i2++ & 3];
                }
              }
            }
          } else {
            if (ARRAY_BUFFER) {
              for (i2 = this.start; index5 < length5 && i2 < 64; ++index5) {
                buffer82[i2++] = message2[index5];
              }
            } else {
              for (i2 = this.start; index5 < length5 && i2 < 64; ++index5) {
                blocks2[i2 >>> 2] |= message2[index5] << SHIFT2[i2++ & 3];
              }
            }
          }
          this.lastByteIndex = i2;
          this.bytes += i2 - this.start;
          if (i2 >= 64) {
            this.start = i2 - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i2;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };
      Md5.prototype.finalize = function() {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks2 = this.blocks, i2 = this.lastByteIndex;
        blocks2[i2 >>> 2] |= EXTRA[i2 & 3];
        if (i2 >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks2[0] = blocks2[16];
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.bytes << 3;
        blocks2[15] = this.hBytes << 3 | this.bytes >>> 29;
        this.hash();
      };
      Md5.prototype.hash = function() {
        var a2, b, c, d, bc, da, blocks2 = this.blocks;
        if (this.first) {
          a2 = blocks2[0] - 680876937;
          a2 = (a2 << 7 | a2 >>> 25) - 271733879 << 0;
          d = (-1732584194 ^ a2 & 2004318071) + blocks2[1] - 117830708;
          d = (d << 12 | d >>> 20) + a2 << 0;
          c = (-271733879 ^ d & (a2 ^ -271733879)) + blocks2[2] - 1126478375;
          c = (c << 17 | c >>> 15) + d << 0;
          b = (a2 ^ c & (d ^ a2)) + blocks2[3] - 1316259209;
          b = (b << 22 | b >>> 10) + c << 0;
        } else {
          a2 = this.h0;
          b = this.h1;
          c = this.h2;
          d = this.h3;
          a2 += (d ^ b & (c ^ d)) + blocks2[0] - 680876936;
          a2 = (a2 << 7 | a2 >>> 25) + b << 0;
          d += (c ^ a2 & (b ^ c)) + blocks2[1] - 389564586;
          d = (d << 12 | d >>> 20) + a2 << 0;
          c += (b ^ d & (a2 ^ b)) + blocks2[2] + 606105819;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a2 ^ c & (d ^ a2)) + blocks2[3] - 1044525330;
          b = (b << 22 | b >>> 10) + c << 0;
        }
        a2 += (d ^ b & (c ^ d)) + blocks2[4] - 176418897;
        a2 = (a2 << 7 | a2 >>> 25) + b << 0;
        d += (c ^ a2 & (b ^ c)) + blocks2[5] + 1200080426;
        d = (d << 12 | d >>> 20) + a2 << 0;
        c += (b ^ d & (a2 ^ b)) + blocks2[6] - 1473231341;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a2 ^ c & (d ^ a2)) + blocks2[7] - 45705983;
        b = (b << 22 | b >>> 10) + c << 0;
        a2 += (d ^ b & (c ^ d)) + blocks2[8] + 1770035416;
        a2 = (a2 << 7 | a2 >>> 25) + b << 0;
        d += (c ^ a2 & (b ^ c)) + blocks2[9] - 1958414417;
        d = (d << 12 | d >>> 20) + a2 << 0;
        c += (b ^ d & (a2 ^ b)) + blocks2[10] - 42063;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a2 ^ c & (d ^ a2)) + blocks2[11] - 1990404162;
        b = (b << 22 | b >>> 10) + c << 0;
        a2 += (d ^ b & (c ^ d)) + blocks2[12] + 1804603682;
        a2 = (a2 << 7 | a2 >>> 25) + b << 0;
        d += (c ^ a2 & (b ^ c)) + blocks2[13] - 40341101;
        d = (d << 12 | d >>> 20) + a2 << 0;
        c += (b ^ d & (a2 ^ b)) + blocks2[14] - 1502002290;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a2 ^ c & (d ^ a2)) + blocks2[15] + 1236535329;
        b = (b << 22 | b >>> 10) + c << 0;
        a2 += (c ^ d & (b ^ c)) + blocks2[1] - 165796510;
        a2 = (a2 << 5 | a2 >>> 27) + b << 0;
        d += (b ^ c & (a2 ^ b)) + blocks2[6] - 1069501632;
        d = (d << 9 | d >>> 23) + a2 << 0;
        c += (a2 ^ b & (d ^ a2)) + blocks2[11] + 643717713;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a2 & (c ^ d)) + blocks2[0] - 373897302;
        b = (b << 20 | b >>> 12) + c << 0;
        a2 += (c ^ d & (b ^ c)) + blocks2[5] - 701558691;
        a2 = (a2 << 5 | a2 >>> 27) + b << 0;
        d += (b ^ c & (a2 ^ b)) + blocks2[10] + 38016083;
        d = (d << 9 | d >>> 23) + a2 << 0;
        c += (a2 ^ b & (d ^ a2)) + blocks2[15] - 660478335;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a2 & (c ^ d)) + blocks2[4] - 405537848;
        b = (b << 20 | b >>> 12) + c << 0;
        a2 += (c ^ d & (b ^ c)) + blocks2[9] + 568446438;
        a2 = (a2 << 5 | a2 >>> 27) + b << 0;
        d += (b ^ c & (a2 ^ b)) + blocks2[14] - 1019803690;
        d = (d << 9 | d >>> 23) + a2 << 0;
        c += (a2 ^ b & (d ^ a2)) + blocks2[3] - 187363961;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a2 & (c ^ d)) + blocks2[8] + 1163531501;
        b = (b << 20 | b >>> 12) + c << 0;
        a2 += (c ^ d & (b ^ c)) + blocks2[13] - 1444681467;
        a2 = (a2 << 5 | a2 >>> 27) + b << 0;
        d += (b ^ c & (a2 ^ b)) + blocks2[2] - 51403784;
        d = (d << 9 | d >>> 23) + a2 << 0;
        c += (a2 ^ b & (d ^ a2)) + blocks2[7] + 1735328473;
        c = (c << 14 | c >>> 18) + d << 0;
        b += (d ^ a2 & (c ^ d)) + blocks2[12] - 1926607734;
        b = (b << 20 | b >>> 12) + c << 0;
        bc = b ^ c;
        a2 += (bc ^ d) + blocks2[5] - 378558;
        a2 = (a2 << 4 | a2 >>> 28) + b << 0;
        d += (bc ^ a2) + blocks2[8] - 2022574463;
        d = (d << 11 | d >>> 21) + a2 << 0;
        da = d ^ a2;
        c += (da ^ b) + blocks2[11] + 1839030562;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[14] - 35309556;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a2 += (bc ^ d) + blocks2[1] - 1530992060;
        a2 = (a2 << 4 | a2 >>> 28) + b << 0;
        d += (bc ^ a2) + blocks2[4] + 1272893353;
        d = (d << 11 | d >>> 21) + a2 << 0;
        da = d ^ a2;
        c += (da ^ b) + blocks2[7] - 155497632;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[10] - 1094730640;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a2 += (bc ^ d) + blocks2[13] + 681279174;
        a2 = (a2 << 4 | a2 >>> 28) + b << 0;
        d += (bc ^ a2) + blocks2[0] - 358537222;
        d = (d << 11 | d >>> 21) + a2 << 0;
        da = d ^ a2;
        c += (da ^ b) + blocks2[3] - 722521979;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[6] + 76029189;
        b = (b << 23 | b >>> 9) + c << 0;
        bc = b ^ c;
        a2 += (bc ^ d) + blocks2[9] - 640364487;
        a2 = (a2 << 4 | a2 >>> 28) + b << 0;
        d += (bc ^ a2) + blocks2[12] - 421815835;
        d = (d << 11 | d >>> 21) + a2 << 0;
        da = d ^ a2;
        c += (da ^ b) + blocks2[15] + 530742520;
        c = (c << 16 | c >>> 16) + d << 0;
        b += (da ^ c) + blocks2[2] - 995338651;
        b = (b << 23 | b >>> 9) + c << 0;
        a2 += (c ^ (b | ~d)) + blocks2[0] - 198630844;
        a2 = (a2 << 6 | a2 >>> 26) + b << 0;
        d += (b ^ (a2 | ~c)) + blocks2[7] + 1126891415;
        d = (d << 10 | d >>> 22) + a2 << 0;
        c += (a2 ^ (d | ~b)) + blocks2[14] - 1416354905;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a2)) + blocks2[5] - 57434055;
        b = (b << 21 | b >>> 11) + c << 0;
        a2 += (c ^ (b | ~d)) + blocks2[12] + 1700485571;
        a2 = (a2 << 6 | a2 >>> 26) + b << 0;
        d += (b ^ (a2 | ~c)) + blocks2[3] - 1894986606;
        d = (d << 10 | d >>> 22) + a2 << 0;
        c += (a2 ^ (d | ~b)) + blocks2[10] - 1051523;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a2)) + blocks2[1] - 2054922799;
        b = (b << 21 | b >>> 11) + c << 0;
        a2 += (c ^ (b | ~d)) + blocks2[8] + 1873313359;
        a2 = (a2 << 6 | a2 >>> 26) + b << 0;
        d += (b ^ (a2 | ~c)) + blocks2[15] - 30611744;
        d = (d << 10 | d >>> 22) + a2 << 0;
        c += (a2 ^ (d | ~b)) + blocks2[6] - 1560198380;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a2)) + blocks2[13] + 1309151649;
        b = (b << 21 | b >>> 11) + c << 0;
        a2 += (c ^ (b | ~d)) + blocks2[4] - 145523070;
        a2 = (a2 << 6 | a2 >>> 26) + b << 0;
        d += (b ^ (a2 | ~c)) + blocks2[11] - 1120210379;
        d = (d << 10 | d >>> 22) + a2 << 0;
        c += (a2 ^ (d | ~b)) + blocks2[2] + 718787259;
        c = (c << 15 | c >>> 17) + d << 0;
        b += (d ^ (c | ~a2)) + blocks2[9] - 343485551;
        b = (b << 21 | b >>> 11) + c << 0;
        if (this.first) {
          this.h0 = a2 + 1732584193 << 0;
          this.h1 = b - 271733879 << 0;
          this.h2 = c - 1732584194 << 0;
          this.h3 = d + 271733878 << 0;
          this.first = false;
        } else {
          this.h0 = this.h0 + a2 << 0;
          this.h1 = this.h1 + b << 0;
          this.h2 = this.h2 + c << 0;
          this.h3 = this.h3 + d << 0;
        }
      };
      Md5.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h12 = this.h1, h22 = this.h2, h3 = this.h3;
        return HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h12 >>> 4 & 15] + HEX_CHARS[h12 & 15] + HEX_CHARS[h12 >>> 12 & 15] + HEX_CHARS[h12 >>> 8 & 15] + HEX_CHARS[h12 >>> 20 & 15] + HEX_CHARS[h12 >>> 16 & 15] + HEX_CHARS[h12 >>> 28 & 15] + HEX_CHARS[h12 >>> 24 & 15] + HEX_CHARS[h22 >>> 4 & 15] + HEX_CHARS[h22 & 15] + HEX_CHARS[h22 >>> 12 & 15] + HEX_CHARS[h22 >>> 8 & 15] + HEX_CHARS[h22 >>> 20 & 15] + HEX_CHARS[h22 >>> 16 & 15] + HEX_CHARS[h22 >>> 28 & 15] + HEX_CHARS[h22 >>> 24 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15];
      };
      Md5.prototype.toString = Md5.prototype.hex;
      Md5.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h12 = this.h1, h22 = this.h2, h3 = this.h3;
        return [
          h0 & 255,
          h0 >>> 8 & 255,
          h0 >>> 16 & 255,
          h0 >>> 24 & 255,
          h12 & 255,
          h12 >>> 8 & 255,
          h12 >>> 16 & 255,
          h12 >>> 24 & 255,
          h22 & 255,
          h22 >>> 8 & 255,
          h22 >>> 16 & 255,
          h22 >>> 24 & 255,
          h3 & 255,
          h3 >>> 8 & 255,
          h3 >>> 16 & 255,
          h3 >>> 24 & 255
        ];
      };
      Md5.prototype.array = Md5.prototype.digest;
      Md5.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer2 = new ArrayBuffer(16);
        var blocks2 = new Uint32Array(buffer2);
        blocks2[0] = this.h0;
        blocks2[1] = this.h1;
        blocks2[2] = this.h2;
        blocks2[3] = this.h3;
        return buffer2;
      };
      Md5.prototype.buffer = Md5.prototype.arrayBuffer;
      Md5.prototype.base64 = function() {
        var v1, v2, v3, base64Str = "", bytes = this.array();
        for (var i2 = 0; i2 < 15; ) {
          v1 = bytes[i2++];
          v2 = bytes[i2++];
          v3 = bytes[i2++];
          base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
        }
        v1 = bytes[i2];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
        return base64Str;
      };
      function HmacMd5(key3, sharedMemory) {
        var i2, result = formatMessage(key3);
        key3 = result[0];
        if (result[1]) {
          var bytes = [], length5 = key3.length, index5 = 0, code2;
          for (i2 = 0; i2 < length5; ++i2) {
            code2 = key3.charCodeAt(i2);
            if (code2 < 128) {
              bytes[index5++] = code2;
            } else if (code2 < 2048) {
              bytes[index5++] = 192 | code2 >>> 6;
              bytes[index5++] = 128 | code2 & 63;
            } else if (code2 < 55296 || code2 >= 57344) {
              bytes[index5++] = 224 | code2 >>> 12;
              bytes[index5++] = 128 | code2 >>> 6 & 63;
              bytes[index5++] = 128 | code2 & 63;
            } else {
              code2 = 65536 + ((code2 & 1023) << 10 | key3.charCodeAt(++i2) & 1023);
              bytes[index5++] = 240 | code2 >>> 18;
              bytes[index5++] = 128 | code2 >>> 12 & 63;
              bytes[index5++] = 128 | code2 >>> 6 & 63;
              bytes[index5++] = 128 | code2 & 63;
            }
          }
          key3 = bytes;
        }
        if (key3.length > 64) {
          key3 = new Md5(true).update(key3).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for (i2 = 0; i2 < 64; ++i2) {
          var b = key3[i2] || 0;
          oKeyPad[i2] = 92 ^ b;
          iKeyPad[i2] = 54 ^ b;
        }
        Md5.call(this, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      HmacMd5.prototype = new Md5();
      HmacMd5.prototype.finalize = function() {
        Md5.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Md5.call(this, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Md5.prototype.finalize.call(this);
        }
      };
      var exports2 = createMethod();
      exports2.md5 = exports2;
      exports2.md5.hmac = createHmacMethod();
      if (COMMON_JS) {
        module.exports = exports2;
      } else {
        root3.md5 = exports2;
        if (AMD) {
          define(function() {
            return exports2;
          });
        }
      }
    })();
  }
});

// node_modules/is-electron/index.js
var require_is_electron = __commonJS({
  "node_modules/is-electron/index.js"(exports, module) {
    function isElectron2() {
      if (typeof window !== "undefined" && typeof window.process === "object" && window.process.type === "renderer") {
        return true;
      }
      if (typeof process !== "undefined" && typeof process.versions === "object" && !!process.versions.electron) {
        return true;
      }
      if (typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent.indexOf("Electron") >= 0) {
        return true;
      }
      return false;
    }
    module.exports = isElectron2;
  }
});

// build/dev/javascript/prelude.mjs
var CustomType = class {
  withFields(fields) {
    let properties = Object.keys(this).map(
      (label2) => label2 in fields ? fields[label2] : this[label2]
    );
    return new this.constructor(...properties);
  }
};
var List = class {
  static fromArray(array3, tail) {
    let t = tail || new Empty();
    for (let i2 = array3.length - 1; i2 >= 0; --i2) {
      t = new NonEmpty(array3[i2], t);
    }
    return t;
  }
  [Symbol.iterator]() {
    return new ListIterator(this);
  }
  toArray() {
    return [...this];
  }
  // @internal
  atLeastLength(desired) {
    let current2 = this;
    while (desired-- > 0 && current2) current2 = current2.tail;
    return current2 !== void 0;
  }
  // @internal
  hasLength(desired) {
    let current2 = this;
    while (desired-- > 0 && current2) current2 = current2.tail;
    return desired === -1 && current2 instanceof Empty;
  }
  // @internal
  countLength() {
    let current2 = this;
    let length5 = 0;
    while (current2) {
      current2 = current2.tail;
      length5++;
    }
    return length5 - 1;
  }
};
function prepend(element13, tail) {
  return new NonEmpty(element13, tail);
}
function toList(elements, tail) {
  return List.fromArray(elements, tail);
}
var ListIterator = class {
  #current;
  constructor(current2) {
    this.#current = current2;
  }
  next() {
    if (this.#current instanceof Empty) {
      return { done: true };
    } else {
      let { head, tail } = this.#current;
      this.#current = tail;
      return { value: head, done: false };
    }
  }
};
var Empty = class extends List {
};
var NonEmpty = class extends List {
  constructor(head, tail) {
    super();
    this.head = head;
    this.tail = tail;
  }
};
var BitArray = class {
  /**
   * The size in bits of this bit array's data.
   *
   * @type {number}
   */
  bitSize;
  /**
   * The size in bytes of this bit array's data. If this bit array doesn't store
   * a whole number of bytes then this value is rounded up.
   *
   * @type {number}
   */
  byteSize;
  /**
   * The number of unused high bits in the first byte of this bit array's
   * buffer prior to the start of its data. The value of any unused high bits is
   * undefined.
   *
   * The bit offset will be in the range 0-7.
   *
   * @type {number}
   */
  bitOffset;
  /**
   * The raw bytes that hold this bit array's data.
   *
   * If `bitOffset` is not zero then there are unused high bits in the first
   * byte of this buffer.
   *
   * If `bitOffset + bitSize` is not a multiple of 8 then there are unused low
   * bits in the last byte of this buffer.
   *
   * @type {Uint8Array}
   */
  rawBuffer;
  /**
   * Constructs a new bit array from a `Uint8Array`, an optional size in
   * bits, and an optional bit offset.
   *
   * If no bit size is specified it is taken as `buffer.length * 8`, i.e. all
   * bytes in the buffer make up the new bit array's data.
   *
   * If no bit offset is specified it defaults to zero, i.e. there are no unused
   * high bits in the first byte of the buffer.
   *
   * @param {Uint8Array} buffer
   * @param {number} [bitSize]
   * @param {number} [bitOffset]
   */
  constructor(buffer, bitSize, bitOffset) {
    if (!(buffer instanceof Uint8Array)) {
      throw globalThis.Error(
        "BitArray can only be constructed from a Uint8Array"
      );
    }
    this.bitSize = bitSize ?? buffer.length * 8;
    this.byteSize = Math.trunc((this.bitSize + 7) / 8);
    this.bitOffset = bitOffset ?? 0;
    if (this.bitSize < 0) {
      throw globalThis.Error(`BitArray bit size is invalid: ${this.bitSize}`);
    }
    if (this.bitOffset < 0 || this.bitOffset > 7) {
      throw globalThis.Error(
        `BitArray bit offset is invalid: ${this.bitOffset}`
      );
    }
    if (buffer.length !== Math.trunc((this.bitOffset + this.bitSize + 7) / 8)) {
      throw globalThis.Error("BitArray buffer length is invalid");
    }
    this.rawBuffer = buffer;
  }
  /**
   * Returns a specific byte in this bit array. If the byte index is out of
   * range then `undefined` is returned.
   *
   * When returning the final byte of a bit array with a bit size that's not a
   * multiple of 8, the content of the unused low bits are undefined.
   *
   * @param {number} index
   * @returns {number | undefined}
   */
  byteAt(index5) {
    if (index5 < 0 || index5 >= this.byteSize) {
      return void 0;
    }
    return bitArrayByteAt(this.rawBuffer, this.bitOffset, index5);
  }
  /** @internal */
  equals(other) {
    if (this.bitSize !== other.bitSize) {
      return false;
    }
    const wholeByteCount = Math.trunc(this.bitSize / 8);
    if (this.bitOffset === 0 && other.bitOffset === 0) {
      for (let i2 = 0; i2 < wholeByteCount; i2++) {
        if (this.rawBuffer[i2] !== other.rawBuffer[i2]) {
          return false;
        }
      }
      const trailingBitsCount = this.bitSize % 8;
      if (trailingBitsCount) {
        const unusedLowBitCount = 8 - trailingBitsCount;
        if (this.rawBuffer[wholeByteCount] >> unusedLowBitCount !== other.rawBuffer[wholeByteCount] >> unusedLowBitCount) {
          return false;
        }
      }
    } else {
      for (let i2 = 0; i2 < wholeByteCount; i2++) {
        const a2 = bitArrayByteAt(this.rawBuffer, this.bitOffset, i2);
        const b = bitArrayByteAt(other.rawBuffer, other.bitOffset, i2);
        if (a2 !== b) {
          return false;
        }
      }
      const trailingBitsCount = this.bitSize % 8;
      if (trailingBitsCount) {
        const a2 = bitArrayByteAt(
          this.rawBuffer,
          this.bitOffset,
          wholeByteCount
        );
        const b = bitArrayByteAt(
          other.rawBuffer,
          other.bitOffset,
          wholeByteCount
        );
        const unusedLowBitCount = 8 - trailingBitsCount;
        if (a2 >> unusedLowBitCount !== b >> unusedLowBitCount) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Returns this bit array's internal buffer.
   *
   * @deprecated Use `BitArray.byteAt()` or `BitArray.rawBuffer` instead.
   *
   * @returns {Uint8Array}
   */
  get buffer() {
    bitArrayPrintDeprecationWarning(
      "buffer",
      "Use BitArray.byteAt() or BitArray.rawBuffer instead"
    );
    if (this.bitOffset !== 0 || this.bitSize % 8 !== 0) {
      throw new globalThis.Error(
        "BitArray.buffer does not support unaligned bit arrays"
      );
    }
    return this.rawBuffer;
  }
  /**
   * Returns the length in bytes of this bit array's internal buffer.
   *
   * @deprecated Use `BitArray.bitSize` or `BitArray.byteSize` instead.
   *
   * @returns {number}
   */
  get length() {
    bitArrayPrintDeprecationWarning(
      "length",
      "Use BitArray.bitSize or BitArray.byteSize instead"
    );
    if (this.bitOffset !== 0 || this.bitSize % 8 !== 0) {
      throw new globalThis.Error(
        "BitArray.length does not support unaligned bit arrays"
      );
    }
    return this.rawBuffer.length;
  }
};
function bitArrayByteAt(buffer, bitOffset, index5) {
  if (bitOffset === 0) {
    return buffer[index5] ?? 0;
  } else {
    const a2 = buffer[index5] << bitOffset & 255;
    const b = buffer[index5 + 1] >> 8 - bitOffset;
    return a2 | b;
  }
}
var UtfCodepoint = class {
  constructor(value3) {
    this.value = value3;
  }
};
var isBitArrayDeprecationMessagePrinted = {};
function bitArrayPrintDeprecationWarning(name2, message2) {
  if (isBitArrayDeprecationMessagePrinted[name2]) {
    return;
  }
  console.warn(
    `Deprecated BitArray.${name2} property used in JavaScript FFI code. ${message2}.`
  );
  isBitArrayDeprecationMessagePrinted[name2] = true;
}
var Result = class _Result extends CustomType {
  // @internal
  static isResult(data2) {
    return data2 instanceof _Result;
  }
};
var Ok = class extends Result {
  constructor(value3) {
    super();
    this[0] = value3;
  }
  // @internal
  isOk() {
    return true;
  }
};
var Error2 = class extends Result {
  constructor(detail) {
    super();
    this[0] = detail;
  }
  // @internal
  isOk() {
    return false;
  }
};
function isEqual(x, y) {
  let values3 = [x, y];
  while (values3.length) {
    let a2 = values3.pop();
    let b = values3.pop();
    if (a2 === b) continue;
    if (!isObject(a2) || !isObject(b)) return false;
    let unequal = !structurallyCompatibleObjects(a2, b) || unequalDates(a2, b) || unequalBuffers(a2, b) || unequalArrays(a2, b) || unequalMaps(a2, b) || unequalSets(a2, b) || unequalRegExps(a2, b);
    if (unequal) return false;
    const proto = Object.getPrototypeOf(a2);
    if (proto !== null && typeof proto.equals === "function") {
      try {
        if (a2.equals(b)) continue;
        else return false;
      } catch {
      }
    }
    let [keys2, get4] = getters(a2);
    const ka = keys2(a2);
    const kb = keys2(b);
    if (ka.length !== kb.length) return false;
    for (let k of ka) {
      values3.push(get4(a2, k), get4(b, k));
    }
  }
  return true;
}
function getters(object4) {
  if (object4 instanceof Map) {
    return [(x) => x.keys(), (x, y) => x.get(y)];
  } else {
    let extra = object4 instanceof globalThis.Error ? ["message"] : [];
    return [(x) => [...extra, ...Object.keys(x)], (x, y) => x[y]];
  }
}
function unequalDates(a2, b) {
  return a2 instanceof Date && (a2 > b || a2 < b);
}
function unequalBuffers(a2, b) {
  return !(a2 instanceof BitArray) && a2.buffer instanceof ArrayBuffer && a2.BYTES_PER_ELEMENT && !(a2.byteLength === b.byteLength && a2.every((n, i2) => n === b[i2]));
}
function unequalArrays(a2, b) {
  return Array.isArray(a2) && a2.length !== b.length;
}
function unequalMaps(a2, b) {
  return a2 instanceof Map && a2.size !== b.size;
}
function unequalSets(a2, b) {
  return a2 instanceof Set && (a2.size != b.size || [...a2].some((e) => !b.has(e)));
}
function unequalRegExps(a2, b) {
  return a2 instanceof RegExp && (a2.source !== b.source || a2.flags !== b.flags);
}
function isObject(a2) {
  return typeof a2 === "object" && a2 !== null;
}
function structurallyCompatibleObjects(a2, b) {
  if (typeof a2 !== "object" && typeof b !== "object" && (!a2 || !b))
    return false;
  let nonstructural = [Promise, WeakSet, WeakMap, Function];
  if (nonstructural.some((c) => a2 instanceof c)) return false;
  return a2.constructor === b.constructor;
}
function remainderInt(a2, b) {
  if (b === 0) {
    return 0;
  } else {
    return a2 % b;
  }
}
function divideInt(a2, b) {
  return Math.trunc(divideFloat(a2, b));
}
function divideFloat(a2, b) {
  if (b === 0) {
    return 0;
  } else {
    return a2 / b;
  }
}
function makeError(variant, file, module, line, fn, message2, extra) {
  let error = new globalThis.Error(message2);
  error.gleam_error = variant;
  error.file = file;
  error.module = module;
  error.line = line;
  error.function = fn;
  error.fn = fn;
  for (let k in extra) error[k] = extra[k];
  return error;
}

// build/dev/javascript/gleam_stdlib/dict.mjs
var referenceMap = /* @__PURE__ */ new WeakMap();
var tempDataView = /* @__PURE__ */ new DataView(
  /* @__PURE__ */ new ArrayBuffer(8)
);
var referenceUID = 0;
function hashByReference(o) {
  const known = referenceMap.get(o);
  if (known !== void 0) {
    return known;
  }
  const hash2 = referenceUID++;
  if (referenceUID === 2147483647) {
    referenceUID = 0;
  }
  referenceMap.set(o, hash2);
  return hash2;
}
function hashMerge(a2, b) {
  return a2 ^ b + 2654435769 + (a2 << 6) + (a2 >> 2) | 0;
}
function hashString(s) {
  let hash2 = 0;
  const len = s.length;
  for (let i2 = 0; i2 < len; i2++) {
    hash2 = Math.imul(31, hash2) + s.charCodeAt(i2) | 0;
  }
  return hash2;
}
function hashNumber(n) {
  tempDataView.setFloat64(0, n);
  const i2 = tempDataView.getInt32(0);
  const j = tempDataView.getInt32(4);
  return Math.imul(73244475, i2 >> 16 ^ i2) ^ j;
}
function hashBigInt(n) {
  return hashString(n.toString());
}
function hashObject(o) {
  const proto = Object.getPrototypeOf(o);
  if (proto !== null && typeof proto.hashCode === "function") {
    try {
      const code2 = o.hashCode(o);
      if (typeof code2 === "number") {
        return code2;
      }
    } catch {
    }
  }
  if (o instanceof Promise || o instanceof WeakSet || o instanceof WeakMap) {
    return hashByReference(o);
  }
  if (o instanceof Date) {
    return hashNumber(o.getTime());
  }
  let h = 0;
  if (o instanceof ArrayBuffer) {
    o = new Uint8Array(o);
  }
  if (Array.isArray(o) || o instanceof Uint8Array) {
    for (let i2 = 0; i2 < o.length; i2++) {
      h = Math.imul(31, h) + getHash(o[i2]) | 0;
    }
  } else if (o instanceof Set) {
    o.forEach((v) => {
      h = h + getHash(v) | 0;
    });
  } else if (o instanceof Map) {
    o.forEach((v, k) => {
      h = h + hashMerge(getHash(v), getHash(k)) | 0;
    });
  } else {
    const keys2 = Object.keys(o);
    for (let i2 = 0; i2 < keys2.length; i2++) {
      const k = keys2[i2];
      const v = o[k];
      h = h + hashMerge(getHash(v), hashString(k)) | 0;
    }
  }
  return h;
}
function getHash(u) {
  if (u === null) return 1108378658;
  if (u === void 0) return 1108378659;
  if (u === true) return 1108378657;
  if (u === false) return 1108378656;
  switch (typeof u) {
    case "number":
      return hashNumber(u);
    case "string":
      return hashString(u);
    case "bigint":
      return hashBigInt(u);
    case "object":
      return hashObject(u);
    case "symbol":
      return hashByReference(u);
    case "function":
      return hashByReference(u);
    default:
      return 0;
  }
}
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;
var ENTRY = 0;
var ARRAY_NODE = 1;
var INDEX_NODE = 2;
var COLLISION_NODE = 3;
var EMPTY = {
  type: INDEX_NODE,
  bitmap: 0,
  array: []
};
function mask(hash2, shift) {
  return hash2 >>> shift & MASK;
}
function bitpos(hash2, shift) {
  return 1 << mask(hash2, shift);
}
function bitcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function index(bitmap, bit) {
  return bitcount(bitmap & bit - 1);
}
function cloneAndSet(arr, at2, val) {
  const len = arr.length;
  const out = new Array(len);
  for (let i2 = 0; i2 < len; ++i2) {
    out[i2] = arr[i2];
  }
  out[at2] = val;
  return out;
}
function spliceIn(arr, at2, val) {
  const len = arr.length;
  const out = new Array(len + 1);
  let i2 = 0;
  let g = 0;
  while (i2 < at2) {
    out[g++] = arr[i2++];
  }
  out[g++] = val;
  while (i2 < len) {
    out[g++] = arr[i2++];
  }
  return out;
}
function spliceOut(arr, at2) {
  const len = arr.length;
  const out = new Array(len - 1);
  let i2 = 0;
  let g = 0;
  while (i2 < at2) {
    out[g++] = arr[i2++];
  }
  ++i2;
  while (i2 < len) {
    out[g++] = arr[i2++];
  }
  return out;
}
function createNode(shift, key1, val1, key2hash, key22, val2) {
  const key1hash = getHash(key1);
  if (key1hash === key2hash) {
    return {
      type: COLLISION_NODE,
      hash: key1hash,
      array: [
        { type: ENTRY, k: key1, v: val1 },
        { type: ENTRY, k: key22, v: val2 }
      ]
    };
  }
  const addedLeaf = { val: false };
  return assoc(
    assocIndex(EMPTY, shift, key1hash, key1, val1, addedLeaf),
    shift,
    key2hash,
    key22,
    val2,
    addedLeaf
  );
}
function assoc(root3, shift, hash2, key3, val, addedLeaf) {
  switch (root3.type) {
    case ARRAY_NODE:
      return assocArray(root3, shift, hash2, key3, val, addedLeaf);
    case INDEX_NODE:
      return assocIndex(root3, shift, hash2, key3, val, addedLeaf);
    case COLLISION_NODE:
      return assocCollision(root3, shift, hash2, key3, val, addedLeaf);
  }
}
function assocArray(root3, shift, hash2, key3, val, addedLeaf) {
  const idx = mask(hash2, shift);
  const node = root3.array[idx];
  if (node === void 0) {
    addedLeaf.val = true;
    return {
      type: ARRAY_NODE,
      size: root3.size + 1,
      array: cloneAndSet(root3.array, idx, { type: ENTRY, k: key3, v: val })
    };
  }
  if (node.type === ENTRY) {
    if (isEqual(key3, node.k)) {
      if (val === node.v) {
        return root3;
      }
      return {
        type: ARRAY_NODE,
        size: root3.size,
        array: cloneAndSet(root3.array, idx, {
          type: ENTRY,
          k: key3,
          v: val
        })
      };
    }
    addedLeaf.val = true;
    return {
      type: ARRAY_NODE,
      size: root3.size,
      array: cloneAndSet(
        root3.array,
        idx,
        createNode(shift + SHIFT, node.k, node.v, hash2, key3, val)
      )
    };
  }
  const n = assoc(node, shift + SHIFT, hash2, key3, val, addedLeaf);
  if (n === node) {
    return root3;
  }
  return {
    type: ARRAY_NODE,
    size: root3.size,
    array: cloneAndSet(root3.array, idx, n)
  };
}
function assocIndex(root3, shift, hash2, key3, val, addedLeaf) {
  const bit = bitpos(hash2, shift);
  const idx = index(root3.bitmap, bit);
  if ((root3.bitmap & bit) !== 0) {
    const node = root3.array[idx];
    if (node.type !== ENTRY) {
      const n = assoc(node, shift + SHIFT, hash2, key3, val, addedLeaf);
      if (n === node) {
        return root3;
      }
      return {
        type: INDEX_NODE,
        bitmap: root3.bitmap,
        array: cloneAndSet(root3.array, idx, n)
      };
    }
    const nodeKey = node.k;
    if (isEqual(key3, nodeKey)) {
      if (val === node.v) {
        return root3;
      }
      return {
        type: INDEX_NODE,
        bitmap: root3.bitmap,
        array: cloneAndSet(root3.array, idx, {
          type: ENTRY,
          k: key3,
          v: val
        })
      };
    }
    addedLeaf.val = true;
    return {
      type: INDEX_NODE,
      bitmap: root3.bitmap,
      array: cloneAndSet(
        root3.array,
        idx,
        createNode(shift + SHIFT, nodeKey, node.v, hash2, key3, val)
      )
    };
  } else {
    const n = root3.array.length;
    if (n >= MAX_INDEX_NODE) {
      const nodes = new Array(32);
      const jdx = mask(hash2, shift);
      nodes[jdx] = assocIndex(EMPTY, shift + SHIFT, hash2, key3, val, addedLeaf);
      let j = 0;
      let bitmap = root3.bitmap;
      for (let i2 = 0; i2 < 32; i2++) {
        if ((bitmap & 1) !== 0) {
          const node = root3.array[j++];
          nodes[i2] = node;
        }
        bitmap = bitmap >>> 1;
      }
      return {
        type: ARRAY_NODE,
        size: n + 1,
        array: nodes
      };
    } else {
      const newArray = spliceIn(root3.array, idx, {
        type: ENTRY,
        k: key3,
        v: val
      });
      addedLeaf.val = true;
      return {
        type: INDEX_NODE,
        bitmap: root3.bitmap | bit,
        array: newArray
      };
    }
  }
}
function assocCollision(root3, shift, hash2, key3, val, addedLeaf) {
  if (hash2 === root3.hash) {
    const idx = collisionIndexOf(root3, key3);
    if (idx !== -1) {
      const entry = root3.array[idx];
      if (entry.v === val) {
        return root3;
      }
      return {
        type: COLLISION_NODE,
        hash: hash2,
        array: cloneAndSet(root3.array, idx, { type: ENTRY, k: key3, v: val })
      };
    }
    const size3 = root3.array.length;
    addedLeaf.val = true;
    return {
      type: COLLISION_NODE,
      hash: hash2,
      array: cloneAndSet(root3.array, size3, { type: ENTRY, k: key3, v: val })
    };
  }
  return assoc(
    {
      type: INDEX_NODE,
      bitmap: bitpos(root3.hash, shift),
      array: [root3]
    },
    shift,
    hash2,
    key3,
    val,
    addedLeaf
  );
}
function collisionIndexOf(root3, key3) {
  const size3 = root3.array.length;
  for (let i2 = 0; i2 < size3; i2++) {
    if (isEqual(key3, root3.array[i2].k)) {
      return i2;
    }
  }
  return -1;
}
function find(root3, shift, hash2, key3) {
  switch (root3.type) {
    case ARRAY_NODE:
      return findArray(root3, shift, hash2, key3);
    case INDEX_NODE:
      return findIndex(root3, shift, hash2, key3);
    case COLLISION_NODE:
      return findCollision(root3, key3);
  }
}
function findArray(root3, shift, hash2, key3) {
  const idx = mask(hash2, shift);
  const node = root3.array[idx];
  if (node === void 0) {
    return void 0;
  }
  if (node.type !== ENTRY) {
    return find(node, shift + SHIFT, hash2, key3);
  }
  if (isEqual(key3, node.k)) {
    return node;
  }
  return void 0;
}
function findIndex(root3, shift, hash2, key3) {
  const bit = bitpos(hash2, shift);
  if ((root3.bitmap & bit) === 0) {
    return void 0;
  }
  const idx = index(root3.bitmap, bit);
  const node = root3.array[idx];
  if (node.type !== ENTRY) {
    return find(node, shift + SHIFT, hash2, key3);
  }
  if (isEqual(key3, node.k)) {
    return node;
  }
  return void 0;
}
function findCollision(root3, key3) {
  const idx = collisionIndexOf(root3, key3);
  if (idx < 0) {
    return void 0;
  }
  return root3.array[idx];
}
function without(root3, shift, hash2, key3) {
  switch (root3.type) {
    case ARRAY_NODE:
      return withoutArray(root3, shift, hash2, key3);
    case INDEX_NODE:
      return withoutIndex(root3, shift, hash2, key3);
    case COLLISION_NODE:
      return withoutCollision(root3, key3);
  }
}
function withoutArray(root3, shift, hash2, key3) {
  const idx = mask(hash2, shift);
  const node = root3.array[idx];
  if (node === void 0) {
    return root3;
  }
  let n = void 0;
  if (node.type === ENTRY) {
    if (!isEqual(node.k, key3)) {
      return root3;
    }
  } else {
    n = without(node, shift + SHIFT, hash2, key3);
    if (n === node) {
      return root3;
    }
  }
  if (n === void 0) {
    if (root3.size <= MIN_ARRAY_NODE) {
      const arr = root3.array;
      const out = new Array(root3.size - 1);
      let i2 = 0;
      let j = 0;
      let bitmap = 0;
      while (i2 < idx) {
        const nv = arr[i2];
        if (nv !== void 0) {
          out[j] = nv;
          bitmap |= 1 << i2;
          ++j;
        }
        ++i2;
      }
      ++i2;
      while (i2 < arr.length) {
        const nv = arr[i2];
        if (nv !== void 0) {
          out[j] = nv;
          bitmap |= 1 << i2;
          ++j;
        }
        ++i2;
      }
      return {
        type: INDEX_NODE,
        bitmap,
        array: out
      };
    }
    return {
      type: ARRAY_NODE,
      size: root3.size - 1,
      array: cloneAndSet(root3.array, idx, n)
    };
  }
  return {
    type: ARRAY_NODE,
    size: root3.size,
    array: cloneAndSet(root3.array, idx, n)
  };
}
function withoutIndex(root3, shift, hash2, key3) {
  const bit = bitpos(hash2, shift);
  if ((root3.bitmap & bit) === 0) {
    return root3;
  }
  const idx = index(root3.bitmap, bit);
  const node = root3.array[idx];
  if (node.type !== ENTRY) {
    const n = without(node, shift + SHIFT, hash2, key3);
    if (n === node) {
      return root3;
    }
    if (n !== void 0) {
      return {
        type: INDEX_NODE,
        bitmap: root3.bitmap,
        array: cloneAndSet(root3.array, idx, n)
      };
    }
    if (root3.bitmap === bit) {
      return void 0;
    }
    return {
      type: INDEX_NODE,
      bitmap: root3.bitmap ^ bit,
      array: spliceOut(root3.array, idx)
    };
  }
  if (isEqual(key3, node.k)) {
    if (root3.bitmap === bit) {
      return void 0;
    }
    return {
      type: INDEX_NODE,
      bitmap: root3.bitmap ^ bit,
      array: spliceOut(root3.array, idx)
    };
  }
  return root3;
}
function withoutCollision(root3, key3) {
  const idx = collisionIndexOf(root3, key3);
  if (idx < 0) {
    return root3;
  }
  if (root3.array.length === 1) {
    return void 0;
  }
  return {
    type: COLLISION_NODE,
    hash: root3.hash,
    array: spliceOut(root3.array, idx)
  };
}
function forEach(root3, fn) {
  if (root3 === void 0) {
    return;
  }
  const items = root3.array;
  const size3 = items.length;
  for (let i2 = 0; i2 < size3; i2++) {
    const item = items[i2];
    if (item === void 0) {
      continue;
    }
    if (item.type === ENTRY) {
      fn(item.v, item.k);
      continue;
    }
    forEach(item, fn);
  }
}
var Dict = class _Dict {
  /**
   * @template V
   * @param {Record<string,V>} o
   * @returns {Dict<string,V>}
   */
  static fromObject(o) {
    const keys2 = Object.keys(o);
    let m = _Dict.new();
    for (let i2 = 0; i2 < keys2.length; i2++) {
      const k = keys2[i2];
      m = m.set(k, o[k]);
    }
    return m;
  }
  /**
   * @template K,V
   * @param {Map<K,V>} o
   * @returns {Dict<K,V>}
   */
  static fromMap(o) {
    let m = _Dict.new();
    o.forEach((v, k) => {
      m = m.set(k, v);
    });
    return m;
  }
  static new() {
    return new _Dict(void 0, 0);
  }
  /**
   * @param {undefined | Node<K,V>} root
   * @param {number} size
   */
  constructor(root3, size3) {
    this.root = root3;
    this.size = size3;
  }
  /**
   * @template NotFound
   * @param {K} key
   * @param {NotFound} notFound
   * @returns {NotFound | V}
   */
  get(key3, notFound) {
    if (this.root === void 0) {
      return notFound;
    }
    const found = find(this.root, 0, getHash(key3), key3);
    if (found === void 0) {
      return notFound;
    }
    return found.v;
  }
  /**
   * @param {K} key
   * @param {V} val
   * @returns {Dict<K,V>}
   */
  set(key3, val) {
    const addedLeaf = { val: false };
    const root3 = this.root === void 0 ? EMPTY : this.root;
    const newRoot = assoc(root3, 0, getHash(key3), key3, val, addedLeaf);
    if (newRoot === this.root) {
      return this;
    }
    return new _Dict(newRoot, addedLeaf.val ? this.size + 1 : this.size);
  }
  /**
   * @param {K} key
   * @returns {Dict<K,V>}
   */
  delete(key3) {
    if (this.root === void 0) {
      return this;
    }
    const newRoot = without(this.root, 0, getHash(key3), key3);
    if (newRoot === this.root) {
      return this;
    }
    if (newRoot === void 0) {
      return _Dict.new();
    }
    return new _Dict(newRoot, this.size - 1);
  }
  /**
   * @param {K} key
   * @returns {boolean}
   */
  has(key3) {
    if (this.root === void 0) {
      return false;
    }
    return find(this.root, 0, getHash(key3), key3) !== void 0;
  }
  /**
   * @returns {[K,V][]}
   */
  entries() {
    if (this.root === void 0) {
      return [];
    }
    const result = [];
    this.forEach((v, k) => result.push([k, v]));
    return result;
  }
  /**
   *
   * @param {(val:V,key:K)=>void} fn
   */
  forEach(fn) {
    forEach(this.root, fn);
  }
  hashCode() {
    let h = 0;
    this.forEach((v, k) => {
      h = h + hashMerge(getHash(v), getHash(k)) | 0;
    });
    return h;
  }
  /**
   * @param {unknown} o
   * @returns {boolean}
   */
  equals(o) {
    if (!(o instanceof _Dict) || this.size !== o.size) {
      return false;
    }
    try {
      this.forEach((v, k) => {
        if (!isEqual(o.get(k, !v), v)) {
          throw unequalDictSymbol;
        }
      });
      return true;
    } catch (e) {
      if (e === unequalDictSymbol) {
        return false;
      }
      throw e;
    }
  }
};
var unequalDictSymbol = /* @__PURE__ */ Symbol();

// build/dev/javascript/gleam_stdlib/gleam/bool.mjs
function or(a2, b) {
  return a2 || b;
}
function negate(bool4) {
  return !bool4;
}
function to_string(bool4) {
  if (bool4) {
    return "True";
  } else {
    return "False";
  }
}
function guard(requirement, consequence, alternative) {
  if (requirement) {
    return consequence;
  } else {
    return alternative();
  }
}
function lazy_guard(requirement, consequence, alternative) {
  if (requirement) {
    return consequence();
  } else {
    return alternative();
  }
}

// build/dev/javascript/gleam_stdlib/gleam/option.mjs
var Some = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var None = class extends CustomType {
};
function is_none(option) {
  return isEqual(option, new None());
}
function to_result(option, e) {
  if (option instanceof Some) {
    let a2 = option[0];
    return new Ok(a2);
  } else {
    return new Error2(e);
  }
}
function unwrap(option, default$) {
  if (option instanceof Some) {
    let x = option[0];
    return x;
  } else {
    return default$;
  }
}
function or2(first3, second2) {
  if (first3 instanceof Some) {
    return first3;
  } else {
    return second2;
  }
}

// build/dev/javascript/gleam_stdlib/gleam/order.mjs
var Lt = class extends CustomType {
};
var Eq = class extends CustomType {
};
var Gt = class extends CustomType {
};

// build/dev/javascript/gleam_stdlib/gleam/float.mjs
function compare(a2, b) {
  let $ = a2 === b;
  if ($) {
    return new Eq();
  } else {
    let $1 = a2 < b;
    if ($1) {
      return new Lt();
    } else {
      return new Gt();
    }
  }
}
function absolute_value(x) {
  let $ = x >= 0;
  if ($) {
    return x;
  } else {
    return 0 - x;
  }
}
function negate2(x) {
  return -1 * x;
}
function round2(x) {
  let $ = x >= 0;
  if ($) {
    return round(x);
  } else {
    return 0 - round(negate2(x));
  }
}

// build/dev/javascript/gleam_stdlib/gleam/int.mjs
function compare2(a2, b) {
  let $ = a2 === b;
  if ($) {
    return new Eq();
  } else {
    let $1 = a2 < b;
    if ($1) {
      return new Lt();
    } else {
      return new Gt();
    }
  }
}

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
var Ascending = class extends CustomType {
};
var Descending = class extends CustomType {
};
function length_loop(loop$list, loop$count) {
  while (true) {
    let list5 = loop$list;
    let count = loop$count;
    if (list5 instanceof Empty) {
      return count;
    } else {
      let list$1 = list5.tail;
      loop$list = list$1;
      loop$count = count + 1;
    }
  }
}
function length(list5) {
  return length_loop(list5, 0);
}
function reverse_and_prepend(loop$prefix, loop$suffix) {
  while (true) {
    let prefix = loop$prefix;
    let suffix = loop$suffix;
    if (prefix instanceof Empty) {
      return suffix;
    } else {
      let first$1 = prefix.head;
      let rest$1 = prefix.tail;
      loop$prefix = rest$1;
      loop$suffix = prepend(first$1, suffix);
    }
  }
}
function reverse(list5) {
  return reverse_and_prepend(list5, toList([]));
}
function is_empty2(list5) {
  return isEqual(list5, toList([]));
}
function contains(loop$list, loop$elem) {
  while (true) {
    let list5 = loop$list;
    let elem = loop$elem;
    if (list5 instanceof Empty) {
      return false;
    } else {
      let first$1 = list5.head;
      if (isEqual(first$1, elem)) {
        return true;
      } else {
        let rest$1 = list5.tail;
        loop$list = rest$1;
        loop$elem = elem;
      }
    }
  }
}
function first(list5) {
  if (list5 instanceof Empty) {
    return new Error2(void 0);
  } else {
    let first$1 = list5.head;
    return new Ok(first$1);
  }
}
function filter_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list5 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list5.head;
      let rest$1 = list5.tail;
      let _block;
      let $ = fun(first$1);
      if ($) {
        _block = prepend(first$1, acc);
      } else {
        _block = acc;
      }
      let new_acc = _block;
      loop$list = rest$1;
      loop$fun = fun;
      loop$acc = new_acc;
    }
  }
}
function filter(list5, predicate) {
  return filter_loop(list5, predicate, toList([]));
}
function filter_map_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list5 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list5.head;
      let rest$1 = list5.tail;
      let _block;
      let $ = fun(first$1);
      if ($ instanceof Ok) {
        let first$2 = $[0];
        _block = prepend(first$2, acc);
      } else {
        _block = acc;
      }
      let new_acc = _block;
      loop$list = rest$1;
      loop$fun = fun;
      loop$acc = new_acc;
    }
  }
}
function filter_map(list5, fun) {
  return filter_map_loop(list5, fun, toList([]));
}
function map_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list5 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list5.head;
      let rest$1 = list5.tail;
      loop$list = rest$1;
      loop$fun = fun;
      loop$acc = prepend(fun(first$1), acc);
    }
  }
}
function map(list5, fun) {
  return map_loop(list5, fun, toList([]));
}
function index_map_loop(loop$list, loop$fun, loop$index, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let fun = loop$fun;
    let index5 = loop$index;
    let acc = loop$acc;
    if (list5 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list5.head;
      let rest$1 = list5.tail;
      let acc$1 = prepend(fun(first$1, index5), acc);
      loop$list = rest$1;
      loop$fun = fun;
      loop$index = index5 + 1;
      loop$acc = acc$1;
    }
  }
}
function index_map(list5, fun) {
  return index_map_loop(list5, fun, 0, toList([]));
}
function take_loop(loop$list, loop$n, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let n = loop$n;
    let acc = loop$acc;
    let $ = n <= 0;
    if ($) {
      return reverse(acc);
    } else {
      if (list5 instanceof Empty) {
        return reverse(acc);
      } else {
        let first$1 = list5.head;
        let rest$1 = list5.tail;
        loop$list = rest$1;
        loop$n = n - 1;
        loop$acc = prepend(first$1, acc);
      }
    }
  }
}
function take(list5, n) {
  return take_loop(list5, n, toList([]));
}
function append_loop(loop$first, loop$second) {
  while (true) {
    let first3 = loop$first;
    let second2 = loop$second;
    if (first3 instanceof Empty) {
      return second2;
    } else {
      let first$1 = first3.head;
      let rest$1 = first3.tail;
      loop$first = rest$1;
      loop$second = prepend(first$1, second2);
    }
  }
}
function append(first3, second2) {
  return append_loop(reverse(first3), second2);
}
function prepend2(list5, item) {
  return prepend(item, list5);
}
function flatten_loop(loop$lists, loop$acc) {
  while (true) {
    let lists = loop$lists;
    let acc = loop$acc;
    if (lists instanceof Empty) {
      return reverse(acc);
    } else {
      let list5 = lists.head;
      let further_lists = lists.tail;
      loop$lists = further_lists;
      loop$acc = reverse_and_prepend(list5, acc);
    }
  }
}
function flatten(lists) {
  return flatten_loop(lists, toList([]));
}
function flat_map(list5, fun) {
  return flatten(map(list5, fun));
}
function fold(loop$list, loop$initial, loop$fun) {
  while (true) {
    let list5 = loop$list;
    let initial = loop$initial;
    let fun = loop$fun;
    if (list5 instanceof Empty) {
      return initial;
    } else {
      let first$1 = list5.head;
      let rest$1 = list5.tail;
      loop$list = rest$1;
      loop$initial = fun(initial, first$1);
      loop$fun = fun;
    }
  }
}
function find2(loop$list, loop$is_desired) {
  while (true) {
    let list5 = loop$list;
    let is_desired = loop$is_desired;
    if (list5 instanceof Empty) {
      return new Error2(void 0);
    } else {
      let first$1 = list5.head;
      let rest$1 = list5.tail;
      let $ = is_desired(first$1);
      if ($) {
        return new Ok(first$1);
      } else {
        loop$list = rest$1;
        loop$is_desired = is_desired;
      }
    }
  }
}
function find_map(loop$list, loop$fun) {
  while (true) {
    let list5 = loop$list;
    let fun = loop$fun;
    if (list5 instanceof Empty) {
      return new Error2(void 0);
    } else {
      let first$1 = list5.head;
      let rest$1 = list5.tail;
      let $ = fun(first$1);
      if ($ instanceof Ok) {
        return $;
      } else {
        loop$list = rest$1;
        loop$fun = fun;
      }
    }
  }
}
function intersperse_loop(loop$list, loop$separator, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let separator = loop$separator;
    let acc = loop$acc;
    if (list5 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list5.head;
      let rest$1 = list5.tail;
      loop$list = rest$1;
      loop$separator = separator;
      loop$acc = prepend(first$1, prepend(separator, acc));
    }
  }
}
function intersperse(list5, elem) {
  if (list5 instanceof Empty) {
    return list5;
  } else {
    let $ = list5.tail;
    if ($ instanceof Empty) {
      return list5;
    } else {
      let first$1 = list5.head;
      let rest$1 = $;
      return intersperse_loop(rest$1, elem, toList([first$1]));
    }
  }
}
function sequences(loop$list, loop$compare, loop$growing, loop$direction, loop$prev, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let compare5 = loop$compare;
    let growing = loop$growing;
    let direction = loop$direction;
    let prev = loop$prev;
    let acc = loop$acc;
    let growing$1 = prepend(prev, growing);
    if (list5 instanceof Empty) {
      if (direction instanceof Ascending) {
        return prepend(reverse(growing$1), acc);
      } else {
        return prepend(growing$1, acc);
      }
    } else {
      let new$1 = list5.head;
      let rest$1 = list5.tail;
      let $ = compare5(prev, new$1);
      if (direction instanceof Ascending) {
        if ($ instanceof Lt) {
          loop$list = rest$1;
          loop$compare = compare5;
          loop$growing = growing$1;
          loop$direction = direction;
          loop$prev = new$1;
          loop$acc = acc;
        } else if ($ instanceof Eq) {
          loop$list = rest$1;
          loop$compare = compare5;
          loop$growing = growing$1;
          loop$direction = direction;
          loop$prev = new$1;
          loop$acc = acc;
        } else {
          let _block;
          if (direction instanceof Ascending) {
            _block = prepend(reverse(growing$1), acc);
          } else {
            _block = prepend(growing$1, acc);
          }
          let acc$1 = _block;
          if (rest$1 instanceof Empty) {
            return prepend(toList([new$1]), acc$1);
          } else {
            let next2 = rest$1.head;
            let rest$2 = rest$1.tail;
            let _block$1;
            let $1 = compare5(new$1, next2);
            if ($1 instanceof Lt) {
              _block$1 = new Ascending();
            } else if ($1 instanceof Eq) {
              _block$1 = new Ascending();
            } else {
              _block$1 = new Descending();
            }
            let direction$1 = _block$1;
            loop$list = rest$2;
            loop$compare = compare5;
            loop$growing = toList([new$1]);
            loop$direction = direction$1;
            loop$prev = next2;
            loop$acc = acc$1;
          }
        }
      } else if ($ instanceof Lt) {
        let _block;
        if (direction instanceof Ascending) {
          _block = prepend(reverse(growing$1), acc);
        } else {
          _block = prepend(growing$1, acc);
        }
        let acc$1 = _block;
        if (rest$1 instanceof Empty) {
          return prepend(toList([new$1]), acc$1);
        } else {
          let next2 = rest$1.head;
          let rest$2 = rest$1.tail;
          let _block$1;
          let $1 = compare5(new$1, next2);
          if ($1 instanceof Lt) {
            _block$1 = new Ascending();
          } else if ($1 instanceof Eq) {
            _block$1 = new Ascending();
          } else {
            _block$1 = new Descending();
          }
          let direction$1 = _block$1;
          loop$list = rest$2;
          loop$compare = compare5;
          loop$growing = toList([new$1]);
          loop$direction = direction$1;
          loop$prev = next2;
          loop$acc = acc$1;
        }
      } else if ($ instanceof Eq) {
        let _block;
        if (direction instanceof Ascending) {
          _block = prepend(reverse(growing$1), acc);
        } else {
          _block = prepend(growing$1, acc);
        }
        let acc$1 = _block;
        if (rest$1 instanceof Empty) {
          return prepend(toList([new$1]), acc$1);
        } else {
          let next2 = rest$1.head;
          let rest$2 = rest$1.tail;
          let _block$1;
          let $1 = compare5(new$1, next2);
          if ($1 instanceof Lt) {
            _block$1 = new Ascending();
          } else if ($1 instanceof Eq) {
            _block$1 = new Ascending();
          } else {
            _block$1 = new Descending();
          }
          let direction$1 = _block$1;
          loop$list = rest$2;
          loop$compare = compare5;
          loop$growing = toList([new$1]);
          loop$direction = direction$1;
          loop$prev = next2;
          loop$acc = acc$1;
        }
      } else {
        loop$list = rest$1;
        loop$compare = compare5;
        loop$growing = growing$1;
        loop$direction = direction;
        loop$prev = new$1;
        loop$acc = acc;
      }
    }
  }
}
function merge_ascendings(loop$list1, loop$list2, loop$compare, loop$acc) {
  while (true) {
    let list1 = loop$list1;
    let list22 = loop$list2;
    let compare5 = loop$compare;
    let acc = loop$acc;
    if (list1 instanceof Empty) {
      let list5 = list22;
      return reverse_and_prepend(list5, acc);
    } else if (list22 instanceof Empty) {
      let list5 = list1;
      return reverse_and_prepend(list5, acc);
    } else {
      let first1 = list1.head;
      let rest1 = list1.tail;
      let first22 = list22.head;
      let rest2 = list22.tail;
      let $ = compare5(first1, first22);
      if ($ instanceof Lt) {
        loop$list1 = rest1;
        loop$list2 = list22;
        loop$compare = compare5;
        loop$acc = prepend(first1, acc);
      } else if ($ instanceof Eq) {
        loop$list1 = list1;
        loop$list2 = rest2;
        loop$compare = compare5;
        loop$acc = prepend(first22, acc);
      } else {
        loop$list1 = list1;
        loop$list2 = rest2;
        loop$compare = compare5;
        loop$acc = prepend(first22, acc);
      }
    }
  }
}
function merge_ascending_pairs(loop$sequences, loop$compare, loop$acc) {
  while (true) {
    let sequences2 = loop$sequences;
    let compare5 = loop$compare;
    let acc = loop$acc;
    if (sequences2 instanceof Empty) {
      return reverse(acc);
    } else {
      let $ = sequences2.tail;
      if ($ instanceof Empty) {
        let sequence = sequences2.head;
        return reverse(prepend(reverse(sequence), acc));
      } else {
        let ascending1 = sequences2.head;
        let ascending2 = $.head;
        let rest$1 = $.tail;
        let descending = merge_ascendings(
          ascending1,
          ascending2,
          compare5,
          toList([])
        );
        loop$sequences = rest$1;
        loop$compare = compare5;
        loop$acc = prepend(descending, acc);
      }
    }
  }
}
function merge_descendings(loop$list1, loop$list2, loop$compare, loop$acc) {
  while (true) {
    let list1 = loop$list1;
    let list22 = loop$list2;
    let compare5 = loop$compare;
    let acc = loop$acc;
    if (list1 instanceof Empty) {
      let list5 = list22;
      return reverse_and_prepend(list5, acc);
    } else if (list22 instanceof Empty) {
      let list5 = list1;
      return reverse_and_prepend(list5, acc);
    } else {
      let first1 = list1.head;
      let rest1 = list1.tail;
      let first22 = list22.head;
      let rest2 = list22.tail;
      let $ = compare5(first1, first22);
      if ($ instanceof Lt) {
        loop$list1 = list1;
        loop$list2 = rest2;
        loop$compare = compare5;
        loop$acc = prepend(first22, acc);
      } else if ($ instanceof Eq) {
        loop$list1 = rest1;
        loop$list2 = list22;
        loop$compare = compare5;
        loop$acc = prepend(first1, acc);
      } else {
        loop$list1 = rest1;
        loop$list2 = list22;
        loop$compare = compare5;
        loop$acc = prepend(first1, acc);
      }
    }
  }
}
function merge_descending_pairs(loop$sequences, loop$compare, loop$acc) {
  while (true) {
    let sequences2 = loop$sequences;
    let compare5 = loop$compare;
    let acc = loop$acc;
    if (sequences2 instanceof Empty) {
      return reverse(acc);
    } else {
      let $ = sequences2.tail;
      if ($ instanceof Empty) {
        let sequence = sequences2.head;
        return reverse(prepend(reverse(sequence), acc));
      } else {
        let descending1 = sequences2.head;
        let descending2 = $.head;
        let rest$1 = $.tail;
        let ascending = merge_descendings(
          descending1,
          descending2,
          compare5,
          toList([])
        );
        loop$sequences = rest$1;
        loop$compare = compare5;
        loop$acc = prepend(ascending, acc);
      }
    }
  }
}
function merge_all(loop$sequences, loop$direction, loop$compare) {
  while (true) {
    let sequences2 = loop$sequences;
    let direction = loop$direction;
    let compare5 = loop$compare;
    if (sequences2 instanceof Empty) {
      return sequences2;
    } else if (direction instanceof Ascending) {
      let $ = sequences2.tail;
      if ($ instanceof Empty) {
        let sequence = sequences2.head;
        return sequence;
      } else {
        let sequences$1 = merge_ascending_pairs(sequences2, compare5, toList([]));
        loop$sequences = sequences$1;
        loop$direction = new Descending();
        loop$compare = compare5;
      }
    } else {
      let $ = sequences2.tail;
      if ($ instanceof Empty) {
        let sequence = sequences2.head;
        return reverse(sequence);
      } else {
        let sequences$1 = merge_descending_pairs(sequences2, compare5, toList([]));
        loop$sequences = sequences$1;
        loop$direction = new Ascending();
        loop$compare = compare5;
      }
    }
  }
}
function sort(list5, compare5) {
  if (list5 instanceof Empty) {
    return list5;
  } else {
    let $ = list5.tail;
    if ($ instanceof Empty) {
      return list5;
    } else {
      let x = list5.head;
      let y = $.head;
      let rest$1 = $.tail;
      let _block;
      let $1 = compare5(x, y);
      if ($1 instanceof Lt) {
        _block = new Ascending();
      } else if ($1 instanceof Eq) {
        _block = new Ascending();
      } else {
        _block = new Descending();
      }
      let direction = _block;
      let sequences$1 = sequences(
        rest$1,
        compare5,
        toList([x]),
        direction,
        y,
        toList([])
      );
      return merge_all(sequences$1, new Ascending(), compare5);
    }
  }
}
function range_loop(loop$start, loop$stop, loop$acc) {
  while (true) {
    let start4 = loop$start;
    let stop = loop$stop;
    let acc = loop$acc;
    let $ = compare2(start4, stop);
    if ($ instanceof Lt) {
      loop$start = start4;
      loop$stop = stop - 1;
      loop$acc = prepend(stop, acc);
    } else if ($ instanceof Eq) {
      return prepend(stop, acc);
    } else {
      loop$start = start4;
      loop$stop = stop + 1;
      loop$acc = prepend(stop, acc);
    }
  }
}
function range(start4, stop) {
  return range_loop(start4, stop, toList([]));
}
function split_loop(loop$list, loop$n, loop$taken) {
  while (true) {
    let list5 = loop$list;
    let n = loop$n;
    let taken = loop$taken;
    let $ = n <= 0;
    if ($) {
      return [reverse(taken), list5];
    } else {
      if (list5 instanceof Empty) {
        return [reverse(taken), toList([])];
      } else {
        let first$1 = list5.head;
        let rest$1 = list5.tail;
        loop$list = rest$1;
        loop$n = n - 1;
        loop$taken = prepend(first$1, taken);
      }
    }
  }
}
function split(list5, index5) {
  return split_loop(list5, index5, toList([]));
}
function key_find(keyword_list, desired_key) {
  return find_map(
    keyword_list,
    (keyword) => {
      let key3;
      let value3;
      key3 = keyword[0];
      value3 = keyword[1];
      let $ = isEqual(key3, desired_key);
      if ($) {
        return new Ok(value3);
      } else {
        return new Error2(void 0);
      }
    }
  );
}
function key_filter(keyword_list, desired_key) {
  return filter_map(
    keyword_list,
    (keyword) => {
      let key3;
      let value3;
      key3 = keyword[0];
      value3 = keyword[1];
      let $ = isEqual(key3, desired_key);
      if ($) {
        return new Ok(value3);
      } else {
        return new Error2(void 0);
      }
    }
  );
}
function shuffle_pair_unwrap_loop(loop$list, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let acc = loop$acc;
    if (list5 instanceof Empty) {
      return acc;
    } else {
      let elem_pair = list5.head;
      let enumerable = list5.tail;
      loop$list = enumerable;
      loop$acc = prepend(elem_pair[1], acc);
    }
  }
}
function do_shuffle_by_pair_indexes(list_of_pairs) {
  return sort(
    list_of_pairs,
    (a_pair, b_pair) => {
      return compare(a_pair[0], b_pair[0]);
    }
  );
}
function shuffle(list5) {
  let _pipe = list5;
  let _pipe$1 = fold(
    _pipe,
    toList([]),
    (acc, a2) => {
      return prepend([random_uniform(), a2], acc);
    }
  );
  let _pipe$2 = do_shuffle_by_pair_indexes(_pipe$1);
  return shuffle_pair_unwrap_loop(_pipe$2, toList([]));
}

// build/dev/javascript/gleam_stdlib/gleam/string.mjs
function replace(string6, pattern, substitute) {
  let _pipe = string6;
  let _pipe$1 = identity(_pipe);
  let _pipe$2 = string_replace(_pipe$1, pattern, substitute);
  return identity(_pipe$2);
}
function compare3(a2, b) {
  let $ = a2 === b;
  if ($) {
    return new Eq();
  } else {
    let $1 = less_than(a2, b);
    if ($1) {
      return new Lt();
    } else {
      return new Gt();
    }
  }
}
function slice(string6, idx, len) {
  let $ = len < 0;
  if ($) {
    return "";
  } else {
    let $1 = idx < 0;
    if ($1) {
      let translated_idx = string_length(string6) + idx;
      let $2 = translated_idx < 0;
      if ($2) {
        return "";
      } else {
        return string_slice(string6, translated_idx, len);
      }
    } else {
      return string_slice(string6, idx, len);
    }
  }
}
function append2(first3, second2) {
  return first3 + second2;
}
function concat_loop(loop$strings, loop$accumulator) {
  while (true) {
    let strings = loop$strings;
    let accumulator = loop$accumulator;
    if (strings instanceof Empty) {
      return accumulator;
    } else {
      let string6 = strings.head;
      let strings$1 = strings.tail;
      loop$strings = strings$1;
      loop$accumulator = accumulator + string6;
    }
  }
}
function concat2(strings) {
  return concat_loop(strings, "");
}
function repeat_loop(loop$string, loop$times, loop$acc) {
  while (true) {
    let string6 = loop$string;
    let times = loop$times;
    let acc = loop$acc;
    let $ = times <= 0;
    if ($) {
      return acc;
    } else {
      loop$string = string6;
      loop$times = times - 1;
      loop$acc = acc + string6;
    }
  }
}
function repeat(string6, times) {
  return repeat_loop(string6, times, "");
}
function join_loop(loop$strings, loop$separator, loop$accumulator) {
  while (true) {
    let strings = loop$strings;
    let separator = loop$separator;
    let accumulator = loop$accumulator;
    if (strings instanceof Empty) {
      return accumulator;
    } else {
      let string6 = strings.head;
      let strings$1 = strings.tail;
      loop$strings = strings$1;
      loop$separator = separator;
      loop$accumulator = accumulator + separator + string6;
    }
  }
}
function join(strings, separator) {
  if (strings instanceof Empty) {
    return "";
  } else {
    let first$1 = strings.head;
    let rest = strings.tail;
    return join_loop(rest, separator, first$1);
  }
}
function padding(size3, pad_string) {
  let pad_string_length = string_length(pad_string);
  let num_pads = divideInt(size3, pad_string_length);
  let extra = remainderInt(size3, pad_string_length);
  return repeat(pad_string, num_pads) + slice(pad_string, 0, extra);
}
function pad_start(string6, desired_length, pad_string) {
  let current_length = string_length(string6);
  let to_pad_length = desired_length - current_length;
  let $ = to_pad_length <= 0;
  if ($) {
    return string6;
  } else {
    return padding(to_pad_length, pad_string) + string6;
  }
}
function split3(x, substring) {
  if (substring === "") {
    return graphemes(x);
  } else {
    let _pipe = x;
    let _pipe$1 = identity(_pipe);
    let _pipe$2 = split2(_pipe$1, substring);
    return map(_pipe$2, identity);
  }
}
function capitalise(string6) {
  let $ = pop_grapheme(string6);
  if ($ instanceof Ok) {
    let first$1 = $[0][0];
    let rest = $[0][1];
    return append2(uppercase(first$1), lowercase(rest));
  } else {
    return "";
  }
}

// build/dev/javascript/gleam_stdlib/gleam/dynamic/decode.mjs
var DecodeError = class extends CustomType {
  constructor(expected, found, path) {
    super();
    this.expected = expected;
    this.found = found;
    this.path = path;
  }
};
var Decoder = class extends CustomType {
  constructor(function$) {
    super();
    this.function = function$;
  }
};
function run(data2, decoder2) {
  let $ = decoder2.function(data2);
  let maybe_invalid_data;
  let errors;
  maybe_invalid_data = $[0];
  errors = $[1];
  if (errors instanceof Empty) {
    return new Ok(maybe_invalid_data);
  } else {
    return new Error2(errors);
  }
}
function success(data2) {
  return new Decoder((_) => {
    return [data2, toList([])];
  });
}
function map2(decoder2, transformer) {
  return new Decoder(
    (d) => {
      let $ = decoder2.function(d);
      let data2;
      let errors;
      data2 = $[0];
      errors = $[1];
      return [transformer(data2), errors];
    }
  );
}
function then$(decoder2, next2) {
  return new Decoder(
    (dynamic_data) => {
      let $ = decoder2.function(dynamic_data);
      let data2;
      let errors;
      data2 = $[0];
      errors = $[1];
      let decoder$1 = next2(data2);
      let $1 = decoder$1.function(dynamic_data);
      let layer;
      let data$1;
      layer = $1;
      data$1 = $1[0];
      if (errors instanceof Empty) {
        return layer;
      } else {
        return [data$1, errors];
      }
    }
  );
}
function run_decoders(loop$data, loop$failure, loop$decoders) {
  while (true) {
    let data2 = loop$data;
    let failure2 = loop$failure;
    let decoders = loop$decoders;
    if (decoders instanceof Empty) {
      return failure2;
    } else {
      let decoder2 = decoders.head;
      let decoders$1 = decoders.tail;
      let $ = decoder2.function(data2);
      let layer;
      let errors;
      layer = $;
      errors = $[1];
      if (errors instanceof Empty) {
        return layer;
      } else {
        loop$data = data2;
        loop$failure = failure2;
        loop$decoders = decoders$1;
      }
    }
  }
}
function one_of(first3, alternatives) {
  return new Decoder(
    (dynamic_data) => {
      let $ = first3.function(dynamic_data);
      let layer;
      let errors;
      layer = $;
      errors = $[1];
      if (errors instanceof Empty) {
        return layer;
      } else {
        return run_decoders(dynamic_data, layer, alternatives);
      }
    }
  );
}
function decode_error(expected, found) {
  return toList([
    new DecodeError(expected, classify_dynamic(found), toList([]))
  ]);
}
function run_dynamic_function(data2, name2, f) {
  let $ = f(data2);
  if ($ instanceof Ok) {
    let data$1 = $[0];
    return [data$1, toList([])];
  } else {
    let zero = $[0];
    return [
      zero,
      toList([new DecodeError(name2, classify_dynamic(data2), toList([]))])
    ];
  }
}
function decode_bool(data2) {
  let $ = isEqual(identity(true), data2);
  if ($) {
    return [true, toList([])];
  } else {
    let $1 = isEqual(identity(false), data2);
    if ($1) {
      return [false, toList([])];
    } else {
      return [false, decode_error("Bool", data2)];
    }
  }
}
function decode_int(data2) {
  return run_dynamic_function(data2, "Int", int);
}
function decode_float(data2) {
  return run_dynamic_function(data2, "Float", float);
}
function new_primitive_decoder(name2, decoding_function) {
  return new Decoder(
    (d) => {
      let $ = decoding_function(d);
      if ($ instanceof Ok) {
        let t = $[0];
        return [t, toList([])];
      } else {
        let zero = $[0];
        return [
          zero,
          toList([new DecodeError(name2, classify_dynamic(d), toList([]))])
        ];
      }
    }
  );
}
var bool = /* @__PURE__ */ new Decoder(decode_bool);
var int2 = /* @__PURE__ */ new Decoder(decode_int);
var float2 = /* @__PURE__ */ new Decoder(decode_float);
function decode_string(data2) {
  return run_dynamic_function(data2, "String", string2);
}
var string3 = /* @__PURE__ */ new Decoder(decode_string);
function list2(inner) {
  return new Decoder(
    (data2) => {
      return list(
        data2,
        inner.function,
        (p2, k) => {
          return push_path(p2, toList([k]));
        },
        0,
        toList([])
      );
    }
  );
}
function push_path(layer, path) {
  let decoder2 = one_of(
    string3,
    toList([
      (() => {
        let _pipe = int2;
        return map2(_pipe, to_string2);
      })()
    ])
  );
  let path$1 = map(
    path,
    (key3) => {
      let key$1 = identity(key3);
      let $ = run(key$1, decoder2);
      if ($ instanceof Ok) {
        let key$2 = $[0];
        return key$2;
      } else {
        return "<" + classify_dynamic(key$1) + ">";
      }
    }
  );
  let errors = map(
    layer[1],
    (error) => {
      return new DecodeError(
        error.expected,
        error.found,
        append(path$1, error.path)
      );
    }
  );
  return [layer[0], errors];
}
function index3(loop$path, loop$position, loop$inner, loop$data, loop$handle_miss) {
  while (true) {
    let path = loop$path;
    let position = loop$position;
    let inner = loop$inner;
    let data2 = loop$data;
    let handle_miss = loop$handle_miss;
    if (path instanceof Empty) {
      let _pipe = inner(data2);
      return push_path(_pipe, reverse(position));
    } else {
      let key3 = path.head;
      let path$1 = path.tail;
      let $ = index2(data2, key3);
      if ($ instanceof Ok) {
        let $1 = $[0];
        if ($1 instanceof Some) {
          let data$1 = $1[0];
          loop$path = path$1;
          loop$position = prepend(key3, position);
          loop$inner = inner;
          loop$data = data$1;
          loop$handle_miss = handle_miss;
        } else {
          return handle_miss(data2, prepend(key3, position));
        }
      } else {
        let kind = $[0];
        let $1 = inner(data2);
        let default$;
        default$ = $1[0];
        let _pipe = [
          default$,
          toList([new DecodeError(kind, classify_dynamic(data2), toList([]))])
        ];
        return push_path(_pipe, reverse(position));
      }
    }
  }
}
function subfield(field_path, field_decoder, next2) {
  return new Decoder(
    (data2) => {
      let $ = index3(
        field_path,
        toList([]),
        field_decoder.function,
        data2,
        (data3, position) => {
          let $12 = field_decoder.function(data3);
          let default$;
          default$ = $12[0];
          let _pipe = [
            default$,
            toList([new DecodeError("Field", "Nothing", toList([]))])
          ];
          return push_path(_pipe, reverse(position));
        }
      );
      let out;
      let errors1;
      out = $[0];
      errors1 = $[1];
      let $1 = next2(out).function(data2);
      let out$1;
      let errors2;
      out$1 = $1[0];
      errors2 = $1[1];
      return [out$1, append(errors1, errors2)];
    }
  );
}
function at(path, inner) {
  return new Decoder(
    (data2) => {
      return index3(
        path,
        toList([]),
        inner.function,
        data2,
        (data3, position) => {
          let $ = inner.function(data3);
          let default$;
          default$ = $[0];
          let _pipe = [
            default$,
            toList([new DecodeError("Field", "Nothing", toList([]))])
          ];
          return push_path(_pipe, reverse(position));
        }
      );
    }
  );
}
function field(field_name, field_decoder, next2) {
  return subfield(toList([field_name]), field_decoder, next2);
}
function optional_field(key3, default$, field_decoder, next2) {
  return new Decoder(
    (data2) => {
      let _block;
      let _block$1;
      let $1 = index2(data2, key3);
      if ($1 instanceof Ok) {
        let $22 = $1[0];
        if ($22 instanceof Some) {
          let data$1 = $22[0];
          _block$1 = field_decoder.function(data$1);
        } else {
          _block$1 = [default$, toList([])];
        }
      } else {
        let kind = $1[0];
        _block$1 = [
          default$,
          toList([new DecodeError(kind, classify_dynamic(data2), toList([]))])
        ];
      }
      let _pipe = _block$1;
      _block = push_path(_pipe, toList([key3]));
      let $ = _block;
      let out;
      let errors1;
      out = $[0];
      errors1 = $[1];
      let $2 = next2(out).function(data2);
      let out$1;
      let errors2;
      out$1 = $2[0];
      errors2 = $2[1];
      return [out$1, append(errors1, errors2)];
    }
  );
}
function optionally_at(path, default$, inner) {
  return new Decoder(
    (data2) => {
      return index3(
        path,
        toList([]),
        inner.function,
        data2,
        (_, _1) => {
          return [default$, toList([])];
        }
      );
    }
  );
}

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
var Nil = void 0;
var NOT_FOUND = {};
function identity(x) {
  return x;
}
function parse_int(value3) {
  if (/^[-+]?(\d+)$/.test(value3)) {
    return new Ok(parseInt(value3));
  } else {
    return new Error2(Nil);
  }
}
function parse_float(value3) {
  if (/^[-+]?(\d+)\.(\d+)([eE][-+]?\d+)?$/.test(value3)) {
    return new Ok(parseFloat(value3));
  } else {
    return new Error2(Nil);
  }
}
function to_string2(term) {
  return term.toString();
}
function string_replace(string6, target3, substitute) {
  return string6.replaceAll(target3, substitute);
}
function string_length(string6) {
  if (string6 === "") {
    return 0;
  }
  const iterator = graphemes_iterator(string6);
  if (iterator) {
    let i2 = 0;
    for (const _ of iterator) {
      i2++;
    }
    return i2;
  } else {
    return string6.match(/./gsu).length;
  }
}
function graphemes(string6) {
  const iterator = graphemes_iterator(string6);
  if (iterator) {
    return List.fromArray(Array.from(iterator).map((item) => item.segment));
  } else {
    return List.fromArray(string6.match(/./gsu));
  }
}
var segmenter = void 0;
function graphemes_iterator(string6) {
  if (globalThis.Intl && Intl.Segmenter) {
    segmenter ||= new Intl.Segmenter();
    return segmenter.segment(string6)[Symbol.iterator]();
  }
}
function pop_grapheme(string6) {
  let first3;
  const iterator = graphemes_iterator(string6);
  if (iterator) {
    first3 = iterator.next().value?.segment;
  } else {
    first3 = string6.match(/./su)?.[0];
  }
  if (first3) {
    return new Ok([first3, string6.slice(first3.length)]);
  } else {
    return new Error2(Nil);
  }
}
function pop_codeunit(str) {
  return [str.charCodeAt(0) | 0, str.slice(1)];
}
function lowercase(string6) {
  return string6.toLowerCase();
}
function uppercase(string6) {
  return string6.toUpperCase();
}
function less_than(a2, b) {
  return a2 < b;
}
function split2(xs, pattern) {
  return List.fromArray(xs.split(pattern));
}
function concat(xs) {
  let result = "";
  for (const x of xs) {
    result = result + x;
  }
  return result;
}
function string_slice(string6, idx, len) {
  if (len <= 0 || idx >= string6.length) {
    return "";
  }
  const iterator = graphemes_iterator(string6);
  if (iterator) {
    while (idx-- > 0) {
      iterator.next();
    }
    let result = "";
    while (len-- > 0) {
      const v = iterator.next().value;
      if (v === void 0) {
        break;
      }
      result += v.segment;
    }
    return result;
  } else {
    return string6.match(/./gsu).slice(idx, idx + len).join("");
  }
}
function string_codeunit_slice(str, from2, length5) {
  return str.slice(from2, from2 + length5);
}
function contains_string(haystack, needle) {
  return haystack.indexOf(needle) >= 0;
}
function starts_with(haystack, needle) {
  return haystack.startsWith(needle);
}
var unicode_whitespaces = [
  " ",
  // Space
  "	",
  // Horizontal tab
  "\n",
  // Line feed
  "\v",
  // Vertical tab
  "\f",
  // Form feed
  "\r",
  // Carriage return
  "\x85",
  // Next line
  "\u2028",
  // Line separator
  "\u2029"
  // Paragraph separator
].join("");
var trim_start_regex = /* @__PURE__ */ new RegExp(
  `^[${unicode_whitespaces}]*`
);
var trim_end_regex = /* @__PURE__ */ new RegExp(`[${unicode_whitespaces}]*$`);
function round(float4) {
  return Math.round(float4);
}
function truncate(float4) {
  return Math.trunc(float4);
}
function random_uniform() {
  const random_uniform_result = Math.random();
  if (random_uniform_result === 1) {
    return random_uniform();
  }
  return random_uniform_result;
}
function new_map() {
  return Dict.new();
}
function map_to_list(map7) {
  return List.fromArray(map7.entries());
}
function map_remove(key3, map7) {
  return map7.delete(key3);
}
function map_get(map7, key3) {
  const value3 = map7.get(key3, NOT_FOUND);
  if (value3 === NOT_FOUND) {
    return new Error2(Nil);
  }
  return new Ok(value3);
}
function map_insert(key3, value3, map7) {
  return map7.set(key3, value3);
}
function unsafe_percent_decode(string6) {
  return decodeURIComponent(string6 || "");
}
function percent_decode(string6) {
  try {
    return new Ok(unsafe_percent_decode(string6));
  } catch {
    return new Error2(Nil);
  }
}
function percent_encode(string6) {
  return encodeURIComponent(string6).replace("%2B", "+");
}
function classify_dynamic(data2) {
  if (typeof data2 === "string") {
    return "String";
  } else if (typeof data2 === "boolean") {
    return "Bool";
  } else if (data2 instanceof Result) {
    return "Result";
  } else if (data2 instanceof List) {
    return "List";
  } else if (data2 instanceof BitArray) {
    return "BitArray";
  } else if (data2 instanceof Dict) {
    return "Dict";
  } else if (Number.isInteger(data2)) {
    return "Int";
  } else if (Array.isArray(data2)) {
    return `Array`;
  } else if (typeof data2 === "number") {
    return "Float";
  } else if (data2 === null) {
    return "Nil";
  } else if (data2 === void 0) {
    return "Nil";
  } else {
    const type = typeof data2;
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
function float_to_string(float4) {
  const string6 = float4.toString().replace("+", "");
  if (string6.indexOf(".") >= 0) {
    return string6;
  } else {
    const index5 = string6.indexOf("e");
    if (index5 >= 0) {
      return string6.slice(0, index5) + ".0" + string6.slice(index5);
    } else {
      return string6 + ".0";
    }
  }
}
function index2(data2, key3) {
  if (data2 instanceof Dict || data2 instanceof WeakMap || data2 instanceof Map) {
    const token = {};
    const entry = data2.get(key3, token);
    if (entry === token) return new Ok(new None());
    return new Ok(new Some(entry));
  }
  const key_is_int = Number.isInteger(key3);
  if (key_is_int && key3 >= 0 && key3 < 8 && data2 instanceof List) {
    let i2 = 0;
    for (const value3 of data2) {
      if (i2 === key3) return new Ok(new Some(value3));
      i2++;
    }
    return new Error2("Indexable");
  }
  if (key_is_int && Array.isArray(data2) || data2 && typeof data2 === "object" || data2 && Object.getPrototypeOf(data2) === Object.prototype) {
    if (key3 in data2) return new Ok(new Some(data2[key3]));
    return new Ok(new None());
  }
  return new Error2(key_is_int ? "Indexable" : "Dict");
}
function list(data2, decode2, pushPath, index5, emptyList) {
  if (!(data2 instanceof List || Array.isArray(data2))) {
    const error = new DecodeError("List", classify_dynamic(data2), emptyList);
    return [emptyList, List.fromArray([error])];
  }
  const decoded = [];
  for (const element13 of data2) {
    const layer = decode2(element13);
    const [out, errors] = layer;
    if (errors instanceof NonEmpty) {
      const [_, errors2] = pushPath(layer, index5.toString());
      return [emptyList, errors2];
    }
    decoded.push(out);
    index5++;
  }
  return [List.fromArray(decoded), emptyList];
}
function float(data2) {
  if (typeof data2 === "number") return new Ok(data2);
  return new Error2(0);
}
function int(data2) {
  if (Number.isInteger(data2)) return new Ok(data2);
  return new Error2(0);
}
function string2(data2) {
  if (typeof data2 === "string") return new Ok(data2);
  return new Error2("");
}

// build/dev/javascript/gleam_stdlib/gleam/dict.mjs
function do_has_key(key3, dict3) {
  return !isEqual(map_get(dict3, key3), new Error2(void 0));
}
function has_key(dict3, key3) {
  return do_has_key(key3, dict3);
}
function insert(dict3, key3, value3) {
  return map_insert(key3, value3, dict3);
}
function reverse_and_concat(loop$remaining, loop$accumulator) {
  while (true) {
    let remaining = loop$remaining;
    let accumulator = loop$accumulator;
    if (remaining instanceof Empty) {
      return accumulator;
    } else {
      let first3 = remaining.head;
      let rest = remaining.tail;
      loop$remaining = rest;
      loop$accumulator = prepend(first3, accumulator);
    }
  }
}
function do_keys_loop(loop$list, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let acc = loop$acc;
    if (list5 instanceof Empty) {
      return reverse_and_concat(acc, toList([]));
    } else {
      let rest = list5.tail;
      let key3 = list5.head[0];
      loop$list = rest;
      loop$acc = prepend(key3, acc);
    }
  }
}
function keys(dict3) {
  return do_keys_loop(map_to_list(dict3), toList([]));
}
function do_values_loop(loop$list, loop$acc) {
  while (true) {
    let list5 = loop$list;
    let acc = loop$acc;
    if (list5 instanceof Empty) {
      return reverse_and_concat(acc, toList([]));
    } else {
      let rest = list5.tail;
      let value3 = list5.head[1];
      loop$list = rest;
      loop$acc = prepend(value3, acc);
    }
  }
}
function values(dict3) {
  let list_of_pairs = map_to_list(dict3);
  return do_values_loop(list_of_pairs, toList([]));
}
function delete$(dict3, key3) {
  return map_remove(key3, dict3);
}

// build/dev/javascript/gleam_stdlib/gleam/pair.mjs
function first2(pair) {
  let a2;
  a2 = pair[0];
  return a2;
}
function new$(first3, second2) {
  return [first3, second2];
}

// build/dev/javascript/gleam_stdlib/gleam/result.mjs
function map3(result, fun) {
  if (result instanceof Ok) {
    let x = result[0];
    return new Ok(fun(x));
  } else {
    return result;
  }
}
function map_error(result, fun) {
  if (result instanceof Ok) {
    return result;
  } else {
    let error = result[0];
    return new Error2(fun(error));
  }
}
function try$(result, fun) {
  if (result instanceof Ok) {
    let x = result[0];
    return fun(x);
  } else {
    return result;
  }
}
function unwrap2(result, default$) {
  if (result instanceof Ok) {
    let v = result[0];
    return v;
  } else {
    return default$;
  }
}
function unwrap_both(result) {
  if (result instanceof Ok) {
    let a2 = result[0];
    return a2;
  } else {
    let a2 = result[0];
    return a2;
  }
}
function replace_error(result, error) {
  if (result instanceof Ok) {
    return result;
  } else {
    return new Error2(error);
  }
}
function values2(results) {
  return filter_map(results, (result) => {
    return result;
  });
}

// build/dev/javascript/gleam_stdlib/gleam/uri.mjs
var Uri = class extends CustomType {
  constructor(scheme, userinfo, host, port, path, query2, fragment3) {
    super();
    this.scheme = scheme;
    this.userinfo = userinfo;
    this.host = host;
    this.port = port;
    this.path = path;
    this.query = query2;
    this.fragment = fragment3;
  }
};
function is_valid_host_within_brackets_char(char) {
  return 48 >= char && char <= 57 || 65 >= char && char <= 90 || 97 >= char && char <= 122 || char === 58 || char === 46;
}
function parse_fragment(rest, pieces) {
  return new Ok(
    new Uri(
      pieces.scheme,
      pieces.userinfo,
      pieces.host,
      pieces.port,
      pieces.path,
      pieces.query,
      new Some(rest)
    )
  );
}
function parse_query_with_question_mark_loop(loop$original, loop$uri_string, loop$pieces, loop$size) {
  while (true) {
    let original = loop$original;
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let size3 = loop$size;
    if (uri_string.startsWith("#")) {
      if (size3 === 0) {
        let rest = uri_string.slice(1);
        return parse_fragment(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let query2 = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          pieces.scheme,
          pieces.userinfo,
          pieces.host,
          pieces.port,
          pieces.path,
          new Some(query2),
          pieces.fragment
        );
        return parse_fragment(rest, pieces$1);
      }
    } else if (uri_string === "") {
      return new Ok(
        new Uri(
          pieces.scheme,
          pieces.userinfo,
          pieces.host,
          pieces.port,
          pieces.path,
          new Some(original),
          pieces.fragment
        )
      );
    } else {
      let $ = pop_codeunit(uri_string);
      let rest;
      rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size3 + 1;
    }
  }
}
function parse_query_with_question_mark(uri_string, pieces) {
  return parse_query_with_question_mark_loop(uri_string, uri_string, pieces, 0);
}
function parse_path_loop(loop$original, loop$uri_string, loop$pieces, loop$size) {
  while (true) {
    let original = loop$original;
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let size3 = loop$size;
    if (uri_string.startsWith("?")) {
      let rest = uri_string.slice(1);
      let path = string_codeunit_slice(original, 0, size3);
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        pieces.host,
        pieces.port,
        path,
        pieces.query,
        pieces.fragment
      );
      return parse_query_with_question_mark(rest, pieces$1);
    } else if (uri_string.startsWith("#")) {
      let rest = uri_string.slice(1);
      let path = string_codeunit_slice(original, 0, size3);
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        pieces.host,
        pieces.port,
        path,
        pieces.query,
        pieces.fragment
      );
      return parse_fragment(rest, pieces$1);
    } else if (uri_string === "") {
      return new Ok(
        new Uri(
          pieces.scheme,
          pieces.userinfo,
          pieces.host,
          pieces.port,
          original,
          pieces.query,
          pieces.fragment
        )
      );
    } else {
      let $ = pop_codeunit(uri_string);
      let rest;
      rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size3 + 1;
    }
  }
}
function parse_path(uri_string, pieces) {
  return parse_path_loop(uri_string, uri_string, pieces, 0);
}
function parse_port_loop(loop$uri_string, loop$pieces, loop$port) {
  while (true) {
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let port = loop$port;
    if (uri_string.startsWith("0")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10;
    } else if (uri_string.startsWith("1")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 1;
    } else if (uri_string.startsWith("2")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 2;
    } else if (uri_string.startsWith("3")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 3;
    } else if (uri_string.startsWith("4")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 4;
    } else if (uri_string.startsWith("5")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 5;
    } else if (uri_string.startsWith("6")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 6;
    } else if (uri_string.startsWith("7")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 7;
    } else if (uri_string.startsWith("8")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 8;
    } else if (uri_string.startsWith("9")) {
      let rest = uri_string.slice(1);
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$port = port * 10 + 9;
    } else if (uri_string.startsWith("?")) {
      let rest = uri_string.slice(1);
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        pieces.host,
        new Some(port),
        pieces.path,
        pieces.query,
        pieces.fragment
      );
      return parse_query_with_question_mark(rest, pieces$1);
    } else if (uri_string.startsWith("#")) {
      let rest = uri_string.slice(1);
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        pieces.host,
        new Some(port),
        pieces.path,
        pieces.query,
        pieces.fragment
      );
      return parse_fragment(rest, pieces$1);
    } else if (uri_string.startsWith("/")) {
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        pieces.host,
        new Some(port),
        pieces.path,
        pieces.query,
        pieces.fragment
      );
      return parse_path(uri_string, pieces$1);
    } else if (uri_string === "") {
      return new Ok(
        new Uri(
          pieces.scheme,
          pieces.userinfo,
          pieces.host,
          new Some(port),
          pieces.path,
          pieces.query,
          pieces.fragment
        )
      );
    } else {
      return new Error2(void 0);
    }
  }
}
function parse_port(uri_string, pieces) {
  if (uri_string.startsWith(":0")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 0);
  } else if (uri_string.startsWith(":1")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 1);
  } else if (uri_string.startsWith(":2")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 2);
  } else if (uri_string.startsWith(":3")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 3);
  } else if (uri_string.startsWith(":4")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 4);
  } else if (uri_string.startsWith(":5")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 5);
  } else if (uri_string.startsWith(":6")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 6);
  } else if (uri_string.startsWith(":7")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 7);
  } else if (uri_string.startsWith(":8")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 8);
  } else if (uri_string.startsWith(":9")) {
    let rest = uri_string.slice(2);
    return parse_port_loop(rest, pieces, 9);
  } else if (uri_string.startsWith(":")) {
    return new Error2(void 0);
  } else if (uri_string.startsWith("?")) {
    let rest = uri_string.slice(1);
    return parse_query_with_question_mark(rest, pieces);
  } else if (uri_string.startsWith("#")) {
    let rest = uri_string.slice(1);
    return parse_fragment(rest, pieces);
  } else if (uri_string.startsWith("/")) {
    return parse_path(uri_string, pieces);
  } else if (uri_string === "") {
    return new Ok(pieces);
  } else {
    return new Error2(void 0);
  }
}
function parse_host_outside_of_brackets_loop(loop$original, loop$uri_string, loop$pieces, loop$size) {
  while (true) {
    let original = loop$original;
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let size3 = loop$size;
    if (uri_string === "") {
      return new Ok(
        new Uri(
          pieces.scheme,
          pieces.userinfo,
          new Some(original),
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        )
      );
    } else if (uri_string.startsWith(":")) {
      let host = string_codeunit_slice(original, 0, size3);
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        new Some(host),
        pieces.port,
        pieces.path,
        pieces.query,
        pieces.fragment
      );
      return parse_port(uri_string, pieces$1);
    } else if (uri_string.startsWith("/")) {
      let host = string_codeunit_slice(original, 0, size3);
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        new Some(host),
        pieces.port,
        pieces.path,
        pieces.query,
        pieces.fragment
      );
      return parse_path(uri_string, pieces$1);
    } else if (uri_string.startsWith("?")) {
      let rest = uri_string.slice(1);
      let host = string_codeunit_slice(original, 0, size3);
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        new Some(host),
        pieces.port,
        pieces.path,
        pieces.query,
        pieces.fragment
      );
      return parse_query_with_question_mark(rest, pieces$1);
    } else if (uri_string.startsWith("#")) {
      let rest = uri_string.slice(1);
      let host = string_codeunit_slice(original, 0, size3);
      let pieces$1 = new Uri(
        pieces.scheme,
        pieces.userinfo,
        new Some(host),
        pieces.port,
        pieces.path,
        pieces.query,
        pieces.fragment
      );
      return parse_fragment(rest, pieces$1);
    } else {
      let $ = pop_codeunit(uri_string);
      let rest;
      rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size3 + 1;
    }
  }
}
function parse_host_within_brackets_loop(loop$original, loop$uri_string, loop$pieces, loop$size) {
  while (true) {
    let original = loop$original;
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let size3 = loop$size;
    if (uri_string === "") {
      return new Ok(
        new Uri(
          pieces.scheme,
          pieces.userinfo,
          new Some(uri_string),
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        )
      );
    } else if (uri_string.startsWith("]")) {
      if (size3 === 0) {
        let rest = uri_string.slice(1);
        return parse_port(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let host = string_codeunit_slice(original, 0, size3 + 1);
        let pieces$1 = new Uri(
          pieces.scheme,
          pieces.userinfo,
          new Some(host),
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_port(rest, pieces$1);
      }
    } else if (uri_string.startsWith("/")) {
      if (size3 === 0) {
        return parse_path(uri_string, pieces);
      } else {
        let host = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          pieces.scheme,
          pieces.userinfo,
          new Some(host),
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_path(uri_string, pieces$1);
      }
    } else if (uri_string.startsWith("?")) {
      if (size3 === 0) {
        let rest = uri_string.slice(1);
        return parse_query_with_question_mark(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let host = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          pieces.scheme,
          pieces.userinfo,
          new Some(host),
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_query_with_question_mark(rest, pieces$1);
      }
    } else if (uri_string.startsWith("#")) {
      if (size3 === 0) {
        let rest = uri_string.slice(1);
        return parse_fragment(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let host = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          pieces.scheme,
          pieces.userinfo,
          new Some(host),
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_fragment(rest, pieces$1);
      }
    } else {
      let $ = pop_codeunit(uri_string);
      let char;
      let rest;
      char = $[0];
      rest = $[1];
      let $1 = is_valid_host_within_brackets_char(char);
      if ($1) {
        loop$original = original;
        loop$uri_string = rest;
        loop$pieces = pieces;
        loop$size = size3 + 1;
      } else {
        return parse_host_outside_of_brackets_loop(
          original,
          original,
          pieces,
          0
        );
      }
    }
  }
}
function parse_host_within_brackets(uri_string, pieces) {
  return parse_host_within_brackets_loop(uri_string, uri_string, pieces, 0);
}
function parse_host_outside_of_brackets(uri_string, pieces) {
  return parse_host_outside_of_brackets_loop(uri_string, uri_string, pieces, 0);
}
function parse_host(uri_string, pieces) {
  if (uri_string.startsWith("[")) {
    return parse_host_within_brackets(uri_string, pieces);
  } else if (uri_string.startsWith(":")) {
    let pieces$1 = new Uri(
      pieces.scheme,
      pieces.userinfo,
      new Some(""),
      pieces.port,
      pieces.path,
      pieces.query,
      pieces.fragment
    );
    return parse_port(uri_string, pieces$1);
  } else if (uri_string === "") {
    return new Ok(
      new Uri(
        pieces.scheme,
        pieces.userinfo,
        new Some(""),
        pieces.port,
        pieces.path,
        pieces.query,
        pieces.fragment
      )
    );
  } else {
    return parse_host_outside_of_brackets(uri_string, pieces);
  }
}
function parse_userinfo_loop(loop$original, loop$uri_string, loop$pieces, loop$size) {
  while (true) {
    let original = loop$original;
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let size3 = loop$size;
    if (uri_string.startsWith("@")) {
      if (size3 === 0) {
        let rest = uri_string.slice(1);
        return parse_host(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let userinfo = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          pieces.scheme,
          new Some(userinfo),
          pieces.host,
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_host(rest, pieces$1);
      }
    } else if (uri_string === "") {
      return parse_host(original, pieces);
    } else if (uri_string.startsWith("/")) {
      return parse_host(original, pieces);
    } else if (uri_string.startsWith("?")) {
      return parse_host(original, pieces);
    } else if (uri_string.startsWith("#")) {
      return parse_host(original, pieces);
    } else {
      let $ = pop_codeunit(uri_string);
      let rest;
      rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size3 + 1;
    }
  }
}
function parse_authority_pieces(string6, pieces) {
  return parse_userinfo_loop(string6, string6, pieces, 0);
}
function parse_authority_with_slashes(uri_string, pieces) {
  if (uri_string === "//") {
    return new Ok(
      new Uri(
        pieces.scheme,
        pieces.userinfo,
        new Some(""),
        pieces.port,
        pieces.path,
        pieces.query,
        pieces.fragment
      )
    );
  } else if (uri_string.startsWith("//")) {
    let rest = uri_string.slice(2);
    return parse_authority_pieces(rest, pieces);
  } else {
    return parse_path(uri_string, pieces);
  }
}
function parse_scheme_loop(loop$original, loop$uri_string, loop$pieces, loop$size) {
  while (true) {
    let original = loop$original;
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let size3 = loop$size;
    if (uri_string.startsWith("/")) {
      if (size3 === 0) {
        return parse_authority_with_slashes(uri_string, pieces);
      } else {
        let scheme = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          new Some(lowercase(scheme)),
          pieces.userinfo,
          pieces.host,
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_authority_with_slashes(uri_string, pieces$1);
      }
    } else if (uri_string.startsWith("?")) {
      if (size3 === 0) {
        let rest = uri_string.slice(1);
        return parse_query_with_question_mark(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let scheme = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          new Some(lowercase(scheme)),
          pieces.userinfo,
          pieces.host,
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_query_with_question_mark(rest, pieces$1);
      }
    } else if (uri_string.startsWith("#")) {
      if (size3 === 0) {
        let rest = uri_string.slice(1);
        return parse_fragment(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let scheme = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          new Some(lowercase(scheme)),
          pieces.userinfo,
          pieces.host,
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_fragment(rest, pieces$1);
      }
    } else if (uri_string.startsWith(":")) {
      if (size3 === 0) {
        return new Error2(void 0);
      } else {
        let rest = uri_string.slice(1);
        let scheme = string_codeunit_slice(original, 0, size3);
        let pieces$1 = new Uri(
          new Some(lowercase(scheme)),
          pieces.userinfo,
          pieces.host,
          pieces.port,
          pieces.path,
          pieces.query,
          pieces.fragment
        );
        return parse_authority_with_slashes(rest, pieces$1);
      }
    } else if (uri_string === "") {
      return new Ok(
        new Uri(
          pieces.scheme,
          pieces.userinfo,
          pieces.host,
          pieces.port,
          original,
          pieces.query,
          pieces.fragment
        )
      );
    } else {
      let $ = pop_codeunit(uri_string);
      let rest;
      rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size3 + 1;
    }
  }
}
function query_pair(pair) {
  return concat(
    toList([percent_encode(pair[0]), "=", percent_encode(pair[1])])
  );
}
function query_to_string(query2) {
  let _pipe = query2;
  let _pipe$1 = map(_pipe, query_pair);
  let _pipe$2 = intersperse(_pipe$1, identity("&"));
  let _pipe$3 = concat(_pipe$2);
  return identity(_pipe$3);
}
function remove_dot_segments_loop(loop$input, loop$accumulator) {
  while (true) {
    let input2 = loop$input;
    let accumulator = loop$accumulator;
    if (input2 instanceof Empty) {
      return reverse(accumulator);
    } else {
      let segment = input2.head;
      let rest = input2.tail;
      let _block;
      if (segment === "") {
        _block = accumulator;
      } else if (segment === ".") {
        _block = accumulator;
      } else if (segment === "..") {
        if (accumulator instanceof Empty) {
          _block = accumulator;
        } else {
          let accumulator$12 = accumulator.tail;
          _block = accumulator$12;
        }
      } else {
        let segment$1 = segment;
        let accumulator$12 = accumulator;
        _block = prepend(segment$1, accumulator$12);
      }
      let accumulator$1 = _block;
      loop$input = rest;
      loop$accumulator = accumulator$1;
    }
  }
}
function remove_dot_segments(input2) {
  return remove_dot_segments_loop(input2, toList([]));
}
function to_string3(uri) {
  let _block;
  let $ = uri.fragment;
  if ($ instanceof Some) {
    let fragment3 = $[0];
    _block = toList(["#", fragment3]);
  } else {
    _block = toList([]);
  }
  let parts = _block;
  let _block$1;
  let $1 = uri.query;
  if ($1 instanceof Some) {
    let query2 = $1[0];
    _block$1 = prepend("?", prepend(query2, parts));
  } else {
    _block$1 = parts;
  }
  let parts$1 = _block$1;
  let parts$2 = prepend(uri.path, parts$1);
  let _block$2;
  let $2 = uri.host;
  let $3 = starts_with(uri.path, "/");
  if (!$3 && $2 instanceof Some) {
    let host = $2[0];
    if (host !== "") {
      _block$2 = prepend("/", parts$2);
    } else {
      _block$2 = parts$2;
    }
  } else {
    _block$2 = parts$2;
  }
  let parts$3 = _block$2;
  let _block$3;
  let $4 = uri.host;
  let $5 = uri.port;
  if ($5 instanceof Some && $4 instanceof Some) {
    let port = $5[0];
    _block$3 = prepend(":", prepend(to_string2(port), parts$3));
  } else {
    _block$3 = parts$3;
  }
  let parts$4 = _block$3;
  let _block$4;
  let $6 = uri.scheme;
  let $7 = uri.userinfo;
  let $8 = uri.host;
  if ($8 instanceof Some) {
    if ($7 instanceof Some) {
      if ($6 instanceof Some) {
        let h = $8[0];
        let u = $7[0];
        let s = $6[0];
        _block$4 = prepend(
          s,
          prepend(
            "://",
            prepend(u, prepend("@", prepend(h, parts$4)))
          )
        );
      } else {
        _block$4 = parts$4;
      }
    } else if ($6 instanceof Some) {
      let h = $8[0];
      let s = $6[0];
      _block$4 = prepend(s, prepend("://", prepend(h, parts$4)));
    } else {
      let h = $8[0];
      _block$4 = prepend("//", prepend(h, parts$4));
    }
  } else if ($7 instanceof Some) {
    if ($6 instanceof Some) {
      let s = $6[0];
      _block$4 = prepend(s, prepend(":", parts$4));
    } else {
      _block$4 = parts$4;
    }
  } else if ($6 instanceof Some) {
    let s = $6[0];
    _block$4 = prepend(s, prepend(":", parts$4));
  } else {
    _block$4 = parts$4;
  }
  let parts$5 = _block$4;
  return concat2(parts$5);
}
function drop_last(elements) {
  return take(elements, length(elements) - 1);
}
function join_segments(segments) {
  return join(prepend("", segments), "/");
}
function merge(base, relative2) {
  let $ = base.host;
  if ($ instanceof Some) {
    let $1 = base.scheme;
    if ($1 instanceof Some) {
      let $2 = relative2.host;
      if ($2 instanceof Some) {
        let _block;
        let _pipe = split3(relative2.path, "/");
        let _pipe$1 = remove_dot_segments(_pipe);
        _block = join_segments(_pipe$1);
        let path = _block;
        let resolved = new Uri(
          or2(relative2.scheme, base.scheme),
          new None(),
          relative2.host,
          or2(relative2.port, base.port),
          path,
          relative2.query,
          relative2.fragment
        );
        return new Ok(resolved);
      } else {
        let _block;
        let $4 = relative2.path;
        if ($4 === "") {
          _block = [base.path, or2(relative2.query, base.query)];
        } else {
          let _block$1;
          let $5 = starts_with(relative2.path, "/");
          if ($5) {
            _block$1 = split3(relative2.path, "/");
          } else {
            let _pipe2 = split3(base.path, "/");
            let _pipe$12 = drop_last(_pipe2);
            _block$1 = append(_pipe$12, split3(relative2.path, "/"));
          }
          let path_segments$1 = _block$1;
          let _block$2;
          let _pipe = path_segments$1;
          let _pipe$1 = remove_dot_segments(_pipe);
          _block$2 = join_segments(_pipe$1);
          let path = _block$2;
          _block = [path, relative2.query];
        }
        let $3 = _block;
        let new_path;
        let new_query;
        new_path = $3[0];
        new_query = $3[1];
        let resolved = new Uri(
          base.scheme,
          new None(),
          base.host,
          base.port,
          new_path,
          new_query,
          relative2.fragment
        );
        return new Ok(resolved);
      }
    } else {
      return new Error2(void 0);
    }
  } else {
    return new Error2(void 0);
  }
}
var empty = /* @__PURE__ */ new Uri(
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  "",
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None()
);
function parse(uri_string) {
  return parse_scheme_loop(uri_string, uri_string, empty, 0);
}

// build/dev/javascript/gleam_stdlib/gleam/function.mjs
function identity2(x) {
  return x;
}

// build/dev/javascript/gleam_json/gleam_json_ffi.mjs
function json_to_string(json2) {
  return JSON.stringify(json2);
}
function object(entries) {
  return Object.fromEntries(entries);
}
function identity3(x) {
  return x;
}
function array(list5) {
  return list5.toArray();
}
function decode(string6) {
  try {
    const result = JSON.parse(string6);
    return new Ok(result);
  } catch (err) {
    return new Error2(getJsonDecodeError(err, string6));
  }
}
function getJsonDecodeError(stdErr, json2) {
  if (isUnexpectedEndOfInput(stdErr)) return new UnexpectedEndOfInput();
  return toUnexpectedByteError(stdErr, json2);
}
function isUnexpectedEndOfInput(err) {
  const unexpectedEndOfInputRegex = /((unexpected (end|eof))|(end of data)|(unterminated string)|(json( parse error|\.parse)\: expected '(\:|\}|\])'))/i;
  return unexpectedEndOfInputRegex.test(err.message);
}
function toUnexpectedByteError(err, json2) {
  let converters = [
    v8UnexpectedByteError,
    oldV8UnexpectedByteError,
    jsCoreUnexpectedByteError,
    spidermonkeyUnexpectedByteError
  ];
  for (let converter of converters) {
    let result = converter(err, json2);
    if (result) return result;
  }
  return new UnexpectedByte("", 0);
}
function v8UnexpectedByteError(err) {
  const regex = /unexpected token '(.)', ".+" is not valid JSON/i;
  const match = regex.exec(err.message);
  if (!match) return null;
  const byte = toHex(match[1]);
  return new UnexpectedByte(byte, -1);
}
function oldV8UnexpectedByteError(err) {
  const regex = /unexpected token (.) in JSON at position (\d+)/i;
  const match = regex.exec(err.message);
  if (!match) return null;
  const byte = toHex(match[1]);
  const position = Number(match[2]);
  return new UnexpectedByte(byte, position);
}
function spidermonkeyUnexpectedByteError(err, json2) {
  const regex = /(unexpected character|expected .*) at line (\d+) column (\d+)/i;
  const match = regex.exec(err.message);
  if (!match) return null;
  const line = Number(match[2]);
  const column = Number(match[3]);
  const position = getPositionFromMultiline(line, column, json2);
  const byte = toHex(json2[position]);
  return new UnexpectedByte(byte, position);
}
function jsCoreUnexpectedByteError(err) {
  const regex = /unexpected (identifier|token) "(.)"/i;
  const match = regex.exec(err.message);
  if (!match) return null;
  const byte = toHex(match[2]);
  return new UnexpectedByte(byte, 0);
}
function toHex(char) {
  return "0x" + char.charCodeAt(0).toString(16).toUpperCase();
}
function getPositionFromMultiline(line, column, string6) {
  if (line === 1) return column - 1;
  let currentLn = 1;
  let position = 0;
  string6.split("").find((char, idx) => {
    if (char === "\n") currentLn += 1;
    if (currentLn === line) {
      position = idx + column;
      return true;
    }
    return false;
  });
  return position;
}

// build/dev/javascript/gleam_json/gleam/json.mjs
var UnexpectedEndOfInput = class extends CustomType {
};
var UnexpectedByte = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var UnableToDecode = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
function do_parse(json2, decoder2) {
  return try$(
    decode(json2),
    (dynamic_value) => {
      let _pipe = run(dynamic_value, decoder2);
      return map_error(
        _pipe,
        (var0) => {
          return new UnableToDecode(var0);
        }
      );
    }
  );
}
function parse2(json2, decoder2) {
  return do_parse(json2, decoder2);
}
function to_string4(json2) {
  return json_to_string(json2);
}
function string4(input2) {
  return identity3(input2);
}
function bool2(input2) {
  return identity3(input2);
}
function int3(input2) {
  return identity3(input2);
}
function float3(input2) {
  return identity3(input2);
}
function object2(entries) {
  return object(entries);
}
function preprocessed_array(from2) {
  return array(from2);
}
function array2(entries, inner_type) {
  let _pipe = entries;
  let _pipe$1 = map(_pipe, inner_type);
  return preprocessed_array(_pipe$1);
}

// build/dev/javascript/lustre/lustre/internals/constants.ffi.mjs
var document2 = () => globalThis?.document;
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var SUPPORTS_MOVE_BEFORE = !!globalThis.HTMLElement?.prototype?.moveBefore;

// build/dev/javascript/lustre/lustre/internals/constants.mjs
var empty_list = /* @__PURE__ */ toList([]);
var option_none = /* @__PURE__ */ new None();

// build/dev/javascript/lustre/lustre/vdom/vattr.ffi.mjs
var GT = /* @__PURE__ */ new Gt();
var LT = /* @__PURE__ */ new Lt();
var EQ = /* @__PURE__ */ new Eq();
function compare4(a2, b) {
  if (a2.name === b.name) {
    return EQ;
  } else if (a2.name < b.name) {
    return LT;
  } else {
    return GT;
  }
}

// build/dev/javascript/lustre/lustre/vdom/vattr.mjs
var Attribute = class extends CustomType {
  constructor(kind, name2, value3) {
    super();
    this.kind = kind;
    this.name = name2;
    this.value = value3;
  }
};
var Property = class extends CustomType {
  constructor(kind, name2, value3) {
    super();
    this.kind = kind;
    this.name = name2;
    this.value = value3;
  }
};
var Event2 = class extends CustomType {
  constructor(kind, name2, handler, include, prevent_default2, stop_propagation, immediate2, debounce, throttle) {
    super();
    this.kind = kind;
    this.name = name2;
    this.handler = handler;
    this.include = include;
    this.prevent_default = prevent_default2;
    this.stop_propagation = stop_propagation;
    this.immediate = immediate2;
    this.debounce = debounce;
    this.throttle = throttle;
  }
};
var Handler = class extends CustomType {
  constructor(prevent_default2, stop_propagation, message2) {
    super();
    this.prevent_default = prevent_default2;
    this.stop_propagation = stop_propagation;
    this.message = message2;
  }
};
var Never = class extends CustomType {
  constructor(kind) {
    super();
    this.kind = kind;
  }
};
var Always = class extends CustomType {
  constructor(kind) {
    super();
    this.kind = kind;
  }
};
function merge2(loop$attributes, loop$merged) {
  while (true) {
    let attributes = loop$attributes;
    let merged = loop$merged;
    if (attributes instanceof Empty) {
      return merged;
    } else {
      let $ = attributes.head;
      if ($ instanceof Attribute) {
        let $1 = $.name;
        if ($1 === "") {
          let rest = attributes.tail;
          loop$attributes = rest;
          loop$merged = merged;
        } else if ($1 === "class") {
          let $2 = $.value;
          if ($2 === "") {
            let rest = attributes.tail;
            loop$attributes = rest;
            loop$merged = merged;
          } else {
            let $3 = attributes.tail;
            if ($3 instanceof Empty) {
              let attribute$1 = $;
              let rest = $3;
              loop$attributes = rest;
              loop$merged = prepend(attribute$1, merged);
            } else {
              let $4 = $3.head;
              if ($4 instanceof Attribute) {
                let $5 = $4.name;
                if ($5 === "class") {
                  let kind = $.kind;
                  let class1 = $2;
                  let rest = $3.tail;
                  let class2 = $4.value;
                  let value3 = class1 + " " + class2;
                  let attribute$1 = new Attribute(kind, "class", value3);
                  loop$attributes = prepend(attribute$1, rest);
                  loop$merged = merged;
                } else {
                  let attribute$1 = $;
                  let rest = $3;
                  loop$attributes = rest;
                  loop$merged = prepend(attribute$1, merged);
                }
              } else {
                let attribute$1 = $;
                let rest = $3;
                loop$attributes = rest;
                loop$merged = prepend(attribute$1, merged);
              }
            }
          }
        } else if ($1 === "style") {
          let $2 = $.value;
          if ($2 === "") {
            let rest = attributes.tail;
            loop$attributes = rest;
            loop$merged = merged;
          } else {
            let $3 = attributes.tail;
            if ($3 instanceof Empty) {
              let attribute$1 = $;
              let rest = $3;
              loop$attributes = rest;
              loop$merged = prepend(attribute$1, merged);
            } else {
              let $4 = $3.head;
              if ($4 instanceof Attribute) {
                let $5 = $4.name;
                if ($5 === "style") {
                  let kind = $.kind;
                  let style1 = $2;
                  let rest = $3.tail;
                  let style2 = $4.value;
                  let value3 = style1 + ";" + style2;
                  let attribute$1 = new Attribute(kind, "style", value3);
                  loop$attributes = prepend(attribute$1, rest);
                  loop$merged = merged;
                } else {
                  let attribute$1 = $;
                  let rest = $3;
                  loop$attributes = rest;
                  loop$merged = prepend(attribute$1, merged);
                }
              } else {
                let attribute$1 = $;
                let rest = $3;
                loop$attributes = rest;
                loop$merged = prepend(attribute$1, merged);
              }
            }
          }
        } else {
          let attribute$1 = $;
          let rest = attributes.tail;
          loop$attributes = rest;
          loop$merged = prepend(attribute$1, merged);
        }
      } else {
        let attribute$1 = $;
        let rest = attributes.tail;
        loop$attributes = rest;
        loop$merged = prepend(attribute$1, merged);
      }
    }
  }
}
function prepare(attributes) {
  if (attributes instanceof Empty) {
    return attributes;
  } else {
    let $ = attributes.tail;
    if ($ instanceof Empty) {
      return attributes;
    } else {
      let _pipe = attributes;
      let _pipe$1 = sort(_pipe, (a2, b) => {
        return compare4(b, a2);
      });
      return merge2(_pipe$1, empty_list);
    }
  }
}
var attribute_kind = 0;
function attribute(name2, value3) {
  return new Attribute(attribute_kind, name2, value3);
}
var property_kind = 1;
function property(name2, value3) {
  return new Property(property_kind, name2, value3);
}
var event_kind = 2;
function event(name2, handler, include, prevent_default2, stop_propagation, immediate2, debounce, throttle) {
  return new Event2(
    event_kind,
    name2,
    handler,
    include,
    prevent_default2,
    stop_propagation,
    immediate2,
    debounce,
    throttle
  );
}
var never_kind = 0;
var never = /* @__PURE__ */ new Never(never_kind);
var always_kind = 2;
var always = /* @__PURE__ */ new Always(always_kind);

// build/dev/javascript/lustre/lustre/attribute.mjs
function attribute2(name2, value3) {
  return attribute(name2, value3);
}
function property2(name2, value3) {
  return property(name2, value3);
}
function boolean_attribute(name2, value3) {
  if (value3) {
    return attribute2(name2, "");
  } else {
    return property2(name2, bool2(false));
  }
}
function autofocus(should_autofocus) {
  return boolean_attribute("autofocus", should_autofocus);
}
function class$(name2) {
  return attribute2("class", name2);
}
function none() {
  return class$("");
}
function id(value3) {
  return attribute2("id", value3);
}
function style(property3, value3) {
  if (property3 === "") {
    return class$("");
  } else if (value3 === "") {
    return class$("");
  } else {
    return attribute2("style", property3 + ":" + value3 + ";");
  }
}
function tabindex(index5) {
  return attribute2("tabindex", to_string2(index5));
}
function href(url) {
  return attribute2("href", url);
}
function target(value3) {
  return attribute2("target", value3);
}
function src(url) {
  return attribute2("src", url);
}
function autocomplete(value3) {
  return attribute2("autocomplete", value3);
}
function checked(is_checked) {
  return boolean_attribute("checked", is_checked);
}
function disabled(is_disabled) {
  return boolean_attribute("disabled", is_disabled);
}
function max2(value3) {
  return attribute2("max", value3);
}
function name(element_name) {
  return attribute2("name", element_name);
}
function placeholder(text3) {
  return attribute2("placeholder", text3);
}
function required(is_required) {
  return boolean_attribute("required", is_required);
}
function step(value3) {
  return attribute2("step", value3);
}
function type_(control_type) {
  return attribute2("type", control_type);
}
function value(control_value) {
  return attribute2("value", control_value);
}

// build/dev/javascript/lustre/lustre/effect.mjs
var Effect = class extends CustomType {
  constructor(synchronous, before_paint2, after_paint) {
    super();
    this.synchronous = synchronous;
    this.before_paint = before_paint2;
    this.after_paint = after_paint;
  }
};
var Actions = class extends CustomType {
  constructor(dispatch, emit2, select, root3, provide) {
    super();
    this.dispatch = dispatch;
    this.emit = emit2;
    this.select = select;
    this.root = root3;
    this.provide = provide;
  }
};
function do_comap_select(_, _1, _2) {
  return void 0;
}
function do_comap_actions(actions, f) {
  return new Actions(
    (msg) => {
      return actions.dispatch(f(msg));
    },
    actions.emit,
    (selector) => {
      return do_comap_select(actions, selector, f);
    },
    actions.root,
    actions.provide
  );
}
function do_map(effects, f) {
  return map(
    effects,
    (effect) => {
      return (actions) => {
        return effect(do_comap_actions(actions, f));
      };
    }
  );
}
function map4(effect, f) {
  return new Effect(
    do_map(effect.synchronous, f),
    do_map(effect.before_paint, f),
    do_map(effect.after_paint, f)
  );
}
var empty2 = /* @__PURE__ */ new Effect(
  /* @__PURE__ */ toList([]),
  /* @__PURE__ */ toList([]),
  /* @__PURE__ */ toList([])
);
function none2() {
  return empty2;
}
function from(effect) {
  let task = (actions) => {
    let dispatch = actions.dispatch;
    return effect(dispatch);
  };
  return new Effect(toList([task]), empty2.before_paint, empty2.after_paint);
}
function event2(name2, data2) {
  let task = (actions) => {
    return actions.emit(name2, data2);
  };
  return new Effect(toList([task]), empty2.before_paint, empty2.after_paint);
}
function batch(effects) {
  return fold(
    effects,
    empty2,
    (acc, eff) => {
      return new Effect(
        fold(eff.synchronous, acc.synchronous, prepend2),
        fold(eff.before_paint, acc.before_paint, prepend2),
        fold(eff.after_paint, acc.after_paint, prepend2)
      );
    }
  );
}

// build/dev/javascript/lustre/lustre/internals/mutable_map.ffi.mjs
function empty3() {
  return null;
}
function get(map7, key3) {
  const value3 = map7?.get(key3);
  if (value3 != null) {
    return new Ok(value3);
  } else {
    return new Error2(void 0);
  }
}
function has_key2(map7, key3) {
  return map7 && map7.has(key3);
}
function insert2(map7, key3, value3) {
  map7 ??= /* @__PURE__ */ new Map();
  map7.set(key3, value3);
  return map7;
}
function remove(map7, key3) {
  map7?.delete(key3);
  return map7;
}

// build/dev/javascript/lustre/lustre/vdom/path.mjs
var Root = class extends CustomType {
};
var Key = class extends CustomType {
  constructor(key3, parent) {
    super();
    this.key = key3;
    this.parent = parent;
  }
};
var Index = class extends CustomType {
  constructor(index5, parent) {
    super();
    this.index = index5;
    this.parent = parent;
  }
};
function do_matches(loop$path, loop$candidates) {
  while (true) {
    let path = loop$path;
    let candidates = loop$candidates;
    if (candidates instanceof Empty) {
      return false;
    } else {
      let candidate = candidates.head;
      let rest = candidates.tail;
      let $ = starts_with(path, candidate);
      if ($) {
        return $;
      } else {
        loop$path = path;
        loop$candidates = rest;
      }
    }
  }
}
function add2(parent, index5, key3) {
  if (key3 === "") {
    return new Index(index5, parent);
  } else {
    return new Key(key3, parent);
  }
}
var root2 = /* @__PURE__ */ new Root();
var separator_element = "	";
function do_to_string(loop$path, loop$acc) {
  while (true) {
    let path = loop$path;
    let acc = loop$acc;
    if (path instanceof Root) {
      if (acc instanceof Empty) {
        return "";
      } else {
        let segments = acc.tail;
        return concat2(segments);
      }
    } else if (path instanceof Key) {
      let key3 = path.key;
      let parent = path.parent;
      loop$path = parent;
      loop$acc = prepend(separator_element, prepend(key3, acc));
    } else {
      let index5 = path.index;
      let parent = path.parent;
      loop$path = parent;
      loop$acc = prepend(
        separator_element,
        prepend(to_string2(index5), acc)
      );
    }
  }
}
function to_string5(path) {
  return do_to_string(path, toList([]));
}
function matches(path, candidates) {
  if (candidates instanceof Empty) {
    return false;
  } else {
    return do_matches(to_string5(path), candidates);
  }
}
var separator_event = "\n";
function event3(path, event4) {
  return do_to_string(path, toList([separator_event, event4]));
}

// build/dev/javascript/lustre/lustre/vdom/vnode.mjs
var Fragment = class extends CustomType {
  constructor(kind, key3, mapper, children, keyed_children) {
    super();
    this.kind = kind;
    this.key = key3;
    this.mapper = mapper;
    this.children = children;
    this.keyed_children = keyed_children;
  }
};
var Element2 = class extends CustomType {
  constructor(kind, key3, mapper, namespace, tag2, attributes, children, keyed_children, self_closing, void$) {
    super();
    this.kind = kind;
    this.key = key3;
    this.mapper = mapper;
    this.namespace = namespace;
    this.tag = tag2;
    this.attributes = attributes;
    this.children = children;
    this.keyed_children = keyed_children;
    this.self_closing = self_closing;
    this.void = void$;
  }
};
var Text = class extends CustomType {
  constructor(kind, key3, mapper, content) {
    super();
    this.kind = kind;
    this.key = key3;
    this.mapper = mapper;
    this.content = content;
  }
};
var UnsafeInnerHtml = class extends CustomType {
  constructor(kind, key3, mapper, namespace, tag2, attributes, inner_html) {
    super();
    this.kind = kind;
    this.key = key3;
    this.mapper = mapper;
    this.namespace = namespace;
    this.tag = tag2;
    this.attributes = attributes;
    this.inner_html = inner_html;
  }
};
function is_void_element(tag2, namespace) {
  if (namespace === "") {
    if (tag2 === "area") {
      return true;
    } else if (tag2 === "base") {
      return true;
    } else if (tag2 === "br") {
      return true;
    } else if (tag2 === "col") {
      return true;
    } else if (tag2 === "embed") {
      return true;
    } else if (tag2 === "hr") {
      return true;
    } else if (tag2 === "img") {
      return true;
    } else if (tag2 === "input") {
      return true;
    } else if (tag2 === "link") {
      return true;
    } else if (tag2 === "meta") {
      return true;
    } else if (tag2 === "param") {
      return true;
    } else if (tag2 === "source") {
      return true;
    } else if (tag2 === "track") {
      return true;
    } else if (tag2 === "wbr") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function to_keyed(key3, node) {
  if (node instanceof Fragment) {
    return new Fragment(
      node.kind,
      key3,
      node.mapper,
      node.children,
      node.keyed_children
    );
  } else if (node instanceof Element2) {
    return new Element2(
      node.kind,
      key3,
      node.mapper,
      node.namespace,
      node.tag,
      node.attributes,
      node.children,
      node.keyed_children,
      node.self_closing,
      node.void
    );
  } else if (node instanceof Text) {
    return new Text(node.kind, key3, node.mapper, node.content);
  } else {
    return new UnsafeInnerHtml(
      node.kind,
      key3,
      node.mapper,
      node.namespace,
      node.tag,
      node.attributes,
      node.inner_html
    );
  }
}
var fragment_kind = 0;
function fragment(key3, mapper, children, keyed_children) {
  return new Fragment(fragment_kind, key3, mapper, children, keyed_children);
}
var element_kind = 1;
function element(key3, mapper, namespace, tag2, attributes, children, keyed_children, self_closing, void$) {
  return new Element2(
    element_kind,
    key3,
    mapper,
    namespace,
    tag2,
    prepare(attributes),
    children,
    keyed_children,
    self_closing,
    void$ || is_void_element(tag2, namespace)
  );
}
var text_kind = 2;
function text(key3, mapper, content) {
  return new Text(text_kind, key3, mapper, content);
}
var unsafe_inner_html_kind = 3;
function unsafe_inner_html(key3, mapper, namespace, tag2, attributes, inner_html) {
  return new UnsafeInnerHtml(
    unsafe_inner_html_kind,
    key3,
    mapper,
    namespace,
    tag2,
    prepare(attributes),
    inner_html
  );
}

// build/dev/javascript/lustre/lustre/internals/equals.ffi.mjs
var isReferenceEqual = (a2, b) => a2 === b;
var isEqual2 = (a2, b) => {
  if (a2 === b) {
    return true;
  }
  if (a2 == null || b == null) {
    return false;
  }
  const type = typeof a2;
  if (type !== typeof b) {
    return false;
  }
  if (type !== "object") {
    return false;
  }
  const ctor = a2.constructor;
  if (ctor !== b.constructor) {
    return false;
  }
  if (Array.isArray(a2)) {
    return areArraysEqual(a2, b);
  }
  return areObjectsEqual(a2, b);
};
var areArraysEqual = (a2, b) => {
  let index5 = a2.length;
  if (index5 !== b.length) {
    return false;
  }
  while (index5--) {
    if (!isEqual2(a2[index5], b[index5])) {
      return false;
    }
  }
  return true;
};
var areObjectsEqual = (a2, b) => {
  const properties = Object.keys(a2);
  let index5 = properties.length;
  if (Object.keys(b).length !== index5) {
    return false;
  }
  while (index5--) {
    const property3 = properties[index5];
    if (!Object.hasOwn(b, property3)) {
      return false;
    }
    if (!isEqual2(a2[property3], b[property3])) {
      return false;
    }
  }
  return true;
};

// build/dev/javascript/lustre/lustre/vdom/events.mjs
var Events = class extends CustomType {
  constructor(handlers, dispatched_paths, next_dispatched_paths) {
    super();
    this.handlers = handlers;
    this.dispatched_paths = dispatched_paths;
    this.next_dispatched_paths = next_dispatched_paths;
  }
};
function new$4() {
  return new Events(
    empty3(),
    empty_list,
    empty_list
  );
}
function tick(events) {
  return new Events(
    events.handlers,
    events.next_dispatched_paths,
    empty_list
  );
}
function do_remove_event(handlers, path, name2) {
  return remove(handlers, event3(path, name2));
}
function remove_event(events, path, name2) {
  let handlers = do_remove_event(events.handlers, path, name2);
  return new Events(
    handlers,
    events.dispatched_paths,
    events.next_dispatched_paths
  );
}
function remove_attributes(handlers, path, attributes) {
  return fold(
    attributes,
    handlers,
    (events, attribute3) => {
      if (attribute3 instanceof Event2) {
        let name2 = attribute3.name;
        return do_remove_event(events, path, name2);
      } else {
        return events;
      }
    }
  );
}
function handle(events, path, name2, event4) {
  let next_dispatched_paths = prepend(path, events.next_dispatched_paths);
  let events$1 = new Events(
    events.handlers,
    events.dispatched_paths,
    next_dispatched_paths
  );
  let $ = get(
    events$1.handlers,
    path + separator_event + name2
  );
  if ($ instanceof Ok) {
    let handler = $[0];
    return [events$1, run(event4, handler)];
  } else {
    return [events$1, new Error2(toList([]))];
  }
}
function has_dispatched_events(events, path) {
  return matches(path, events.dispatched_paths);
}
function do_add_event(handlers, mapper, path, name2, handler) {
  return insert2(
    handlers,
    event3(path, name2),
    map2(
      handler,
      (handler2) => {
        return new Handler(
          handler2.prevent_default,
          handler2.stop_propagation,
          identity2(mapper)(handler2.message)
        );
      }
    )
  );
}
function add_event(events, mapper, path, name2, handler) {
  let handlers = do_add_event(events.handlers, mapper, path, name2, handler);
  return new Events(
    handlers,
    events.dispatched_paths,
    events.next_dispatched_paths
  );
}
function add_attributes(handlers, mapper, path, attributes) {
  return fold(
    attributes,
    handlers,
    (events, attribute3) => {
      if (attribute3 instanceof Event2) {
        let name2 = attribute3.name;
        let handler = attribute3.handler;
        return do_add_event(events, mapper, path, name2, handler);
      } else {
        return events;
      }
    }
  );
}
function compose_mapper(mapper, child_mapper) {
  let $ = isReferenceEqual(mapper, identity2);
  let $1 = isReferenceEqual(child_mapper, identity2);
  if ($1) {
    return mapper;
  } else if ($) {
    return child_mapper;
  } else {
    return (msg) => {
      return mapper(child_mapper(msg));
    };
  }
}
function do_remove_children(loop$handlers, loop$path, loop$child_index, loop$children) {
  while (true) {
    let handlers = loop$handlers;
    let path = loop$path;
    let child_index = loop$child_index;
    let children = loop$children;
    if (children instanceof Empty) {
      return handlers;
    } else {
      let child = children.head;
      let rest = children.tail;
      let _pipe = handlers;
      let _pipe$1 = do_remove_child(_pipe, path, child_index, child);
      loop$handlers = _pipe$1;
      loop$path = path;
      loop$child_index = child_index + 1;
      loop$children = rest;
    }
  }
}
function do_remove_child(handlers, parent, child_index, child) {
  if (child instanceof Fragment) {
    let children = child.children;
    let path = add2(parent, child_index, child.key);
    return do_remove_children(handlers, path, 0, children);
  } else if (child instanceof Element2) {
    let attributes = child.attributes;
    let children = child.children;
    let path = add2(parent, child_index, child.key);
    let _pipe = handlers;
    let _pipe$1 = remove_attributes(_pipe, path, attributes);
    return do_remove_children(_pipe$1, path, 0, children);
  } else if (child instanceof Text) {
    return handlers;
  } else {
    let attributes = child.attributes;
    let path = add2(parent, child_index, child.key);
    return remove_attributes(handlers, path, attributes);
  }
}
function remove_child(events, parent, child_index, child) {
  let handlers = do_remove_child(events.handlers, parent, child_index, child);
  return new Events(
    handlers,
    events.dispatched_paths,
    events.next_dispatched_paths
  );
}
function do_add_children(loop$handlers, loop$mapper, loop$path, loop$child_index, loop$children) {
  while (true) {
    let handlers = loop$handlers;
    let mapper = loop$mapper;
    let path = loop$path;
    let child_index = loop$child_index;
    let children = loop$children;
    if (children instanceof Empty) {
      return handlers;
    } else {
      let child = children.head;
      let rest = children.tail;
      let _pipe = handlers;
      let _pipe$1 = do_add_child(_pipe, mapper, path, child_index, child);
      loop$handlers = _pipe$1;
      loop$mapper = mapper;
      loop$path = path;
      loop$child_index = child_index + 1;
      loop$children = rest;
    }
  }
}
function do_add_child(handlers, mapper, parent, child_index, child) {
  if (child instanceof Fragment) {
    let children = child.children;
    let path = add2(parent, child_index, child.key);
    let composed_mapper = compose_mapper(mapper, child.mapper);
    return do_add_children(handlers, composed_mapper, path, 0, children);
  } else if (child instanceof Element2) {
    let attributes = child.attributes;
    let children = child.children;
    let path = add2(parent, child_index, child.key);
    let composed_mapper = compose_mapper(mapper, child.mapper);
    let _pipe = handlers;
    let _pipe$1 = add_attributes(_pipe, composed_mapper, path, attributes);
    return do_add_children(_pipe$1, composed_mapper, path, 0, children);
  } else if (child instanceof Text) {
    return handlers;
  } else {
    let attributes = child.attributes;
    let path = add2(parent, child_index, child.key);
    let composed_mapper = compose_mapper(mapper, child.mapper);
    return add_attributes(handlers, composed_mapper, path, attributes);
  }
}
function add_child(events, mapper, parent, index5, child) {
  let handlers = do_add_child(events.handlers, mapper, parent, index5, child);
  return new Events(
    handlers,
    events.dispatched_paths,
    events.next_dispatched_paths
  );
}
function add_children(events, mapper, path, child_index, children) {
  let handlers = do_add_children(
    events.handlers,
    mapper,
    path,
    child_index,
    children
  );
  return new Events(
    handlers,
    events.dispatched_paths,
    events.next_dispatched_paths
  );
}

// build/dev/javascript/lustre/lustre/element.mjs
function element2(tag2, attributes, children) {
  return element(
    "",
    identity2,
    "",
    tag2,
    attributes,
    children,
    empty3(),
    false,
    false
  );
}
function text2(content) {
  return text("", identity2, content);
}
function none3() {
  return text("", identity2, "");
}
function unsafe_raw_html(namespace, tag2, attributes, inner_html) {
  return unsafe_inner_html(
    "",
    identity2,
    namespace,
    tag2,
    attributes,
    inner_html
  );
}

// build/dev/javascript/lustre/lustre/element/html.mjs
function h1(attrs, children) {
  return element2("h1", attrs, children);
}
function h2(attrs, children) {
  return element2("h2", attrs, children);
}
function div(attrs, children) {
  return element2("div", attrs, children);
}
function p(attrs, children) {
  return element2("p", attrs, children);
}
function a(attrs, children) {
  return element2("a", attrs, children);
}
function i(attrs, children) {
  return element2("i", attrs, children);
}
function small(attrs, children) {
  return element2("small", attrs, children);
}
function span(attrs, children) {
  return element2("span", attrs, children);
}
function img(attrs) {
  return element2("img", attrs, empty_list);
}
function button(attrs, children) {
  return element2("button", attrs, children);
}
function form(attrs, children) {
  return element2("form", attrs, children);
}
function input(attrs) {
  return element2("input", attrs, empty_list);
}
function label(attrs, children) {
  return element2("label", attrs, children);
}
function textarea(attrs, content) {
  return element2(
    "textarea",
    prepend(property2("value", string4(content)), attrs),
    toList([text2(content)])
  );
}

// build/dev/javascript/lustre/lustre/vdom/patch.mjs
var Patch = class extends CustomType {
  constructor(index5, removed, changes, children) {
    super();
    this.index = index5;
    this.removed = removed;
    this.changes = changes;
    this.children = children;
  }
};
var ReplaceText = class extends CustomType {
  constructor(kind, content) {
    super();
    this.kind = kind;
    this.content = content;
  }
};
var ReplaceInnerHtml = class extends CustomType {
  constructor(kind, inner_html) {
    super();
    this.kind = kind;
    this.inner_html = inner_html;
  }
};
var Update = class extends CustomType {
  constructor(kind, added, removed) {
    super();
    this.kind = kind;
    this.added = added;
    this.removed = removed;
  }
};
var Move = class extends CustomType {
  constructor(kind, key3, before) {
    super();
    this.kind = kind;
    this.key = key3;
    this.before = before;
  }
};
var Replace = class extends CustomType {
  constructor(kind, index5, with$) {
    super();
    this.kind = kind;
    this.index = index5;
    this.with = with$;
  }
};
var Remove = class extends CustomType {
  constructor(kind, index5) {
    super();
    this.kind = kind;
    this.index = index5;
  }
};
var Insert = class extends CustomType {
  constructor(kind, children, before) {
    super();
    this.kind = kind;
    this.children = children;
    this.before = before;
  }
};
function new$6(index5, removed, changes, children) {
  return new Patch(index5, removed, changes, children);
}
var replace_text_kind = 0;
function replace_text(content) {
  return new ReplaceText(replace_text_kind, content);
}
var replace_inner_html_kind = 1;
function replace_inner_html(inner_html) {
  return new ReplaceInnerHtml(replace_inner_html_kind, inner_html);
}
var update_kind = 2;
function update(added, removed) {
  return new Update(update_kind, added, removed);
}
var move_kind = 3;
function move(key3, before) {
  return new Move(move_kind, key3, before);
}
var remove_kind = 4;
function remove2(index5) {
  return new Remove(remove_kind, index5);
}
var replace_kind = 5;
function replace2(index5, with$) {
  return new Replace(replace_kind, index5, with$);
}
var insert_kind = 6;
function insert3(children, before) {
  return new Insert(insert_kind, children, before);
}

// build/dev/javascript/lustre/lustre/vdom/diff.mjs
var Diff = class extends CustomType {
  constructor(patch, events) {
    super();
    this.patch = patch;
    this.events = events;
  }
};
var AttributeChange = class extends CustomType {
  constructor(added, removed, events) {
    super();
    this.added = added;
    this.removed = removed;
    this.events = events;
  }
};
function is_controlled(events, namespace, tag2, path) {
  if (tag2 === "input" && namespace === "") {
    return has_dispatched_events(events, path);
  } else if (tag2 === "select" && namespace === "") {
    return has_dispatched_events(events, path);
  } else if (tag2 === "textarea" && namespace === "") {
    return has_dispatched_events(events, path);
  } else {
    return false;
  }
}
function diff_attributes(loop$controlled, loop$path, loop$mapper, loop$events, loop$old, loop$new, loop$added, loop$removed) {
  while (true) {
    let controlled = loop$controlled;
    let path = loop$path;
    let mapper = loop$mapper;
    let events = loop$events;
    let old = loop$old;
    let new$11 = loop$new;
    let added = loop$added;
    let removed = loop$removed;
    if (new$11 instanceof Empty) {
      if (old instanceof Empty) {
        return new AttributeChange(added, removed, events);
      } else {
        let $ = old.head;
        if ($ instanceof Event2) {
          let prev = $;
          let old$1 = old.tail;
          let name2 = $.name;
          let removed$1 = prepend(prev, removed);
          let events$1 = remove_event(events, path, name2);
          loop$controlled = controlled;
          loop$path = path;
          loop$mapper = mapper;
          loop$events = events$1;
          loop$old = old$1;
          loop$new = new$11;
          loop$added = added;
          loop$removed = removed$1;
        } else {
          let prev = $;
          let old$1 = old.tail;
          let removed$1 = prepend(prev, removed);
          loop$controlled = controlled;
          loop$path = path;
          loop$mapper = mapper;
          loop$events = events;
          loop$old = old$1;
          loop$new = new$11;
          loop$added = added;
          loop$removed = removed$1;
        }
      }
    } else if (old instanceof Empty) {
      let $ = new$11.head;
      if ($ instanceof Event2) {
        let next2 = $;
        let new$1 = new$11.tail;
        let name2 = $.name;
        let handler = $.handler;
        let added$1 = prepend(next2, added);
        let events$1 = add_event(events, mapper, path, name2, handler);
        loop$controlled = controlled;
        loop$path = path;
        loop$mapper = mapper;
        loop$events = events$1;
        loop$old = old;
        loop$new = new$1;
        loop$added = added$1;
        loop$removed = removed;
      } else {
        let next2 = $;
        let new$1 = new$11.tail;
        let added$1 = prepend(next2, added);
        loop$controlled = controlled;
        loop$path = path;
        loop$mapper = mapper;
        loop$events = events;
        loop$old = old;
        loop$new = new$1;
        loop$added = added$1;
        loop$removed = removed;
      }
    } else {
      let next2 = new$11.head;
      let remaining_new = new$11.tail;
      let prev = old.head;
      let remaining_old = old.tail;
      let $ = compare4(prev, next2);
      if ($ instanceof Lt) {
        if (prev instanceof Event2) {
          let name2 = prev.name;
          let removed$1 = prepend(prev, removed);
          let events$1 = remove_event(events, path, name2);
          loop$controlled = controlled;
          loop$path = path;
          loop$mapper = mapper;
          loop$events = events$1;
          loop$old = remaining_old;
          loop$new = new$11;
          loop$added = added;
          loop$removed = removed$1;
        } else {
          let removed$1 = prepend(prev, removed);
          loop$controlled = controlled;
          loop$path = path;
          loop$mapper = mapper;
          loop$events = events;
          loop$old = remaining_old;
          loop$new = new$11;
          loop$added = added;
          loop$removed = removed$1;
        }
      } else if ($ instanceof Eq) {
        if (next2 instanceof Attribute) {
          if (prev instanceof Attribute) {
            let _block;
            let $1 = next2.name;
            if ($1 === "value") {
              _block = controlled || prev.value !== next2.value;
            } else if ($1 === "checked") {
              _block = controlled || prev.value !== next2.value;
            } else if ($1 === "selected") {
              _block = controlled || prev.value !== next2.value;
            } else {
              _block = prev.value !== next2.value;
            }
            let has_changes = _block;
            let _block$1;
            if (has_changes) {
              _block$1 = prepend(next2, added);
            } else {
              _block$1 = added;
            }
            let added$1 = _block$1;
            loop$controlled = controlled;
            loop$path = path;
            loop$mapper = mapper;
            loop$events = events;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed;
          } else if (prev instanceof Event2) {
            let name2 = prev.name;
            let added$1 = prepend(next2, added);
            let removed$1 = prepend(prev, removed);
            let events$1 = remove_event(events, path, name2);
            loop$controlled = controlled;
            loop$path = path;
            loop$mapper = mapper;
            loop$events = events$1;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed$1;
          } else {
            let added$1 = prepend(next2, added);
            let removed$1 = prepend(prev, removed);
            loop$controlled = controlled;
            loop$path = path;
            loop$mapper = mapper;
            loop$events = events;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed$1;
          }
        } else if (next2 instanceof Property) {
          if (prev instanceof Property) {
            let _block;
            let $1 = next2.name;
            if ($1 === "scrollLeft") {
              _block = true;
            } else if ($1 === "scrollRight") {
              _block = true;
            } else if ($1 === "value") {
              _block = controlled || !isEqual2(
                prev.value,
                next2.value
              );
            } else if ($1 === "checked") {
              _block = controlled || !isEqual2(
                prev.value,
                next2.value
              );
            } else if ($1 === "selected") {
              _block = controlled || !isEqual2(
                prev.value,
                next2.value
              );
            } else {
              _block = !isEqual2(prev.value, next2.value);
            }
            let has_changes = _block;
            let _block$1;
            if (has_changes) {
              _block$1 = prepend(next2, added);
            } else {
              _block$1 = added;
            }
            let added$1 = _block$1;
            loop$controlled = controlled;
            loop$path = path;
            loop$mapper = mapper;
            loop$events = events;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed;
          } else if (prev instanceof Event2) {
            let name2 = prev.name;
            let added$1 = prepend(next2, added);
            let removed$1 = prepend(prev, removed);
            let events$1 = remove_event(events, path, name2);
            loop$controlled = controlled;
            loop$path = path;
            loop$mapper = mapper;
            loop$events = events$1;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed$1;
          } else {
            let added$1 = prepend(next2, added);
            let removed$1 = prepend(prev, removed);
            loop$controlled = controlled;
            loop$path = path;
            loop$mapper = mapper;
            loop$events = events;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed$1;
          }
        } else if (prev instanceof Event2) {
          let name2 = next2.name;
          let handler = next2.handler;
          let has_changes = prev.prevent_default.kind !== next2.prevent_default.kind || prev.stop_propagation.kind !== next2.stop_propagation.kind || prev.immediate !== next2.immediate || prev.debounce !== next2.debounce || prev.throttle !== next2.throttle;
          let _block;
          if (has_changes) {
            _block = prepend(next2, added);
          } else {
            _block = added;
          }
          let added$1 = _block;
          let events$1 = add_event(events, mapper, path, name2, handler);
          loop$controlled = controlled;
          loop$path = path;
          loop$mapper = mapper;
          loop$events = events$1;
          loop$old = remaining_old;
          loop$new = remaining_new;
          loop$added = added$1;
          loop$removed = removed;
        } else {
          let name2 = next2.name;
          let handler = next2.handler;
          let added$1 = prepend(next2, added);
          let removed$1 = prepend(prev, removed);
          let events$1 = add_event(events, mapper, path, name2, handler);
          loop$controlled = controlled;
          loop$path = path;
          loop$mapper = mapper;
          loop$events = events$1;
          loop$old = remaining_old;
          loop$new = remaining_new;
          loop$added = added$1;
          loop$removed = removed$1;
        }
      } else if (next2 instanceof Event2) {
        let name2 = next2.name;
        let handler = next2.handler;
        let added$1 = prepend(next2, added);
        let events$1 = add_event(events, mapper, path, name2, handler);
        loop$controlled = controlled;
        loop$path = path;
        loop$mapper = mapper;
        loop$events = events$1;
        loop$old = old;
        loop$new = remaining_new;
        loop$added = added$1;
        loop$removed = removed;
      } else {
        let added$1 = prepend(next2, added);
        loop$controlled = controlled;
        loop$path = path;
        loop$mapper = mapper;
        loop$events = events;
        loop$old = old;
        loop$new = remaining_new;
        loop$added = added$1;
        loop$removed = removed;
      }
    }
  }
}
function do_diff(loop$old, loop$old_keyed, loop$new, loop$new_keyed, loop$moved, loop$moved_offset, loop$removed, loop$node_index, loop$patch_index, loop$path, loop$changes, loop$children, loop$mapper, loop$events) {
  while (true) {
    let old = loop$old;
    let old_keyed = loop$old_keyed;
    let new$11 = loop$new;
    let new_keyed = loop$new_keyed;
    let moved = loop$moved;
    let moved_offset = loop$moved_offset;
    let removed = loop$removed;
    let node_index = loop$node_index;
    let patch_index = loop$patch_index;
    let path = loop$path;
    let changes = loop$changes;
    let children = loop$children;
    let mapper = loop$mapper;
    let events = loop$events;
    if (new$11 instanceof Empty) {
      if (old instanceof Empty) {
        return new Diff(
          new Patch(patch_index, removed, changes, children),
          events
        );
      } else {
        let prev = old.head;
        let old$1 = old.tail;
        let _block;
        let $ = prev.key === "" || !has_key2(moved, prev.key);
        if ($) {
          _block = removed + 1;
        } else {
          _block = removed;
        }
        let removed$1 = _block;
        let events$1 = remove_child(events, path, node_index, prev);
        loop$old = old$1;
        loop$old_keyed = old_keyed;
        loop$new = new$11;
        loop$new_keyed = new_keyed;
        loop$moved = moved;
        loop$moved_offset = moved_offset;
        loop$removed = removed$1;
        loop$node_index = node_index;
        loop$patch_index = patch_index;
        loop$path = path;
        loop$changes = changes;
        loop$children = children;
        loop$mapper = mapper;
        loop$events = events$1;
      }
    } else if (old instanceof Empty) {
      let events$1 = add_children(
        events,
        mapper,
        path,
        node_index,
        new$11
      );
      let insert4 = insert3(new$11, node_index - moved_offset);
      let changes$1 = prepend(insert4, changes);
      return new Diff(
        new Patch(patch_index, removed, changes$1, children),
        events$1
      );
    } else {
      let next2 = new$11.head;
      let prev = old.head;
      if (prev.key !== next2.key) {
        let new_remaining = new$11.tail;
        let old_remaining = old.tail;
        let next_did_exist = get(old_keyed, next2.key);
        let prev_does_exist = has_key2(new_keyed, prev.key);
        if (next_did_exist instanceof Ok) {
          if (prev_does_exist) {
            let match = next_did_exist[0];
            let $ = has_key2(moved, prev.key);
            if ($) {
              loop$old = old_remaining;
              loop$old_keyed = old_keyed;
              loop$new = new$11;
              loop$new_keyed = new_keyed;
              loop$moved = moved;
              loop$moved_offset = moved_offset - 1;
              loop$removed = removed;
              loop$node_index = node_index;
              loop$patch_index = patch_index;
              loop$path = path;
              loop$changes = changes;
              loop$children = children;
              loop$mapper = mapper;
              loop$events = events;
            } else {
              let before = node_index - moved_offset;
              let changes$1 = prepend(
                move(next2.key, before),
                changes
              );
              let moved$1 = insert2(moved, next2.key, void 0);
              let moved_offset$1 = moved_offset + 1;
              loop$old = prepend(match, old);
              loop$old_keyed = old_keyed;
              loop$new = new$11;
              loop$new_keyed = new_keyed;
              loop$moved = moved$1;
              loop$moved_offset = moved_offset$1;
              loop$removed = removed;
              loop$node_index = node_index;
              loop$patch_index = patch_index;
              loop$path = path;
              loop$changes = changes$1;
              loop$children = children;
              loop$mapper = mapper;
              loop$events = events;
            }
          } else {
            let index5 = node_index - moved_offset;
            let changes$1 = prepend(remove2(index5), changes);
            let events$1 = remove_child(events, path, node_index, prev);
            let moved_offset$1 = moved_offset - 1;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new$11;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset$1;
            loop$removed = removed;
            loop$node_index = node_index;
            loop$patch_index = patch_index;
            loop$path = path;
            loop$changes = changes$1;
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        } else if (prev_does_exist) {
          let before = node_index - moved_offset;
          let events$1 = add_child(
            events,
            mapper,
            path,
            node_index,
            next2
          );
          let insert4 = insert3(toList([next2]), before);
          let changes$1 = prepend(insert4, changes);
          loop$old = old;
          loop$old_keyed = old_keyed;
          loop$new = new_remaining;
          loop$new_keyed = new_keyed;
          loop$moved = moved;
          loop$moved_offset = moved_offset + 1;
          loop$removed = removed;
          loop$node_index = node_index + 1;
          loop$patch_index = patch_index;
          loop$path = path;
          loop$changes = changes$1;
          loop$children = children;
          loop$mapper = mapper;
          loop$events = events$1;
        } else {
          let change = replace2(node_index - moved_offset, next2);
          let _block;
          let _pipe = events;
          let _pipe$1 = remove_child(_pipe, path, node_index, prev);
          _block = add_child(_pipe$1, mapper, path, node_index, next2);
          let events$1 = _block;
          loop$old = old_remaining;
          loop$old_keyed = old_keyed;
          loop$new = new_remaining;
          loop$new_keyed = new_keyed;
          loop$moved = moved;
          loop$moved_offset = moved_offset;
          loop$removed = removed;
          loop$node_index = node_index + 1;
          loop$patch_index = patch_index;
          loop$path = path;
          loop$changes = prepend(change, changes);
          loop$children = children;
          loop$mapper = mapper;
          loop$events = events$1;
        }
      } else {
        let $ = old.head;
        if ($ instanceof Fragment) {
          let $1 = new$11.head;
          if ($1 instanceof Fragment) {
            let next$1 = $1;
            let new$1 = new$11.tail;
            let prev$1 = $;
            let old$1 = old.tail;
            let composed_mapper = compose_mapper(mapper, next$1.mapper);
            let child_path = add2(path, node_index, next$1.key);
            let child = do_diff(
              prev$1.children,
              prev$1.keyed_children,
              next$1.children,
              next$1.keyed_children,
              empty3(),
              0,
              0,
              0,
              node_index,
              child_path,
              empty_list,
              empty_list,
              composed_mapper,
              events
            );
            let _block;
            let $2 = child.patch;
            let $3 = $2.children;
            if ($3 instanceof Empty) {
              let $4 = $2.changes;
              if ($4 instanceof Empty) {
                let $5 = $2.removed;
                if ($5 === 0) {
                  _block = children;
                } else {
                  _block = prepend(child.patch, children);
                }
              } else {
                _block = prepend(child.patch, children);
              }
            } else {
              _block = prepend(child.patch, children);
            }
            let children$1 = _block;
            loop$old = old$1;
            loop$old_keyed = old_keyed;
            loop$new = new$1;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset;
            loop$removed = removed;
            loop$node_index = node_index + 1;
            loop$patch_index = patch_index;
            loop$path = path;
            loop$changes = changes;
            loop$children = children$1;
            loop$mapper = mapper;
            loop$events = child.events;
          } else {
            let next$1 = $1;
            let new_remaining = new$11.tail;
            let prev$1 = $;
            let old_remaining = old.tail;
            let change = replace2(node_index - moved_offset, next$1);
            let _block;
            let _pipe = events;
            let _pipe$1 = remove_child(_pipe, path, node_index, prev$1);
            _block = add_child(
              _pipe$1,
              mapper,
              path,
              node_index,
              next$1
            );
            let events$1 = _block;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new_remaining;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset;
            loop$removed = removed;
            loop$node_index = node_index + 1;
            loop$patch_index = patch_index;
            loop$path = path;
            loop$changes = prepend(change, changes);
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        } else if ($ instanceof Element2) {
          let $1 = new$11.head;
          if ($1 instanceof Element2) {
            let next$1 = $1;
            let prev$1 = $;
            if (prev$1.namespace === next$1.namespace && prev$1.tag === next$1.tag) {
              let new$1 = new$11.tail;
              let old$1 = old.tail;
              let composed_mapper = compose_mapper(
                mapper,
                next$1.mapper
              );
              let child_path = add2(path, node_index, next$1.key);
              let controlled = is_controlled(
                events,
                next$1.namespace,
                next$1.tag,
                child_path
              );
              let $2 = diff_attributes(
                controlled,
                child_path,
                composed_mapper,
                events,
                prev$1.attributes,
                next$1.attributes,
                empty_list,
                empty_list
              );
              let added_attrs;
              let removed_attrs;
              let events$1;
              added_attrs = $2.added;
              removed_attrs = $2.removed;
              events$1 = $2.events;
              let _block;
              if (removed_attrs instanceof Empty && added_attrs instanceof Empty) {
                _block = empty_list;
              } else {
                _block = toList([update(added_attrs, removed_attrs)]);
              }
              let initial_child_changes = _block;
              let child = do_diff(
                prev$1.children,
                prev$1.keyed_children,
                next$1.children,
                next$1.keyed_children,
                empty3(),
                0,
                0,
                0,
                node_index,
                child_path,
                initial_child_changes,
                empty_list,
                composed_mapper,
                events$1
              );
              let _block$1;
              let $3 = child.patch;
              let $4 = $3.children;
              if ($4 instanceof Empty) {
                let $5 = $3.changes;
                if ($5 instanceof Empty) {
                  let $6 = $3.removed;
                  if ($6 === 0) {
                    _block$1 = children;
                  } else {
                    _block$1 = prepend(child.patch, children);
                  }
                } else {
                  _block$1 = prepend(child.patch, children);
                }
              } else {
                _block$1 = prepend(child.patch, children);
              }
              let children$1 = _block$1;
              loop$old = old$1;
              loop$old_keyed = old_keyed;
              loop$new = new$1;
              loop$new_keyed = new_keyed;
              loop$moved = moved;
              loop$moved_offset = moved_offset;
              loop$removed = removed;
              loop$node_index = node_index + 1;
              loop$patch_index = patch_index;
              loop$path = path;
              loop$changes = changes;
              loop$children = children$1;
              loop$mapper = mapper;
              loop$events = child.events;
            } else {
              let next$2 = $1;
              let new_remaining = new$11.tail;
              let prev$2 = $;
              let old_remaining = old.tail;
              let change = replace2(node_index - moved_offset, next$2);
              let _block;
              let _pipe = events;
              let _pipe$1 = remove_child(
                _pipe,
                path,
                node_index,
                prev$2
              );
              _block = add_child(
                _pipe$1,
                mapper,
                path,
                node_index,
                next$2
              );
              let events$1 = _block;
              loop$old = old_remaining;
              loop$old_keyed = old_keyed;
              loop$new = new_remaining;
              loop$new_keyed = new_keyed;
              loop$moved = moved;
              loop$moved_offset = moved_offset;
              loop$removed = removed;
              loop$node_index = node_index + 1;
              loop$patch_index = patch_index;
              loop$path = path;
              loop$changes = prepend(change, changes);
              loop$children = children;
              loop$mapper = mapper;
              loop$events = events$1;
            }
          } else {
            let next$1 = $1;
            let new_remaining = new$11.tail;
            let prev$1 = $;
            let old_remaining = old.tail;
            let change = replace2(node_index - moved_offset, next$1);
            let _block;
            let _pipe = events;
            let _pipe$1 = remove_child(_pipe, path, node_index, prev$1);
            _block = add_child(
              _pipe$1,
              mapper,
              path,
              node_index,
              next$1
            );
            let events$1 = _block;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new_remaining;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset;
            loop$removed = removed;
            loop$node_index = node_index + 1;
            loop$patch_index = patch_index;
            loop$path = path;
            loop$changes = prepend(change, changes);
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        } else if ($ instanceof Text) {
          let $1 = new$11.head;
          if ($1 instanceof Text) {
            let next$1 = $1;
            let prev$1 = $;
            if (prev$1.content === next$1.content) {
              let new$1 = new$11.tail;
              let old$1 = old.tail;
              loop$old = old$1;
              loop$old_keyed = old_keyed;
              loop$new = new$1;
              loop$new_keyed = new_keyed;
              loop$moved = moved;
              loop$moved_offset = moved_offset;
              loop$removed = removed;
              loop$node_index = node_index + 1;
              loop$patch_index = patch_index;
              loop$path = path;
              loop$changes = changes;
              loop$children = children;
              loop$mapper = mapper;
              loop$events = events;
            } else {
              let next$2 = $1;
              let new$1 = new$11.tail;
              let old$1 = old.tail;
              let child = new$6(
                node_index,
                0,
                toList([replace_text(next$2.content)]),
                empty_list
              );
              loop$old = old$1;
              loop$old_keyed = old_keyed;
              loop$new = new$1;
              loop$new_keyed = new_keyed;
              loop$moved = moved;
              loop$moved_offset = moved_offset;
              loop$removed = removed;
              loop$node_index = node_index + 1;
              loop$patch_index = patch_index;
              loop$path = path;
              loop$changes = changes;
              loop$children = prepend(child, children);
              loop$mapper = mapper;
              loop$events = events;
            }
          } else {
            let next$1 = $1;
            let new_remaining = new$11.tail;
            let prev$1 = $;
            let old_remaining = old.tail;
            let change = replace2(node_index - moved_offset, next$1);
            let _block;
            let _pipe = events;
            let _pipe$1 = remove_child(_pipe, path, node_index, prev$1);
            _block = add_child(
              _pipe$1,
              mapper,
              path,
              node_index,
              next$1
            );
            let events$1 = _block;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new_remaining;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset;
            loop$removed = removed;
            loop$node_index = node_index + 1;
            loop$patch_index = patch_index;
            loop$path = path;
            loop$changes = prepend(change, changes);
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        } else {
          let $1 = new$11.head;
          if ($1 instanceof UnsafeInnerHtml) {
            let next$1 = $1;
            let new$1 = new$11.tail;
            let prev$1 = $;
            let old$1 = old.tail;
            let composed_mapper = compose_mapper(mapper, next$1.mapper);
            let child_path = add2(path, node_index, next$1.key);
            let $2 = diff_attributes(
              false,
              child_path,
              composed_mapper,
              events,
              prev$1.attributes,
              next$1.attributes,
              empty_list,
              empty_list
            );
            let added_attrs;
            let removed_attrs;
            let events$1;
            added_attrs = $2.added;
            removed_attrs = $2.removed;
            events$1 = $2.events;
            let _block;
            if (removed_attrs instanceof Empty && added_attrs instanceof Empty) {
              _block = empty_list;
            } else {
              _block = toList([update(added_attrs, removed_attrs)]);
            }
            let child_changes = _block;
            let _block$1;
            let $3 = prev$1.inner_html === next$1.inner_html;
            if ($3) {
              _block$1 = child_changes;
            } else {
              _block$1 = prepend(
                replace_inner_html(next$1.inner_html),
                child_changes
              );
            }
            let child_changes$1 = _block$1;
            let _block$2;
            if (child_changes$1 instanceof Empty) {
              _block$2 = children;
            } else {
              _block$2 = prepend(
                new$6(node_index, 0, child_changes$1, toList([])),
                children
              );
            }
            let children$1 = _block$2;
            loop$old = old$1;
            loop$old_keyed = old_keyed;
            loop$new = new$1;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset;
            loop$removed = removed;
            loop$node_index = node_index + 1;
            loop$patch_index = patch_index;
            loop$path = path;
            loop$changes = changes;
            loop$children = children$1;
            loop$mapper = mapper;
            loop$events = events$1;
          } else {
            let next$1 = $1;
            let new_remaining = new$11.tail;
            let prev$1 = $;
            let old_remaining = old.tail;
            let change = replace2(node_index - moved_offset, next$1);
            let _block;
            let _pipe = events;
            let _pipe$1 = remove_child(_pipe, path, node_index, prev$1);
            _block = add_child(
              _pipe$1,
              mapper,
              path,
              node_index,
              next$1
            );
            let events$1 = _block;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new_remaining;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset;
            loop$removed = removed;
            loop$node_index = node_index + 1;
            loop$patch_index = patch_index;
            loop$path = path;
            loop$changes = prepend(change, changes);
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        }
      }
    }
  }
}
function diff(events, old, new$11) {
  return do_diff(
    toList([old]),
    empty3(),
    toList([new$11]),
    empty3(),
    empty3(),
    0,
    0,
    0,
    0,
    root2,
    empty_list,
    empty_list,
    identity2,
    tick(events)
  );
}

// build/dev/javascript/lustre/lustre/vdom/reconciler.ffi.mjs
var setTimeout2 = globalThis.setTimeout;
var clearTimeout = globalThis.clearTimeout;
var createElementNS = (ns, name2) => document2().createElementNS(ns, name2);
var createTextNode = (data2) => document2().createTextNode(data2);
var createDocumentFragment = () => document2().createDocumentFragment();
var insertBefore = (parent, node, reference) => parent.insertBefore(node, reference);
var moveBefore = SUPPORTS_MOVE_BEFORE ? (parent, node, reference) => parent.moveBefore(node, reference) : insertBefore;
var removeChild = (parent, child) => parent.removeChild(child);
var getAttribute = (node, name2) => node.getAttribute(name2);
var setAttribute = (node, name2, value3) => node.setAttribute(name2, value3);
var removeAttribute = (node, name2) => node.removeAttribute(name2);
var addEventListener = (node, name2, handler, options) => node.addEventListener(name2, handler, options);
var removeEventListener = (node, name2, handler) => node.removeEventListener(name2, handler);
var setInnerHtml = (node, innerHtml) => node.innerHTML = innerHtml;
var setData = (node, data2) => node.data = data2;
var meta = Symbol("lustre");
var MetadataNode = class {
  constructor(kind, parent, node, key3) {
    this.kind = kind;
    this.key = key3;
    this.parent = parent;
    this.children = [];
    this.node = node;
    this.handlers = /* @__PURE__ */ new Map();
    this.throttles = /* @__PURE__ */ new Map();
    this.debouncers = /* @__PURE__ */ new Map();
  }
  get parentNode() {
    return this.kind === fragment_kind ? this.node.parentNode : this.node;
  }
};
var insertMetadataChild = (kind, parent, node, index5, key3) => {
  const child = new MetadataNode(kind, parent, node, key3);
  node[meta] = child;
  parent?.children.splice(index5, 0, child);
  return child;
};
var getPath = (node) => {
  let path = "";
  for (let current2 = node[meta]; current2.parent; current2 = current2.parent) {
    if (current2.key) {
      path = `${separator_element}${current2.key}${path}`;
    } else {
      const index5 = current2.parent.children.indexOf(current2);
      path = `${separator_element}${index5}${path}`;
    }
  }
  return path.slice(1);
};
var Reconciler = class {
  #root = null;
  #dispatch = () => {
  };
  #useServerEvents = false;
  #exposeKeys = false;
  constructor(root3, dispatch, { useServerEvents = false, exposeKeys = false } = {}) {
    this.#root = root3;
    this.#dispatch = dispatch;
    this.#useServerEvents = useServerEvents;
    this.#exposeKeys = exposeKeys;
  }
  mount(vdom) {
    insertMetadataChild(element_kind, null, this.#root, 0, null);
    this.#insertChild(this.#root, null, this.#root[meta], 0, vdom);
  }
  push(patch) {
    this.#stack.push({ node: this.#root[meta], patch });
    this.#reconcile();
  }
  // PATCHING ------------------------------------------------------------------
  #stack = [];
  #reconcile() {
    const stack = this.#stack;
    while (stack.length) {
      const { node, patch } = stack.pop();
      const { children: childNodes } = node;
      const { changes, removed, children: childPatches } = patch;
      iterate(changes, (change) => this.#patch(node, change));
      if (removed) {
        this.#removeChildren(node, childNodes.length - removed, removed);
      }
      iterate(childPatches, (childPatch) => {
        const child = childNodes[childPatch.index | 0];
        this.#stack.push({ node: child, patch: childPatch });
      });
    }
  }
  #patch(node, change) {
    switch (change.kind) {
      case replace_text_kind:
        this.#replaceText(node, change);
        break;
      case replace_inner_html_kind:
        this.#replaceInnerHtml(node, change);
        break;
      case update_kind:
        this.#update(node, change);
        break;
      case move_kind:
        this.#move(node, change);
        break;
      case remove_kind:
        this.#remove(node, change);
        break;
      case replace_kind:
        this.#replace(node, change);
        break;
      case insert_kind:
        this.#insert(node, change);
        break;
    }
  }
  // CHANGES -------------------------------------------------------------------
  #insert(parent, { children, before }) {
    const fragment3 = createDocumentFragment();
    const beforeEl = this.#getReference(parent, before);
    this.#insertChildren(fragment3, null, parent, before | 0, children);
    insertBefore(parent.parentNode, fragment3, beforeEl);
  }
  #replace(parent, { index: index5, with: child }) {
    this.#removeChildren(parent, index5 | 0, 1);
    const beforeEl = this.#getReference(parent, index5);
    this.#insertChild(parent.parentNode, beforeEl, parent, index5 | 0, child);
  }
  #getReference(node, index5) {
    index5 = index5 | 0;
    const { children } = node;
    const childCount = children.length;
    if (index5 < childCount) {
      return children[index5].node;
    }
    let lastChild = children[childCount - 1];
    if (!lastChild && node.kind !== fragment_kind) return null;
    if (!lastChild) lastChild = node;
    while (lastChild.kind === fragment_kind && lastChild.children.length) {
      lastChild = lastChild.children[lastChild.children.length - 1];
    }
    return lastChild.node.nextSibling;
  }
  #move(parent, { key: key3, before }) {
    before = before | 0;
    const { children, parentNode } = parent;
    const beforeEl = children[before].node;
    let prev = children[before];
    for (let i2 = before + 1; i2 < children.length; ++i2) {
      const next2 = children[i2];
      children[i2] = prev;
      prev = next2;
      if (next2.key === key3) {
        children[before] = next2;
        break;
      }
    }
    const { kind, node, children: prevChildren } = prev;
    moveBefore(parentNode, node, beforeEl);
    if (kind === fragment_kind) {
      this.#moveChildren(parentNode, prevChildren, beforeEl);
    }
  }
  #moveChildren(domParent, children, beforeEl) {
    for (let i2 = 0; i2 < children.length; ++i2) {
      const { kind, node, children: nestedChildren } = children[i2];
      moveBefore(domParent, node, beforeEl);
      if (kind === fragment_kind) {
        this.#moveChildren(domParent, nestedChildren, beforeEl);
      }
    }
  }
  #remove(parent, { index: index5 }) {
    this.#removeChildren(parent, index5, 1);
  }
  #removeChildren(parent, index5, count) {
    const { children, parentNode } = parent;
    const deleted = children.splice(index5, count);
    for (let i2 = 0; i2 < deleted.length; ++i2) {
      const { kind, node, children: nestedChildren } = deleted[i2];
      removeChild(parentNode, node);
      this.#removeDebouncers(deleted[i2]);
      if (kind === fragment_kind) {
        deleted.push(...nestedChildren);
      }
    }
  }
  #removeDebouncers(node) {
    const { debouncers, children } = node;
    for (const { timeout } of debouncers.values()) {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
    debouncers.clear();
    iterate(children, (child) => this.#removeDebouncers(child));
  }
  #update({ node, handlers, throttles, debouncers }, { added, removed }) {
    iterate(removed, ({ name: name2 }) => {
      if (handlers.delete(name2)) {
        removeEventListener(node, name2, handleEvent);
        this.#updateDebounceThrottle(throttles, name2, 0);
        this.#updateDebounceThrottle(debouncers, name2, 0);
      } else {
        removeAttribute(node, name2);
        SYNCED_ATTRIBUTES[name2]?.removed?.(node, name2);
      }
    });
    iterate(added, (attribute3) => this.#createAttribute(node, attribute3));
  }
  #replaceText({ node }, { content }) {
    setData(node, content ?? "");
  }
  #replaceInnerHtml({ node }, { inner_html }) {
    setInnerHtml(node, inner_html ?? "");
  }
  // INSERT --------------------------------------------------------------------
  #insertChildren(domParent, beforeEl, metaParent, index5, children) {
    iterate(
      children,
      (child) => this.#insertChild(domParent, beforeEl, metaParent, index5++, child)
    );
  }
  #insertChild(domParent, beforeEl, metaParent, index5, vnode) {
    switch (vnode.kind) {
      case element_kind: {
        const node = this.#createElement(metaParent, index5, vnode);
        this.#insertChildren(node, null, node[meta], 0, vnode.children);
        insertBefore(domParent, node, beforeEl);
        break;
      }
      case text_kind: {
        const node = this.#createTextNode(metaParent, index5, vnode);
        insertBefore(domParent, node, beforeEl);
        break;
      }
      case fragment_kind: {
        const head = this.#createTextNode(metaParent, index5, vnode);
        insertBefore(domParent, head, beforeEl);
        this.#insertChildren(
          domParent,
          beforeEl,
          head[meta],
          0,
          vnode.children
        );
        break;
      }
      case unsafe_inner_html_kind: {
        const node = this.#createElement(metaParent, index5, vnode);
        this.#replaceInnerHtml({ node }, vnode);
        insertBefore(domParent, node, beforeEl);
        break;
      }
    }
  }
  #createElement(parent, index5, { kind, key: key3, tag: tag2, namespace, attributes }) {
    const node = createElementNS(namespace || NAMESPACE_HTML, tag2);
    insertMetadataChild(kind, parent, node, index5, key3);
    if (this.#exposeKeys && key3) {
      setAttribute(node, "data-lustre-key", key3);
    }
    iterate(attributes, (attribute3) => this.#createAttribute(node, attribute3));
    return node;
  }
  #createTextNode(parent, index5, { kind, key: key3, content }) {
    const node = createTextNode(content ?? "");
    insertMetadataChild(kind, parent, node, index5, key3);
    return node;
  }
  #createAttribute(node, attribute3) {
    const { debouncers, handlers, throttles } = node[meta];
    const {
      kind,
      name: name2,
      value: value3,
      prevent_default: prevent,
      debounce: debounceDelay,
      throttle: throttleDelay
    } = attribute3;
    switch (kind) {
      case attribute_kind: {
        const valueOrDefault = value3 ?? "";
        if (name2 === "virtual:defaultValue") {
          node.defaultValue = valueOrDefault;
          return;
        }
        if (valueOrDefault !== getAttribute(node, name2)) {
          setAttribute(node, name2, valueOrDefault);
        }
        SYNCED_ATTRIBUTES[name2]?.added?.(node, valueOrDefault);
        break;
      }
      case property_kind:
        node[name2] = value3;
        break;
      case event_kind: {
        if (handlers.has(name2)) {
          removeEventListener(node, name2, handleEvent);
        }
        const passive = prevent.kind === never_kind;
        addEventListener(node, name2, handleEvent, { passive });
        this.#updateDebounceThrottle(throttles, name2, throttleDelay);
        this.#updateDebounceThrottle(debouncers, name2, debounceDelay);
        handlers.set(name2, (event4) => this.#handleEvent(attribute3, event4));
        break;
      }
    }
  }
  #updateDebounceThrottle(map7, name2, delay) {
    const debounceOrThrottle = map7.get(name2);
    if (delay > 0) {
      if (debounceOrThrottle) {
        debounceOrThrottle.delay = delay;
      } else {
        map7.set(name2, { delay });
      }
    } else if (debounceOrThrottle) {
      const { timeout } = debounceOrThrottle;
      if (timeout) {
        clearTimeout(timeout);
      }
      map7.delete(name2);
    }
  }
  #handleEvent(attribute3, event4) {
    const { currentTarget: currentTarget2, type } = event4;
    const { debouncers, throttles } = currentTarget2[meta];
    const path = getPath(currentTarget2);
    const {
      prevent_default: prevent,
      stop_propagation: stop,
      include,
      immediate: immediate2
    } = attribute3;
    if (prevent.kind === always_kind) event4.preventDefault();
    if (stop.kind === always_kind) event4.stopPropagation();
    if (type === "submit") {
      event4.detail ??= {};
      event4.detail.formData = [...new FormData(event4.target).entries()];
    }
    const data2 = this.#useServerEvents ? createServerEvent(event4, include ?? []) : event4;
    const throttle = throttles.get(type);
    if (throttle) {
      const now2 = Date.now();
      const last = throttle.last || 0;
      if (now2 > last + throttle.delay) {
        throttle.last = now2;
        throttle.lastEvent = event4;
        this.#dispatch(data2, path, type, immediate2);
      }
    }
    const debounce = debouncers.get(type);
    if (debounce) {
      clearTimeout(debounce.timeout);
      debounce.timeout = setTimeout2(() => {
        if (event4 === throttles.get(type)?.lastEvent) return;
        this.#dispatch(data2, path, type, immediate2);
      }, debounce.delay);
    }
    if (!throttle && !debounce) {
      this.#dispatch(data2, path, type, immediate2);
    }
  }
};
var iterate = (list5, callback) => {
  if (Array.isArray(list5)) {
    for (let i2 = 0; i2 < list5.length; i2++) {
      callback(list5[i2]);
    }
  } else if (list5) {
    for (list5; list5.head; list5 = list5.tail) {
      callback(list5.head);
    }
  }
};
var handleEvent = (event4) => {
  const { currentTarget: currentTarget2, type } = event4;
  const handler = currentTarget2[meta].handlers.get(type);
  handler(event4);
};
var createServerEvent = (event4, include = []) => {
  const data2 = {};
  if (event4.type === "input" || event4.type === "change") {
    include.push("target.value");
  }
  if (event4.type === "submit") {
    include.push("detail.formData");
  }
  for (const property3 of include) {
    const path = property3.split(".");
    for (let i2 = 0, input2 = event4, output = data2; i2 < path.length; i2++) {
      if (i2 === path.length - 1) {
        output[path[i2]] = input2[path[i2]];
        break;
      }
      output = output[path[i2]] ??= {};
      input2 = input2[path[i2]];
    }
  }
  return data2;
};
var syncedBooleanAttribute = /* @__NO_SIDE_EFFECTS__ */ (name2) => {
  return {
    added(node) {
      node[name2] = true;
    },
    removed(node) {
      node[name2] = false;
    }
  };
};
var syncedAttribute = /* @__NO_SIDE_EFFECTS__ */ (name2) => {
  return {
    added(node, value3) {
      node[name2] = value3;
    }
  };
};
var SYNCED_ATTRIBUTES = {
  checked: /* @__PURE__ */ syncedBooleanAttribute("checked"),
  selected: /* @__PURE__ */ syncedBooleanAttribute("selected"),
  value: /* @__PURE__ */ syncedAttribute("value"),
  autofocus: {
    added(node) {
      queueMicrotask(() => {
        node.focus?.();
      });
    }
  },
  autoplay: {
    added(node) {
      try {
        node.play?.();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

// build/dev/javascript/lustre/lustre/element/keyed.mjs
function do_extract_keyed_children(loop$key_children_pairs, loop$keyed_children, loop$children) {
  while (true) {
    let key_children_pairs = loop$key_children_pairs;
    let keyed_children = loop$keyed_children;
    let children = loop$children;
    if (key_children_pairs instanceof Empty) {
      return [keyed_children, reverse(children)];
    } else {
      let rest = key_children_pairs.tail;
      let key3 = key_children_pairs.head[0];
      let element$1 = key_children_pairs.head[1];
      let keyed_element = to_keyed(key3, element$1);
      let _block;
      if (key3 === "") {
        _block = keyed_children;
      } else {
        _block = insert2(keyed_children, key3, keyed_element);
      }
      let keyed_children$1 = _block;
      let children$1 = prepend(keyed_element, children);
      loop$key_children_pairs = rest;
      loop$keyed_children = keyed_children$1;
      loop$children = children$1;
    }
  }
}
function extract_keyed_children(children) {
  return do_extract_keyed_children(
    children,
    empty3(),
    empty_list
  );
}
function element3(tag2, attributes, children) {
  let $ = extract_keyed_children(children);
  let keyed_children;
  let children$1;
  keyed_children = $[0];
  children$1 = $[1];
  return element(
    "",
    identity2,
    "",
    tag2,
    attributes,
    children$1,
    keyed_children,
    false,
    false
  );
}
function namespaced2(namespace, tag2, attributes, children) {
  let $ = extract_keyed_children(children);
  let keyed_children;
  let children$1;
  keyed_children = $[0];
  children$1 = $[1];
  return element(
    "",
    identity2,
    namespace,
    tag2,
    attributes,
    children$1,
    keyed_children,
    false,
    false
  );
}
function fragment2(children) {
  let $ = extract_keyed_children(children);
  let keyed_children;
  let children$1;
  keyed_children = $[0];
  children$1 = $[1];
  return fragment("", identity2, children$1, keyed_children);
}

// build/dev/javascript/lustre/lustre/vdom/virtualise.ffi.mjs
var virtualise = (root3) => {
  const rootMeta = insertMetadataChild(element_kind, null, root3, 0, null);
  let virtualisableRootChildren = 0;
  for (let child = root3.firstChild; child; child = child.nextSibling) {
    if (canVirtualiseNode(child)) virtualisableRootChildren += 1;
  }
  if (virtualisableRootChildren === 0) {
    const placeholder2 = document2().createTextNode("");
    insertMetadataChild(text_kind, rootMeta, placeholder2, 0, null);
    root3.replaceChildren(placeholder2);
    return none3();
  }
  if (virtualisableRootChildren === 1) {
    const children2 = virtualiseChildNodes(rootMeta, root3);
    return children2.head[1];
  }
  const fragmentHead = document2().createTextNode("");
  const fragmentMeta = insertMetadataChild(fragment_kind, rootMeta, fragmentHead, 0, null);
  const children = virtualiseChildNodes(fragmentMeta, root3);
  root3.insertBefore(fragmentHead, root3.firstChild);
  return fragment2(children);
};
var canVirtualiseNode = (node) => {
  switch (node.nodeType) {
    case ELEMENT_NODE:
      return true;
    case TEXT_NODE:
      return !!node.data;
    default:
      return false;
  }
};
var virtualiseNode = (meta2, node, key3, index5) => {
  if (!canVirtualiseNode(node)) {
    return null;
  }
  switch (node.nodeType) {
    case ELEMENT_NODE: {
      const childMeta = insertMetadataChild(element_kind, meta2, node, index5, key3);
      const tag2 = node.localName;
      const namespace = node.namespaceURI;
      const isHtmlElement = !namespace || namespace === NAMESPACE_HTML;
      if (isHtmlElement && INPUT_ELEMENTS.includes(tag2)) {
        virtualiseInputEvents(tag2, node);
      }
      const attributes = virtualiseAttributes(node);
      const children = virtualiseChildNodes(childMeta, node);
      const vnode = isHtmlElement ? element3(tag2, attributes, children) : namespaced2(namespace, tag2, attributes, children);
      return vnode;
    }
    case TEXT_NODE:
      insertMetadataChild(text_kind, meta2, node, index5, null);
      return text2(node.data);
    default:
      return null;
  }
};
var INPUT_ELEMENTS = ["input", "select", "textarea"];
var virtualiseInputEvents = (tag2, node) => {
  const value3 = node.value;
  const checked2 = node.checked;
  if (tag2 === "input" && node.type === "checkbox" && !checked2) return;
  if (tag2 === "input" && node.type === "radio" && !checked2) return;
  if (node.type !== "checkbox" && node.type !== "radio" && !value3) return;
  queueMicrotask(() => {
    node.value = value3;
    node.checked = checked2;
    node.dispatchEvent(new Event("input", { bubbles: true }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
    if (document2().activeElement !== node) {
      node.dispatchEvent(new Event("blur", { bubbles: true }));
    }
  });
};
var virtualiseChildNodes = (meta2, node) => {
  let children = null;
  let child = node.firstChild;
  let ptr = null;
  let index5 = 0;
  while (child) {
    const key3 = child.nodeType === ELEMENT_NODE ? child.getAttribute("data-lustre-key") : null;
    if (key3 != null) {
      child.removeAttribute("data-lustre-key");
    }
    const vnode = virtualiseNode(meta2, child, key3, index5);
    const next2 = child.nextSibling;
    if (vnode) {
      const list_node = new NonEmpty([key3 ?? "", vnode], null);
      if (ptr) {
        ptr = ptr.tail = list_node;
      } else {
        ptr = children = list_node;
      }
      index5 += 1;
    } else {
      node.removeChild(child);
    }
    child = next2;
  }
  if (!ptr) return empty_list;
  ptr.tail = empty_list;
  return children;
};
var virtualiseAttributes = (node) => {
  let index5 = node.attributes.length;
  let attributes = empty_list;
  while (index5-- > 0) {
    const attr = node.attributes[index5];
    if (attr.name === "xmlns") {
      continue;
    }
    attributes = new NonEmpty(virtualiseAttribute(attr), attributes);
  }
  return attributes;
};
var virtualiseAttribute = (attr) => {
  const name2 = attr.localName;
  const value3 = attr.value;
  return attribute2(name2, value3);
};

// build/dev/javascript/lustre/lustre/runtime/client/runtime.ffi.mjs
var is_browser = () => !!document2();
var Runtime = class {
  constructor(root3, [model, effects], view15, update12) {
    this.root = root3;
    this.#model = model;
    this.#view = view15;
    this.#update = update12;
    this.root.addEventListener("context-request", (event4) => {
      if (!(event4.context && event4.callback)) return;
      if (!this.#contexts.has(event4.context)) return;
      event4.stopImmediatePropagation();
      const context = this.#contexts.get(event4.context);
      if (event4.subscribe) {
        const callbackRef = new WeakRef(event4.callback);
        const unsubscribe = () => {
          context.subscribers = context.subscribers.filter(
            (subscriber) => subscriber !== callbackRef
          );
        };
        context.subscribers.push([callbackRef, unsubscribe]);
        event4.callback(context.value, unsubscribe);
      } else {
        event4.callback(context.value);
      }
    });
    this.#reconciler = new Reconciler(this.root, (event4, path, name2) => {
      const [events, result] = handle(this.#events, path, name2, event4);
      this.#events = events;
      if (result.isOk()) {
        const handler = result[0];
        if (handler.stop_propagation) event4.stopPropagation();
        if (handler.prevent_default) event4.preventDefault();
        this.dispatch(handler.message, false);
      }
    });
    this.#vdom = virtualise(this.root);
    this.#events = new$4();
    this.#shouldFlush = true;
    this.#tick(effects);
  }
  // PUBLIC API ----------------------------------------------------------------
  root = null;
  dispatch(msg, immediate2 = false) {
    this.#shouldFlush ||= immediate2;
    if (this.#shouldQueue) {
      this.#queue.push(msg);
    } else {
      const [model, effects] = this.#update(this.#model, msg);
      this.#model = model;
      this.#tick(effects);
    }
  }
  emit(event4, data2) {
    const target3 = this.root.host ?? this.root;
    target3.dispatchEvent(
      new CustomEvent(event4, {
        detail: data2,
        bubbles: true,
        composed: true
      })
    );
  }
  // Provide a context value for any child nodes that request it using the given
  // key. If the key already exists, any existing subscribers will be notified
  // of the change. Otherwise, we store the value and wait for any `context-request`
  // events to come in.
  provide(key3, value3) {
    if (!this.#contexts.has(key3)) {
      this.#contexts.set(key3, { value: value3, subscribers: [] });
    } else {
      const context = this.#contexts.get(key3);
      context.value = value3;
      for (let i2 = context.subscribers.length - 1; i2 >= 0; i2--) {
        const [subscriberRef, unsubscribe] = context.subscribers[i2];
        const subscriber = subscriberRef.deref();
        if (!subscriber) {
          context.subscribers.splice(i2, 1);
          continue;
        }
        subscriber(value3, unsubscribe);
      }
    }
  }
  // PRIVATE API ---------------------------------------------------------------
  #model;
  #view;
  #update;
  #vdom;
  #events;
  #reconciler;
  #contexts = /* @__PURE__ */ new Map();
  #shouldQueue = false;
  #queue = [];
  #beforePaint = empty_list;
  #afterPaint = empty_list;
  #renderTimer = null;
  #shouldFlush = false;
  #actions = {
    dispatch: (msg, immediate2) => this.dispatch(msg, immediate2),
    emit: (event4, data2) => this.emit(event4, data2),
    select: () => {
    },
    root: () => this.root,
    provide: (key3, value3) => this.provide(key3, value3)
  };
  // A `#tick` is where we process effects and trigger any synchronous updates.
  // Once a tick has been processed a render will be scheduled if none is already.
  // p0
  #tick(effects) {
    this.#shouldQueue = true;
    while (true) {
      for (let list5 = effects.synchronous; list5.tail; list5 = list5.tail) {
        list5.head(this.#actions);
      }
      this.#beforePaint = listAppend(this.#beforePaint, effects.before_paint);
      this.#afterPaint = listAppend(this.#afterPaint, effects.after_paint);
      if (!this.#queue.length) break;
      [this.#model, effects] = this.#update(this.#model, this.#queue.shift());
    }
    this.#shouldQueue = false;
    if (this.#shouldFlush) {
      cancelAnimationFrame(this.#renderTimer);
      this.#render();
    } else if (!this.#renderTimer) {
      this.#renderTimer = requestAnimationFrame(() => {
        this.#render();
      });
    }
  }
  #render() {
    this.#shouldFlush = false;
    this.#renderTimer = null;
    const next2 = this.#view(this.#model);
    const { patch, events } = diff(this.#events, this.#vdom, next2);
    this.#events = events;
    this.#vdom = next2;
    this.#reconciler.push(patch);
    if (this.#beforePaint instanceof NonEmpty) {
      const effects = makeEffect(this.#beforePaint);
      this.#beforePaint = empty_list;
      queueMicrotask(() => {
        this.#shouldFlush = true;
        this.#tick(effects);
      });
    }
    if (this.#afterPaint instanceof NonEmpty) {
      const effects = makeEffect(this.#afterPaint);
      this.#afterPaint = empty_list;
      requestAnimationFrame(() => {
        this.#shouldFlush = true;
        this.#tick(effects);
      });
    }
  }
};
function makeEffect(synchronous) {
  return {
    synchronous,
    after_paint: empty_list,
    before_paint: empty_list
  };
}
function listAppend(a2, b) {
  if (a2 instanceof Empty) {
    return b;
  } else if (b instanceof Empty) {
    return a2;
  } else {
    return append(a2, b);
  }
}
var copiedStyleSheets = /* @__PURE__ */ new WeakMap();
async function adoptStylesheets(shadowRoot2) {
  const pendingParentStylesheets = [];
  for (const node of document2().querySelectorAll(
    "link[rel=stylesheet], style"
  )) {
    if (node.sheet) continue;
    pendingParentStylesheets.push(
      new Promise((resolve2, reject) => {
        node.addEventListener("load", resolve2);
        node.addEventListener("error", reject);
      })
    );
  }
  await Promise.allSettled(pendingParentStylesheets);
  if (!shadowRoot2.host.isConnected) {
    return [];
  }
  shadowRoot2.adoptedStyleSheets = shadowRoot2.host.getRootNode().adoptedStyleSheets;
  const pending = [];
  for (const sheet of document2().styleSheets) {
    try {
      shadowRoot2.adoptedStyleSheets.push(sheet);
    } catch {
      try {
        let copiedSheet = copiedStyleSheets.get(sheet);
        if (!copiedSheet) {
          copiedSheet = new CSSStyleSheet();
          for (const rule of sheet.cssRules) {
            copiedSheet.insertRule(rule.cssText, copiedSheet.cssRules.length);
          }
          copiedStyleSheets.set(sheet, copiedSheet);
        }
        shadowRoot2.adoptedStyleSheets.push(copiedSheet);
      } catch {
        const node = sheet.ownerNode.cloneNode();
        shadowRoot2.prepend(node);
        pending.push(node);
      }
    }
  }
  return pending;
}
var ContextRequestEvent = class extends Event {
  constructor(context, callback, subscribe) {
    super("context-request", { bubbles: true, composed: true });
    this.context = context;
    this.callback = callback;
    this.subscribe = subscribe;
  }
};

// build/dev/javascript/lustre/lustre/runtime/server/runtime.mjs
var EffectDispatchedMessage = class extends CustomType {
  constructor(message2) {
    super();
    this.message = message2;
  }
};
var EffectEmitEvent = class extends CustomType {
  constructor(name2, data2) {
    super();
    this.name = name2;
    this.data = data2;
  }
};
var SystemRequestedShutdown = class extends CustomType {
};

// build/dev/javascript/lustre/lustre/runtime/client/component.ffi.mjs
var make_component = ({ init: init12, update: update12, view: view15, config }, name2) => {
  if (!is_browser()) return new Error2(new NotABrowser());
  if (!name2.includes("-")) return new Error2(new BadComponentName(name2));
  if (customElements.get(name2)) {
    return new Error2(new ComponentAlreadyRegistered(name2));
  }
  const attributes = /* @__PURE__ */ new Map();
  const observedAttributes = [];
  for (let attr = config.attributes; attr.tail; attr = attr.tail) {
    const [name3, decoder2] = attr.head;
    if (attributes.has(name3)) continue;
    attributes.set(name3, decoder2);
    observedAttributes.push(name3);
  }
  const [model, effects] = init12(void 0);
  const component2 = class Component extends HTMLElement {
    static get observedAttributes() {
      return observedAttributes;
    }
    static formAssociated = config.is_form_associated;
    #runtime;
    #adoptedStyleNodes = [];
    #shadowRoot;
    #contextSubscriptions = /* @__PURE__ */ new Map();
    constructor() {
      super();
      this.internals = this.attachInternals();
      if (!this.internals.shadowRoot) {
        this.#shadowRoot = this.attachShadow({
          mode: config.open_shadow_root ? "open" : "closed",
          delegatesFocus: config.delegates_focus
        });
      } else {
        this.#shadowRoot = this.internals.shadowRoot;
      }
      if (config.adopt_styles) {
        this.#adoptStyleSheets();
      }
      this.#runtime = new Runtime(
        this.#shadowRoot,
        [model, effects],
        view15,
        update12
      );
    }
    // CUSTOM ELEMENT LIFECYCLE METHODS ----------------------------------------
    connectedCallback() {
      const requested = /* @__PURE__ */ new Set();
      for (let ctx = config.contexts; ctx.tail; ctx = ctx.tail) {
        const [key3, decoder2] = ctx.head;
        if (!key3) continue;
        if (requested.has(key3)) continue;
        this.dispatchEvent(
          new ContextRequestEvent(
            key3,
            (value3, unsubscribe) => {
              const previousUnsubscribe = this.#contextSubscriptions.get(key3);
              if (previousUnsubscribe !== unsubscribe) {
                previousUnsubscribe?.();
              }
              const decoded = run(value3, decoder2);
              this.#contextSubscriptions.set(key3, unsubscribe);
              if (decoded.isOk()) {
                this.dispatch(decoded[0]);
              }
            },
            true
          )
        );
        requested.add(key3);
      }
    }
    adoptedCallback() {
      if (config.adopt_styles) {
        this.#adoptStyleSheets();
      }
    }
    attributeChangedCallback(name3, _, value3) {
      const decoded = attributes.get(name3)(value3 ?? "");
      if (decoded.isOk()) {
        this.dispatch(decoded[0]);
      }
    }
    formResetCallback() {
      if (config.on_form_reset instanceof Some) {
        this.dispatch(config.on_form_reset[0]);
      }
    }
    formStateRestoreCallback(state, reason) {
      switch (reason) {
        case "restore":
          if (config.on_form_restore instanceof Some) {
            this.dispatch(config.on_form_restore[0](state));
          }
          break;
        case "autocomplete":
          if (config.on_form_populate instanceof Some) {
            this.dispatch(config.on_form_autofill[0](state));
          }
          break;
      }
    }
    disconnectedCallback() {
      for (const [_, unsubscribe] of this.#contextSubscriptions) {
        unsubscribe?.();
      }
      this.#contextSubscriptions.clear();
    }
    // LUSTRE RUNTIME METHODS --------------------------------------------------
    send(message2) {
      switch (message2.constructor) {
        case EffectDispatchedMessage: {
          this.dispatch(message2.message, false);
          break;
        }
        case EffectEmitEvent: {
          this.emit(message2.name, message2.data);
          break;
        }
        case SystemRequestedShutdown:
          break;
      }
    }
    dispatch(msg, immediate2 = false) {
      this.#runtime.dispatch(msg, immediate2);
    }
    emit(event4, data2) {
      this.#runtime.emit(event4, data2);
    }
    provide(key3, value3) {
      this.#runtime.provide(key3, value3);
    }
    async #adoptStyleSheets() {
      while (this.#adoptedStyleNodes.length) {
        this.#adoptedStyleNodes.pop().remove();
        this.shadowRoot.firstChild.remove();
      }
      this.#adoptedStyleNodes = await adoptStylesheets(this.#shadowRoot);
    }
  };
  for (let prop = config.properties; prop.tail; prop = prop.tail) {
    const [name3, decoder2] = prop.head;
    if (Object.hasOwn(component2.prototype, name3)) {
      continue;
    }
    Object.defineProperty(component2.prototype, name3, {
      get() {
        return this[`_${name3}`];
      },
      set(value3) {
        this[`_${name3}`] = value3;
        const decoded = run(value3, decoder2);
        if (decoded.constructor === Ok) {
          this.dispatch(decoded[0]);
        }
      }
    });
  }
  customElements.define(name2, component2);
  return new Ok(void 0);
};

// build/dev/javascript/lustre/lustre/component.mjs
var Config2 = class extends CustomType {
  constructor(open_shadow_root2, adopt_styles, delegates_focus, attributes, properties, contexts, is_form_associated, on_form_autofill, on_form_reset, on_form_restore) {
    super();
    this.open_shadow_root = open_shadow_root2;
    this.adopt_styles = adopt_styles;
    this.delegates_focus = delegates_focus;
    this.attributes = attributes;
    this.properties = properties;
    this.contexts = contexts;
    this.is_form_associated = is_form_associated;
    this.on_form_autofill = on_form_autofill;
    this.on_form_reset = on_form_reset;
    this.on_form_restore = on_form_restore;
  }
};
var Option = class extends CustomType {
  constructor(apply) {
    super();
    this.apply = apply;
  }
};
function new$7(options) {
  let init12 = new Config2(
    true,
    true,
    false,
    empty_list,
    empty_list,
    empty_list,
    false,
    option_none,
    option_none,
    option_none
  );
  return fold(
    options,
    init12,
    (config, option) => {
      return option.apply(config);
    }
  );
}
function on_attribute_change(name2, decoder2) {
  return new Option(
    (config) => {
      let attributes = prepend([name2, decoder2], config.attributes);
      return new Config2(
        config.open_shadow_root,
        config.adopt_styles,
        config.delegates_focus,
        attributes,
        config.properties,
        config.contexts,
        config.is_form_associated,
        config.on_form_autofill,
        config.on_form_reset,
        config.on_form_restore
      );
    }
  );
}
function on_property_change(name2, decoder2) {
  return new Option(
    (config) => {
      let properties = prepend([name2, decoder2], config.properties);
      return new Config2(
        config.open_shadow_root,
        config.adopt_styles,
        config.delegates_focus,
        config.attributes,
        properties,
        config.contexts,
        config.is_form_associated,
        config.on_form_autofill,
        config.on_form_reset,
        config.on_form_restore
      );
    }
  );
}
function open_shadow_root(open2) {
  return new Option(
    (config) => {
      return new Config2(
        open2,
        config.adopt_styles,
        config.delegates_focus,
        config.attributes,
        config.properties,
        config.contexts,
        config.is_form_associated,
        config.on_form_autofill,
        config.on_form_reset,
        config.on_form_restore
      );
    }
  );
}

// build/dev/javascript/lustre/lustre/runtime/client/spa.ffi.mjs
var Spa = class {
  #runtime;
  constructor(root3, [init12, effects], update12, view15) {
    this.#runtime = new Runtime(root3, [init12, effects], view15, update12);
  }
  send(message2) {
    switch (message2.constructor) {
      case EffectDispatchedMessage: {
        this.dispatch(message2.message, false);
        break;
      }
      case EffectEmitEvent: {
        this.emit(message2.name, message2.data);
        break;
      }
      case SystemRequestedShutdown:
        break;
    }
  }
  dispatch(msg, immediate2) {
    this.#runtime.dispatch(msg, immediate2);
  }
  emit(event4, data2) {
    this.#runtime.emit(event4, data2);
  }
};
var start = ({ init: init12, update: update12, view: view15 }, selector, flags) => {
  if (!is_browser()) return new Error2(new NotABrowser());
  const root3 = selector instanceof HTMLElement ? selector : document2().querySelector(selector);
  if (!root3) return new Error2(new ElementNotFound(selector));
  return new Ok(new Spa(root3, init12(flags), update12, view15));
};

// build/dev/javascript/lustre/lustre.mjs
var App = class extends CustomType {
  constructor(init12, update12, view15, config) {
    super();
    this.init = init12;
    this.update = update12;
    this.view = view15;
    this.config = config;
  }
};
var BadComponentName = class extends CustomType {
  constructor(name2) {
    super();
    this.name = name2;
  }
};
var ComponentAlreadyRegistered = class extends CustomType {
  constructor(name2) {
    super();
    this.name = name2;
  }
};
var ElementNotFound = class extends CustomType {
  constructor(selector) {
    super();
    this.selector = selector;
  }
};
var NotABrowser = class extends CustomType {
};
function component(init12, update12, view15, options) {
  return new App(init12, update12, view15, new$7(options));
}
function application(init12, update12, view15) {
  return new App(init12, update12, view15, new$7(empty_list));
}
function start3(app, selector, start_args) {
  return guard(
    !is_browser(),
    new Error2(new NotABrowser()),
    () => {
      return start(app, selector, start_args);
    }
  );
}

// build/dev/javascript/modem/modem.ffi.mjs
var defaults = {
  handle_external_links: false,
  handle_internal_links: true
};
var initial_location = globalThis?.window?.location?.href;
var do_initial_uri = () => {
  if (!initial_location) {
    return new Error2(void 0);
  } else {
    return new Ok(uri_from_url(new URL(initial_location)));
  }
};
var do_init = (dispatch, options = defaults) => {
  document.addEventListener("click", (event4) => {
    const a2 = find_anchor(event4.target);
    if (!a2) return;
    try {
      const url = new URL(a2.href);
      const uri = uri_from_url(url);
      const is_external = url.host !== window.location.host;
      if (!options.handle_external_links && is_external) return;
      if (!options.handle_internal_links && !is_external) return;
      event4.preventDefault();
      if (!is_external) {
        window.history.pushState({}, "", a2.href);
        window.requestAnimationFrame(() => {
          if (url.hash) {
            document.getElementById(url.hash.slice(1))?.scrollIntoView();
          } else {
            window.scrollTo(0, 0);
          }
        });
      }
      return dispatch(uri);
    } catch {
      return;
    }
  });
  document.addEventListener("component-click", (event4) => {
    const a2 = find_anchor(event4.detail.clickEvent.target);
    if (!a2) return;
    try {
      const url = new URL(a2.href);
      const uri = uri_from_url(url);
      const is_external = url.host !== window.location.host;
      if (!options.handle_external_links && is_external) return;
      if (!options.handle_internal_links && !is_external) return;
      if (!is_external) {
        window.history.pushState({}, "", a2.href);
        window.requestAnimationFrame(() => {
          if (url.hash) {
            document.getElementById(url.hash.slice(1))?.scrollIntoView();
          } else {
            window.scrollTo(0, 0);
          }
        });
      }
      return dispatch(uri);
    } catch {
      return;
    }
  });
  window.addEventListener("popstate", (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    const uri = uri_from_url(url);
    window.requestAnimationFrame(() => {
      if (url.hash) {
        document.getElementById(url.hash.slice(1))?.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
    dispatch(uri);
  });
  window.addEventListener("modem-push", ({ detail }) => {
    dispatch(detail);
  });
  window.addEventListener("modem-replace", ({ detail }) => {
    dispatch(detail);
  });
};
var do_push = (uri) => {
  window.history.pushState({}, "", to_string3(uri));
  window.requestAnimationFrame(() => {
    if (uri.fragment[0]) {
      document.getElementById(uri.fragment[0])?.scrollIntoView();
    }
  });
  window.dispatchEvent(new CustomEvent("modem-push", { detail: uri }));
};
var do_load = (uri) => {
  window.location = to_string3(uri);
};
var find_anchor = (el) => {
  if (!el || el.tagName === "BODY") {
    return null;
  } else if (el.tagName === "A") {
    return el;
  } else {
    return find_anchor(el.parentElement);
  }
};
var uri_from_url = (url) => {
  return new Uri(
    /* scheme   */
    url.protocol ? new Some(url.protocol.slice(0, -1)) : new None(),
    /* userinfo */
    new None(),
    /* host     */
    url.hostname ? new Some(url.hostname) : new None(),
    /* port     */
    url.port ? new Some(Number(url.port)) : new None(),
    /* path     */
    url.pathname,
    /* query    */
    url.search ? new Some(url.search.slice(1)) : new None(),
    /* fragment */
    url.hash ? new Some(url.hash.slice(1)) : new None()
  );
};

// build/dev/javascript/modem/modem.mjs
function init(handler) {
  return from(
    (dispatch) => {
      return guard(
        !is_browser(),
        void 0,
        () => {
          return do_init(
            (uri) => {
              let _pipe = uri;
              let _pipe$1 = handler(_pipe);
              return dispatch(_pipe$1);
            }
          );
        }
      );
    }
  );
}
function load(uri) {
  return from(
    (_) => {
      return guard(
        !is_browser(),
        void 0,
        () => {
          return do_load(uri);
        }
      );
    }
  );
}
var relative = /* @__PURE__ */ new Uri(
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None(),
  "",
  /* @__PURE__ */ new None(),
  /* @__PURE__ */ new None()
);
function push(path, query2, fragment3) {
  return from(
    (_) => {
      return guard(
        !is_browser(),
        void 0,
        () => {
          return do_push(
            new Uri(
              relative.scheme,
              relative.userinfo,
              relative.host,
              relative.port,
              path,
              query2,
              fragment3
            )
          );
        }
      );
    }
  );
}

// build/dev/javascript/gleam_javascript/gleam_javascript_ffi.mjs
function length3(thing) {
  return thing.length;
}
function reduceRight(thing, acc, fn) {
  return thing.reduceRight(fn, acc);
}
function index4(thing, index5) {
  return index5 in thing ? new Ok(thing[index5]) : new Error2(void 0);
}
var PromiseLayer = class _PromiseLayer {
  constructor(promise) {
    this.promise = promise;
  }
  static wrap(value3) {
    return value3 instanceof Promise ? new _PromiseLayer(value3) : value3;
  }
  static unwrap(value3) {
    return value3 instanceof _PromiseLayer ? value3.promise : value3;
  }
};
function resolve(value3) {
  return Promise.resolve(PromiseLayer.wrap(value3));
}
function then_await(promise, fn) {
  return promise.then((value3) => fn(PromiseLayer.unwrap(value3)));
}
function map_promise(promise, fn) {
  return promise.then(
    (value3) => PromiseLayer.wrap(fn(PromiseLayer.unwrap(value3)))
  );
}

// build/dev/javascript/gleam_javascript/gleam/javascript/array.mjs
function to_list(items) {
  return reduceRight(
    items,
    toList([]),
    (list5, item) => {
      return prepend(item, list5);
    }
  );
}

// build/dev/javascript/gleam_javascript/gleam/javascript/promise.mjs
function tap(promise, callback) {
  let _pipe = promise;
  return map_promise(
    _pipe,
    (a2) => {
      callback(a2);
      return a2;
    }
  );
}
function try_await(promise, callback) {
  let _pipe = promise;
  return then_await(
    _pipe,
    (result) => {
      if (result instanceof Ok) {
        let a2 = result[0];
        return callback(a2);
      } else {
        let e = result[0];
        return resolve(new Error2(e));
      }
    }
  );
}

// build/dev/javascript/plinth/document_ffi.mjs
function getElementsByTagName(tagName) {
  return Array.from(document.getElementsByTagName(tagName));
}

// build/dev/javascript/plinth/window_ffi.mjs
function self2() {
  return globalThis;
}
function alert(message2) {
  window.alert(message2);
}
function prompt(message2, defaultValue) {
  let text3 = window.prompt(message2, defaultValue);
  if (text3 !== null) {
    return new Ok(text3);
  } else {
    return new Error2();
  }
}
function addEventListener4(type, listener) {
  return window.addEventListener(type, listener);
}
function document3(window2) {
  return window2.document;
}
async function requestWakeLock() {
  try {
    return new Ok(await window.navigator.wakeLock.request("screen"));
  } catch (error) {
    return new Error2(error.toString());
  }
}
function location2() {
  return window.location.href;
}
function locationOf(w) {
  try {
    return new Ok(w.location.href);
  } catch (error) {
    return new Error2(error.toString());
  }
}
function setLocation(w, url) {
  w.location.href = url;
}
function origin2() {
  return window.location.origin;
}
function pathname() {
  return window.location.pathname;
}
function reload() {
  return window.location.reload();
}
function reloadOf(w) {
  return w.location.reload();
}
function focus2(w) {
  return w.focus();
}
function getHash2() {
  const hash2 = window.location.hash;
  if (hash2 == "") {
    return new Error2();
  }
  return new Ok(decodeURIComponent(hash2.slice(1)));
}
function getSearch() {
  const search2 = window.location.search;
  if (search2 == "") {
    return new Error2();
  }
  return new Ok(decodeURIComponent(search2.slice(1)));
}
function innerHeight(w) {
  return w.innerHeight;
}
function innerWidth(w) {
  return w.innerWidth;
}
function outerHeight(w) {
  return w.outerHeight;
}
function outerWidth(w) {
  return w.outerWidth;
}
function screenX(w) {
  return w.screenX;
}
function screenY(w) {
  return w.screenY;
}
function screenTop(w) {
  return w.screenTop;
}
function screenLeft(w) {
  return w.screenLeft;
}
function scrollX(w) {
  return w.scrollX;
}
function scrollY(w) {
  return w.scrollY;
}
function open(url, target3, features) {
  try {
    return new Ok(window.open(url, target3, features));
  } catch (error) {
    return new Error2(error.toString());
  }
}
function close(w) {
  w.close();
}
function closed(w) {
  return w.closed;
}
function queueMicrotask2(callback) {
  return window.queueMicrotask(callback);
}
function requestAnimationFrame2(callback) {
  return window.requestAnimationFrame(callback);
}
function cancelAnimationFrame2(callback) {
  return window.cancelAnimationFrame(callback);
}
function eval_(string) {
  try {
    return new Ok(eval(string));
  } catch (error) {
    return new Error2(error.toString());
  }
}
async function import_(string6) {
  try {
    return new Ok(await import(string6));
  } catch (error) {
    return new Error2(error.toString());
  }
}

// build/dev/javascript/plinth/date_ffi.mjs
function now() {
  return /* @__PURE__ */ new Date();
}
function new_(string6) {
  return new Date(string6);
}
function getTime(d) {
  return Math.floor(d.getTime());
}

// build/dev/javascript/plinth/global_ffi.mjs
function setTimeout3(delay, callback) {
  return globalThis.setTimeout(callback, delay);
}

// build/dev/javascript/plinth/storage_ffi.mjs
function localStorage2() {
  try {
    if (globalThis.Storage && globalThis.localStorage instanceof globalThis.Storage) {
      return new Ok(globalThis.localStorage);
    } else {
      return new Error2(null);
    }
  } catch {
    return new Error2(null);
  }
}
function getItem(storage, keyName) {
  return null_or(storage.getItem(keyName));
}
function setItem(storage, keyName, keyValue) {
  try {
    storage.setItem(keyName, keyValue);
    return new Ok(null);
  } catch {
    return new Error2(null);
  }
}
function null_or(val) {
  if (val !== null) {
    return new Ok(val);
  } else {
    return new Error2(null);
  }
}

// build/dev/javascript/varasto/varasto.mjs
var NotFound = class extends CustomType {
};
var DecodeError2 = class extends CustomType {
  constructor(err) {
    super();
    this.err = err;
  }
};
var TypedStorage = class extends CustomType {
  constructor(raw_storage, reader, writer) {
    super();
    this.raw_storage = raw_storage;
    this.reader = reader;
    this.writer = writer;
  }
};
function new$8(raw_storage, reader, writer) {
  return new TypedStorage(raw_storage, reader, writer);
}
function get2(storage, key3) {
  return try$(
    (() => {
      let _pipe = getItem(storage.raw_storage, key3);
      return replace_error(_pipe, new NotFound());
    })(),
    (str) => {
      let _pipe = parse2(str, storage.reader);
      return map_error(
        _pipe,
        (var0) => {
          return new DecodeError2(var0);
        }
      );
    }
  );
}
function set(storage, key3, value3) {
  let _block;
  let _pipe = value3;
  let _pipe$1 = storage.writer(_pipe);
  _block = to_string4(_pipe$1);
  let encoded = _block;
  return setItem(storage.raw_storage, key3, encoded);
}

// build/dev/javascript/somachord/player.ffi.mjs
var Player = class {
  constructor() {
    this.ctx = new AudioContext();
    this.element = new Audio();
    this.element.crossOrigin = true;
    this.retryTime = 0;
    this.element.addEventListener("error", (event4) => {
      this.retryTime = Math.min(Math.max(this.retryTime + 1e3, 0), 14e3);
      console.log("retrying in " + this.retryTime);
      setTimeout(() => {
        let time3 = this.element.currentTime;
        let paused = this.element.paused;
        load_song(this, this.element.currentSrc, this.current);
        this.element.currentTime = time3;
        if (!paused) {
          this.element.play();
        }
      }, this.retryTime);
    });
    this.node = this.ctx.createMediaElementSource(this.element);
    this.node.connect(this.ctx.destination);
    this.current = null;
  }
};
function new_2() {
  return new Player();
}
function listen_events(player, listener) {
  player.element.addEventListener("playing", () => {
    listener(player, "loaded");
    updatePresence(player);
  });
  player.element.addEventListener("timeupdate", () => {
    listener(player, "time");
  });
  player.element.addEventListener("ended", () => {
    listener(player, "ended");
  });
  navigator.mediaSession.setActionHandler("previoustrack", () => {
    if (player.element.currentTime > 5) {
      beginning(player);
    } else {
      listener(player, "previous");
    }
  });
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    listener(player, "next");
  });
}
function is_paused(player) {
  return player.element.paused;
}
function current(player) {
  return player.current;
}
function time(player) {
  return player.element.currentTime;
}
function coverURL(player) {
  let info = player.current;
  let link = player.element.src;
  let auth = JSON.parse(localStorage.getItem("auth")).auth;
  return `${URL.parse(link).origin}/rest/getCoverArt.view?f=json&u=${auth.username}&s=${auth.salt}&t=${auth.token}&c=somachord&v=1.16.0&id=${info.cover_art_id}&size=500`;
}
function load_song(player, link, info) {
  player.element.src = link;
  if (player.ctx.state == "suspended") {
    player.ctx.resume();
  }
  player.current = info;
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: info.title,
      artist: info.artists.toArray().map((artist2) => artist2.name).join(", "),
      album: info.album_name,
      artwork: [{
        src: coverURL(player)
      }]
    });
  }
}
function updatePresence(player) {
  let info = player.current;
  if (!info) {
    return;
  }
  if (window.electronAPI) {
    window.electronAPI.updatePresence({
      details: info.title,
      state: info.artists.toArray().map((artist2) => artist2.name).join(", "),
      largeImageKey: coverURL(player),
      largeImageText: info.album_name,
      startTimestamp: player.element.paused ? Date.now() : new Date(Date.now() - player.element.currentTime * 1e3),
      endTimestamp: player.element.paused ? Date.now() : new Date(Date.now() + info.duration * 1e3 - player.element.currentTime * 1e3),
      smallImageKey: player.element.paused ? "https://cdn-icons-png.flaticon.com/512/9195/9195053.png" : null,
      smallImageText: player.element.paused ? "Paused" : null
    });
  }
}
function pause_play(player) {
  if (player.element.paused) {
    player.element.play();
  } else {
    player.element.pause();
  }
  updatePresence(player);
}
function seek(player, amount) {
  player.element.currentTime = amount;
  updatePresence(player);
}
function beginning(player) {
  player.element.currentTime = 0;
  updatePresence(player);
}
function loop(player, state) {
  player.element.loop = state;
}

// build/dev/javascript/somachord/somachord/api/models.mjs
var Artist = class extends CustomType {
  constructor(id3, name2, cover_art_id, albums) {
    super();
    this.id = id3;
    this.name = name2;
    this.cover_art_id = cover_art_id;
    this.albums = albums;
  }
};
var SmallArtist = class extends CustomType {
  constructor(id3, name2) {
    super();
    this.id = id3;
    this.name = name2;
  }
};
var Album = class extends CustomType {
  constructor(id3, name2, artists2, cover_art_id, duration, plays, created, year2, genres, songs, release_types) {
    super();
    this.id = id3;
    this.name = name2;
    this.artists = artists2;
    this.cover_art_id = cover_art_id;
    this.duration = duration;
    this.plays = plays;
    this.created = created;
    this.year = year2;
    this.genres = genres;
    this.songs = songs;
    this.release_types = release_types;
  }
};
var Single = class extends CustomType {
};
var EP = class extends CustomType {
};
var AlbumRelease = class extends CustomType {
};
var Other = class extends CustomType {
};
var Playlist = class extends CustomType {
  constructor(id3, name2, owner, public$, cover_art_id, created, updated, duration, songs, song_count) {
    super();
    this.id = id3;
    this.name = name2;
    this.owner = owner;
    this.public = public$;
    this.cover_art_id = cover_art_id;
    this.created = created;
    this.updated = updated;
    this.duration = duration;
    this.songs = songs;
    this.song_count = song_count;
  }
};
var Child = class extends CustomType {
  constructor(id3, album_name, album_id, cover_art_id, artists2, duration, title2, track, year2, starred, plays) {
    super();
    this.id = id3;
    this.album_name = album_name;
    this.album_id = album_id;
    this.cover_art_id = cover_art_id;
    this.artists = artists2;
    this.duration = duration;
    this.title = title2;
    this.track = track;
    this.year = year2;
    this.starred = starred;
    this.plays = plays;
  }
};
var LyricSet = class extends CustomType {
  constructor(synced, lang, offset, lines) {
    super();
    this.synced = synced;
    this.lang = lang;
    this.offset = offset;
    this.lines = lines;
  }
};
var Lyric = class extends CustomType {
  constructor(time3, text3) {
    super();
    this.time = time3;
    this.text = text3;
  }
};
function artist_encode(small_artist) {
  let id3;
  let name2;
  id3 = small_artist.id;
  name2 = small_artist.name;
  return object2(
    toList([["id", string4(id3)], ["name", string4(name2)]])
  );
}
function artist_small_decoder() {
  return field(
    "id",
    string3,
    (id3) => {
      return field(
        "name",
        string3,
        (name2) => {
          return success(new SmallArtist(id3, name2));
        }
      );
    }
  );
}
function new_playlist() {
  return new Playlist("", "", "", false, "", "", "", 0, toList([]), 0);
}
function new_song() {
  return new Child("", "", "", "", toList([]), 0, "", 0, 0, false, 0);
}
function song_decoder() {
  return field(
    "id",
    string3,
    (id3) => {
      return field(
        "album",
        string3,
        (album_name) => {
          return then$(
            one_of(
              at(toList(["albumID"]), string3),
              toList([at(toList(["parent"]), string3)])
            ),
            (album_id) => {
              return optional_field(
                "coverArt",
                "",
                string3,
                (cover_art_id) => {
                  return field(
                    "artists",
                    list2(artist_small_decoder()),
                    (artists2) => {
                      return field(
                        "duration",
                        int2,
                        (duration) => {
                          return field(
                            "title",
                            string3,
                            (title2) => {
                              return field(
                                "track",
                                int2,
                                (track) => {
                                  return field(
                                    "year",
                                    int2,
                                    (year2) => {
                                      return optional_field(
                                        "starred",
                                        false,
                                        success(true),
                                        (starred) => {
                                          return optional_field(
                                            "playCount",
                                            0,
                                            int2,
                                            (plays) => {
                                              return success(
                                                new Child(
                                                  id3,
                                                  album_name,
                                                  album_id,
                                                  cover_art_id,
                                                  artists2,
                                                  duration,
                                                  title2,
                                                  track,
                                                  year2,
                                                  starred,
                                                  plays
                                                )
                                              );
                                            }
                                          );
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}
function album_decoder() {
  return field(
    "id",
    string3,
    (id3) => {
      return field(
        "name",
        string3,
        (name2) => {
          return field(
            "artists",
            list2(artist_small_decoder()),
            (artists2) => {
              return optional_field(
                "coverArt",
                "",
                string3,
                (cover_art_id) => {
                  return field(
                    "duration",
                    int2,
                    (duration) => {
                      return field(
                        "playCount",
                        int2,
                        (plays) => {
                          return field(
                            "created",
                            string3,
                            (created) => {
                              return optional_field(
                                "year",
                                0,
                                int2,
                                (year2) => {
                                  return optional_field(
                                    "genres",
                                    toList([]),
                                    list2(
                                      field(
                                        "name",
                                        string3,
                                        (genre) => {
                                          return success(genre);
                                        }
                                      )
                                    ),
                                    (genres) => {
                                      return optional_field(
                                        "song",
                                        toList([]),
                                        list2(song_decoder()),
                                        (songs) => {
                                          return optional_field(
                                            "releaseTypes",
                                            toList([]),
                                            list2(
                                              (() => {
                                                let _pipe = string3;
                                                return map2(
                                                  _pipe,
                                                  (rt) => {
                                                    if (rt === "Single") {
                                                      return new Single();
                                                    } else if (rt === "EP") {
                                                      return new EP();
                                                    } else if (rt === "Album") {
                                                      return new AlbumRelease();
                                                    } else {
                                                      return new Other();
                                                    }
                                                  }
                                                );
                                              })()
                                            ),
                                            (release_types) => {
                                              return success(
                                                new Album(
                                                  id3,
                                                  name2,
                                                  artists2,
                                                  cover_art_id,
                                                  duration,
                                                  plays,
                                                  created,
                                                  year2,
                                                  genres,
                                                  songs,
                                                  release_types
                                                )
                                              );
                                            }
                                          );
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}
function artist_decoder() {
  return field(
    "id",
    string3,
    (id3) => {
      return field(
        "name",
        string3,
        (name2) => {
          return optional_field(
            "coverArt",
            "",
            string3,
            (cover_art_id) => {
              return optional_field(
                "album",
                new None(),
                then$(
                  list2(album_decoder()),
                  (a2) => {
                    return success(new Some(a2));
                  }
                ),
                (albums) => {
                  return success(
                    new Artist(id3, name2, cover_art_id, albums)
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}
function playlist_decoder() {
  return field(
    "id",
    string3,
    (id3) => {
      return field(
        "name",
        string3,
        (name2) => {
          return optional_field(
            "owner",
            "",
            string3,
            (owner) => {
              return optional_field(
                "public",
                false,
                bool,
                (public$) => {
                  return optional_field(
                    "coverArt",
                    "",
                    string3,
                    (cover_art_id) => {
                      return field(
                        "created",
                        string3,
                        (created) => {
                          return field(
                            "changed",
                            string3,
                            (updated) => {
                              return field(
                                "duration",
                                int2,
                                (duration) => {
                                  return optional_field(
                                    "entry",
                                    toList([]),
                                    list2(song_decoder()),
                                    (songs) => {
                                      return optional_field(
                                        "songCount",
                                        0,
                                        int2,
                                        (song_count) => {
                                          return success(
                                            new Playlist(
                                              id3,
                                              name2,
                                              owner,
                                              public$,
                                              cover_art_id,
                                              created,
                                              updated,
                                              duration,
                                              songs,
                                              song_count
                                            )
                                          );
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}
function song_encode(child) {
  let id3;
  let album_name;
  let album_id;
  let cover_art_id;
  let artists2;
  let duration;
  let title2;
  let track;
  let year2;
  let starred;
  let plays;
  id3 = child.id;
  album_name = child.album_name;
  album_id = child.album_id;
  cover_art_id = child.cover_art_id;
  artists2 = child.artists;
  duration = child.duration;
  title2 = child.title;
  track = child.track;
  year2 = child.year;
  starred = child.starred;
  plays = child.plays;
  return object2(
    toList([
      ["id", string4(id3)],
      ["album", string4(album_name)],
      ["albumID", string4(album_id)],
      ["coverArt", string4(cover_art_id)],
      ["artists", array2(artists2, artist_encode)],
      ["duration", int3(duration)],
      ["title", string4(title2)],
      ["track", int3(track)],
      ["year", int3(year2)],
      ["starred", bool2(starred)],
      ["playCount", int3(plays)]
    ])
  );
}
function playlist_encode(playlist3) {
  let id3;
  let name2;
  let owner;
  let public$;
  let cover_art_id;
  let created;
  let updated;
  let duration;
  let songs;
  let song_count;
  id3 = playlist3.id;
  name2 = playlist3.name;
  owner = playlist3.owner;
  public$ = playlist3.public;
  cover_art_id = playlist3.cover_art_id;
  created = playlist3.created;
  updated = playlist3.updated;
  duration = playlist3.duration;
  songs = playlist3.songs;
  song_count = playlist3.song_count;
  return object2(
    toList([
      ["id", string4(id3)],
      ["name", string4(name2)],
      ["owner", string4(owner)],
      ["public", bool2(public$)],
      ["coverArt", string4(cover_art_id)],
      ["created", string4(created)],
      ["changed", string4(created)],
      ["updated", string4(updated)],
      ["duration", int3(duration)],
      ["entry", array2(songs, song_encode)],
      ["songCount", int3(song_count)]
    ])
  );
}
function lyric_decoder() {
  return optional_field(
    "start",
    0,
    int2,
    (time_ms) => {
      let time3 = identity(time_ms) / 1e3;
      return field(
        "value",
        string3,
        (text3) => {
          return success(new Lyric(time3, text3));
        }
      );
    }
  );
}
function lyric_set_decoder() {
  return field(
    "synced",
    bool,
    (synced) => {
      return field(
        "lang",
        string3,
        (lang) => {
          return optional_field(
            "offset",
            0,
            int2,
            (offset_ms) => {
              let _block;
              if (offset_ms === 0) {
                _block = 0;
              } else {
                _block = identity(offset_ms) / 1e3;
              }
              let offset = _block;
              return field(
                "line",
                list2(lyric_decoder()),
                (lines) => {
                  return success(
                    new LyricSet(synced, lang, offset, lines)
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}

// build/dev/javascript/somachord/somachord/models/auth.ffi.mjs
var import_js_md5 = __toESM(require_md5(), 1);
function hash(text3) {
  return (0, import_js_md5.default)(text3);
}
function generate_salt() {
  return Math.random().toString(36).substring(2, 10);
}

// build/dev/javascript/somachord/somachord/models/auth.mjs
var Auth = class extends CustomType {
  constructor(username, credentials, server_url) {
    super();
    this.username = username;
    this.credentials = credentials;
    this.server_url = server_url;
  }
};
var Credentials = class extends CustomType {
  constructor(salt, token) {
    super();
    this.salt = salt;
    this.token = token;
  }
};
function decoder() {
  return field(
    "username",
    string3,
    (username) => {
      return field(
        "salt",
        string3,
        (salt) => {
          return field(
            "token",
            string3,
            (token) => {
              return field(
                "serverURL",
                string3,
                (server_url) => {
                  return success(
                    new Auth(username, new Credentials(salt, token), server_url)
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}
function encoder(auth) {
  return object2(
    toList([
      ["username", string4(auth.username)],
      ["salt", string4(auth.credentials.salt)],
      ["token", string4(auth.credentials.token)],
      ["serverURL", string4(auth.server_url)]
    ])
  );
}
function hash_password(password) {
  let salt = generate_salt();
  let token = hash(password + salt);
  return new Credentials(salt, token);
}

// build/dev/javascript/somachord/somachord/queue.mjs
var FILEPATH = "src/somachord/queue.gleam";
var Queue = class extends CustomType {
  constructor(song_position, songs, song_order, position, changed) {
    super();
    this.song_position = song_position;
    this.songs = songs;
    this.song_order = song_order;
    this.position = position;
    this.changed = changed;
  }
};
var SongOrder = class extends CustomType {
  constructor(played, unplayed) {
    super();
    this.played = played;
    this.unplayed = unplayed;
  }
};
function empty4() {
  return new Queue(
    0,
    new_map(),
    new SongOrder(toList([]), toList([])),
    0,
    now()
  );
}
function next(queue2) {
  let $ = queue2.song_order.unplayed;
  if ($ instanceof Empty) {
    return queue2;
  } else {
    let front_first = $.head;
    let unplayed_rest = $.tail;
    let updated_played = prepend(front_first, queue2.song_order.played);
    return new Queue(
      queue2.song_position,
      queue2.songs,
      new SongOrder(updated_played, unplayed_rest),
      queue2.position + 1,
      queue2.changed
    );
  }
}
function next_itr(loop$queue, loop$times) {
  while (true) {
    let queue2 = loop$queue;
    let times = loop$times;
    if (times === 0) {
      return queue2;
    } else {
      loop$queue = next(queue2);
      loop$times = times - 1;
    }
  }
}
function previous(queue2) {
  let $ = queue2.song_order.played;
  if ($ instanceof Empty) {
    return queue2;
  } else {
    let played_first = $.head;
    let played_rest = $.tail;
    let updated_unplayed = prepend(played_first, queue2.song_order.unplayed);
    return new Queue(
      queue2.song_position,
      queue2.songs,
      new SongOrder(played_rest, updated_unplayed),
      queue2.position - 1,
      queue2.changed
    );
  }
}
function previous_itr(loop$queue, loop$times) {
  while (true) {
    let queue2 = loop$queue;
    let times = loop$times;
    if (times === 0) {
      return queue2;
    } else {
      loop$queue = previous(queue2);
      loop$times = times - 1;
    }
  }
}
function jump(queue2, position) {
  let $ = compare2(position, queue2.position);
  if ($ instanceof Lt) {
    return previous_itr(queue2, queue2.position - position);
  } else if ($ instanceof Eq) {
    return queue2;
  } else {
    return next_itr(queue2, position - queue2.position);
  }
}
function list4(queue2) {
  return map(
    (() => {
      let _pipe = toList([
        reverse(queue2.song_order.played),
        queue2.song_order.unplayed
      ]);
      return flatten(_pipe);
    })(),
    (idx) => {
      let _block;
      let _pipe = queue2.songs;
      _block = map_get(_pipe, idx);
      let $ = _block;
      let song3;
      if ($ instanceof Ok) {
        song3 = $[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH,
          "somachord/queue",
          149,
          "list",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 3377,
            end: 3427,
            pattern_start: 3388,
            pattern_end: 3396
          }
        );
      }
      return [idx, song3];
    }
  );
}
function new$9(position, songs, song_position) {
  let _block;
  let _pipe = range(0, length(songs) - 1);
  _block = split(_pipe, position);
  let song_order = _block;
  return new Queue(
    song_position,
    (() => {
      let _pipe$1 = songs;
      let _pipe$2 = fold(
        _pipe$1,
        [new_map(), 0],
        (acc, song3) => {
          let d;
          let idx;
          d = acc[0];
          idx = acc[1];
          return [
            (() => {
              let _pipe$22 = d;
              return insert(_pipe$22, idx, song3);
            })(),
            idx + 1
          ];
        }
      );
      return first2(_pipe$2);
    })(),
    new SongOrder(song_order[0], song_order[1]),
    position,
    now()
  );
}
function shuffle2(queue2) {
  let _block;
  let _pipe = range(
    0,
    length(
      (() => {
        let _pipe2 = queue2.songs;
        return values(_pipe2);
      })()
    ) - 1
  );
  let _pipe$1 = shuffle(_pipe);
  _block = split(_pipe$1, queue2.position);
  let song_order = _block;
  return new Queue(
    queue2.song_position,
    queue2.songs,
    new SongOrder(song_order[0], song_order[1]),
    queue2.position,
    queue2.changed
  );
}
function unshuffle(queue2) {
  let _block;
  let _pipe = range(
    0,
    length(
      (() => {
        let _pipe2 = queue2.songs;
        return values(_pipe2);
      })()
    ) - 1
  );
  _block = split(_pipe, queue2.position);
  let song_order = _block;
  return new Queue(
    queue2.song_position,
    queue2.songs,
    new SongOrder(song_order[0], song_order[1]),
    queue2.position,
    queue2.changed
  );
}
function current_song(queue2) {
  let $ = (() => {
    let _pipe = queue2.song_order.unplayed;
    return first(_pipe);
  })();
  if ($ instanceof Ok) {
    let idx = $[0];
    let _block;
    let _pipe = queue2.songs;
    _block = map_get(_pipe, idx);
    let $1 = _block;
    let song3;
    if ($1 instanceof Ok) {
      song3 = $1[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH,
        "somachord/queue",
        137,
        "current_song",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $1,
          start: 3073,
          end: 3123,
          pattern_start: 3084,
          pattern_end: 3092
        }
      );
    }
    return new Some(song3);
  } else {
    return new None();
  }
}

// build/dev/javascript/somachord/electron.ffi.mjs
var import_is_electron = __toESM(require_is_electron(), 1);
function am_i_electron() {
  return (0, import_is_electron.default)();
}

// build/dev/javascript/somachord/somachord/storage.mjs
var FILEPATH2 = "src/somachord/storage.gleam";
var Storage = class extends CustomType {
  constructor(auth) {
    super();
    this.auth = auth;
  }
};
function storage_reader() {
  return field(
    "auth",
    decoder(),
    (auth) => {
      return success(new Storage(auth));
    }
  );
}
function storage_writer(storage) {
  return object2(toList([["auth", encoder(storage.auth)]]));
}
function create() {
  let $ = localStorage2();
  let localstorage;
  if ($ instanceof Ok) {
    localstorage = $[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH2,
      "somachord/storage",
      21,
      "create",
      "Pattern match failed, no pattern matched the value.",
      { value: $, start: 411, end: 456, pattern_start: 422, pattern_end: 438 }
    );
  }
  return new$8(localstorage, storage_reader(), storage_writer);
}

// build/dev/javascript/somachord/somachord/router.mjs
var FILEPATH3 = "src/somachord/router.gleam";
var ChangeRoute = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Home = class extends CustomType {
};
var Login = class extends CustomType {
};
var Search = class extends CustomType {
  constructor(query2) {
    super();
    this.query = query2;
  }
};
var Artist2 = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var Album2 = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var Song = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var Playlist2 = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var Likes = class extends CustomType {
};
var Library = class extends CustomType {
};
var Playlists = class extends CustomType {
};
var Artists = class extends CustomType {
};
var Albums = class extends CustomType {
};
var About = class extends CustomType {
};
var Unknown = class extends CustomType {
};
function uri_to_route(uri) {
  let router = (path) => {
    echo(path, void 0, "src/somachord/router.gleam", 34);
    if (path === "/") {
      return new Home();
    } else if (path === "") {
      return new Home();
    } else if (path === "/login") {
      return new Login();
    } else if (path === "/search") {
      return new Search("");
    } else if (path.startsWith("/search/")) {
      let query2 = path.slice(8);
      let $2 = percent_decode(query2);
      let decoded_query;
      if ($2 instanceof Ok) {
        decoded_query = $2[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH3,
          "somachord/router",
          40,
          "uri_to_route",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 618,
            end: 674,
            pattern_start: 629,
            pattern_end: 646
          }
        );
      }
      return new Search(decoded_query);
    } else if (path === "/artists") {
      return new Artists();
    } else if (path.startsWith("/artist/")) {
      let id3 = path.slice(8);
      return new Artist2(id3);
    } else if (path === "/albums") {
      return new Albums();
    } else if (path.startsWith("/album/")) {
      let id3 = path.slice(7);
      return new Album2(id3);
    } else if (path.startsWith("/song/")) {
      let id3 = path.slice(6);
      return new Song(id3);
    } else if (path.startsWith("/playlist/")) {
      let id3 = path.slice(10);
      return new Playlist2(id3);
    } else if (path === "/playlists/") {
      return new Playlists();
    } else if (path === "/library") {
      return new Library();
    } else if (path === "/likes") {
      return new Likes();
    } else if (path === "/about") {
      return new About();
    } else {
      return new Unknown();
    }
  };
  let $ = am_i_electron();
  if ($) {
    let $1 = uri.fragment;
    if ($1 instanceof Some) {
      let path = $1[0];
      return router(path);
    } else {
      return router("");
    }
  } else {
    return router(uri.path);
  }
}
function direct(root3, rel) {
  let $ = parse(
    (() => {
      let _pipe = root3.path + rel;
      return replace(_pipe, "//", "/");
    })()
  );
  let rel_url;
  if ($ instanceof Ok) {
    rel_url = $[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH3,
      "somachord/router",
      92,
      "direct",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 1790,
        end: 1879,
        pattern_start: 1801,
        pattern_end: 1812
      }
    );
  }
  let $1 = merge(root3, rel_url);
  let direction;
  if ($1 instanceof Ok) {
    direction = $1[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH3,
      "somachord/router",
      94,
      "direct",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $1,
        start: 1882,
        end: 1933,
        pattern_start: 1893,
        pattern_end: 1906
      }
    );
  }
  return to_string3(direction);
}
function get_route() {
  let $ = parse(location2());
  let route;
  if ($ instanceof Ok) {
    route = $[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH3,
      "somachord/router",
      99,
      "get_route",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 1998,
        end: 2049,
        pattern_start: 2009,
        pattern_end: 2018
      }
    );
  }
  return route;
}
function echo(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/dev/javascript/somachord/somachord/model.mjs
var Palette = class extends CustomType {
  constructor(empty6) {
    super();
    this.empty = empty6;
  }
};
var Toast = class extends CustomType {
  constructor(message2, icon) {
    super();
    this.message = message2;
    this.icon = icon;
  }
};
var Model = class extends CustomType {
  constructor(route, online2, layout2, storage, auth, confirmed, albums, player, queue2, current_song2, seeking, seek_amount, played_seconds, shuffled, looping, playlists2, fullscreen_player_open, fullscreen_player_display, current_palette, toast_display) {
    super();
    this.route = route;
    this.online = online2;
    this.layout = layout2;
    this.storage = storage;
    this.auth = auth;
    this.confirmed = confirmed;
    this.albums = albums;
    this.player = player;
    this.queue = queue2;
    this.current_song = current_song2;
    this.seeking = seeking;
    this.seek_amount = seek_amount;
    this.played_seconds = played_seconds;
    this.shuffled = shuffled;
    this.looping = looping;
    this.playlists = playlists2;
    this.fullscreen_player_open = fullscreen_player_open;
    this.fullscreen_player_display = fullscreen_player_display;
    this.current_palette = current_palette;
    this.toast_display = toast_display;
  }
};
var PlayRequest = class extends CustomType {
  constructor(type_2, id3, index5) {
    super();
    this.type_ = type_2;
    this.id = id3;
    this.index = index5;
  }
};
var PlaylistPlayRequest = class extends CustomType {
  constructor(playlist3, index5, shuffle3) {
    super();
    this.playlist = playlist3;
    this.index = index5;
    this.shuffle = shuffle3;
  }
};
var Desktop = class extends CustomType {
};
var Mobile = class extends CustomType {
};
var Default = class extends CustomType {
};
var Lyrics = class extends CustomType {
};

// build/dev/javascript/somachord/player.mjs
function listen_events2(player, listener) {
  return from(
    (dispatch) => {
      return listen_events(
        player,
        (plr, event4) => {
          let _pipe = event4;
          let _pipe$1 = listener(_pipe, plr);
          return dispatch(_pipe$1);
        }
      );
    }
  );
}

// build/dev/javascript/gleam_http/gleam/http.mjs
var Get = class extends CustomType {
};
var Post = class extends CustomType {
};
var Head = class extends CustomType {
};
var Put = class extends CustomType {
};
var Delete = class extends CustomType {
};
var Trace = class extends CustomType {
};
var Connect = class extends CustomType {
};
var Options = class extends CustomType {
};
var Patch2 = class extends CustomType {
};
var Http = class extends CustomType {
};
var Https = class extends CustomType {
};
function method_to_string(method) {
  if (method instanceof Get) {
    return "GET";
  } else if (method instanceof Post) {
    return "POST";
  } else if (method instanceof Head) {
    return "HEAD";
  } else if (method instanceof Put) {
    return "PUT";
  } else if (method instanceof Delete) {
    return "DELETE";
  } else if (method instanceof Trace) {
    return "TRACE";
  } else if (method instanceof Connect) {
    return "CONNECT";
  } else if (method instanceof Options) {
    return "OPTIONS";
  } else if (method instanceof Patch2) {
    return "PATCH";
  } else {
    let s = method[0];
    return s;
  }
}
function scheme_to_string(scheme) {
  if (scheme instanceof Http) {
    return "http";
  } else {
    return "https";
  }
}
function scheme_from_string(scheme) {
  let $ = lowercase(scheme);
  if ($ === "http") {
    return new Ok(new Http());
  } else if ($ === "https") {
    return new Ok(new Https());
  } else {
    return new Error2(void 0);
  }
}

// build/dev/javascript/gleam_http/gleam/http/request.mjs
var Request = class extends CustomType {
  constructor(method, headers, body2, scheme, host, port, path, query2) {
    super();
    this.method = method;
    this.headers = headers;
    this.body = body2;
    this.scheme = scheme;
    this.host = host;
    this.port = port;
    this.path = path;
    this.query = query2;
  }
};
function to_uri(request2) {
  return new Uri(
    new Some(scheme_to_string(request2.scheme)),
    new None(),
    new Some(request2.host),
    request2.port,
    request2.path,
    request2.query,
    new None()
  );
}
function from_uri(uri) {
  return try$(
    (() => {
      let _pipe = uri.scheme;
      let _pipe$1 = unwrap(_pipe, "");
      return scheme_from_string(_pipe$1);
    })(),
    (scheme) => {
      return try$(
        (() => {
          let _pipe = uri.host;
          return to_result(_pipe, void 0);
        })(),
        (host) => {
          let req = new Request(
            new Get(),
            toList([]),
            "",
            scheme,
            host,
            uri.port,
            uri.path,
            uri.query
          );
          return new Ok(req);
        }
      );
    }
  );
}
function to(url) {
  let _pipe = url;
  let _pipe$1 = parse(_pipe);
  return try$(_pipe$1, from_uri);
}

// build/dev/javascript/gleam_http/gleam/http/response.mjs
var Response2 = class extends CustomType {
  constructor(status, headers, body2) {
    super();
    this.status = status;
    this.headers = headers;
    this.body = body2;
  }
};
function get_header(response, key3) {
  return key_find(response.headers, lowercase(key3));
}

// build/dev/javascript/gleam_fetch/gleam_fetch_ffi.mjs
async function raw_send(request2) {
  try {
    return new Ok(await fetch(request2));
  } catch (error) {
    return new Error2(new NetworkError(error.toString()));
  }
}
function from_fetch_response(response) {
  return new Response2(
    response.status,
    List.fromArray([...response.headers]),
    response
  );
}
function request_common(request2) {
  let url = to_string3(to_uri(request2));
  let method = method_to_string(request2.method).toUpperCase();
  let options = {
    headers: make_headers(request2.headers),
    method
  };
  return [url, options];
}
function to_fetch_request(request2) {
  let [url, options] = request_common(request2);
  if (options.method !== "GET" && options.method !== "HEAD") options.body = request2.body;
  return new globalThis.Request(url, options);
}
function make_headers(headersList) {
  let headers = new globalThis.Headers();
  for (let [k, v] of headersList) headers.append(k.toLowerCase(), v);
  return headers;
}
async function read_text_body(response) {
  let body2;
  try {
    body2 = await response.body.text();
  } catch (error) {
    return new Error2(new UnableToReadBody());
  }
  return new Ok(response.withFields({ body: body2 }));
}

// build/dev/javascript/gleam_fetch/gleam/fetch.mjs
var NetworkError = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var UnableToReadBody = class extends CustomType {
};
function send2(request2) {
  let _pipe = request2;
  let _pipe$1 = to_fetch_request(_pipe);
  let _pipe$2 = raw_send(_pipe$1);
  return try_await(
    _pipe$2,
    (resp) => {
      return resolve(new Ok(from_fetch_response(resp)));
    }
  );
}

// build/dev/javascript/rsvp/rsvp.mjs
var BadBody = class extends CustomType {
};
var HttpError = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var JsonError = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var NetworkError2 = class extends CustomType {
};
var UnhandledResponse = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Handler2 = class extends CustomType {
  constructor(run3) {
    super();
    this.run = run3;
  }
};
function expect_ok_response(handler) {
  return new Handler2(
    (result) => {
      return handler(
        try$(
          result,
          (response) => {
            let $ = response.status;
            let code2 = $;
            if (code2 >= 200 && code2 < 300) {
              return new Ok(response);
            } else {
              let code$1 = $;
              if (code$1 >= 400 && code$1 < 600) {
                return new Error2(new HttpError(response));
              } else {
                return new Error2(new UnhandledResponse(response));
              }
            }
          }
        )
      );
    }
  );
}
function expect_json_response(handler) {
  return expect_ok_response(
    (result) => {
      return handler(
        try$(
          result,
          (response) => {
            let $ = get_header(response, "content-type");
            if ($ instanceof Ok) {
              let $1 = $[0];
              if ($1 === "application/json") {
                return new Ok(response);
              } else if ($1.startsWith("application/json;")) {
                return new Ok(response);
              } else {
                return new Error2(new UnhandledResponse(response));
              }
            } else {
              return new Error2(new UnhandledResponse(response));
            }
          }
        )
      );
    }
  );
}
function do_send(request2, handler) {
  return from(
    (dispatch) => {
      let _pipe = send2(request2);
      let _pipe$1 = try_await(_pipe, read_text_body);
      let _pipe$2 = map_promise(
        _pipe$1,
        (_capture) => {
          return map_error(
            _capture,
            (error) => {
              if (error instanceof NetworkError) {
                return new NetworkError2();
              } else if (error instanceof UnableToReadBody) {
                return new BadBody();
              } else {
                return new BadBody();
              }
            }
          );
        }
      );
      let _pipe$3 = map_promise(_pipe$2, handler.run);
      tap(_pipe$3, dispatch);
      return void 0;
    }
  );
}
function send3(request2, handler) {
  return do_send(request2, handler);
}
function decode_json_body(response, decoder2) {
  let _pipe = response.body;
  let _pipe$1 = parse2(_pipe, decoder2);
  return map_error(_pipe$1, (var0) => {
    return new JsonError(var0);
  });
}
function expect_json(decoder2, handler) {
  return expect_json_response(
    (result) => {
      let _pipe = result;
      let _pipe$1 = try$(
        _pipe,
        (_capture) => {
          return decode_json_body(_capture, decoder2);
        }
      );
      return handler(_pipe$1);
    }
  );
}

// build/dev/javascript/somachord/somachord/api/api.mjs
var FILEPATH4 = "src/somachord/api/api.gleam";
var WrongCredentials = class extends CustomType {
  constructor(message2) {
    super();
    this.message = message2;
  }
};
var NotFound2 = class extends CustomType {
};
var SubsonicError = class extends CustomType {
  constructor(code2, message2) {
    super();
    this.code = code2;
    this.message = message2;
  }
};
var AlbumList = class extends CustomType {
  constructor(type_2, albums) {
    super();
    this.type_ = type_2;
    this.albums = albums;
  }
};
var Search2 = class extends CustomType {
  constructor($0, $1) {
    super();
    this[0] = $0;
    this[1] = $1;
  }
};
function create_uri(auth_details, path, query2) {
  let _block;
  let _pipe = auth_details.server_url;
  _block = parse(_pipe);
  let $ = _block;
  let root3;
  if ($ instanceof Ok) {
    root3 = $[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH4,
      "somachord/api/api",
      44,
      "create_uri",
      "Pattern match failed, no pattern matched the value.",
      { value: $, start: 936, end: 994, pattern_start: 947, pattern_end: 955 }
    );
  }
  let $1 = parse(direct(root3, path));
  let original_uri;
  if ($1 instanceof Ok) {
    original_uri = $1[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH4,
      "somachord/api/api",
      45,
      "create_uri",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $1,
        start: 997,
        end: 1063,
        pattern_start: 1008,
        pattern_end: 1024
      }
    );
  }
  let _pipe$1 = new Uri(
    original_uri.scheme,
    original_uri.userinfo,
    original_uri.host,
    original_uri.port,
    original_uri.path,
    new Some(
      query_to_string(
        prepend(
          ["f", "json"],
          prepend(
            ["u", auth_details.username],
            prepend(
              ["s", auth_details.credentials.salt],
              prepend(
                ["t", auth_details.credentials.token],
                prepend(
                  ["c", "somachord"],
                  prepend(["v", "1.16.0"], query2)
                )
              )
            )
          )
        )
      )
    ),
    original_uri.fragment
  );
  return to_string3(_pipe$1);
}
function get_request(auth_details, path, query2) {
  let $ = to(create_uri(auth_details, path, query2));
  let req;
  if ($ instanceof Ok) {
    req = $[0];
  } else {
    throw makeError(
      "let_assert",
      FILEPATH4,
      "somachord/api/api",
      68,
      "get_request",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 1542,
        end: 1612,
        pattern_start: 1553,
        pattern_end: 1560
      }
    );
  }
  return req;
}
function subsonic_response_decoder(inner) {
  return subfield(
    toList(["subsonic-response", "status"]),
    string3,
    (status) => {
      if (status === "ok") {
        let _pipe = inner;
        return map2(_pipe, (a2) => {
          return new Ok(a2);
        });
      } else if (status === "failed") {
        return subfield(
          toList(["subsonic-response", "error", "code"]),
          int2,
          (code2) => {
            return subfield(
              toList(["subsonic-response", "error", "message"]),
              string3,
              (message2) => {
                echo2(code2, void 0, "src/somachord/api/api.gleam", 89);
                echo2(message2, void 0, "src/somachord/api/api.gleam", 90);
                return success(
                  new Error2(
                    (() => {
                      if (code2 === 40) {
                        return new WrongCredentials(message2);
                      } else if (code2 === 70) {
                        return new NotFound2();
                      } else {
                        return new SubsonicError(code2, message2);
                      }
                    })()
                  )
                );
              }
            );
          }
        );
      } else {
        throw makeError(
          "panic",
          FILEPATH4,
          "somachord/api/api",
          99,
          "subsonic_response_decoder",
          "no",
          {}
        );
      }
    }
  );
}
function cover_url(auth_details, id3, size3) {
  return create_uri(
    auth_details,
    "/rest/getCoverArt.view",
    toList([
      ["id", id3],
      [
        "size",
        (() => {
          let _pipe = size3;
          return to_string2(_pipe);
        })()
      ]
    ])
  );
}
function stream(auth_details, song3) {
  return create_uri(
    auth_details,
    "/rest/stream.view",
    toList([["id", song3.id]])
  );
}
function album_list(auth_details, type_2, offset, amount, msg) {
  let req = get_request(
    auth_details,
    "/rest/getAlbumList2.view",
    toList([
      ["offset", to_string2(offset)],
      ["size", to_string2(amount)],
      ["type", type_2]
    ])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "albumList2", "album"]),
          list2(album_decoder()),
          (albums) => {
            return success(new AlbumList(type_2, albums));
          }
        )
      ),
      msg
    )
  );
}
function album(auth_details, id3, msg) {
  let req = get_request(
    auth_details,
    "/rest/getAlbum.view",
    toList([["id", id3]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "album"]),
          album_decoder(),
          (album3) => {
            return success(album3);
          }
        )
      ),
      msg
    )
  );
}
function artist(auth_details, id3, msg) {
  let req = get_request(
    auth_details,
    "/rest/getArtist.view",
    toList([["id", id3]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "artist"]),
          artist_decoder(),
          (artist2) => {
            return success(artist2);
          }
        )
      ),
      msg
    )
  );
}
function like(auth_details, id3, msg) {
  let req = get_request(auth_details, "/rest/star.view", toList([["id", id3]]));
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(success(void 0)),
      msg
    )
  );
}
function likes(auth_details, msg) {
  let req = get_request(auth_details, "/rest/getStarred2.view", toList([]));
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        then$(
          optionally_at(
            toList(["subsonic-response", "starred2", "song"]),
            toList([]),
            list2(song_decoder())
          ),
          (songs) => {
            return success(songs);
          }
        )
      ),
      msg
    )
  );
}
function unlike(auth_details, id3, msg) {
  let req = get_request(auth_details, "/rest/unstar.view", toList([["id", id3]]));
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(success(void 0)),
      msg
    )
  );
}
function lyrics(auth_details, id3, msg) {
  let req = get_request(
    auth_details,
    "/rest/getLyricsBySongId.view",
    toList([["id", id3]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        then$(
          optionally_at(
            toList(["subsonic-response", "lyricsList", "structuredLyrics"]),
            toList([]),
            one_of(
              list2(lyric_set_decoder()),
              toList([success(toList([]))])
            )
          ),
          (lyrics2) => {
            return success(lyrics2);
          }
        )
      ),
      msg
    )
  );
}
function ping(auth_details, msg) {
  let req = get_request(auth_details, "/rest/ping.view", toList([]));
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(success(void 0)),
      msg
    )
  );
}
function playlists(auth_details, msg) {
  let req = get_request(auth_details, "/rest/getPlaylists.view", toList([]));
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        then$(
          optionally_at(
            toList(["subsonic-response", "playlists", "playlist"]),
            toList([]),
            list2(playlist_decoder())
          ),
          (playlists2) => {
            return success(playlists2);
          }
        )
      ),
      msg
    )
  );
}
function playlist(auth_details, id3, msg) {
  let req = get_request(
    auth_details,
    "/rest/getPlaylist.view",
    toList([["id", id3]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "playlist"]),
          playlist_decoder(),
          (playlist3) => {
            return success(playlist3);
          }
        )
      ),
      msg
    )
  );
}
function date_decoder() {
  return new_primitive_decoder(
    "Date",
    (v) => {
      return try$(
        (() => {
          let _pipe = run(v, string3);
          return map_error(
            _pipe,
            (_) => {
              return new_("May 19 2024");
            }
          );
        })(),
        (timestamp) => {
          return new Ok(new_(timestamp));
        }
      );
    }
  );
}
function queue(auth_details, msg) {
  let req = get_request(auth_details, "/rest/getPlayQueue.view", toList([]));
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        then$(
          optionally_at(
            toList(["subsonic-response", "playQueue", "position"]),
            0,
            int2
          ),
          (song_position) => {
            let song_position$1 = identity(song_position) / 1e3;
            return subfield(
              toList(["subsonic-response", "playQueue", "entry"]),
              list2(song_decoder()),
              (songs) => {
                let songs_indexed = index_map(
                  songs,
                  (idx, song3) => {
                    return [song3, idx];
                  }
                );
                return subfield(
                  toList(["subsonic-response", "playQueue", "current"]),
                  string3,
                  (current2) => {
                    let $ = find2(
                      songs_indexed,
                      (song3) => {
                        return song3[1].id === current2;
                      }
                    );
                    let current_song2;
                    if ($ instanceof Ok) {
                      current_song2 = $[0];
                    } else {
                      throw makeError(
                        "let_assert",
                        FILEPATH4,
                        "somachord/api/api",
                        354,
                        "queue",
                        "Pattern match failed, no pattern matched the value.",
                        {
                          value: $,
                          start: 8454,
                          end: 8557,
                          pattern_start: 8465,
                          pattern_end: 8481
                        }
                      );
                    }
                    return subfield(
                      toList(["subsonic-response", "playQueue", "changed"]),
                      date_decoder(),
                      (changed) => {
                        return success(
                          (() => {
                            let _block;
                            let _record = new$9(0, songs, song_position$1);
                            _block = new Queue(
                              _record.song_position,
                              _record.songs,
                              _record.song_order,
                              _record.position,
                              changed
                            );
                            let _pipe = _block;
                            return jump(_pipe, current_song2[0]);
                          })()
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        )
      ),
      msg
    )
  );
}
function save_queue(auth_details, queue2, msg) {
  let req = get_request(
    auth_details,
    "/rest/savePlayQueue.view",
    (() => {
      if (queue2 instanceof Some) {
        let queue$1 = queue2[0];
        let _block;
        let _pipe = queue$1.songs;
        _block = map_get(_pipe, queue$1.position);
        let $ = _block;
        let current_song2;
        if ($ instanceof Ok) {
          current_song2 = $[0];
        } else {
          throw makeError(
            "let_assert",
            FILEPATH4,
            "somachord/api/api",
            397,
            "save_queue",
            "Pattern match failed, no pattern matched the value.",
            {
              value: $,
              start: 9498,
              end: 9567,
              pattern_start: 9509,
              pattern_end: 9525
            }
          );
        }
        return prepend(
          ["current", current_song2.id],
          prepend(
            [
              "position",
              (() => {
                let _pipe$1 = queue$1.song_position * 1e3;
                let _pipe$2 = truncate(_pipe$1);
                return to_string2(_pipe$2);
              })()
            ],
            map(
              list4(queue$1),
              (song3) => {
                return ["id", song3[1].id];
              }
            )
          )
        );
      } else {
        return toList([]);
      }
    })()
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(success(void 0)),
      msg
    )
  );
}
function scrobble(auth_details, id3, submission, msg) {
  let req = get_request(
    auth_details,
    "/rest/scrobble.view",
    toList([
      ["id", id3],
      [
        "submission",
        (() => {
          let _pipe = to_string(submission);
          return lowercase(_pipe);
        })()
      ]
    ])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(success(void 0)),
      msg
    )
  );
}
function search(auth_details, query2, msg) {
  let req = get_request(
    auth_details,
    "/rest/search3.view",
    toList([["query", query2]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        then$(
          optionally_at(
            toList(["subsonic-response", "searchResult3", "artist"]),
            toList([]),
            list2(artist_small_decoder())
          ),
          (artists2) => {
            return then$(
              optionally_at(
                toList(["subsonic-response", "searchResult3", "album"]),
                toList([]),
                list2(album_decoder())
              ),
              (albums) => {
                return success(new Search2(artists2, albums));
              }
            );
          }
        )
      ),
      msg
    )
  );
}
function similar_songs(auth_details, id3, msg) {
  let req = get_request(
    auth_details,
    "/rest/getSimilarSongs.view",
    toList([["id", id3]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "similarSongs", "song"]),
          list2(song_decoder()),
          (songs) => {
            return success(songs);
          }
        )
      ),
      msg
    )
  );
}
function similar_songs_artist(auth_details, id3, msg) {
  let req = get_request(
    auth_details,
    "/rest/getSimilarSongs2.view",
    toList([["id", id3]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "similarSongs2", "song"]),
          list2(song_decoder()),
          (songs) => {
            return success(songs);
          }
        )
      ),
      msg
    )
  );
}
function song(auth_details, id3, msg) {
  let req = get_request(
    auth_details,
    "/rest/getSong.view",
    toList([["id", id3]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "song"]),
          song_decoder(),
          (song3) => {
            return success(song3);
          }
        )
      ),
      msg
    )
  );
}
function top_songs(auth_details, artist_name, msg) {
  let req = get_request(
    auth_details,
    "/rest/getTopSongs.view",
    toList([["artist", artist_name], ["count", "5"]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "topSongs", "song"]),
          list2(song_decoder()),
          (songs) => {
            return success(songs);
          }
        )
      ),
      msg
    )
  );
}
function add_to_playlist(auth_details, playlist_id, song_id2, msg) {
  let req = get_request(
    auth_details,
    "/rest/updatePlaylist.view",
    toList([["playlistId", playlist_id], ["songIdToAdd", song_id2]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(success(void 0)),
      msg
    )
  );
}
function remove_from_playlist(auth_details, playlist_id, song_id2, msg) {
  let req = get_request(
    auth_details,
    "/rest/updatePlaylist.view",
    toList([["playlistId", playlist_id], ["songIndexToRemove", song_id2]])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(success(void 0)),
      msg
    )
  );
}
function create_playlist(auth_details, name2, songs, msg) {
  let req = get_request(
    auth_details,
    "/rest/createPlaylist.view",
    prepend(
      ["name", name2],
      map(songs, (song_id2) => {
        return ["songId", song_id2];
      })
    )
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(
        subfield(
          toList(["subsonic-response", "playlist"]),
          playlist_decoder(),
          (playlist3) => {
            return success(playlist3);
          }
        )
      ),
      msg
    )
  );
}
function update_playlist(auth_details, id3, name2, description, public$, msg) {
  let req = get_request(
    auth_details,
    "/rest/updatePlaylist.view",
    toList([
      ["playlistId", id3],
      ["name", name2],
      ["comment", description],
      [
        "public",
        (() => {
          let _pipe = to_string(public$);
          return lowercase(_pipe);
        })()
      ]
    ])
  );
  return send3(
    req,
    expect_json(
      subsonic_response_decoder(success(void 0)),
      msg
    )
  );
}
function echo2(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector2();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector2 = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/dev/javascript/lustre/lustre/event.mjs
function emit(event4, data2) {
  return event2(event4, data2);
}
function is_immediate_event(name2) {
  if (name2 === "input") {
    return true;
  } else if (name2 === "change") {
    return true;
  } else if (name2 === "focus") {
    return true;
  } else if (name2 === "focusin") {
    return true;
  } else if (name2 === "focusout") {
    return true;
  } else if (name2 === "blur") {
    return true;
  } else if (name2 === "select") {
    return true;
  } else {
    return false;
  }
}
function on(name2, handler) {
  return event(
    name2,
    map2(handler, (msg) => {
      return new Handler(false, false, msg);
    }),
    empty_list,
    never,
    never,
    is_immediate_event(name2),
    0,
    0
  );
}
function prevent_default(event4) {
  if (event4 instanceof Event2) {
    return new Event2(
      event4.kind,
      event4.name,
      event4.handler,
      event4.include,
      always,
      event4.stop_propagation,
      event4.immediate,
      event4.debounce,
      event4.throttle
    );
  } else {
    return event4;
  }
}
function on_click(msg) {
  return on("click", success(msg));
}
function on_input(msg) {
  return on(
    "input",
    subfield(
      toList(["target", "value"]),
      string3,
      (value3) => {
        return success(msg(value3));
      }
    )
  );
}
function formdata_decoder() {
  let string_value_decoder = field(
    0,
    string3,
    (key3) => {
      return field(
        1,
        one_of(
          map2(string3, (var0) => {
            return new Ok(var0);
          }),
          toList([success(new Error2(void 0))])
        ),
        (value3) => {
          let _pipe2 = value3;
          let _pipe$12 = map3(
            _pipe2,
            (_capture) => {
              return new$(key3, _capture);
            }
          );
          return success(_pipe$12);
        }
      );
    }
  );
  let _pipe = string_value_decoder;
  let _pipe$1 = list2(_pipe);
  return map2(_pipe$1, values2);
}
function on_submit(msg) {
  let _pipe = on(
    "submit",
    subfield(
      toList(["detail", "formData"]),
      formdata_decoder(),
      (formdata) => {
        let _pipe2 = formdata;
        let _pipe$1 = msg(_pipe2);
        return success(_pipe$1);
      }
    )
  );
  return prevent_default(_pipe);
}

// build/dev/javascript/somachord/somachord/components.ffi.mjs
function emit_click(event4) {
  document.dispatchEvent(new CustomEvent("component-click", {
    bubbles: true,
    cancelable: true,
    detail: {
      clickEvent: event4
    }
  }));
}
function scroll_into_view(element13) {
  element13.scrollIntoView({ behavior: "smooth", block: "end" });
}
function elems_to_array(nl) {
  return [...nl];
}
function online() {
  return navigator.onLine;
}

// build/dev/javascript/somachord/somachord/components.mjs
function redirect_click(msg) {
  let _pipe = on(
    "click",
    new_primitive_decoder(
      "event",
      (event4) => {
        emit_click(event4);
        return new Ok(msg);
      }
    )
  );
  return prevent_default(_pipe);
}
function layout() {
  let $ = (() => {
    let _pipe = self2();
    return innerWidth(_pipe);
  })() < 800;
  if ($) {
    return new Mobile();
  } else {
    return new Desktop();
  }
}
function mobile_space() {
  return div(toList([class$("h-16")]), toList([]));
}

// build/dev/javascript/plinth/shadow_ffi.mjs
function shadowRoot(element13) {
  let shadowRoot2 = element13.shadowRoot;
  if (shadowRoot2) {
    return new Ok(shadowRoot2);
  }
  return new Error2();
}
function querySelector2(shadowRoot2, selector) {
  let element13 = shadowRoot2.querySelector(selector);
  if (element13) {
    return new Ok(element13);
  }
  return new Error2();
}
function querySelectorAll2(shadowRoot2, selector) {
  return shadowRoot2.querySelectorAll(selector);
}

// build/dev/javascript/somachord/somachord/components/lyrics.mjs
var FILEPATH5 = "src/somachord/components/lyrics.gleam";
var Model2 = class extends CustomType {
  constructor(id3, lyricsets, chosen_lyric_set, song_time3, auto_scroll3, font_size2, show_size_changer, nested_shadow2) {
    super();
    this.id = id3;
    this.lyricsets = lyricsets;
    this.chosen_lyric_set = chosen_lyric_set;
    this.song_time = song_time3;
    this.auto_scroll = auto_scroll3;
    this.font_size = font_size2;
    this.show_size_changer = show_size_changer;
    this.nested_shadow = nested_shadow2;
  }
};
var Small = class extends CustomType {
};
var Medium = class extends CustomType {
};
var Large = class extends CustomType {
};
var SongID = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var Playtime = class extends CustomType {
  constructor(time3) {
    super();
    this.time = time3;
  }
};
var LyricsRetrieved = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ToggleAutoscroll = class extends CustomType {
};
var SetAutoscroll = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var SizeChange = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ToggleSizeChanger = class extends CustomType {
};
var NestedShadow = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
function element4(attrs) {
  return element2(
    "song-lyrics",
    prepend(
      style("--unplayed-color", "var(--color-zinc-600)"),
      attrs
    ),
    toList([])
  );
}
function id2(id3) {
  return attribute2("song-id", id3);
}
function song_time(time3) {
  return property2("time", float3(time3));
}
function size2(size3) {
  let _block;
  if (size3 instanceof Small) {
    _block = "small";
  } else if (size3 instanceof Medium) {
    _block = "medium";
  } else {
    _block = "large";
  }
  let size_str = _block;
  return attribute2("size", size_str);
}
function auto_scroll(scroll) {
  return property2("auto-scroll", bool2(scroll));
}
function nested_shadow(nested) {
  return property2("nested-shadow", bool2(nested));
}
function init2(_) {
  return [
    new Model2(
      "",
      new None(),
      "xxx",
      new None(),
      true,
      (() => {
        let $ = layout();
        if ($ instanceof Desktop) {
          return new Medium();
        } else {
          return new Small();
        }
      })(),
      false,
      false
    ),
    none2()
  ];
}
function emit_lyrics_loaded(loaded) {
  return emit(
    "lyricsLoaded",
    object2(toList([["loaded", bool2(loaded)]]))
  );
}
function update2(m, msg) {
  if (msg instanceof SongID) {
    let id$1 = msg.id;
    return [
      m,
      (() => {
        let $ = (() => {
          let _pipe = create();
          return get2(_pipe, "auth");
        })();
        if ($ instanceof Ok) {
          let stg = $[0];
          return guard(
            id$1 === "",
            none2(),
            () => {
              return lyrics(
                stg.auth,
                id$1,
                (var0) => {
                  return new LyricsRetrieved(var0);
                }
              );
            }
          );
        } else {
          return none2();
        }
      })()
    ];
  } else if (msg instanceof Playtime) {
    let time3 = msg.time;
    let $ = m.nested_shadow;
    if ($) {
      let ret = [
        new Model2(
          m.id,
          m.lyricsets,
          m.chosen_lyric_set,
          new Some(time3),
          m.auto_scroll,
          m.font_size,
          m.show_size_changer,
          m.nested_shadow
        ),
        none2()
      ];
      return guard(
        negate(m.auto_scroll),
        ret,
        () => {
          return guard(
            (() => {
              let _pipe = getElementsByTagName("song-page");
              return length3(_pipe);
            })() === 0,
            ret,
            () => {
              let _block;
              let _pipe = getElementsByTagName("song-page");
              _block = index4(_pipe, 0);
              let $1 = _block;
              let parent_elem;
              if ($1 instanceof Ok) {
                parent_elem = $1[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH5,
                  "somachord/components/lyrics",
                  165,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $1,
                    start: 4344,
                    end: 4447,
                    pattern_start: 4355,
                    pattern_end: 4370
                  }
                );
              }
              let $2 = shadowRoot(parent_elem);
              let parent_shadow_root;
              if ($2 instanceof Ok) {
                parent_shadow_root = $2[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH5,
                  "somachord/components/lyrics",
                  167,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $2,
                    start: 4458,
                    end: 4525,
                    pattern_start: 4469,
                    pattern_end: 4491
                  }
                );
              }
              let $3 = querySelector2(parent_shadow_root, "song-lyrics");
              let elem;
              if ($3 instanceof Ok) {
                elem = $3[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH5,
                  "somachord/components/lyrics",
                  168,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $3,
                    start: 4536,
                    end: 4626,
                    pattern_start: 4547,
                    pattern_end: 4555
                  }
                );
              }
              let $4 = shadowRoot(elem);
              let shadow_root;
              if ($4 instanceof Ok) {
                shadow_root = $4[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH5,
                  "somachord/components/lyrics",
                  170,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $4,
                    start: 4637,
                    end: 4690,
                    pattern_start: 4648,
                    pattern_end: 4663
                  }
                );
              }
              let $5 = (() => {
                let _pipe$1 = querySelectorAll2(
                  shadow_root,
                  ".off-time"
                );
                let _pipe$2 = elems_to_array(_pipe$1);
                let _pipe$3 = to_list(_pipe$2);
                let _pipe$4 = take(_pipe$3, 5);
                let _pipe$5 = reverse(_pipe$4);
                return first(_pipe$5);
              })();
              if ($5 instanceof Ok) {
                let elem$1 = $5[0];
                scroll_into_view(elem$1);
              } else {
              }
              return ret;
            }
          );
        }
      );
    } else {
      let ret = [
        new Model2(
          m.id,
          m.lyricsets,
          m.chosen_lyric_set,
          new Some(time3),
          m.auto_scroll,
          m.font_size,
          m.show_size_changer,
          m.nested_shadow
        ),
        none2()
      ];
      return guard(
        negate(m.auto_scroll),
        ret,
        () => {
          return guard(
            (() => {
              let _pipe = getElementsByTagName("song-lyrics");
              return length3(_pipe);
            })() === 0,
            ret,
            () => {
              let _block;
              let _pipe = getElementsByTagName("song-lyrics");
              _block = index4(_pipe, 0);
              let $1 = _block;
              let elem;
              if ($1 instanceof Ok) {
                elem = $1[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH5,
                  "somachord/components/lyrics",
                  192,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $1,
                    start: 5380,
                    end: 5478,
                    pattern_start: 5391,
                    pattern_end: 5399
                  }
                );
              }
              let $2 = shadowRoot(elem);
              let shadow_root;
              if ($2 instanceof Ok) {
                shadow_root = $2[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH5,
                  "somachord/components/lyrics",
                  194,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $2,
                    start: 5489,
                    end: 5542,
                    pattern_start: 5500,
                    pattern_end: 5515
                  }
                );
              }
              let $3 = (() => {
                let _pipe$1 = querySelectorAll2(
                  shadow_root,
                  ".off-time"
                );
                let _pipe$2 = elems_to_array(_pipe$1);
                let _pipe$3 = to_list(_pipe$2);
                let _pipe$4 = take(_pipe$3, 5);
                let _pipe$5 = reverse(_pipe$4);
                return first(_pipe$5);
              })();
              if ($3 instanceof Ok) {
                let elem$1 = $3[0];
                scroll_into_view(elem$1);
              } else {
              }
              return ret;
            }
          );
        }
      );
    }
  } else if (msg instanceof LyricsRetrieved) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let lyricsets = $1[0];
        return [
          new Model2(
            m.id,
            new Some(lyricsets),
            m.chosen_lyric_set,
            m.song_time,
            m.auto_scroll,
            m.font_size,
            m.show_size_changer,
            m.nested_shadow
          ),
          emit_lyrics_loaded(true)
        ];
      } else {
        let e = $1[0];
        if (e instanceof NotFound2) {
          return [
            new Model2(
              m.id,
              new Some(toList([])),
              m.chosen_lyric_set,
              m.song_time,
              m.auto_scroll,
              m.font_size,
              m.show_size_changer,
              m.nested_shadow
            ),
            emit_lyrics_loaded(false)
          ];
        } else {
          echo3(e, void 0, "src/somachord/components/lyrics.gleam", 220);
          throw makeError(
            "panic",
            FILEPATH5,
            "somachord/components/lyrics",
            221,
            "update",
            "should be unreachable",
            {}
          );
        }
      }
    } else {
      let e = $[0];
      echo3(e, void 0, "src/somachord/components/lyrics.gleam", 210);
      throw makeError(
        "panic",
        FILEPATH5,
        "somachord/components/lyrics",
        211,
        "update",
        "rsvp error",
        {}
      );
    }
  } else if (msg instanceof ToggleAutoscroll) {
    return [
      new Model2(
        m.id,
        m.lyricsets,
        m.chosen_lyric_set,
        m.song_time,
        negate(m.auto_scroll),
        m.font_size,
        m.show_size_changer,
        m.nested_shadow
      ),
      none2()
    ];
  } else if (msg instanceof SetAutoscroll) {
    let scroll = msg[0];
    return [
      new Model2(
        m.id,
        m.lyricsets,
        m.chosen_lyric_set,
        m.song_time,
        scroll,
        m.font_size,
        m.show_size_changer,
        m.nested_shadow
      ),
      none2()
    ];
  } else if (msg instanceof SizeChange) {
    let size$1 = msg[0];
    return [
      new Model2(
        m.id,
        m.lyricsets,
        m.chosen_lyric_set,
        m.song_time,
        m.auto_scroll,
        size$1,
        m.show_size_changer,
        m.nested_shadow
      ),
      none2()
    ];
  } else if (msg instanceof ToggleSizeChanger) {
    return [
      new Model2(
        m.id,
        m.lyricsets,
        m.chosen_lyric_set,
        m.song_time,
        m.auto_scroll,
        m.font_size,
        negate(m.show_size_changer),
        m.nested_shadow
      ),
      none2()
    ];
  } else if (msg instanceof NestedShadow) {
    let nested = msg[0];
    return [
      new Model2(
        m.id,
        m.lyricsets,
        m.chosen_lyric_set,
        m.song_time,
        m.auto_scroll,
        m.font_size,
        m.show_size_changer,
        nested
      ),
      none2()
    ];
  } else {
    return [m, none2()];
  }
}
function view2(m) {
  return guard(
    (() => {
      let _pipe = m.lyricsets;
      return is_none(_pipe);
    })(),
    div(
      toList([class$("flex justify-center w-full h-full")]),
      toList([
        i(
          toList([class$("ph ph-spinner-ball animate-spin text-3xl")]),
          toList([])
        )
      ])
    ),
    () => {
      let _block;
      let _pipe = m.lyricsets;
      _block = unwrap(_pipe, toList([]));
      let lyricsets = _block;
      return guard(
        (() => {
          let _pipe$1 = lyricsets;
          return is_empty2(_pipe$1);
        })(),
        h1(
          toList([class$("font-[Poppins] font-semibold text-3xl")]),
          toList([text2("No Lyrics Found")])
        ),
        () => {
          let _block$1;
          let _pipe$1 = find2(
            lyricsets,
            (lyricset) => {
              let _pipe$12 = lyricset.lang === m.chosen_lyric_set;
              let _pipe$22 = or(_pipe$12, lyricset.lang === "xxx");
              return or(_pipe$22, lyricset.lang === "und");
            }
          );
          let _pipe$2 = replace_error(
            _pipe$1,
            (() => {
              if (lyricsets instanceof Empty) {
                return new LyricSet(false, "und", 0, toList([]));
              } else {
                let first3 = lyricsets.head;
                return first3;
              }
            })()
          );
          _block$1 = unwrap_both(_pipe$2);
          let lyrics2 = _block$1;
          return div(
            toList([
              class$("space-y-2"),
              class$(
                (() => {
                  let $ = m.font_size;
                  if ($ instanceof Small) {
                    return "text-lg";
                  } else if ($ instanceof Medium) {
                    return "text-2xl";
                  } else {
                    return "text-4xl/12";
                  }
                })()
              )
            ]),
            prepend(
              (() => {
                let $ = lyrics2.synced;
                if ($) {
                  return none3();
                } else {
                  return div(
                    toList([
                      class$(
                        "flex justify-center items-center gap-1"
                      )
                    ]),
                    toList([
                      i(
                        toList([
                          class$(
                            "text-xl text-yellow-400 ph-fill ph-warning"
                          )
                        ]),
                        toList([])
                      ),
                      text2("Unsynced!")
                    ])
                  );
                }
              })(),
              map(
                lyrics2.lines,
                (lyric) => {
                  return p(
                    toList([
                      class$("font-semibold"),
                      (() => {
                        let $ = m.song_time;
                        if ($ instanceof Some) {
                          let $1 = $[0];
                          if ($1 === -1) {
                            return class$("text-zinc-300");
                          } else {
                            let current_time = $1;
                            let $2 = current_time + lyrics2.offset > lyric.time - 0.5;
                            if ($2) {
                              return class$("text-zinc-300");
                            } else {
                              return class$(
                                "text-(--unplayed-color) off-time"
                              );
                            }
                          }
                        } else {
                          return class$("text-zinc-300");
                        }
                      })()
                    ]),
                    toList([text2(lyric.text)])
                  );
                }
              )
            )
          );
        }
      );
    }
  );
}
function register() {
  let component2 = component(
    init2,
    update2,
    view2,
    toList([
      on_attribute_change(
        "song-id",
        (value3) => {
          return new Ok(new SongID(value3));
        }
      ),
      on_property_change(
        "time",
        (() => {
          let _pipe = float2;
          return map2(_pipe, (var0) => {
            return new Playtime(var0);
          });
        })()
      ),
      on_attribute_change(
        "size",
        (value3) => {
          if (value3 === "small") {
            return new Ok(new SizeChange(new Small()));
          } else if (value3 === "medium") {
            return new Ok(new SizeChange(new Medium()));
          } else if (value3 === "large") {
            return new Ok(new SizeChange(new Large()));
          } else {
            return new Error2(void 0);
          }
        }
      ),
      on_property_change(
        "auto-scroll",
        (() => {
          let _pipe = bool;
          return map2(
            _pipe,
            (var0) => {
              return new SetAutoscroll(var0);
            }
          );
        })()
      ),
      on_property_change(
        "nested-shadow",
        (() => {
          let _pipe = bool;
          return map2(
            _pipe,
            (var0) => {
              return new NestedShadow(var0);
            }
          );
        })()
      )
    ])
  );
  return make_component(component2, "song-lyrics");
}
function echo3(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector3();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector3 = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/dev/javascript/somachord/somachord/elements/button.mjs
var Smallest = class extends CustomType {
};
var Small2 = class extends CustomType {
};
var Medium2 = class extends CustomType {
};
var Large2 = class extends CustomType {
};
var Largest = class extends CustomType {
};
var Custom = class extends CustomType {
  constructor(class$2) {
    super();
    this.class = class$2;
  }
};
var Play = class extends CustomType {
};
var Pause = class extends CustomType {
};
var SkipForward = class extends CustomType {
};
var SkipBackward = class extends CustomType {
};
var Loop = class extends CustomType {
};
var Shuffle = class extends CustomType {
};
var Like = class extends CustomType {
  constructor(filled) {
    super();
    this.filled = filled;
  }
};
var AddToPlaylist = class extends CustomType {
};
var FullscreenPlayer = class extends CustomType {
};
var MoreHorizontal = class extends CustomType {
};
var Down = class extends CustomType {
};
var Edit = class extends CustomType {
};
var Close = class extends CustomType {
};
var About2 = class extends CustomType {
};
function button_size(size3) {
  if (size3 instanceof Smallest) {
    return "text-xl";
  } else if (size3 instanceof Small2) {
    return "text-2xl";
  } else if (size3 instanceof Medium2) {
    return "text-3xl";
  } else if (size3 instanceof Large2) {
    return "text-4xl";
  } else if (size3 instanceof Largest) {
    return "text-5xl";
  } else {
    let class$2 = size3.class;
    return class$2;
  }
}
function button_class(kind) {
  if (kind instanceof Play) {
    return "ph-fill ph-play-circle";
  } else if (kind instanceof Pause) {
    return "ph-fill ph-pause-circle";
  } else if (kind instanceof SkipForward) {
    return "ph-fill ph-skip-forward";
  } else if (kind instanceof SkipBackward) {
    return "ph-fill ph-skip-back";
  } else if (kind instanceof Loop) {
    return "ph ph-repeat-once";
  } else if (kind instanceof Shuffle) {
    return "ph ph-shuffle-simple";
  } else if (kind instanceof Like) {
    let filled = kind.filled;
    if (filled) {
      return "ph-fill ph-heart-straight";
    } else {
      return "ph ph-heart-straight";
    }
  } else if (kind instanceof AddToPlaylist) {
    return "ph ph-plus-circle";
  } else if (kind instanceof FullscreenPlayer) {
    return "ph ph-monitor";
  } else if (kind instanceof MoreHorizontal) {
    return "ph ph-dots-three";
  } else if (kind instanceof Down) {
    return "ph ph-caret-down";
  } else if (kind instanceof Edit) {
    return "ph ph-pencil-simple";
  } else if (kind instanceof Close) {
    return "ph ph-x";
  } else {
    return "ph ph-question";
  }
}
function button2(kind, size3, attrs) {
  return button(
    toList([class$("flex outline-none")]),
    toList([
      i(
        prepend(
          class$(button_class(kind)),
          prepend(
            class$(button_size(size3)),
            prepend(
              class$(
                "select-none transition-scale duration-300 hover:scale-[105%] hover:brightness-80 active:brightness-50 " + (() => {
                  if (size3 instanceof Large2) {
                    return "active:scale-[90%]";
                  } else {
                    return "active:scale-[95%]";
                  }
                })()
              ),
              attrs
            )
          )
        ),
        toList([])
      )
    ])
  );
}
function disabled_button(kind, size3, attrs) {
  return button(
    toList([class$("flex outline-none"), disabled(true)]),
    toList([
      i(
        prepend(
          class$(button_class(kind)),
          prepend(
            class$(button_size(size3)),
            prepend(class$("cursor-not-allowed"), attrs)
          )
        ),
        toList([])
      )
    ])
  );
}

// build/dev/javascript/somachord/somachord/msg.mjs
var FILEPATH6 = "src/somachord/msg.gleam";
var Router = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var SongRetrieval = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Queue2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var AlbumRetrieved = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var DisgardedResponse = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var SimilarSongs = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var SimilarSongsArtist = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlaylistWithSongs = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var DisplayToast = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ClearToast = class extends CustomType {
};
var Connectivity = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ToggleFullscreenPlayer = class extends CustomType {
};
var ChangeFullscreenPlayerView = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Play2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var CurrentSongPalette = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Search3 = class extends CustomType {
  constructor(query2) {
    super();
    this.query = query2;
  }
};
var StreamAlbum = class extends CustomType {
  constructor($0, $1) {
    super();
    this[0] = $0;
    this[1] = $1;
  }
};
var StreamPlaylist = class extends CustomType {
  constructor($0, $1) {
    super();
    this[0] = $0;
    this[1] = $1;
  }
};
var StreamAlbumShuffled = class extends CustomType {
  constructor($0, $1) {
    super();
    this[0] = $0;
    this[1] = $1;
  }
};
var StreamSong = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var StreamFromQueue = class extends CustomType {
  constructor(queue_position) {
    super();
    this.queue_position = queue_position;
  }
};
var StreamCurrent = class extends CustomType {
};
var StreamError = class extends CustomType {
};
var LoadSong = class extends CustomType {
};
var ProgressDrag = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlayerSeek = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlayerSongLoaded = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlayerTick = class extends CustomType {
  constructor(time3) {
    super();
    this.time = time3;
  }
};
var MusicEnded = class extends CustomType {
};
var PlayerShuffle = class extends CustomType {
};
var PlayerPrevious = class extends CustomType {
};
var PlayerPausePlay = class extends CustomType {
};
var PlayerNext = class extends CustomType {
};
var PlayerLoop = class extends CustomType {
};
var Like2 = class extends CustomType {
};
var QueueJumpTo = class extends CustomType {
  constructor(position) {
    super();
    this.position = position;
  }
};
var Unload = class extends CustomType {
};
var ComponentClick = class extends CustomType {
};
function on_url_change(url) {
  let _pipe = uri_to_route(
    (() => {
      let $ = am_i_electron();
      if ($) {
        let $1 = parse("/#" + url.path);
        let url$1;
        if ($1 instanceof Ok) {
          url$1 = $1[0];
        } else {
          throw makeError(
            "let_assert",
            FILEPATH6,
            "somachord/msg",
            81,
            "on_url_change",
            "Pattern match failed, no pattern matched the value.",
            {
              value: $1,
              start: 2075,
              end: 2123,
              pattern_start: 2086,
              pattern_end: 2093
            }
          );
        }
        return url$1;
      } else {
        return url;
      }
    })()
  );
  let _pipe$1 = new ChangeRoute(_pipe);
  return new Router(_pipe$1);
}
function on_play(handler) {
  return on(
    "play",
    subfield(
      toList(["detail", "type"]),
      string3,
      (type_2) => {
        return subfield(
          toList(["detail", "id"]),
          string3,
          (id3) => {
            return then$(
              optionally_at(toList(["detail", "index"]), 0, int2),
              (index5) => {
                let _pipe = success(
                  new PlayRequest(type_2, id3, index5)
                );
                return map2(_pipe, handler);
              }
            );
          }
        );
      }
    )
  );
}
function on_playlist(handler) {
  return on(
    "playPlaylist",
    subfield(
      toList(["detail", "playlist"]),
      playlist_decoder(),
      (playlist3) => {
        return then$(
          optionally_at(toList(["detail", "index"]), 0, int2),
          (index5) => {
            return then$(
              optionally_at(
                toList(["detail", "shuffle"]),
                false,
                bool
              ),
              (shuffle3) => {
                let _pipe = success(
                  new PlaylistPlayRequest(playlist3, index5, shuffle3)
                );
                return map2(_pipe, handler);
              }
            );
          }
        );
      }
    )
  );
}

// node_modules/@vibrant/image/dist/esm/histogram.js
var Histogram = class {
  constructor(pixels, opts) {
    this.pixels = pixels;
    this.opts = opts;
    const { sigBits } = opts;
    const getColorIndex = (r2, g2, b2) => (r2 << 2 * sigBits) + (g2 << sigBits) + b2;
    this.getColorIndex = getColorIndex;
    const rshift = 8 - sigBits;
    const hn = 1 << 3 * sigBits;
    const hist = new Uint32Array(hn);
    let rmax;
    let rmin;
    let gmax;
    let gmin;
    let bmax;
    let bmin;
    let r;
    let g;
    let b;
    let a2;
    rmax = gmax = bmax = 0;
    rmin = gmin = bmin = Number.MAX_VALUE;
    const n = pixels.length / 4;
    let i2 = 0;
    while (i2 < n) {
      const offset = i2 * 4;
      i2++;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a2 = pixels[offset + 3];
      if (a2 === 0) continue;
      r = r >> rshift;
      g = g >> rshift;
      b = b >> rshift;
      const index5 = getColorIndex(r, g, b);
      if (hist[index5] === void 0) hist[index5] = 0;
      hist[index5] += 1;
      if (r > rmax) rmax = r;
      if (r < rmin) rmin = r;
      if (g > gmax) gmax = g;
      if (g < gmin) gmin = g;
      if (b > bmax) bmax = b;
      if (b < bmin) bmin = b;
    }
    this._colorCount = hist.reduce(
      (total, c) => c > 0 ? total + 1 : total,
      0
    );
    this.hist = hist;
    this.rmax = rmax;
    this.rmin = rmin;
    this.gmax = gmax;
    this.gmin = gmin;
    this.bmax = bmax;
    this.bmin = bmin;
  }
  get colorCount() {
    return this._colorCount;
  }
};

// node_modules/@vibrant/image/dist/esm/index.js
var ImageBase = class {
  scaleDown(opts) {
    const width = this.getWidth();
    const height = this.getHeight();
    let ratio = 1;
    if (opts.maxDimension > 0) {
      const maxSide = Math.max(width, height);
      if (maxSide > opts.maxDimension) ratio = opts.maxDimension / maxSide;
    } else {
      ratio = 1 / opts.quality;
    }
    if (ratio < 1) this.resize(width * ratio, height * ratio, ratio);
  }
};
function applyFilters(imageData, filters) {
  var _a;
  if (filters.length > 0) {
    const pixels = imageData.data;
    const n = pixels.length / 4;
    let offset;
    let r;
    let g;
    let b;
    let a2;
    for (let i2 = 0; i2 < n; i2++) {
      offset = i2 * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a2 = pixels[offset + 3];
      for (let j = 0; j < filters.length; j++) {
        if (!((_a = filters[j]) == null ? void 0 : _a.call(filters, r, g, b, a2))) {
          pixels[offset + 3] = 0;
          break;
        }
      }
    }
  }
  return imageData;
}

// node_modules/@vibrant/image-browser/dist/esm/index.js
function isRelativeUrl(url) {
  const u = new URL(url, location.href);
  return u.protocol === location.protocol && u.host === location.host && u.port === location.port;
}
function isSameOrigin(a2, b) {
  const ua = new URL(a2);
  const ub = new URL(b);
  return ua.protocol === ub.protocol && ua.hostname === ub.hostname && ua.port === ub.port;
}
var BrowserImage = class extends ImageBase {
  _getCanvas() {
    if (!this._canvas) {
      throw new Error("Canvas is not initialized");
    }
    return this._canvas;
  }
  _getContext() {
    if (!this._context) {
      throw new Error("Context is not initialized");
    }
    return this._context;
  }
  _getWidth() {
    if (!this._width) {
      throw new Error("Width is not initialized");
    }
    return this._width;
  }
  _getHeight() {
    if (!this._height) {
      throw new Error("Height is not initialized");
    }
    return this._height;
  }
  _initCanvas() {
    const img2 = this.image;
    if (!img2) {
      throw new Error("Image is not initialized");
    }
    const canvas = this._canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new ReferenceError("Failed to create canvas context");
    this._context = context;
    canvas.className = "@vibrant/canvas";
    canvas.style.display = "none";
    this._width = canvas.width = img2.width;
    this._height = canvas.height = img2.height;
    context.drawImage(img2, 0, 0);
    document.body.appendChild(canvas);
  }
  load(image) {
    let img2;
    let src2;
    if (typeof image === "string") {
      img2 = document.createElement("img");
      src2 = image;
      if (!isRelativeUrl(src2) && !isSameOrigin(window.location.href, src2)) {
        img2.crossOrigin = "anonymous";
      }
      img2.src = src2;
    } else if (image instanceof HTMLImageElement) {
      img2 = image;
      src2 = image.src;
    } else {
      return Promise.reject(
        new Error(`Cannot load buffer as an image in browser`)
      );
    }
    this.image = img2;
    return new Promise((resolve2, reject) => {
      const onImageLoad = () => {
        this._initCanvas();
        resolve2(this);
      };
      if (img2.complete) {
        onImageLoad();
      } else {
        img2.onload = onImageLoad;
        img2.onerror = (_e) => reject(new Error(`Fail to load image: ${src2}`));
      }
    });
  }
  clear() {
    this._getContext().clearRect(0, 0, this._getWidth(), this._getHeight());
  }
  update(imageData) {
    this._getContext().putImageData(imageData, 0, 0);
  }
  getWidth() {
    return this._getWidth();
  }
  getHeight() {
    return this._getHeight();
  }
  resize(targetWidth, targetHeight, ratio) {
    if (!this.image) {
      throw new Error("Image is not initialized");
    }
    this._width = this._getCanvas().width = targetWidth;
    this._height = this._getCanvas().height = targetHeight;
    this._getContext().scale(ratio, ratio);
    this._getContext().drawImage(this.image, 0, 0);
  }
  getPixelCount() {
    return this._getWidth() * this._getHeight();
  }
  getImageData() {
    return this._getContext().getImageData(
      0,
      0,
      this._getWidth(),
      this._getHeight()
    );
  }
  remove() {
    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
  }
};

// node_modules/@vibrant/core/dist/esm/utils.js
function assignDeep(target3, ...sources) {
  sources.forEach((s) => {
    if (!s) return;
    for (const key3 in s) {
      if (s.hasOwnProperty(key3)) {
        const v = s[key3];
        if (Array.isArray(v)) {
          target3[key3] = v.slice(0);
        } else if (typeof v === "object") {
          if (!target3[key3]) target3[key3] = {};
          assignDeep(target3[key3], v);
        } else {
          target3[key3] = v;
        }
      }
    }
  });
  return target3;
}

// node_modules/@vibrant/core/dist/esm/options.js
function buildProcessOptions(opts, override) {
  const { colorCount, quantizer, generators, filters } = opts;
  const commonQuantizerOpts = { colorCount };
  const q = typeof quantizer === "string" ? { name: quantizer, options: {} } : quantizer;
  q.options = assignDeep({}, commonQuantizerOpts, q.options);
  return assignDeep(
    {},
    {
      quantizer: q,
      generators,
      filters
    },
    override
  );
}

// node_modules/@vibrant/core/dist/esm/builder.js
var Builder = class {
  /**
   * Arguments are the same as `Vibrant.constructor`.
   */
  constructor(src2, opts = {}) {
    this._src = src2;
    this._opts = assignDeep({}, Vibrant.DefaultOpts, opts);
  }
  /**
   * Sets `opts.colorCount` to `n`.
   * @returns this `Builder` instance.
   */
  maxColorCount(n) {
    this._opts.colorCount = n;
    return this;
  }
  /**
   * Sets `opts.maxDimension` to `d`.
   * @returns this `Builder` instance.
   */
  maxDimension(d) {
    this._opts.maxDimension = d;
    return this;
  }
  /**
   * Adds a filter function
   * @returns this `Builder` instance.
   */
  addFilter(name2) {
    if (!this._opts.filters) {
      this._opts.filters = [name2];
    } else {
      this._opts.filters.push(name2);
    }
    return this;
  }
  /**
   * Removes a filter function.
   * @returns this `Builder` instance.
   */
  removeFilter(name2) {
    if (this._opts.filters) {
      const i2 = this._opts.filters.indexOf(name2);
      if (i2 > 0) this._opts.filters.splice(i2);
    }
    return this;
  }
  /**
   * Clear all filters.
   * @returns this `Builder` instance.
   */
  clearFilters() {
    this._opts.filters = [];
    return this;
  }
  /**
   * Sets `opts.quality` to `q`.
   * @returns this `Builder` instance.
   */
  quality(q) {
    this._opts.quality = q;
    return this;
  }
  /**
   * Specifies which `Image` implementation class to use.
   * @returns this `Builder` instance.
   */
  useImageClass(imageClass) {
    this._opts.ImageClass = imageClass;
    return this;
  }
  /**
   * Sets `opts.generator` to `generator`
   * @returns this `Builder` instance.
   */
  useGenerator(generator, options) {
    if (!this._opts.generators) this._opts.generators = [];
    this._opts.generators.push(
      options ? { name: generator, options } : generator
    );
    return this;
  }
  /**
   * Specifies which `Quantizer` implementation class to use
   * @returns this `Builder` instance.
   */
  useQuantizer(quantizer, options) {
    this._opts.quantizer = options ? { name: quantizer, options } : quantizer;
    return this;
  }
  /**
   * Builds and returns a `Vibrant` instance as configured.
   */
  build() {
    return new Vibrant(this._src, this._opts);
  }
  /**
   * Builds a `Vibrant` instance as configured and calls its `getPalette` method.
   */
  getPalette() {
    return this.build().getPalette();
  }
};

// node_modules/@vibrant/core/dist/esm/pipeline/index.js
var Stage = class {
  constructor(pipeline2) {
    this.pipeline = pipeline2;
    this._map = {};
  }
  names() {
    return Object.keys(this._map);
  }
  has(name2) {
    return !!this._map[name2];
  }
  get(name2) {
    return this._map[name2];
  }
  register(name2, stageFn) {
    this._map[name2] = stageFn;
    return this.pipeline;
  }
};
var BasicPipeline = class {
  constructor() {
    this.filter = new Stage(this);
    this.quantizer = new Stage(this);
    this.generator = new Stage(this);
  }
  _buildProcessTasks({
    filters,
    quantizer,
    generators
  }) {
    if (generators.length === 1 && generators[0] === "*") {
      generators = this.generator.names();
    }
    return {
      filters: filters.map((f) => createTask(this.filter, f)),
      quantizer: createTask(this.quantizer, quantizer),
      generators: generators.map((g) => createTask(this.generator, g))
    };
    function createTask(stage, o) {
      let name2;
      let options;
      if (typeof o === "string") {
        name2 = o;
      } else {
        name2 = o.name;
        options = o.options;
      }
      return {
        name: name2,
        fn: stage.get(name2),
        options
      };
    }
  }
  async process(imageData, opts) {
    const { filters, quantizer, generators } = this._buildProcessTasks(opts);
    const imageFilterData = await this._filterColors(filters, imageData);
    const colors = await this._generateColors(quantizer, imageFilterData);
    const palettes = await this._generatePalettes(generators, colors);
    return {
      colors,
      palettes
    };
  }
  _filterColors(filters, imageData) {
    return Promise.resolve(
      applyFilters(
        imageData,
        filters.map(({ fn }) => fn)
      )
    );
  }
  _generateColors(quantizer, imageData) {
    return Promise.resolve(quantizer.fn(imageData.data, quantizer.options));
  }
  async _generatePalettes(generators, colors) {
    const promiseArr = await Promise.all(
      generators.map(({ fn, options }) => Promise.resolve(fn(colors, options)))
    );
    return Promise.resolve(
      promiseArr.reduce(
        (promises, promiseVal, i2) => {
          promises[generators[i2].name] = promiseVal;
          return promises;
        },
        {}
      )
    );
  }
};

// node_modules/@vibrant/color/dist/esm/converter.js
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max3 = Math.max(r, g, b);
  const min2 = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max3 + min2) / 2;
  if (max3 !== min2) {
    const d = max3 - min2;
    s = l > 0.5 ? d / (2 - max3 - min2) : d / (max3 + min2);
    switch (max3) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}
function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;
  function hue2rgb(p2, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p2 + (q - p2) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p2 + (q - p2) * (2 / 3 - t) * 6;
    return p2;
  }
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p2 = 2 * l - q;
    r = hue2rgb(p2, q, h + 1 / 3);
    g = hue2rgb(p2, q, h);
    b = hue2rgb(p2, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

// node_modules/@vibrant/color/dist/esm/index.js
var Swatch = class _Swatch {
  static applyFilters(colors, filters) {
    return filters.length > 0 ? colors.filter(({ r, g, b }) => {
      var _a;
      for (let j = 0; j < filters.length; j++) {
        if (!((_a = filters[j]) == null ? void 0 : _a.call(filters, r, g, b, 255))) return false;
      }
      return true;
    }) : colors;
  }
  /**
   * Make a value copy of a swatch based on a previous one. Returns a new Swatch instance
   * @param {Swatch} swatch
   */
  static clone(swatch) {
    return new _Swatch(swatch._rgb, swatch._population);
  }
  /**
   * The red value in the RGB value
   */
  get r() {
    return this._rgb[0];
  }
  /**
   * The green value in the RGB value
   */
  get g() {
    return this._rgb[1];
  }
  /**
   * The blue value in the RGB value
   */
  get b() {
    return this._rgb[2];
  }
  /**
   * The color value as a rgb value
   */
  get rgb() {
    return this._rgb;
  }
  /**
   * The color value as a hsl value
   */
  get hsl() {
    if (!this._hsl) {
      const [r, g, b] = this._rgb;
      this._hsl = rgbToHsl(r, g, b);
    }
    return this._hsl;
  }
  /**
   * The color value as a hex string
   */
  get hex() {
    if (!this._hex) {
      const [r, g, b] = this._rgb;
      this._hex = rgbToHex(r, g, b);
    }
    return this._hex;
  }
  get population() {
    return this._population;
  }
  /**
   * Get the JSON object for the swatch
   */
  toJSON() {
    return {
      rgb: this.rgb,
      population: this.population
    };
  }
  getYiq() {
    if (!this._yiq) {
      const rgb = this._rgb;
      this._yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1e3;
    }
    return this._yiq;
  }
  /**
   * Returns an appropriate color to use for any 'title' text which is displayed over this Swatch's color.
   */
  get titleTextColor() {
    if (!this._titleTextColor) {
      this._titleTextColor = this.getYiq() < 200 ? "#fff" : "#000";
    }
    return this._titleTextColor;
  }
  /**
   * Returns an appropriate color to use for any 'body' text which is displayed over this Swatch's color.
   */
  get bodyTextColor() {
    if (!this._bodyTextColor) {
      this._bodyTextColor = this.getYiq() < 150 ? "#fff" : "#000";
    }
    return this._bodyTextColor;
  }
  /**
   * Internal use.
   * @param rgb `[r, g, b]`
   * @param population Population of the color in an image
   */
  constructor(rgb, population) {
    this._rgb = rgb;
    this._population = population;
  }
};

// node_modules/@vibrant/core/dist/esm/index.js
var _Vibrant = class _Vibrant2 {
  /**
   *
   * @param _src Path to image file (supports HTTP/HTTPs)
   * @param opts Options (optional)
   */
  constructor(_src, opts) {
    this._src = _src;
    this.opts = assignDeep({}, _Vibrant2.DefaultOpts, opts);
  }
  static use(pipeline2) {
    this._pipeline = pipeline2;
  }
  static from(src2) {
    return new Builder(src2);
  }
  get result() {
    return this._result;
  }
  _process(image, opts) {
    image.scaleDown(this.opts);
    const processOpts = buildProcessOptions(this.opts, opts);
    return _Vibrant2._pipeline.process(image.getImageData(), processOpts);
  }
  async getPalette() {
    const image = new this.opts.ImageClass();
    try {
      const image1 = await image.load(this._src);
      const result1 = await this._process(image1, {
        generators: ["default"]
      });
      this._result = result1;
      const res = result1.palettes["default"];
      if (!res) {
        throw new Error(
          `Something went wrong and a palette was not found, please file a bug against our GitHub repo: https://github.com/vibrant-Colors/node-vibrant/`
        );
      }
      image.remove();
      return res;
    } catch (err) {
      image.remove();
      return Promise.reject(err);
    }
  }
  async getPalettes() {
    const image = new this.opts.ImageClass();
    try {
      const image1 = await image.load(this._src);
      const result1 = await this._process(image1, {
        generators: ["*"]
      });
      this._result = result1;
      const res = result1.palettes;
      image.remove();
      return res;
    } catch (err) {
      image.remove();
      return Promise.reject(err);
    }
  }
};
_Vibrant.DefaultOpts = {
  colorCount: 64,
  quality: 5,
  filters: []
};
var Vibrant = _Vibrant;

// node_modules/node-vibrant/dist/esm/configs/config.js
Vibrant.DefaultOpts.quantizer = "mmcq";
Vibrant.DefaultOpts.generators = ["default"];
Vibrant.DefaultOpts.filters = ["default"];

// node_modules/node-vibrant/dist/esm/configs/browser.js
Vibrant.DefaultOpts.ImageClass = BrowserImage;

// node_modules/@vibrant/quantizer-mmcq/dist/esm/vbox.js
var SIGBITS = 5;
var RSHIFT = 8 - SIGBITS;
var VBox = class _VBox {
  constructor(r1, r2, g1, g2, b1, b2, histogram) {
    this.histogram = histogram;
    this._volume = -1;
    this._avg = null;
    this._count = -1;
    this.dimension = { r1, r2, g1, g2, b1, b2 };
  }
  static build(pixels) {
    const h = new Histogram(pixels, { sigBits: SIGBITS });
    const { rmin, rmax, gmin, gmax, bmin, bmax } = h;
    return new _VBox(rmin, rmax, gmin, gmax, bmin, bmax, h);
  }
  invalidate() {
    this._volume = this._count = -1;
    this._avg = null;
  }
  volume() {
    if (this._volume < 0) {
      const { r1, r2, g1, g2, b1, b2 } = this.dimension;
      this._volume = (r2 - r1 + 1) * (g2 - g1 + 1) * (b2 - b1 + 1);
    }
    return this._volume;
  }
  count() {
    if (this._count < 0) {
      const { hist, getColorIndex } = this.histogram;
      const { r1, r2, g1, g2, b1, b2 } = this.dimension;
      let c = 0;
      for (let r = r1; r <= r2; r++) {
        for (let g = g1; g <= g2; g++) {
          for (let b = b1; b <= b2; b++) {
            const index5 = getColorIndex(r, g, b);
            if (!hist[index5]) {
              continue;
            }
            c += hist[index5];
          }
        }
      }
      this._count = c;
    }
    return this._count;
  }
  clone() {
    const { histogram } = this;
    const { r1, r2, g1, g2, b1, b2 } = this.dimension;
    return new _VBox(r1, r2, g1, g2, b1, b2, histogram);
  }
  avg() {
    if (!this._avg) {
      const { hist, getColorIndex } = this.histogram;
      const { r1, r2, g1, g2, b1, b2 } = this.dimension;
      let ntot = 0;
      const mult = 1 << 8 - SIGBITS;
      let rsum;
      let gsum;
      let bsum;
      rsum = gsum = bsum = 0;
      for (let r = r1; r <= r2; r++) {
        for (let g = g1; g <= g2; g++) {
          for (let b = b1; b <= b2; b++) {
            const index5 = getColorIndex(r, g, b);
            const h = hist[index5];
            if (!h) continue;
            ntot += h;
            rsum += h * (r + 0.5) * mult;
            gsum += h * (g + 0.5) * mult;
            bsum += h * (b + 0.5) * mult;
          }
        }
      }
      if (ntot) {
        this._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
      } else {
        this._avg = [
          ~~(mult * (r1 + r2 + 1) / 2),
          ~~(mult * (g1 + g2 + 1) / 2),
          ~~(mult * (b1 + b2 + 1) / 2)
        ];
      }
    }
    return this._avg;
  }
  contains(rgb) {
    let [r, g, b] = rgb;
    const { r1, r2, g1, g2, b1, b2 } = this.dimension;
    r >>= RSHIFT;
    g >>= RSHIFT;
    b >>= RSHIFT;
    return r >= r1 && r <= r2 && g >= g1 && g <= g2 && b >= b1 && b <= b2;
  }
  split() {
    const { hist, getColorIndex } = this.histogram;
    const { r1, r2, g1, g2, b1, b2 } = this.dimension;
    const count = this.count();
    if (!count) return [];
    if (count === 1) return [this.clone()];
    const rw = r2 - r1 + 1;
    const gw = g2 - g1 + 1;
    const bw = b2 - b1 + 1;
    const maxw = Math.max(rw, gw, bw);
    let accSum = null;
    let sum;
    let total;
    sum = total = 0;
    let maxd = null;
    if (maxw === rw) {
      maxd = "r";
      accSum = new Uint32Array(r2 + 1);
      for (let r = r1; r <= r2; r++) {
        sum = 0;
        for (let g = g1; g <= g2; g++) {
          for (let b = b1; b <= b2; b++) {
            const index5 = getColorIndex(r, g, b);
            if (!hist[index5]) continue;
            sum += hist[index5];
          }
        }
        total += sum;
        accSum[r] = total;
      }
    } else if (maxw === gw) {
      maxd = "g";
      accSum = new Uint32Array(g2 + 1);
      for (let g = g1; g <= g2; g++) {
        sum = 0;
        for (let r = r1; r <= r2; r++) {
          for (let b = b1; b <= b2; b++) {
            const index5 = getColorIndex(r, g, b);
            if (!hist[index5]) continue;
            sum += hist[index5];
          }
        }
        total += sum;
        accSum[g] = total;
      }
    } else {
      maxd = "b";
      accSum = new Uint32Array(b2 + 1);
      for (let b = b1; b <= b2; b++) {
        sum = 0;
        for (let r = r1; r <= r2; r++) {
          for (let g = g1; g <= g2; g++) {
            const index5 = getColorIndex(r, g, b);
            if (!hist[index5]) continue;
            sum += hist[index5];
          }
        }
        total += sum;
        accSum[b] = total;
      }
    }
    let splitPoint = -1;
    const reverseSum = new Uint32Array(accSum.length);
    for (let i2 = 0; i2 < accSum.length; i2++) {
      const d = accSum[i2];
      if (!d) continue;
      if (splitPoint < 0 && d > total / 2) splitPoint = i2;
      reverseSum[i2] = total - d;
    }
    const vbox = this;
    function doCut(d) {
      const dim1 = d + "1";
      const dim2 = d + "2";
      const d1 = vbox.dimension[dim1];
      let d2 = vbox.dimension[dim2];
      const vbox1 = vbox.clone();
      const vbox2 = vbox.clone();
      const left = splitPoint - d1;
      const right = d2 - splitPoint;
      if (left <= right) {
        d2 = Math.min(d2 - 1, ~~(splitPoint + right / 2));
        d2 = Math.max(0, d2);
      } else {
        d2 = Math.max(d1, ~~(splitPoint - 1 - left / 2));
        d2 = Math.min(vbox.dimension[dim2], d2);
      }
      while (!accSum[d2]) d2++;
      let c2 = reverseSum[d2];
      while (!c2 && accSum[d2 - 1]) c2 = reverseSum[--d2];
      vbox1.dimension[dim2] = d2;
      vbox2.dimension[dim1] = d2 + 1;
      return [vbox1, vbox2];
    }
    return doCut(maxd);
  }
};

// node_modules/@vibrant/quantizer-mmcq/dist/esm/pqueue.js
var PQueue = class {
  _sort() {
    if (!this._sorted) {
      this.contents.sort(this._comparator);
      this._sorted = true;
    }
  }
  constructor(comparator) {
    this._comparator = comparator;
    this.contents = [];
    this._sorted = false;
  }
  push(item) {
    this.contents.push(item);
    this._sorted = false;
  }
  peek(index5) {
    this._sort();
    index5 = typeof index5 === "number" ? index5 : this.contents.length - 1;
    return this.contents[index5];
  }
  pop() {
    this._sort();
    return this.contents.pop();
  }
  size() {
    return this.contents.length;
  }
  map(mapper) {
    this._sort();
    return this.contents.map(mapper);
  }
};

// node_modules/@vibrant/quantizer-mmcq/dist/esm/index.js
var fractByPopulations = 0.75;
function _splitBoxes(pq, target3) {
  let lastSize = pq.size();
  while (pq.size() < target3) {
    const vbox = pq.pop();
    if (vbox && vbox.count() > 0) {
      const [vbox1, vbox2] = vbox.split();
      if (!vbox1) break;
      pq.push(vbox1);
      if (vbox2 && vbox2.count() > 0) pq.push(vbox2);
      if (pq.size() === lastSize) {
        break;
      } else {
        lastSize = pq.size();
      }
    } else {
      break;
    }
  }
}
var MMCQ = (pixels, opts) => {
  if (pixels.length === 0 || opts.colorCount < 2 || opts.colorCount > 256) {
    throw new Error("Wrong MMCQ parameters");
  }
  const vbox = VBox.build(pixels);
  vbox.histogram.colorCount;
  const pq = new PQueue((a2, b) => a2.count() - b.count());
  pq.push(vbox);
  _splitBoxes(pq, fractByPopulations * opts.colorCount);
  const pq2 = new PQueue(
    (a2, b) => a2.count() * a2.volume() - b.count() * b.volume()
  );
  pq2.contents = pq.contents;
  _splitBoxes(pq2, opts.colorCount - pq2.size());
  return generateSwatches(pq2);
};
function generateSwatches(pq) {
  const swatches = [];
  while (pq.size()) {
    const v = pq.pop();
    const color = v.avg();
    swatches.push(new Swatch(color, v.count()));
  }
  return swatches;
}

// node_modules/@vibrant/generator-default/dist/esm/index.js
var DefaultOpts = {
  targetDarkLuma: 0.26,
  maxDarkLuma: 0.45,
  minLightLuma: 0.55,
  targetLightLuma: 0.74,
  minNormalLuma: 0.3,
  targetNormalLuma: 0.5,
  maxNormalLuma: 0.7,
  targetMutesSaturation: 0.3,
  maxMutesSaturation: 0.4,
  targetVibrantSaturation: 1,
  minVibrantSaturation: 0.35,
  weightSaturation: 3,
  weightLuma: 6.5,
  weightPopulation: 0.5
};
function _findMaxPopulation(swatches) {
  let p2 = 0;
  swatches.forEach((s) => {
    p2 = Math.max(p2, s.population);
  });
  return p2;
}
function _isAlreadySelected(palette3, s) {
  return palette3.Vibrant === s || palette3.DarkVibrant === s || palette3.LightVibrant === s || palette3.Muted === s || palette3.DarkMuted === s || palette3.LightMuted === s;
}
function _createComparisonValue(saturation, targetSaturation, luma, targetLuma, population, maxPopulation, opts) {
  function weightedMean(...values3) {
    let sum = 0;
    let weightSum = 0;
    for (let i2 = 0; i2 < values3.length; i2 += 2) {
      const value3 = values3[i2];
      const weight = values3[i2 + 1];
      if (!value3 || !weight) continue;
      sum += value3 * weight;
      weightSum += weight;
    }
    return sum / weightSum;
  }
  function invertDiff(value3, targetValue) {
    return 1 - Math.abs(value3 - targetValue);
  }
  return weightedMean(
    invertDiff(saturation, targetSaturation),
    opts.weightSaturation,
    invertDiff(luma, targetLuma),
    opts.weightLuma,
    population / maxPopulation,
    opts.weightPopulation
  );
}
function _findColorVariation(palette3, swatches, maxPopulation, targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation, opts) {
  let max3 = null;
  let maxValue = 0;
  swatches.forEach((swatch) => {
    const [, s, l] = swatch.hsl;
    if (s >= minSaturation && s <= maxSaturation && l >= minLuma && l <= maxLuma && !_isAlreadySelected(palette3, swatch)) {
      const value3 = _createComparisonValue(
        s,
        targetSaturation,
        l,
        targetLuma,
        swatch.population,
        maxPopulation,
        opts
      );
      if (max3 === null || value3 > maxValue) {
        max3 = swatch;
        maxValue = value3;
      }
    }
  });
  return max3;
}
function _generateVariationColors(swatches, maxPopulation, opts) {
  const palette3 = {
    Vibrant: null,
    DarkVibrant: null,
    LightVibrant: null,
    Muted: null,
    DarkMuted: null,
    LightMuted: null
  };
  palette3.Vibrant = _findColorVariation(
    palette3,
    swatches,
    maxPopulation,
    opts.targetNormalLuma,
    opts.minNormalLuma,
    opts.maxNormalLuma,
    opts.targetVibrantSaturation,
    opts.minVibrantSaturation,
    1,
    opts
  );
  palette3.LightVibrant = _findColorVariation(
    palette3,
    swatches,
    maxPopulation,
    opts.targetLightLuma,
    opts.minLightLuma,
    1,
    opts.targetVibrantSaturation,
    opts.minVibrantSaturation,
    1,
    opts
  );
  palette3.DarkVibrant = _findColorVariation(
    palette3,
    swatches,
    maxPopulation,
    opts.targetDarkLuma,
    0,
    opts.maxDarkLuma,
    opts.targetVibrantSaturation,
    opts.minVibrantSaturation,
    1,
    opts
  );
  palette3.Muted = _findColorVariation(
    palette3,
    swatches,
    maxPopulation,
    opts.targetNormalLuma,
    opts.minNormalLuma,
    opts.maxNormalLuma,
    opts.targetMutesSaturation,
    0,
    opts.maxMutesSaturation,
    opts
  );
  palette3.LightMuted = _findColorVariation(
    palette3,
    swatches,
    maxPopulation,
    opts.targetLightLuma,
    opts.minLightLuma,
    1,
    opts.targetMutesSaturation,
    0,
    opts.maxMutesSaturation,
    opts
  );
  palette3.DarkMuted = _findColorVariation(
    palette3,
    swatches,
    maxPopulation,
    opts.targetDarkLuma,
    0,
    opts.maxDarkLuma,
    opts.targetMutesSaturation,
    0,
    opts.maxMutesSaturation,
    opts
  );
  return palette3;
}
function _generateEmptySwatches(palette3, _maxPopulation, opts) {
  if (!palette3.Vibrant && !palette3.DarkVibrant && !palette3.LightVibrant) {
    if (!palette3.DarkVibrant && palette3.DarkMuted) {
      let [h, s, l] = palette3.DarkMuted.hsl;
      l = opts.targetDarkLuma;
      palette3.DarkVibrant = new Swatch(hslToRgb(h, s, l), 0);
    }
    if (!palette3.LightVibrant && palette3.LightMuted) {
      let [h, s, l] = palette3.LightMuted.hsl;
      l = opts.targetDarkLuma;
      palette3.DarkVibrant = new Swatch(hslToRgb(h, s, l), 0);
    }
  }
  if (!palette3.Vibrant && palette3.DarkVibrant) {
    let [h, s, l] = palette3.DarkVibrant.hsl;
    l = opts.targetNormalLuma;
    palette3.Vibrant = new Swatch(hslToRgb(h, s, l), 0);
  } else if (!palette3.Vibrant && palette3.LightVibrant) {
    let [h, s, l] = palette3.LightVibrant.hsl;
    l = opts.targetNormalLuma;
    palette3.Vibrant = new Swatch(hslToRgb(h, s, l), 0);
  }
  if (!palette3.DarkVibrant && palette3.Vibrant) {
    let [h, s, l] = palette3.Vibrant.hsl;
    l = opts.targetDarkLuma;
    palette3.DarkVibrant = new Swatch(hslToRgb(h, s, l), 0);
  }
  if (!palette3.LightVibrant && palette3.Vibrant) {
    let [h, s, l] = palette3.Vibrant.hsl;
    l = opts.targetLightLuma;
    palette3.LightVibrant = new Swatch(hslToRgb(h, s, l), 0);
  }
  if (!palette3.Muted && palette3.Vibrant) {
    let [h, s, l] = palette3.Vibrant.hsl;
    l = opts.targetMutesSaturation;
    palette3.Muted = new Swatch(hslToRgb(h, s, l), 0);
  }
  if (!palette3.DarkMuted && palette3.DarkVibrant) {
    let [h, s, l] = palette3.DarkVibrant.hsl;
    l = opts.targetMutesSaturation;
    palette3.DarkMuted = new Swatch(hslToRgb(h, s, l), 0);
  }
  if (!palette3.LightMuted && palette3.LightVibrant) {
    let [h, s, l] = palette3.LightVibrant.hsl;
    l = opts.targetMutesSaturation;
    palette3.LightMuted = new Swatch(hslToRgb(h, s, l), 0);
  }
}
var DefaultGenerator = (swatches, opts) => {
  opts = Object.assign({}, DefaultOpts, opts);
  const maxPopulation = _findMaxPopulation(swatches);
  const palette3 = _generateVariationColors(swatches, maxPopulation, opts);
  _generateEmptySwatches(palette3, maxPopulation, opts);
  return palette3;
};

// node_modules/node-vibrant/dist/esm/pipeline/index.js
var pipeline = new BasicPipeline().filter.register(
  "default",
  (r, g, b, a2) => a2 >= 125 && !(r > 250 && g > 250 && b > 250)
).quantizer.register("mmcq", MMCQ).generator.register("default", DefaultGenerator);

// node_modules/node-vibrant/dist/esm/browser.js
Vibrant.use(pipeline);

// build/dev/javascript/somachord/vibrant.ffi.mjs
function palette(imageURL) {
  return Vibrant.from(imageURL).getPalette();
}
function vibrant(palette3) {
  return palette3.Vibrant;
}
function muted(palette3) {
  return palette3.Muted;
}
function dark_muted(palette3) {
  return palette3.DarkMuted;
}
function swatch_hex(swatch) {
  return swatch.hex;
}

// build/dev/javascript/somachord/vibrant.mjs
function palette2(image_url, on_palette) {
  return from(
    (dispatch) => {
      let $ = then_await(
        palette(image_url),
        (res) => {
          return resolve(dispatch(on_palette(new Ok(res))));
        }
      );
      return void 0;
    }
  );
}

// build/dev/javascript/somachord/somachord/elements.mjs
var FILEPATH7 = "src/somachord/elements.gleam";
function waveform(attrs) {
  return unsafe_raw_html(
    "",
    "waveform",
    attrs,
    "\n<svg width='32' height='32' viewBox='0 0 120 100' xmlns='http://www.w3.org/2000/svg'>\n  <rect x='20' y='90' width='5' height='0'>\n    <animate attributeName='height' values='0; 60; 10; 40; 0' dur='1.2s' repeatCount='indefinite' keyTimes='0; 0.3; 0.6; 0.8; 1'></animate>\n    <animate attributeName='y' values='90; 30; 80; 50; 90' dur='1.2s' repeatCount='indefinite' keyTimes='0; 0.3; 0.6; 0.8; 1'></animate>\n  </rect>\n\n  <rect x='40' y='90' width='5' height='0'>\n    <animate attributeName='height' values='0; 45; 20; 70; 0' dur='1.3s' repeatCount='indefinite' keyTimes='0; 0.2; 0.5; 0.85; 1'></animate>\n    <animate attributeName='y' values='90; 45; 70; 20; 90' dur='1.3s' repeatCount='indefinite' keyTimes='0; 0.2; 0.5; 0.85; 1'></animate>\n  </rect>\n\n  <rect x='60' y='90' width='5' height='0'>\n    <animate attributeName='height' values='0; 70; 30; 50; 0' dur='1.1s' repeatCount='indefinite' keyTimes='0; 0.4; 0.7; 0.9; 1'></animate>\n    <animate attributeName='y' values='90; 20; 60; 40; 90' dur='1.1s' repeatCount='indefinite' keyTimes='0; 0.4; 0.7; 0.9; 1'></animate>\n  </rect>\n</svg>\n    "
  );
}
function song2(song3, attrs, cover_art, msg) {
  let _block;
  {
    let _block$1;
    let _pipe = create();
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH7,
        "somachord/elements",
        35,
        "song",
        "Pattern match failed, no pattern matched the value.",
        { value: $, start: 921, end: 981, pattern_start: 932, pattern_end: 939 }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  let layout2 = layout();
  return div(
    prepend(
      (() => {
        if (layout2 instanceof Desktop) {
          return none();
        } else {
          return class$(
            "duration-50 transition-all active:scale-[98%]"
          );
        }
      })(),
      prepend(
        class$(
          "before:-mr-4 before:content-[attr(data-index)] before:w-2 before:text-zinc-600 before:font-[Azeret_Mono] before:font-light before:text-sm before:text-right before:self-center hover:before:invisible data-playing:before:invisible"
        ),
        prepend(
          class$(
            "select-none group [.has-dynamic-color]:hover:bg-(--dynamic-color)/35! hover:bg-zinc-800 rounded-md p-2 -mt-3 flex gap-2"
          ),
          prepend(
            on("dblclick", success(msg)),
            prepend(
              (() => {
                if (layout2 instanceof Desktop) {
                  return none();
                } else {
                  return on_click(msg);
                }
              })(),
              attrs
            )
          )
        )
      )
    ),
    toList([
      div(
        toList([class$("flex flex-grow gap-4 items-center")]),
        toList([
          div(
            toList([
              class$(
                "group-data-[index=-1]:hidden not-group-data-index:hidden w-5 grid grid-rows-1 grid-cols-1"
              )
            ]),
            toList([
              waveform(
                toList([
                  class$(
                    "group-hover:hidden not-group-data-playing:hidden col-start-1 row-start-1 group-[.has-dynamic-color]:fill-(--dynamic-color)! fill-violet-400"
                  )
                ])
              ),
              i(
                toList([
                  on_click(msg),
                  class$(
                    "text-sm col-start-1 row-start-1 ph-fill ph-play hidden group-hover:block"
                  )
                ]),
                toList([])
              )
            ])
          ),
          div(
            toList([class$("flex gap-2 items-center")]),
            toList([
              (() => {
                if (cover_art) {
                  return img(
                    toList([
                      class$("w-12 h-12 rounded-sm select-none"),
                      src(
                        cover_url(auth_details, song3.cover_art_id, 500)
                      )
                    ])
                  );
                } else {
                  return none3();
                }
              })(),
              div(
                toList([
                  class$("flex flex-col gap-0.5 justify-center")
                ]),
                toList([
                  (() => {
                    let $ = span(
                      toList([
                        class$(
                          "group-[.has-dynamic-color]:group-data-playing:text-(--dynamic-color)! text-violet-400 not-group-data-playing:text-zinc-100 select-none text-wrap text-sm hover:underline"
                        )
                      ]),
                      toList([text2(song3.title)])
                    );
                    if (layout2 instanceof Desktop) {
                      let elem = $;
                      return a(
                        toList([href("/song/" + song3.id)]),
                        toList([elem])
                      );
                    } else {
                      return $;
                    }
                  })(),
                  span(
                    toList([
                      class$(
                        "select-none text-sm text-zinc-500 font-light"
                      )
                    ]),
                    (() => {
                      let _pipe = map(
                        song3.artists,
                        (artist2) => {
                          let elem = span(
                            toList([class$("hover:underline")]),
                            toList([text2(artist2.name)])
                          );
                          if (layout2 instanceof Desktop) {
                            return a(
                              toList([href("/artist/" + artist2.id)]),
                              toList([elem])
                            );
                          } else {
                            return elem;
                          }
                        }
                      );
                      return intersperse(_pipe, text2(", "));
                    })()
                  )
                ])
              )
            ])
          )
        ])
      ),
      div(
        toList([class$("flex gap-4 items-center")]),
        toList([
          span(
            toList([
              class$(
                "font-[Azeret_Mono] select-none font-light text-zinc-500 text-sm"
              )
            ]),
            toList([
              text2(
                (() => {
                  let minutes2 = globalThis.Math.trunc(song3.duration / 60);
                  let seconds3 = song3.duration % 60;
                  return to_string2(minutes2) + ":" + (() => {
                    let _pipe = to_string2(seconds3);
                    return pad_start(_pipe, 2, "0");
                  })();
                })()
              )
            ])
          ),
          div(
            toList([class$("flex items-center")]),
            toList([])
          )
        ])
      )
    ])
  );
}
function playlist2(playlist3, handler) {
  let _block;
  {
    let _block$1;
    let _pipe = create();
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH7,
        "somachord/elements",
        288,
        "playlist",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 9471,
          end: 9531,
          pattern_start: 9482,
          pattern_end: 9489
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return div(
    toList([
      class$(
        "flex flex-col flex-none w-42 gap-2 group p-2 rounded hover:bg-zinc-900/75"
      ),
      on("dblclick", success(handler(playlist3.id)))
    ]),
    toList([
      div(
        toList([
          class$("relative mt-4 h-42"),
          style("clip-path", "inset(0 0 0 0);")
        ]),
        toList([
          div(
            toList([
              class$(
                "w-34 h-28 -mt-2 mx-2 bg-zinc-700 rounded-md absolute"
              )
            ]),
            toList([])
          ),
          a(
            toList([href("/playlist/" + playlist3.id)]),
            toList([
              (() => {
                let $ = playlist3.cover_art_id;
                let $1 = class$(
                  "border-t-2 border-zinc-900/75 group-hover:border-zinc-900 object-cover rounded-md absolute"
                );
                if ($ === "") {
                  let classes = $1;
                  return div(
                    toList([
                      classes,
                      class$(
                        "bg-zinc-900 justify-center items-center flex w-full h-fit aspect-square"
                      )
                    ]),
                    toList([
                      i(
                        toList([
                          class$(
                            "text-zinc-500 text-3xl ph ph-music-notes-simple"
                          )
                        ]),
                        toList([])
                      )
                    ])
                  );
                } else {
                  let cover_art_id = $;
                  let classes = $1;
                  return img(
                    toList([
                      src(
                        cover_url(auth_details, cover_art_id, 500)
                      ),
                      classes
                    ])
                  );
                }
              })()
            ])
          ),
          div(
            toList([
              on_click(handler(playlist3.id)),
              class$(
                "absolute top-26 left-26 relative transition duration-250 ease-out translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              )
            ]),
            toList([
              div(
                toList([class$("rounded-full bg-black w-8 h-8")]),
                toList([])
              ),
              i(
                toList([
                  class$(
                    "absolute -top-2 -left-2 ph-fill ph-play-circle text-5xl text-violet-500"
                  )
                ]),
                toList([])
              )
            ])
          )
        ])
      ),
      span(
        toList([class$("inline-flex flex-col")]),
        toList([
          a(
            toList([
              href("/playlist/" + playlist3.id),
              class$("space-x-1")
            ]),
            toList([
              span(
                toList([class$("text-zinc-100 hover:underline")]),
                toList([text2(playlist3.name)])
              )
            ])
          ),
          span(
            toList([class$("text-zinc-500 font-light text-sm")]),
            toList([
              text2(
                to_string2(playlist3.song_count) + " song" + (() => {
                  let $ = playlist3.song_count === 1;
                  if ($) {
                    return "";
                  } else {
                    return "s";
                  }
                })()
              )
            ])
          )
        ])
      )
    ])
  );
}
function tag(name2) {
  return div(
    toList([class$("rounded-full border border-zinc-400 py-2 px-6")]),
    toList([
      span(
        toList([class$("text-zinc-400 text-light text-xs")]),
        toList([text2(name2)])
      )
    ])
  );
}
function time2(duration, attrs) {
  return span(
    attrs,
    toList([
      text2(
        (() => {
          let minutes2 = globalThis.Math.trunc(duration / 60);
          let seconds3 = duration % 60;
          return to_string2(minutes2) + ":" + (() => {
            let _pipe = to_string2(seconds3);
            return pad_start(_pipe, 2, "0");
          })();
        })()
      )
    ])
  );
}
function nav_button(inactive, active2, name2, is_active, attrs) {
  return div(
    prepend(
      class$(
        "w-52 font-normal flex gap-2 items-center hover:bg-zinc-900 px-4 py-2 rounded-lg"
      ),
      prepend(
        (() => {
          if (is_active) {
            return class$("bg-zinc-900 text-zinc-100");
          } else {
            return class$("font-semibold text-zinc-500");
          }
        })(),
        attrs
      )
    ),
    toList([
      div(
        toList([class$("h-8 w-8")]),
        toList([
          (() => {
            if (is_active) {
              return active2;
            } else {
              return inactive;
            }
          })()
        ])
      ),
      h1(toList([]), toList([text2(name2)]))
    ])
  );
}
function music_slider(m, dynamic2, attrs) {
  return div(
    prepend(class$("grid grid-cols-1 grid-rows-1"), attrs),
    toList([
      div(
        toList([
          class$("col-start-1 row-start-1 rounded-full h-1.5"),
          (() => {
            let $ = m.current_palette.empty;
            if (!$ && dynamic2) {
              return style(
                "background-color",
                (() => {
                  let _pipe = m.current_palette;
                  let _pipe$1 = muted(_pipe);
                  return swatch_hex(_pipe$1);
                })()
              );
            } else {
              return class$("bg-zinc-800");
            }
          })()
        ]),
        toList([
          div(
            toList([
              class$(
                "bg-zinc-100 transition-[width] duration-100 rounded-full h-1.5"
              ),
              style(
                "width",
                float_to_string(
                  divideFloat(
                    (() => {
                      let $ = m.seeking;
                      if ($) {
                        return identity(m.seek_amount);
                      } else {
                        let _pipe = m.player;
                        return time(_pipe);
                      }
                    })(),
                    identity(m.current_song.duration)
                  ) * 100
                ) + "%"
              )
            ]),
            toList([])
          )
        ])
      ),
      input(
        toList([
          class$(
            "col-start-1 row-start-1 opacity-0 focus:ring-0 [&::-webkit-slider-thumb]:opacity-0 w-full h-1.5 rounded-full"
          ),
          value("0"),
          step("any"),
          max2(to_string2(m.current_song.duration)),
          on(
            "input",
            subfield(
              toList(["target", "value"]),
              string3,
              (value3) => {
                let $ = parse_float(value3);
                let seek_amount;
                if ($ instanceof Ok) {
                  seek_amount = $[0];
                } else {
                  throw makeError(
                    "let_assert",
                    FILEPATH7,
                    "somachord/elements",
                    490,
                    "music_slider",
                    "Pattern match failed, no pattern matched the value.",
                    {
                      value: $,
                      start: 15294,
                      end: 15341,
                      pattern_start: 15305,
                      pattern_end: 15320
                    }
                  );
                }
                return success(new PlayerSeek(seek_amount));
              }
            )
          ),
          on(
            "mousedown",
            field(
              "button",
              int2,
              (btn) => {
                return guard(
                  btn !== 0,
                  success(new ComponentClick()),
                  () => {
                    let _pipe = m.player;
                    pause_play(_pipe);
                    return success(new ComponentClick());
                  }
                );
              }
            )
          ),
          on(
            "mouseup",
            field(
              "button",
              int2,
              (btn) => {
                return guard(
                  btn !== 0,
                  success(new ComponentClick()),
                  () => {
                    let _pipe = m.player;
                    pause_play(_pipe);
                    return success(new ComponentClick());
                  }
                );
              }
            )
          ),
          type_("range")
        ])
      )
    ])
  );
}
function artists(artists2, attrs) {
  return span(
    prepend(
      class$(
        "text-zinc-400 font-light text-sm overflow-hidden text-nowrap text-ellipsis min-w-0"
      ),
      attrs
    ),
    (() => {
      let _pipe = map(
        artists2,
        (artist2) => {
          return a(
            toList([href("/artist/" + artist2.id)]),
            toList([
              span(
                toList([class$("hover:underline")]),
                toList([text2(artist2.name)])
              )
            ])
          );
        }
      );
      return intersperse(_pipe, text2(", "));
    })()
  );
}
function album2(album3, handler) {
  let _block;
  {
    let _block$1;
    let _pipe = create();
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH7,
        "somachord/elements",
        203,
        "album",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 6922,
          end: 6982,
          pattern_start: 6933,
          pattern_end: 6940
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return div(
    toList([
      class$(
        "flex flex-col flex-none w-42 gap-2 group p-2 rounded hover:bg-zinc-900/75"
      ),
      on("dblclick", success(handler(album3.id)))
    ]),
    toList([
      div(
        toList([
          class$("relative mt-4 h-42"),
          style("clip-path", "inset(0 0 0 0);")
        ]),
        toList([
          div(
            toList([
              class$(
                "w-34 h-28 -mt-2 mx-2 bg-zinc-700 rounded-md absolute"
              )
            ]),
            toList([])
          ),
          a(
            toList([href("/album/" + album3.id)]),
            toList([
              img(
                toList([
                  src(
                    cover_url(auth_details, album3.cover_art_id, 500)
                  ),
                  class$(
                    "border-t-2 border-zinc-900/75 group-hover:border-zinc-900 object-cover rounded-md absolute"
                  )
                ])
              )
            ])
          ),
          div(
            toList([
              on_click(handler(album3.id)),
              class$(
                "absolute top-26 left-26 relative transition duration-250 ease-out translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              )
            ]),
            toList([
              div(
                toList([class$("rounded-full bg-black w-8 h-8")]),
                toList([])
              ),
              i(
                toList([
                  class$(
                    "absolute -top-2 -left-2 ph-fill ph-play-circle text-5xl text-violet-500"
                  )
                ]),
                toList([])
              )
            ])
          )
        ])
      ),
      span(
        toList([class$("inline-flex flex-col gap-1")]),
        toList([
          a(
            toList([
              href("/album/" + album3.id),
              class$("space-x-1")
            ]),
            toList([
              span(
                toList([class$("text-zinc-100 hover:underline")]),
                toList([text2(album3.name)])
              )
            ])
          ),
          artists(album3.artists, toList([]))
        ])
      )
    ])
  );
}
var scrollbar_class = "[&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700";

// build/dev/javascript/somachord/somachord/components/fullscreen_player.mjs
var FILEPATH8 = "src/somachord/components/fullscreen_player.gleam";
function tab_as_string(tab) {
  if (tab instanceof Default) {
    return "Queue";
  } else {
    return "Lyrics";
  }
}
function tab_element(m, tab) {
  return span(
    toList([
      on_click(new ChangeFullscreenPlayerView(tab)),
      class$("relative cursor-pointer"),
      (() => {
        let $ = isEqual(tab, m.fullscreen_player_display);
        if ($) {
          return class$("text-zinc-100");
        } else {
          return class$("text-zinc-500 hover:text-zinc-300");
        }
      })()
    ]),
    toList([
      text2(tab_as_string(tab)),
      (() => {
        let $ = isEqual(tab, m.fullscreen_player_display);
        if ($) {
          return div(
            toList([
              class$("absolute top-9.25 w-full h-1 border-b"),
              (() => {
                let $1 = m.current_palette.empty;
                if ($1) {
                  return class$("border-violet-500");
                } else {
                  return style(
                    "border-color",
                    (() => {
                      let _pipe = m.current_palette;
                      let _pipe$1 = vibrant(_pipe);
                      return swatch_hex(_pipe$1);
                    })()
                  );
                }
              })()
            ]),
            toList([])
          );
        } else {
          return none3();
        }
      })()
    ])
  );
}
function view_desktop(m) {
  let _block;
  {
    let _block$1;
    let _pipe = m.storage;
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH8,
        "somachord/components/fullscreen_player",
        85,
        "view_desktop",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 2098,
          end: 2151,
          pattern_start: 2109,
          pattern_end: 2116
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return div(
    toList([
      (() => {
        let $ = m.current_palette.empty;
        if ($) {
          return class$("bg-zinc-950");
        } else {
          return style(
            "background",
            "radial-gradient(circle at left," + (() => {
              let _pipe = m.current_palette;
              let _pipe$1 = muted(_pipe);
              return swatch_hex(_pipe$1);
            })() + " 0%, #000000 100%);"
          );
        }
      })(),
      class$(
        "border-t border-zinc-800 flex flex-col gap-8 min-w-0 min-h-0 w-full h-full"
      )
    ]),
    toList([
      div(
        toList([
          class$(
            "backdrop-blur-lg bg-zinc-950/50 flex flex-col gap-8  min-w-0 min-h-0 w-full h-full p-8"
          )
        ]),
        toList([
          div(
            toList([class$("flex gap-8")]),
            toList([
              button2(
                new Down(),
                new Medium2(),
                toList([on_click(new ToggleFullscreenPlayer())])
              )
            ])
          ),
          div(
            toList([class$("overflow-hidden flex-1 flex gap-8")]),
            toList([
              div(
                toList([
                  class$(
                    "w-1/2 flex flex-col items-center justify-center gap-8"
                  )
                ]),
                toList([
                  (() => {
                    let $ = m.current_song.cover_art_id === "";
                    if ($) {
                      return div(
                        toList([
                          class$(
                            "bg-zinc-900 rounded-md w-120 h-120 flex justify-center items-center"
                          )
                        ]),
                        toList([
                          i(
                            toList([
                              class$(
                                "text-zinc-500 self-center align-self-center text-[10em] ph ph-music-notes-simple"
                              )
                            ]),
                            toList([])
                          )
                        ])
                      );
                    } else {
                      return img(
                        toList([
                          src(
                            cover_url(
                              m.auth,
                              m.current_song.cover_art_id,
                              500
                            )
                          ),
                          class$(
                            "max-w-120 max-h-120 self-center object-fit rounded-md"
                          )
                        ])
                      );
                    }
                  })(),
                  div(
                    toList([class$("w-full")]),
                    toList([
                      div(
                        toList([
                          class$("flex justify-between min-w-0")
                        ]),
                        toList([
                          a(
                            toList([
                              href("/song/" + m.current_song.id),
                              on_click(new ToggleFullscreenPlayer()),
                              class$(
                                "overflow-hidden text-nowrap text-ellipsis min-w-0"
                              )
                            ]),
                            toList([
                              span(
                                toList([
                                  class$(
                                    "hover:underline font-bold text-2xl"
                                  )
                                ]),
                                toList([text2(m.current_song.title)])
                              )
                            ])
                          ),
                          div(
                            toList([class$("flex gap-2")]),
                            toList([
                              button2(
                                new Like(m.current_song.starred),
                                new Medium2(),
                                toList([
                                  on_click(new Like2()),
                                  (() => {
                                    let $ = m.current_song.starred;
                                    if ($) {
                                      let $1 = m.current_palette.empty;
                                      if ($1) {
                                        return class$(
                                          "text-violet-500"
                                        );
                                      } else {
                                        return style(
                                          "color",
                                          (() => {
                                            let _pipe = m.current_palette;
                                            let _pipe$1 = vibrant(
                                              _pipe
                                            );
                                            return swatch_hex(_pipe$1);
                                          })()
                                        );
                                      }
                                    } else {
                                      return none();
                                    }
                                  })()
                                ])
                              )
                            ])
                          )
                        ])
                      ),
                      artists(
                        m.current_song.artists,
                        toList([
                          class$("text-zinc-400"),
                          on_click(new ToggleFullscreenPlayer())
                        ])
                      )
                    ])
                  ),
                  div(
                    toList([class$("space-y-1 w-full")]),
                    toList([
                      div(
                        toList([
                          class$(
                            "flex gap-2 items-center font-[Azeret_Mono] text-zinc-400 text-[0.6rem]"
                          )
                        ]),
                        toList([
                          span(
                            toList([]),
                            toList([
                              text2(
                                (() => {
                                  let minutes2 = globalThis.Math.trunc(
                                    round2(
                                      (() => {
                                        let _pipe = m.player;
                                        return time(_pipe);
                                      })()
                                    ) / 60
                                  );
                                  let seconds3 = round2(
                                    (() => {
                                      let _pipe = m.player;
                                      return time(_pipe);
                                    })()
                                  ) % 60;
                                  return to_string2(minutes2) + ":" + (() => {
                                    let _pipe = to_string2(seconds3);
                                    return pad_start(_pipe, 2, "0");
                                  })();
                                })()
                              )
                            ])
                          ),
                          music_slider(
                            m,
                            true,
                            toList([class$("w-full")])
                          ),
                          span(
                            toList([]),
                            toList([
                              text2(
                                (() => {
                                  let minutes2 = globalThis.Math.trunc(
                                    m.current_song.duration / 60
                                  );
                                  let seconds3 = m.current_song.duration % 60;
                                  return to_string2(minutes2) + ":" + (() => {
                                    let _pipe = to_string2(seconds3);
                                    return pad_start(_pipe, 2, "0");
                                  })();
                                })()
                              )
                            ])
                          )
                        ])
                      ),
                      div(
                        toList([
                          class$(
                            "flex gap-4 justify-center items-center"
                          )
                        ]),
                        toList([
                          button2(
                            new Shuffle(),
                            new Small2(),
                            prepend(
                              on_click(new PlayerShuffle()),
                              (() => {
                                let $ = m.shuffled;
                                if ($) {
                                  let $1 = m.current_palette.empty;
                                  if ($1) {
                                    return toList([
                                      class$(
                                        "text-violet-500 underline underline-offset-4 decoration-dotted"
                                      )
                                    ]);
                                  } else {
                                    return toList([
                                      class$(
                                        "underline underline-offset-4 decoration-dotted"
                                      ),
                                      style(
                                        "color",
                                        (() => {
                                          let _pipe = m.current_palette;
                                          let _pipe$1 = vibrant(_pipe);
                                          return swatch_hex(_pipe$1);
                                        })()
                                      )
                                    ]);
                                  }
                                } else {
                                  return toList([none()]);
                                }
                              })()
                            )
                          ),
                          button2(
                            new SkipBackward(),
                            new Small2(),
                            toList([on_click(new PlayerPrevious())])
                          ),
                          button2(
                            (() => {
                              let $ = (() => {
                                let _pipe = m.player;
                                return is_paused(_pipe);
                              })();
                              if ($) {
                                return new Play();
                              } else {
                                return new Pause();
                              }
                            })(),
                            new Largest(),
                            toList([on_click(new PlayerPausePlay())])
                          ),
                          button2(
                            new SkipForward(),
                            new Small2(),
                            toList([on_click(new PlayerNext())])
                          ),
                          button2(
                            new Loop(),
                            new Small2(),
                            prepend(
                              on_click(new PlayerLoop()),
                              (() => {
                                let $ = m.looping;
                                if ($) {
                                  let $1 = m.current_palette.empty;
                                  if ($1) {
                                    return toList([
                                      class$(
                                        "text-violet-500 underline underline-offset-4 decoration-dotted"
                                      )
                                    ]);
                                  } else {
                                    return toList([
                                      class$(
                                        "underline underline-offset-4 decoration-dotted"
                                      ),
                                      style(
                                        "color",
                                        (() => {
                                          let _pipe = m.current_palette;
                                          let _pipe$1 = vibrant(_pipe);
                                          return swatch_hex(_pipe$1);
                                        })()
                                      )
                                    ]);
                                  }
                                } else {
                                  return toList([none()]);
                                }
                              })()
                            )
                          )
                        ])
                      )
                    ])
                  )
                ])
              ),
              div(
                toList([class$("w-1/2 flex flex-col")]),
                toList([
                  div(
                    toList([
                      class$(
                        "border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400 mb-2"
                      )
                    ]),
                    toList([
                      tab_element(m, new Default()),
                      tab_element(m, new Lyrics())
                    ])
                  ),
                  (() => {
                    let $ = m.fullscreen_player_display;
                    if ($ instanceof Default) {
                      return div(
                        toList([
                          class$("overflow-y-auto"),
                          class$(scrollbar_class),
                          class$("flex flex-col gap-2 pt-2")
                        ]),
                        map(
                          list4(m.queue),
                          (queue_entry) => {
                            return song2(
                              queue_entry[1],
                              prepend(
                                attribute2(
                                  "data-index",
                                  (() => {
                                    let _pipe = queue_entry[0] + 1;
                                    return to_string2(_pipe);
                                  })()
                                ),
                                prepend(
                                  (() => {
                                    let $1 = m.current_song.id === queue_entry[1].id;
                                    if ($1) {
                                      return attribute2(
                                        "data-playing",
                                        ""
                                      );
                                    } else {
                                      return none();
                                    }
                                  })(),
                                  (() => {
                                    let $1 = m.current_palette.empty;
                                    if ($1) {
                                      return toList([none()]);
                                    } else {
                                      return toList([
                                        style(
                                          "--dynamic-color",
                                          (() => {
                                            let _pipe = m.current_palette;
                                            let _pipe$1 = vibrant(
                                              _pipe
                                            );
                                            return swatch_hex(_pipe$1);
                                          })()
                                        ),
                                        class$("has-dynamic-color")
                                      ]);
                                    }
                                  })()
                                )
                              ),
                              true,
                              new QueueJumpTo(queue_entry[0])
                            );
                          }
                        )
                      );
                    } else {
                      return element4(
                        toList([
                          class$("overflow-y-auto"),
                          class$(scrollbar_class),
                          id2(m.current_song.id),
                          song_time(
                            (() => {
                              let _pipe = m.player;
                              return time(_pipe);
                            })()
                          ),
                          size2(new Large()),
                          (() => {
                            let $1 = m.fullscreen_player_open;
                            if ($1) {
                              return auto_scroll(true);
                            } else {
                              return auto_scroll(false);
                            }
                          })()
                        ])
                      );
                    }
                  })()
                ])
              )
            ])
          )
        ])
      )
    ])
  );
}
function view_info(m) {
  let _block;
  {
    let _block$1;
    let _pipe = m.storage;
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH8,
        "somachord/components/fullscreen_player",
        618,
        "view_info",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 21983,
          end: 22036,
          pattern_start: 21994,
          pattern_end: 22001
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return toList([
    div(
      toList([
        class$("flex-1 space-y-4 flex flex-col justify-center")
      ]),
      toList([
        img(
          toList([
            src(
              cover_url(m.auth, m.current_song.cover_art_id, 500)
            ),
            class$("self-center object-scale rounded-md")
          ])
        )
      ])
    ),
    div(
      toList([]),
      toList([
        div(
          toList([class$("flex gap-2 justify-between min-w-0")]),
          toList([
            a(
              toList([
                href("/song/" + m.current_song.id),
                on_click(new ToggleFullscreenPlayer()),
                class$(
                  "overflow-hidden text-nowrap text-ellipsis min-w-0"
                )
              ]),
              toList([
                span(
                  toList([
                    class$("hover:underline font-medium text-xl")
                  ]),
                  toList([text2(m.current_song.title)])
                )
              ])
            ),
            div(
              toList([class$("flex gap-2")]),
              toList([
                button2(
                  new Like(m.current_song.starred),
                  new Medium2(),
                  toList([
                    on_click(new Like2()),
                    (() => {
                      let $ = m.current_song.starred;
                      if ($) {
                        let $1 = m.current_palette.empty;
                        if ($1) {
                          return class$("text-violet-500");
                        } else {
                          return style(
                            "color",
                            (() => {
                              let _pipe = m.current_palette;
                              let _pipe$1 = vibrant(_pipe);
                              return swatch_hex(_pipe$1);
                            })()
                          );
                        }
                      } else {
                        return none();
                      }
                    })()
                  ])
                )
              ])
            )
          ])
        ),
        artists(
          m.current_song.artists,
          toList([on_click(new ToggleFullscreenPlayer())])
        )
      ])
    )
  ]);
}
function view_mobile(m) {
  return div(
    toList([
      (() => {
        let $ = m.current_palette.empty;
        if ($) {
          return class$("bg-zinc-900");
        } else {
          return style(
            "background",
            "linear-gradient(180deg," + (() => {
              let _pipe = m.current_palette;
              let _pipe$1 = dark_muted(_pipe);
              return swatch_hex(_pipe$1);
            })() + " 0%, oklch(21% 0.006 285.885) 75%);"
          );
        }
      })(),
      class$(
        "w-full h-full flex flex-col [@media(max-height:700px)]:gap-2 gap-8 px-8 [@media(max-height:700px)]:py-4 py-16"
      )
    ]),
    toList([
      div(
        toList([
          class$(
            "flex items-center justify-between text-zinc-300 gap-4 min-w-0"
          )
        ]),
        toList([
          button2(
            new Down(),
            new Medium2(),
            toList([on_click(new ToggleFullscreenPlayer())])
          ),
          (() => {
            let $ = m.fullscreen_player_display;
            if ($ instanceof Default) {
              return none3();
            } else {
              return span(
                toList([
                  class$(
                    "self-center inline-flex items-center text-sm overflow-hidden text-nowrap text-ellipsis min-w-0"
                  )
                ]),
                toList([
                  waveform(
                    toList([
                      (() => {
                        let $1 = m.current_palette.empty;
                        if ($1) {
                          return class$("fill-violet-500");
                        } else {
                          return style(
                            "fill",
                            (() => {
                              let _pipe = m.current_palette;
                              let _pipe$1 = vibrant(_pipe);
                              return swatch_hex(_pipe$1);
                            })()
                          );
                        }
                      })()
                    ])
                  ),
                  text2(m.current_song.title)
                ])
              );
            }
          })()
        ])
      ),
      div(
        toList([
          class$("flex-1 flex flex-col gap-4"),
          (() => {
            let $ = m.fullscreen_player_display;
            if ($ instanceof Lyrics) {
              return class$("overflow-y-auto");
            } else {
              return none();
            }
          })()
        ]),
        (() => {
          let $ = m.fullscreen_player_display;
          if ($ instanceof Default) {
            return view_info(m);
          } else {
            return toList([
              element4(
                toList([
                  id2(m.current_song.id),
                  song_time(
                    (() => {
                      let _pipe = m.player;
                      return time(_pipe);
                    })()
                  ),
                  (() => {
                    let $1 = m.fullscreen_player_open;
                    if ($1) {
                      return auto_scroll(true);
                    } else {
                      return auto_scroll(false);
                    }
                  })()
                ])
              )
            ]);
          }
        })()
      ),
      div(
        toList([]),
        toList([
          div(
            toList([class$("space-y-2")]),
            toList([
              music_slider(
                m,
                false,
                toList([class$("w-full")])
              ),
              div(
                toList([
                  class$(
                    "flex justify-between items-center font-[Azeret_Mono] text-zinc-400 text-[0.6rem]"
                  )
                ]),
                toList([
                  span(
                    toList([]),
                    toList([
                      text2(
                        (() => {
                          let minutes2 = globalThis.Math.trunc(
                            round2(
                              (() => {
                                let _pipe = m.player;
                                return time(_pipe);
                              })()
                            ) / 60
                          );
                          let seconds3 = round2(
                            (() => {
                              let _pipe = m.player;
                              return time(_pipe);
                            })()
                          ) % 60;
                          return to_string2(minutes2) + ":" + (() => {
                            let _pipe = to_string2(seconds3);
                            return pad_start(_pipe, 2, "0");
                          })();
                        })()
                      )
                    ])
                  ),
                  span(
                    toList([]),
                    toList([
                      text2(
                        (() => {
                          let minutes2 = globalThis.Math.trunc(
                            m.current_song.duration / 60
                          );
                          let seconds3 = m.current_song.duration % 60;
                          return to_string2(minutes2) + ":" + (() => {
                            let _pipe = to_string2(seconds3);
                            return pad_start(_pipe, 2, "0");
                          })();
                        })()
                      )
                    ])
                  )
                ])
              )
            ])
          ),
          div(
            toList([
              class$("flex gap-4 justify-between items-center")
            ]),
            toList([
              button2(
                new Shuffle(),
                new Small2(),
                prepend(
                  on_click(new PlayerShuffle()),
                  (() => {
                    let $ = m.shuffled;
                    if ($) {
                      let $1 = m.current_palette.empty;
                      if ($1) {
                        return toList([
                          class$(
                            "text-violet-500 underline underline-offset-4 decoration-dotted"
                          )
                        ]);
                      } else {
                        return toList([
                          class$(
                            "underline underline-offset-4 decoration-dotted"
                          ),
                          style(
                            "color",
                            (() => {
                              let _pipe = m.current_palette;
                              let _pipe$1 = vibrant(_pipe);
                              return swatch_hex(_pipe$1);
                            })()
                          )
                        ]);
                      }
                    } else {
                      return toList([none()]);
                    }
                  })()
                )
              ),
              button2(
                new SkipBackward(),
                new Small2(),
                toList([on_click(new PlayerPrevious())])
              ),
              button2(
                (() => {
                  let $ = (() => {
                    let _pipe = m.player;
                    return is_paused(_pipe);
                  })();
                  if ($) {
                    return new Play();
                  } else {
                    return new Pause();
                  }
                })(),
                new Largest(),
                toList([on_click(new PlayerPausePlay())])
              ),
              button2(
                new SkipForward(),
                new Small2(),
                toList([on_click(new PlayerNext())])
              ),
              button2(
                new Loop(),
                new Small2(),
                prepend(
                  on_click(new PlayerLoop()),
                  (() => {
                    let $ = m.looping;
                    if ($) {
                      let $1 = m.current_palette.empty;
                      if ($1) {
                        return toList([
                          class$(
                            "text-violet-500 underline underline-offset-4 decoration-dotted"
                          )
                        ]);
                      } else {
                        return toList([
                          class$(
                            "underline underline-offset-4 decoration-dotted"
                          ),
                          style(
                            "color",
                            (() => {
                              let _pipe = m.current_palette;
                              let _pipe$1 = vibrant(_pipe);
                              return swatch_hex(_pipe$1);
                            })()
                          )
                        ]);
                      }
                    } else {
                      return toList([none()]);
                    }
                  })()
                )
              )
            ])
          )
        ])
      ),
      div(
        toList([class$("flex gap-4 justify-evenly items-center")]),
        toList([
          i(
            toList([
              class$("text-3xl ph ph-music-notes py-2 px-4"),
              on_click(
                new ChangeFullscreenPlayerView(new Default())
              ),
              (() => {
                let $ = m.fullscreen_player_display;
                if ($ instanceof Default) {
                  return class$("bg-zinc-800 rounded-md");
                } else {
                  return none();
                }
              })()
            ]),
            toList([])
          ),
          i(
            toList([
              class$("text-3xl ph ph-microphone-stage py-2 px-4"),
              on_click(
                new ChangeFullscreenPlayerView(new Lyrics())
              ),
              (() => {
                let $ = m.fullscreen_player_display;
                if ($ instanceof Lyrics) {
                  return class$("bg-zinc-800 rounded-md");
                } else {
                  return none();
                }
              })()
            ]),
            toList([])
          ),
          i(
            toList([class$("text-3xl ph ph-queue py-2 px-4")]),
            toList([])
          )
        ])
      )
    ])
  );
}
function view3(m) {
  return div(
    toList([
      class$(
        "z-100 fixed bottom-0 left-0 transition duration-300 min-w-0 min-h-0 w-full h-full"
      ),
      (() => {
        let $ = m.fullscreen_player_open;
        if ($) {
          return class$("translate-y-0");
        } else {
          return class$("translate-y-full");
        }
      })()
    ]),
    toList([
      (() => {
        let $ = layout();
        if ($ instanceof Desktop) {
          return view_desktop(m);
        } else {
          return view_mobile(m);
        }
      })()
    ])
  );
}

// build/dev/javascript/formal/formal/form.mjs
var Form = class extends CustomType {
  constructor(translator, values3, errors, run3) {
    super();
    this.translator = translator;
    this.values = values3;
    this.errors = errors;
    this.run = run3;
  }
};
var Schema = class extends CustomType {
  constructor(run3) {
    super();
    this.run = run3;
  }
};
var MustBePresent = class extends CustomType {
};
var MustBeInt = class extends CustomType {
};
var MustBeFloat = class extends CustomType {
};
var MustBeEmail = class extends CustomType {
};
var MustBePhoneNumber = class extends CustomType {
};
var MustBeUrl = class extends CustomType {
};
var MustBeDate = class extends CustomType {
};
var MustBeTime = class extends CustomType {
};
var MustBeDateTime = class extends CustomType {
};
var MustBeColour = class extends CustomType {
};
var MustBeStringLengthMoreThan = class extends CustomType {
  constructor(limit) {
    super();
    this.limit = limit;
  }
};
var MustBeStringLengthLessThan = class extends CustomType {
  constructor(limit) {
    super();
    this.limit = limit;
  }
};
var MustBeIntMoreThan = class extends CustomType {
  constructor(limit) {
    super();
    this.limit = limit;
  }
};
var MustBeIntLessThan = class extends CustomType {
  constructor(limit) {
    super();
    this.limit = limit;
  }
};
var MustBeFloatMoreThan = class extends CustomType {
  constructor(limit) {
    super();
    this.limit = limit;
  }
};
var MustBeFloatLessThan = class extends CustomType {
  constructor(limit) {
    super();
    this.limit = limit;
  }
};
var MustBeAccepted = class extends CustomType {
};
var MustConfirm = class extends CustomType {
};
var MustBeUnique = class extends CustomType {
};
var CustomError = class extends CustomType {
  constructor(message2) {
    super();
    this.message = message2;
  }
};
var Parser = class extends CustomType {
  constructor(run3) {
    super();
    this.run = run3;
  }
};
var Check = class extends CustomType {
};
var DontCheck = class extends CustomType {
};
function field_value(form2, name2) {
  let _pipe = form2.values;
  let _pipe$1 = key_find(_pipe, name2);
  return unwrap2(_pipe$1, "");
}
function run2(form2) {
  let $ = form2.run(form2.values, toList([]));
  let value3;
  let errors;
  value3 = $[0];
  errors = $[1];
  if (errors instanceof Empty) {
    return new Ok(value3);
  } else {
    return new Error2(new Form(form2.translator, form2.values, errors, form2.run));
  }
}
function field2(name2, parser, continuation) {
  return new Schema(
    (values3, errors) => {
      let input2 = key_filter(values3, name2);
      let $ = parser.run(input2, new Check());
      let value3;
      let new_errors;
      value3 = $[0];
      new_errors = $[2];
      let _block;
      if (new_errors instanceof Empty) {
        _block = errors;
      } else {
        _block = prepend([name2, new_errors], errors);
      }
      let errors$1 = _block;
      return continuation(value3).run(values3, errors$1);
    }
  );
}
function success2(value3) {
  return new Schema((_, errors) => {
    return [value3, errors];
  });
}
function add_values(form2, values3) {
  return new Form(
    form2.translator,
    append(values3, form2.values),
    form2.errors,
    form2.run
  );
}
function set_values(form2, values3) {
  return new Form(form2.translator, values3, form2.errors, form2.run);
}
function checkbox_parser(inputs, status) {
  if (inputs instanceof Empty) {
    return [false, status, toList([])];
  } else {
    return [true, status, toList([])];
  }
}
function string_parser(inputs, status) {
  if (inputs instanceof Empty) {
    return ["", status, toList([])];
  } else {
    let input2 = inputs.head;
    return [input2, status, toList([])];
  }
}
function value_parser(inputs, zero, status, error, next2) {
  if (inputs instanceof Empty) {
    return [zero, new DontCheck(), toList([error])];
  } else {
    let input2 = inputs.head;
    let $ = next2(input2);
    if ($ instanceof Ok) {
      let t = $[0];
      return [t, status, toList([])];
    } else {
      return [zero, new DontCheck(), toList([error])];
    }
  }
}
function url_parser(inputs, status) {
  return value_parser(
    inputs,
    empty,
    status,
    new MustBeUrl(),
    (input2) => {
      return parse(input2);
    }
  );
}
function add_check(parser, checker) {
  return new Parser(
    (inputs, status) => {
      let $ = parser.run(inputs, status);
      let value3;
      let status$1;
      let errors;
      value3 = $[0];
      status$1 = $[1];
      errors = $[2];
      let _block;
      if (status$1 instanceof Check) {
        let $1 = checker(value3);
        if ($1 instanceof Ok) {
          _block = errors;
        } else {
          let error = $1[0];
          _block = prepend(error, errors);
        }
      } else {
        _block = errors;
      }
      let errors$1 = _block;
      return [value3, status$1, errors$1];
    }
  );
}
function check_not_empty(parser) {
  return add_check(
    parser,
    (x) => {
      if (x === "") {
        return new Error2(new MustBePresent());
      } else {
        return new Ok(x);
      }
    }
  );
}
function en_gb(error) {
  if (error instanceof MustBePresent) {
    return "must not be blank";
  } else if (error instanceof MustBeInt) {
    return "must be a whole number";
  } else if (error instanceof MustBeFloat) {
    return "must be a number";
  } else if (error instanceof MustBeEmail) {
    return "must be an email";
  } else if (error instanceof MustBePhoneNumber) {
    return "must be a phone number";
  } else if (error instanceof MustBeUrl) {
    return "must be a URL";
  } else if (error instanceof MustBeDate) {
    return "must be a date";
  } else if (error instanceof MustBeTime) {
    return "must be a time";
  } else if (error instanceof MustBeDateTime) {
    return "must be a date and time";
  } else if (error instanceof MustBeColour) {
    return "must be a hex colour code";
  } else if (error instanceof MustBeStringLengthMoreThan) {
    let limit = error.limit;
    return "must be more than " + to_string2(limit) + " characters";
  } else if (error instanceof MustBeStringLengthLessThan) {
    let limit = error.limit;
    return "must be less than " + to_string2(limit) + " characters";
  } else if (error instanceof MustBeIntMoreThan) {
    let limit = error.limit;
    return "must be more than " + to_string2(limit);
  } else if (error instanceof MustBeIntLessThan) {
    let limit = error.limit;
    return "must be less than " + to_string2(limit);
  } else if (error instanceof MustBeFloatMoreThan) {
    let limit = error.limit;
    return "must be more than " + float_to_string(limit);
  } else if (error instanceof MustBeFloatLessThan) {
    let limit = error.limit;
    return "must be less than " + float_to_string(limit);
  } else if (error instanceof MustBeAccepted) {
    return "must be accepted";
  } else if (error instanceof MustConfirm) {
    return "doesn't match";
  } else if (error instanceof MustBeUnique) {
    return "is already in use";
  } else {
    let message2 = error.message;
    return message2;
  }
}
function new$10(schema) {
  return new Form(en_gb, toList([]), toList([]), schema.run);
}
function field_error_messages(form2, name2) {
  let _pipe = form2.errors;
  let _pipe$1 = key_filter(_pipe, name2);
  return flat_map(
    _pipe$1,
    (_capture) => {
      return map(_capture, form2.translator);
    }
  );
}
function add_error(form2, name2, error) {
  return new Form(
    form2.translator,
    form2.values,
    prepend([name2, toList([error])], form2.errors),
    form2.run
  );
}
var parse_checkbox = /* @__PURE__ */ new Parser(checkbox_parser);
var parse_string = /* @__PURE__ */ new Parser(string_parser);
var parse_url = /* @__PURE__ */ new Parser(url_parser);

// build/dev/javascript/somachord/somachord/config.ffi.mjs
function get3(key3) {
  if (!window.somachordConfig) {
    return "";
  }
  return window.somachordConfig[key3] || "";
}

// build/dev/javascript/somachord/somachord/components/login.mjs
var FILEPATH9 = "src/somachord/components/login.gleam";
var Model3 = class extends CustomType {
  constructor(storage, login_form2, auth_details) {
    super();
    this.storage = storage;
    this.login_form = login_form2;
    this.auth_details = auth_details;
  }
};
var LoginSubmitted = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PingResponse = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Login2 = class extends CustomType {
  constructor(server_url, username, password) {
    super();
    this.server_url = server_url;
    this.username = username;
    this.password = password;
  }
};
function element5() {
  return element2(
    "login-page",
    toList([class$("flex-1")]),
    toList([])
  );
}
function update3(m, message2) {
  if (message2 instanceof LoginSubmitted) {
    let $ = message2[0];
    if ($ instanceof Ok) {
      let login_data = $[0];
      let auth = new Auth(
        login_data.username,
        hash_password(login_data.password),
        login_data.server_url
      );
      return [
        new Model3(m.storage, m.login_form, auth),
        ping(auth, (var0) => {
          return new PingResponse(var0);
        })
      ];
    } else {
      let updated_form = $[0];
      return [
        new Model3(m.storage, updated_form, m.auth_details),
        none2()
      ];
    }
  } else {
    let $ = message2[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let _block;
        let _pipe = m.storage;
        _block = set(
          _pipe,
          "auth",
          new Storage(m.auth_details)
        );
        let $2 = _block;
        return [
          m,
          (() => {
            let $3 = parse(
              (() => {
                let $4 = am_i_electron();
                if ($4) {
                  return location2();
                } else {
                  return "/";
                }
              })()
            );
            let home;
            if ($3 instanceof Ok) {
              home = $3[0];
            } else {
              throw makeError(
                "let_assert",
                FILEPATH9,
                "somachord/components/login",
                81,
                "update",
                "Pattern match failed, no pattern matched the value.",
                {
                  value: $3,
                  start: 1729,
                  end: 1878,
                  pattern_start: 1740,
                  pattern_end: 1748
                }
              );
            }
            return load(home);
          })()
        ];
      } else {
        let e = $1[0];
        let _block;
        if (e instanceof WrongCredentials) {
          let msg = e.message;
          _block = msg;
        } else if (e instanceof NotFound2) {
          throw makeError(
            "panic",
            FILEPATH9,
            "somachord/components/login",
            93,
            "update",
            "should be unreachable",
            {}
          );
        } else {
          let msg = e.message;
          _block = msg;
        }
        let message$1 = _block;
        return [
          new Model3(
            m.storage,
            add_error(
              m.login_form,
              "ping_error",
              new CustomError(message$1)
            ),
            m.auth_details
          ),
          none2()
        ];
      }
    } else {
      let e = $[0];
      echo4(e, void 0, "src/somachord/components/login.gleam", 109);
      throw makeError(
        "panic",
        FILEPATH9,
        "somachord/components/login",
        110,
        "update",
        "`panic` expression evaluated.",
        {}
      );
    }
  }
}
function login_form() {
  return new$10(
    field2(
      "serverURL",
      parse_url,
      (server_url) => {
        return field2(
          "username",
          (() => {
            let _pipe = parse_string;
            return check_not_empty(_pipe);
          })(),
          (username) => {
            return field2(
              "password",
              (() => {
                let _pipe = parse_string;
                return check_not_empty(_pipe);
              })(),
              (password) => {
                return success2(
                  new Login2(
                    (() => {
                      let _pipe = server_url;
                      return to_string3(_pipe);
                    })(),
                    username,
                    password
                  )
                );
              }
            );
          }
        );
      }
    )
  );
}
function init3(_) {
  return [
    new Model3(
      create(),
      login_form(),
      new Auth("", new Credentials("", ""), "")
    ),
    none2()
  ];
}
function view4(m) {
  let submitted = (fields) => {
    let _pipe = m.login_form;
    let _pipe$1 = set_values(
      _pipe,
      toList([["serverURL", get3("SERVER_URL")]])
    );
    let _pipe$2 = add_values(_pipe$1, fields);
    let _pipe$3 = run2(_pipe$2);
    return new LoginSubmitted(_pipe$3);
  };
  return div(
    toList([
      class$(
        "bg-linear-to-t from-zinc-950 to-zinc-900 font-[Poppins,sans-serif] flex h-screen mx-auto p-4 overflow-hidden"
      )
    ]),
    toList([
      div(
        toList([
          class$(
            "rounded-xl flex-1 h-full flex border border-zinc-600 justify-center items-center"
          )
        ]),
        toList([
          div(
            toList([
              class$(
                "md:w-[30%] flex bg-zinc-800 rounded-lg justify-center p-4"
              )
            ]),
            toList([
              div(
                toList([class$("flex flex-col w-full")]),
                toList([
                  h1(
                    toList([class$("font-bold text-4xl self-center")]),
                    toList([text2("Somachord")])
                  ),
                  guard(
                    (() => {
                      let _pipe = field_error_messages(
                        m.login_form,
                        "ping_error"
                      );
                      return is_empty2(_pipe);
                    })(),
                    none3(),
                    () => {
                      let _block;
                      let _pipe = field_error_messages(
                        m.login_form,
                        "ping_error"
                      );
                      _block = first(_pipe);
                      let $ = _block;
                      let msg;
                      if ($ instanceof Ok) {
                        msg = $[0];
                      } else {
                        throw makeError(
                          "let_assert",
                          FILEPATH9,
                          "somachord/components/login",
                          179,
                          "view",
                          "Pattern match failed, no pattern matched the value.",
                          {
                            value: $,
                            start: 4181,
                            end: 4309,
                            pattern_start: 4192,
                            pattern_end: 4199
                          }
                        );
                      }
                      return small(
                        toList([class$("self-center text-red-400")]),
                        toList([text2(msg)])
                      );
                    }
                  ),
                  form(
                    toList([
                      on_submit(submitted),
                      class$("flex flex-col gap-4")
                    ]),
                    toList([
                      div(
                        toList([class$("flex flex-col gap-2")]),
                        prepend(
                          label(
                            toList([class$("text-sm font-medium")]),
                            toList([text2("Server URL")])
                          ),
                          prepend(
                            input(
                              prepend(
                                type_("input"),
                                prepend(
                                  name("serverURL"),
                                  prepend(
                                    required(true),
                                    prepend(
                                      class$(
                                        "bg-zinc-700 rounded-md p-2 text-zinc-200 focus:outline focus:outline-violet-400"
                                      ),
                                      (() => {
                                        let $ = get3("SERVER_URL");
                                        if ($ === "") {
                                          return toList([none()]);
                                        } else {
                                          return toList([
                                            value(
                                              get3("SERVER_URL")
                                            ),
                                            disabled(true),
                                            class$(
                                              "cursor-not-allowed text-zinc-400"
                                            )
                                          ]);
                                        }
                                      })()
                                    )
                                  )
                                )
                              )
                            ),
                            map(
                              field_error_messages(
                                m.login_form,
                                "serverURL"
                              ),
                              (msg) => {
                                return small(
                                  toList([class$("text-red-400")]),
                                  toList([text2(msg)])
                                );
                              }
                            )
                          )
                        )
                      ),
                      div(
                        toList([class$("flex flex-col gap-2")]),
                        prepend(
                          label(
                            toList([class$("text-sm font-medium")]),
                            toList([text2("Username")])
                          ),
                          prepend(
                            input(
                              toList([
                                autocomplete("username"),
                                type_("input"),
                                name("username"),
                                class$(
                                  "bg-zinc-700 rounded-md p-2 text-zinc-200 focus:outline focus:outline-violet-400"
                                )
                              ])
                            ),
                            map(
                              field_error_messages(
                                m.login_form,
                                "username"
                              ),
                              (msg) => {
                                return small(
                                  toList([class$("text-red-400")]),
                                  toList([text2(msg)])
                                );
                              }
                            )
                          )
                        )
                      ),
                      div(
                        toList([class$("flex flex-col gap-2")]),
                        prepend(
                          label(
                            toList([class$("text-sm font-medium")]),
                            toList([text2("Password")])
                          ),
                          prepend(
                            input(
                              toList([
                                autocomplete("current-password"),
                                type_("password"),
                                name("password"),
                                class$(
                                  "bg-zinc-700 rounded-md p-2 text-zinc-200 focus:outline focus:outline-violet-400"
                                )
                              ])
                            ),
                            map(
                              field_error_messages(
                                m.login_form,
                                "password"
                              ),
                              (msg) => {
                                return small(
                                  toList([class$("text-red-400")]),
                                  toList([text2(msg)])
                                );
                              }
                            )
                          )
                        )
                      ),
                      button(
                        toList([
                          class$(
                            "bg-violet-600 hover:bg-violet-600/80 active:scale-[95%] translate-scale duration-250 ease-in-out rounded-full p-2 w-1/3 self-center h-12 items-center"
                          )
                        ]),
                        toList([
                          span(
                            toList([class$("font-semibold")]),
                            toList([text2("Login")])
                          )
                        ])
                      )
                    ])
                  )
                ])
              )
            ])
          )
        ])
      )
    ])
  );
}
function register2() {
  let component2 = component(init3, update3, view4, toList([]));
  return make_component(component2, "login-page");
}
function echo4(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector4();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector4 = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/dev/javascript/somachord/somachord/components/playlist_menu.mjs
var FILEPATH10 = "src/somachord/components/playlist_menu.gleam";
var Model4 = class extends CustomType {
  constructor(playlists2, added_songs, song_id2, open2) {
    super();
    this.playlists = playlists2;
    this.added_songs = added_songs;
    this.song_id = song_id2;
    this.open = open2;
  }
};
var SongID2 = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var NewPlaylist = class extends CustomType {
};
var AddToPlaylist2 = class extends CustomType {
  constructor(playlist_id) {
    super();
    this.playlist_id = playlist_id;
  }
};
var RemoveFromPlaylist = class extends CustomType {
  constructor(playlist_id) {
    super();
    this.playlist_id = playlist_id;
  }
};
var Playlists2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlaylistWithSongs2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var CreatePlaylist = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var DisgardedResponse2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
function element6(button_attrs, menu_attrs) {
  return div(
    toList([class$("relative inline-block group")]),
    toList([
      button2(
        new AddToPlaylist(),
        new Medium2(),
        button_attrs
      ),
      element2(
        "playlist-menu",
        prepend(
          class$("not-group-focus-within:hidden"),
          menu_attrs
        ),
        toList([])
      )
    ])
  );
}
function song_id(id3) {
  return attribute2("song-id", id3);
}
function init4(_) {
  return [
    new Model4(new_map(), new_map(), "", true),
    (() => {
      let $ = (() => {
        let _pipe = create();
        return get2(_pipe, "auth");
      })();
      if ($ instanceof Ok) {
        let stg = $[0];
        return playlists(
          stg.auth,
          (var0) => {
            return new Playlists2(var0);
          }
        );
      } else {
        return none2();
      }
    })()
  ];
}
function update4(m, msg) {
  if (msg instanceof SongID2) {
    let id3 = msg.id;
    return [new Model4(m.playlists, m.added_songs, id3, m.open), none2()];
  } else if (msg instanceof NewPlaylist) {
    let _block;
    {
      let _block$1;
      let _pipe = create();
      _block$1 = get2(_pipe, "auth");
      let $ = _block$1;
      let stg;
      if ($ instanceof Ok) {
        stg = $[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH10,
          "somachord/components/playlist_menu",
          98,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 2397,
            end: 2457,
            pattern_start: 2408,
            pattern_end: 2415
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    return [
      m,
      create_playlist(
        auth_details,
        "New Playlist",
        toList([m.song_id]),
        (var0) => {
          return new CreatePlaylist(var0);
        }
      )
    ];
  } else if (msg instanceof AddToPlaylist2) {
    let playlist_id = msg.playlist_id;
    let _block;
    {
      let _block$12;
      let _pipe = create();
      _block$12 = get2(_pipe, "auth");
      let $2 = _block$12;
      let stg;
      if ($2 instanceof Ok) {
        stg = $2[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH10,
          "somachord/components/playlist_menu",
          123,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 2988,
            end: 3048,
            pattern_start: 2999,
            pattern_end: 3006
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    let _block$1;
    let $ = map_get(m.added_songs, playlist_id);
    if ($ instanceof Ok) {
      let songs = $[0];
      let _pipe = m.added_songs;
      _block$1 = insert(
        _pipe,
        playlist_id,
        (() => {
          let _pipe$1 = songs;
          return append(_pipe$1, toList([m.song_id]));
        })()
      );
    } else {
      let _pipe = m.added_songs;
      _block$1 = insert(_pipe, playlist_id, toList([m.song_id]));
    }
    let added_songs = _block$1;
    return [
      new Model4(m.playlists, added_songs, m.song_id, m.open),
      add_to_playlist(
        auth_details,
        playlist_id,
        m.song_id,
        (var0) => {
          return new DisgardedResponse2(var0);
        }
      )
    ];
  } else if (msg instanceof RemoveFromPlaylist) {
    let playlist_id = msg.playlist_id;
    let _block;
    {
      let _block$12;
      let _pipe = create();
      _block$12 = get2(_pipe, "auth");
      let $2 = _block$12;
      let stg;
      if ($2 instanceof Ok) {
        stg = $2[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH10,
          "somachord/components/playlist_menu",
          146,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 3631,
            end: 3691,
            pattern_start: 3642,
            pattern_end: 3649
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    let _block$1;
    let $ = map_get(m.added_songs, playlist_id);
    if ($ instanceof Ok) {
      let songs = $[0];
      let _pipe = m.added_songs;
      _block$1 = insert(
        _pipe,
        playlist_id,
        (() => {
          let _pipe$1 = songs;
          return append(_pipe$1, toList([m.song_id]));
        })()
      );
    } else {
      let _pipe = m.added_songs;
      _block$1 = insert(_pipe, playlist_id, toList([m.song_id]));
    }
    let added_songs = _block$1;
    return [
      new Model4(m.playlists, added_songs, m.song_id, m.open),
      remove_from_playlist(
        auth_details,
        playlist_id,
        m.song_id,
        (var0) => {
          return new DisgardedResponse2(var0);
        }
      )
    ];
  } else if (msg instanceof Playlists2) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let playlists2 = $1[0];
        return [
          new Model4(
            (() => {
              let _pipe = playlists2;
              let _pipe$1 = fold(
                _pipe,
                [new_map(), ""],
                (acc, song3) => {
                  let d;
                  let idx;
                  d = acc[0];
                  idx = acc[1];
                  return [
                    (() => {
                      let _pipe$12 = d;
                      return insert(_pipe$12, idx, song3);
                    })(),
                    idx
                  ];
                }
              );
              let _pipe$2 = first2(_pipe$1);
              return delete$(_pipe$2, "");
            })(),
            m.added_songs,
            m.song_id,
            m.open
          ),
          (() => {
            let _pipe = map(
              playlists2,
              (playlist3) => {
                return playlist(
                  (() => {
                    let _block;
                    let _pipe2 = create();
                    _block = get2(_pipe2, "auth");
                    let $2 = _block;
                    let stg;
                    if ($2 instanceof Ok) {
                      stg = $2[0];
                    } else {
                      throw makeError(
                        "let_assert",
                        FILEPATH10,
                        "somachord/components/playlist_menu",
                        181,
                        "update",
                        "Pattern match failed, no pattern matched the value.",
                        {
                          value: $2,
                          start: 4619,
                          end: 4679,
                          pattern_start: 4630,
                          pattern_end: 4637
                        }
                      );
                    }
                    return stg.auth;
                  })(),
                  playlist3.id,
                  (var0) => {
                    return new PlaylistWithSongs2(var0);
                  }
                );
              }
            );
            return batch(_pipe);
          })()
        ];
      } else {
        let e = $;
        echo5(e, void 0, "src/somachord/components/playlist_menu.gleam", 191);
        return [m, none2()];
      }
    } else {
      let e = $;
      echo5(e, void 0, "src/somachord/components/playlist_menu.gleam", 191);
      return [m, none2()];
    }
  } else if (msg instanceof PlaylistWithSongs2) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let playlist3 = $1[0];
        return [
          new Model4(
            (() => {
              let _pipe = m.playlists;
              return insert(_pipe, playlist3.id, playlist3);
            })(),
            m.added_songs,
            m.song_id,
            m.open
          ),
          none2()
        ];
      } else {
        let e = $;
        echo5(e, void 0, "src/somachord/components/playlist_menu.gleam", 201);
        return [m, none2()];
      }
    } else {
      let e = $;
      echo5(e, void 0, "src/somachord/components/playlist_menu.gleam", 201);
      return [m, none2()];
    }
  } else if (msg instanceof CreatePlaylist) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let playlist3 = $1[0];
        return [
          new Model4(
            (() => {
              let _pipe = m.playlists;
              return insert(_pipe, playlist3.id, playlist3);
            })(),
            m.added_songs,
            m.song_id,
            m.open
          ),
          none2()
        ];
      } else {
        let e = $;
        echo5(e, void 0, "src/somachord/components/playlist_menu.gleam", 118);
        return [m, none2()];
      }
    } else {
      let e = $;
      echo5(e, void 0, "src/somachord/components/playlist_menu.gleam", 118);
      return [m, none2()];
    }
  } else {
    return [m, none2()];
  }
}
function view5(m) {
  return div(
    toList([
      class$(
        "z-100 absolute flex flex-col gap-2 rounded-lg bg-zinc-900 w-96 h-80 p-4"
      ),
      tabindex(0)
    ]),
    toList([
      div(
        toList([class$("inline-flex justify-between")]),
        toList([
          h1(
            toList([class$("font-semibold text-lg")]),
            toList([text2("Add to playlist")])
          ),
          button(
            toList([
              on_click(new NewPlaylist()),
              class$(
                "p-1 bg-white hover:bg-white/80 active:scale-[95%] transition-scale duration-200 cursor-pointer text-black font-medium rounded-md w-fit"
              )
            ]),
            toList([text2("New Playlist")])
          )
        ])
      ),
      div(
        toList([
          class$(
            "flex flex-col gap-2 pt-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"
          )
        ]),
        map(
          (() => {
            let _pipe = m.playlists;
            let _pipe$1 = map_to_list(_pipe);
            return sort(
              _pipe$1,
              (pl1, pl2) => {
                return compare3(pl1[1].name, pl2[1].name);
              }
            );
          })(),
          (playlist3) => {
            let _block;
            let $ = map_get(m.added_songs, playlist3[0]);
            if ($ instanceof Ok) {
              let songs = $[0];
              let _pipe = songs;
              _block = contains(_pipe, m.song_id);
            } else {
              let _pipe = map(
                playlist3[1].songs,
                (song3) => {
                  return song3.id;
                }
              );
              _block = contains(_pipe, m.song_id);
            }
            let song_in_playlist = _block;
            return div(
              toList([
                class$(
                  "hover:bg-zinc-800 px-2 py-1 rounded cursor-pointer inline-flex items-center gap-2"
                )
              ]),
              toList([
                img(
                  toList([
                    src(
                      cover_url(
                        (() => {
                          let _block$1;
                          let _pipe = create();
                          _block$1 = get2(_pipe, "auth");
                          let $1 = _block$1;
                          let stg;
                          if ($1 instanceof Ok) {
                            stg = $1[0];
                          } else {
                            throw makeError(
                              "let_assert",
                              FILEPATH10,
                              "somachord/components/playlist_menu",
                              263,
                              "view",
                              "Pattern match failed, no pattern matched the value.",
                              {
                                value: $1,
                                start: 7129,
                                end: 7213,
                                pattern_start: 7140,
                                pattern_end: 7147
                              }
                            );
                          }
                          return stg.auth;
                        })(),
                        playlist3[0],
                        500
                      )
                    ),
                    class$(
                      "w-12 h-12 rounded object-cover inline-block"
                    )
                  ])
                ),
                span(
                  toList([
                    class$(
                      "font-normal inline-flex w-full items-center justify-between"
                    )
                  ]),
                  toList([
                    a(
                      toList([
                        href("/playlist/" + playlist3[1].id),
                        class$("hover:underline")
                      ]),
                      toList([text2(playlist3[1].name)])
                    ),
                    button(
                      toList([]),
                      toList([
                        i(
                          toList([
                            class$("text-2xl"),
                            on_click(
                              (() => {
                                if (song_in_playlist) {
                                  return new RemoveFromPlaylist(playlist3[0]);
                                } else {
                                  return new AddToPlaylist2(playlist3[0]);
                                }
                              })()
                            ),
                            (() => {
                              if (song_in_playlist) {
                                return class$(
                                  "text-violet-500 ph-fill ph-check-circle"
                                );
                              } else {
                                return class$("ph ph-plus-circle");
                              }
                            })()
                          ]),
                          toList([])
                        )
                      ])
                    )
                  ])
                )
              ])
            );
          }
        )
      )
    ])
  );
}
function register3() {
  let component2 = component(
    init4,
    update4,
    view5,
    toList([
      on_attribute_change(
        "song-id",
        (id3) => {
          return new Ok(
            (() => {
              let _pipe = id3;
              return new SongID2(_pipe);
            })()
          );
        }
      )
    ])
  );
  return make_component(component2, "playlist-menu");
}
function echo5(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector5();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector5 = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/dev/javascript/somachord/somachord/constants.mjs
var somachord_likes_playlist_id = "somachord://likes";
var version = "1.0.0";

// build/dev/javascript/somachord/somachord/pages/about.mjs
function page() {
  return div(
    toList([
      class$(
        "flex-1 flex flex-col gap-4 p-8 rounded-md border border-zinc-800"
      )
    ]),
    toList([
      h1(
        toList([class$("text-7xl font-black")]),
        toList([text2("Somachord")])
      ),
      h2(
        toList([class$("text-xl text-zinc-500 font-bold")]),
        toList([text2("Version " + version)])
      ),
      div(
        toList([class$("flex flex-col gap-2")]),
        toList([
          span(
            toList([]),
            toList([
              text2("Created by "),
              a(
                toList([
                  class$(
                    "text-violet-400 inline-flex items-center gap-1"
                  ),
                  target("_blank"),
                  href("https://sammyette.party/")
                ]),
                toList([
                  text2("sammyette"),
                  i(
                    toList([
                      class$("ph ph-arrow-up-right self-center")
                    ]),
                    toList([])
                  )
                ])
              )
            ])
          ),
          span(
            toList([]),
            toList([
              text2("GitHub: "),
              a(
                toList([
                  class$(
                    "text-violet-400 inline-flex items-center gap-1"
                  ),
                  target("_blank"),
                  href("https://github.com/sammy-ette/Somachord")
                ]),
                toList([
                  text2("https://github.com/sammy-ette/Somachord"),
                  i(
                    toList([
                      class$("ph ph-arrow-up-right self-center")
                    ]),
                    toList([])
                  )
                ])
              )
            ])
          )
        ])
      )
    ])
  );
}

// build/dev/javascript/somachord/somachord/pages/album.mjs
var FILEPATH11 = "src/somachord/pages/album.gleam";
function buttons(m, album3) {
  let $ = m.layout;
  if ($ instanceof Desktop) {
    return div(
      toList([class$("text-zinc-400 flex gap-4 items-center")]),
      toList([
        button2(
          new Play(),
          new Largest(),
          toList([
            class$("text-violet-500"),
            on_click(new StreamAlbum(album3, 0))
          ])
        ),
        button2(
          new Shuffle(),
          new Medium2(),
          toList([on_click(new StreamAlbumShuffled(album3, 0))])
        )
      ])
    );
  } else {
    return div(
      toList([
        class$(
          "text-zinc-400 flex gap-4 items-center justify-between"
        )
      ]),
      (() => {
        let _pipe = toList([
          div(
            toList([class$("flex gap-4 items-center")]),
            toList([
              button2(
                new Shuffle(),
                new Medium2(),
                toList([on_click(new StreamAlbumShuffled(album3, 0))])
              ),
              button2(
                new Play(),
                new Largest(),
                toList([
                  class$("text-violet-500"),
                  on_click(new StreamAlbum(album3, 0))
                ])
              )
            ])
          ),
          div(toList([]), toList([]))
        ]);
        return reverse(_pipe);
      })()
    );
  }
}
function desktop_page(m, id3) {
  return try$(
    (() => {
      let _pipe = m.albums;
      let _pipe$1 = map_get(_pipe, id3);
      return replace_error(
        _pipe$1,
        toList([
          div(
            toList([
              class$(
                "flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-8"
              ),
              class$(scrollbar_class)
            ]),
            toList([
              div(
                toList([class$("py-1 h-12 w-48")]),
                toList([
                  div(
                    toList([
                      class$(
                        "w-full h-full animate-pulse bg-zinc-800"
                      )
                    ]),
                    toList([])
                  )
                ])
              ),
              div(
                toList([class$("py-2 h-8 w-80")]),
                toList([
                  div(
                    toList([
                      class$(
                        "w-full h-full animate-pulse bg-zinc-800"
                      )
                    ]),
                    toList([])
                  )
                ])
              )
            ])
          )
        ])
      );
    })(),
    (album3) => {
      let _block;
      {
        let _block$1;
        let _pipe = create();
        _block$1 = get2(_pipe, "auth");
        let $ = _block$1;
        let stg;
        if ($ instanceof Ok) {
          stg = $[0];
        } else {
          throw makeError(
            "let_assert",
            FILEPATH11,
            "somachord/pages/album",
            70,
            "desktop_page",
            "Pattern match failed, no pattern matched the value.",
            {
              value: $,
              start: 1761,
              end: 1821,
              pattern_start: 1772,
              pattern_end: 1779
            }
          );
        }
        _block = stg.auth;
      }
      let auth_details = _block;
      return new Ok(
        toList([
          div(
            toList([
              class$("flex-1 flex flex-col gap-6"),
              (() => {
                let $ = m.layout;
                if ($ instanceof Desktop) {
                  return class$("overflow-y-auto pr-4");
                } else {
                  return none();
                }
              })(),
              class$(scrollbar_class)
            ]),
            toList([
              h1(
                toList([
                  class$("text-3xl text-zinc-300 font-semibold")
                ]),
                toList([text2(album3.name)])
              ),
              div(
                toList([
                  class$(
                    "flex-wrap flex gap-3 text-xs text-zinc-400 items-center"
                  )
                ]),
                toList([
                  span(
                    toList([class$("flex gap-2 items-center")]),
                    toList([
                      i(
                        toList([class$("text-xl ph ph-user-sound")]),
                        toList([])
                      ),
                      artists(album3.artists, toList([]))
                    ])
                  ),
                  span(toList([]), toList([text2("\u2022")])),
                  span(
                    toList([]),
                    toList([
                      text2(
                        (() => {
                          let _pipe = album3.year;
                          return to_string2(_pipe);
                        })()
                      )
                    ])
                  ),
                  span(toList([]), toList([text2("\u2022")])),
                  span(
                    toList([class$("text-nowrap")]),
                    toList([
                      text2(
                        (() => {
                          let _block$1;
                          let _pipe = album3.songs;
                          _block$1 = length(_pipe);
                          let song_count = _block$1;
                          return to_string2(song_count) + " song" + (() => {
                            let $ = song_count === 1;
                            if ($) {
                              return "";
                            } else {
                              return "s";
                            }
                          })();
                        })()
                      )
                    ])
                  ),
                  span(toList([]), toList([text2("\u2022")])),
                  span(
                    toList([class$("text-nowrap")]),
                    toList([
                      text2(
                        (() => {
                          let minutes2 = globalThis.Math.trunc(
                            album3.duration / 60
                          );
                          let seconds3 = album3.duration % 60;
                          return to_string2(minutes2) + " min, " + to_string2(
                            seconds3
                          ) + " sec";
                        })()
                      )
                    ])
                  )
                ])
              ),
              (() => {
                let $ = m.layout;
                if ($ instanceof Desktop) {
                  return none3();
                } else {
                  return div(
                    toList([class$("flex flex-wrap gap-4")]),
                    map(album3.genres, tag)
                  );
                }
              })(),
              buttons(m, album3),
              div(
                toList([class$("flex flex-col gap-4")]),
                (() => {
                  let _pipe = prepend(
                    (() => {
                      let $ = m.layout;
                      if ($ instanceof Desktop) {
                        return none3();
                      } else {
                        return mobile_space();
                      }
                    })(),
                    (() => {
                      let _pipe2 = index_map(
                        album3.songs,
                        (song3, index5) => {
                          return song2(
                            song3,
                            toList([
                              attribute2(
                                "data-index",
                                (() => {
                                  let _pipe3 = index5 + 1;
                                  return to_string2(_pipe3);
                                })()
                              ),
                              (() => {
                                let $ = m.current_song.id === song3.id;
                                if ($) {
                                  return attribute2(
                                    "data-playing",
                                    ""
                                  );
                                } else {
                                  return none();
                                }
                              })()
                            ]),
                            false,
                            new StreamAlbum(album3, index5)
                          );
                        }
                      );
                      return reverse(_pipe2);
                    })()
                  );
                  return reverse(_pipe);
                })()
              )
            ])
          ),
          div(
            toList([class$("flex flex-col gap-8 select-none")]),
            toList([
              img(
                toList([
                  src(
                    cover_url(auth_details, album3.cover_art_id, 500)
                  ),
                  class$(
                    "self-center w-52 h-52 md:w-80 md:h-80 object-scale rounded-md"
                  )
                ])
              ),
              (() => {
                let $ = m.layout;
                if ($ instanceof Desktop) {
                  return div(
                    toList([class$("flex flex-wrap gap-4")]),
                    map(album3.genres, tag)
                  );
                } else {
                  return none3();
                }
              })()
            ])
          )
        ])
      );
    }
  );
}
function page2(m, id3) {
  return div(
    toList([
      class$("flex-1 flex gap-4 p-8 rounded-md border-zinc-800"),
      (() => {
        let $ = m.layout;
        if ($ instanceof Desktop) {
          return class$("border overflow-hidden");
        } else {
          return class$("flex-col overflow-y-auto");
        }
      })()
    ]),
    (() => {
      let $ = m.layout;
      let $1 = (() => {
        let _pipe = desktop_page(m, id3);
        return unwrap_both(_pipe);
      })();
      if ($ instanceof Desktop) {
        return $1;
      } else {
        let elems = $1;
        let _pipe = elems;
        return reverse(_pipe);
      }
    })()
  );
}

// build/dev/javascript/somachord/somachord/pages/error.mjs
var NoConnection = class extends CustomType {
};
var NotFound3 = class extends CustomType {
};
var ServerDown = class extends CustomType {
};
var Generic = class extends CustomType {
};
function from_rsvp(error) {
  if (error instanceof HttpError) {
    return new NoConnection();
  } else if (error instanceof NetworkError2) {
    return new NoConnection();
  } else {
    return new Generic();
  }
}
function text_section(face, title2) {
  return div(
    toList([
      class$("text-center font-[Poppins] font-extrabold text-3xl")
    ]),
    toList([
      h1(toList([]), toList([text2(face)])),
      h1(toList([]), toList([text2(title2)]))
    ])
  );
}
function no_connection(event4) {
  return toList([
    text_section("( \uFF9F\u30EE\uFF9F)", "No Connection"),
    button(
      toList([
        class$(
          "rounded-full px-4 py-2 bg-white hover:bg-white/80 text-black"
        ),
        event4
      ]),
      toList([text2("Retry")])
    )
  ]);
}
function not_found() {
  return toList([
    text_section("(O_O;)", "Not Found"),
    p(toList([]), toList([text2("there's nothing here....")])),
    a(
      toList([href("/")]),
      toList([
        button(
          toList([
            class$(
              "rounded-full px-4 py-2 bg-white hover:bg-white/80 text-black"
            )
          ]),
          toList([text2("Go Home")])
        )
      ])
    )
  ]);
}
function server_down() {
  return toList([
    text_section("(\uFF1B\u4E00_\u4E00)", "Server Down"),
    p(
      toList([]),
      toList([text2("i couldn't reach the music server...")])
    )
  ]);
}
function generic() {
  return toList([
    text_section("\u0298\u203F\u0298", "Ooops.."),
    p(
      toList([]),
      toList([text2("this is odd, can you try again?")])
    )
  ]);
}
function page3(error_type, button_event) {
  return div(
    toList([
      class$(
        "flex-1 h-full flex flex-col items-center justify-center gap-4"
      )
    ]),
    (() => {
      if (error_type instanceof NoConnection) {
        return no_connection(button_event);
      } else if (error_type instanceof NotFound3) {
        return not_found();
      } else if (error_type instanceof ServerDown) {
        return server_down();
      } else {
        return generic();
      }
    })()
  );
}

// build/dev/javascript/somachord/somachord/pages/artist.mjs
var FILEPATH12 = "src/somachord/pages/artist.gleam";
var Model5 = class extends CustomType {
  constructor(current_tab, artist2, artist_id, top_songs2, auth_details, layout2, page_error) {
    super();
    this.current_tab = current_tab;
    this.artist = artist2;
    this.artist_id = artist_id;
    this.top_songs = top_songs2;
    this.auth_details = auth_details;
    this.layout = layout2;
    this.page_error = page_error;
  }
};
var Home2 = class extends CustomType {
};
var Albums2 = class extends CustomType {
};
var SinglesEPs = class extends CustomType {
};
var ChangeTab = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ArtistID = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ArtistRetrieved = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var TopSongsRetrieved = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlayArtist = class extends CustomType {
};
var PlayAlbum = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var PlaySong = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var Nothing = class extends CustomType {
};
function tab_as_string2(tab) {
  if (tab instanceof Home2) {
    return "Home";
  } else if (tab instanceof Albums2) {
    return "Albums";
  } else if (tab instanceof SinglesEPs) {
    return "Singles & EPs";
  } else {
    return "About";
  }
}
function element7(attrs) {
  return element2(
    "artist-page",
    prepend(
      class$(
        "flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500"
      ),
      attrs
    ),
    toList([])
  );
}
function init5(_) {
  return [
    new Model5(
      new Home2(),
      new None(),
      "",
      toList([]),
      (() => {
        let $ = (() => {
          let _pipe = create();
          return get2(_pipe, "auth");
        })();
        if ($ instanceof Ok) {
          let stg = $[0];
          return new Some(stg.auth);
        } else {
          return new None();
        }
      })(),
      layout(),
      new None()
    ),
    none2()
  ];
}
function play_json(id3, type_2) {
  return object2(
    toList([["id", string4(id3)], ["type", string4(type_2)]])
  );
}
function update5(m, msg) {
  if (msg instanceof ChangeTab) {
    let tab = msg[0];
    return [
      new Model5(
        tab,
        m.artist,
        m.artist_id,
        m.top_songs,
        m.auth_details,
        m.layout,
        m.page_error
      ),
      none2()
    ];
  } else if (msg instanceof ArtistID) {
    let id3 = msg[0];
    return [
      new Model5(
        m.current_tab,
        m.artist,
        id3,
        m.top_songs,
        m.auth_details,
        m.layout,
        new None()
      ),
      (() => {
        let $ = m.auth_details;
        if ($ instanceof Some) {
          let auth = $[0];
          return artist(
            auth,
            id3,
            (var0) => {
              return new ArtistRetrieved(var0);
            }
          );
        } else {
          return none2();
        }
      })()
    ];
  } else if (msg instanceof ArtistRetrieved) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let artist2 = $1[0];
        let $2 = m.auth_details;
        let auth_details;
        if ($2 instanceof Some) {
          auth_details = $2[0];
        } else {
          throw makeError(
            "let_assert",
            FILEPATH12,
            "somachord/pages/artist",
            124,
            "update",
            "Pattern match failed, no pattern matched the value.",
            {
              value: $2,
              start: 2725,
              end: 2778,
              pattern_start: 2736,
              pattern_end: 2761
            }
          );
        }
        return [
          new Model5(
            m.current_tab,
            new Some(new Ok(artist2)),
            m.artist_id,
            m.top_songs,
            m.auth_details,
            m.layout,
            m.page_error
          ),
          top_songs(
            auth_details,
            artist2.name,
            (var0) => {
              return new TopSongsRetrieved(var0);
            }
          )
        ];
      } else {
        throw makeError(
          "panic",
          FILEPATH12,
          "somachord/pages/artist",
          130,
          "update",
          "idk this guy",
          {}
        );
      }
    } else {
      let e = $[0];
      return [
        new Model5(
          m.current_tab,
          m.artist,
          m.artist_id,
          m.top_songs,
          m.auth_details,
          m.layout,
          new Some(from_rsvp(e))
        ),
        none2()
      ];
    }
  } else if (msg instanceof TopSongsRetrieved) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let songs = $1[0];
        return [
          new Model5(
            m.current_tab,
            m.artist,
            m.artist_id,
            songs,
            m.auth_details,
            m.layout,
            m.page_error
          ),
          none2()
        ];
      } else {
        return [m, none2()];
      }
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof PlayArtist) {
    return [m, emit("play", play_json(m.artist_id, "artist"))];
  } else if (msg instanceof PlayAlbum) {
    let id3 = msg.id;
    return [m, emit("play", play_json(id3, "album"))];
  } else if (msg instanceof PlaySong) {
    let id3 = msg.id;
    return [m, emit("play", play_json(id3, "song"))];
  } else {
    return [m, none2()];
  }
}
function tab_element2(m, tab) {
  return span(
    toList([
      on_click(new ChangeTab(tab)),
      class$("relative cursor-pointer"),
      (() => {
        let $ = isEqual(tab, m.current_tab);
        if ($) {
          return class$("text-zinc-100");
        } else {
          return class$("text-zinc-500 hover:text-zinc-300");
        }
      })()
    ]),
    toList([
      text2(tab_as_string2(tab)),
      (() => {
        let $ = isEqual(tab, m.current_tab);
        if ($) {
          return div(
            toList([
              class$(
                "absolute top-9.25 w-full h-1 border-b border-violet-500"
              )
            ]),
            toList([])
          );
        } else {
          return none3();
        }
      })()
    ])
  );
}
function view_home(m) {
  return toList([
    div(
      toList([class$("w-full space-y-4")]),
      toList([
        h1(
          toList([class$("font-semibold text-xl")]),
          toList([text2("Most Popular")])
        ),
        div(
          toList([class$("space-y-4")]),
          index_map(
            m.top_songs,
            (song3, index5) => {
              return song2(
                song3,
                toList([
                  attribute2(
                    "data-index",
                    (() => {
                      let _pipe = index5 + 1;
                      return to_string2(_pipe);
                    })()
                  ),
                  on_click(new PlaySong(song3.id))
                ]),
                true,
                new PlaySong(song3.id)
              );
            }
          )
        )
      ])
    )
  ]);
}
function view_albums(m) {
  return toList([
    div(
      toList([class$("flex flex-wrap gap-4")]),
      (() => {
        let _pipe = try$(
          (() => {
            let _pipe2 = to_result(m.artist, void 0);
            return unwrap2(_pipe2, new Error2(void 0));
          })(),
          (artist2) => {
            return try$(
              to_result(artist2.albums, void 0),
              (albums) => {
                let _pipe2 = map(
                  (() => {
                    let _pipe3 = albums;
                    return filter(
                      _pipe3,
                      (album3) => {
                        let _pipe$1 = (() => {
                          let _pipe$12 = album3.release_types;
                          return contains(
                            _pipe$12,
                            new Single()
                          );
                        })() || (() => {
                          let _pipe$12 = album3.release_types;
                          return contains(_pipe$12, new EP());
                        })();
                        return negate(_pipe$1);
                      }
                    );
                  })(),
                  (album3) => {
                    return album2(
                      album3,
                      (id3) => {
                        return new PlayAlbum(id3);
                      }
                    );
                  }
                );
                return new Ok(_pipe2);
              }
            );
          }
        );
        return unwrap2(_pipe, toList([none3()]));
      })()
    )
  ]);
}
function view_singles(m) {
  return toList([
    div(
      toList([class$("flex flex-wrap gap-4")]),
      (() => {
        let _pipe = try$(
          (() => {
            let _pipe2 = to_result(m.artist, void 0);
            return unwrap2(_pipe2, new Error2(void 0));
          })(),
          (artist2) => {
            return try$(
              to_result(artist2.albums, void 0),
              (albums) => {
                let _pipe2 = map(
                  (() => {
                    let _pipe3 = albums;
                    return filter(
                      _pipe3,
                      (album3) => {
                        return (() => {
                          let _pipe$1 = album3.release_types;
                          return contains(
                            _pipe$1,
                            new Single()
                          );
                        })() || (() => {
                          let _pipe$1 = album3.release_types;
                          return contains(_pipe$1, new EP());
                        })();
                      }
                    );
                  })(),
                  (album3) => {
                    return album2(
                      album3,
                      (id3) => {
                        return new PlayAlbum(id3);
                      }
                    );
                  }
                );
                return new Ok(_pipe2);
              }
            );
          }
        );
        return unwrap2(_pipe, toList([none3()]));
      })()
    )
  ]);
}
function view_about(_) {
  return toList([
    div(
      toList([class$("flex gap-8 p-4")]),
      toList([
        div(
          toList([class$("relative")]),
          toList([
            h1(
              toList([
                class$(
                  "z-2 text-3xl absolute left-24 top-30 font-bold"
                )
              ]),
              toList([text2("#1 On Somachord")])
            ),
            div(
              toList([class$("wavy-circle bg-violet-500 self-start")]),
              toList([])
            )
          ])
        ),
        p(
          toList([
            class$("z-1 flex-1 text-zinc-300 text-md leading-8")
          ]),
          toList([
            text2(
              "Known as the \u201CCertified Vocal Queen\u201D, TAEYEON started her music career in 2007 as a member and lead vocalist of Girls\u2019 Generation, the legendary K-pop group that gained worldwide reputation as the No. 1 girl group in Asia. She is now one of the most respected female vocalists in the industry, capturing the hearts of many around the world, and making remarkable accomplishments as a solo artist.\n\nBefore making her official solo debut, TAEYEON participated in numerous original soundtracks that were highly successful in Korean music charts. In 2015, she released her first solo EP \u2018I\u2019 which ranked No. 1 on various Korean music charts as well as Billboard\u2019s World Albums chart. Since then, TAEYEON released a handful of hit singles that topped the music charts including \u2018I\u2019 \u2018Rain\u2019, \u2018Why\u2019, \u201811:11\u2019, \u2018Fine\u2019, \u2018Four Seasons\u2019, \u2018Spark\u2019, \u2018Happy\u2019 and \u2018Weekend\u2019 earning her numerous awards and nominations throughout her career. Most notably in January 2022, it was announced that TAEYEON has the highest album sales among solo female artists over the past decade according to Gaon Chart\u2018s 10-year cumulative album sales data, which made a big splash in the K-pop industry, proving her status as the \u201CCertified Vocal Queen\u201D. Most recently, ahead of her 3rd LP, she released a new single \u2018Can\u2019t Control Myself\u2019 which hit No. 1 on iTunes Top Songs chart in 14 regions around the world once again proving her global popularity.\n\n"
            )
          ])
        )
      ])
    )
  ]);
}
function view_real(m) {
  let _pipe = try$(
    (() => {
      let _pipe2 = m.auth_details;
      return to_result(_pipe2, none3());
    })(),
    (auth_details) => {
      let _pipe2 = div(
        toList([
          redirect_click(new Nothing()),
          class$("h-full")
        ]),
        toList([
          div(
            toList([
              class$(
                "relative h-[45%] p-8 flex items-end bg-violet-950"
              ),
              style("background-position-y", "20%"),
              (() => {
                let $ = (() => {
                  let _pipe3 = to_result(m.artist, void 0);
                  return unwrap2(_pipe3, new Error2(void 0));
                })();
                if ($ instanceof Ok) {
                  let artist2 = $[0];
                  return style(
                    "background-image",
                    "url('" + cover_url(
                      auth_details,
                      artist2.cover_art_id,
                      500
                    ) + "')"
                  );
                } else {
                  return none();
                }
              })(),
              class$("bg-cover bg-center")
            ]),
            toList([
              div(
                toList([
                  class$(
                    "bg-linear-to-tl md:bg-linear-to-l from-zinc-950 from-30% md:from-10% to-zinc-950/50 absolute top-0 left-0 h-full w-full"
                  )
                ]),
                toList([])
              ),
              div(
                toList([
                  class$(
                    "z-20 flex items-center justify-between gap-4 w-full"
                  )
                ]),
                toList([
                  div(
                    toList([]),
                    toList([
                      h1(
                        toList([
                          class$(
                            "font-extrabold text-4xl sm:text-5xl"
                          )
                        ]),
                        toList([
                          text2(
                            (() => {
                              let $ = (() => {
                                let _pipe3 = to_result(
                                  m.artist,
                                  void 0
                                );
                                return unwrap2(
                                  _pipe3,
                                  new Error2(void 0)
                                );
                              })();
                              if ($ instanceof Ok) {
                                let artist2 = $[0];
                                return artist2.name;
                              } else {
                                return "";
                              }
                            })()
                          )
                        ])
                      )
                    ])
                  ),
                  div(
                    toList([class$("flex items-center w-14 h-14")]),
                    toList([
                      div(
                        toList([
                          class$("flex items-center relative"),
                          on_click(new PlayArtist())
                        ]),
                        toList([
                          div(
                            toList([
                              class$(
                                "ml-2 z-5 absolute rounded-full bg-black w-8 h-8"
                              )
                            ]),
                            toList([])
                          ),
                          disabled_button(
                            new Play(),
                            new Custom("text-6xl"),
                            toList([class$("z-10 text-violet-500")])
                          )
                        ])
                      )
                    ])
                  )
                ])
              )
            ])
          ),
          div(
            toList([class$("font-[Poppins]")]),
            toList([
              div(
                toList([
                  class$(
                    "border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400"
                  )
                ]),
                toList([
                  tab_element2(m, new Home2()),
                  tab_element2(m, new Albums2()),
                  tab_element2(m, new SinglesEPs())
                ])
              ),
              div(
                toList([class$("p-4 flex")]),
                (() => {
                  let $ = m.current_tab;
                  if ($ instanceof Home2) {
                    return view_home(m);
                  } else if ($ instanceof Albums2) {
                    return view_albums(m);
                  } else if ($ instanceof SinglesEPs) {
                    return view_singles(m);
                  } else {
                    return view_about(m);
                  }
                })()
              )
            ])
          ),
          mobile_space()
        ])
      );
      return new Ok(_pipe2);
    }
  );
  return unwrap_both(_pipe);
}
function view6(m) {
  let $ = m.page_error;
  if ($ instanceof Some) {
    let e = $[0];
    return page3(e, on_click(new ArtistID(m.artist_id)));
  } else {
    return view_real(m);
  }
}
function register4() {
  let app = component(
    init5,
    update5,
    view6,
    toList([
      on_attribute_change(
        "artist-id",
        (value3) => {
          return new Ok(
            (() => {
              let _pipe = value3;
              return new ArtistID(_pipe);
            })()
          );
        }
      )
    ])
  );
  return make_component(app, "artist-page");
}

// build/dev/javascript/somachord/somachord/pages/home.mjs
var FILEPATH13 = "src/somachord/pages/home.gleam";
var AlbumList2 = class extends CustomType {
  constructor(type_2, albums) {
    super();
    this.type_ = type_2;
    this.albums = albums;
  }
};
var Model6 = class extends CustomType {
  constructor(albumlists, failed) {
    super();
    this.albumlists = albumlists;
    this.failed = failed;
  }
};
var AlbumListRetrieved = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Play3 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Retry = class extends CustomType {
};
var ComponentClick2 = class extends CustomType {
};
function element8(attrs) {
  return element2(
    "home-page",
    prepend(
      (() => {
        let $ = layout();
        if ($ instanceof Desktop) {
          return class$("border");
        } else {
          return none();
        }
      })(),
      prepend(
        class$(
          "flex-1 p-4 rounded-md border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"
        ),
        attrs
      )
    ),
    toList([])
  );
}
function init6(_) {
  let storage = create();
  return [
    new Model6(toList([]), false),
    (() => {
      let $ = (() => {
        let _pipe = storage;
        return get2(_pipe, "auth");
      })();
      if ($ instanceof Ok) {
        let stg = $[0];
        return batch(
          toList([
            album_list(
              stg.auth,
              "frequent",
              0,
              16,
              (var0) => {
                return new AlbumListRetrieved(var0);
              }
            ),
            album_list(
              stg.auth,
              "newest",
              0,
              16,
              (var0) => {
                return new AlbumListRetrieved(var0);
              }
            ),
            album_list(
              stg.auth,
              "random",
              0,
              16,
              (var0) => {
                return new AlbumListRetrieved(var0);
              }
            )
          ])
        );
      } else {
        return none2();
      }
    })()
  ];
}
function update6(m, msg) {
  if (msg instanceof AlbumListRetrieved) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let type_2 = $1[0].type_;
        let list5 = $1[0].albums;
        return [
          new Model6(
            (() => {
              let _pipe = prepend(new AlbumList2(type_2, list5), m.albumlists);
              return sort(
                _pipe,
                (list1, list22) => {
                  let list_order = (type_3) => {
                    if (type_3 === "frequent") {
                      return 4;
                    } else if (type_3 === "newest") {
                      return 3;
                    } else if (type_3 === "random") {
                      return 2;
                    } else {
                      return 1;
                    }
                  };
                  return compare2(
                    list_order(list1.type_),
                    list_order(list22.type_)
                  );
                }
              );
            })(),
            m.failed
          ),
          none2()
        ];
      } else {
        let e = $1[0];
        echo6("subsonic error", void 0, "src/somachord/pages/home.gleam", 128);
        echo6(e, void 0, "src/somachord/pages/home.gleam", 129);
        return [m, none2()];
      }
    } else {
      let e = $[0];
      echo6("rsvp error", void 0, "src/somachord/pages/home.gleam", 133);
      echo6(e, void 0, "src/somachord/pages/home.gleam", 134);
      return [new Model6(m.albumlists, true), none2()];
    }
  } else if (msg instanceof Play3) {
    let req = msg[0];
    return [
      m,
      emit(
        "play",
        object2(
          toList([
            ["id", string4(req.id)],
            ["type", string4(req.type_)]
          ])
        )
      )
    ];
  } else if (msg instanceof Retry) {
    let list_types = toList(["frequent", "newest", "random"]);
    let _block;
    let _pipe = m.albumlists;
    _block = map(_pipe, (al) => {
      return al.type_;
    });
    let retrieved = _block;
    let _block$1;
    let _pipe$1 = list_types;
    _block$1 = filter(
      _pipe$1,
      (entry) => {
        let _pipe$2 = retrieved;
        let _pipe$3 = contains(_pipe$2, entry);
        return negate(_pipe$3);
      }
    );
    let failed = _block$1;
    let reqs = map(
      failed,
      (type_2) => {
        return album_list(
          (() => {
            let _block$2;
            let _pipe$2 = create();
            _block$2 = get2(_pipe$2, "auth");
            let $ = _block$2;
            let stg;
            if ($ instanceof Ok) {
              stg = $[0];
            } else {
              throw makeError(
                "let_assert",
                FILEPATH13,
                "somachord/pages/home",
                115,
                "update",
                "Pattern match failed, no pattern matched the value.",
                {
                  value: $,
                  start: 3021,
                  end: 3081,
                  pattern_start: 3032,
                  pattern_end: 3039
                }
              );
            }
            return stg.auth;
          })(),
          type_2,
          0,
          11,
          (var0) => {
            return new AlbumListRetrieved(var0);
          }
        );
      }
    );
    return [m, batch(reqs)];
  } else {
    return [m, none2()];
  }
}
function view7(m) {
  return lazy_guard(
    m.failed,
    () => {
      return page3(
        new NoConnection(),
        on_click(new Retry())
      );
    },
    () => {
      return lazy_guard(
        (() => {
          let _pipe = m.albumlists;
          return length(_pipe);
        })() > 3,
        () => {
          return none3();
        },
        () => {
          return div(
            toList([
              redirect_click(new ComponentClick2()),
              class$("flex flex-col gap-4 overflow-y-auto")
            ]),
            (() => {
              let _pipe = prepend(
                (() => {
                  let $ = layout();
                  if ($ instanceof Desktop) {
                    return none3();
                  } else {
                    return mobile_space();
                  }
                })(),
                map(
                  m.albumlists,
                  (album_list2) => {
                    return guard(
                      (() => {
                        let _pipe2 = album_list2.albums;
                        return is_empty2(_pipe2);
                      })(),
                      none3(),
                      () => {
                        return div(
                          toList([]),
                          toList([
                            h1(
                              toList([
                                class$(
                                  "sticky ml-2 text-2xl font-medium"
                                )
                              ]),
                              toList([
                                text2(
                                  (() => {
                                    let $ = album_list2.type_;
                                    if ($ === "newest") {
                                      return "New Additions";
                                    } else if ($ === "frequent") {
                                      return "Most Played";
                                    } else {
                                      let typ = $;
                                      return capitalise(typ);
                                    }
                                  })()
                                )
                              ])
                            ),
                            div(
                              toList([
                                class$(
                                  "flex overflow-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"
                                )
                              ]),
                              map(
                                album_list2.albums,
                                (album3) => {
                                  return album2(
                                    album3,
                                    (id3) => {
                                      return new Play3(
                                        new PlayRequest("album", id3, 0)
                                      );
                                    }
                                  );
                                }
                              )
                            )
                          ])
                        );
                      }
                    );
                  }
                )
              );
              return reverse(_pipe);
            })()
          );
        }
      );
    }
  );
}
function register5() {
  let app = component(
    init6,
    update6,
    view7,
    toList([open_shadow_root(true)])
  );
  return make_component(app, "home-page");
}
function echo6(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector6();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector6 = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/dev/javascript/somachord/somachord/pages/library.mjs
var FILEPATH14 = "src/somachord/pages/library.gleam";
var Grid = class extends CustomType {
};
var List2 = class extends CustomType {
};
var Model7 = class extends CustomType {
  constructor(playlists2, display, search_query, page_error) {
    super();
    this.playlists = playlists2;
    this.display = display;
    this.search_query = search_query;
    this.page_error = page_error;
  }
};
var ChangeDisplay = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Playlists3 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlayPlaylist = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var RetryPlaylists = class extends CustomType {
};
var Nothing2 = class extends CustomType {
};
function element9(attrs) {
  return element2(
    "library-page",
    prepend(
      class$(
        "flex-1 rounded-md border border-zinc-800 overflow-x-hidden overflow-y-auto"
      ),
      prepend(class$(scrollbar_class), attrs)
    ),
    toList([])
  );
}
function init7(_) {
  let storage = create();
  return [
    new Model7(
      toList([]),
      (() => {
        let $ = layout();
        if ($ instanceof Desktop) {
          return new Grid();
        } else {
          return new List2();
        }
      })(),
      "",
      new None()
    ),
    (() => {
      let $ = (() => {
        let _pipe = storage;
        return get2(_pipe, "auth");
      })();
      if ($ instanceof Ok) {
        let stg = $[0];
        return playlists(
          stg.auth,
          (var0) => {
            return new Playlists3(var0);
          }
        );
      } else {
        return none2();
      }
    })()
  ];
}
function play_json2(id3, index5) {
  return object2(
    toList([
      ["id", string4(id3)],
      ["type", string4("playlist")],
      ["index", int3(index5)]
    ])
  );
}
function update7(m, msg) {
  if (msg instanceof ChangeDisplay) {
    let display = msg[0];
    return [
      new Model7(m.playlists, display, m.search_query, m.page_error),
      none2()
    ];
  } else if (msg instanceof Playlists3) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let playlists2 = $1[0];
        return [
          new Model7(playlists2, m.display, m.search_query, m.page_error),
          none2()
        ];
      } else {
        return [m, none2()];
      }
    } else {
      let e = $[0];
      return [
        new Model7(
          m.playlists,
          m.display,
          m.search_query,
          new Some(from_rsvp(e))
        ),
        none2()
      ];
    }
  } else if (msg instanceof PlayPlaylist) {
    let id3 = msg.id;
    return [m, emit("play", play_json2(id3, 0))];
  } else if (msg instanceof RetryPlaylists) {
    return [
      new Model7(m.playlists, m.display, m.search_query, new None()),
      playlists(
        (() => {
          let _block;
          let _pipe = create();
          _block = get2(_pipe, "auto");
          let $ = _block;
          let stg;
          if ($ instanceof Ok) {
            stg = $[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH14,
              "somachord/pages/library",
              106,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $,
                start: 2186,
                end: 2246,
                pattern_start: 2197,
                pattern_end: 2204
              }
            );
          }
          return stg.auth;
        })(),
        (var0) => {
          return new Playlists3(var0);
        }
      )
    ];
  } else {
    return [m, none2()];
  }
}
function active_button(m, target3) {
  let $ = isEqual(m.display, target3);
  if ($) {
    return class$("bg-zinc-800 text-zinc-300 rounded-md");
  } else {
    return none();
  }
}
function search_filter(playlists2, query2) {
  let $ = query2 === "";
  if ($) {
    return playlists2;
  } else {
    return filter(
      playlists2,
      (playlist3) => {
        let _pipe = lowercase(playlist3.name);
        return contains_string(_pipe, lowercase(query2));
      }
    );
  }
}
function real_view(m) {
  let _block;
  {
    let _block$1;
    let _pipe = create();
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH14,
        "somachord/pages/library",
        134,
        "real_view",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 2781,
          end: 2841,
          pattern_start: 2792,
          pattern_end: 2799
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return div(
    toList([
      class$("flex flex-col"),
      redirect_click(new Nothing2())
    ]),
    toList([
      div(
        toList([
          class$(
            "px-6 py-4 sticky top-0 z-50 bg-zinc-950 text-zinc-400 space-x-12 inline-flex"
          )
        ]),
        toList([
          div(
            toList([class$("space-x-4")]),
            toList([
              i(
                toList([
                  active_button(m, new Grid()),
                  on_click(new ChangeDisplay(new Grid())),
                  class$("p-2 text-3xl ph ph-squares-four")
                ]),
                toList([])
              ),
              i(
                toList([
                  active_button(m, new List2()),
                  on_click(new ChangeDisplay(new List2())),
                  class$("p-2 text-3xl ph ph-list-bullets")
                ]),
                toList([])
              )
            ])
          )
        ])
      ),
      (() => {
        let $ = m.display;
        if ($ instanceof Grid) {
          return div(
            toList([
              class$(
                "px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              )
            ]),
            map(
              (() => {
                let _pipe = m.playlists;
                return search_filter(_pipe, m.search_query);
              })(),
              (playlist3) => {
                return playlist2(
                  playlist3,
                  (var0) => {
                    return new PlayPlaylist(var0);
                  }
                );
              }
            )
          );
        } else {
          return div(
            toList([class$("flex flex-col")]),
            map(
              (() => {
                let _pipe = m.playlists;
                return search_filter(_pipe, m.search_query);
              })(),
              (playlist3) => {
                return div(
                  toList([
                    class$(
                      "flex items-center px-4 py-3 border-b border-zinc-800 hover:bg-zinc-900 gap-4"
                    )
                  ]),
                  toList([
                    div(
                      toList([
                        class$(
                          "w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center"
                        )
                      ]),
                      toList([
                        (() => {
                          let $1 = playlist3.cover_art_id === "";
                          if ($1) {
                            return i(
                              toList([
                                class$(
                                  "text-zinc-500 text-xl ph ph-music-notes-simple"
                                )
                              ]),
                              toList([])
                            );
                          } else {
                            return a(
                              toList([href("/album/" + playlist3.id)]),
                              toList([
                                img(
                                  toList([
                                    src(
                                      cover_url(
                                        auth_details,
                                        playlist3.cover_art_id,
                                        500
                                      )
                                    ),
                                    class$(
                                      "hover:opacity-50 transition-all duration-200 rounded-md object-cover"
                                    )
                                  ])
                                )
                              ])
                            );
                          }
                        })()
                      ])
                    ),
                    div(
                      toList([class$("flex flex-col")]),
                      toList([
                        a(
                          toList([href("/playlist/" + playlist3.id)]),
                          toList([
                            span(
                              toList([
                                class$(
                                  "hover:underline font-medium text-zinc-200"
                                )
                              ]),
                              toList([text2(playlist3.name)])
                            )
                          ])
                        ),
                        span(
                          toList([
                            class$(
                              "text-xs font-light text-zinc-500"
                            )
                          ]),
                          toList([
                            text2(
                              to_string2(playlist3.song_count) + " song" + (() => {
                                let $1 = playlist3.song_count === 1;
                                if ($1) {
                                  return "";
                                } else {
                                  return "s";
                                }
                              })()
                            )
                          ])
                        )
                      ])
                    ),
                    div(
                      toList([class$("flex flex-1 justify-end")]),
                      toList([
                        i(
                          toList([
                            on_click(new PlayPlaylist(playlist3.id)),
                            class$("text-lg ph-fill ph-play")
                          ]),
                          toList([])
                        )
                      ])
                    )
                  ])
                );
              }
            )
          );
        }
      })()
    ])
  );
}
function view8(m) {
  let $ = m.page_error;
  if ($ instanceof Some) {
    let e = $[0];
    return page3(e, on_click(new RetryPlaylists()));
  } else {
    return real_view(m);
  }
}
function register7() {
  let app = component(init7, update7, view8, toList([]));
  return make_component(app, "library-page");
}

// build/dev/javascript/somachord/somachord/pages/loading.mjs
function page4() {
  return div(
    toList([
      class$(
        "flex-1 flex flex-col items-center justify-center gap-4"
      )
    ]),
    toList([
      div(
        toList([
          class$(
            "text-center font-[Poppins,sans-serif] font-extrabold text-3xl"
          )
        ]),
        toList([
          h1(toList([]), toList([text2("\u01AA(\u02D8\u2323\u02D8)\u0283")])),
          h1(toList([]), toList([text2("Loading....")]))
        ])
      )
    ])
  );
}

// build/dev/javascript/somachord/somachord/pages/playlist.mjs
var FILEPATH15 = "src/somachord/pages/playlist.gleam";
var PlaylistID = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var CurrentSongID = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlaylistResponse = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var LikedSongsResponse = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlayPlaylist2 = class extends CustomType {
  constructor(index5, shuffle3) {
    super();
    this.index = index5;
    this.shuffle = shuffle3;
  }
};
var ShowEditor = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlaylistUpdate = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlaylistUpdateResponse = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ComponentClick3 = class extends CustomType {
};
var Model8 = class extends CustomType {
  constructor(playlist3, id3, layout2, show_editor, playlist_form, current_song_id, page_error) {
    super();
    this.playlist = playlist3;
    this.id = id3;
    this.layout = layout2;
    this.show_editor = show_editor;
    this.playlist_form = playlist_form;
    this.current_song_id = current_song_id;
    this.page_error = page_error;
  }
};
var PlaylistForm = class extends CustomType {
  constructor(name2, description, public$) {
    super();
    this.name = name2;
    this.description = description;
    this.public = public$;
  }
};
function element10(attrs) {
  return element2(
    "playlist-page",
    prepend(
      class$(
        "flex-1 p-8 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"
      ),
      attrs
    ),
    toList([])
  );
}
function init8(_) {
  return [
    new Model8(
      new_playlist(),
      "",
      layout(),
      false,
      new$10(
        field2(
          "playlistName",
          (() => {
            let _pipe = parse_string;
            return check_not_empty(_pipe);
          })(),
          (playlist_name) => {
            return field2(
              "playlistDescription",
              parse_string,
              (playlist_description) => {
                return field2(
                  "playlistPublic",
                  parse_checkbox,
                  (playlist_public) => {
                    return success2(
                      new PlaylistForm(
                        playlist_name,
                        playlist_description,
                        playlist_public
                      )
                    );
                  }
                );
              }
            );
          }
        )
      ),
      "",
      new None()
    ),
    none2()
  ];
}
function playlist_json(playlist3, index5, shuffle3) {
  return object2(
    toList([
      ["playlist", playlist_encode(playlist3)],
      ["index", int3(index5)],
      ["shuffle", bool2(shuffle3)]
    ])
  );
}
function update8(m, msg) {
  if (msg instanceof PlaylistID) {
    let id3 = msg[0];
    return [
      new Model8(
        m.playlist,
        id3,
        m.layout,
        m.show_editor,
        m.playlist_form,
        m.current_song_id,
        new None()
      ),
      (() => {
        let $ = id3 === somachord_likes_playlist_id;
        if ($) {
          return likes(
            (() => {
              let _block;
              let _pipe = create();
              _block = get2(_pipe, "auth");
              let $1 = _block;
              let stg;
              if ($1 instanceof Ok) {
                stg = $1[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH15,
                  "somachord/pages/playlist",
                  130,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $1,
                    start: 3292,
                    end: 3352,
                    pattern_start: 3303,
                    pattern_end: 3310
                  }
                );
              }
              return stg.auth;
            })(),
            (var0) => {
              return new LikedSongsResponse(var0);
            }
          );
        } else {
          return playlist(
            (() => {
              let _block;
              let _pipe = create();
              _block = get2(_pipe, "auth");
              let $1 = _block;
              let stg;
              if ($1 instanceof Ok) {
                stg = $1[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH15,
                  "somachord/pages/playlist",
                  138,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $1,
                    start: 3539,
                    end: 3599,
                    pattern_start: 3550,
                    pattern_end: 3557
                  }
                );
              }
              return stg.auth;
            })(),
            id3,
            (var0) => {
              return new PlaylistResponse(var0);
            }
          );
        }
      })()
    ];
  } else if (msg instanceof CurrentSongID) {
    let id3 = msg[0];
    return [
      new Model8(
        m.playlist,
        m.id,
        m.layout,
        m.show_editor,
        m.playlist_form,
        id3,
        m.page_error
      ),
      none2()
    ];
  } else if (msg instanceof PlaylistResponse) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let playlist3 = $1[0];
        return [
          new Model8(
            playlist3,
            m.id,
            m.layout,
            m.show_editor,
            m.playlist_form,
            m.current_song_id,
            m.page_error
          ),
          none2()
        ];
      } else {
        let e = $;
        echo7(e, void 0, "src/somachord/pages/playlist.gleam", 179);
        return [m, none2()];
      }
    } else {
      let e = $[0];
      echo7(e, void 0, "src/somachord/pages/playlist.gleam", 175);
      return [
        new Model8(
          m.playlist,
          m.id,
          m.layout,
          m.show_editor,
          m.playlist_form,
          m.current_song_id,
          new Some(from_rsvp(e))
        ),
        none2()
      ];
    }
  } else if (msg instanceof LikedSongsResponse) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let songs = $1[0];
        let _block;
        let _record = new_playlist();
        _block = new Playlist(
          somachord_likes_playlist_id,
          "Liked Songs",
          "You",
          false,
          "",
          _record.created,
          _record.updated,
          fold(songs, 0, (acc, song3) => {
            return acc + song3.duration;
          }),
          songs,
          length(songs)
        );
        let playlist3 = _block;
        return [
          new Model8(
            playlist3,
            m.id,
            m.layout,
            m.show_editor,
            m.playlist_form,
            m.current_song_id,
            m.page_error
          ),
          none2()
        ];
      } else {
        let res = $1;
        echo7(res, void 0, "src/somachord/pages/playlist.gleam", 163);
        return [m, none2()];
      }
    } else {
      let e = $[0];
      echo7(e, void 0, "src/somachord/pages/playlist.gleam", 167);
      return [
        new Model8(
          m.playlist,
          m.id,
          m.layout,
          m.show_editor,
          m.playlist_form,
          m.current_song_id,
          new Some(from_rsvp(e))
        ),
        none2()
      ];
    }
  } else if (msg instanceof PlayPlaylist2) {
    let index5 = msg.index;
    let shuffle3 = msg.shuffle;
    echo7(
      "playing playlist",
      void 0,
      "src/somachord/pages/playlist.gleam",
      183
    );
    return [
      m,
      emit("playPlaylist", playlist_json(m.playlist, index5, shuffle3))
    ];
  } else if (msg instanceof ShowEditor) {
    let show = msg[0];
    return [
      new Model8(
        m.playlist,
        m.id,
        m.layout,
        show,
        m.playlist_form,
        m.current_song_id,
        m.page_error
      ),
      none2()
    ];
  } else if (msg instanceof PlaylistUpdate) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let playlist_update_info = $[0];
      return [
        new Model8(
          m.playlist,
          m.id,
          m.layout,
          m.show_editor,
          (() => {
            let _pipe = m.playlist_form;
            return set_values(
              _pipe,
              toList([
                ["playlistName", playlist_update_info.name],
                ["playlistDescription", playlist_update_info.description],
                [
                  "playlistPublic",
                  (() => {
                    let $1 = playlist_update_info.public;
                    if ($1) {
                      return "true";
                    } else {
                      return "false";
                    }
                  })()
                ]
              ])
            );
          })(),
          m.current_song_id,
          m.page_error
        ),
        update_playlist(
          (() => {
            let _block;
            let _pipe = create();
            _block = get2(_pipe, "auth");
            let $1 = _block;
            let stg;
            if ($1 instanceof Ok) {
              stg = $1[0];
            } else {
              throw makeError(
                "let_assert",
                FILEPATH15,
                "somachord/pages/playlist",
                206,
                "update",
                "Pattern match failed, no pattern matched the value.",
                {
                  value: $1,
                  start: 5564,
                  end: 5624,
                  pattern_start: 5575,
                  pattern_end: 5582
                }
              );
            }
            return stg.auth;
          })(),
          m.playlist.id,
          playlist_update_info.name,
          playlist_update_info.description,
          playlist_update_info.public,
          (var0) => {
            return new PlaylistUpdateResponse(var0);
          }
        )
      ];
    } else {
      echo7("form error!", void 0, "src/somachord/pages/playlist.gleam", 218);
      return [m, none2()];
    }
  } else if (msg instanceof PlaylistUpdateResponse) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        return [
          new Model8(
            (() => {
              let _record = m.playlist;
              return new Playlist(
                _record.id,
                (() => {
                  let _pipe = m.playlist_form;
                  return field_value(_pipe, "playlistName");
                })(),
                _record.owner,
                (() => {
                  let $2 = (() => {
                    let _pipe = m.playlist_form;
                    return field_value(_pipe, "playlistPublic");
                  })();
                  if ($2 === "true") {
                    return true;
                  } else {
                    return false;
                  }
                })(),
                _record.cover_art_id,
                _record.created,
                _record.updated,
                _record.duration,
                _record.songs,
                _record.song_count
              );
            })(),
            m.id,
            m.layout,
            false,
            m.playlist_form,
            m.current_song_id,
            m.page_error
          ),
          none2()
        ];
      } else {
        let e = $;
        echo7(e, void 0, "src/somachord/pages/playlist.gleam", 240);
        return [m, none2()];
      }
    } else {
      let e = $;
      echo7(e, void 0, "src/somachord/pages/playlist.gleam", 240);
      return [m, none2()];
    }
  } else {
    return [m, none2()];
  }
}
function editor(m) {
  let editor_submit = (fields) => {
    let _pipe = m.playlist_form;
    let _pipe$1 = add_values(_pipe, fields);
    let _pipe$2 = run2(_pipe$1);
    return new PlaylistUpdate(_pipe$2);
  };
  return div(
    toList([
      (() => {
        let $ = m.show_editor;
        if ($) {
          return none();
        } else {
          return class$("hidden");
        }
      })(),
      class$(
        "bg-zinc-950/75 z-100 absolute inset-0 flex justify-center items-center"
      )
    ]),
    toList([
      form(
        toList([
          on_submit(editor_submit),
          class$("bg-zinc-900 rounded-md p-4 flex flex-col gap-2")
        ]),
        toList([
          div(
            toList([class$("flex justify-between items-center")]),
            toList([
              h1(
                toList([class$("text-xl font-black text-white")]),
                toList([text2("Edit Playlist")])
              ),
              button2(
                new Close(),
                new Medium2(),
                toList([
                  on_click(new ShowEditor(false)),
                  class$("hover:bg-zinc-600 p-2 rounded-full")
                ])
              )
            ])
          ),
          div(
            toList([class$("flex flex-col gap-1")]),
            toList([
              label(
                toList([class$("text-sm text-zinc-400")]),
                toList([text2("Playlist Name")])
              ),
              input(
                toList([
                  class$(
                    "bg-zinc-800 text-white rounded-md p-2 w-64 focus:outline-none"
                  ),
                  value(m.playlist.name),
                  name("playlistName")
                ])
              )
            ])
          ),
          div(
            toList([class$("flex flex-col gap-1")]),
            toList([
              label(
                toList([class$("text-sm text-zinc-400")]),
                toList([text2("Playlist Description")])
              ),
              textarea(
                toList([
                  class$(
                    "bg-zinc-800 text-white rounded-md p-2 w-64 h-32 focus:outline-none resize-none"
                  ),
                  name("playlistDescription")
                ]),
                ""
              )
            ])
          ),
          div(
            toList([class$("flex flex-col gap-1")]),
            toList([
              div(
                toList([class$("flex justify-between items-center")]),
                toList([
                  label(
                    toList([class$("text-sm text-zinc-400")]),
                    toList([text2("Public Playlist")])
                  ),
                  label(
                    toList([
                      class$("relative inline-flex cursor-pointer")
                    ]),
                    toList([
                      input(
                        toList([
                          type_("checkbox"),
                          class$("sr-only peer"),
                          checked(m.playlist.public),
                          name("playlistPublic")
                        ])
                      ),
                      div(
                        toList([
                          class$(
                            "w-11 h-6 bg-zinc-800 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-400"
                          )
                        ]),
                        toList([])
                      )
                    ])
                  )
                ])
              )
            ])
          ),
          button(
            toList([
              class$(
                "bg-violet-600 text-white rounded-md px-4 py-2 mt-4 hover:bg-violet-700"
              )
            ]),
            toList([text2("Save Changes")])
          )
        ])
      )
    ])
  );
}
function buttons2(m) {
  let $ = m.layout;
  if ($ instanceof Desktop) {
    return div(
      toList([class$("text-zinc-400 flex gap-4 items-center")]),
      toList([
        button2(
          new Play(),
          new Largest(),
          toList([
            class$("text-violet-500"),
            on_click(new PlayPlaylist2(0, false))
          ])
        ),
        button2(
          new Shuffle(),
          new Medium2(),
          toList([on_click(new PlayPlaylist2(0, true))])
        ),
        (() => {
          let $1 = m.playlist.id === somachord_likes_playlist_id;
          if ($1) {
            return none3();
          } else {
            return i(
              toList([
                class$("text-3xl ph ph-pencil-simple"),
                on_click(new ShowEditor(true))
              ]),
              toList([])
            );
          }
        })()
      ])
    );
  } else {
    return div(
      toList([
        class$(
          "text-zinc-400 flex gap-4 items-center justify-between"
        )
      ]),
      (() => {
        let _pipe = toList([
          div(
            toList([class$("flex gap-4 items-center")]),
            toList([
              button2(
                new Shuffle(),
                new Medium2(),
                toList([on_click(new PlayPlaylist2(0, true))])
              ),
              button2(
                new Play(),
                new Largest(),
                toList([
                  class$("text-violet-500"),
                  on_click(new PlayPlaylist2(0, false))
                ])
              )
            ])
          ),
          div(toList([]), toList([]))
        ]);
        return reverse(_pipe);
      })()
    );
  }
}
function page5(m) {
  let _block;
  {
    let _block$1;
    let _pipe = create();
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH15,
        "somachord/pages/playlist",
        382,
        "page",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 11084,
          end: 11144,
          pattern_start: 11095,
          pattern_end: 11102
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return toList([
    div(
      toList([
        class$("flex-1 flex flex-col gap-6"),
        (() => {
          let $ = m.layout;
          if ($ instanceof Desktop) {
            return class$("overflow-y-auto pr-4");
          } else {
            return none();
          }
        })(),
        class$(scrollbar_class),
        redirect_click(new ComponentClick3())
      ]),
      toList([
        h1(
          toList([class$("text-3xl text-zinc-300 font-semibold")]),
          toList([text2(m.playlist.name)])
        ),
        div(
          toList([
            class$(
              "flex-wrap flex gap-3 text-xs text-zinc-400 items-center"
            )
          ]),
          prepend(
            span(
              toList([]),
              toList([
                text2("by "),
                span(
                  toList([class$("text-white")]),
                  toList([text2(m.playlist.owner)])
                )
              ])
            ),
            prepend(
              span(toList([]), toList([text2("\u2022")])),
              prepend(
                span(
                  toList([class$("text-nowrap")]),
                  toList([
                    text2(
                      to_string2(m.playlist.song_count) + " song" + (() => {
                        let $ = m.playlist.song_count === 1;
                        if ($) {
                          return "";
                        } else {
                          return "s";
                        }
                      })()
                    )
                  ])
                ),
                prepend(
                  span(toList([]), toList([text2("\u2022")])),
                  prepend(
                    span(
                      toList([class$("text-nowrap")]),
                      toList([
                        text2(
                          (() => {
                            let minutes2 = globalThis.Math.trunc(
                              m.playlist.duration / 60
                            );
                            let seconds3 = m.playlist.duration % 60;
                            return to_string2(minutes2) + " min, " + to_string2(
                              seconds3
                            ) + " sec";
                          })()
                        )
                      ])
                    ),
                    (() => {
                      let $ = m.playlist.public;
                      if ($) {
                        return toList([none3()]);
                      } else {
                        return toList([
                          span(toList([]), toList([text2("\u2022")])),
                          i(
                            toList([
                              class$("text-xl ph ph-lock-simple")
                            ]),
                            toList([])
                          )
                        ]);
                      }
                    })()
                  )
                )
              )
            )
          )
        ),
        buttons2(m),
        div(
          toList([class$("flex flex-col gap-4")]),
          (() => {
            let _pipe = prepend(
              (() => {
                let $ = m.layout;
                if ($ instanceof Desktop) {
                  return none3();
                } else {
                  return mobile_space();
                }
              })(),
              (() => {
                let _pipe2 = index_map(
                  m.playlist.songs,
                  (song3, index5) => {
                    return song2(
                      song3,
                      toList([
                        attribute2(
                          "data-index",
                          (() => {
                            let _pipe3 = index5 + 1;
                            return to_string2(_pipe3);
                          })()
                        ),
                        (() => {
                          let $ = song3.id === m.current_song_id;
                          if ($) {
                            return attribute2("data-playing", "");
                          } else {
                            return none();
                          }
                        })()
                      ]),
                      true,
                      new PlayPlaylist2(index5, false)
                    );
                  }
                );
                return reverse(_pipe2);
              })()
            );
            return reverse(_pipe);
          })()
        )
      ])
    ),
    div(
      toList([class$("flex flex-col gap-8")]),
      toList([
        div(
          toList([
            (() => {
              let $ = m.playlist.id === somachord_likes_playlist_id;
              if ($) {
                return class$(
                  "bg-linear-to-tl from-violet-500 from-20% to-violet-200"
                );
              } else {
                return class$("bg-zinc-900");
              }
            })(),
            class$(
              "flex justify-center items-center w-52 h-52 md:w-80 md:h-80 rounded-md"
            )
          ]),
          toList([
            (() => {
              let $ = m.playlist.id === somachord_likes_playlist_id;
              if ($) {
                return i(
                  toList([
                    class$(
                      "text-[12rem] ph-fill ph-heart-straight text-zinc-900"
                    )
                  ]),
                  toList([])
                );
              } else {
                let $1 = m.playlist.cover_art_id;
                if ($1 === "") {
                  return span(
                    toList([
                      class$("text-4xl p-2 font-black text-zinc-700")
                    ]),
                    toList([text2("No Cover Art!")])
                  );
                } else {
                  return img(
                    toList([
                      src(
                        cover_url(
                          auth_details,
                          m.playlist.cover_art_id,
                          500
                        )
                      ),
                      class$("object-scale")
                    ])
                  );
                }
              }
            })()
          ])
        )
      ])
    )
  ]);
}
function view9(m) {
  let $ = m.page_error;
  if ($ instanceof Some) {
    let e = $[0];
    return page3(e, on_click(new PlaylistID(m.id)));
  } else {
    return div(
      toList([
        class$("flex-1 flex gap-4"),
        (() => {
          let $1 = m.layout;
          if ($1 instanceof Desktop) {
            return class$("overflow-hidden");
          } else {
            return class$("flex-col overflow-y-auto");
          }
        })()
      ]),
      prepend(
        editor(m),
        (() => {
          let $1 = m.layout;
          let $2 = page5(m);
          if ($1 instanceof Desktop) {
            return $2;
          } else {
            let elems = $2;
            let _pipe = elems;
            return reverse(_pipe);
          }
        })()
      )
    );
  }
}
function register8() {
  let app = component(
    init8,
    update8,
    view9,
    toList([
      on_attribute_change(
        "playlist-id",
        (value3) => {
          return new Ok(
            (() => {
              let _pipe = value3;
              return new PlaylistID(_pipe);
            })()
          );
        }
      ),
      on_attribute_change(
        "song-id",
        (value3) => {
          return new Ok(
            (() => {
              let _pipe = value3;
              return new CurrentSongID(_pipe);
            })()
          );
        }
      )
    ])
  );
  return make_component(app, "playlist-page");
}
function echo7(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector7();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector7 = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/dev/javascript/somachord/somachord/pages/search.mjs
var FILEPATH16 = "src/somachord/pages/search.gleam";
var Model9 = class extends CustomType {
  constructor(search_query, artists2, albums, layout2, failed) {
    super();
    this.search_query = search_query;
    this.artists = artists2;
    this.albums = albums;
    this.layout = layout2;
    this.failed = failed;
  }
};
var Search4 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var SearchResults = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlayAlbum2 = class extends CustomType {
  constructor(id3) {
    super();
    this.id = id3;
  }
};
var Nothing3 = class extends CustomType {
};
function query(search2) {
  return attribute2("search-query", search2);
}
function element11(attrs) {
  return element2(
    "search-page",
    prepend(
      class$(
        "flex-1 p-4 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500"
      ),
      attrs
    ),
    toList([])
  );
}
function init9(_) {
  return [
    new Model9("", toList([]), toList([]), layout(), false),
    none2()
  ];
}
function update9(m, msg) {
  let _block;
  {
    let _block$1;
    let _pipe = create();
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH16,
        "somachord/pages/search",
        81,
        "update",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 1785,
          end: 1845,
          pattern_start: 1796,
          pattern_end: 1803
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  if (msg instanceof Search4) {
    let query$1 = msg[0];
    return [
      new Model9(query$1, m.artists, m.albums, m.layout, m.failed),
      search(
        auth_details,
        query$1,
        (var0) => {
          return new SearchResults(var0);
        }
      )
    ];
  } else if (msg instanceof SearchResults) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let albums = $1[0][1];
        return [
          new Model9(m.search_query, m.artists, albums, m.layout, m.failed),
          none2()
        ];
      } else {
        let e = $1[0];
        echo8(e, void 0, "src/somachord/pages/search.gleam", 94);
        throw makeError(
          "panic",
          FILEPATH16,
          "somachord/pages/search",
          95,
          "update",
          "search results subsonic error",
          {}
        );
      }
    } else {
      let e = $[0];
      echo8(e, void 0, "src/somachord/pages/search.gleam", 98);
      return [
        new Model9(m.search_query, m.artists, m.albums, m.layout, true),
        none2()
      ];
    }
  } else if (msg instanceof PlayAlbum2) {
    let id3 = msg.id;
    return [
      m,
      emit(
        "play",
        object2(
          toList([["id", string4(id3)], ["type", string4("album")]])
        )
      )
    ];
  } else {
    return [m, none2()];
  }
}
function view10(m) {
  let $ = online() || (() => {
    let _pipe = m.failed;
    return negate(_pipe);
  })();
  if ($) {
    return div(
      toList([class$("flex flex-col")]),
      toList([
        (() => {
          let $1 = m.layout;
          if ($1 instanceof Desktop) {
            return none3();
          } else {
            return input(
              toList([
                class$(
                  "text-zinc-500 bg-zinc-900 p-2 rounded-sm w-full focus:outline-none outline-none ring-0"
                ),
                placeholder("Search"),
                autofocus(true),
                on_input((var0) => {
                  return new Search4(var0);
                })
              ])
            );
          }
        })(),
        div(
          toList([
            redirect_click(new Nothing3()),
            class$("flex flex-wrap gap-4")
          ]),
          map(
            m.albums,
            (album3) => {
              return album2(
                album3,
                (id3) => {
                  return new PlayAlbum2(id3);
                }
              );
            }
          )
        )
      ])
    );
  } else {
    return page3(
      new NoConnection(),
      on_click(new Search4(m.search_query))
    );
  }
}
function register9() {
  let app = component(
    init9,
    update9,
    view10,
    toList([
      open_shadow_root(true),
      on_attribute_change(
        "search-query",
        (value3) => {
          return new Ok(
            (() => {
              let _pipe = value3;
              return new Search4(_pipe);
            })()
          );
        }
      )
    ])
  );
  return make_component(app, "search-page");
}
function echo8(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector8();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector8 = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/dev/javascript/somachord/somachord/pages/song.mjs
var FILEPATH17 = "src/somachord/pages/song.gleam";
var Lyrics2 = class extends CustomType {
};
var Model10 = class extends CustomType {
  constructor(song3, playtime, current_tab, font_size2, auto_scroll3, size_changer) {
    super();
    this.song = song3;
    this.playtime = playtime;
    this.current_tab = current_tab;
    this.font_size = font_size2;
    this.auto_scroll = auto_scroll3;
    this.size_changer = size_changer;
  }
};
var SongID3 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var SongResponse = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ChangeTab2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var PlaySong2 = class extends CustomType {
};
var Playtime2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var ToggleSizeChanger2 = class extends CustomType {
};
var ToggleAutoscroll2 = class extends CustomType {
};
var SizeChange2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Nothing4 = class extends CustomType {
};
function tab_as_string3(tab) {
  if (tab instanceof Lyrics2) {
    return "Lyrics";
  } else {
    return "More";
  }
}
function element12(attrs) {
  return element2(
    "song-page",
    prepend(
      class$(
        "flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500"
      ),
      attrs
    ),
    toList([])
  );
}
function tab_element3(m, tab) {
  return span(
    toList([
      on_click(new ChangeTab2(tab)),
      class$("relative cursor-pointer"),
      (() => {
        let $ = isEqual(tab, m.current_tab);
        if ($) {
          return class$("text-zinc-100");
        } else {
          return class$("text-zinc-500 hover:text-zinc-300");
        }
      })()
    ]),
    toList([
      text2(tab_as_string3(tab)),
      (() => {
        let $ = isEqual(tab, m.current_tab);
        if ($) {
          return div(
            toList([
              class$(
                "absolute top-9.25 w-full h-1 border-b border-violet-500"
              )
            ]),
            toList([])
          );
        } else {
          return none3();
        }
      })()
    ])
  );
}
function song_time2(time3) {
  return property2("time", float3(time3));
}
function init10(_) {
  return [
    new Model10(
      new_song(),
      new None(),
      new Lyrics2(),
      new Medium(),
      true,
      false
    ),
    none2()
  ];
}
function update10(m, msg) {
  if (msg instanceof SongID3) {
    let id3 = msg[0];
    return [
      m,
      song(
        (() => {
          let _block;
          let _pipe = create();
          _block = get2(_pipe, "auth");
          let $ = _block;
          let stg;
          if ($ instanceof Ok) {
            stg = $[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH17,
              "somachord/pages/song",
              141,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $,
                start: 2988,
                end: 3048,
                pattern_start: 2999,
                pattern_end: 3006
              }
            );
          }
          return stg.auth;
        })(),
        id3,
        (var0) => {
          return new SongResponse(var0);
        }
      )
    ];
  } else if (msg instanceof SongResponse) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let song3 = $1[0];
        return [
          new Model10(
            song3,
            m.playtime,
            m.current_tab,
            m.font_size,
            m.auto_scroll,
            m.size_changer
          ),
          none2()
        ];
      } else {
        return [m, none2()];
      }
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof ChangeTab2) {
    let tab = msg[0];
    return [
      new Model10(
        m.song,
        m.playtime,
        tab,
        m.font_size,
        m.auto_scroll,
        m.size_changer
      ),
      none2()
    ];
  } else if (msg instanceof PlaySong2) {
    return [
      m,
      emit(
        "play",
        object2(
          toList([
            ["type", string4("song")],
            ["id", string4(m.song.id)]
          ])
        )
      )
    ];
  } else if (msg instanceof Playtime2) {
    let time3 = msg[0];
    return [
      new Model10(
        m.song,
        new Some(time3),
        m.current_tab,
        m.font_size,
        m.auto_scroll,
        m.size_changer
      ),
      none2()
    ];
  } else if (msg instanceof ToggleSizeChanger2) {
    return [
      new Model10(
        m.song,
        m.playtime,
        m.current_tab,
        m.font_size,
        m.auto_scroll,
        negate(m.size_changer)
      ),
      none2()
    ];
  } else if (msg instanceof ToggleAutoscroll2) {
    return [
      new Model10(
        m.song,
        m.playtime,
        m.current_tab,
        m.font_size,
        negate(m.auto_scroll),
        m.size_changer
      ),
      none2()
    ];
  } else if (msg instanceof SizeChange2) {
    let size3 = msg[0];
    return [
      new Model10(
        m.song,
        m.playtime,
        m.current_tab,
        size3,
        m.auto_scroll,
        m.size_changer
      ),
      none2()
    ];
  } else {
    return [m, none2()];
  }
}
function auto_scroll2(m) {
  return i(
    prepend(
      class$(
        "after:hidden after:font-sans after:text-xs after:self-center after:no-underline hover:after:block hover:after:absolute after:top-2 after:left-full after:ml-2 after:border after:border-black after:bg-zinc-900 after:text-white after:rounded-full after:text-nowrap after:px-4 after:py-1 after:content-[attr(data-tooltip)]"
      ),
      prepend(
        class$("text-4xl ph ph-clock-countdown"),
        prepend(
          on_click(new ToggleAutoscroll2()),
          (() => {
            let $ = m.auto_scroll;
            let $1 = true;
            if ($) {
              return toList([
                attribute2("data-tooltip", "Toggle Auto-scroll"),
                class$("text-violet-400")
              ]);
            } else {
              return toList([
                attribute2("data-tooltip", "Toggle Auto-scroll"),
                none()
              ]);
            }
          })()
        )
      )
    ),
    toList([])
  );
}
function font_size(m) {
  return i(
    toList([
      on_click(new ToggleSizeChanger2()),
      class$("text-4xl ph ph-text-aa")
    ]),
    toList([
      span(
        toList([
          class$(
            "inline-flex items-center absolute self-center ml-4 bg-zinc-900 py-2 px-4 rounded-full"
          ),
          (() => {
            let $ = m.size_changer;
            if ($) {
              return class$("visible");
            } else {
              return class$("invisible");
            }
          })()
        ]),
        toList([
          input(
            toList([
              class$("accent-violet-500"),
              type_("range"),
              max2("2"),
              value(
                (() => {
                  let $ = m.font_size;
                  if ($ instanceof Small) {
                    return "0";
                  } else if ($ instanceof Medium) {
                    return "1";
                  } else {
                    return "2";
                  }
                })()
              ),
              on(
                "input",
                subfield(
                  toList(["target", "value"]),
                  string3,
                  (value3) => {
                    let $ = parse_int(value3);
                    let num;
                    if ($ instanceof Ok) {
                      num = $[0];
                    } else {
                      throw makeError(
                        "let_assert",
                        FILEPATH17,
                        "somachord/pages/song",
                        360,
                        "font_size",
                        "Pattern match failed, no pattern matched the value.",
                        {
                          value: $,
                          start: 10210,
                          end: 10247,
                          pattern_start: 10221,
                          pattern_end: 10228
                        }
                      );
                    }
                    let _block;
                    if (num === 0) {
                      _block = new Small();
                    } else if (num === 1) {
                      _block = new Medium();
                    } else if (num === 2) {
                      _block = new Large();
                    } else {
                      _block = new Medium();
                    }
                    let size3 = _block;
                    return success(new SizeChange2(size3));
                  }
                )
              )
            ])
          )
        ])
      )
    ])
  );
}
function view11(m) {
  let song3 = m.song;
  let _block;
  {
    let _block$1;
    let _pipe = create();
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH17,
        "somachord/pages/song",
        177,
        "view",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 3951,
          end: 4011,
          pattern_start: 3962,
          pattern_end: 3969
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return div(
    toList([redirect_click(new Nothing4())]),
    toList([
      div(
        toList([class$("flex flex-wrap gap-8 p-8")]),
        toList([
          (() => {
            let $ = song3.id;
            if ($ === "") {
              return div(
                toList([class$("w-80 h-80 rounded-md bg-zinc-800")]),
                toList([])
              );
            } else {
              return img(
                toList([
                  src(
                    cover_url(auth_details, song3.cover_art_id, 500)
                  ),
                  class$("w-80 h-80 object-cover rounded-md")
                ])
              );
            }
          })(),
          div(
            toList([class$("flex flex-col gap-4")]),
            toList([
              h1(
                toList([
                  class$("text-3xl text-zinc-300 font-semibold")
                ]),
                toList([text2(song3.title)])
              ),
              div(
                toList([
                  class$(
                    "flex flex-wrap gap-3 text-xs text-zinc-400 items-center"
                  )
                ]),
                prepend(
                  span(
                    toList([class$("flex gap-2 items-center")]),
                    toList([
                      i(
                        toList([class$("text-xl ph ph-user-sound")]),
                        toList([])
                      ),
                      artists(song3.artists, toList([]))
                    ])
                  ),
                  prepend(
                    span(toList([]), toList([text2("\u2022")])),
                    prepend(
                      span(
                        toList([class$("flex gap-2 items-center")]),
                        toList([
                          i(
                            toList([
                              class$("text-xl ph ph-vinyl-record")
                            ]),
                            toList([])
                          ),
                          a(
                            toList([href("/album/" + song3.album_id)]),
                            toList([
                              span(
                                toList([
                                  class$(
                                    "hover:underline text-zinc-300"
                                  )
                                ]),
                                toList([text2(song3.album_name)])
                              )
                            ])
                          )
                        ])
                      ),
                      prepend(
                        span(toList([]), toList([text2("\u2022")])),
                        prepend(
                          span(
                            toList([]),
                            toList([
                              text2(
                                (() => {
                                  let _pipe = song3.year;
                                  return to_string2(_pipe);
                                })()
                              )
                            ])
                          ),
                          prepend(
                            span(toList([]), toList([text2("\u2022")])),
                            prepend(
                              time2(song3.duration, toList([])),
                              (() => {
                                let $ = song3.plays > 0;
                                if ($) {
                                  return toList([
                                    span(
                                      toList([]),
                                      toList([text2("\u2022")])
                                    ),
                                    span(
                                      toList([]),
                                      toList([
                                        text2(
                                          (() => {
                                            let _pipe = song3.plays;
                                            return to_string2(_pipe);
                                          })() + " play" + (() => {
                                            let $1 = song3.plays === 1;
                                            if ($1) {
                                              return "";
                                            } else {
                                              return "s";
                                            }
                                          })()
                                        )
                                      ])
                                    )
                                  ]);
                                } else {
                                  return toList([none3()]);
                                }
                              })()
                            )
                          )
                        )
                      )
                    )
                  )
                )
              ),
              div(
                toList([
                  class$(
                    "text-zinc-400 flex gap-4 items-center -ml-1"
                  )
                ]),
                toList([
                  button2(
                    new Play(),
                    new Largest(),
                    toList([
                      class$("text-violet-500"),
                      on_click(new PlaySong2())
                    ])
                  ),
                  element6(toList([]), toList([]))
                ])
              )
            ])
          )
        ])
      ),
      div(
        toList([class$("font-[Poppins,sans-serif]")]),
        toList([
          div(
            toList([
              class$(
                "sticky top-0 border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400 bg-zinc-950"
              )
            ]),
            toList([tab_element3(m, new Lyrics2())])
          ),
          div(
            toList([class$("p-4")]),
            (() => {
              let $ = m.current_tab;
              if ($ instanceof Lyrics2) {
                return toList([
                  div(
                    toList([class$("flex px-6 py-8 gap-24")]),
                    toList([
                      div(
                        toList([
                          class$(
                            "sticky h-fit top-25 flex flex-col gap-4 text-zinc-500"
                          )
                        ]),
                        toList([auto_scroll2(m), font_size(m)])
                      ),
                      element4(
                        toList([
                          nested_shadow(true),
                          id2(m.song.id),
                          song_time(
                            (() => {
                              let _pipe = m.playtime;
                              return unwrap(_pipe, -1);
                            })()
                          ),
                          auto_scroll(m.auto_scroll),
                          size2(m.font_size)
                        ])
                      )
                    ])
                  )
                ]);
              } else {
                return toList([none3()]);
              }
            })()
          )
        ])
      ),
      (() => {
        let $ = layout();
        if ($ instanceof Desktop) {
          return none3();
        } else {
          return mobile_space();
        }
      })()
    ])
  );
}
function register10() {
  let app = component(
    init10,
    update10,
    view11,
    toList([
      on_attribute_change(
        "song-id",
        (value3) => {
          return new Ok(
            (() => {
              let _pipe = value3;
              return new SongID3(_pipe);
            })()
          );
        }
      ),
      on_property_change(
        "time",
        (() => {
          let _pipe = float2;
          return map2(_pipe, (var0) => {
            return new Playtime2(var0);
          });
        })()
      )
    ])
  );
  return make_component(app, "song-page");
}

// build/dev/javascript/somachord/somachord/pages/views/desktop.mjs
var FILEPATH18 = "src/somachord/pages/views/desktop.gleam";
function top_bar(m) {
  return div(
    toList([class$("flex justify-between")]),
    toList([
      div(
        toList([class$("flex gap-4")]),
        toList([
          a(
            toList([href("/library")]),
            toList([
              nav_button(
                i(
                  toList([class$("text-3xl ph ph-cards-three")]),
                  toList([])
                ),
                i(
                  toList([class$("text-3xl ph-fill ph-cards-three")]),
                  toList([])
                ),
                "Library",
                isEqual(m.route, new Library()),
                toList([])
              )
            ])
          ),
          a(
            toList([href("/")]),
            toList([
              nav_button(
                i(
                  toList([class$("text-3xl ph ph-house")]),
                  toList([])
                ),
                i(
                  toList([class$("text-3xl ph-fill ph-house")]),
                  toList([])
                ),
                "Home",
                isEqual(m.route, new Home()),
                toList([class$("w-42")])
              )
            ])
          ),
          (() => {
            let $ = m.route;
            if ($ instanceof Search) {
              let query2 = $.query;
              return div(
                toList([
                  class$(
                    "bg-zinc-900 flex text-zinc-500 items-center px-4 py-2 rounded-lg font-normal gap-2"
                  )
                ]),
                toList([
                  i(
                    toList([
                      class$("text-3xl ph ph-magnifying-glass")
                    ]),
                    toList([])
                  ),
                  input(
                    toList([
                      class$(
                        "w-80 focus:outline-none outline-none ring-0"
                      ),
                      placeholder("Search"),
                      value(query2),
                      autofocus(true),
                      on_input(
                        (var0) => {
                          return new Search3(var0);
                        }
                      )
                    ])
                  )
                ])
              );
            } else {
              return nav_button(
                i(
                  toList([class$("text-3xl ph ph-magnifying-glass")]),
                  toList([])
                ),
                i(
                  toList([
                    class$("text-3xl ph-fill ph-magnifying-glass")
                  ]),
                  toList([])
                ),
                "Search",
                false,
                toList([on_click(new Search3(""))])
              );
            }
          })()
        ])
      ),
      div(
        toList([
          class$("flex items-center justify-center text-zinc-400")
        ]),
        toList([
          a(
            toList([href("/about")]),
            toList([
              button2(
                new About2(),
                new Large2(),
                toList([])
              )
            ])
          ),
          (() => {
            let $ = m.online;
            if ($) {
              return none3();
            } else {
              return div(
                toList([
                  class$(
                    "flex px-2 my-1 rounded-full bg-white gap-1 text-black items-center justify-center"
                  )
                ]),
                toList([
                  i(
                    toList([class$("text-3xl ph ph-globe-x")]),
                    toList([])
                  ),
                  span(toList([]), toList([text2("Offline")]))
                ])
              );
            }
          })()
        ])
      )
    ])
  );
}
function side_bar(m) {
  return div(
    toList([
      class$(
        "flex flex-col gap-2 border border-zinc-800 rounded-lg py-4 px-1"
      )
    ]),
    toList([
      a(
        toList([href("/library?filter=0")]),
        toList([
          nav_button(
            i(
              toList([class$("text-3xl ph ph-playlist")]),
              toList([])
            ),
            i(
              toList([class$("text-3xl ph ph-playlist")]),
              toList([])
            ),
            "Playlists",
            false,
            toList([])
          )
        ])
      ),
      a(
        toList([href("/likes")]),
        toList([
          nav_button(
            i(
              toList([class$("text-3xl ph ph-heart-straight")]),
              toList([])
            ),
            i(
              toList([class$("text-3xl ph-fill ph-heart-straight")]),
              toList([])
            ),
            "Liked Songs",
            isEqual(m.route, new Likes()),
            toList([])
          )
        ])
      )
    ])
  );
}
function playing_bar(m) {
  let _block;
  {
    let _block$1;
    let _pipe = m.storage;
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH18,
        "somachord/pages/views/desktop",
        212,
        "playing_bar",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 6075,
          end: 6128,
          pattern_start: 6086,
          pattern_end: 6093
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return div(
    toList([
      class$(
        "h-20 rounded-lg p-4 border border-zinc-800 flex gap-2 items-center justify-between"
      )
    ]),
    toList([
      div(
        toList([class$("flex gap-2 items-center w-1/3")]),
        toList([
          div(
            toList([
              class$(
                "flex-none w-14 h-14 bg-zinc-900 rounded-md flex items-center justify-center"
              )
            ]),
            toList([
              (() => {
                let $ = m.current_song.cover_art_id === "";
                if ($) {
                  return i(
                    toList([
                      class$(
                        "text-zinc-500 text-3xl ph ph-music-notes-simple"
                      )
                    ]),
                    toList([])
                  );
                } else {
                  return a(
                    toList([
                      href("/album/" + m.current_song.album_id)
                    ]),
                    toList([
                      img(
                        toList([
                          src(
                            cover_url(
                              m.auth,
                              m.current_song.cover_art_id,
                              500
                            )
                          ),
                          class$(
                            "hover:opacity-50 transition-all duration-200 rounded-md object-cover"
                          )
                        ])
                      )
                    ])
                  );
                }
              })()
            ])
          ),
          div(
            toList([class$("flex flex-col min-w-0")]),
            toList([
              a(
                toList([
                  href("/song/" + m.current_song.id),
                  class$(
                    "hover:underline font-normal overflow-hidden text-nowrap text-ellipsis min-w-0"
                  )
                ]),
                toList([text2(m.current_song.title)])
              ),
              artists(m.current_song.artists, toList([]))
            ])
          )
        ])
      ),
      div(
        toList([class$("space-y-1")]),
        toList([
          div(
            toList([class$("flex gap-4 justify-center items-center")]),
            toList([
              button2(
                new Shuffle(),
                new Smallest(),
                toList([
                  (() => {
                    let $ = m.shuffled;
                    if ($) {
                      return class$(
                        "text-violet-400 underline underline-offset-4 decoration-dotted"
                      );
                    } else {
                      return none();
                    }
                  })(),
                  on_click(new PlayerShuffle())
                ])
              ),
              button2(
                new SkipBackward(),
                new Smallest(),
                toList([on_click(new PlayerPrevious())])
              ),
              button2(
                (() => {
                  let $ = (() => {
                    let _pipe = m.player;
                    return is_paused(_pipe);
                  })();
                  if ($) {
                    return new Play();
                  } else {
                    return new Pause();
                  }
                })(),
                new Large2(),
                toList([on_click(new PlayerPausePlay())])
              ),
              button2(
                new SkipForward(),
                new Smallest(),
                toList([on_click(new PlayerNext())])
              ),
              button2(
                new Loop(),
                new Smallest(),
                toList([
                  (() => {
                    let $ = m.looping;
                    if ($) {
                      return class$(
                        "text-violet-400 underline underline-offset-4 decoration-dotted"
                      );
                    } else {
                      return none();
                    }
                  })(),
                  on_click(new PlayerLoop())
                ])
              )
            ])
          ),
          div(
            toList([
              class$(
                "flex gap-2 items-center font-[Azeret_Mono] text-zinc-400 text-[0.6rem]"
              )
            ]),
            toList([
              span(
                toList([]),
                toList([
                  text2(
                    (() => {
                      let minutes2 = globalThis.Math.trunc(
                        round2(
                          (() => {
                            let _pipe = m.player;
                            return time(_pipe);
                          })()
                        ) / 60
                      );
                      let seconds3 = round2(
                        (() => {
                          let _pipe = m.player;
                          return time(_pipe);
                        })()
                      ) % 60;
                      return to_string2(minutes2) + ":" + (() => {
                        let _pipe = to_string2(seconds3);
                        return pad_start(_pipe, 2, "0");
                      })();
                    })()
                  )
                ])
              ),
              music_slider(
                m,
                false,
                toList([class$("w-96")])
              ),
              span(
                toList([]),
                toList([
                  text2(
                    (() => {
                      let minutes2 = globalThis.Math.trunc(
                        m.current_song.duration / 60
                      );
                      let seconds3 = m.current_song.duration % 60;
                      return to_string2(minutes2) + ":" + (() => {
                        let _pipe = to_string2(seconds3);
                        return pad_start(_pipe, 2, "0");
                      })();
                    })()
                  )
                ])
              )
            ])
          )
        ])
      ),
      div(
        toList([class$("flex justify-end gap-2 w-1/3")]),
        toList([
          button2(
            new FullscreenPlayer(),
            new Medium2(),
            toList([on_click(new ToggleFullscreenPlayer())])
          ),
          div(
            toList([class$("inline-flex relative")]),
            toList([
              label(
                toList([class$("peer")]),
                toList([
                  input(
                    toList([
                      type_("checkbox"),
                      id("queue-toggle"),
                      class$("hidden")
                    ])
                  ),
                  i(
                    toList([class$("text-3xl ph ph-queue")]),
                    toList([])
                  )
                ])
              ),
              div(
                toList([
                  class$(
                    "not-peer-has-checked:hidden absolute flex flex-col gap-2 rounded-lg bg-zinc-900 w-96 h-80 -top-83 -left-69 p-4"
                  )
                ]),
                toList([
                  h1(
                    toList([class$("font-semibold text-lg")]),
                    toList([text2("Queue")])
                  ),
                  div(
                    toList([
                      class$(
                        "flex flex-col gap-2 pt-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"
                      )
                    ]),
                    map(
                      list4(m.queue),
                      (queue_entry) => {
                        return song2(
                          queue_entry[1],
                          toList([
                            (() => {
                              let $ = m.current_song.id === queue_entry[1].id;
                              if ($) {
                                return attribute2("data-playing", "");
                              } else {
                                return none();
                              }
                            })()
                          ]),
                          true,
                          new QueueJumpTo(queue_entry[0])
                        );
                      }
                    )
                  )
                ])
              )
            ])
          ),
          button2(
            new Like(m.current_song.starred),
            new Medium2(),
            toList([
              (() => {
                let $ = m.current_song.starred;
                if ($) {
                  return class$("text-violet-500");
                } else {
                  return none();
                }
              })(),
              on_click(new Like2())
            ])
          ),
          element6(
            toList([]),
            toList([
              class$("absolute bottom-92 right-96"),
              song_id(m.current_song.id)
            ])
          )
        ])
      )
    ])
  );
}
function view12(m, page6) {
  return div(
    toList([
      class$(
        "font-[Poppins,sans-serif] w-full flex flex-col px-3 py-4 gap-4 overflow-hidden"
      )
    ]),
    toList([
      top_bar(m),
      div(
        toList([class$("flex gap-2 min-w-0 min-h-0 w-full h-full")]),
        toList([
          side_bar(m),
          div(
            toList([
              class$(
                "flex flex-col gap-2 min-w-0 min-h-0 w-full h-full"
              )
            ]),
            toList([
              page6,
              div(
                toList([class$("relative")]),
                toList([
                  (() => {
                    let $ = m.toast_display;
                    if ($ instanceof Some) {
                      let toast = $[0];
                      return div(
                        toList([
                          class$(
                            "cursor-pointer absolute -top-20 bg-white text-black flex items-center gap-1 rounded-lg p-2 justify-self-center"
                          ),
                          on_click(new ClearToast())
                        ]),
                        toList([
                          i(
                            toList([
                              class$(
                                "text-3xl ph-fill ph-" + toast.icon
                              )
                            ]),
                            toList([])
                          ),
                          text2(toast.message)
                        ])
                      );
                    } else {
                      return none3();
                    }
                  })(),
                  playing_bar(m)
                ])
              )
            ])
          )
        ])
      ),
      view3(m)
    ])
  );
}

// build/dev/javascript/somachord/somachord/pages/views/mobile.mjs
var FILEPATH19 = "src/somachord/pages/views/mobile.gleam";
function playing_bar2(m) {
  let _block;
  {
    let _block$1;
    let _pipe = m.storage;
    _block$1 = get2(_pipe, "auth");
    let $ = _block$1;
    let stg;
    if ($ instanceof Ok) {
      stg = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH19,
        "somachord/pages/views/mobile",
        87,
        "playing_bar",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 2608,
          end: 2661,
          pattern_start: 2619,
          pattern_end: 2626
        }
      );
    }
    _block = stg.auth;
  }
  let auth_details = _block;
  return div(
    toList([
      class$(
        "justify-self-center absolute bottom-20 p-2 pb-1 rounded-md flex flex-col gap-2 bg-zinc-900 w-[95%]"
      )
    ]),
    toList([
      div(
        toList([class$("flex justify-between items-center gap-2")]),
        toList([
          div(
            toList([
              class$("flex gap-2 items-center flex-1 min-w-0"),
              on_click(new ToggleFullscreenPlayer())
            ]),
            toList([
              div(
                toList([
                  class$(
                    "flex-none w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center"
                  )
                ]),
                toList([
                  (() => {
                    let $ = m.current_song.cover_art_id === "";
                    if ($) {
                      return i(
                        toList([
                          class$(
                            "text-zinc-500 text-3xl ph ph-music-notes-simple"
                          )
                        ]),
                        toList([])
                      );
                    } else {
                      return img(
                        toList([
                          src(
                            cover_url(
                              auth_details,
                              m.current_song.cover_art_id,
                              500
                            )
                          ),
                          class$(
                            "w-12 h-12 transition-all duration-200 rounded-md object-cover"
                          )
                        ])
                      );
                    }
                  })()
                ])
              ),
              span(
                toList([class$("flex flex-col min-w-0")]),
                toList([
                  span(
                    toList([
                      class$(
                        "hover:underline select-none font-normal overflow-hidden text-nowrap text-ellipsis min-w-0"
                      )
                    ]),
                    toList([text2(m.current_song.title)])
                  ),
                  span(
                    toList([
                      class$(
                        "hover:underline select-none text-xs font-light overflow-hidden text-nowrap text-ellipsis min-w-0"
                      )
                    ]),
                    (() => {
                      let _pipe = map(
                        m.current_song.artists,
                        (artist2) => {
                          return span(
                            toList([class$("hover:underline")]),
                            toList([text2(artist2.name)])
                          );
                        }
                      );
                      return intersperse(_pipe, text2(", "));
                    })()
                  )
                ])
              )
            ])
          ),
          div(
            toList([class$("flex gap-4 items-center")]),
            toList([
              i(
                toList([
                  class$("text-xl ph-fill ph-skip-back"),
                  on_click(new PlayerPrevious())
                ]),
                toList([])
              ),
              i(
                toList([
                  class$("text-xl ph-fill ph-skip-forward"),
                  on_click(new PlayerNext())
                ]),
                toList([])
              ),
              i(
                toList([
                  class$("text-xl ph-fill"),
                  (() => {
                    let $ = (() => {
                      let _pipe = m.player;
                      return is_paused(_pipe);
                    })();
                    if ($) {
                      return class$("ph-play");
                    } else {
                      return class$("ph-pause");
                    }
                  })(),
                  on_click(new PlayerPausePlay())
                ]),
                toList([])
              )
            ])
          )
        ])
      ),
      div(
        toList([
          class$("bg-zinc-100 rounded-full h-0.5"),
          style(
            "width",
            float_to_string(
              divideFloat(
                (() => {
                  let $ = m.seeking;
                  if ($) {
                    return identity(m.seek_amount);
                  } else {
                    let _pipe = m.player;
                    return time(_pipe);
                  }
                })(),
                identity(m.current_song.duration)
              ) * 100
            ) + "%"
          )
        ]),
        toList([])
      )
    ])
  );
}
function mobile_nav_button(inactive, active2, name2, is_active, attrs) {
  return div(
    prepend(
      class$(
        "flex flex-col gap-2 items-center justify-center py-1 px-4 rounded-md"
      ),
      prepend(
        (() => {
          if (is_active) {
            return class$("bg-zinc-900 text-zinc-100");
          } else {
            return class$("text-zinc-500");
          }
        })(),
        attrs
      )
    ),
    toList([
      (() => {
        if (is_active) {
          return active2;
        } else {
          return inactive;
        }
      })(),
      h1(
        toList([class$("text-xs")]),
        toList([text2(name2)])
      )
    ])
  );
}
function view13(m, page6) {
  return div(
    toList([
      class$(
        "font-['Poppins'] w-full flex flex-col pb-1 gap-2 overflow-hidden min-w-0 min-h-0 w-full h-full"
      )
    ]),
    toList([
      page6,
      div(
        toList([class$("relative")]),
        toList([
          (() => {
            let $ = m.current_song.id === "";
            if ($) {
              return none3();
            } else {
              return playing_bar2(m);
            }
          })(),
          div(
            toList([class$("h-16 flex justify-evenly")]),
            toList([
              a(
                toList([href("/"), class$("h-fit w-fit")]),
                toList([
                  mobile_nav_button(
                    i(
                      toList([class$("text-2xl ph ph-house")]),
                      toList([])
                    ),
                    i(
                      toList([class$("text-2xl ph-fill ph-house")]),
                      toList([])
                    ),
                    "Home",
                    isEqual(m.route, new Home()),
                    toList([])
                  )
                ])
              ),
              a(
                toList([
                  href("/search"),
                  class$("h-fit w-fit")
                ]),
                toList([
                  mobile_nav_button(
                    i(
                      toList([
                        class$("text-2xl ph ph-magnifying-glass")
                      ]),
                      toList([])
                    ),
                    i(
                      toList([
                        class$("text-2xl ph ph-magnifying-glass")
                      ]),
                      toList([])
                    ),
                    "Search",
                    (() => {
                      let $ = m.route;
                      if ($ instanceof Search) {
                        return true;
                      } else {
                        return false;
                      }
                    })(),
                    toList([])
                  )
                ])
              ),
              a(
                toList([
                  href("/library"),
                  class$("h-fit w-fit")
                ]),
                toList([
                  mobile_nav_button(
                    i(
                      toList([class$("text-2xl ph ph-cards-three")]),
                      toList([])
                    ),
                    i(
                      toList([class$("text-2xl ph ph-cards-three")]),
                      toList([])
                    ),
                    "Library",
                    false,
                    toList([])
                  )
                ])
              )
            ])
          )
        ])
      ),
      (() => {
        let $ = m.online;
        if ($) {
          return none3();
        } else {
          return div(
            toList([class$("text-black bg-sky-500 text-center py-1")]),
            toList([text2("You're now offline")])
          );
        }
      })(),
      view3(m)
    ])
  );
}

// build/dev/javascript/somachord/somachord.mjs
var FILEPATH20 = "src/somachord.gleam";
function route_effect(m, route) {
  if (route instanceof Album2) {
    let id3 = route.id;
    let _block;
    {
      let _block$1;
      let _pipe = m.storage;
      _block$1 = get2(_pipe, "auth");
      let $ = _block$1;
      let stg;
      if ($ instanceof Ok) {
        stg = $[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH20,
          "somachord",
          141,
          "route_effect",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 3531,
            end: 3584,
            pattern_start: 3542,
            pattern_end: 3549
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    return album(
      auth_details,
      id3,
      (var0) => {
        return new AlbumRetrieved(var0);
      }
    );
  } else {
    return none2();
  }
}
function unload_event() {
  return from(
    (dispatch) => {
      return addEventListener4(
        "beforeunload",
        (_) => {
          let _pipe = new Unload();
          return dispatch(_pipe);
        }
      );
    }
  );
}
function offline_event() {
  return from(
    (dispatch) => {
      return addEventListener4(
        "offline",
        (_) => {
          let _pipe = new Connectivity(false);
          return dispatch(_pipe);
        }
      );
    }
  );
}
function online_event() {
  return from(
    (dispatch) => {
      return addEventListener4(
        "online",
        (_) => {
          let _pipe = new Connectivity(true);
          return dispatch(_pipe);
        }
      );
    }
  );
}
function clear_toast_timeout() {
  return from(
    (dispatch) => {
      setTimeout3(
        5e3,
        () => {
          let _pipe = new ClearToast();
          return dispatch(_pipe);
        }
      );
      return void 0;
    }
  );
}
function check_scrobble(m) {
  let $ = m.played_seconds > globalThis.Math.trunc(m.current_song.duration / 2);
  if ($) {
    return scrobble(
      (() => {
        let _block;
        let _pipe = m.storage;
        _block = get2(_pipe, "auth");
        let $1 = _block;
        let stg;
        if ($1 instanceof Ok) {
          stg = $1[0];
        } else {
          throw makeError(
            "let_assert",
            FILEPATH20,
            "somachord",
            692,
            "check_scrobble",
            "Pattern match failed, no pattern matched the value.",
            {
              value: $1,
              start: 19594,
              end: 19647,
              pattern_start: 19605,
              pattern_end: 19612
            }
          );
        }
        return stg.auth;
      })(),
      m.current_song.id,
      true,
      (var0) => {
        return new DisgardedResponse(var0);
      }
    );
  } else {
    return none2();
  }
}
function play() {
  return from(
    (dispatch) => {
      let _pipe = new StreamCurrent();
      return dispatch(_pipe);
    }
  );
}
function load2() {
  return from(
    (dispatch) => {
      let _pipe = new LoadSong();
      return dispatch(_pipe);
    }
  );
}
function update11(m, msg) {
  if (msg instanceof Router) {
    let route = msg[0][0];
    return [
      new Model(
        route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      route_effect(m, route)
    ];
  } else if (msg instanceof SongRetrieval) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let song3 = $1[0];
        let _block;
        {
          let _block$1;
          let _pipe2 = m.storage;
          _block$1 = get2(_pipe2, "auth");
          let $2 = _block$1;
          let stg;
          if ($2 instanceof Ok) {
            stg = $2[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH20,
              "somachord",
              349,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $2,
                start: 9716,
                end: 9769,
                pattern_start: 9727,
                pattern_end: 9734
              }
            );
          }
          _block = stg.auth;
        }
        let auth_details = _block;
        let stream_uri = stream(auth_details, song3);
        let _pipe = m.player;
        load_song(_pipe, stream_uri, song3);
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            new$9(0, toList([song3]), 0),
            m.current_song,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            m.current_palette,
            m.toast_display
          ),
          play()
        ];
      } else {
        throw makeError(
          "todo",
          FILEPATH20,
          "somachord",
          363,
          "update",
          "handle stream error",
          {}
        );
      }
    } else {
      throw makeError(
        "todo",
        FILEPATH20,
        "somachord",
        363,
        "update",
        "handle stream error",
        {}
      );
    }
  } else if (msg instanceof Queue2) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let queue2 = $1[0];
        let queue_time_range = getTime(now()) - 2 * 60 * 60 * 1e3;
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            queue2,
            m.current_song,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            m.current_palette,
            m.toast_display
          ),
          (() => {
            let $2 = (() => {
              let _pipe = queue2.changed;
              return getTime(_pipe);
            })() < queue_time_range;
            if ($2) {
              return save_queue(
                (() => {
                  let _block;
                  let _pipe = m.storage;
                  _block = get2(_pipe, "auth");
                  let $3 = _block;
                  let stg;
                  if ($3 instanceof Ok) {
                    stg = $3[0];
                  } else {
                    throw makeError(
                      "let_assert",
                      FILEPATH20,
                      "somachord",
                      214,
                      "update",
                      "Pattern match failed, no pattern matched the value.",
                      {
                        value: $3,
                        start: 5489,
                        end: 5542,
                        pattern_start: 5500,
                        pattern_end: 5507
                      }
                    );
                  }
                  return stg.auth;
                })(),
                new None(),
                (var0) => {
                  return new DisgardedResponse(var0);
                }
              );
            } else {
              let _pipe = m.player;
              seek(_pipe, queue2.song_position);
              return load2();
            }
          })()
        ];
      } else {
        return [m, none2()];
      }
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof AlbumRetrieved) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let album3 = $1[0];
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            (() => {
              let _pipe = m.albums;
              return insert(_pipe, album3.id, album3);
            })(),
            m.player,
            m.queue,
            m.current_song,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            m.current_palette,
            m.toast_display
          ),
          none2()
        ];
      } else {
        throw makeError(
          "todo",
          FILEPATH20,
          "somachord",
          203,
          "update",
          "album not found",
          {}
        );
      }
    } else {
      throw makeError(
        "todo",
        FILEPATH20,
        "somachord",
        204,
        "update",
        "album not found: rsvp",
        {}
      );
    }
  } else if (msg instanceof DisgardedResponse) {
    return [m, none2()];
  } else if (msg instanceof SimilarSongs) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let songs = $1[0];
        let _block;
        {
          let _block$12;
          let _pipe2 = m.storage;
          _block$12 = get2(_pipe2, "auth");
          let $2 = _block$12;
          let stg;
          if ($2 instanceof Ok) {
            stg = $2[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH20,
              "somachord",
              449,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $2,
                start: 12454,
                end: 12507,
                pattern_start: 12465,
                pattern_end: 12472
              }
            );
          }
          _block = stg.auth;
        }
        let auth_details = _block;
        let _block$1;
        let _pipe = m.queue.songs;
        let _pipe$1 = map_to_list(_pipe);
        let _pipe$2 = sort(
          _pipe$1,
          (a2, b) => {
            return compare2(a2[0], b[0]);
          }
        );
        let _pipe$3 = map(_pipe$2, (song3) => {
          return song3[1];
        });
        _block$1 = append(_pipe$3, songs);
        let new_songs = _block$1;
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            new$9(m.queue.position, new_songs, 0),
            m.current_song,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            m.current_palette,
            m.toast_display
          ),
          (() => {
            let $2 = m.queue.position + 1 === (() => {
              let _pipe$4 = new_songs;
              return length(_pipe$4);
            })();
            if ($2) {
              let _block$2;
              let _pipe$4 = m.current_song.artists;
              _block$2 = first(_pipe$4);
              let $3 = _block$2;
              let first_artist;
              if ($3 instanceof Ok) {
                first_artist = $3[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH20,
                  "somachord",
                  467,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $3,
                    start: 13059,
                    end: 13125,
                    pattern_start: 13070,
                    pattern_end: 13086
                  }
                );
              }
              return similar_songs_artist(
                auth_details,
                first_artist.id,
                (var0) => {
                  return new SimilarSongs(var0);
                }
              );
            } else {
              return play();
            }
          })()
        ];
      } else {
        let _block;
        {
          let _block$12;
          let _pipe2 = m.storage;
          _block$12 = get2(_pipe2, "auth");
          let $22 = _block$12;
          let stg;
          if ($22 instanceof Ok) {
            stg = $22[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH20,
              "somachord",
              479,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $22,
                start: 13386,
                end: 13439,
                pattern_start: 13397,
                pattern_end: 13404
              }
            );
          }
          _block = stg.auth;
        }
        let auth_details = _block;
        let _block$1;
        let _pipe = m.current_song.artists;
        _block$1 = first(_pipe);
        let $2 = _block$1;
        let first_artist;
        if ($2 instanceof Ok) {
          first_artist = $2[0];
        } else {
          throw makeError(
            "let_assert",
            FILEPATH20,
            "somachord",
            482,
            "update",
            "Pattern match failed, no pattern matched the value.",
            {
              value: $2,
              start: 13471,
              end: 13537,
              pattern_start: 13482,
              pattern_end: 13498
            }
          );
        }
        return [
          m,
          similar_songs_artist(
            auth_details,
            first_artist.id,
            (var0) => {
              return new SimilarSongsArtist(var0);
            }
          )
        ];
      }
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof SimilarSongsArtist) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let songs = $1[0];
        let _block;
        {
          let _block$12;
          let _pipe2 = m.storage;
          _block$12 = get2(_pipe2, "auth");
          let $2 = _block$12;
          let stg;
          if ($2 instanceof Ok) {
            stg = $2[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH20,
              "somachord",
              449,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $2,
                start: 12454,
                end: 12507,
                pattern_start: 12465,
                pattern_end: 12472
              }
            );
          }
          _block = stg.auth;
        }
        let auth_details = _block;
        let _block$1;
        let _pipe = m.queue.songs;
        let _pipe$1 = map_to_list(_pipe);
        let _pipe$2 = sort(
          _pipe$1,
          (a2, b) => {
            return compare2(a2[0], b[0]);
          }
        );
        let _pipe$3 = map(_pipe$2, (song3) => {
          return song3[1];
        });
        _block$1 = append(_pipe$3, songs);
        let new_songs = _block$1;
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            new$9(m.queue.position, new_songs, 0),
            m.current_song,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            m.current_palette,
            m.toast_display
          ),
          (() => {
            let $2 = m.queue.position + 1 === (() => {
              let _pipe$4 = new_songs;
              return length(_pipe$4);
            })();
            if ($2) {
              let _block$2;
              let _pipe$4 = m.current_song.artists;
              _block$2 = first(_pipe$4);
              let $3 = _block$2;
              let first_artist;
              if ($3 instanceof Ok) {
                first_artist = $3[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH20,
                  "somachord",
                  467,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $3,
                    start: 13059,
                    end: 13125,
                    pattern_start: 13070,
                    pattern_end: 13086
                  }
                );
              }
              return similar_songs_artist(
                auth_details,
                first_artist.id,
                (var0) => {
                  return new SimilarSongs(var0);
                }
              );
            } else {
              return play();
            }
          })()
        ];
      } else {
        return [m, none2()];
      }
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof PlaylistWithSongs) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let $1 = $[0];
      if ($1 instanceof Ok) {
        let playlist3 = $1[0];
        echo9(playlist3.name, void 0, "src/somachord.gleam", 649);
        echo9(playlist3.songs, void 0, "src/somachord.gleam", 650);
        echo9(m.current_song, void 0, "src/somachord.gleam", 651);
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            m.queue,
            m.current_song,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            (() => {
              let _pipe = m.playlists;
              return insert(_pipe, playlist3.id, playlist3);
            })(),
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            m.current_palette,
            m.toast_display
          ),
          none2()
        ];
      } else {
        let e = $;
        echo9(e, void 0, "src/somachord.gleam", 661);
        return [m, none2()];
      }
    } else {
      let e = $;
      echo9(e, void 0, "src/somachord.gleam", 661);
      return [m, none2()];
    }
  } else if (msg instanceof DisplayToast) {
    let toast = msg[0];
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        new Some(toast)
      ),
      clear_toast_timeout()
    ];
  } else if (msg instanceof ClearToast) {
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        new None()
      ),
      none2()
    ];
  } else if (msg instanceof Connectivity) {
    let online2 = msg[0];
    return [
      new Model(
        m.route,
        online2,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      none2()
    ];
  } else if (msg instanceof ToggleFullscreenPlayer) {
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        negate(m.fullscreen_player_open),
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      none2()
    ];
  } else if (msg instanceof ChangeFullscreenPlayerView) {
    let view$1 = msg[0];
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        view$1,
        m.current_palette,
        m.toast_display
      ),
      none2()
    ];
  } else if (msg instanceof Play2) {
    let req = msg[0];
    echo9(
      "!!! play request id: " + req.id,
      void 0,
      "src/somachord.gleam",
      243
    );
    echo9(
      "play request type: " + req.type_,
      void 0,
      "src/somachord.gleam",
      244
    );
    let _block;
    {
      let _block$1;
      let _pipe = m.storage;
      _block$1 = get2(_pipe, "auth");
      let $2 = _block$1;
      let stg;
      if ($2 instanceof Ok) {
        stg = $2[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH20,
          "somachord",
          246,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 6306,
            end: 6359,
            pattern_start: 6317,
            pattern_end: 6324
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    let $ = req.type_;
    if ($ === "album") {
      return guard(
        (() => {
          let _pipe = m.albums;
          return has_key(_pipe, req.id);
        })(),
        [
          m,
          from(
            (dispatch) => {
              let _block$1;
              let _pipe = m.albums;
              _block$1 = map_get(_pipe, req.id);
              let $1 = _block$1;
              let album3;
              if ($1 instanceof Ok) {
                album3 = $1[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH20,
                  "somachord",
                  254,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $1,
                    start: 6562,
                    end: 6613,
                    pattern_start: 6573,
                    pattern_end: 6582
                  }
                );
              }
              let _pipe$1 = new StreamAlbum(album3, 0);
              return dispatch(_pipe$1);
            }
          )
        ],
        () => {
          return [
            m,
            (() => {
              let _pipe = album(
                auth_details,
                req.id,
                (var0) => {
                  return new AlbumRetrieved(var0);
                }
              );
              return map4(
                _pipe,
                (msg2) => {
                  if (msg2 instanceof AlbumRetrieved) {
                    let $1 = msg2[0];
                    if ($1 instanceof Ok) {
                      let $2 = $1[0];
                      if ($2 instanceof Ok) {
                        let album3 = $2[0];
                        return new StreamAlbum(album3, 0);
                      } else {
                        let e = $2[0];
                        echo9(e, void 0, "src/somachord.gleam", 265);
                        throw makeError(
                          "panic",
                          FILEPATH20,
                          "somachord",
                          266,
                          "update",
                          "album subsonic err",
                          {}
                        );
                      }
                    } else {
                      let e = $1[0];
                      echo9(e, void 0, "src/somachord.gleam", 269);
                      return new DisplayToast(
                        new Toast("Unable to request album", "warning")
                      );
                    }
                  } else {
                    throw makeError(
                      "panic",
                      FILEPATH20,
                      "somachord",
                      275,
                      "update",
                      "unreachable",
                      {}
                    );
                  }
                }
              );
            })()
          ];
        }
      );
    } else if ($ === "playlist") {
      return guard(
        (() => {
          let _pipe = m.playlists;
          return has_key(_pipe, req.id);
        })(),
        [
          m,
          from(
            (dispatch) => {
              let _block$1;
              let _pipe = m.playlists;
              _block$1 = map_get(_pipe, req.id);
              let $1 = _block$1;
              let playlist3;
              if ($1 instanceof Ok) {
                playlist3 = $1[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH20,
                  "somachord",
                  284,
                  "update",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $1,
                    start: 7614,
                    end: 7671,
                    pattern_start: 7625,
                    pattern_end: 7637
                  }
                );
              }
              let _pipe$1 = new StreamPlaylist(playlist3, req.index);
              return dispatch(_pipe$1);
            }
          )
        ],
        () => {
          return [
            m,
            (() => {
              let _pipe = playlist(
                auth_details,
                req.id,
                (var0) => {
                  return new PlaylistWithSongs(var0);
                }
              );
              return map4(
                _pipe,
                (msg2) => {
                  if (msg2 instanceof PlaylistWithSongs) {
                    let $1 = msg2[0];
                    if ($1 instanceof Ok) {
                      let $2 = $1[0];
                      if ($2 instanceof Ok) {
                        let playlist3 = $2[0];
                        return new StreamPlaylist(playlist3, req.index);
                      } else {
                        let e = $2[0];
                        echo9(e, void 0, "src/somachord.gleam", 296);
                        throw makeError(
                          "panic",
                          FILEPATH20,
                          "somachord",
                          297,
                          "update",
                          "playlist subsonic err",
                          {}
                        );
                      }
                    } else {
                      let e = $1[0];
                      echo9(e, void 0, "src/somachord.gleam", 300);
                      throw makeError(
                        "panic",
                        FILEPATH20,
                        "somachord",
                        301,
                        "update",
                        "playlist req fetch failed",
                        {}
                      );
                    }
                  } else {
                    throw makeError(
                      "panic",
                      FILEPATH20,
                      "somachord",
                      303,
                      "update",
                      "unreachable",
                      {}
                    );
                  }
                }
              );
            })()
          ];
        }
      );
    } else if ($ === "song") {
      return [
        m,
        song(
          auth_details,
          req.id,
          (var0) => {
            return new SongRetrieval(var0);
          }
        )
      ];
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof CurrentSongPalette) {
    let palette3 = msg[0];
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        echo9(palette3, void 0, "src/somachord.gleam", 680),
        m.toast_display
      ),
      none2()
    ];
  } else if (msg instanceof Search3) {
    let query2 = msg.query;
    return [
      m,
      push("/search/" + query2, new None(), new None())
    ];
  } else if (msg instanceof StreamAlbum) {
    let album3 = msg[0];
    let index5 = msg[1];
    let _block;
    let _block$1;
    let $ = m.shuffled;
    let $1 = new$9(0, album3.songs, 0);
    if ($) {
      let queue3 = $1;
      let _pipe2 = queue3;
      _block$1 = shuffle2(_pipe2);
    } else {
      _block$1 = $1;
    }
    let _pipe = _block$1;
    _block = jump(_pipe, index5);
    let queue2 = _block;
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        queue2,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      play()
    ];
  } else if (msg instanceof StreamPlaylist) {
    let playlist3 = msg[0];
    let index5 = msg[1];
    echo9(playlist3.name, void 0, "src/somachord.gleam", 328);
    let _block;
    let _block$1;
    let $ = m.shuffled;
    let $1 = new$9(0, playlist3.songs, 0);
    if ($) {
      let queue3 = $1;
      let _pipe2 = queue3;
      _block$1 = shuffle2(_pipe2);
    } else {
      _block$1 = $1;
    }
    let _pipe = _block$1;
    _block = jump(_pipe, index5);
    let queue2 = _block;
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        queue2,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      play()
    ];
  } else if (msg instanceof StreamAlbumShuffled) {
    let album3 = msg[0];
    let index5 = msg[1];
    let _block;
    let _pipe = new$9(0, album3.songs, 0);
    let _pipe$1 = shuffle2(_pipe);
    _block = jump(_pipe$1, index5);
    let queue2 = _block;
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        queue2,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        true,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      play()
    ];
  } else if (msg instanceof StreamSong) {
    let song3 = msg[0];
    let _block;
    {
      let _block$1;
      let _pipe2 = m.storage;
      _block$1 = get2(_pipe2, "auth");
      let $ = _block$1;
      let stg;
      if ($ instanceof Ok) {
        stg = $[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH20,
          "somachord",
          349,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 9716,
            end: 9769,
            pattern_start: 9727,
            pattern_end: 9734
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    let stream_uri = stream(auth_details, song3);
    let _pipe = m.player;
    load_song(_pipe, stream_uri, song3);
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        new$9(0, toList([song3]), 0),
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      play()
    ];
  } else if (msg instanceof StreamFromQueue) {
    let position = msg.queue_position;
    let _block;
    {
      let _block$12;
      let _pipe2 = m.storage;
      _block$12 = get2(_pipe2, "auth");
      let $2 = _block$12;
      let stg;
      if ($2 instanceof Ok) {
        stg = $2[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH20,
          "somachord",
          568,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $2,
            start: 16179,
            end: 16232,
            pattern_start: 16190,
            pattern_end: 16197
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    let _block$1;
    let _pipe = m.queue;
    _block$1 = jump(_pipe, position);
    let queue2 = _block$1;
    let $ = current_song(queue2);
    let song3;
    if ($ instanceof Some) {
      song3 = $[0];
    } else {
      throw makeError(
        "let_assert",
        FILEPATH20,
        "somachord",
        572,
        "update",
        "Pattern match failed, no pattern matched the value.",
        {
          value: $,
          start: 16314,
          end: 16370,
          pattern_start: 16325,
          pattern_end: 16342
        }
      );
    }
    let stream_uri = stream(m.auth, song3);
    let _pipe$1 = m.player;
    load_song(_pipe$1, stream_uri, song3);
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        queue2,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      save_queue(
        auth_details,
        new Some(queue2),
        (var0) => {
          return new DisgardedResponse(var0);
        }
      )
    ];
  } else if (msg instanceof StreamCurrent) {
    let $ = current_song(m.queue);
    if ($ instanceof Some) {
      let song3 = $[0];
      let stream_uri = stream(m.auth, song3);
      let _pipe = m.player;
      load_song(_pipe, stream_uri, song3);
      let _pipe$1 = m.player;
      pause_play(_pipe$1);
      let save_queue2 = save_queue(
        m.auth,
        new Some(m.queue),
        (var0) => {
          return new DisgardedResponse(var0);
        }
      );
      let $1 = song3.cover_art_id;
      if ($1 === "") {
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            m.queue,
            song3,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            new Palette(true),
            m.toast_display
          ),
          save_queue2
        ];
      } else {
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            m.queue,
            song3,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            m.current_palette,
            m.toast_display
          ),
          batch(
            toList([
              save_queue2,
              palette2(
                cover_url(m.auth, song3.cover_art_id, 500),
                (res) => {
                  if (res instanceof Ok) {
                    let palette3 = res[0];
                    return new CurrentSongPalette(palette3);
                  } else {
                    let e = res[0];
                    return echo9(
                      new DisgardedResponse(new Ok(new Ok(void 0))),
                      void 0,
                      "src/somachord.gleam",
                      551
                    );
                  }
                }
              )
            ])
          )
        ];
      }
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof StreamError) {
    throw makeError(
      "todo",
      FILEPATH20,
      "somachord",
      363,
      "update",
      "handle stream error",
      {}
    );
  } else if (msg instanceof LoadSong) {
    let $ = current_song(m.queue);
    if ($ instanceof Some) {
      let song3 = $[0];
      let stream_uri = stream(m.auth, song3);
      let _pipe = m.player;
      load_song(_pipe, stream_uri, song3);
      let $1 = song3.cover_art_id;
      if ($1 === "") {
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            m.queue,
            m.current_song,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            new Palette(true),
            m.toast_display
          ),
          none2()
        ];
      } else {
        return [
          new Model(
            m.route,
            m.online,
            m.layout,
            m.storage,
            m.auth,
            m.confirmed,
            m.albums,
            m.player,
            m.queue,
            song3,
            m.seeking,
            m.seek_amount,
            m.played_seconds,
            m.shuffled,
            m.looping,
            m.playlists,
            m.fullscreen_player_open,
            m.fullscreen_player_display,
            m.current_palette,
            m.toast_display
          ),
          palette2(
            cover_url(m.auth, song3.cover_art_id, 500),
            (res) => {
              if (res instanceof Ok) {
                let palette3 = res[0];
                return new CurrentSongPalette(palette3);
              } else {
                let e = res[0];
                return echo9(
                  new DisgardedResponse(new Ok(new Ok(void 0))),
                  void 0,
                  "src/somachord.gleam",
                  512
                );
              }
            }
          )
        ];
      }
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof ProgressDrag) {
    let amount = msg[0];
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        true,
        amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      none2()
    ];
  } else if (msg instanceof PlayerSeek) {
    let amount = msg[0];
    let _pipe = m.player;
    seek(_pipe, amount);
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        false,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      none2()
    ];
  } else if (msg instanceof PlayerSongLoaded) {
    let song3 = msg[0];
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        song3,
        m.seeking,
        m.seek_amount,
        0,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      scrobble(
        (() => {
          let _block;
          let _pipe = m.storage;
          _block = get2(_pipe, "auth");
          let $ = _block;
          let stg;
          if ($ instanceof Ok) {
            stg = $[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH20,
              "somachord",
              385,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $,
                start: 10754,
                end: 10807,
                pattern_start: 10765,
                pattern_end: 10772
              }
            );
          }
          return stg.auth;
        })(),
        song3.id,
        false,
        (var0) => {
          return new DisgardedResponse(var0);
        }
      )
    ];
  } else if (msg instanceof PlayerTick) {
    let time3 = msg.time;
    let _block;
    let $ = time3 < 1;
    if ($) {
      _block = 0;
    } else {
      let _block$1;
      let $1 = absolute_value(time3 - identity(m.played_seconds)) > 1;
      if ($1) {
        _block$1 = m.played_seconds + 1;
      } else {
        _block$1 = m.played_seconds;
      }
      _block = echo9(_block$1, void 0, "src/somachord.gleam", 368);
    }
    let playtime = _block;
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        playtime,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      (() => {
        if (playtime === 0) {
          return check_scrobble(m);
        } else {
          return none2();
        }
      })()
    ];
  } else if (msg instanceof MusicEnded) {
    let _block;
    {
      let _block$1;
      let _pipe = m.storage;
      _block$1 = get2(_pipe, "auth");
      let $ = _block$1;
      let stg;
      if ($ instanceof Ok) {
        stg = $[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH20,
          "somachord",
          421,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 11691,
            end: 11744,
            pattern_start: 11702,
            pattern_end: 11709
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        next(m.queue),
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      batch(
        toList([
          check_scrobble(m),
          (() => {
            let $ = compare2(
              m.queue.position + 1,
              (() => {
                let _pipe = m.queue.songs;
                let _pipe$1 = keys(_pipe);
                return length(_pipe$1);
              })()
            );
            if ($ instanceof Lt) {
              return play();
            } else if ($ instanceof Eq) {
              return similar_songs(
                auth_details,
                m.current_song.id,
                (var0) => {
                  return new SimilarSongs(var0);
                }
              );
            } else {
              return none2();
            }
          })()
        ])
      )
    ];
  } else if (msg instanceof PlayerShuffle) {
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        (() => {
          let $ = m.shuffled;
          if ($) {
            return unshuffle(m.queue);
          } else {
            return shuffle2(m.queue);
          }
        })(),
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        negate(m.shuffled),
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      none2()
    ];
  } else if (msg instanceof PlayerPrevious) {
    let $ = m.queue.position === 0;
    let $1 = (() => {
      let _pipe = m.player;
      return time(_pipe);
    })() > 2;
    if ($1) {
      let _pipe = m.player;
      beginning(_pipe);
      return [m, none2()];
    } else if (!$) {
      return [
        new Model(
          m.route,
          m.online,
          m.layout,
          m.storage,
          m.auth,
          m.confirmed,
          m.albums,
          m.player,
          previous(m.queue),
          m.current_song,
          m.seeking,
          m.seek_amount,
          m.played_seconds,
          m.shuffled,
          m.looping,
          m.playlists,
          m.fullscreen_player_open,
          m.fullscreen_player_display,
          m.current_palette,
          m.toast_display
        ),
        play()
      ];
    } else {
      return [m, none2()];
    }
  } else if (msg instanceof PlayerPausePlay) {
    let _pipe = m.player;
    pause_play(_pipe);
    return [
      m,
      save_queue(
        (() => {
          let _block;
          let _pipe$1 = m.storage;
          _block = get2(_pipe$1, "auth");
          let $ = _block;
          let stg;
          if ($ instanceof Ok) {
            stg = $[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH20,
              "somachord",
              586,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $,
                start: 16746,
                end: 16799,
                pattern_start: 16757,
                pattern_end: 16764
              }
            );
          }
          return stg.auth;
        })(),
        new Some(
          (() => {
            let _record = m.queue;
            return new Queue(
              (() => {
                let _pipe$1 = m.player;
                return time(_pipe$1);
              })(),
              _record.songs,
              _record.song_order,
              _record.position,
              _record.changed
            );
          })()
        ),
        (var0) => {
          return new DisgardedResponse(var0);
        }
      )
    ];
  } else if (msg instanceof PlayerNext) {
    let _block;
    {
      let _block$1;
      let _pipe = m.storage;
      _block$1 = get2(_pipe, "auth");
      let $ = _block$1;
      let stg;
      if ($ instanceof Ok) {
        stg = $[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH20,
          "somachord",
          421,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 11691,
            end: 11744,
            pattern_start: 11702,
            pattern_end: 11709
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        next(m.queue),
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      batch(
        toList([
          check_scrobble(m),
          (() => {
            let $ = compare2(
              m.queue.position + 1,
              (() => {
                let _pipe = m.queue.songs;
                let _pipe$1 = keys(_pipe);
                return length(_pipe$1);
              })()
            );
            if ($ instanceof Lt) {
              return play();
            } else if ($ instanceof Eq) {
              return similar_songs(
                auth_details,
                m.current_song.id,
                (var0) => {
                  return new SimilarSongs(var0);
                }
              );
            } else {
              return none2();
            }
          })()
        ])
      )
    ];
  } else if (msg instanceof PlayerLoop) {
    let _pipe = m.player;
    loop(_pipe, negate(m.looping));
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        negate(m.looping),
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      none2()
    ];
  } else if (msg instanceof Like2) {
    let _block;
    {
      let _block$1;
      let _pipe = m.storage;
      _block$1 = get2(_pipe, "auth");
      let $ = _block$1;
      let stg;
      if ($ instanceof Ok) {
        stg = $[0];
      } else {
        throw makeError(
          "let_assert",
          FILEPATH20,
          "somachord",
          610,
          "update",
          "Pattern match failed, no pattern matched the value.",
          {
            value: $,
            start: 17470,
            end: 17523,
            pattern_start: 17481,
            pattern_end: 17488
          }
        );
      }
      _block = stg.auth;
    }
    let auth_details = _block;
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        (() => {
          let _record = m.queue;
          return new Queue(
            _record.song_position,
            (() => {
              let _pipe = m.queue.songs;
              return insert(
                _pipe,
                m.queue.position,
                (() => {
                  let _record$1 = m.current_song;
                  return new Child(
                    _record$1.id,
                    _record$1.album_name,
                    _record$1.album_id,
                    _record$1.cover_art_id,
                    _record$1.artists,
                    _record$1.duration,
                    _record$1.title,
                    _record$1.track,
                    _record$1.year,
                    negate(m.current_song.starred),
                    _record$1.plays
                  );
                })()
              );
            })(),
            _record.song_order,
            _record.position,
            _record.changed
          );
        })(),
        (() => {
          let _record = m.current_song;
          return new Child(
            _record.id,
            _record.album_name,
            _record.album_id,
            _record.cover_art_id,
            _record.artists,
            _record.duration,
            _record.title,
            _record.track,
            _record.year,
            negate(m.current_song.starred),
            _record.plays
          );
        })(),
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      (() => {
        let $ = m.current_song.starred;
        if ($) {
          return unlike(
            auth_details,
            m.current_song.id,
            (var0) => {
              return new DisgardedResponse(var0);
            }
          );
        } else {
          return like(
            auth_details,
            m.current_song.id,
            (var0) => {
              return new DisgardedResponse(var0);
            }
          );
        }
      })()
    ];
  } else if (msg instanceof QueueJumpTo) {
    let position = msg.position;
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        m.auth,
        m.confirmed,
        m.albums,
        m.player,
        (() => {
          let _pipe = m.queue;
          return jump(_pipe, position);
        })(),
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      play()
    ];
  } else if (msg instanceof Unload) {
    return [
      m,
      save_queue(
        (() => {
          let _block;
          let _pipe = m.storage;
          _block = get2(_pipe, "auth");
          let $ = _block;
          let stg;
          if ($ instanceof Ok) {
            stg = $[0];
          } else {
            throw makeError(
              "let_assert",
              FILEPATH20,
              "somachord",
              233,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $,
                start: 5921,
                end: 5974,
                pattern_start: 5932,
                pattern_end: 5939
              }
            );
          }
          return stg.auth;
        })(),
        new Some(
          (() => {
            let _record = m.queue;
            return new Queue(
              (() => {
                let _pipe = m.player;
                return time(_pipe);
              })(),
              _record.songs,
              _record.song_order,
              _record.position,
              _record.changed
            );
          })()
        ),
        (var0) => {
          return new DisgardedResponse(var0);
        }
      )
    ];
  } else {
    return [m, none2()];
  }
}
function player_event_handler(event4, player) {
  if (event4 === "loaded") {
    return new PlayerSongLoaded(
      (() => {
        let _pipe = player;
        return current(_pipe);
      })()
    );
  } else if (event4 === "time") {
    return new PlayerTick(
      (() => {
        let _pipe = player;
        return time(_pipe);
      })()
    );
  } else if (event4 === "previous") {
    return new PlayerPrevious();
  } else if (event4 === "next") {
    return new PlayerNext();
  } else if (event4 === "ended") {
    return new MusicEnded();
  } else {
    echo9(event4, void 0, "src/somachord.gleam", 723);
    throw makeError(
      "panic",
      FILEPATH20,
      "somachord",
      724,
      "player_event_handler",
      "shouldnt happen",
      {}
    );
  }
}
function init11(_) {
  let _block;
  let _pipe = do_initial_uri();
  _block = ((uri) => {
    if (uri instanceof Ok) {
      let a2 = uri[0];
      return uri_to_route(a2);
    } else {
      return new Home();
    }
  })(_pipe);
  let route = _block;
  let layout2 = layout();
  let m = new Model(
    route,
    true,
    layout2,
    create(),
    new Auth("", new Credentials("", ""), ""),
    false,
    new_map(),
    new_2(),
    empty4(),
    new_song(),
    false,
    0,
    0,
    false,
    false,
    new_map(),
    false,
    new Default(),
    new Palette(true),
    new None()
  );
  let $ = (() => {
    let _pipe$1 = m.storage;
    return get2(_pipe$1, "auth");
  })();
  if ($ instanceof Ok) {
    let stg = $[0];
    return [
      new Model(
        m.route,
        m.online,
        m.layout,
        m.storage,
        stg.auth,
        true,
        m.albums,
        m.player,
        m.queue,
        m.current_song,
        m.seeking,
        m.seek_amount,
        m.played_seconds,
        m.shuffled,
        m.looping,
        m.playlists,
        m.fullscreen_player_open,
        m.fullscreen_player_display,
        m.current_palette,
        m.toast_display
      ),
      batch(
        toList([
          init(on_url_change),
          route_effect(m, m.route),
          listen_events2(m.player, player_event_handler),
          queue(
            (() => {
              let _block$1;
              let _pipe$1 = m.storage;
              _block$1 = get2(_pipe$1, "auth");
              let $1 = _block$1;
              let stg$1;
              if ($1 instanceof Ok) {
                stg$1 = $1[0];
              } else {
                throw makeError(
                  "let_assert",
                  FILEPATH20,
                  "somachord",
                  111,
                  "init",
                  "Pattern match failed, no pattern matched the value.",
                  {
                    value: $1,
                    start: 2832,
                    end: 2885,
                    pattern_start: 2843,
                    pattern_end: 2850
                  }
                );
              }
              return stg$1.auth;
            })(),
            (var0) => {
              return new Queue2(var0);
            }
          ),
          unload_event(),
          online_event(),
          offline_event()
        ])
      )
    ];
  } else {
    let $1 = echo9(
      (() => {
        let _pipe$1 = get_route();
        return uri_to_route(_pipe$1);
      })(),
      void 0,
      "src/somachord.gleam",
      122
    );
    if ($1 instanceof Login) {
      return [
        new Model(
          m.route,
          m.online,
          m.layout,
          m.storage,
          m.auth,
          true,
          m.albums,
          m.player,
          m.queue,
          m.current_song,
          m.seeking,
          m.seek_amount,
          m.played_seconds,
          m.shuffled,
          m.looping,
          m.playlists,
          m.fullscreen_player_open,
          m.fullscreen_player_display,
          m.current_palette,
          m.toast_display
        ),
        init(on_url_change)
      ];
    } else {
      return [
        new Model(
          new Login(),
          m.online,
          m.layout,
          m.storage,
          m.auth,
          true,
          m.albums,
          m.player,
          m.queue,
          m.current_song,
          m.seeking,
          m.seek_amount,
          m.played_seconds,
          m.shuffled,
          m.looping,
          m.playlists,
          m.fullscreen_player_open,
          m.fullscreen_player_display,
          m.current_palette,
          m.toast_display
        ),
        none2()
      ];
    }
  }
}
function view14(m) {
  return guard(
    negate(m.confirmed),
    page4(),
    () => {
      return guard(
        isEqual(m.route, new Login()),
        element5(),
        () => {
          let _block;
          let $ = m.route;
          if ($ instanceof Home) {
            _block = element8(
              toList([on_play((var0) => {
                return new Play2(var0);
              })])
            );
          } else if ($ instanceof Search) {
            let query2 = $.query;
            _block = element11(
              toList([
                on_play((var0) => {
                  return new Play2(var0);
                }),
                query(query2)
              ])
            );
          } else if ($ instanceof Artist2) {
            let id3 = $.id;
            _block = element7(
              toList([
                on_play((var0) => {
                  return new Play2(var0);
                }),
                attribute2("artist-id", id3),
                (() => {
                  let $12 = m.layout;
                  if ($12 instanceof Desktop) {
                    return class$(
                      "rounded-md border border-zinc-800"
                    );
                  } else {
                    return none();
                  }
                })()
              ])
            );
          } else if ($ instanceof Album2) {
            let id3 = $.id;
            _block = page2(m, id3);
          } else if ($ instanceof Song) {
            let id3 = $.id;
            _block = element12(
              toList([
                on_play((var0) => {
                  return new Play2(var0);
                }),
                attribute2("song-id", id3),
                (() => {
                  let $12 = id3 === m.current_song.id;
                  if ($12) {
                    return song_time2(time(m.player));
                  } else {
                    return song_time2(-1);
                  }
                })(),
                (() => {
                  let $12 = m.layout;
                  if ($12 instanceof Desktop) {
                    return class$(
                      "rounded-md border border-zinc-800"
                    );
                  } else {
                    return none();
                  }
                })()
              ])
            );
          } else if ($ instanceof Playlist2) {
            let id3 = $.id;
            _block = element10(
              toList([
                on_playlist(
                  (req) => {
                    return new StreamPlaylist(req.playlist, req.index);
                  }
                ),
                on_play((var0) => {
                  return new Play2(var0);
                }),
                attribute2("playlist-id", id3),
                attribute2("song-id", m.current_song.id)
              ])
            );
          } else if ($ instanceof Likes) {
            _block = element10(
              toList([
                on_playlist(
                  (req) => {
                    return new StreamPlaylist(req.playlist, req.index);
                  }
                ),
                on_play((var0) => {
                  return new Play2(var0);
                }),
                attribute2(
                  "playlist-id",
                  somachord_likes_playlist_id
                ),
                attribute2("song-id", m.current_song.id)
              ])
            );
          } else if ($ instanceof Library) {
            _block = element9(
              toList([on_play((var0) => {
                return new Play2(var0);
              })])
            );
          } else if ($ instanceof About) {
            _block = page();
          } else {
            _block = page3(new NotFound3(), none());
          }
          let page6 = _block;
          let $1 = m.layout;
          if ($1 instanceof Desktop) {
            return view12(m, page6);
          } else {
            return view13(m, page6);
          }
        }
      );
    }
  );
}
function main() {
  let app = application(init11, update11, view14);
  let $ = register3();
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      54,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 1280,
        end: 1323,
        pattern_start: 1291,
        pattern_end: 1296
      }
    );
  }
  let $1 = register();
  if (!($1 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      55,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $1,
        start: 1326,
        end: 1362,
        pattern_start: 1337,
        pattern_end: 1342
      }
    );
  }
  let $2 = register2();
  if (!($2 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      57,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $2,
        start: 1366,
        end: 1401,
        pattern_start: 1377,
        pattern_end: 1382
      }
    );
  }
  let $3 = register5();
  if (!($3 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      58,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $3,
        start: 1404,
        end: 1438,
        pattern_start: 1415,
        pattern_end: 1420
      }
    );
  }
  let $4 = register4();
  if (!($4 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      59,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $4,
        start: 1441,
        end: 1477,
        pattern_start: 1452,
        pattern_end: 1457
      }
    );
  }
  let $5 = register10();
  if (!($5 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      60,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $5,
        start: 1480,
        end: 1514,
        pattern_start: 1491,
        pattern_end: 1496
      }
    );
  }
  let $6 = register9();
  if (!($6 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      61,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $6,
        start: 1517,
        end: 1553,
        pattern_start: 1528,
        pattern_end: 1533
      }
    );
  }
  let $7 = register8();
  if (!($7 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      62,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $7,
        start: 1556,
        end: 1594,
        pattern_start: 1567,
        pattern_end: 1572
      }
    );
  }
  let $8 = register7();
  if (!($8 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      63,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $8,
        start: 1597,
        end: 1634,
        pattern_start: 1608,
        pattern_end: 1613
      }
    );
  }
  let $9 = start3(app, "#app", 0);
  if (!($9 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH20,
      "somachord",
      64,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $9,
        start: 1637,
        end: 1684,
        pattern_start: 1648,
        pattern_end: 1653
      }
    );
  }
  return $9;
}
function echo9(value3, message2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const inspector = new Echo$Inspector9();
  const string_value = inspector.inspect(value3);
  const string_message = message2 === void 0 ? "" : " " + message2;
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}${string_message}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value3;
}
var Echo$Inspector9 = class {
  #references = /* @__PURE__ */ new Set();
  #isDict(value3) {
    try {
      return value3 instanceof Dict;
    } catch {
      return false;
    }
  }
  #float(float4) {
    const string6 = float4.toString().replace("+", "");
    if (string6.indexOf(".") >= 0) {
      return string6;
    } else {
      const index5 = string6.indexOf("e");
      if (index5 >= 0) {
        return string6.slice(0, index5) + ".0" + string6.slice(index5);
      } else {
        return string6 + ".0";
      }
    }
  }
  inspect(v) {
    const t = typeof v;
    if (v === true) return "True";
    if (v === false) return "False";
    if (v === null) return "//js(null)";
    if (v === void 0) return "Nil";
    if (t === "string") return this.#string(v);
    if (t === "bigint" || Number.isInteger(v)) return v.toString();
    if (t === "number") return this.#float(v);
    if (v instanceof UtfCodepoint) return this.#utfCodepoint(v);
    if (v instanceof BitArray) return this.#bit_array(v);
    if (v instanceof RegExp) return `//js(${v})`;
    if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
    if (v instanceof globalThis.Error) return `//js(${v.toString()})`;
    if (v instanceof Function) {
      const args = [];
      for (const i2 of Array(v.length).keys())
        args.push(String.fromCharCode(i2 + 97));
      return `//fn(${args.join(", ")}) { ... }`;
    }
    if (this.#references.size === this.#references.add(v).size) {
      return "//js(circular reference)";
    }
    let printed;
    if (Array.isArray(v)) {
      printed = `#(${v.map((v2) => this.inspect(v2)).join(", ")})`;
    } else if (v instanceof List) {
      printed = this.#list(v);
    } else if (v instanceof CustomType) {
      printed = this.#customType(v);
    } else if (this.#isDict(v)) {
      printed = this.#dict(v);
    } else if (v instanceof Set) {
      return `//js(Set(${[...v].map((v2) => this.inspect(v2)).join(", ")}))`;
    } else {
      printed = this.#object(v);
    }
    this.#references.delete(v);
    return printed;
  }
  #object(v) {
    const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
    const props = [];
    for (const k of Object.keys(v)) {
      props.push(`${this.inspect(k)}: ${this.inspect(v[k])}`);
    }
    const body2 = props.length ? " " + props.join(", ") + " " : "";
    const head = name2 === "Object" ? "" : name2 + " ";
    return `//js(${head}{${body2}})`;
  }
  #dict(map7) {
    let body2 = "dict.from_list([";
    let first3 = true;
    let key_value_pairs = [];
    map7.forEach((value3, key3) => {
      key_value_pairs.push([key3, value3]);
    });
    key_value_pairs.sort();
    key_value_pairs.forEach(([key3, value3]) => {
      if (!first3) body2 = body2 + ", ";
      body2 = body2 + "#(" + this.inspect(key3) + ", " + this.inspect(value3) + ")";
      first3 = false;
    });
    return body2 + "])";
  }
  #customType(record) {
    const props = Object.keys(record).map((label2) => {
      const value3 = this.inspect(record[label2]);
      return isNaN(parseInt(label2)) ? `${label2}: ${value3}` : value3;
    }).join(", ");
    return props ? `${record.constructor.name}(${props})` : record.constructor.name;
  }
  #list(list5) {
    if (list5 instanceof Empty) {
      return "[]";
    }
    let char_out = 'charlist.from_string("';
    let list_out = "[";
    let current2 = list5;
    while (current2 instanceof NonEmpty) {
      let element13 = current2.head;
      current2 = current2.tail;
      if (list_out !== "[") {
        list_out += ", ";
      }
      list_out += this.inspect(element13);
      if (char_out) {
        if (Number.isInteger(element13) && element13 >= 32 && element13 <= 126) {
          char_out += String.fromCharCode(element13);
        } else {
          char_out = null;
        }
      }
    }
    if (char_out) {
      return char_out + '")';
    } else {
      return list_out + "]";
    }
  }
  #string(str) {
    let new_str = '"';
    for (let i2 = 0; i2 < str.length; i2++) {
      const char = str[i2];
      switch (char) {
        case "\n":
          new_str += "\\n";
          break;
        case "\r":
          new_str += "\\r";
          break;
        case "	":
          new_str += "\\t";
          break;
        case "\f":
          new_str += "\\f";
          break;
        case "\\":
          new_str += "\\\\";
          break;
        case '"':
          new_str += '\\"';
          break;
        default:
          if (char < " " || char > "~" && char < "\xA0") {
            new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
          } else {
            new_str += char;
          }
      }
    }
    new_str += '"';
    return new_str;
  }
  #utfCodepoint(codepoint2) {
    return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
  }
  #bit_array(bits) {
    if (bits.bitSize === 0) {
      return "<<>>";
    }
    let acc = "<<";
    for (let i2 = 0; i2 < bits.byteSize - 1; i2++) {
      acc += bits.byteAt(i2).toString();
      acc += ", ";
    }
    if (bits.byteSize * 8 === bits.bitSize) {
      acc += bits.byteAt(bits.byteSize - 1).toString();
    } else {
      const trailingBitsCount = bits.bitSize % 8;
      acc += bits.byteAt(bits.byteSize - 1) >> 8 - trailingBitsCount;
      acc += `:size(${trailingBitsCount})`;
    }
    acc += ">>";
    return acc;
  }
};

// build/.lustre/entry.mjs
main();
/*! Bundled license information:

js-md5/src/md5.js:
  (**
   * [js-md5]{@link https://github.com/emn178/js-md5}
   *
   * @namespace md5
   * @version 0.8.3
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2023
   * @license MIT
   *)
*/
