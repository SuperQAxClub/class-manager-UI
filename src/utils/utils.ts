// src/utils/verifyGoogleIdToken.ts
import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose';
import { SessionType } from '../api/auth';
import {Duration, format, formatDuration, intervalToDuration} from 'date-fns';
import { TZDate } from "@date-fns/tz";
import { vi } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
export const getAdminSession = ():string | null => {
  const getSession = window.localStorage.getItem("admin-session");
  if(getSession) {
    return getSession;
  } else {
    return null
  }
}
export const saveAdminSession = (session:string) => {
  window.localStorage.setItem("admin-session", session)
}
export const removeAdminSession = () => {
  window.localStorage.removeItem("admin-session")
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

export const getGender = (code: string): string => {
  const mapping: Record<string, string> = {
    female: "Nữ",
    male: "Nam"
  };

  return mapping[code];
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
export const convertDateDot = (date:string) => {
  return format(new Date(date), "dd.MM.yyyy")
}

export const convertFullDateTime = (date:string) => {
  return format(new TZDate(new Date(date), "Asia/Ho_Chi_Minh"), "EEEE, dd/MM/yyyy HH:mm", {locale: vi})
}

export const convertTime = (time:string) => {
  return time.slice(0, 5)
}

export const registerError = (code:string) => {
  switch (code) {
    case "STUDENT_NOT_EXIST": return "Học sinh không tồn tại"
  
    default: return "Lỗi không xác định"
  }
}

export const getErrorText = (code: string): string => {
  const mapping: Record<string, string> = {
    MOBILE_EXISTED: "Số điện thoại đã tồn tại trong hệ thống",
    LOGIN_INFO_MISSING: "Thông tin đăng nhập chưa đầy đủ",
    INVALID_CREDENTIAL: "Thông tin đăng nhập không đúng, vui lòng kiểm tra lại thông tin"
  };

  if(mapping[code]) {
    return mapping[code];
  } else {
    return "Đã xảy ra lỗi không xác định"
  }
}

export function formatTimeDifference(
  start: Date | number,
  end: Date | number
): string {
  // Ensure we have Date objects
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate   = end   instanceof Date ? end   : new Date(end);

  // Compute the duration parts
  const duration: Duration = intervalToDuration({ start: startDate, end: endDate });

  // Format only days, hours, and minutes; skip units that are zero
  return formatDuration(duration, {
    format:    ['days', 'hours', 'minutes'],
    delimiter: ' ',
    locale: vi
  });
}

export function exportToExcel<T>(
  data: T[],            // your raw data
  fields: string[],     // the object keys, in the order you want
  headers: string[],    // the custom column names (must match `fields.length`)
  fileName = 'export'   // desired file name (without extension)
) {
  // 1) Build a sheet from your data, but skip the built-in header row
  const ws = XLSX.utils.json_to_sheet(data, {
    header: fields,
    skipHeader: false
  });

  // 2) Prepend your custom header row at A1
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

  // 3) Auto-compute column widths (wch = “width in characters”)
  ws['!cols'] = fields.map((key, i) => {
    // length of header text
    const h = headers[i]?.toString().length ?? 0;
    // max length of any cell in this column
    const maxCell = data.reduce((max, row) => {
      const v = row[key as keyof T];
      const len = v != null ? String(v).length : 0;
      return Math.max(max, len);
    }, 0);
    // give a little padding
    return { wch: Math.max(h, maxCell) + 2 };
  });

  // 4) Create a workbook, append the sheet, write array buffer
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // 5) Trigger browser download
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
}