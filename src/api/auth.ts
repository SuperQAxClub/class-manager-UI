import { ApiError, apiRequest, FetchResult } from "./axios";

export type CreateProfileStudentRequest = {
  name: string,
  schoolId: string | null,
  classId: string | null,
  studentCode: string | null,
  gender: string,
  gradeId: string
}
export type CreateProfileRequest = {
  name: string,
  mobile: string,
  gender: string,
  avatar_url: string,
  email: string,
  google_id: string,
  studentList: CreateProfileStudentRequest[]
}

export type ProfileType = {
  id: string,
  name: string,
  mobile: string,
  gender: string,
  avatar_url: string,
  email: string,
  google_id: string
}
export type SessionType = {
  id: string,
  expiry: string
}

export type CreateProfileResponse = {
  user: ProfileType,
  session: SessionType
}

export type LoginResponse = {
  status: string,
  user: ProfileType,
  session: SessionType | null
}

export const requestCreateProfile = async<T = any>(request:CreateProfileRequest):Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("POST", "/auth", {data: request});
    return { items, error: null };
  } catch (err: unknown) {
    let message = 'An unexpected error occurred';
    if (err instanceof ApiError) {
      message = `Server returned ${err.status}: ${JSON.stringify(err.data)}`;
    }
    return { items: null, error: message };
  }
}

export const requestLogin = async<T = any>(google_id:string):Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("POST", "/auth/login", {data: {google_id: google_id}});
    return { items, error: null };
  } catch (err: unknown) {
    let message = 'An unexpected error occurred';
    if (err instanceof ApiError) {
      message = `Server returned ${err.status}: ${JSON.stringify(err.data)}`;
    }
    return { items: null, error: message };
  }
}

export const requestProfile = async<T = any>(sessionId:string):Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("GET", "/auth/profile", {params: {sessionId}});
    return { items, error: null };
  } catch (err: unknown) {
    let message = 'An unexpected error occurred';
    if (err instanceof ApiError) {
      message = `Server returned ${err.status}: ${JSON.stringify(err.data)}`;
    }
    return { items: null, error: message };
  }
}