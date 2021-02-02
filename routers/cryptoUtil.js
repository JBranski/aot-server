const crypto = require('crypto');

// Separator for storing cryptographic values in the same string
// NOTE: Changing this value will break any existing encrypted values.. so don't change
const CRYPTO_STR_SEPARATOR = ':';

// Length of the password salt. Value chosen based on this article:
// https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
// Recommendation is at least 128 bits (= 16 bytes), so we'll use double that to be safe
// NOTE: If this value is changed, it will not affect existing passwords, as the salt is
//    always stored with the password itself. However, there should be no need to change it
const SALT_LENGTH = 32;

// How many times the password will get hashed - the higher the better
// NIST.gov recommends at least 1000 iterations and the only limitation for this value is the
// capacity of your server. Higher iteration count means higher computation times and
// resource allocation for single operation. Meaning: while these iterations are being done,
// absolutely nothing else can be happening in that specific process. So in order to avoid
// locking down the process for too long, we want to ensure this value is not too high.
// NOTE: Changing this value will break any existing passwords
const HASH_ITERATIONS = 1000;

// Byte length of the resulting password hash length
// NOTE: This has nothing to do with the actual input password length, just the resulting
// HASH length. Also, changing this value WILL break any existing passwords
const HASH_LENGTH = 64;

// Which hashing algorithm to use for the password hashes.
// NOTE: Changing this value will obviously break any existing passwords
const HASH_ALGORITHM = 'sha512';

/**
 * Create a secure one-way hash from a plain text password
 *
 * @param {string} passwordString - A plain text password that will be hashed
 * @return {string} Hashed password with salt string (this is safe to store in database)
 */
exports.hashPassword = function hashPassword(passwordString) {
  const saltBuffer = crypto.randomBytes(SALT_LENGTH);
  const hashBuffer = generatePasswordHash(passwordString, saltBuffer);
  const encryptedChunks = [saltBuffer.toString('base64'), hashBuffer.toString('base64')];
  return encryptedChunks.join(CRYPTO_STR_SEPARATOR);
}

/**
 * Verify that the given password matches the existing hashed password
 *
 * @param {string} givenPassword - Password to be verified
 * @param {string} hashedPassword - Previously stored password hash to be checked against
 * @return {boolean} `true` if password matches
 */
exports.verifyPassword = function verifyPassword(givenPassword, hashedPassword) {
  const { hash, salt } = parsePasswordHash(hashedPassword);
  const encryptedPasswordHash = generatePasswordHash(givenPassword, salt);
  return crypto.timingSafeEqual(hash, encryptedPasswordHash);
}

/**
 * Generate a hash from given plain text password and given salt
 *
 * @param {string} passwordString - A plain text password to be hashed
 * @param {Buffer} saltBuffer - A salt buffer to be used for the hash
 * @return {Buffer} Password hash
 */
function generatePasswordHash(passwordString, saltBuffer) {
  return crypto.pbkdf2Sync(
    passwordString,
    saltBuffer,
    HASH_ITERATIONS,
    HASH_LENGTH,
    HASH_ALGORITHM,
  );
}

/**
 * Parse encrypted password string hash into named buffers
 *
 * @param {string} encryptedString
 * @return {{salt: Buffer, hash: Buffer}}
 */
function parsePasswordHash(encryptedString) {
  const [salt, hash, erroneousData] = encryptedString.split(CRYPTO_STR_SEPARATOR);
  // The existence of `erroneusData` means that there were more than 2 chunks,
  // so the input string must be invalid
  if (!salt || !hash || erroneousData) {
    throw new Error('Encrypted string not valid');
  }
  return {
    salt: Buffer.from(salt, 'base64'),
    hash: Buffer.from(hash, 'base64'),
  };
}
