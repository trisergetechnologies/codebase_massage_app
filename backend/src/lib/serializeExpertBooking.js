/** Include OTP codes for expert-only active booking detail. */
function serializeBookingForExpert(booking, base) {
  const o = booking.toObject ? booking.toObject() : booking;
  return {
    ...base,
    sessionOtp: o.sessionOtp
      ? {
          startVerified: !!o.sessionOtp.startVerifiedAt,
          endVerified: !!o.sessionOtp.endVerifiedAt,
          requiresStartOtp: o.status === "assigned" && !!o.sessionOtp.startCode && !o.sessionOtp.startVerifiedAt,
          requiresEndOtp: o.status === "in_progress" && !!o.sessionOtp.endCode && !o.sessionOtp.endVerifiedAt,
          startCode: o.sessionOtp.startCode,
          endCode: o.sessionOtp.endCode,
        }
      : null,
  };
}

module.exports = { serializeBookingForExpert };
