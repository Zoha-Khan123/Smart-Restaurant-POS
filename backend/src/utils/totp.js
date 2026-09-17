import {
  generateSecret as otplibGenerateSecret,
  generateURI as otplibGenerateURI,
  verifySync,
  generateSync
} from 'otplib';
import QRCode from 'qrcode';

/**
 * Generate a new TOTP secret.
 * @returns {string} Base32 encoded secret
 */
export const generateTotpSecret = () => {
  return otplibGenerateSecret();
};

/**
 * Generate otpauth URL for QR code scanners (Google Authenticator, Authy, etc.).
 * @param {string} email
 * @param {string} secret
 * @param {string} [serviceName='Smart Restaurant POS']
 * @returns {string}
 */
export const generateTotpKeyUri = (email, secret, serviceName = 'Smart Restaurant POS') => {
  return otplibGenerateURI({
    issuer: serviceName,
    label: email,
    secret
  });
};

/**
 * Generate QR code data URL (base64 image) from otpauth URL.
 * @param {string} otpauthUrl
 * @returns {Promise<string>}
 */
export const generateQrCodeDataUrl = async (otpauthUrl) => {
  return QRCode.toDataURL(otpauthUrl);
};

/**
 * Verify a 6-digit TOTP code.
 * @param {string} token - 6-digit user input
 * @param {string} secret - base32 secret stored on user
 * @returns {boolean}
 */
export const verifyTotpCode = (token, secret) => {
  if (!token || !secret) {
    return false;
  }
  try {
    const result = verifySync({
      token: token.toString().trim(),
      secret
    });
    return Boolean(result && result.valid === true);
  } catch (_err) {
    return false;
  }
};

/**
 * Generate 6-digit TOTP code for testing/validation.
 * @param {string} secret
 * @returns {string}
 */
export const generateTotpToken = (secret) => {
  return generateSync({ secret });
};

export default {
  generateTotpSecret,
  generateTotpKeyUri,
  generateQrCodeDataUrl,
  verifyTotpCode,
  generateTotpToken
};
