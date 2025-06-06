import e from 'express';
import * as speakeasy from 'speakeasy';
import { resetToken } from '../generated/prisma';
import { number } from 'zod';


const SPEAKEASY_CONFIG = process.env.SPEAKEASY_CONFIG
  ? JSON.parse(process.env.SPEAKEASY_CONFIG)
  : {
  step: 30,      // 30-second steps
  digits: 6,      // Standard length
  encoding: 'base32',
  window: 1,      // Small tolerance
  expiration: 300 // Expire after 2 minutes
};

export function generateOtp(secreteKey: string ){
  const otp = speakeasy.totp({
    secret: secreteKey,
    step: SPEAKEASY_CONFIG.step,
    digits: SPEAKEASY_CONFIG.digits,
    encoding: SPEAKEASY_CONFIG.encoding as speakeasy.Encoding
  });
  const expiration = Math.floor(Date.now() / 1000) + (SPEAKEASY_CONFIG.expiration ?? 300); // Default to 300 seconds if undefined
  return {
    otp,
    expiration
  };
}

export function verifyOtp(otpData: resetToken, secret: string): { isValid: boolean; message: string } {
  if (new Date() > new Date(Number(otpData.expiredAt) * 1000)) {
    return { isValid: false, message: 'OTP has expired' };
  }

  const isValid = speakeasy.totp.verify({
    secret: secret,
    token: otpData.token,
    step: SPEAKEASY_CONFIG.step,
    digits: SPEAKEASY_CONFIG.digits,
    encoding: SPEAKEASY_CONFIG.encoding as speakeasy.Encoding,
    window: SPEAKEASY_CONFIG.window
  });

  return {
    isValid,
    message: isValid ? 'OTP is valid' : 'OTP is invalid'
  };
}