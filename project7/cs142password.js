const crypto = require("crypto");

/**
 * Return a salted and hashed password entry from a clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry where passwordEntry is an object with two
 * string properties:
 *    salt - The salt used for the password.
 *    hash - The sha1 hash of the password and salt.
 */
function makePasswordEntry(clearTextPassword){
    const salt = crypto.randomBytes(8).toString("hex");
    const password_digest = crypto.createHash("sha1").update(salt + clearTextPassword).digest("hex");
    return {salt, password_digest};
}

/**
 * Return true if the specified clear text password and salt generates the
 * specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword){
    const computedHash = crypto.createHash("sha1").update(salt + clearTextPassword).digest("hex");
    return computedHash === hash;
}

module.exports = {makePasswordEntry, doesPasswordMatch};