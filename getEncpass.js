const crypto = require('crypto')
const { promisify } = require('util');

const makePassword = async (password, salt) => {

    const hasher = async (password , salt) => {
        
        const generateSalt = async (length = 16) => crypto.randomBytes(length).toString('base64');

        // PBKDF2
        const encode = async (password, salt) => {
            const pbkdf2 = promisify(crypto.pbkdf2);
            return `${salt}$${(await pbkdf2(password, salt, 390000, 64, 'sha256')).toString('base64')}`;
        }

        return await encode(password, salt || await generateSalt());
    }

    return await hasher(password, salt);
}

makePassword('admin').then((pass) => console.log(pass))