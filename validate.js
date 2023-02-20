const crypto = require('crypto');
const encryptionType = 'aes-256-cbc';
const encryptionEncoding = 'base64';
const bufferEncryption = 'utf-8';
const AesKey = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEF';
    const AesIV = 'ABCDEFGHIJKLMNOP';
  

  async function encrypt(jsonObject) {
    const val = JSON.stringify(jsonObject);
    const key = Buffer.from(this.AesKey, bufferEncryption);
    const iv = Buffer.from(this.AesIV, bufferEncryption);
    const cipher = crypto.createCipheriv(encryptionType, key, iv);
    let encrypted = cipher.update(val, bufferEncryption, encryptionEncoding);
    encrypted += cipher.final(encryptionEncoding);
    return encrypted;
  }

  async function decrypt(base64String) {
    const buff = Buffer.from(base64String, encryptionEncoding);
    const key = Buffer.from(this.AesKey, bufferEncryption);
    const iv = Buffer.from(this.AesIV, bufferEncryption);
    const decipher = crypto.createDecipheriv(encryptionType, key, iv);
    const deciphered = decipher.update(buff).toString() + decipher.final().toString();
    return JSON.parse(deciphered);
  }


module.exports = { encrypt, decrypt};