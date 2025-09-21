import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// env: ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
export const signAccessToken = (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })

export const signRefreshToken = (payload, rememberMe) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: rememberMe ? '30d' : '7d' })


// hash refresh token before storing
export const hashToken = (token) =>
    crypto.createHash('sha256').update(token).digest('hex')