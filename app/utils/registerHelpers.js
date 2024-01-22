const bcrypt = require("bcryptjs");
require("dotenv").config();
const crypto = require("crypto");

function encryptSensitiveData(cardNumber, identityNumber) {
  const algorithm = "aes-256-cbc";
  const iv = process.env.INITIALIZE_VECTOR;
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  const cipherCardNumber = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
  const encryptedCardNumber = Buffer.concat([
    cipherCardNumber.update(cardNumber),
    cipherCardNumber.final(),
  ]).toString("hex");

  const cipherIdentityNumber = crypto.createCipheriv(
    algorithm,
    ENCRYPTION_KEY,
    iv
  );
  const encryptedIdentityNumber = Buffer.concat([
    cipherIdentityNumber.update(identityNumber),
    cipherIdentityNumber.final(),
  ]).toString("hex");

  return { encryptedCardNumber, encryptedIdentityNumber };
}

function decryptSensitiveData(encryptedText) {
  const algorithm = "aes-256-cbc";
  const iv = process.env.INITIALIZE_VECTOR;
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
  let decrypted = Buffer.concat([
    decipher.update(encryptedText, "hex"),
    decipher.final(),
  ]).toString("utf-8");
  return decrypted;
}

function generateBankAccount() {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < 26; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const generateRandomMasks = (n, passwordLength) => {
  const masks = [];

  for (let i = 0; i < n; i++) {
    const mask = Array(passwordLength).fill("*");
    const positionsToReplace = getRandomPositions(passwordLength, 4);
    positionsToReplace.forEach((position) => {
      mask[position] = "@";
    });
    masks.push(mask.join(""));
  }

  return masks;
};

async function generatePasswordHash(password, mask, login) {
  const modifiedPassword = applyMask(password, mask);
  const saltRounds = 10;
  return bcrypt.hash(login + modifiedPassword, saltRounds);
}

function applyMask(password, mask) {
  let modifiedPassword = "";
  for (let i = 0; i < password.length; i++) {
    if (mask[i] !== "*") {
      modifiedPassword += password[i];
    }
  }
  return modifiedPassword;
}

const getRandomPositions = (max, count) => {
  const positions = [];
  while (positions.length < count) {
    const position = Math.floor(Math.random() * max);
    if (!positions.includes(position)) {
      positions.push(position);
    }
  }
  return positions;
};

const getHashesAndMasks = async (password, n, passwordLength, login) => {
  const masks = generateRandomMasks(n, passwordLength);
  const passwordHashesMap = [];
  await Promise.all(
    masks.map(async (mask) => {
      const hash = await generatePasswordHash(password, mask, login);
      passwordHashesMap.push({ hash, mask });
    })
  );
  return passwordHashesMap;
};

export {
  encryptSensitiveData,
  generateBankAccount,
  getHashesAndMasks,
  decryptSensitiveData,
};
