const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const RefreshSession = require("../models/RefreshSession");

/** Parse durations like "15m", "30d", "900s", "1h" into milliseconds. */
function parseDurationMs(value) {
  const raw = String(value || "").trim();
  const match = /^(\d+)(ms|s|m|h|d)?$/i.exec(raw);
  if (!match) return 15 * 60 * 1000;
  const n = parseInt(match[1], 10);
  const unit = (match[2] || "s").toLowerCase();
  const mult = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * (mult[unit] || 1000);
}

function accessExpiresInSeconds() {
  return Math.floor(parseDurationMs(env.JWT_ACCESS_EXPIRES_IN) / 1000);
}

function hashToken(raw) {
  return crypto.createHash("sha256").update(String(raw)).digest("hex");
}

function generateRefreshToken() {
  return crypto.randomBytes(48).toString("base64url");
}

function clientMeta(req) {
  return {
    userAgent: String(req?.headers?.["user-agent"] || "").slice(0, 300),
    ip: String(req?.ip || req?.headers?.["x-forwarded-for"] || "").slice(0, 100),
  };
}

/** Registration / legacy helper — not an access token. */
function signToken(payload, options = {}) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: options.expiresIn || env.JWT_ACCESS_EXPIRES_IN,
    ...options,
  });
}

function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

function signAccessToken(payload) {
  return jwt.sign(
    { ...payload, typ: "access" },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );
}

function verifyAccessToken(token) {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (decoded.typ && decoded.typ !== "access") {
    const err = new Error("invalid_token");
    err.name = "JsonWebTokenError";
    throw err;
  }
  if (decoded.role === "registration") {
    const err = new Error("invalid_token");
    err.name = "JsonWebTokenError";
    throw err;
  }
  return decoded;
}

async function createRefreshSession({ subjectId, role, familyId, extra = {}, req }) {
  const raw = generateRefreshToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + parseDurationMs(env.JWT_REFRESH_EXPIRES_IN));
  const meta = clientMeta(req);
  const fid = familyId || crypto.randomUUID();
  await RefreshSession.create({
    tokenHash,
    familyId: fid,
    subjectId: String(subjectId),
    role,
    expiresAt,
    extra,
    ...meta,
  });
  return { raw, tokenHash, familyId: fid, expiresAt };
}

/**
 * Issue access + refresh pair for customer / expert / admin.
 * @returns {{ accessToken: string, refreshToken: string, expiresIn: number, tokenType: string }}
 */
async function issueTokenPair({ subjectId, role, extra = {}, req }) {
  const accessPayload = { sub: String(subjectId), role, ...extra };
  const accessToken = signAccessToken(accessPayload);
  const familyId = crypto.randomUUID();
  const { raw } = await createRefreshSession({
    subjectId,
    role,
    familyId,
    extra,
    req,
  });
  return {
    accessToken,
    refreshToken: raw,
    expiresIn: accessExpiresInSeconds(),
    tokenType: "Bearer",
  };
}

async function revokeFamily(familyId) {
  if (!familyId) return;
  await RefreshSession.updateMany(
    { familyId, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}

async function revokeRefreshToken(rawRefresh) {
  if (!rawRefresh) return;
  const tokenHash = hashToken(rawRefresh);
  await RefreshSession.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}

/**
 * Rotate refresh token. Reuse of an already-rotated/revoked token revokes the family.
 * @returns {Promise<{ accessToken, refreshToken, expiresIn, tokenType, role, subjectId, extra }>}
 */
async function rotateRefreshToken(rawRefresh, req) {
  if (!rawRefresh) {
    const err = new Error("invalid_refresh_token");
    err.status = 401;
    err.code = "invalid_refresh_token";
    throw err;
  }

  const tokenHash = hashToken(rawRefresh);
  const session = await RefreshSession.findOne({ tokenHash });

  if (!session) {
    const err = new Error("invalid_refresh_token");
    err.status = 401;
    err.code = "invalid_refresh_token";
    throw err;
  }

  if (session.revokedAt || session.replacedByHash) {
    await revokeFamily(session.familyId);
    const err = new Error("invalid_refresh_token");
    err.status = 401;
    err.code = "invalid_refresh_token";
    throw err;
  }

  if (session.expiresAt < new Date()) {
    session.revokedAt = new Date();
    await session.save();
    const err = new Error("invalid_refresh_token");
    err.status = 401;
    err.code = "invalid_refresh_token";
    throw err;
  }

  const newRaw = generateRefreshToken();
  const newHash = hashToken(newRaw);
  const expiresAt = new Date(Date.now() + parseDurationMs(env.JWT_REFRESH_EXPIRES_IN));
  const meta = clientMeta(req);

  session.revokedAt = new Date();
  session.replacedByHash = newHash;
  await session.save();

  await RefreshSession.create({
    tokenHash: newHash,
    familyId: session.familyId,
    subjectId: session.subjectId,
    role: session.role,
    expiresAt,
    extra: session.extra || {},
    ...meta,
  });

  const extra = session.extra && typeof session.extra === "object" ? session.extra : {};
  const accessToken = signAccessToken({
    sub: session.subjectId,
    role: session.role,
    ...extra,
  });

  return {
    accessToken,
    refreshToken: newRaw,
    expiresIn: accessExpiresInSeconds(),
    tokenType: "Bearer",
    role: session.role,
    subjectId: session.subjectId,
    extra,
  };
}

function requireAuth(role) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) return res.status(401).json({ error: "missing_token" });
    try {
      const decoded = verifyAccessToken(token);
      if (role && decoded.role !== role) {
        return res.status(403).json({ error: "wrong_role" });
      }
      req.auth = decoded;
      return next();
    } catch (err) {
      if (err?.name === "TokenExpiredError") {
        return res.status(401).json({ error: "token_expired" });
      }
      return res.status(401).json({ error: "invalid_token" });
    }
  };
}

module.exports = {
  signToken,
  verifyToken,
  signAccessToken,
  verifyAccessToken,
  issueTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeFamily,
  requireAuth,
  accessExpiresInSeconds,
};
