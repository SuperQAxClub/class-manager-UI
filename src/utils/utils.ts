// src/utils/verifyGoogleIdToken.ts
import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose';
import { SessionType } from '../api/auth';
import {format} from 'date-fns';

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs')
);

export interface GoogleIdPayload extends JWTPayload {
  "iss": string,
  "azp": string,
  "aud": string,
  "sub": string,
  "email": string,
  "email_verified": boolean,
  "nbf": number,
  "name": string,
  "picture": string,
  "given_name": string,
  "family_name": string,
  "iat": number,
  "exp": number,
  "jti": string
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

export const saveSession = (session:SessionType) => {
  window.localStorage.setItem("session", JSON.stringify(session))
}
export const removeSession = () => {
  window.localStorage.removeItem("session")
}
export const getSession = ():SessionType | null => {
  const getSession = window.localStorage.getItem("session");
  if(getSession) {
    return JSON.parse(getSession);
  } else {
    return null
  }
}

export const getDay = (day: string): string => {
  const mapping: Record<string, string> = {
    MONDAY: "Thứ 2",
    TUESDAY: "Thứ 3",
    WEDNESDAY: "Thứ 4",
    THURSDAY: "Thứ 5",
    FRIDAY: "Thứ 6",
    SATURDAY: "Thứ 7",
    SUNDAY: "Chủ nhật",
  };

  return mapping[day];
}

export const formatPrice = (numStr: number): string => {
  const n = Number(numStr)
  return isNaN(n)
    ? numStr.toString()
    : n.toLocaleString('vi-VN')
}

export const convertDate = (date:string) => {
  return format(new Date(date), "dd/MM/yyyy")
}

export const convertTime = (time:string) => {
  return time.slice(0, 5)
}