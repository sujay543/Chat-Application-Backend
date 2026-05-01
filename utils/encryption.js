const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update('your_secret_key').digest('base64').substr(0, 32);

//encryption function
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: iv.toString('hex'),
        content: encrypted
    };
}

//decryption function
function decrypt(message) {
   if (!message) return '';

    // if already plain text (safety fallback)
     if (!message.iv) {
        return message.content;
    }

    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        Buffer.from(message.iv, 'hex')
    );

    let decrypted = decipher.update(message.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = { encrypt, decrypt };