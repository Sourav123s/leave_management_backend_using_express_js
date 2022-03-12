const { rejects } = require("assert");
const crypto = require("crypto");
const { resolve } = require("path");

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      }

      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

function verfiPassword(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);

      resolve(key == derivedKey.toString("hex"));
    });
  });
}

module.exports = {
  hashPassword,
  verfiPassword,
};
