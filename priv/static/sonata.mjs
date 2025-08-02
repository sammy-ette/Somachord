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
var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
  mod
));

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
  }
});

// (disabled):buffer
var require_buffer = __commonJS({
  "(disabled):buffer"() {
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
        var h0 = this.h0, h12 = this.h1, h2 = this.h2, h3 = this.h3;
        return HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h12 >>> 4 & 15] + HEX_CHARS[h12 & 15] + HEX_CHARS[h12 >>> 12 & 15] + HEX_CHARS[h12 >>> 8 & 15] + HEX_CHARS[h12 >>> 20 & 15] + HEX_CHARS[h12 >>> 16 & 15] + HEX_CHARS[h12 >>> 28 & 15] + HEX_CHARS[h12 >>> 24 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15];
      };
      Md5.prototype.toString = Md5.prototype.hex;
      Md5.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h12 = this.h1, h2 = this.h2, h3 = this.h3;
        return [
          h0 & 255,
          h0 >>> 8 & 255,
          h0 >>> 16 & 255,
          h0 >>> 24 & 255,
          h12 & 255,
          h12 >>> 8 & 255,
          h12 >>> 16 & 255,
          h12 >>> 24 & 255,
          h2 & 255,
          h2 >>> 8 & 255,
          h2 >>> 16 & 255,
          h2 >>> 24 & 255,
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
    let current = this;
    while (desired-- > 0 && current) current = current.tail;
    return current !== void 0;
  }
  // @internal
  hasLength(desired) {
    let current = this;
    while (desired-- > 0 && current) current = current.tail;
    return desired === -1 && current instanceof Empty;
  }
  // @internal
  countLength() {
    let current = this;
    let length5 = 0;
    while (current) {
      current = current.tail;
      length5++;
    }
    return length5 - 1;
  }
};
function prepend(element6, tail) {
  return new NonEmpty(element6, tail);
}
function toList(elements, tail) {
  return List.fromArray(elements, tail);
}
var ListIterator = class {
  #current;
  constructor(current) {
    this.#current = current;
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
  constructor(value2) {
    this.value = value2;
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
function bitArraySlice(bitArray, start4, end) {
  end ??= bitArray.bitSize;
  bitArrayValidateRange(bitArray, start4, end);
  if (start4 === end) {
    return new BitArray(new Uint8Array());
  }
  if (start4 === 0 && end === bitArray.bitSize) {
    return bitArray;
  }
  start4 += bitArray.bitOffset;
  end += bitArray.bitOffset;
  const startByteIndex = Math.trunc(start4 / 8);
  const endByteIndex = Math.trunc((end + 7) / 8);
  const byteLength = endByteIndex - startByteIndex;
  let buffer;
  if (startByteIndex === 0 && byteLength === bitArray.rawBuffer.byteLength) {
    buffer = bitArray.rawBuffer;
  } else {
    buffer = new Uint8Array(
      bitArray.rawBuffer.buffer,
      bitArray.rawBuffer.byteOffset + startByteIndex,
      byteLength
    );
  }
  return new BitArray(buffer, end - start4, start4 % 8);
}
function bitArraySliceToInt(bitArray, start4, end, isBigEndian, isSigned) {
  bitArrayValidateRange(bitArray, start4, end);
  if (start4 === end) {
    return 0;
  }
  start4 += bitArray.bitOffset;
  end += bitArray.bitOffset;
  const isStartByteAligned = start4 % 8 === 0;
  const isEndByteAligned = end % 8 === 0;
  if (isStartByteAligned && isEndByteAligned) {
    return intFromAlignedSlice(
      bitArray,
      start4 / 8,
      end / 8,
      isBigEndian,
      isSigned
    );
  }
  const size2 = end - start4;
  const startByteIndex = Math.trunc(start4 / 8);
  const endByteIndex = Math.trunc((end - 1) / 8);
  if (startByteIndex == endByteIndex) {
    const mask2 = 255 >> start4 % 8;
    const unusedLowBitCount = (8 - end % 8) % 8;
    let value2 = (bitArray.rawBuffer[startByteIndex] & mask2) >> unusedLowBitCount;
    if (isSigned) {
      const highBit = 2 ** (size2 - 1);
      if (value2 >= highBit) {
        value2 -= highBit * 2;
      }
    }
    return value2;
  }
  if (size2 <= 53) {
    return intFromUnalignedSliceUsingNumber(
      bitArray.rawBuffer,
      start4,
      end,
      isBigEndian,
      isSigned
    );
  } else {
    return intFromUnalignedSliceUsingBigInt(
      bitArray.rawBuffer,
      start4,
      end,
      isBigEndian,
      isSigned
    );
  }
}
function intFromAlignedSlice(bitArray, start4, end, isBigEndian, isSigned) {
  const byteSize = end - start4;
  if (byteSize <= 6) {
    return intFromAlignedSliceUsingNumber(
      bitArray.rawBuffer,
      start4,
      end,
      isBigEndian,
      isSigned
    );
  } else {
    return intFromAlignedSliceUsingBigInt(
      bitArray.rawBuffer,
      start4,
      end,
      isBigEndian,
      isSigned
    );
  }
}
function intFromAlignedSliceUsingNumber(buffer, start4, end, isBigEndian, isSigned) {
  const byteSize = end - start4;
  let value2 = 0;
  if (isBigEndian) {
    for (let i2 = start4; i2 < end; i2++) {
      value2 *= 256;
      value2 += buffer[i2];
    }
  } else {
    for (let i2 = end - 1; i2 >= start4; i2--) {
      value2 *= 256;
      value2 += buffer[i2];
    }
  }
  if (isSigned) {
    const highBit = 2 ** (byteSize * 8 - 1);
    if (value2 >= highBit) {
      value2 -= highBit * 2;
    }
  }
  return value2;
}
function intFromAlignedSliceUsingBigInt(buffer, start4, end, isBigEndian, isSigned) {
  const byteSize = end - start4;
  let value2 = 0n;
  if (isBigEndian) {
    for (let i2 = start4; i2 < end; i2++) {
      value2 *= 256n;
      value2 += BigInt(buffer[i2]);
    }
  } else {
    for (let i2 = end - 1; i2 >= start4; i2--) {
      value2 *= 256n;
      value2 += BigInt(buffer[i2]);
    }
  }
  if (isSigned) {
    const highBit = 1n << BigInt(byteSize * 8 - 1);
    if (value2 >= highBit) {
      value2 -= highBit * 2n;
    }
  }
  return Number(value2);
}
function intFromUnalignedSliceUsingNumber(buffer, start4, end, isBigEndian, isSigned) {
  const isStartByteAligned = start4 % 8 === 0;
  let size2 = end - start4;
  let byteIndex = Math.trunc(start4 / 8);
  let value2 = 0;
  if (isBigEndian) {
    if (!isStartByteAligned) {
      const leadingBitsCount = 8 - start4 % 8;
      value2 = buffer[byteIndex++] & (1 << leadingBitsCount) - 1;
      size2 -= leadingBitsCount;
    }
    while (size2 >= 8) {
      value2 *= 256;
      value2 += buffer[byteIndex++];
      size2 -= 8;
    }
    if (size2 > 0) {
      value2 *= 2 ** size2;
      value2 += buffer[byteIndex] >> 8 - size2;
    }
  } else {
    if (isStartByteAligned) {
      let size3 = end - start4;
      let scale = 1;
      while (size3 >= 8) {
        value2 += buffer[byteIndex++] * scale;
        scale *= 256;
        size3 -= 8;
      }
      value2 += (buffer[byteIndex] >> 8 - size3) * scale;
    } else {
      const highBitsCount = start4 % 8;
      const lowBitsCount = 8 - highBitsCount;
      let size3 = end - start4;
      let scale = 1;
      while (size3 >= 8) {
        const byte = buffer[byteIndex] << highBitsCount | buffer[byteIndex + 1] >> lowBitsCount;
        value2 += (byte & 255) * scale;
        scale *= 256;
        size3 -= 8;
        byteIndex++;
      }
      if (size3 > 0) {
        const lowBitsUsed = size3 - Math.max(0, size3 - lowBitsCount);
        let trailingByte = (buffer[byteIndex] & (1 << lowBitsCount) - 1) >> lowBitsCount - lowBitsUsed;
        size3 -= lowBitsUsed;
        if (size3 > 0) {
          trailingByte *= 2 ** size3;
          trailingByte += buffer[byteIndex + 1] >> 8 - size3;
        }
        value2 += trailingByte * scale;
      }
    }
  }
  if (isSigned) {
    const highBit = 2 ** (end - start4 - 1);
    if (value2 >= highBit) {
      value2 -= highBit * 2;
    }
  }
  return value2;
}
function intFromUnalignedSliceUsingBigInt(buffer, start4, end, isBigEndian, isSigned) {
  const isStartByteAligned = start4 % 8 === 0;
  let size2 = end - start4;
  let byteIndex = Math.trunc(start4 / 8);
  let value2 = 0n;
  if (isBigEndian) {
    if (!isStartByteAligned) {
      const leadingBitsCount = 8 - start4 % 8;
      value2 = BigInt(buffer[byteIndex++] & (1 << leadingBitsCount) - 1);
      size2 -= leadingBitsCount;
    }
    while (size2 >= 8) {
      value2 *= 256n;
      value2 += BigInt(buffer[byteIndex++]);
      size2 -= 8;
    }
    if (size2 > 0) {
      value2 <<= BigInt(size2);
      value2 += BigInt(buffer[byteIndex] >> 8 - size2);
    }
  } else {
    if (isStartByteAligned) {
      let size3 = end - start4;
      let shift = 0n;
      while (size3 >= 8) {
        value2 += BigInt(buffer[byteIndex++]) << shift;
        shift += 8n;
        size3 -= 8;
      }
      value2 += BigInt(buffer[byteIndex] >> 8 - size3) << shift;
    } else {
      const highBitsCount = start4 % 8;
      const lowBitsCount = 8 - highBitsCount;
      let size3 = end - start4;
      let shift = 0n;
      while (size3 >= 8) {
        const byte = buffer[byteIndex] << highBitsCount | buffer[byteIndex + 1] >> lowBitsCount;
        value2 += BigInt(byte & 255) << shift;
        shift += 8n;
        size3 -= 8;
        byteIndex++;
      }
      if (size3 > 0) {
        const lowBitsUsed = size3 - Math.max(0, size3 - lowBitsCount);
        let trailingByte = (buffer[byteIndex] & (1 << lowBitsCount) - 1) >> lowBitsCount - lowBitsUsed;
        size3 -= lowBitsUsed;
        if (size3 > 0) {
          trailingByte <<= size3;
          trailingByte += buffer[byteIndex + 1] >> 8 - size3;
        }
        value2 += BigInt(trailingByte) << shift;
      }
    }
  }
  if (isSigned) {
    const highBit = 2n ** BigInt(end - start4 - 1);
    if (value2 >= highBit) {
      value2 -= highBit * 2n;
    }
  }
  return Number(value2);
}
function bitArrayValidateRange(bitArray, start4, end) {
  if (start4 < 0 || start4 > bitArray.bitSize || end < start4 || end > bitArray.bitSize) {
    const msg = `Invalid bit array slice: start = ${start4}, end = ${end}, bit size = ${bitArray.bitSize}`;
    throw new globalThis.Error(msg);
  }
}
var Result = class _Result extends CustomType {
  // @internal
  static isResult(data) {
    return data instanceof _Result;
  }
};
var Ok = class extends Result {
  constructor(value2) {
    super();
    this[0] = value2;
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
    let [keys2, get2] = getters(a2);
    for (let k of keys2(a2)) {
      values3.push(get2(a2, k), get2(b, k));
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
  const hash = referenceUID++;
  if (referenceUID === 2147483647) {
    referenceUID = 0;
  }
  referenceMap.set(o, hash);
  return hash;
}
function hashMerge(a2, b) {
  return a2 ^ b + 2654435769 + (a2 << 6) + (a2 >> 2) | 0;
}
function hashString(s) {
  let hash = 0;
  const len = s.length;
  for (let i2 = 0; i2 < len; i2++) {
    hash = Math.imul(31, hash) + s.charCodeAt(i2) | 0;
  }
  return hash;
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
function mask(hash, shift) {
  return hash >>> shift & MASK;
}
function bitpos(hash, shift) {
  return 1 << mask(hash, shift);
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
function cloneAndSet(arr, at, val) {
  const len = arr.length;
  const out = new Array(len);
  for (let i2 = 0; i2 < len; ++i2) {
    out[i2] = arr[i2];
  }
  out[at] = val;
  return out;
}
function spliceIn(arr, at, val) {
  const len = arr.length;
  const out = new Array(len + 1);
  let i2 = 0;
  let g2 = 0;
  while (i2 < at) {
    out[g2++] = arr[i2++];
  }
  out[g2++] = val;
  while (i2 < len) {
    out[g2++] = arr[i2++];
  }
  return out;
}
function spliceOut(arr, at) {
  const len = arr.length;
  const out = new Array(len - 1);
  let i2 = 0;
  let g2 = 0;
  while (i2 < at) {
    out[g2++] = arr[i2++];
  }
  ++i2;
  while (i2 < len) {
    out[g2++] = arr[i2++];
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
function assoc(root3, shift, hash, key3, val, addedLeaf) {
  switch (root3.type) {
    case ARRAY_NODE:
      return assocArray(root3, shift, hash, key3, val, addedLeaf);
    case INDEX_NODE:
      return assocIndex(root3, shift, hash, key3, val, addedLeaf);
    case COLLISION_NODE:
      return assocCollision(root3, shift, hash, key3, val, addedLeaf);
  }
}
function assocArray(root3, shift, hash, key3, val, addedLeaf) {
  const idx = mask(hash, shift);
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
        createNode(shift + SHIFT, node.k, node.v, hash, key3, val)
      )
    };
  }
  const n = assoc(node, shift + SHIFT, hash, key3, val, addedLeaf);
  if (n === node) {
    return root3;
  }
  return {
    type: ARRAY_NODE,
    size: root3.size,
    array: cloneAndSet(root3.array, idx, n)
  };
}
function assocIndex(root3, shift, hash, key3, val, addedLeaf) {
  const bit = bitpos(hash, shift);
  const idx = index(root3.bitmap, bit);
  if ((root3.bitmap & bit) !== 0) {
    const node = root3.array[idx];
    if (node.type !== ENTRY) {
      const n = assoc(node, shift + SHIFT, hash, key3, val, addedLeaf);
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
        createNode(shift + SHIFT, nodeKey, node.v, hash, key3, val)
      )
    };
  } else {
    const n = root3.array.length;
    if (n >= MAX_INDEX_NODE) {
      const nodes = new Array(32);
      const jdx = mask(hash, shift);
      nodes[jdx] = assocIndex(EMPTY, shift + SHIFT, hash, key3, val, addedLeaf);
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
function assocCollision(root3, shift, hash, key3, val, addedLeaf) {
  if (hash === root3.hash) {
    const idx = collisionIndexOf(root3, key3);
    if (idx !== -1) {
      const entry = root3.array[idx];
      if (entry.v === val) {
        return root3;
      }
      return {
        type: COLLISION_NODE,
        hash,
        array: cloneAndSet(root3.array, idx, { type: ENTRY, k: key3, v: val })
      };
    }
    const size2 = root3.array.length;
    addedLeaf.val = true;
    return {
      type: COLLISION_NODE,
      hash,
      array: cloneAndSet(root3.array, size2, { type: ENTRY, k: key3, v: val })
    };
  }
  return assoc(
    {
      type: INDEX_NODE,
      bitmap: bitpos(root3.hash, shift),
      array: [root3]
    },
    shift,
    hash,
    key3,
    val,
    addedLeaf
  );
}
function collisionIndexOf(root3, key3) {
  const size2 = root3.array.length;
  for (let i2 = 0; i2 < size2; i2++) {
    if (isEqual(key3, root3.array[i2].k)) {
      return i2;
    }
  }
  return -1;
}
function find(root3, shift, hash, key3) {
  switch (root3.type) {
    case ARRAY_NODE:
      return findArray(root3, shift, hash, key3);
    case INDEX_NODE:
      return findIndex(root3, shift, hash, key3);
    case COLLISION_NODE:
      return findCollision(root3, key3);
  }
}
function findArray(root3, shift, hash, key3) {
  const idx = mask(hash, shift);
  const node = root3.array[idx];
  if (node === void 0) {
    return void 0;
  }
  if (node.type !== ENTRY) {
    return find(node, shift + SHIFT, hash, key3);
  }
  if (isEqual(key3, node.k)) {
    return node;
  }
  return void 0;
}
function findIndex(root3, shift, hash, key3) {
  const bit = bitpos(hash, shift);
  if ((root3.bitmap & bit) === 0) {
    return void 0;
  }
  const idx = index(root3.bitmap, bit);
  const node = root3.array[idx];
  if (node.type !== ENTRY) {
    return find(node, shift + SHIFT, hash, key3);
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
function without(root3, shift, hash, key3) {
  switch (root3.type) {
    case ARRAY_NODE:
      return withoutArray(root3, shift, hash, key3);
    case INDEX_NODE:
      return withoutIndex(root3, shift, hash, key3);
    case COLLISION_NODE:
      return withoutCollision(root3, key3);
  }
}
function withoutArray(root3, shift, hash, key3) {
  const idx = mask(hash, shift);
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
    n = without(node, shift + SHIFT, hash, key3);
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
function withoutIndex(root3, shift, hash, key3) {
  const bit = bitpos(hash, shift);
  if ((root3.bitmap & bit) === 0) {
    return root3;
  }
  const idx = index(root3.bitmap, bit);
  const node = root3.array[idx];
  if (node.type !== ENTRY) {
    const n = without(node, shift + SHIFT, hash, key3);
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
  const size2 = items.length;
  for (let i2 = 0; i2 < size2; i2++) {
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
  constructor(root3, size2) {
    this.root = root3;
    this.size = size2;
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

// build/dev/javascript/gleam_stdlib/gleam/option.mjs
var Some = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var None = class extends CustomType {
};
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
function or(first, second2) {
  if (first instanceof Some) {
    return first;
  } else {
    return second2;
  }
}

// build/dev/javascript/gleam_stdlib/gleam/dict.mjs
function insert(dict2, key3, value2) {
  return map_insert(key3, value2, dict2);
}

// build/dev/javascript/gleam_stdlib/gleam/order.mjs
var Lt = class extends CustomType {
};
var Eq = class extends CustomType {
};
var Gt = class extends CustomType {
};

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
var Ascending = class extends CustomType {
};
var Descending = class extends CustomType {
};
function length_loop(loop$list, loop$count) {
  while (true) {
    let list4 = loop$list;
    let count = loop$count;
    if (list4 instanceof Empty) {
      return count;
    } else {
      let list$1 = list4.tail;
      loop$list = list$1;
      loop$count = count + 1;
    }
  }
}
function length(list4) {
  return length_loop(list4, 0);
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
function reverse(list4) {
  return reverse_and_prepend(list4, toList([]));
}
function filter_map_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list4 = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list4 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list4.head;
      let rest$1 = list4.tail;
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
function filter_map(list4, fun) {
  return filter_map_loop(list4, fun, toList([]));
}
function map_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list4 = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list4 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list4.head;
      let rest$1 = list4.tail;
      loop$list = rest$1;
      loop$fun = fun;
      loop$acc = prepend(fun(first$1), acc);
    }
  }
}
function map(list4, fun) {
  return map_loop(list4, fun, toList([]));
}
function index_map_loop(loop$list, loop$fun, loop$index, loop$acc) {
  while (true) {
    let list4 = loop$list;
    let fun = loop$fun;
    let index5 = loop$index;
    let acc = loop$acc;
    if (list4 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list4.head;
      let rest$1 = list4.tail;
      let acc$1 = prepend(fun(first$1, index5), acc);
      loop$list = rest$1;
      loop$fun = fun;
      loop$index = index5 + 1;
      loop$acc = acc$1;
    }
  }
}
function index_map(list4, fun) {
  return index_map_loop(list4, fun, 0, toList([]));
}
function take_loop(loop$list, loop$n, loop$acc) {
  while (true) {
    let list4 = loop$list;
    let n = loop$n;
    let acc = loop$acc;
    let $ = n <= 0;
    if ($) {
      return reverse(acc);
    } else {
      if (list4 instanceof Empty) {
        return reverse(acc);
      } else {
        let first$1 = list4.head;
        let rest$1 = list4.tail;
        loop$list = rest$1;
        loop$n = n - 1;
        loop$acc = prepend(first$1, acc);
      }
    }
  }
}
function take(list4, n) {
  return take_loop(list4, n, toList([]));
}
function append_loop(loop$first, loop$second) {
  while (true) {
    let first = loop$first;
    let second2 = loop$second;
    if (first instanceof Empty) {
      return second2;
    } else {
      let first$1 = first.head;
      let rest$1 = first.tail;
      loop$first = rest$1;
      loop$second = prepend(first$1, second2);
    }
  }
}
function append(first, second2) {
  return append_loop(reverse(first), second2);
}
function flatten_loop(loop$lists, loop$acc) {
  while (true) {
    let lists = loop$lists;
    let acc = loop$acc;
    if (lists instanceof Empty) {
      return reverse(acc);
    } else {
      let list4 = lists.head;
      let further_lists = lists.tail;
      loop$lists = further_lists;
      loop$acc = reverse_and_prepend(list4, acc);
    }
  }
}
function flatten(lists) {
  return flatten_loop(lists, toList([]));
}
function flat_map(list4, fun) {
  return flatten(map(list4, fun));
}
function fold(loop$list, loop$initial, loop$fun) {
  while (true) {
    let list4 = loop$list;
    let initial = loop$initial;
    let fun = loop$fun;
    if (list4 instanceof Empty) {
      return initial;
    } else {
      let first$1 = list4.head;
      let rest$1 = list4.tail;
      loop$list = rest$1;
      loop$initial = fun(initial, first$1);
      loop$fun = fun;
    }
  }
}
function find_map(loop$list, loop$fun) {
  while (true) {
    let list4 = loop$list;
    let fun = loop$fun;
    if (list4 instanceof Empty) {
      return new Error2(void 0);
    } else {
      let first$1 = list4.head;
      let rest$1 = list4.tail;
      let $ = fun(first$1);
      if ($ instanceof Ok) {
        let first$2 = $[0];
        return new Ok(first$2);
      } else {
        loop$list = rest$1;
        loop$fun = fun;
      }
    }
  }
}
function intersperse_loop(loop$list, loop$separator, loop$acc) {
  while (true) {
    let list4 = loop$list;
    let separator = loop$separator;
    let acc = loop$acc;
    if (list4 instanceof Empty) {
      return reverse(acc);
    } else {
      let first$1 = list4.head;
      let rest$1 = list4.tail;
      loop$list = rest$1;
      loop$separator = separator;
      loop$acc = prepend(first$1, prepend(separator, acc));
    }
  }
}
function intersperse(list4, elem) {
  if (list4 instanceof Empty) {
    return list4;
  } else {
    let $ = list4.tail;
    if ($ instanceof Empty) {
      return list4;
    } else {
      let first$1 = list4.head;
      let rest$1 = $;
      return intersperse_loop(rest$1, elem, toList([first$1]));
    }
  }
}
function sequences(loop$list, loop$compare, loop$growing, loop$direction, loop$prev, loop$acc) {
  while (true) {
    let list4 = loop$list;
    let compare5 = loop$compare;
    let growing = loop$growing;
    let direction = loop$direction;
    let prev = loop$prev;
    let acc = loop$acc;
    let growing$1 = prepend(prev, growing);
    if (list4 instanceof Empty) {
      if (direction instanceof Ascending) {
        return prepend(reverse(growing$1), acc);
      } else {
        return prepend(growing$1, acc);
      }
    } else {
      let new$1 = list4.head;
      let rest$1 = list4.tail;
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
            let next = rest$1.head;
            let rest$2 = rest$1.tail;
            let _block$1;
            let $1 = compare5(new$1, next);
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
            loop$prev = next;
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
          let next = rest$1.head;
          let rest$2 = rest$1.tail;
          let _block$1;
          let $1 = compare5(new$1, next);
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
          loop$prev = next;
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
          let next = rest$1.head;
          let rest$2 = rest$1.tail;
          let _block$1;
          let $1 = compare5(new$1, next);
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
          loop$prev = next;
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
      let list4 = list22;
      return reverse_and_prepend(list4, acc);
    } else if (list22 instanceof Empty) {
      let list4 = list1;
      return reverse_and_prepend(list4, acc);
    } else {
      let first1 = list1.head;
      let rest1 = list1.tail;
      let first2 = list22.head;
      let rest2 = list22.tail;
      let $ = compare5(first1, first2);
      if ($ instanceof Lt) {
        loop$list1 = rest1;
        loop$list2 = list22;
        loop$compare = compare5;
        loop$acc = prepend(first1, acc);
      } else if ($ instanceof Eq) {
        loop$list1 = list1;
        loop$list2 = rest2;
        loop$compare = compare5;
        loop$acc = prepend(first2, acc);
      } else {
        loop$list1 = list1;
        loop$list2 = rest2;
        loop$compare = compare5;
        loop$acc = prepend(first2, acc);
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
      let list4 = list22;
      return reverse_and_prepend(list4, acc);
    } else if (list22 instanceof Empty) {
      let list4 = list1;
      return reverse_and_prepend(list4, acc);
    } else {
      let first1 = list1.head;
      let rest1 = list1.tail;
      let first2 = list22.head;
      let rest2 = list22.tail;
      let $ = compare5(first1, first2);
      if ($ instanceof Lt) {
        loop$list1 = list1;
        loop$list2 = rest2;
        loop$compare = compare5;
        loop$acc = prepend(first2, acc);
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
      return toList([]);
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
function sort(list4, compare5) {
  if (list4 instanceof Empty) {
    return toList([]);
  } else {
    let $ = list4.tail;
    if ($ instanceof Empty) {
      let x = list4.head;
      return toList([x]);
    } else {
      let x = list4.head;
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
function repeat_loop(loop$item, loop$times, loop$acc) {
  while (true) {
    let item = loop$item;
    let times = loop$times;
    let acc = loop$acc;
    let $ = times <= 0;
    if ($) {
      return acc;
    } else {
      loop$item = item;
      loop$times = times - 1;
      loop$acc = prepend(item, acc);
    }
  }
}
function repeat(a2, times) {
  return repeat_loop(a2, times, toList([]));
}
function key_find(keyword_list, desired_key) {
  return find_map(
    keyword_list,
    (keyword) => {
      let key3 = keyword[0];
      let value2 = keyword[1];
      let $ = isEqual(key3, desired_key);
      if ($) {
        return new Ok(value2);
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
      let key3 = keyword[0];
      let value2 = keyword[1];
      let $ = isEqual(key3, desired_key);
      if ($) {
        return new Ok(value2);
      } else {
        return new Error2(void 0);
      }
    }
  );
}

// build/dev/javascript/gleam_stdlib/gleam/string.mjs
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
function split2(x, substring) {
  if (substring === "") {
    return graphemes(x);
  } else {
    let _pipe = x;
    let _pipe$1 = identity(_pipe);
    let _pipe$2 = split(_pipe$1, substring);
    return map(_pipe$2, identity);
  }
}

// build/dev/javascript/gleam_stdlib/gleam/dynamic/decode.mjs
var DecodeError = class extends CustomType {
  constructor(expected, found, path2) {
    super();
    this.expected = expected;
    this.found = found;
    this.path = path2;
  }
};
var Decoder = class extends CustomType {
  constructor(function$) {
    super();
    this.function = function$;
  }
};
function run(data, decoder2) {
  let $ = decoder2.function(data);
  let maybe_invalid_data = $[0];
  let errors = $[1];
  if (errors instanceof Empty) {
    return new Ok(maybe_invalid_data);
  } else {
    return new Error2(errors);
  }
}
function success(data) {
  return new Decoder((_) => {
    return [data, toList([])];
  });
}
function map2(decoder2, transformer) {
  return new Decoder(
    (d) => {
      let $ = decoder2.function(d);
      let data = $[0];
      let errors = $[1];
      return [transformer(data), errors];
    }
  );
}
function run_decoders(loop$data, loop$failure, loop$decoders) {
  while (true) {
    let data = loop$data;
    let failure2 = loop$failure;
    let decoders = loop$decoders;
    if (decoders instanceof Empty) {
      return failure2;
    } else {
      let decoder2 = decoders.head;
      let decoders$1 = decoders.tail;
      let $ = decoder2.function(data);
      let layer = $;
      let errors = $[1];
      if (errors instanceof Empty) {
        return layer;
      } else {
        loop$data = data;
        loop$failure = failure2;
        loop$decoders = decoders$1;
      }
    }
  }
}
function one_of(first, alternatives) {
  return new Decoder(
    (dynamic_data) => {
      let $ = first.function(dynamic_data);
      let layer = $;
      let errors = $[1];
      if (errors instanceof Empty) {
        return layer;
      } else {
        return run_decoders(dynamic_data, layer, alternatives);
      }
    }
  );
}
function run_dynamic_function(data, name2, f) {
  let $ = f(data);
  if ($ instanceof Ok) {
    let data$1 = $[0];
    return [data$1, toList([])];
  } else {
    let zero = $[0];
    return [
      zero,
      toList([new DecodeError(name2, classify_dynamic(data), toList([]))])
    ];
  }
}
function decode_int(data) {
  return run_dynamic_function(data, "Int", int);
}
var int2 = /* @__PURE__ */ new Decoder(decode_int);
function decode_string(data) {
  return run_dynamic_function(data, "String", string2);
}
var string3 = /* @__PURE__ */ new Decoder(decode_string);
function list2(inner) {
  return new Decoder(
    (data) => {
      return list(
        data,
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
function push_path(layer, path2) {
  let decoder2 = one_of(
    string3,
    toList([
      (() => {
        let _pipe = int2;
        return map2(_pipe, to_string);
      })()
    ])
  );
  let path$1 = map(
    path2,
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
      let _record = error;
      return new DecodeError(
        _record.expected,
        _record.found,
        append(path$1, error.path)
      );
    }
  );
  return [layer[0], errors];
}
function index3(loop$path, loop$position, loop$inner, loop$data, loop$handle_miss) {
  while (true) {
    let path2 = loop$path;
    let position = loop$position;
    let inner = loop$inner;
    let data = loop$data;
    let handle_miss = loop$handle_miss;
    if (path2 instanceof Empty) {
      let _pipe = inner(data);
      return push_path(_pipe, reverse(position));
    } else {
      let key3 = path2.head;
      let path$1 = path2.tail;
      let $ = index2(data, key3);
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
          return handle_miss(data, prepend(key3, position));
        }
      } else {
        let kind = $[0];
        let $1 = inner(data);
        let default$ = $1[0];
        let _pipe = [
          default$,
          toList([new DecodeError(kind, classify_dynamic(data), toList([]))])
        ];
        return push_path(_pipe, reverse(position));
      }
    }
  }
}
function subfield(field_path, field_decoder, next) {
  return new Decoder(
    (data) => {
      let $ = index3(
        field_path,
        toList([]),
        field_decoder.function,
        data,
        (data2, position) => {
          let $12 = field_decoder.function(data2);
          let default$ = $12[0];
          let _pipe = [
            default$,
            toList([new DecodeError("Field", "Nothing", toList([]))])
          ];
          return push_path(_pipe, reverse(position));
        }
      );
      let out = $[0];
      let errors1 = $[1];
      let $1 = next(out).function(data);
      let out$1 = $1[0];
      let errors2 = $1[1];
      return [out$1, append(errors1, errors2)];
    }
  );
}
function field(field_name, field_decoder, next) {
  return subfield(toList([field_name]), field_decoder, next);
}

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
var Nil = void 0;
var NOT_FOUND = {};
function identity(x) {
  return x;
}
function to_string(term) {
  return term.toString();
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
function pop_codeunit(str) {
  return [str.charCodeAt(0) | 0, str.slice(1)];
}
function lowercase(string6) {
  return string6.toLowerCase();
}
function split(xs, pattern) {
  return List.fromArray(xs.split(pattern));
}
function concat(xs) {
  let result = "";
  for (const x of xs) {
    result = result + x;
  }
  return result;
}
function string_codeunit_slice(str, from2, length5) {
  return str.slice(from2, from2 + length5);
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
function new_map() {
  return Dict.new();
}
function map_get(map7, key3) {
  const value2 = map7.get(key3, NOT_FOUND);
  if (value2 === NOT_FOUND) {
    return new Error2(Nil);
  }
  return new Ok(value2);
}
function map_insert(key3, value2, map7) {
  return map7.set(key3, value2);
}
function percent_encode(string6) {
  return encodeURIComponent(string6).replace("%2B", "+");
}
function classify_dynamic(data) {
  if (typeof data === "string") {
    return "String";
  } else if (typeof data === "boolean") {
    return "Bool";
  } else if (data instanceof Result) {
    return "Result";
  } else if (data instanceof List) {
    return "List";
  } else if (data instanceof BitArray) {
    return "BitArray";
  } else if (data instanceof Dict) {
    return "Dict";
  } else if (Number.isInteger(data)) {
    return "Int";
  } else if (Array.isArray(data)) {
    return `Array`;
  } else if (typeof data === "number") {
    return "Float";
  } else if (data === null) {
    return "Nil";
  } else if (data === void 0) {
    return "Nil";
  } else {
    const type = typeof data;
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
function float_to_string(float2) {
  const string6 = float2.toString().replace("+", "");
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
function index2(data, key3) {
  if (data instanceof Dict || data instanceof WeakMap || data instanceof Map) {
    const token2 = {};
    const entry = data.get(key3, token2);
    if (entry === token2) return new Ok(new None());
    return new Ok(new Some(entry));
  }
  const key_is_int = Number.isInteger(key3);
  if (key_is_int && key3 >= 0 && key3 < 8 && data instanceof List) {
    let i2 = 0;
    for (const value2 of data) {
      if (i2 === key3) return new Ok(new Some(value2));
      i2++;
    }
    return new Error2("Indexable");
  }
  if (key_is_int && Array.isArray(data) || data && typeof data === "object" || data && Object.getPrototypeOf(data) === Object.prototype) {
    if (key3 in data) return new Ok(new Some(data[key3]));
    return new Ok(new None());
  }
  return new Error2(key_is_int ? "Indexable" : "Dict");
}
function list(data, decode2, pushPath, index5, emptyList) {
  if (!(data instanceof List || Array.isArray(data))) {
    const error = new DecodeError("List", classify_dynamic(data), emptyList);
    return [emptyList, List.fromArray([error])];
  }
  const decoded = [];
  for (const element6 of data) {
    const layer = decode2(element6);
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
function int(data) {
  if (Number.isInteger(data)) return new Ok(data);
  return new Error2(0);
}
function string2(data) {
  if (typeof data === "string") return new Ok(data);
  return new Error2("");
}

// build/dev/javascript/gleam_stdlib/gleam/result.mjs
function is_ok(result) {
  if (result instanceof Ok) {
    return true;
  } else {
    return false;
  }
}
function map3(result, fun) {
  if (result instanceof Ok) {
    let x = result[0];
    return new Ok(fun(x));
  } else {
    let e = result[0];
    return new Error2(e);
  }
}
function map_error(result, fun) {
  if (result instanceof Ok) {
    let x = result[0];
    return new Ok(x);
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
    let e = result[0];
    return new Error2(e);
  }
}
function values2(results) {
  return filter_map(results, (result) => {
    return result;
  });
}

// build/dev/javascript/gleam_stdlib/gleam/uri.mjs
var Uri = class extends CustomType {
  constructor(scheme, userinfo, host, port, path2, query, fragment3) {
    super();
    this.scheme = scheme;
    this.userinfo = userinfo;
    this.host = host;
    this.port = port;
    this.path = path2;
    this.query = query;
    this.fragment = fragment3;
  }
};
function is_valid_host_within_brackets_char(char) {
  return 48 >= char && char <= 57 || 65 >= char && char <= 90 || 97 >= char && char <= 122 || char === 58 || char === 46;
}
function parse_fragment(rest, pieces) {
  return new Ok(
    (() => {
      let _record = pieces;
      return new Uri(
        _record.scheme,
        _record.userinfo,
        _record.host,
        _record.port,
        _record.path,
        _record.query,
        new Some(rest)
      );
    })()
  );
}
function parse_query_with_question_mark_loop(loop$original, loop$uri_string, loop$pieces, loop$size) {
  while (true) {
    let original = loop$original;
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let size2 = loop$size;
    if (uri_string.startsWith("#")) {
      if (size2 === 0) {
        let rest = uri_string.slice(1);
        return parse_fragment(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let query = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          _record.scheme,
          _record.userinfo,
          _record.host,
          _record.port,
          _record.path,
          new Some(query),
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_fragment(rest, pieces$1);
      }
    } else if (uri_string === "") {
      return new Ok(
        (() => {
          let _record = pieces;
          return new Uri(
            _record.scheme,
            _record.userinfo,
            _record.host,
            _record.port,
            _record.path,
            new Some(original),
            _record.fragment
          );
        })()
      );
    } else {
      let $ = pop_codeunit(uri_string);
      let rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size2 + 1;
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
    let size2 = loop$size;
    if (uri_string.startsWith("?")) {
      let rest = uri_string.slice(1);
      let path2 = string_codeunit_slice(original, 0, size2);
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        _record.host,
        _record.port,
        path2,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_query_with_question_mark(rest, pieces$1);
    } else if (uri_string.startsWith("#")) {
      let rest = uri_string.slice(1);
      let path2 = string_codeunit_slice(original, 0, size2);
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        _record.host,
        _record.port,
        path2,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_fragment(rest, pieces$1);
    } else if (uri_string === "") {
      return new Ok(
        (() => {
          let _record = pieces;
          return new Uri(
            _record.scheme,
            _record.userinfo,
            _record.host,
            _record.port,
            original,
            _record.query,
            _record.fragment
          );
        })()
      );
    } else {
      let $ = pop_codeunit(uri_string);
      let rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size2 + 1;
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
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        _record.host,
        new Some(port),
        _record.path,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_query_with_question_mark(rest, pieces$1);
    } else if (uri_string.startsWith("#")) {
      let rest = uri_string.slice(1);
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        _record.host,
        new Some(port),
        _record.path,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_fragment(rest, pieces$1);
    } else if (uri_string.startsWith("/")) {
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        _record.host,
        new Some(port),
        _record.path,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_path(uri_string, pieces$1);
    } else if (uri_string === "") {
      return new Ok(
        (() => {
          let _record = pieces;
          return new Uri(
            _record.scheme,
            _record.userinfo,
            _record.host,
            new Some(port),
            _record.path,
            _record.query,
            _record.fragment
          );
        })()
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
    let size2 = loop$size;
    if (uri_string === "") {
      return new Ok(
        (() => {
          let _record = pieces;
          return new Uri(
            _record.scheme,
            _record.userinfo,
            new Some(original),
            _record.port,
            _record.path,
            _record.query,
            _record.fragment
          );
        })()
      );
    } else if (uri_string.startsWith(":")) {
      let host = string_codeunit_slice(original, 0, size2);
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        new Some(host),
        _record.port,
        _record.path,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_port(uri_string, pieces$1);
    } else if (uri_string.startsWith("/")) {
      let host = string_codeunit_slice(original, 0, size2);
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        new Some(host),
        _record.port,
        _record.path,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_path(uri_string, pieces$1);
    } else if (uri_string.startsWith("?")) {
      let rest = uri_string.slice(1);
      let host = string_codeunit_slice(original, 0, size2);
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        new Some(host),
        _record.port,
        _record.path,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_query_with_question_mark(rest, pieces$1);
    } else if (uri_string.startsWith("#")) {
      let rest = uri_string.slice(1);
      let host = string_codeunit_slice(original, 0, size2);
      let _block;
      let _record = pieces;
      _block = new Uri(
        _record.scheme,
        _record.userinfo,
        new Some(host),
        _record.port,
        _record.path,
        _record.query,
        _record.fragment
      );
      let pieces$1 = _block;
      return parse_fragment(rest, pieces$1);
    } else {
      let $ = pop_codeunit(uri_string);
      let rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size2 + 1;
    }
  }
}
function parse_host_within_brackets_loop(loop$original, loop$uri_string, loop$pieces, loop$size) {
  while (true) {
    let original = loop$original;
    let uri_string = loop$uri_string;
    let pieces = loop$pieces;
    let size2 = loop$size;
    if (uri_string === "") {
      return new Ok(
        (() => {
          let _record = pieces;
          return new Uri(
            _record.scheme,
            _record.userinfo,
            new Some(uri_string),
            _record.port,
            _record.path,
            _record.query,
            _record.fragment
          );
        })()
      );
    } else if (uri_string.startsWith("]")) {
      if (size2 === 0) {
        let rest = uri_string.slice(1);
        return parse_port(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let host = string_codeunit_slice(original, 0, size2 + 1);
        let _block;
        let _record = pieces;
        _block = new Uri(
          _record.scheme,
          _record.userinfo,
          new Some(host),
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_port(rest, pieces$1);
      }
    } else if (uri_string.startsWith("/")) {
      if (size2 === 0) {
        return parse_path(uri_string, pieces);
      } else {
        let host = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          _record.scheme,
          _record.userinfo,
          new Some(host),
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_path(uri_string, pieces$1);
      }
    } else if (uri_string.startsWith("?")) {
      if (size2 === 0) {
        let rest = uri_string.slice(1);
        return parse_query_with_question_mark(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let host = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          _record.scheme,
          _record.userinfo,
          new Some(host),
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_query_with_question_mark(rest, pieces$1);
      }
    } else if (uri_string.startsWith("#")) {
      if (size2 === 0) {
        let rest = uri_string.slice(1);
        return parse_fragment(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let host = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          _record.scheme,
          _record.userinfo,
          new Some(host),
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_fragment(rest, pieces$1);
      }
    } else {
      let $ = pop_codeunit(uri_string);
      let char = $[0];
      let rest = $[1];
      let $1 = is_valid_host_within_brackets_char(char);
      if ($1) {
        loop$original = original;
        loop$uri_string = rest;
        loop$pieces = pieces;
        loop$size = size2 + 1;
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
    let _block;
    let _record = pieces;
    _block = new Uri(
      _record.scheme,
      _record.userinfo,
      new Some(""),
      _record.port,
      _record.path,
      _record.query,
      _record.fragment
    );
    let pieces$1 = _block;
    return parse_port(uri_string, pieces$1);
  } else if (uri_string === "") {
    return new Ok(
      (() => {
        let _record = pieces;
        return new Uri(
          _record.scheme,
          _record.userinfo,
          new Some(""),
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
      })()
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
    let size2 = loop$size;
    if (uri_string.startsWith("@")) {
      if (size2 === 0) {
        let rest = uri_string.slice(1);
        return parse_host(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let userinfo = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          _record.scheme,
          new Some(userinfo),
          _record.host,
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
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
      let rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size2 + 1;
    }
  }
}
function parse_authority_pieces(string6, pieces) {
  return parse_userinfo_loop(string6, string6, pieces, 0);
}
function parse_authority_with_slashes(uri_string, pieces) {
  if (uri_string === "//") {
    return new Ok(
      (() => {
        let _record = pieces;
        return new Uri(
          _record.scheme,
          _record.userinfo,
          new Some(""),
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
      })()
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
    let size2 = loop$size;
    if (uri_string.startsWith("/")) {
      if (size2 === 0) {
        return parse_authority_with_slashes(uri_string, pieces);
      } else {
        let scheme = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          new Some(lowercase(scheme)),
          _record.userinfo,
          _record.host,
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_authority_with_slashes(uri_string, pieces$1);
      }
    } else if (uri_string.startsWith("?")) {
      if (size2 === 0) {
        let rest = uri_string.slice(1);
        return parse_query_with_question_mark(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let scheme = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          new Some(lowercase(scheme)),
          _record.userinfo,
          _record.host,
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_query_with_question_mark(rest, pieces$1);
      }
    } else if (uri_string.startsWith("#")) {
      if (size2 === 0) {
        let rest = uri_string.slice(1);
        return parse_fragment(rest, pieces);
      } else {
        let rest = uri_string.slice(1);
        let scheme = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          new Some(lowercase(scheme)),
          _record.userinfo,
          _record.host,
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_fragment(rest, pieces$1);
      }
    } else if (uri_string.startsWith(":")) {
      if (size2 === 0) {
        return new Error2(void 0);
      } else {
        let rest = uri_string.slice(1);
        let scheme = string_codeunit_slice(original, 0, size2);
        let _block;
        let _record = pieces;
        _block = new Uri(
          new Some(lowercase(scheme)),
          _record.userinfo,
          _record.host,
          _record.port,
          _record.path,
          _record.query,
          _record.fragment
        );
        let pieces$1 = _block;
        return parse_authority_with_slashes(rest, pieces$1);
      }
    } else if (uri_string === "") {
      return new Ok(
        (() => {
          let _record = pieces;
          return new Uri(
            _record.scheme,
            _record.userinfo,
            _record.host,
            _record.port,
            original,
            _record.query,
            _record.fragment
          );
        })()
      );
    } else {
      let $ = pop_codeunit(uri_string);
      let rest = $[1];
      loop$original = original;
      loop$uri_string = rest;
      loop$pieces = pieces;
      loop$size = size2 + 1;
    }
  }
}
function query_pair(pair) {
  return concat(
    toList([percent_encode(pair[0]), "=", percent_encode(pair[1])])
  );
}
function query_to_string(query) {
  let _pipe = query;
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
        let accumulator$12 = accumulator;
        _block = accumulator$12;
      } else if (segment === ".") {
        let accumulator$12 = accumulator;
        _block = accumulator$12;
      } else if (segment === "..") {
        if (accumulator instanceof Empty) {
          _block = toList([]);
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
function to_string2(uri) {
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
    let query = $1[0];
    _block$1 = prepend("?", prepend(query, parts));
  } else {
    _block$1 = parts;
  }
  let parts$1 = _block$1;
  let parts$2 = prepend(uri.path, parts$1);
  let _block$2;
  let $2 = uri.host;
  let $3 = starts_with(uri.path, "/");
  if (!$3) {
    if ($2 instanceof Some) {
      let host = $2[0];
      if (host !== "") {
        _block$2 = prepend("/", parts$2);
      } else {
        _block$2 = parts$2;
      }
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
  if ($5 instanceof Some) {
    if ($4 instanceof Some) {
      let port = $5[0];
      _block$3 = prepend(":", prepend(to_string(port), parts$3));
    } else {
      _block$3 = parts$3;
    }
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
function merge(base, relative) {
  let $ = base.host;
  if ($ instanceof Some) {
    let $1 = base.scheme;
    if ($1 instanceof Some) {
      let $2 = relative.host;
      if ($2 instanceof Some) {
        let _block;
        let _pipe = split2(relative.path, "/");
        let _pipe$1 = remove_dot_segments(_pipe);
        _block = join_segments(_pipe$1);
        let path2 = _block;
        let resolved = new Uri(
          or(relative.scheme, base.scheme),
          new None(),
          relative.host,
          or(relative.port, base.port),
          path2,
          relative.query,
          relative.fragment
        );
        return new Ok(resolved);
      } else {
        let _block;
        let $4 = relative.path;
        if ($4 === "") {
          _block = [base.path, or(relative.query, base.query)];
        } else {
          let _block$1;
          let $5 = starts_with(relative.path, "/");
          if ($5) {
            _block$1 = split2(relative.path, "/");
          } else {
            let _pipe2 = split2(base.path, "/");
            let _pipe$12 = drop_last(_pipe2);
            _block$1 = append(_pipe$12, split2(relative.path, "/"));
          }
          let path_segments$1 = _block$1;
          let _block$2;
          let _pipe = path_segments$1;
          let _pipe$1 = remove_dot_segments(_pipe);
          _block$2 = join_segments(_pipe$1);
          let path2 = _block$2;
          _block = [path2, relative.query];
        }
        let $3 = _block;
        let new_path = $3[0];
        let new_query = $3[1];
        let resolved = new Uri(
          base.scheme,
          new None(),
          base.host,
          base.port,
          new_path,
          new_query,
          relative.fragment
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

// build/dev/javascript/gleam_json/gleam_json_ffi.mjs
function json_to_string(json2) {
  return JSON.stringify(json2);
}
function object(entries) {
  return Object.fromEntries(entries);
}
function identity2(x) {
  return x;
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
function to_string3(json2) {
  return json_to_string(json2);
}
function string4(input2) {
  return identity2(input2);
}
function object2(entries) {
  return object(entries);
}

// build/dev/javascript/gleam_stdlib/gleam/set.mjs
var Set2 = class extends CustomType {
  constructor(dict2) {
    super();
    this.dict = dict2;
  }
};
function new$() {
  return new Set2(new_map());
}
function contains(set2, member) {
  let _pipe = set2.dict;
  let _pipe$1 = map_get(_pipe, member);
  return is_ok(_pipe$1);
}
var token = void 0;
function insert2(set2, member) {
  return new Set2(insert(set2.dict, member, token));
}

// build/dev/javascript/lustre/lustre/internals/constants.ffi.mjs
var EMPTY_DICT = /* @__PURE__ */ Dict.new();
var EMPTY_SET = /* @__PURE__ */ new$();
var empty_dict = () => EMPTY_DICT;
var empty_set = () => EMPTY_SET;
var document2 = () => globalThis?.document;
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var DOCUMENT_FRAGMENT_NODE = 11;
var SUPPORTS_MOVE_BEFORE = !!globalThis.HTMLElement?.prototype?.moveBefore;

// build/dev/javascript/lustre/lustre/internals/constants.mjs
var empty_list = /* @__PURE__ */ toList([]);
var option_none = /* @__PURE__ */ new None();

// build/dev/javascript/lustre/lustre/vdom/vattr.ffi.mjs
var GT = /* @__PURE__ */ new Gt();
var LT = /* @__PURE__ */ new Lt();
var EQ = /* @__PURE__ */ new Eq();
function compare3(a2, b) {
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
  constructor(kind, name2, value2) {
    super();
    this.kind = kind;
    this.name = name2;
    this.value = value2;
  }
};
var Property = class extends CustomType {
  constructor(kind, name2, value2) {
    super();
    this.kind = kind;
    this.name = name2;
    this.value = value2;
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
                  let value2 = class1 + " " + class2;
                  let attribute$1 = new Attribute(kind, "class", value2);
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
                  let value2 = style1 + ";" + style2;
                  let attribute$1 = new Attribute(kind, "style", value2);
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
        return compare3(b, a2);
      });
      return merge2(_pipe$1, empty_list);
    }
  }
}
var attribute_kind = 0;
function attribute(name2, value2) {
  return new Attribute(attribute_kind, name2, value2);
}
var property_kind = 1;
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
function attribute2(name2, value2) {
  return attribute(name2, value2);
}
function class$(name2) {
  return attribute2("class", name2);
}
function style(property3, value2) {
  if (property3 === "") {
    return class$("");
  } else if (value2 === "") {
    return class$("");
  } else {
    return attribute2("style", property3 + ":" + value2 + ";");
  }
}
function href(url) {
  return attribute2("href", url);
}
function src(url) {
  return attribute2("src", url);
}
function name(element_name) {
  return attribute2("name", element_name);
}
function type_(control_type) {
  return attribute2("type", control_type);
}

// build/dev/javascript/gleam_stdlib/gleam/function.mjs
function identity3(x) {
  return x;
}

// build/dev/javascript/lustre/lustre/internals/mutable_map.ffi.mjs
function empty2() {
  return null;
}
function get(map7, key3) {
  const value2 = map7?.get(key3);
  if (value2 != null) {
    return new Ok(value2);
  } else {
    return new Error2(void 0);
  }
}
function insert3(map7, key3, value2) {
  map7 ??= /* @__PURE__ */ new Map();
  map7.set(key3, value2);
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
    let path2 = loop$path;
    let candidates = loop$candidates;
    if (candidates instanceof Empty) {
      return false;
    } else {
      let candidate = candidates.head;
      let rest = candidates.tail;
      let $ = starts_with(path2, candidate);
      if ($) {
        return true;
      } else {
        loop$path = path2;
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
    let path2 = loop$path;
    let acc = loop$acc;
    if (path2 instanceof Root) {
      if (acc instanceof Empty) {
        return "";
      } else {
        let segments = acc.tail;
        return concat2(segments);
      }
    } else if (path2 instanceof Key) {
      let key3 = path2.key;
      let parent = path2.parent;
      loop$path = parent;
      loop$acc = prepend(separator_element, prepend(key3, acc));
    } else {
      let index5 = path2.index;
      let parent = path2.parent;
      loop$path = parent;
      loop$acc = prepend(
        separator_element,
        prepend(to_string(index5), acc)
      );
    }
  }
}
function to_string4(path2) {
  return do_to_string(path2, toList([]));
}
function matches(path2, candidates) {
  if (candidates instanceof Empty) {
    return false;
  } else {
    return do_matches(to_string4(path2), candidates);
  }
}
var separator_event = "\n";
function event2(path2, event4) {
  return do_to_string(path2, toList([separator_event, event4]));
}

// build/dev/javascript/lustre/lustre/vdom/vnode.mjs
var Fragment = class extends CustomType {
  constructor(kind, key3, mapper, children, keyed_children, children_count) {
    super();
    this.kind = kind;
    this.key = key3;
    this.mapper = mapper;
    this.children = children;
    this.keyed_children = keyed_children;
    this.children_count = children_count;
  }
};
var Element2 = class extends CustomType {
  constructor(kind, key3, mapper, namespace2, tag2, attributes, children, keyed_children, self_closing, void$) {
    super();
    this.kind = kind;
    this.key = key3;
    this.mapper = mapper;
    this.namespace = namespace2;
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
  constructor(kind, key3, mapper, namespace2, tag2, attributes, inner_html) {
    super();
    this.kind = kind;
    this.key = key3;
    this.mapper = mapper;
    this.namespace = namespace2;
    this.tag = tag2;
    this.attributes = attributes;
    this.inner_html = inner_html;
  }
};
function is_void_element(tag2, namespace2) {
  if (namespace2 === "") {
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
function advance(node) {
  if (node instanceof Fragment) {
    let children_count = node.children_count;
    return 1 + children_count;
  } else {
    return 1;
  }
}
var fragment_kind = 0;
function fragment(key3, mapper, children, keyed_children, children_count) {
  return new Fragment(
    fragment_kind,
    key3,
    mapper,
    children,
    keyed_children,
    children_count
  );
}
var element_kind = 1;
function element(key3, mapper, namespace2, tag2, attributes, children, keyed_children, self_closing, void$) {
  return new Element2(
    element_kind,
    key3,
    mapper,
    namespace2,
    tag2,
    prepare(attributes),
    children,
    keyed_children,
    self_closing,
    void$ || is_void_element(tag2, namespace2)
  );
}
var text_kind = 2;
function text(key3, mapper, content) {
  return new Text(text_kind, key3, mapper, content);
}
var unsafe_inner_html_kind = 3;
function set_fragment_key(loop$key, loop$children, loop$index, loop$new_children, loop$keyed_children) {
  while (true) {
    let key3 = loop$key;
    let children = loop$children;
    let index5 = loop$index;
    let new_children = loop$new_children;
    let keyed_children = loop$keyed_children;
    if (children instanceof Empty) {
      return [reverse(new_children), keyed_children];
    } else {
      let $ = children.head;
      if ($ instanceof Fragment) {
        let node = $;
        if (node.key === "") {
          let children$1 = children.tail;
          let child_key = key3 + "::" + to_string(index5);
          let $1 = set_fragment_key(
            child_key,
            node.children,
            0,
            empty_list,
            empty2()
          );
          let node_children = $1[0];
          let node_keyed_children = $1[1];
          let _block;
          let _record = node;
          _block = new Fragment(
            _record.kind,
            _record.key,
            _record.mapper,
            node_children,
            node_keyed_children,
            _record.children_count
          );
          let new_node = _block;
          let new_children$1 = prepend(new_node, new_children);
          let index$1 = index5 + 1;
          loop$key = key3;
          loop$children = children$1;
          loop$index = index$1;
          loop$new_children = new_children$1;
          loop$keyed_children = keyed_children;
        } else {
          let node$1 = $;
          if (node$1.key !== "") {
            let children$1 = children.tail;
            let child_key = key3 + "::" + node$1.key;
            let keyed_node = to_keyed(child_key, node$1);
            let new_children$1 = prepend(keyed_node, new_children);
            let keyed_children$1 = insert3(
              keyed_children,
              child_key,
              keyed_node
            );
            let index$1 = index5 + 1;
            loop$key = key3;
            loop$children = children$1;
            loop$index = index$1;
            loop$new_children = new_children$1;
            loop$keyed_children = keyed_children$1;
          } else {
            let node$2 = $;
            let children$1 = children.tail;
            let new_children$1 = prepend(node$2, new_children);
            let index$1 = index5 + 1;
            loop$key = key3;
            loop$children = children$1;
            loop$index = index$1;
            loop$new_children = new_children$1;
            loop$keyed_children = keyed_children;
          }
        }
      } else {
        let node = $;
        if (node.key !== "") {
          let children$1 = children.tail;
          let child_key = key3 + "::" + node.key;
          let keyed_node = to_keyed(child_key, node);
          let new_children$1 = prepend(keyed_node, new_children);
          let keyed_children$1 = insert3(
            keyed_children,
            child_key,
            keyed_node
          );
          let index$1 = index5 + 1;
          loop$key = key3;
          loop$children = children$1;
          loop$index = index$1;
          loop$new_children = new_children$1;
          loop$keyed_children = keyed_children$1;
        } else {
          let node$1 = $;
          let children$1 = children.tail;
          let new_children$1 = prepend(node$1, new_children);
          let index$1 = index5 + 1;
          loop$key = key3;
          loop$children = children$1;
          loop$index = index$1;
          loop$new_children = new_children$1;
          loop$keyed_children = keyed_children;
        }
      }
    }
  }
}
function to_keyed(key3, node) {
  if (node instanceof Fragment) {
    let children = node.children;
    let $ = set_fragment_key(
      key3,
      children,
      0,
      empty_list,
      empty2()
    );
    let children$1 = $[0];
    let keyed_children = $[1];
    let _record = node;
    return new Fragment(
      _record.kind,
      key3,
      _record.mapper,
      children$1,
      keyed_children,
      _record.children_count
    );
  } else if (node instanceof Element2) {
    let _record = node;
    return new Element2(
      _record.kind,
      key3,
      _record.mapper,
      _record.namespace,
      _record.tag,
      _record.attributes,
      _record.children,
      _record.keyed_children,
      _record.self_closing,
      _record.void
    );
  } else if (node instanceof Text) {
    let _record = node;
    return new Text(_record.kind, key3, _record.mapper, _record.content);
  } else {
    let _record = node;
    return new UnsafeInnerHtml(
      _record.kind,
      key3,
      _record.mapper,
      _record.namespace,
      _record.tag,
      _record.attributes,
      _record.inner_html
    );
  }
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
function new$3() {
  return new Events(
    empty2(),
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
function do_remove_event(handlers, path2, name2) {
  return remove(handlers, event2(path2, name2));
}
function remove_event(events, path2, name2) {
  let handlers = do_remove_event(events.handlers, path2, name2);
  let _record = events;
  return new Events(
    handlers,
    _record.dispatched_paths,
    _record.next_dispatched_paths
  );
}
function remove_attributes(handlers, path2, attributes) {
  return fold(
    attributes,
    handlers,
    (events, attribute3) => {
      if (attribute3 instanceof Event2) {
        let name2 = attribute3.name;
        return do_remove_event(events, path2, name2);
      } else {
        return events;
      }
    }
  );
}
function handle(events, path2, name2, event4) {
  let next_dispatched_paths = prepend(path2, events.next_dispatched_paths);
  let _block;
  let _record = events;
  _block = new Events(
    _record.handlers,
    _record.dispatched_paths,
    next_dispatched_paths
  );
  let events$1 = _block;
  let $ = get(
    events$1.handlers,
    path2 + separator_event + name2
  );
  if ($ instanceof Ok) {
    let handler = $[0];
    return [events$1, run(event4, handler)];
  } else {
    return [events$1, new Error2(toList([]))];
  }
}
function has_dispatched_events(events, path2) {
  return matches(path2, events.dispatched_paths);
}
function do_add_event(handlers, mapper, path2, name2, handler) {
  return insert3(
    handlers,
    event2(path2, name2),
    map2(
      handler,
      (handler2) => {
        let _record = handler2;
        return new Handler(
          _record.prevent_default,
          _record.stop_propagation,
          identity3(mapper)(handler2.message)
        );
      }
    )
  );
}
function add_event(events, mapper, path2, name2, handler) {
  let handlers = do_add_event(events.handlers, mapper, path2, name2, handler);
  let _record = events;
  return new Events(
    handlers,
    _record.dispatched_paths,
    _record.next_dispatched_paths
  );
}
function add_attributes(handlers, mapper, path2, attributes) {
  return fold(
    attributes,
    handlers,
    (events, attribute3) => {
      if (attribute3 instanceof Event2) {
        let name2 = attribute3.name;
        let handler = attribute3.handler;
        return do_add_event(events, mapper, path2, name2, handler);
      } else {
        return events;
      }
    }
  );
}
function compose_mapper(mapper, child_mapper) {
  let $ = isReferenceEqual(mapper, identity3);
  let $1 = isReferenceEqual(child_mapper, identity3);
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
    let path2 = loop$path;
    let child_index = loop$child_index;
    let children = loop$children;
    if (children instanceof Empty) {
      return handlers;
    } else {
      let child = children.head;
      let rest = children.tail;
      let _pipe = handlers;
      let _pipe$1 = do_remove_child(_pipe, path2, child_index, child);
      loop$handlers = _pipe$1;
      loop$path = path2;
      loop$child_index = child_index + advance(child);
      loop$children = rest;
    }
  }
}
function do_remove_child(handlers, parent, child_index, child) {
  if (child instanceof Fragment) {
    let children = child.children;
    return do_remove_children(handlers, parent, child_index + 1, children);
  } else if (child instanceof Element2) {
    let attributes = child.attributes;
    let children = child.children;
    let path2 = add2(parent, child_index, child.key);
    let _pipe = handlers;
    let _pipe$1 = remove_attributes(_pipe, path2, attributes);
    return do_remove_children(_pipe$1, path2, 0, children);
  } else if (child instanceof Text) {
    return handlers;
  } else {
    let attributes = child.attributes;
    let path2 = add2(parent, child_index, child.key);
    return remove_attributes(handlers, path2, attributes);
  }
}
function remove_child(events, parent, child_index, child) {
  let handlers = do_remove_child(events.handlers, parent, child_index, child);
  let _record = events;
  return new Events(
    handlers,
    _record.dispatched_paths,
    _record.next_dispatched_paths
  );
}
function do_add_children(loop$handlers, loop$mapper, loop$path, loop$child_index, loop$children) {
  while (true) {
    let handlers = loop$handlers;
    let mapper = loop$mapper;
    let path2 = loop$path;
    let child_index = loop$child_index;
    let children = loop$children;
    if (children instanceof Empty) {
      return handlers;
    } else {
      let child = children.head;
      let rest = children.tail;
      let _pipe = handlers;
      let _pipe$1 = do_add_child(_pipe, mapper, path2, child_index, child);
      loop$handlers = _pipe$1;
      loop$mapper = mapper;
      loop$path = path2;
      loop$child_index = child_index + advance(child);
      loop$children = rest;
    }
  }
}
function do_add_child(handlers, mapper, parent, child_index, child) {
  if (child instanceof Fragment) {
    let children = child.children;
    let composed_mapper = compose_mapper(mapper, child.mapper);
    let child_index$1 = child_index + 1;
    return do_add_children(
      handlers,
      composed_mapper,
      parent,
      child_index$1,
      children
    );
  } else if (child instanceof Element2) {
    let attributes = child.attributes;
    let children = child.children;
    let path2 = add2(parent, child_index, child.key);
    let composed_mapper = compose_mapper(mapper, child.mapper);
    let _pipe = handlers;
    let _pipe$1 = add_attributes(_pipe, composed_mapper, path2, attributes);
    return do_add_children(_pipe$1, composed_mapper, path2, 0, children);
  } else if (child instanceof Text) {
    return handlers;
  } else {
    let attributes = child.attributes;
    let path2 = add2(parent, child_index, child.key);
    let composed_mapper = compose_mapper(mapper, child.mapper);
    return add_attributes(handlers, composed_mapper, path2, attributes);
  }
}
function add_child(events, mapper, parent, index5, child) {
  let handlers = do_add_child(events.handlers, mapper, parent, index5, child);
  let _record = events;
  return new Events(
    handlers,
    _record.dispatched_paths,
    _record.next_dispatched_paths
  );
}
function add_children(events, mapper, path2, child_index, children) {
  let handlers = do_add_children(
    events.handlers,
    mapper,
    path2,
    child_index,
    children
  );
  let _record = events;
  return new Events(
    handlers,
    _record.dispatched_paths,
    _record.next_dispatched_paths
  );
}

// build/dev/javascript/lustre/lustre/element.mjs
function element2(tag2, attributes, children) {
  return element(
    "",
    identity3,
    "",
    tag2,
    attributes,
    children,
    empty2(),
    false,
    false
  );
}
function namespaced(namespace2, tag2, attributes, children) {
  return element(
    "",
    identity3,
    namespace2,
    tag2,
    attributes,
    children,
    empty2(),
    false,
    false
  );
}
function text2(content) {
  return text("", identity3, content);
}
function none() {
  return text("", identity3, "");
}
function count_fragment_children(loop$children, loop$count) {
  while (true) {
    let children = loop$children;
    let count = loop$count;
    if (children instanceof Empty) {
      return count;
    } else {
      let child = children.head;
      let rest = children.tail;
      loop$children = rest;
      loop$count = count + advance(child);
    }
  }
}
function fragment2(children) {
  return fragment(
    "",
    identity3,
    children,
    empty2(),
    count_fragment_children(children, 0)
  );
}

// build/dev/javascript/lustre/lustre/element/svg.mjs
var namespace = "http://www.w3.org/2000/svg";
function svg(attrs, children) {
  return namespaced(namespace, "svg", attrs, children);
}
function path(attrs) {
  return namespaced(namespace, "path", attrs, empty_list);
}

// build/dev/javascript/gleroglero/gleroglero/mini.mjs
function home() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("fill", "currentColor"),
      attribute2("viewBox", "0 0 20 20"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2("clip-rule", "evenodd"),
          attribute2(
            "d",
            "M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
          ),
          attribute2("fill-rule", "evenodd")
        ])
      )
    ])
  );
}

// build/dev/javascript/gleroglero/gleroglero/outline.mjs
function arrow_down_tray() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function arrows_right_left() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function ellipsis_horizontal() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function ellipsis_vertical() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function heart() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function home2() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function link() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function magnifying_glass() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function plus_circle() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2("d", "M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function queue_list() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function sparkles() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}
function user() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("stroke", "currentColor"),
      attribute2("stroke-width", "1.5"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("fill", "none"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          ),
          attribute2("stroke-linejoin", "round"),
          attribute2("stroke-linecap", "round")
        ])
      )
    ])
  );
}

// build/dev/javascript/gleroglero/gleroglero/solid.mjs
function ellipsis_horizontal2() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("fill", "currentColor"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2("clip-rule", "evenodd"),
          attribute2(
            "d",
            "M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
          ),
          attribute2("fill-rule", "evenodd")
        ])
      )
    ])
  );
}
function magnifying_glass_circle() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("fill", "currentColor"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z"
          )
        ])
      ),
      path(
        toList([
          attribute2("clip-rule", "evenodd"),
          attribute2(
            "d",
            "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
          ),
          attribute2("fill-rule", "evenodd")
        ])
      )
    ])
  );
}
function musical_note() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("fill", "currentColor"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2("clip-rule", "evenodd"),
          attribute2(
            "d",
            "M19.952 1.651a.75.75 0 0 1 .298.599V16.303a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.403-4.909l2.311-.66a1.5 1.5 0 0 0 1.088-1.442V6.994l-9 2.572v9.737a3 3 0 0 1-2.176 2.884l-1.32.377a2.553 2.553 0 1 1-1.402-4.909l2.31-.66a1.5 1.5 0 0 0 1.088-1.442V5.25a.75.75 0 0 1 .544-.721l10.5-3a.75.75 0 0 1 .658.122Z"
          ),
          attribute2("fill-rule", "evenodd")
        ])
      )
    ])
  );
}
function play_circle() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("fill", "currentColor"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2("clip-rule", "evenodd"),
          attribute2(
            "d",
            "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
          ),
          attribute2("fill-rule", "evenodd")
        ])
      )
    ])
  );
}
function queue_list2() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("fill", "currentColor"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2(
            "d",
            "M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z"
          )
        ])
      )
    ])
  );
}
function sparkles2() {
  return svg(
    toList([
      attribute2("data-slot", "icon"),
      attribute2("aria-hidden", "true"),
      attribute2("fill", "currentColor"),
      attribute2("viewBox", "0 0 24 24"),
      attribute2("xmlns", "http://www.w3.org/2000/svg")
    ]),
    toList([
      path(
        toList([
          attribute2("clip-rule", "evenodd"),
          attribute2(
            "d",
            "M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
          ),
          attribute2("fill-rule", "evenodd")
        ])
      )
    ])
  );
}

// build/dev/javascript/gleam_stdlib/gleam/bool.mjs
function guard(requirement, consequence, alternative) {
  if (requirement) {
    return consequence;
  } else {
    return alternative();
  }
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
  constructor(dispatch, emit, select, root3) {
    super();
    this.dispatch = dispatch;
    this.emit = emit;
    this.select = select;
    this.root = root3;
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
    actions.root
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
var empty3 = /* @__PURE__ */ new Effect(
  /* @__PURE__ */ toList([]),
  /* @__PURE__ */ toList([]),
  /* @__PURE__ */ toList([])
);
function none2() {
  return empty3;
}
function from(effect) {
  let task = (actions) => {
    let dispatch = actions.dispatch;
    return effect(dispatch);
  };
  let _record = empty3;
  return new Effect(toList([task]), _record.before_paint, _record.after_paint);
}

// build/dev/javascript/lustre/lustre/element/html.mjs
function h1(attrs, children) {
  return element2("h1", attrs, children);
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
  constructor(kind, key3, before, count) {
    super();
    this.kind = kind;
    this.key = key3;
    this.before = before;
    this.count = count;
  }
};
var RemoveKey = class extends CustomType {
  constructor(kind, key3, count) {
    super();
    this.kind = kind;
    this.key = key3;
    this.count = count;
  }
};
var Replace = class extends CustomType {
  constructor(kind, from2, count, with$) {
    super();
    this.kind = kind;
    this.from = from2;
    this.count = count;
    this.with = with$;
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
var Remove = class extends CustomType {
  constructor(kind, from2, count) {
    super();
    this.kind = kind;
    this.from = from2;
    this.count = count;
  }
};
function new$5(index5, removed, changes, children) {
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
function move(key3, before, count) {
  return new Move(move_kind, key3, before, count);
}
var remove_key_kind = 4;
function remove_key(key3, count) {
  return new RemoveKey(remove_key_kind, key3, count);
}
var replace_kind = 5;
function replace2(from2, count, with$) {
  return new Replace(replace_kind, from2, count, with$);
}
var insert_kind = 6;
function insert4(children, before) {
  return new Insert(insert_kind, children, before);
}
var remove_kind = 7;
function remove2(from2, count) {
  return new Remove(remove_kind, from2, count);
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
function is_controlled(events, namespace2, tag2, path2) {
  if (tag2 === "input") {
    if (namespace2 === "") {
      return has_dispatched_events(events, path2);
    } else {
      return false;
    }
  } else if (tag2 === "select") {
    if (namespace2 === "") {
      return has_dispatched_events(events, path2);
    } else {
      return false;
    }
  } else if (tag2 === "textarea") {
    if (namespace2 === "") {
      return has_dispatched_events(events, path2);
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function diff_attributes(loop$controlled, loop$path, loop$mapper, loop$events, loop$old, loop$new, loop$added, loop$removed) {
  while (true) {
    let controlled = loop$controlled;
    let path2 = loop$path;
    let mapper = loop$mapper;
    let events = loop$events;
    let old = loop$old;
    let new$10 = loop$new;
    let added = loop$added;
    let removed = loop$removed;
    if (new$10 instanceof Empty) {
      if (old instanceof Empty) {
        return new AttributeChange(added, removed, events);
      } else {
        let $ = old.head;
        if ($ instanceof Event2) {
          let prev = $;
          let old$1 = old.tail;
          let name2 = $.name;
          let removed$1 = prepend(prev, removed);
          let events$1 = remove_event(events, path2, name2);
          loop$controlled = controlled;
          loop$path = path2;
          loop$mapper = mapper;
          loop$events = events$1;
          loop$old = old$1;
          loop$new = new$10;
          loop$added = added;
          loop$removed = removed$1;
        } else {
          let prev = $;
          let old$1 = old.tail;
          let removed$1 = prepend(prev, removed);
          loop$controlled = controlled;
          loop$path = path2;
          loop$mapper = mapper;
          loop$events = events;
          loop$old = old$1;
          loop$new = new$10;
          loop$added = added;
          loop$removed = removed$1;
        }
      }
    } else if (old instanceof Empty) {
      let $ = new$10.head;
      if ($ instanceof Event2) {
        let next = $;
        let new$1 = new$10.tail;
        let name2 = $.name;
        let handler = $.handler;
        let added$1 = prepend(next, added);
        let events$1 = add_event(events, mapper, path2, name2, handler);
        loop$controlled = controlled;
        loop$path = path2;
        loop$mapper = mapper;
        loop$events = events$1;
        loop$old = old;
        loop$new = new$1;
        loop$added = added$1;
        loop$removed = removed;
      } else {
        let next = $;
        let new$1 = new$10.tail;
        let added$1 = prepend(next, added);
        loop$controlled = controlled;
        loop$path = path2;
        loop$mapper = mapper;
        loop$events = events;
        loop$old = old;
        loop$new = new$1;
        loop$added = added$1;
        loop$removed = removed;
      }
    } else {
      let next = new$10.head;
      let remaining_new = new$10.tail;
      let prev = old.head;
      let remaining_old = old.tail;
      let $ = compare3(prev, next);
      if ($ instanceof Lt) {
        if (prev instanceof Event2) {
          let name2 = prev.name;
          let removed$1 = prepend(prev, removed);
          let events$1 = remove_event(events, path2, name2);
          loop$controlled = controlled;
          loop$path = path2;
          loop$mapper = mapper;
          loop$events = events$1;
          loop$old = remaining_old;
          loop$new = new$10;
          loop$added = added;
          loop$removed = removed$1;
        } else {
          let removed$1 = prepend(prev, removed);
          loop$controlled = controlled;
          loop$path = path2;
          loop$mapper = mapper;
          loop$events = events;
          loop$old = remaining_old;
          loop$new = new$10;
          loop$added = added;
          loop$removed = removed$1;
        }
      } else if ($ instanceof Eq) {
        if (next instanceof Attribute) {
          if (prev instanceof Attribute) {
            let _block;
            let $1 = next.name;
            if ($1 === "value") {
              _block = controlled || prev.value !== next.value;
            } else if ($1 === "checked") {
              _block = controlled || prev.value !== next.value;
            } else if ($1 === "selected") {
              _block = controlled || prev.value !== next.value;
            } else {
              _block = prev.value !== next.value;
            }
            let has_changes = _block;
            let _block$1;
            if (has_changes) {
              _block$1 = prepend(next, added);
            } else {
              _block$1 = added;
            }
            let added$1 = _block$1;
            loop$controlled = controlled;
            loop$path = path2;
            loop$mapper = mapper;
            loop$events = events;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed;
          } else if (prev instanceof Event2) {
            let name2 = prev.name;
            let added$1 = prepend(next, added);
            let removed$1 = prepend(prev, removed);
            let events$1 = remove_event(events, path2, name2);
            loop$controlled = controlled;
            loop$path = path2;
            loop$mapper = mapper;
            loop$events = events$1;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed$1;
          } else {
            let added$1 = prepend(next, added);
            let removed$1 = prepend(prev, removed);
            loop$controlled = controlled;
            loop$path = path2;
            loop$mapper = mapper;
            loop$events = events;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed$1;
          }
        } else if (next instanceof Property) {
          if (prev instanceof Property) {
            let _block;
            let $1 = next.name;
            if ($1 === "scrollLeft") {
              _block = true;
            } else if ($1 === "scrollRight") {
              _block = true;
            } else if ($1 === "value") {
              _block = controlled || !isEqual2(
                prev.value,
                next.value
              );
            } else if ($1 === "checked") {
              _block = controlled || !isEqual2(
                prev.value,
                next.value
              );
            } else if ($1 === "selected") {
              _block = controlled || !isEqual2(
                prev.value,
                next.value
              );
            } else {
              _block = !isEqual2(prev.value, next.value);
            }
            let has_changes = _block;
            let _block$1;
            if (has_changes) {
              _block$1 = prepend(next, added);
            } else {
              _block$1 = added;
            }
            let added$1 = _block$1;
            loop$controlled = controlled;
            loop$path = path2;
            loop$mapper = mapper;
            loop$events = events;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed;
          } else if (prev instanceof Event2) {
            let name2 = prev.name;
            let added$1 = prepend(next, added);
            let removed$1 = prepend(prev, removed);
            let events$1 = remove_event(events, path2, name2);
            loop$controlled = controlled;
            loop$path = path2;
            loop$mapper = mapper;
            loop$events = events$1;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed$1;
          } else {
            let added$1 = prepend(next, added);
            let removed$1 = prepend(prev, removed);
            loop$controlled = controlled;
            loop$path = path2;
            loop$mapper = mapper;
            loop$events = events;
            loop$old = remaining_old;
            loop$new = remaining_new;
            loop$added = added$1;
            loop$removed = removed$1;
          }
        } else if (prev instanceof Event2) {
          let name2 = next.name;
          let handler = next.handler;
          let has_changes = !isEqual(
            prev.prevent_default,
            next.prevent_default
          ) || !isEqual(prev.stop_propagation, next.stop_propagation) || prev.immediate !== next.immediate || prev.debounce !== next.debounce || prev.throttle !== next.throttle;
          let _block;
          if (has_changes) {
            _block = prepend(next, added);
          } else {
            _block = added;
          }
          let added$1 = _block;
          let events$1 = add_event(events, mapper, path2, name2, handler);
          loop$controlled = controlled;
          loop$path = path2;
          loop$mapper = mapper;
          loop$events = events$1;
          loop$old = remaining_old;
          loop$new = remaining_new;
          loop$added = added$1;
          loop$removed = removed;
        } else {
          let name2 = next.name;
          let handler = next.handler;
          let added$1 = prepend(next, added);
          let removed$1 = prepend(prev, removed);
          let events$1 = add_event(events, mapper, path2, name2, handler);
          loop$controlled = controlled;
          loop$path = path2;
          loop$mapper = mapper;
          loop$events = events$1;
          loop$old = remaining_old;
          loop$new = remaining_new;
          loop$added = added$1;
          loop$removed = removed$1;
        }
      } else if (next instanceof Event2) {
        let name2 = next.name;
        let handler = next.handler;
        let added$1 = prepend(next, added);
        let events$1 = add_event(events, mapper, path2, name2, handler);
        loop$controlled = controlled;
        loop$path = path2;
        loop$mapper = mapper;
        loop$events = events$1;
        loop$old = old;
        loop$new = remaining_new;
        loop$added = added$1;
        loop$removed = removed;
      } else {
        let added$1 = prepend(next, added);
        loop$controlled = controlled;
        loop$path = path2;
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
    let new$10 = loop$new;
    let new_keyed = loop$new_keyed;
    let moved = loop$moved;
    let moved_offset = loop$moved_offset;
    let removed = loop$removed;
    let node_index = loop$node_index;
    let patch_index = loop$patch_index;
    let path2 = loop$path;
    let changes = loop$changes;
    let children = loop$children;
    let mapper = loop$mapper;
    let events = loop$events;
    if (new$10 instanceof Empty) {
      if (old instanceof Empty) {
        return new Diff(
          new Patch(patch_index, removed, changes, children),
          events
        );
      } else {
        let prev = old.head;
        let old$1 = old.tail;
        let _block;
        let $ = prev.key === "" || !contains(moved, prev.key);
        if ($) {
          _block = removed + advance(prev);
        } else {
          _block = removed;
        }
        let removed$1 = _block;
        let events$1 = remove_child(events, path2, node_index, prev);
        loop$old = old$1;
        loop$old_keyed = old_keyed;
        loop$new = new$10;
        loop$new_keyed = new_keyed;
        loop$moved = moved;
        loop$moved_offset = moved_offset;
        loop$removed = removed$1;
        loop$node_index = node_index;
        loop$patch_index = patch_index;
        loop$path = path2;
        loop$changes = changes;
        loop$children = children;
        loop$mapper = mapper;
        loop$events = events$1;
      }
    } else if (old instanceof Empty) {
      let events$1 = add_children(
        events,
        mapper,
        path2,
        node_index,
        new$10
      );
      let insert5 = insert4(new$10, node_index - moved_offset);
      let changes$1 = prepend(insert5, changes);
      return new Diff(
        new Patch(patch_index, removed, changes$1, children),
        events$1
      );
    } else {
      let next = new$10.head;
      let prev = old.head;
      if (prev.key !== next.key) {
        let new_remaining = new$10.tail;
        let old_remaining = old.tail;
        let next_did_exist = get(old_keyed, next.key);
        let prev_does_exist = get(new_keyed, prev.key);
        let prev_has_moved = contains(moved, prev.key);
        if (next_did_exist instanceof Ok) {
          if (prev_does_exist instanceof Ok) {
            if (prev_has_moved) {
              loop$old = old_remaining;
              loop$old_keyed = old_keyed;
              loop$new = new$10;
              loop$new_keyed = new_keyed;
              loop$moved = moved;
              loop$moved_offset = moved_offset - advance(prev);
              loop$removed = removed;
              loop$node_index = node_index;
              loop$patch_index = patch_index;
              loop$path = path2;
              loop$changes = changes;
              loop$children = children;
              loop$mapper = mapper;
              loop$events = events;
            } else {
              let match = next_did_exist[0];
              let count = advance(next);
              let before = node_index - moved_offset;
              let move2 = move(next.key, before, count);
              let changes$1 = prepend(move2, changes);
              let moved$1 = insert2(moved, next.key);
              let moved_offset$1 = moved_offset + count;
              loop$old = prepend(match, old);
              loop$old_keyed = old_keyed;
              loop$new = new$10;
              loop$new_keyed = new_keyed;
              loop$moved = moved$1;
              loop$moved_offset = moved_offset$1;
              loop$removed = removed;
              loop$node_index = node_index;
              loop$patch_index = patch_index;
              loop$path = path2;
              loop$changes = changes$1;
              loop$children = children;
              loop$mapper = mapper;
              loop$events = events;
            }
          } else {
            let count = advance(prev);
            let moved_offset$1 = moved_offset - count;
            let events$1 = remove_child(events, path2, node_index, prev);
            let remove5 = remove_key(prev.key, count);
            let changes$1 = prepend(remove5, changes);
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new$10;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset$1;
            loop$removed = removed;
            loop$node_index = node_index;
            loop$patch_index = patch_index;
            loop$path = path2;
            loop$changes = changes$1;
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        } else if (prev_does_exist instanceof Ok) {
          let before = node_index - moved_offset;
          let count = advance(next);
          let events$1 = add_child(
            events,
            mapper,
            path2,
            node_index,
            next
          );
          let insert5 = insert4(toList([next]), before);
          let changes$1 = prepend(insert5, changes);
          loop$old = old;
          loop$old_keyed = old_keyed;
          loop$new = new_remaining;
          loop$new_keyed = new_keyed;
          loop$moved = moved;
          loop$moved_offset = moved_offset + count;
          loop$removed = removed;
          loop$node_index = node_index + count;
          loop$patch_index = patch_index;
          loop$path = path2;
          loop$changes = changes$1;
          loop$children = children;
          loop$mapper = mapper;
          loop$events = events$1;
        } else {
          let prev_count = advance(prev);
          let next_count = advance(next);
          let change = replace2(
            node_index - moved_offset,
            prev_count,
            next
          );
          let _block;
          let _pipe = events;
          let _pipe$1 = remove_child(_pipe, path2, node_index, prev);
          _block = add_child(_pipe$1, mapper, path2, node_index, next);
          let events$1 = _block;
          loop$old = old_remaining;
          loop$old_keyed = old_keyed;
          loop$new = new_remaining;
          loop$new_keyed = new_keyed;
          loop$moved = moved;
          loop$moved_offset = moved_offset - prev_count + next_count;
          loop$removed = removed;
          loop$node_index = node_index + next_count;
          loop$patch_index = patch_index;
          loop$path = path2;
          loop$changes = prepend(change, changes);
          loop$children = children;
          loop$mapper = mapper;
          loop$events = events$1;
        }
      } else {
        let $ = old.head;
        if ($ instanceof Fragment) {
          let $1 = new$10.head;
          if ($1 instanceof Fragment) {
            let next$1 = $1;
            let new$1 = new$10.tail;
            let prev$1 = $;
            let old$1 = old.tail;
            let node_index$1 = node_index + 1;
            let prev_count = prev$1.children_count;
            let next_count = next$1.children_count;
            let composed_mapper = compose_mapper(mapper, next$1.mapper);
            let child = do_diff(
              prev$1.children,
              prev$1.keyed_children,
              next$1.children,
              next$1.keyed_children,
              empty_set(),
              moved_offset,
              0,
              node_index$1,
              -1,
              path2,
              empty_list,
              children,
              composed_mapper,
              events
            );
            let _block;
            let $2 = child.patch.removed > 0;
            if ($2) {
              let remove_from = node_index$1 + next_count - moved_offset;
              let patch = remove2(remove_from, child.patch.removed);
              _block = append(
                child.patch.changes,
                prepend(patch, changes)
              );
            } else {
              _block = append(child.patch.changes, changes);
            }
            let changes$1 = _block;
            loop$old = old$1;
            loop$old_keyed = old_keyed;
            loop$new = new$1;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset + next_count - prev_count;
            loop$removed = removed;
            loop$node_index = node_index$1 + next_count;
            loop$patch_index = patch_index;
            loop$path = path2;
            loop$changes = changes$1;
            loop$children = child.patch.children;
            loop$mapper = mapper;
            loop$events = child.events;
          } else {
            let next$1 = $1;
            let new_remaining = new$10.tail;
            let prev$1 = $;
            let old_remaining = old.tail;
            let prev_count = advance(prev$1);
            let next_count = advance(next$1);
            let change = replace2(
              node_index - moved_offset,
              prev_count,
              next$1
            );
            let _block;
            let _pipe = events;
            let _pipe$1 = remove_child(_pipe, path2, node_index, prev$1);
            _block = add_child(
              _pipe$1,
              mapper,
              path2,
              node_index,
              next$1
            );
            let events$1 = _block;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new_remaining;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset - prev_count + next_count;
            loop$removed = removed;
            loop$node_index = node_index + next_count;
            loop$patch_index = patch_index;
            loop$path = path2;
            loop$changes = prepend(change, changes);
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        } else if ($ instanceof Element2) {
          let $1 = new$10.head;
          if ($1 instanceof Element2) {
            let next$1 = $1;
            let prev$1 = $;
            if (prev$1.namespace === next$1.namespace && prev$1.tag === next$1.tag) {
              let new$1 = new$10.tail;
              let old$1 = old.tail;
              let composed_mapper = compose_mapper(
                mapper,
                next$1.mapper
              );
              let child_path = add2(path2, node_index, next$1.key);
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
              let added_attrs = $2.added;
              let removed_attrs = $2.removed;
              let events$1 = $2.events;
              let _block;
              if (removed_attrs instanceof Empty) {
                if (added_attrs instanceof Empty) {
                  _block = empty_list;
                } else {
                  _block = toList([update(added_attrs, removed_attrs)]);
                }
              } else {
                _block = toList([update(added_attrs, removed_attrs)]);
              }
              let initial_child_changes = _block;
              let child = do_diff(
                prev$1.children,
                prev$1.keyed_children,
                next$1.children,
                next$1.keyed_children,
                empty_set(),
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
              loop$path = path2;
              loop$changes = changes;
              loop$children = children$1;
              loop$mapper = mapper;
              loop$events = child.events;
            } else {
              let next$2 = $1;
              let new_remaining = new$10.tail;
              let prev$2 = $;
              let old_remaining = old.tail;
              let prev_count = advance(prev$2);
              let next_count = advance(next$2);
              let change = replace2(
                node_index - moved_offset,
                prev_count,
                next$2
              );
              let _block;
              let _pipe = events;
              let _pipe$1 = remove_child(
                _pipe,
                path2,
                node_index,
                prev$2
              );
              _block = add_child(
                _pipe$1,
                mapper,
                path2,
                node_index,
                next$2
              );
              let events$1 = _block;
              loop$old = old_remaining;
              loop$old_keyed = old_keyed;
              loop$new = new_remaining;
              loop$new_keyed = new_keyed;
              loop$moved = moved;
              loop$moved_offset = moved_offset - prev_count + next_count;
              loop$removed = removed;
              loop$node_index = node_index + next_count;
              loop$patch_index = patch_index;
              loop$path = path2;
              loop$changes = prepend(change, changes);
              loop$children = children;
              loop$mapper = mapper;
              loop$events = events$1;
            }
          } else {
            let next$1 = $1;
            let new_remaining = new$10.tail;
            let prev$1 = $;
            let old_remaining = old.tail;
            let prev_count = advance(prev$1);
            let next_count = advance(next$1);
            let change = replace2(
              node_index - moved_offset,
              prev_count,
              next$1
            );
            let _block;
            let _pipe = events;
            let _pipe$1 = remove_child(_pipe, path2, node_index, prev$1);
            _block = add_child(
              _pipe$1,
              mapper,
              path2,
              node_index,
              next$1
            );
            let events$1 = _block;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new_remaining;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset - prev_count + next_count;
            loop$removed = removed;
            loop$node_index = node_index + next_count;
            loop$patch_index = patch_index;
            loop$path = path2;
            loop$changes = prepend(change, changes);
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        } else if ($ instanceof Text) {
          let $1 = new$10.head;
          if ($1 instanceof Text) {
            let next$1 = $1;
            let prev$1 = $;
            if (prev$1.content === next$1.content) {
              let new$1 = new$10.tail;
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
              loop$path = path2;
              loop$changes = changes;
              loop$children = children;
              loop$mapper = mapper;
              loop$events = events;
            } else {
              let next$2 = $1;
              let new$1 = new$10.tail;
              let old$1 = old.tail;
              let child = new$5(
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
              loop$path = path2;
              loop$changes = changes;
              loop$children = prepend(child, children);
              loop$mapper = mapper;
              loop$events = events;
            }
          } else {
            let next$1 = $1;
            let new_remaining = new$10.tail;
            let prev$1 = $;
            let old_remaining = old.tail;
            let prev_count = advance(prev$1);
            let next_count = advance(next$1);
            let change = replace2(
              node_index - moved_offset,
              prev_count,
              next$1
            );
            let _block;
            let _pipe = events;
            let _pipe$1 = remove_child(_pipe, path2, node_index, prev$1);
            _block = add_child(
              _pipe$1,
              mapper,
              path2,
              node_index,
              next$1
            );
            let events$1 = _block;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new_remaining;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset - prev_count + next_count;
            loop$removed = removed;
            loop$node_index = node_index + next_count;
            loop$patch_index = patch_index;
            loop$path = path2;
            loop$changes = prepend(change, changes);
            loop$children = children;
            loop$mapper = mapper;
            loop$events = events$1;
          }
        } else {
          let $1 = new$10.head;
          if ($1 instanceof UnsafeInnerHtml) {
            let next$1 = $1;
            let new$1 = new$10.tail;
            let prev$1 = $;
            let old$1 = old.tail;
            let composed_mapper = compose_mapper(mapper, next$1.mapper);
            let child_path = add2(path2, node_index, next$1.key);
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
            let added_attrs = $2.added;
            let removed_attrs = $2.removed;
            let events$1 = $2.events;
            let _block;
            if (removed_attrs instanceof Empty) {
              if (added_attrs instanceof Empty) {
                _block = empty_list;
              } else {
                _block = toList([update(added_attrs, removed_attrs)]);
              }
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
                new$5(node_index, 0, child_changes$1, toList([])),
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
            loop$path = path2;
            loop$changes = changes;
            loop$children = children$1;
            loop$mapper = mapper;
            loop$events = events$1;
          } else {
            let next$1 = $1;
            let new_remaining = new$10.tail;
            let prev$1 = $;
            let old_remaining = old.tail;
            let prev_count = advance(prev$1);
            let next_count = advance(next$1);
            let change = replace2(
              node_index - moved_offset,
              prev_count,
              next$1
            );
            let _block;
            let _pipe = events;
            let _pipe$1 = remove_child(_pipe, path2, node_index, prev$1);
            _block = add_child(
              _pipe$1,
              mapper,
              path2,
              node_index,
              next$1
            );
            let events$1 = _block;
            loop$old = old_remaining;
            loop$old_keyed = old_keyed;
            loop$new = new_remaining;
            loop$new_keyed = new_keyed;
            loop$moved = moved;
            loop$moved_offset = moved_offset - prev_count + next_count;
            loop$removed = removed;
            loop$node_index = node_index + next_count;
            loop$patch_index = patch_index;
            loop$path = path2;
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
function diff(events, old, new$10) {
  return do_diff(
    toList([old]),
    empty2(),
    toList([new$10]),
    empty2(),
    empty_set(),
    0,
    0,
    0,
    0,
    root2,
    empty_list,
    empty_list,
    identity3,
    tick(events)
  );
}

// build/dev/javascript/lustre/lustre/vdom/reconciler.ffi.mjs
var Reconciler = class {
  offset = 0;
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
    appendChild(this.#root, this.#createChild(this.#root, 0, vdom));
  }
  #stack = [];
  push(patch) {
    const offset = this.offset;
    if (offset) {
      iterate(patch.changes, (change) => {
        switch (change.kind) {
          case insert_kind:
          case move_kind:
            change.before = (change.before | 0) + offset;
            break;
          case remove_kind:
          case replace_kind:
            change.from = (change.from | 0) + offset;
            break;
        }
      });
      iterate(patch.children, (child) => {
        child.index = (child.index | 0) + offset;
      });
    }
    this.#stack.push({ node: this.#root, patch });
    this.#reconcile();
  }
  // PATCHING ------------------------------------------------------------------
  #reconcile() {
    const self3 = this;
    while (self3.#stack.length) {
      const { node, patch } = self3.#stack.pop();
      iterate(patch.changes, (change) => {
        switch (change.kind) {
          case insert_kind:
            self3.#insert(node, change.children, change.before);
            break;
          case move_kind:
            self3.#move(node, change.key, change.before, change.count);
            break;
          case remove_key_kind:
            self3.#removeKey(node, change.key, change.count);
            break;
          case remove_kind:
            self3.#remove(node, change.from, change.count);
            break;
          case replace_kind:
            self3.#replace(node, change.from, change.count, change.with);
            break;
          case replace_text_kind:
            self3.#replaceText(node, change.content);
            break;
          case replace_inner_html_kind:
            self3.#replaceInnerHtml(node, change.inner_html);
            break;
          case update_kind:
            self3.#update(node, change.added, change.removed);
            break;
        }
      });
      if (patch.removed) {
        self3.#remove(
          node,
          node.childNodes.length - patch.removed,
          patch.removed
        );
      }
      let lastIndex = -1;
      let lastChild = null;
      iterate(patch.children, (child) => {
        const index5 = child.index | 0;
        const next = lastChild && lastIndex - index5 === 1 ? lastChild.previousSibling : childAt(node, index5);
        self3.#stack.push({ node: next, patch: child });
        lastChild = next;
        lastIndex = index5;
      });
    }
  }
  // CHANGES -------------------------------------------------------------------
  #insert(node, children, before) {
    const fragment3 = createDocumentFragment();
    let childIndex = before | 0;
    iterate(children, (child) => {
      const el = this.#createChild(node, childIndex, child);
      appendChild(fragment3, el);
      childIndex += advance(child);
    });
    insertBefore(node, fragment3, childAt(node, before));
  }
  #move(node, key3, before, count) {
    let el = getKeyedChild(node, key3);
    const beforeEl = childAt(node, before);
    for (let i2 = 0; i2 < count && el !== null; ++i2) {
      const next = el.nextSibling;
      if (SUPPORTS_MOVE_BEFORE) {
        node.moveBefore(el, beforeEl);
      } else {
        insertBefore(node, el, beforeEl);
      }
      el = next;
    }
  }
  #removeKey(node, key3, count) {
    this.#removeFromChild(node, getKeyedChild(node, key3), count);
  }
  #remove(node, from2, count) {
    this.#removeFromChild(node, childAt(node, from2), count);
  }
  #removeFromChild(parent, child, count) {
    while (count-- > 0 && child !== null) {
      const next = child.nextSibling;
      const key3 = child[meta].key;
      if (key3) {
        parent[meta].keyedChildren.delete(key3);
      }
      for (const [_, { timeout }] of child[meta].debouncers ?? []) {
        clearTimeout(timeout);
      }
      parent.removeChild(child);
      child = next;
    }
  }
  #replace(parent, from2, count, child) {
    this.#remove(parent, from2, count);
    const el = this.#createChild(parent, from2, child);
    insertBefore(parent, el, childAt(parent, from2));
  }
  #replaceText(node, content) {
    node.data = content ?? "";
  }
  #replaceInnerHtml(node, inner_html) {
    node.innerHTML = inner_html ?? "";
  }
  #update(node, added, removed) {
    iterate(removed, (attribute3) => {
      const name2 = attribute3.name;
      if (node[meta].handlers.has(name2)) {
        node.removeEventListener(name2, handleEvent);
        node[meta].handlers.delete(name2);
        if (node[meta].throttles.has(name2)) {
          node[meta].throttles.delete(name2);
        }
        if (node[meta].debouncers.has(name2)) {
          clearTimeout(node[meta].debouncers.get(name2).timeout);
          node[meta].debouncers.delete(name2);
        }
      } else {
        node.removeAttribute(name2);
        SYNCED_ATTRIBUTES[name2]?.removed?.(node, name2);
      }
    });
    iterate(added, (attribute3) => {
      this.#createAttribute(node, attribute3);
    });
  }
  // CONSTRUCTORS --------------------------------------------------------------
  #createChild(parent, index5, vnode) {
    switch (vnode.kind) {
      case element_kind: {
        const node = createChildElement(parent, index5, vnode);
        this.#createAttributes(node, vnode);
        this.#insert(node, vnode.children);
        return node;
      }
      case text_kind: {
        return createChildText(parent, index5, vnode);
      }
      case fragment_kind: {
        const node = createDocumentFragment();
        const head = createChildText(parent, index5, vnode);
        appendChild(node, head);
        let childIndex = index5 + 1;
        iterate(vnode.children, (child) => {
          appendChild(node, this.#createChild(parent, childIndex, child));
          childIndex += advance(child);
        });
        return node;
      }
      case unsafe_inner_html_kind: {
        const node = createChildElement(parent, index5, vnode);
        this.#createAttributes(node, vnode);
        this.#replaceInnerHtml(node, vnode.inner_html);
        return node;
      }
    }
  }
  #createAttributes(node, { key: key3, attributes }) {
    if (this.#exposeKeys && key3) {
      node.setAttribute("data-lustre-key", key3);
    }
    iterate(attributes, (attribute3) => this.#createAttribute(node, attribute3));
  }
  #createAttribute(node, attribute3) {
    const { debouncers, handlers, throttles } = node[meta];
    const {
      kind,
      name: name2,
      value: value2,
      prevent_default: prevent,
      stop_propagation: stop,
      immediate: immediate2,
      include,
      debounce: debounceDelay,
      throttle: throttleDelay
    } = attribute3;
    switch (kind) {
      case attribute_kind: {
        const valueOrDefault = value2 ?? "";
        if (name2 === "virtual:defaultValue") {
          node.defaultValue = valueOrDefault;
          return;
        }
        if (valueOrDefault !== node.getAttribute(name2)) {
          node.setAttribute(name2, valueOrDefault);
        }
        SYNCED_ATTRIBUTES[name2]?.added?.(node, value2);
        break;
      }
      case property_kind:
        node[name2] = value2;
        break;
      case event_kind: {
        if (handlers.has(name2)) {
          node.removeEventListener(name2, handleEvent);
        }
        node.addEventListener(name2, handleEvent, {
          passive: prevent.kind === never_kind
        });
        if (throttleDelay > 0) {
          const throttle = throttles.get(name2) ?? {};
          throttle.delay = throttleDelay;
          throttles.set(name2, throttle);
        } else {
          throttles.delete(name2);
        }
        if (debounceDelay > 0) {
          const debounce = debouncers.get(name2) ?? {};
          debounce.delay = debounceDelay;
          debouncers.set(name2, debounce);
        } else {
          clearTimeout(debouncers.get(name2)?.timeout);
          debouncers.delete(name2);
        }
        handlers.set(name2, (event4) => {
          if (prevent.kind === always_kind) event4.preventDefault();
          if (stop.kind === always_kind) event4.stopPropagation();
          const type = event4.type;
          const path2 = event4.currentTarget[meta].path;
          const data = this.#useServerEvents ? createServerEvent(event4, include ?? []) : event4;
          const throttle = throttles.get(type);
          if (throttle) {
            const now = Date.now();
            const last = throttle.last || 0;
            if (now > last + throttle.delay) {
              throttle.last = now;
              throttle.lastEvent = event4;
              this.#dispatch(data, path2, type, immediate2);
            }
          }
          const debounce = debouncers.get(type);
          if (debounce) {
            clearTimeout(debounce.timeout);
            debounce.timeout = setTimeout(() => {
              if (event4 === throttles.get(type)?.lastEvent) return;
              this.#dispatch(data, path2, type, immediate2);
            }, debounce.delay);
          }
          if (!throttle && !debounce) {
            this.#dispatch(data, path2, type, immediate2);
          }
        });
        break;
      }
    }
  }
};
var iterate = (list4, callback) => {
  if (Array.isArray(list4)) {
    for (let i2 = 0; i2 < list4.length; i2++) {
      callback(list4[i2]);
    }
  } else if (list4) {
    for (list4; list4.tail; list4 = list4.tail) {
      callback(list4.head);
    }
  }
};
var appendChild = (node, child) => node.appendChild(child);
var insertBefore = (parent, node, referenceNode) => parent.insertBefore(node, referenceNode ?? null);
var createChildElement = (parent, index5, { key: key3, tag: tag2, namespace: namespace2 }) => {
  const node = document2().createElementNS(namespace2 || NAMESPACE_HTML, tag2);
  initialiseMetadata(parent, node, index5, key3);
  return node;
};
var createChildText = (parent, index5, { key: key3, content }) => {
  const node = document2().createTextNode(content ?? "");
  initialiseMetadata(parent, node, index5, key3);
  return node;
};
var createDocumentFragment = () => document2().createDocumentFragment();
var childAt = (node, at) => node.childNodes[at | 0];
var meta = Symbol("lustre");
var initialiseMetadata = (parent, node, index5 = 0, key3 = "") => {
  const segment = `${key3 || index5}`;
  switch (node.nodeType) {
    case ELEMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      node[meta] = {
        key: key3,
        path: segment,
        keyedChildren: /* @__PURE__ */ new Map(),
        handlers: /* @__PURE__ */ new Map(),
        throttles: /* @__PURE__ */ new Map(),
        debouncers: /* @__PURE__ */ new Map()
      };
      break;
    case TEXT_NODE:
      node[meta] = { key: key3 };
      break;
  }
  if (parent && parent[meta] && key3) {
    parent[meta].keyedChildren.set(key3, new WeakRef(node));
  }
  if (parent && parent[meta] && parent[meta].path) {
    node[meta].path = `${parent[meta].path}${separator_element}${segment}`;
  }
};
var getKeyedChild = (node, key3) => node[meta].keyedChildren.get(key3).deref();
var handleEvent = (event4) => {
  const target2 = event4.currentTarget;
  const handler = target2[meta].handlers.get(event4.type);
  if (event4.type === "submit") {
    event4.detail ??= {};
    event4.detail.formData = [...new FormData(event4.target).entries()];
  }
  handler(event4);
};
var createServerEvent = (event4, include = []) => {
  const data = {};
  if (event4.type === "input" || event4.type === "change") {
    include.push("target.value");
  }
  if (event4.type === "submit") {
    include.push("detail.formData");
  }
  for (const property3 of include) {
    const path2 = property3.split(".");
    for (let i2 = 0, input2 = event4, output = data; i2 < path2.length; i2++) {
      if (i2 === path2.length - 1) {
        output[path2[i2]] = input2[path2[i2]];
        break;
      }
      output = output[path2[i2]] ??= {};
      input2 = input2[path2[i2]];
    }
  }
  return data;
};
var syncedBooleanAttribute = (name2) => {
  return {
    added(node) {
      node[name2] = true;
    },
    removed(node) {
      node[name2] = false;
    }
  };
};
var syncedAttribute = (name2) => {
  return {
    added(node, value2) {
      node[name2] = value2;
    }
  };
};
var SYNCED_ATTRIBUTES = {
  checked: syncedBooleanAttribute("checked"),
  selected: syncedBooleanAttribute("selected"),
  value: syncedAttribute("value"),
  autofocus: {
    added(node) {
      queueMicrotask(() => node.focus?.());
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

// build/dev/javascript/lustre/lustre/vdom/virtualise.ffi.mjs
var virtualise = (root3) => {
  const vdom = virtualiseNode(null, root3, "");
  if (vdom === null || vdom.children instanceof Empty) {
    const empty5 = emptyTextNode(root3);
    root3.appendChild(empty5);
    return none();
  } else if (vdom.children instanceof NonEmpty && vdom.children.tail instanceof Empty) {
    return vdom.children.head;
  } else {
    const head = emptyTextNode(root3);
    root3.insertBefore(head, root3.firstChild);
    return fragment2(vdom.children);
  }
};
var emptyTextNode = (parent) => {
  const node = document2().createTextNode("");
  initialiseMetadata(parent, node);
  return node;
};
var virtualiseNode = (parent, node, index5) => {
  switch (node.nodeType) {
    case ELEMENT_NODE: {
      const key3 = node.getAttribute("data-lustre-key");
      initialiseMetadata(parent, node, index5, key3);
      if (key3) {
        node.removeAttribute("data-lustre-key");
      }
      const tag2 = node.localName;
      const namespace2 = node.namespaceURI;
      const isHtmlElement = !namespace2 || namespace2 === NAMESPACE_HTML;
      if (isHtmlElement && INPUT_ELEMENTS.includes(tag2)) {
        virtualiseInputEvents(tag2, node);
      }
      const attributes = virtualiseAttributes(node);
      const children = virtualiseChildNodes(node);
      const vnode = isHtmlElement ? element2(tag2, attributes, children) : namespaced(namespace2, tag2, attributes, children);
      return key3 ? to_keyed(key3, vnode) : vnode;
    }
    case TEXT_NODE:
      initialiseMetadata(parent, node, index5);
      return node.data ? text2(node.data) : null;
    case DOCUMENT_FRAGMENT_NODE:
      initialiseMetadata(parent, node, index5);
      return node.childNodes.length > 0 ? fragment2(virtualiseChildNodes(node)) : null;
    default:
      return null;
  }
};
var INPUT_ELEMENTS = ["input", "select", "textarea"];
var virtualiseInputEvents = (tag2, node) => {
  const value2 = node.value;
  const checked = node.checked;
  if (tag2 === "input" && node.type === "checkbox" && !checked) return;
  if (tag2 === "input" && node.type === "radio" && !checked) return;
  if (node.type !== "checkbox" && node.type !== "radio" && !value2) return;
  queueMicrotask(() => {
    node.value = value2;
    node.checked = checked;
    node.dispatchEvent(new Event("input", { bubbles: true }));
    node.dispatchEvent(new Event("change", { bubbles: true }));
    if (document2().activeElement !== node) {
      node.dispatchEvent(new Event("blur", { bubbles: true }));
    }
  });
};
var virtualiseChildNodes = (node) => {
  let children = null;
  let index5 = 0;
  let child = node.firstChild;
  let ptr = null;
  while (child) {
    const vnode = virtualiseNode(node, child, index5);
    const next = child.nextSibling;
    if (vnode) {
      const list_node = new NonEmpty(vnode, null);
      if (ptr) {
        ptr = ptr.tail = list_node;
      } else {
        ptr = children = list_node;
      }
      index5 += 1;
    } else {
      node.removeChild(child);
    }
    child = next;
  }
  if (!ptr) return empty_list;
  ptr.tail = empty_list;
  return children;
};
var virtualiseAttributes = (node) => {
  let index5 = node.attributes.length;
  let attributes = empty_list;
  while (index5-- > 0) {
    attributes = new NonEmpty(
      virtualiseAttribute(node.attributes[index5]),
      attributes
    );
  }
  return attributes;
};
var virtualiseAttribute = (attr) => {
  const name2 = attr.localName;
  const value2 = attr.value;
  return attribute2(name2, value2);
};

// build/dev/javascript/lustre/lustre/runtime/client/runtime.ffi.mjs
var is_browser = () => !!document2();
var Runtime = class {
  constructor(root3, [model, effects], view6, update6) {
    this.root = root3;
    this.#model = model;
    this.#view = view6;
    this.#update = update6;
    this.#reconciler = new Reconciler(this.root, (event4, path2, name2) => {
      const [events, result] = handle(this.#events, path2, name2, event4);
      this.#events = events;
      if (result.isOk()) {
        const handler = result[0];
        if (handler.stop_propagation) event4.stopPropagation();
        if (handler.prevent_default) event4.preventDefault();
        this.dispatch(handler.message, false);
      }
    });
    this.#vdom = virtualise(this.root);
    this.#events = new$3();
    this.#shouldFlush = true;
    this.#tick(effects);
  }
  // PUBLIC API ----------------------------------------------------------------
  root = null;
  set offset(offset) {
    this.#reconciler.offset = offset;
  }
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
  emit(event4, data) {
    const target2 = this.root.host ?? this.root;
    target2.dispatchEvent(
      new CustomEvent(event4, {
        detail: data,
        bubbles: true,
        composed: true
      })
    );
  }
  // PRIVATE API ---------------------------------------------------------------
  #model;
  #view;
  #update;
  #vdom;
  #events;
  #reconciler;
  #shouldQueue = false;
  #queue = [];
  #beforePaint = empty_list;
  #afterPaint = empty_list;
  #renderTimer = null;
  #shouldFlush = false;
  #actions = {
    dispatch: (msg, immediate2) => this.dispatch(msg, immediate2),
    emit: (event4, data) => this.emit(event4, data),
    select: () => {
    },
    root: () => this.root
  };
  // A `#tick` is where we process effects and trigger any synchronous updates.
  // Once a tick has been processed a render will be scheduled if none is already.
  // p0
  #tick(effects) {
    this.#shouldQueue = true;
    while (true) {
      for (let list4 = effects.synchronous; list4.tail; list4 = list4.tail) {
        list4.head(this.#actions);
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
    const next = this.#view(this.#model);
    const { patch, events } = diff(this.#events, this.#vdom, next);
    this.#events = events;
    this.#vdom = next;
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
async function adoptStylesheets(shadowRoot) {
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
  if (!shadowRoot.host.isConnected) {
    return [];
  }
  shadowRoot.adoptedStyleSheets = shadowRoot.host.getRootNode().adoptedStyleSheets;
  const pending = [];
  for (const sheet of document2().styleSheets) {
    try {
      shadowRoot.adoptedStyleSheets.push(sheet);
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
        shadowRoot.adoptedStyleSheets.push(copiedSheet);
      } catch {
        const node = sheet.ownerNode.cloneNode();
        shadowRoot.prepend(node);
        pending.push(node);
      }
    }
  }
  return pending;
}

// build/dev/javascript/lustre/lustre/runtime/server/runtime.mjs
var EffectDispatchedMessage = class extends CustomType {
  constructor(message2) {
    super();
    this.message = message2;
  }
};
var EffectEmitEvent = class extends CustomType {
  constructor(name2, data) {
    super();
    this.name = name2;
    this.data = data;
  }
};
var SystemRequestedShutdown = class extends CustomType {
};

// build/dev/javascript/lustre/lustre/runtime/client/component.ffi.mjs
var make_component = ({ init: init6, update: update6, view: view6, config }, name2) => {
  if (!is_browser()) return new Error2(new NotABrowser());
  if (!name2.includes("-")) return new Error2(new BadComponentName(name2));
  if (customElements.get(name2)) {
    return new Error2(new ComponentAlreadyRegistered(name2));
  }
  const [model, effects] = init6(void 0);
  const observedAttributes = config.attributes.entries().map(([name3]) => name3);
  const component2 = class Component extends HTMLElement {
    static get observedAttributes() {
      return observedAttributes;
    }
    static formAssociated = config.is_form_associated;
    #runtime;
    #adoptedStyleNodes = [];
    #shadowRoot;
    constructor() {
      super();
      this.internals = this.attachInternals();
      if (!this.internals.shadowRoot) {
        this.#shadowRoot = this.attachShadow({
          mode: config.open_shadow_root ? "open" : "closed"
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
        view6,
        update6
      );
    }
    adoptedCallback() {
      if (config.adopt_styles) {
        this.#adoptStyleSheets();
      }
    }
    attributeChangedCallback(name3, _, value2) {
      const decoded = config.attributes.get(name3)(value2);
      if (decoded.constructor === Ok) {
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
    emit(event4, data) {
      this.#runtime.emit(event4, data);
    }
    async #adoptStyleSheets() {
      while (this.#adoptedStyleNodes.length) {
        this.#adoptedStyleNodes.pop().remove();
        this.shadowRoot.firstChild.remove();
      }
      this.#adoptedStyleNodes = await adoptStylesheets(this.#shadowRoot);
      this.#runtime.offset = this.#adoptedStyleNodes.length;
    }
  };
  config.properties.forEach((decoder2, name3) => {
    Object.defineProperty(component2.prototype, name3, {
      get() {
        return this[`_${name3}`];
      },
      set(value2) {
        this[`_${name3}`] = value2;
        const decoded = run(value2, decoder2);
        if (decoded.constructor === Ok) {
          this.dispatch(decoded[0]);
        }
      }
    });
  });
  customElements.define(name2, component2);
  return new Ok(void 0);
};

// build/dev/javascript/lustre/lustre/component.mjs
var Config2 = class extends CustomType {
  constructor(open_shadow_root, adopt_styles, attributes, properties, is_form_associated, on_form_autofill, on_form_reset, on_form_restore) {
    super();
    this.open_shadow_root = open_shadow_root;
    this.adopt_styles = adopt_styles;
    this.attributes = attributes;
    this.properties = properties;
    this.is_form_associated = is_form_associated;
    this.on_form_autofill = on_form_autofill;
    this.on_form_reset = on_form_reset;
    this.on_form_restore = on_form_restore;
  }
};
function new$6(options) {
  let init6 = new Config2(
    false,
    true,
    empty_dict(),
    empty_dict(),
    false,
    option_none,
    option_none,
    option_none
  );
  return fold(
    options,
    init6,
    (config, option) => {
      return option.apply(config);
    }
  );
}

// build/dev/javascript/lustre/lustre/runtime/client/spa.ffi.mjs
var Spa = class _Spa {
  static start({ init: init6, update: update6, view: view6 }, selector, flags) {
    if (!is_browser()) return new Error2(new NotABrowser());
    const root3 = selector instanceof HTMLElement ? selector : document2().querySelector(selector);
    if (!root3) return new Error2(new ElementNotFound(selector));
    return new Ok(new _Spa(root3, init6(flags), update6, view6));
  }
  #runtime;
  constructor(root3, [init6, effects], update6, view6) {
    this.#runtime = new Runtime(root3, [init6, effects], view6, update6);
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
  emit(event4, data) {
    this.#runtime.emit(event4, data);
  }
};
var start = Spa.start;

// build/dev/javascript/lustre/lustre.mjs
var App = class extends CustomType {
  constructor(init6, update6, view6, config) {
    super();
    this.init = init6;
    this.update = update6;
    this.view = view6;
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
function component(init6, update6, view6, options) {
  return new App(init6, update6, view6, new$6(options));
}
function application(init6, update6, view6) {
  return new App(init6, update6, view6, new$6(empty_list));
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

// build/dev/javascript/gleam_stdlib/gleam/pair.mjs
function new$7(first, second2) {
  return [first, second2];
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
var do_load = (uri) => {
  window.location = to_string2(uri);
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

// build/dev/javascript/gleam_javascript/gleam_javascript_ffi.mjs
var PromiseLayer = class _PromiseLayer {
  constructor(promise) {
    this.promise = promise;
  }
  static wrap(value2) {
    return value2 instanceof Promise ? new _PromiseLayer(value2) : value2;
  }
  static unwrap(value2) {
    return value2 instanceof _PromiseLayer ? value2.promise : value2;
  }
};
function resolve(value2) {
  return Promise.resolve(PromiseLayer.wrap(value2));
}
function then_await(promise, fn) {
  return promise.then((value2) => fn(PromiseLayer.unwrap(value2)));
}
function map_promise(promise, fn) {
  return promise.then(
    (value2) => PromiseLayer.wrap(fn(PromiseLayer.unwrap(value2)))
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
function addEventListener3(type, listener) {
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
function location() {
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
  const hash = window.location.hash;
  if (hash == "") {
    return new Error2();
  }
  return new Ok(decodeURIComponent(hash.slice(1)));
}
function getSearch() {
  const search = window.location.search;
  if (search == "") {
    return new Error2();
  }
  return new Ok(decodeURIComponent(search.slice(1)));
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
function open(url, target2, features) {
  try {
    return new Ok(window.open(url, target2, features));
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

// build/dev/javascript/lustre/lustre/event.mjs
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
    let _record = event4;
    return new Event2(
      _record.kind,
      _record.name,
      _record.handler,
      _record.include,
      always,
      _record.stop_propagation,
      _record.immediate,
      _record.debounce,
      _record.throttle
    );
  } else {
    return event4;
  }
}
function on_click(msg) {
  return on("click", success(msg));
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
        (value2) => {
          let _pipe2 = value2;
          let _pipe$12 = map3(
            _pipe2,
            (_capture) => {
              return new$7(key3, _capture);
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

// build/dev/javascript/plinth/storage_ffi.mjs
function localStorage() {
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
function setItem(storage, keyName, keyValue) {
  try {
    storage.setItem(keyName, keyValue);
    return new Ok(null);
  } catch {
    return new Error2(null);
  }
}

// build/dev/javascript/varasto/varasto.mjs
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
function set(storage, key3, value2) {
  let _block;
  let _pipe = value2;
  let _pipe$1 = storage.writer(_pipe);
  _block = to_string3(_pipe$1);
  let encoded = _block;
  return setItem(storage.raw_storage, key3, encoded);
}

// build/dev/javascript/sonata/sonata/router.mjs
var FILEPATH = "src/sonata/router.gleam";
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
var Artist = class extends CustomType {
  constructor(id2) {
    super();
    this.id = id2;
  }
};
var Album = class extends CustomType {
  constructor(id2) {
    super();
    this.id = id2;
  }
};
var Song = class extends CustomType {
  constructor(id2) {
    super();
    this.id = id2;
  }
};
var Unknown = class extends CustomType {
};
function uri_to_route(uri) {
  let $ = uri.path;
  if ($ === "/") {
    return new Home();
  } else if ($ === "/login") {
    return new Login();
  } else if ($.startsWith("/artist/")) {
    let id2 = $.slice(8);
    return new Artist(id2);
  } else if ($.startsWith("/album/")) {
    let id2 = $.slice(7);
    return new Album(id2);
  } else if ($.startsWith("/song/")) {
    let id2 = $.slice(6);
    return new Song(id2);
  } else {
    return new Unknown();
  }
}
function get_route() {
  let $ = parse(location());
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "sonata/router",
      62,
      "get_route",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 1124,
        end: 1175,
        pattern_start: 1135,
        pattern_end: 1144
      }
    );
  }
  let route = $[0];
  return route;
}
function localhost() {
  let route = get_route();
  let $ = route.host;
  let $1 = route.port;
  if ($1 instanceof Some) {
    let $2 = $1[0];
    if ($2 === 1234) {
      if ($ instanceof Some) {
        let $3 = $[0];
        if ($3 === "localhost") {
          return true;
        } else if ($3 === "127.0.0.1") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function root_uri() {
  let route = get_route();
  let $ = localhost();
  if ($) {
    let $1 = parse("http://0.0.0.0:4747");
    if (!($1 instanceof Ok)) {
      throw makeError(
        "let_assert",
        FILEPATH,
        "sonata/router",
        44,
        "root_uri",
        "Pattern match failed, no pattern matched the value.",
        { value: $1, start: 756, end: 811, pattern_start: 767, pattern_end: 776 }
      );
    }
    let local = $1[0];
    return local;
  } else {
    return route;
  }
}
function direct(rel) {
  let $ = parse(rel);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "sonata/router",
      56,
      "direct",
      "Pattern match failed, no pattern matched the value.",
      { value: $, start: 960, end: 999, pattern_start: 971, pattern_end: 982 }
    );
  }
  let rel_url = $[0];
  let $1 = merge(root_uri(), rel_url);
  if (!($1 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "sonata/router",
      57,
      "direct",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $1,
        start: 1002,
        end: 1059,
        pattern_start: 1013,
        pattern_end: 1026
      }
    );
  }
  let direction = $1[0];
  return to_string2(direction);
}

// build/dev/javascript/sonata/md5.ffi.mjs
var import_js_md5 = __toESM(require_md5(), 1);
function new_(text3) {
  return (0, import_js_md5.default)(text3);
}

// build/dev/javascript/sonata/random_str.ffi.mjs
function new_2() {
  let uuid = self.crypto.randomUUID();
  return uuid.split("-")[0];
}

// build/dev/javascript/sonata/sonata/models/auth.mjs
var Auth = class extends CustomType {
  constructor(username, credentials) {
    super();
    this.username = username;
    this.credentials = credentials;
  }
};
var Credentials = class extends CustomType {
  constructor(salt, token2) {
    super();
    this.salt = salt;
    this.token = token2;
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
            (token2) => {
              return success(
                new Auth(username, new Credentials(salt, token2))
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
      ["token", string4(auth.credentials.token)]
    ])
  );
}
function hash_password(password) {
  let salt = new_2();
  let token2 = new_(password + salt);
  return new Credentials(salt, token2);
}

// build/dev/javascript/sonata/sonata/storage.mjs
var FILEPATH2 = "src/sonata/storage.gleam";
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
  let $ = localStorage();
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH2,
      "sonata/storage",
      21,
      "create",
      "Pattern match failed, no pattern matched the value.",
      { value: $, start: 408, end: 453, pattern_start: 419, pattern_end: 435 }
    );
  }
  let localstorage = $[0];
  return new$8(localstorage, storage_reader(), storage_writer);
}

// build/dev/javascript/sonata/sonata/model.mjs
var Model = class extends CustomType {
  constructor(route, layout, storage) {
    super();
    this.route = route;
    this.layout = layout;
    this.storage = storage;
  }
};
var Desktop = class extends CustomType {
};
var Mobile = class extends CustomType {
};
var Song2 = class extends CustomType {
  constructor(id2, title2, album2, artist, duration) {
    super();
    this.id = id2;
    this.title = title2;
    this.album = album2;
    this.artist = artist;
    this.duration = duration;
  }
};
var Album2 = class extends CustomType {
  constructor(id2, name2, version, artist, year) {
    super();
    this.id = id2;
    this.name = name2;
    this.version = version;
    this.artist = artist;
    this.year = year;
  }
};
var SongLyric = class extends CustomType {
  constructor(time, line) {
    super();
    this.time = time;
    this.line = line;
  }
};

// build/dev/javascript/sonata/sonata/elements.mjs
function song(song2, index5, attrs) {
  return div(
    prepend(class$("flex justify-between"), attrs),
    toList([
      div(
        toList([class$("flex gap-4 items-center")]),
        toList([
          span(
            toList([
              class$(
                "text-zinc-600 font-[Azeret_Mono] font-light text-sm"
              )
            ]),
            toList([text2(to_string(index5 + 1))])
          ),
          div(
            toList([class$("flex gap-2 items-center")]),
            toList([
              div(
                toList([class$("w-8 h-8 text-zinc-400")]),
                toList([musical_note()])
              ),
              div(
                toList([class$("flex flex-col gap")]),
                toList([
                  a(
                    toList([href("/song/" + song2.id)]),
                    toList([
                      span(
                        toList([
                          class$(
                            "text-sm text-zinc-100 hover:underline"
                          )
                        ]),
                        toList([text2(song2.title)])
                      )
                    ])
                  ),
                  span(
                    toList([
                      class$("text-sm text-zinc-500 font-light")
                    ]),
                    toList([text2(song2.artist)])
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
                "font-[Azeret_Mono] font-light text-zinc-500 text-sm"
              )
            ]),
            toList([text2("0:00")])
          ),
          div(
            toList([class$("h-6 w-6 text-zinc-500")]),
            toList([heart()])
          ),
          div(
            toList([class$("h-6 w-6 text-zinc-500")]),
            toList([ellipsis_vertical()])
          )
        ])
      )
    ])
  );
}
function album(album2) {
  return div(
    toList([
      class$(
        "flex flex-col w-42 gap-2 group p-2 rounded hover:bg-zinc-900/75"
      )
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
          img(
            toList([
              src(
                "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg"
              ),
              class$(
                "border-t-2 border-zinc-900/75 group-hover:border-zinc-900 object-cover rounded-md absolute"
              )
            ])
          ),
          div(
            toList([
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
        toList([class$("text-zinc-100")]),
        toList([text2(album2.name)])
      ),
      span(
        toList([class$("text-zinc-500 font-light text-xs")]),
        toList([text2(to_string(album2.year))])
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

// build/dev/javascript/sonata/sonata/components/artist_detail.mjs
var Model2 = class extends CustomType {
  constructor(id2, current_tab) {
    super();
    this.id = id2;
    this.current_tab = current_tab;
  }
};
var Home2 = class extends CustomType {
};
var Albums = class extends CustomType {
};
var SinglesEPs = class extends CustomType {
};
var About = class extends CustomType {
};
var ChangeTab = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
function tab_as_string(tab) {
  if (tab instanceof Home2) {
    return "Home";
  } else if (tab instanceof Albums) {
    return "Albums";
  } else if (tab instanceof SinglesEPs) {
    return "Singles & EPs";
  } else {
    return "About";
  }
}
function element3(attrs) {
  return element2("artist-detail", attrs, toList([]));
}
function tab_element(m, tab) {
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
      text2(tab_as_string(tab)),
      (() => {
        let $ = isEqual(tab, m.current_tab);
        if ($) {
          return div(
            toList([
              class$(
                "absolute top-9 w-full h-1 border-b border-violet-500"
              )
            ]),
            toList([])
          );
        } else {
          return none();
        }
      })()
    ])
  );
}
function init2(_) {
  return [new Model2("", new About()), none2()];
}
function update2(m, msg) {
  let tab = msg[0];
  return [
    (() => {
      let _record = m;
      return new Model2(_record.id, tab);
    })(),
    none2()
  ];
}
function view_home(m) {
  return toList([
    div(
      toList([class$("w-full space-y-4")]),
      toList([
        h1(
          toList([class$("font-semibold text-xl")]),
          toList([text2("Your Most Played")])
        ),
        div(
          toList([class$("space-y-4")]),
          index_map(
            (() => {
              let _pipe = new Song2(
                "0",
                "Fabulous",
                "To. X",
                "TAEYEON",
                0
              );
              return repeat(_pipe, 5);
            })(),
            (song2, index5) => {
              return song(song2, index5, toList([]));
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
      map(
        (() => {
          let _pipe = new Album2("", "To. X", "", "TAEYEON", 2023);
          return repeat(_pipe, 10);
        })(),
        (album2) => {
          return album(album2);
        }
      )
    )
  ]);
}
function view_about(m) {
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
              toList([text2("#1 On Sonata")])
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
function view2(m) {
  return div(
    toList([class$("font-[Poppins]")]),
    toList([
      div(
        toList([
          class$(
            "border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400"
          )
        ]),
        toList([
          tab_element(m, new Home2()),
          tab_element(m, new Albums()),
          tab_element(m, new SinglesEPs()),
          tab_element(m, new About())
        ])
      ),
      div(
        toList([class$("p-4 flex")]),
        (() => {
          let $ = m.current_tab;
          if ($ instanceof Home2) {
            return view_home(m);
          } else if ($ instanceof Albums) {
            return view_albums(m);
          } else if ($ instanceof About) {
            return view_about(m);
          } else {
            return toList([none()]);
          }
        })()
      )
    ])
  );
}
function register() {
  let component2 = component(init2, update2, view2, toList([]));
  return make_component(component2, "artist-detail");
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
var Parser = class extends CustomType {
  constructor(run3) {
    super();
    this.run = run3;
  }
};
var Check = class extends CustomType {
};
function run2(form2) {
  let $ = form2.run(form2.values, toList([]));
  let value2 = $[0];
  let errors = $[1];
  if (errors instanceof Empty) {
    return new Ok(value2);
  } else {
    return new Error2(
      (() => {
        let _record = form2;
        return new Form(_record.translator, _record.values, errors, _record.run);
      })()
    );
  }
}
function field2(name2, parser, continuation) {
  return new Schema(
    (values3, errors) => {
      let input2 = key_filter(values3, name2);
      let $ = parser.run(input2, new Check());
      let value2 = $[0];
      let new_errors = $[2];
      let _block;
      if (new_errors instanceof Empty) {
        _block = errors;
      } else {
        _block = prepend([name2, new_errors], errors);
      }
      let errors$1 = _block;
      return continuation(value2).run(values3, errors$1);
    }
  );
}
function success2(value2) {
  return new Schema((_, errors) => {
    return [value2, errors];
  });
}
function add_values(form2, values3) {
  let _record = form2;
  return new Form(
    _record.translator,
    append(values3, form2.values),
    _record.errors,
    _record.run
  );
}
function string_parser(inputs, status) {
  if (inputs instanceof Empty) {
    return ["", status, toList([])];
  } else {
    let input2 = inputs.head;
    return [input2, status, toList([])];
  }
}
function add_check(parser, checker) {
  return new Parser(
    (inputs, status) => {
      let $ = parser.run(inputs, status);
      let value2 = $[0];
      let status$1 = $[1];
      let errors = $[2];
      let _block;
      if (status$1 instanceof Check) {
        let $1 = checker(value2);
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
      return [value2, status$1, errors$1];
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
    return "must be more than " + to_string(limit) + " characters";
  } else if (error instanceof MustBeStringLengthLessThan) {
    let limit = error.limit;
    return "must be less than " + to_string(limit) + " characters";
  } else if (error instanceof MustBeIntMoreThan) {
    let limit = error.limit;
    return "must be more than " + to_string(limit);
  } else if (error instanceof MustBeIntLessThan) {
    let limit = error.limit;
    return "must be less than " + to_string(limit);
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
function new$9(schema) {
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
var parse_string = /* @__PURE__ */ new Parser(string_parser);

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
  constructor(method, headers, body2, scheme, host, port, path2, query) {
    super();
    this.method = method;
    this.headers = headers;
    this.body = body2;
    this.scheme = scheme;
    this.host = host;
    this.port = port;
    this.path = path2;
    this.query = query;
  }
};
function to_uri(request) {
  return new Uri(
    new Some(scheme_to_string(request.scheme)),
    new None(),
    new Some(request.host),
    request.port,
    request.path,
    request.query,
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
var Response = class extends CustomType {
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
async function raw_send(request) {
  try {
    return new Ok(await fetch(request));
  } catch (error) {
    return new Error2(new NetworkError(error.toString()));
  }
}
function from_fetch_response(response) {
  return new Response(
    response.status,
    List.fromArray([...response.headers]),
    response
  );
}
function request_common(request) {
  let url = to_string2(to_uri(request));
  let method = method_to_string(request.method).toUpperCase();
  let options = {
    headers: make_headers(request.headers),
    method
  };
  return [url, options];
}
function to_fetch_request(request) {
  let [url, options] = request_common(request);
  if (options.method !== "GET" && options.method !== "HEAD") options.body = request.body;
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
function send2(request) {
  let _pipe = request;
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
function do_send(request, handler) {
  return from(
    (dispatch) => {
      let _pipe = send2(request);
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
function send3(request, handler) {
  return do_send(request, handler);
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

// build/dev/javascript/sonata/sonata/api_helper.mjs
var FILEPATH3 = "src/sonata/api_helper.gleam";
var Ping = class extends CustomType {
};
var SubsonicError = class extends CustomType {
  constructor(code2, message2) {
    super();
    this.code = code2;
    this.message = message2;
  }
};
function construct_req(auth_details, path2, query, decoder2, msg) {
  let $ = parse(direct(path2));
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH3,
      "sonata/api_helper",
      22,
      "construct_req",
      "Pattern match failed, no pattern matched the value.",
      { value: $, start: 450, end: 510, pattern_start: 461, pattern_end: 477 }
    );
  }
  let original_uri = $[0];
  let _block;
  let _record = original_uri;
  _block = new Uri(
    _record.scheme,
    _record.userinfo,
    _record.host,
    _record.port,
    _record.path,
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
                prepend(["c", "sonata"], prepend(["v", "6.1.4"], query))
              )
            )
          )
        )
      )
    ),
    _record.fragment
  );
  let request_uri = _block;
  let $1 = to(
    (() => {
      let _pipe = request_uri;
      return to_string2(_pipe);
    })()
  );
  if (!($1 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH3,
      "sonata/api_helper",
      39,
      "construct_req",
      "Pattern match failed, no pattern matched the value.",
      { value: $1, start: 891, end: 952, pattern_start: 902, pattern_end: 909 }
    );
  }
  let req = $1[0];
  return send3(
    req,
    expect_json(
      subfield(
        toList(["subsonic-response", "status"]),
        string3,
        (status) => {
          if (status === "ok") {
            return decoder2;
          } else if (status === "failed") {
            return subfield(
              toList(["subsonic-response", "error", "code"]),
              int2,
              (code2) => {
                return subfield(
                  toList(["subsonic-response", "error", "message"]),
                  string3,
                  (message2) => {
                    return success(new SubsonicError(code2, message2));
                  }
                );
              }
            );
          } else {
            throw makeError(
              "panic",
              FILEPATH3,
              "sonata/api_helper",
              61,
              "construct_req",
              "this isnt supposed to happen wtf?",
              {}
            );
          }
        }
      ),
      msg
    )
  );
}

// build/dev/javascript/sonata/sonata/msg.mjs
var Router = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var SubsonicResponse = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};

// build/dev/javascript/sonata/sonata/api.mjs
function ping(auth_details) {
  return construct_req(
    auth_details,
    "/rest/ping.view",
    toList([]),
    success(new Ping()),
    (var0) => {
      return new SubsonicResponse(var0);
    }
  );
}

// build/dev/javascript/sonata/sonata/components/login.mjs
var FILEPATH4 = "src/sonata/components/login.gleam";
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
var SonataMsg = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
var Login2 = class extends CustomType {
  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
  }
};
function element4() {
  return element2("login-page", toList([]), toList([]));
}
function update3(m, msg) {
  if (msg instanceof LoginSubmitted) {
    let $ = msg[0];
    if ($ instanceof Ok) {
      let login_data = $[0];
      let auth = new Auth(
        login_data.username,
        hash_password(login_data.password)
      );
      return [
        (() => {
          let _record = m;
          return new Model3(_record.storage, _record.login_form, auth);
        })(),
        (() => {
          let _pipe = ping(auth);
          return map4(_pipe, (a2) => {
            return new SonataMsg(a2);
          });
        })()
      ];
    } else {
      let updated_form = $[0];
      return [
        (() => {
          let _record = m;
          return new Model3(_record.storage, updated_form, _record.auth_details);
        })(),
        none2()
      ];
    }
  } else {
    let $ = msg[0];
    if ($ instanceof SubsonicResponse) {
      let resp = $[0];
      if (resp instanceof Ok) {
        let $1 = resp[0];
        if ($1 instanceof Ping) {
          let _pipe = m.storage;
          set(_pipe, "auth", new Storage(m.auth_details));
          let $2 = parse("/");
          if (!($2 instanceof Ok)) {
            throw makeError(
              "let_assert",
              FILEPATH4,
              "sonata/components/login",
              77,
              "update",
              "Pattern match failed, no pattern matched the value.",
              {
                value: $2,
                start: 1586,
                end: 1622,
                pattern_start: 1597,
                pattern_end: 1605
              }
            );
          }
          let home3 = $2[0];
          return [m, load(home3)];
        } else {
          return [m, none2()];
        }
      } else {
        return [m, none2()];
      }
    } else {
      return [m, none2()];
    }
  }
}
function login_form() {
  return new$9(
    field2(
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
            return success2(new Login2(username, password));
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
      new Auth("", new Credentials("", ""))
    ),
    none2()
  ];
}
function view3(m) {
  let submitted = (fields) => {
    let _pipe = m.login_form;
    let _pipe$1 = add_values(_pipe, fields);
    let _pipe$2 = run2(_pipe$1);
    return new LoginSubmitted(_pipe$2);
  };
  return div(
    toList([
      class$(
        "bg-linear-to-t from-zinc-950 to-zinc-900 font-[Poppins] flex h-screen mx-auto p-4 overflow-none"
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
                "flex bg-zinc-800 rounded-lg justify-center p-4"
              )
            ]),
            toList([
              div(
                toList([class$("flex flex-col gap-8")]),
                toList([
                  h1(
                    toList([class$("font-bold text-4xl self-center")]),
                    toList([text2("Sonata")])
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
                            toList([text2("Username")])
                          ),
                          prepend(
                            input(
                              toList([
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
  let component2 = component(init3, update3, view3, toList([]));
  return make_component(component2, "login-page");
}

// build/dev/javascript/sonata/sonata/components/song_detail.mjs
var Model4 = class extends CustomType {
  constructor(id2, current_tab) {
    super();
    this.id = id2;
    this.current_tab = current_tab;
  }
};
var Lyrics = class extends CustomType {
};
var More = class extends CustomType {
};
var ChangeTab2 = class extends CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
};
function tab_as_string2(tab) {
  if (tab instanceof Lyrics) {
    return "Lyrics";
  } else {
    return "More";
  }
}
function element5(attrs) {
  return element2("song-detail", attrs, toList([]));
}
function tab_element2(m, tab) {
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
      text2(tab_as_string2(tab)),
      (() => {
        let $ = isEqual(tab, m.current_tab);
        if ($) {
          return div(
            toList([
              class$(
                "absolute top-9 w-full h-1 border-b border-violet-500"
              )
            ]),
            toList([])
          );
        } else {
          return none();
        }
      })()
    ])
  );
}
function init4(_) {
  return [new Model4("", new Lyrics()), none2()];
}
function update4(m, msg) {
  let tab = msg[0];
  return [
    (() => {
      let _record = m;
      return new Model4(_record.id, tab);
    })(),
    none2()
  ];
}
function view_lyrics(m) {
  let lyrics = toList([
    new SongLyric(2e3, "Darling, I'm a masterpiece, a work of art"),
    new SongLyric(4e3, "Hi, my name is Fabulous, your favorite star"),
    new SongLyric(6e3, "Diamonds on my wrist, come, blow me a kiss"),
    new SongLyric(
      8e3,
      "'Cause, hi, my name is Fabulous, your favorite star"
    ),
    new SongLyric(11e3, "Oh, when I walk down the boulevard"),
    new SongLyric(12e3, "People call my name")
  ]);
  let current_time = 6e3;
  return toList([
    div(
      toList([class$("flex px-6 py-8 gap-24")]),
      toList([
        div(
          toList([class$("flex flex-col gap-4 text-zinc-500")]),
          toList([
            i(
              toList([class$("text-4xl ph ph-clock-countdown")]),
              toList([])
            ),
            i(
              toList([class$("text-4xl ph ph-text-aa")]),
              toList([])
            )
          ])
        ),
        div(
          toList([class$("space-y-2")]),
          map(
            lyrics,
            (lyric) => {
              return p(
                toList([
                  class$("font-semibold text-2xl"),
                  (() => {
                    let $ = current_time > lyric.time;
                    if ($) {
                      return class$("text-zinc-300");
                    } else {
                      return class$("text-zinc-600");
                    }
                  })()
                ]),
                toList([text2(lyric.line)])
              );
            }
          )
        )
      ])
    )
  ]);
}
function view4(m) {
  return div(
    toList([class$("font-[Poppins]")]),
    toList([
      div(
        toList([
          class$(
            "border-b border-zinc-800 py-4 px-8 relative flex gap-8 text-zinc-400"
          )
        ]),
        toList([tab_element2(m, new Lyrics()), tab_element2(m, new More())])
      ),
      div(
        toList([class$("p-4")]),
        (() => {
          let $ = m.current_tab;
          if ($ instanceof Lyrics) {
            return view_lyrics(m);
          } else {
            return toList([none()]);
          }
        })()
      )
    ])
  );
}
function register3() {
  let component2 = component(init4, update4, view4, toList([]));
  return make_component(component2, "song-detail");
}

// build/dev/javascript/sonata/sonata/pages/album.mjs
var to_x_song_names = /* @__PURE__ */ toList([
  "To X.",
  "Melt Away",
  "Burn It Down",
  "Nightmare",
  "All For Nothing",
  "Fabulous"
]);
function desktop_page() {
  return div(
    toList([
      class$(
        "flex-1 flex gap-4 p-8 rounded-md border border-zinc-800 overflow-hidden"
      )
    ]),
    toList([
      div(
        toList([
          class$(
            "flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden pr-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"
          )
        ]),
        toList([
          h1(
            toList([class$("text-3xl text-zinc-300 font-semibold")]),
            toList([text2("To X.")])
          ),
          div(
            toList([
              class$("flex gap-3 text-xs text-zinc-400 items-center")
            ]),
            toList([
              span(
                toList([class$("flex gap-2")]),
                toList([
                  div(
                    toList([class$("w-4 h-4")]),
                    toList([user()])
                  ),
                  span(
                    toList([class$("text-zinc-300")]),
                    toList([text2("TAEYEON")])
                  )
                ])
              ),
              span(toList([]), toList([text2("\u2022")])),
              span(toList([]), toList([text2("2023")])),
              span(toList([]), toList([text2("\u2022")])),
              span(toList([]), toList([text2("6 songs")])),
              span(toList([]), toList([text2("\u2022")])),
              span(toList([]), toList([text2("17 min, 55 sec")]))
            ])
          ),
          div(
            toList([
              class$("text-zinc-400 flex gap-4 items-center -ml-1")
            ]),
            toList([
              div(
                toList([class$("h-10 w-10 text-[#8571ee]")]),
                toList([play_circle()])
              ),
              div(
                toList([class$("h-8 w-8")]),
                toList([arrows_right_left()])
              ),
              div(
                toList([class$("h-8 w-8")]),
                toList([plus_circle()])
              ),
              div(
                toList([class$("h-8 w-8")]),
                toList([arrow_down_tray()])
              ),
              div(
                toList([class$("h-8 w-8")]),
                toList([link()])
              ),
              div(
                toList([class$("h-8 w-8")]),
                toList([ellipsis_horizontal()])
              )
            ])
          ),
          div(
            toList([class$("flex flex-col gap-4")]),
            (() => {
              let _pipe = index_map(
                to_x_song_names,
                (title2, index5) => {
                  return song(
                    new Song2("", title2, "To X.", "TAEYEON", 0),
                    index5,
                    toList([])
                  );
                }
              );
              let _pipe$1 = repeat(_pipe, 2);
              return flatten(_pipe$1);
            })()
          )
        ])
      ),
      div(
        toList([class$("flex flex-col gap-8")]),
        toList([
          img(
            toList([
              src(
                "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg"
              ),
              class$("max-w-80 max-h-80 object-scale rounded-md")
            ])
          ),
          div(
            toList([class$("flex flex-wrap gap-4")]),
            toList([tag("K-Pop"), tag("R&B")])
          )
        ])
      )
    ])
  );
}
function page_mobile() {
  return div(
    toList([class$("flex justify-center flex-col py-4 p-12 gap-6")]),
    toList([
      img(
        toList([
          src(
            "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg"
          ),
          class$(
            "self-center w-72 h-72 object-scale h-fit rounded-md"
          )
        ])
      ),
      div(
        toList([class$("flex justify-between items-center")]),
        toList([
          div(
            toList([class$("flex flex-col gap-4")]),
            toList([
              h1(
                toList([
                  class$("text-3xl text-zinc-300 font-semibold")
                ]),
                toList([text2("To X.")])
              ),
              span(
                toList([class$("flex gap-2 items-center")]),
                toList([
                  div(
                    toList([class$("w-4 h-4")]),
                    toList([user()])
                  ),
                  span(
                    toList([class$("text-zinc-300")]),
                    toList([text2("TAEYEON")])
                  )
                ])
              )
            ])
          ),
          div(
            toList([class$("flex gap-2 text-zinc-500")]),
            toList([
              div(
                toList([class$("h-12 w-12")]),
                toList([ellipsis_horizontal2()])
              ),
              div(
                toList([class$("h-12 w-12 text-[#8571ee]")]),
                toList([play_circle()])
              )
            ])
          )
        ])
      ),
      div(
        toList([class$("flex flex-col gap-4")]),
        (() => {
          let _pipe = index_map(
            to_x_song_names,
            (title2, index5) => {
              return song(
                new Song2("", title2, "To X.", "TAEYEON", 0),
                index5,
                toList([])
              );
            }
          );
          let _pipe$1 = repeat(_pipe, 2);
          return flatten(_pipe$1);
        })()
      )
    ])
  );
}
function page(m) {
  let $ = m.layout;
  if ($ instanceof Desktop) {
    return desktop_page();
  } else {
    return page_mobile();
  }
}

// build/dev/javascript/sonata/sonata/pages/artist.mjs
function page2() {
  return div(
    toList([
      class$(
        "flex-1 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500"
      )
    ]),
    toList([
      div(
        toList([
          class$("relative h-[45%] p-8 flex items-end"),
          style(
            "background-image",
            "url('https://image-cdn-ak.spotifycdn.com/image/ab676186000001947bba80a0198cfd4a7f6c3c69')"
          ),
          class$("rounded-tl-md bg-cover bg-center")
        ]),
        toList([
          div(
            toList([
              class$(
                "bg-linear-to-l from-zinc-950 to-zinc-950/20 absolute top-0 left-0 h-full w-full"
              )
            ]),
            toList([])
          ),
          div(
            toList([
              class$("z-20 flex items-center justify-between w-full")
            ]),
            toList([
              div(
                toList([]),
                toList([
                  h1(
                    toList([class$("font-bold text-5xl")]),
                    toList([text2("TAEYEON")])
                  )
                ])
              ),
              div(
                toList([class$("flex items-center")]),
                toList([
                  div(
                    toList([class$("flex items-center relative")]),
                    toList([
                      div(
                        toList([
                          class$(
                            "ml-2 z-5 absolute rounded-full bg-black w-8 h-8"
                          )
                        ]),
                        toList([])
                      ),
                      i(
                        toList([
                          class$(
                            "z-10 ph-fill ph-play-circle text-6xl text-violet-500"
                          )
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
      ),
      element3(toList([]))
    ])
  );
}

// build/dev/javascript/sonata/sonata/pages/home.mjs
function page3() {
  return div(
    toList([
      class$(
        "flex-1 flex flex-col p-4 rounded-lg border border-zinc-800"
      )
    ]),
    toList([])
  );
}

// build/dev/javascript/sonata/sonata/pages/song.mjs
function page4() {
  return div(
    toList([
      class$(
        "flex-1 rounded-md border border-zinc-800 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700"
      )
    ]),
    toList([
      div(
        toList([class$("flex gap-8 p-8")]),
        toList([
          img(
            toList([
              src(
                "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg"
              ),
              class$("w-80 h-80 object-cover rounded-md")
            ])
          ),
          div(
            toList([class$("flex flex-col gap-4")]),
            toList([
              h1(
                toList([
                  class$("text-3xl text-zinc-300 font-semibold")
                ]),
                toList([text2("Fabulous")])
              ),
              div(
                toList([
                  class$(
                    "flex gap-3 text-xs text-zinc-400 items-center"
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
                      span(
                        toList([class$("text-zinc-300")]),
                        toList([text2("TAEYEON")])
                      )
                    ])
                  ),
                  span(toList([]), toList([text2("\u2022")])),
                  span(
                    toList([class$("flex gap-2 items-center")]),
                    toList([
                      i(
                        toList([class$("text-xl ph ph-vinyl-record")]),
                        toList([])
                      ),
                      span(
                        toList([class$("text-zinc-300")]),
                        toList([text2("To X.")])
                      )
                    ])
                  ),
                  span(toList([]), toList([text2("\u2022")])),
                  span(toList([]), toList([text2("2023")])),
                  span(toList([]), toList([text2("\u2022")])),
                  span(toList([]), toList([text2("2:51")])),
                  span(toList([]), toList([text2("\u2022")])),
                  span(toList([]), toList([text2("69,727,420")]))
                ])
              ),
              div(
                toList([
                  class$(
                    "text-zinc-400 flex gap-4 items-center -ml-1"
                  )
                ]),
                toList([
                  i(
                    toList([
                      class$(
                        "text-4xl text-violet-500 ph-fill ph-play-circle"
                      )
                    ]),
                    toList([])
                  ),
                  i(
                    toList([class$("text-2xl ph ph-plus-circle")]),
                    toList([])
                  ),
                  i(
                    toList([class$("text-2xl ph ph-download-simple")]),
                    toList([])
                  ),
                  i(
                    toList([class$("text-2xl ph ph-link")]),
                    toList([])
                  ),
                  i(
                    toList([class$("text-2xl ph ph-dots-three")]),
                    toList([])
                  )
                ])
              ),
              div(
                toList([class$("flex flex-wrap gap-4")]),
                toList([tag("K-Pop"), tag("R&B")])
              )
            ])
          )
        ])
      ),
      element5(toList([]))
    ])
  );
}

// build/dev/javascript/sonata/sonata.mjs
var FILEPATH5 = "src/sonata.gleam";
function on_url_change(url) {
  let _pipe = uri_to_route(url);
  let _pipe$1 = new ChangeRoute(_pipe);
  return new Router(_pipe$1);
}
function init5(_) {
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
  let _block$1;
  let $ = (() => {
    let _pipe$1 = self2();
    return innerWidth(_pipe$1);
  })() < 800;
  if ($) {
    _block$1 = new Mobile();
  } else {
    _block$1 = new Desktop();
  }
  let layout = _block$1;
  echo(layout, "src/sonata.gleam", 52);
  let m = new Model(route, layout, create());
  return [m, init(on_url_change)];
}
function update5(m, msg) {
  if (msg instanceof Router) {
    let route = msg[0][0];
    return [
      (() => {
        let _record = m;
        return new Model(route, _record.layout, _record.storage);
      })(),
      none2()
    ];
  } else {
    return [m, none2()];
  }
}
function mobile_nav_button(inactive, active, name2, is_active, attrs) {
  return div(
    prepend(
      class$("flex flex-col gap-2 items-center"),
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
      div(
        toList([class$("h-8 w-8")]),
        toList([
          (() => {
            if (is_active) {
              return active;
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
function mobile_view(m, page5) {
  return div(
    toList([
      class$(
        "font-['Poppins'] h-screen flex relative flex-col p-4 gap-2 overflow-none"
      )
    ]),
    toList([
      page5,
      div(
        toList([class$("")]),
        toList([
          div(
            toList([class$("flex justify-evenly")]),
            toList([
              mobile_nav_button(
                home2(),
                home(),
                "Home",
                isEqual(m.route, new Home()),
                toList([])
              ),
              mobile_nav_button(
                sparkles(),
                sparkles2(),
                "Discover",
                false,
                toList([])
              ),
              mobile_nav_button(
                magnifying_glass(),
                magnifying_glass_circle(),
                "Search",
                false,
                toList([])
              ),
              mobile_nav_button(
                queue_list(),
                queue_list2(),
                "Library",
                false,
                toList([])
              )
            ])
          )
        ])
      )
    ])
  );
}
function nav_button(inactive, active, name2, is_active, attrs) {
  return div(
    prepend(
      class$(
        "w-52 font-normal flex gap-4 items-center hover:bg-zinc-900 px-4 py-2 rounded-lg"
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
      div(
        toList([class$("h-8 w-8")]),
        toList([
          (() => {
            if (is_active) {
              return active;
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
function button2(icon, name2, attrs) {
  return div(
    prepend(
      class$(
        "w-52 text-zinc-500 font-normal flex gap-2 items-center hover:bg-zinc-900 px-4 py-2 rounded-lg"
      ),
      attrs
    ),
    toList([
      div(toList([class$("h-8 w-8")]), toList([icon])),
      h1(toList([]), toList([text2(name2)]))
    ])
  );
}
function desktop_view(m, page5) {
  return div(
    toList([
      class$(
        "font-['Poppins'] flex flex-col h-screen px-3 py-4 gap-2 overflow-hidden"
      )
    ]),
    toList([
      div(
        toList([class$("flex gap-4")]),
        toList([
          button2(
            i(
              toList([class$("text-3xl ph ph-cards-three")]),
              toList([])
            ),
            "Library",
            toList([class$("w-42")])
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
          button2(
            i(
              toList([class$("text-3xl ph ph-sparkle")]),
              toList([])
            ),
            "Discover",
            toList([class$("w-42")])
          )
        ])
      ),
      div(
        toList([class$("flex-1 min-h-0 flex gap-2")]),
        toList([
          div(
            toList([
              class$(
                "flex flex-col gap-2 border border-zinc-800 rounded-lg py-4 px-1"
              )
            ]),
            toList([
              button2(
                i(
                  toList([class$("text-3xl ph ph-playlist")]),
                  toList([])
                ),
                "Playlists",
                toList([])
              ),
              button2(
                i(
                  toList([class$("text-3xl ph ph-heart-straight")]),
                  toList([])
                ),
                "Liked Songs",
                toList([])
              ),
              a(
                toList([href("/album/")]),
                toList([
                  button2(
                    i(
                      toList([class$("text-3xl ph ph-vinyl-record")]),
                      toList([])
                    ),
                    "Albums",
                    toList([])
                  )
                ])
              ),
              a(
                toList([href("/artist/")]),
                toList([
                  button2(
                    i(
                      toList([class$("text-3xl ph ph-user-sound")]),
                      toList([])
                    ),
                    "Artists",
                    toList([])
                  )
                ])
              )
            ])
          ),
          div(
            toList([class$("flex-1 flex flex-col gap-2")]),
            toList([
              page5,
              div(
                toList([
                  class$(
                    "h-20 rounded-lg p-4 border border-zinc-800 flex items-center justify-between"
                  )
                ]),
                toList([
                  div(
                    toList([class$("flex gap-2 items-center")]),
                    toList([
                      img(
                        toList([
                          src(
                            "https://ia800503.us.archive.org/27/items/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe/mbid-c8cda63d-d94a-4b80-9d94-d8c253e988fe-37355361520_thumb250.jpg"
                          ),
                          class$("w-14 h-14 object-cover rounded-md")
                        ])
                      ),
                      div(
                        toList([class$("flex flex-col")]),
                        toList([
                          span(
                            toList([class$("font-medium")]),
                            toList([text2("Track Name")])
                          ),
                          span(
                            toList([class$("font-light text-sm")]),
                            toList([text2("Artist")])
                          )
                        ])
                      )
                    ])
                  ),
                  div(
                    toList([class$("space-y-2")]),
                    toList([
                      div(
                        toList([
                          class$(
                            "flex gap-4 items-center justify-center"
                          )
                        ]),
                        toList([
                          i(
                            toList([
                              class$("text-xl ph ph-shuffle-simple")
                            ]),
                            toList([])
                          ),
                          i(
                            toList([
                              class$("text-xl ph-fill ph-skip-back")
                            ]),
                            toList([])
                          ),
                          i(
                            toList([
                              class$(
                                "text-4xl ph-fill ph-play-circle"
                              )
                            ]),
                            toList([])
                          ),
                          i(
                            toList([
                              class$(
                                "text-xl ph-fill ph-skip-forward"
                              )
                            ]),
                            toList([])
                          ),
                          i(
                            toList([class$("text-xl ph ph-repeat")]),
                            toList([])
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
                            toList([text2("0:00")])
                          ),
                          div(
                            toList([
                              class$(
                                "w-96 bg-zinc-800 rounded-full h-1.5"
                              )
                            ]),
                            toList([
                              div(
                                toList([
                                  class$(
                                    "bg-zinc-100 rounded-full h-1.5"
                                  ),
                                  style("width", "45%")
                                ]),
                                toList([])
                              )
                            ])
                          ),
                          span(
                            toList([]),
                            toList([text2("3:14")])
                          )
                        ])
                      )
                    ])
                  ),
                  div(
                    toList([class$("flex gap-2")]),
                    toList([
                      i(
                        toList([
                          class$("text-3xl ph ph-heart-straight")
                        ]),
                        toList([])
                      ),
                      i(
                        toList([class$("text-3xl ph ph-plus-circle")]),
                        toList([])
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
function view5(m) {
  let _block;
  let $ = m.route;
  if ($ instanceof Home) {
    _block = page3();
  } else if ($ instanceof Artist) {
    let id2 = $.id;
    _block = page2();
  } else if ($ instanceof Album) {
    let id2 = $.id;
    _block = page(m);
  } else if ($ instanceof Song) {
    let id2 = $.id;
    _block = page4();
  } else {
    _block = page3();
  }
  let page5 = _block;
  let _block$1;
  let $1 = m.layout;
  if ($1 instanceof Desktop) {
    _block$1 = desktop_view(m, page5);
  } else {
    _block$1 = mobile_view(m, page5);
  }
  let page_that_got_laid = _block$1;
  let $2 = m.route;
  if ($2 instanceof Login) {
    return element4();
  } else {
    return page_that_got_laid;
  }
}
function main() {
  let app = application(init5, update5, view5);
  let $ = register2();
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH5,
      "sonata",
      31,
      "main",
      "Pattern match failed, no pattern matched the value.",
      { value: $, start: 657, end: 692, pattern_start: 668, pattern_end: 673 }
    );
  }
  let $1 = register3();
  if (!($1 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH5,
      "sonata",
      32,
      "main",
      "Pattern match failed, no pattern matched the value.",
      { value: $1, start: 695, end: 736, pattern_start: 706, pattern_end: 711 }
    );
  }
  let $2 = register();
  if (!($2 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH5,
      "sonata",
      33,
      "main",
      "Pattern match failed, no pattern matched the value.",
      { value: $2, start: 739, end: 782, pattern_start: 750, pattern_end: 755 }
    );
  }
  let $3 = start3(app, "#app", 0);
  if (!($3 instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH5,
      "sonata",
      34,
      "main",
      "Pattern match failed, no pattern matched the value.",
      { value: $3, start: 785, end: 832, pattern_start: 796, pattern_end: 801 }
    );
  }
  return $3;
}
function echo(value2, file, line) {
  const grey = "\x1B[90m";
  const reset_color = "\x1B[39m";
  const file_line = `${file}:${line}`;
  const string_value = echo$inspect(value2);
  if (globalThis.process?.stderr?.write) {
    const string6 = `${grey}${file_line}${reset_color}
${string_value}
`;
    process.stderr.write(string6);
  } else if (globalThis.Deno) {
    const string6 = `${grey}${file_line}${reset_color}
${string_value}
`;
    globalThis.Deno.stderr.writeSync(new TextEncoder().encode(string6));
  } else {
    const string6 = `${file_line}
${string_value}`;
    globalThis.console.log(string6);
  }
  return value2;
}
function echo$inspectString(str) {
  let new_str = '"';
  for (let i2 = 0; i2 < str.length; i2++) {
    let char = str[i2];
    if (char == "\n") new_str += "\\n";
    else if (char == "\r") new_str += "\\r";
    else if (char == "	") new_str += "\\t";
    else if (char == "\f") new_str += "\\f";
    else if (char == "\\") new_str += "\\\\";
    else if (char == '"') new_str += '\\"';
    else if (char < " " || char > "~" && char < "\xA0") {
      new_str += "\\u{" + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0") + "}";
    } else {
      new_str += char;
    }
  }
  new_str += '"';
  return new_str;
}
function echo$inspectDict(map7) {
  let body2 = "dict.from_list([";
  let first = true;
  let key_value_pairs = [];
  map7.forEach((value2, key3) => {
    key_value_pairs.push([key3, value2]);
  });
  key_value_pairs.sort();
  key_value_pairs.forEach(([key3, value2]) => {
    if (!first) body2 = body2 + ", ";
    body2 = body2 + "#(" + echo$inspect(key3) + ", " + echo$inspect(value2) + ")";
    first = false;
  });
  return body2 + "])";
}
function echo$inspectCustomType(record) {
  const props = globalThis.Object.keys(record).map((label2) => {
    const value2 = echo$inspect(record[label2]);
    return isNaN(parseInt(label2)) ? `${label2}: ${value2}` : value2;
  }).join(", ");
  return props ? `${record.constructor.name}(${props})` : record.constructor.name;
}
function echo$inspectObject(v) {
  const name2 = Object.getPrototypeOf(v)?.constructor?.name || "Object";
  const props = [];
  for (const k of Object.keys(v)) {
    props.push(`${echo$inspect(k)}: ${echo$inspect(v[k])}`);
  }
  const body2 = props.length ? " " + props.join(", ") + " " : "";
  const head = name2 === "Object" ? "" : name2 + " ";
  return `//js(${head}{${body2}})`;
}
function echo$inspect(v) {
  const t = typeof v;
  if (v === true) return "True";
  if (v === false) return "False";
  if (v === null) return "//js(null)";
  if (v === void 0) return "Nil";
  if (t === "string") return echo$inspectString(v);
  if (t === "bigint" || t === "number") return v.toString();
  if (globalThis.Array.isArray(v))
    return `#(${v.map(echo$inspect).join(", ")})`;
  if (v instanceof List)
    return `[${v.toArray().map(echo$inspect).join(", ")}]`;
  if (v instanceof UtfCodepoint)
    return `//utfcodepoint(${String.fromCodePoint(v.value)})`;
  if (v instanceof BitArray) return echo$inspectBitArray(v);
  if (v instanceof CustomType) return echo$inspectCustomType(v);
  if (echo$isDict(v)) return echo$inspectDict(v);
  if (v instanceof Set)
    return `//js(Set(${[...v].map(echo$inspect).join(", ")}))`;
  if (v instanceof RegExp) return `//js(${v})`;
  if (v instanceof Date) return `//js(Date("${v.toISOString()}"))`;
  if (v instanceof Function) {
    const args = [];
    for (const i2 of Array(v.length).keys())
      args.push(String.fromCharCode(i2 + 97));
    return `//fn(${args.join(", ")}) { ... }`;
  }
  return echo$inspectObject(v);
}
function echo$inspectBitArray(bitArray) {
  let endOfAlignedBytes = bitArray.bitOffset + 8 * Math.trunc(bitArray.bitSize / 8);
  let alignedBytes = bitArraySlice(
    bitArray,
    bitArray.bitOffset,
    endOfAlignedBytes
  );
  let remainingUnalignedBits = bitArray.bitSize % 8;
  if (remainingUnalignedBits > 0) {
    let remainingBits = bitArraySliceToInt(
      bitArray,
      endOfAlignedBytes,
      bitArray.bitSize,
      false,
      false
    );
    let alignedBytesArray = Array.from(alignedBytes.rawBuffer);
    let suffix = `${remainingBits}:size(${remainingUnalignedBits})`;
    if (alignedBytesArray.length === 0) {
      return `<<${suffix}>>`;
    } else {
      return `<<${Array.from(alignedBytes.rawBuffer).join(", ")}, ${suffix}>>`;
    }
  } else {
    return `<<${Array.from(alignedBytes.rawBuffer).join(", ")}>>`;
  }
}
function echo$isDict(value2) {
  try {
    return value2 instanceof Dict;
  } catch {
    return false;
  }
}

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
