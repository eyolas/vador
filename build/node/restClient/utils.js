"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNotEmpty = isNotEmpty;

function isNotEmpty(arr) {
  return arr && Array.isArray(arr) && arr.length;
}