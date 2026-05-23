// Temporary in-memory storage for OTP codes
const otpStore = new Map();

export function saveOTP(email, code) {
  otpStore.set(email, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });
}

export function verifyOTP(email, code) {
  const record = otpStore.get(email);
  if (!record) return false;
  if (record.code !== code) return false;
  if (Date.now() > record.expiresAt) return false;
  otpStore.delete(email);
  return true;
}

// Clean up expired OTPs every minute
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 60000);