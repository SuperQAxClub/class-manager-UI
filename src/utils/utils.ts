// src/utils/verifyGoogleIdToken.ts
import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs')
);

export interface GoogleIdPayload extends JWTPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  locale?: string;
  exp: number;
  iat: number;
  aud: string;
  iss: string;
}

/**
 * Verify a Google ID token’s signature + standard claims.
 */
export async function verifyGoogleIdToken(
  token: string
): Promise<GoogleIdPayload> {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  });
  return payload as GoogleIdPayload;
}