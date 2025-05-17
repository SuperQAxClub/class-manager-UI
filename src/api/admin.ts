import { ApiError, apiRequest, FetchResult } from "./axios";

export type AdminLoginResponse = {
  userId: string
}

export type CourseRegistrationStudentResponse = {
  regId: string,
  fee: number,
  status: string,
  created: string,
  name: string,
  gender: string,
  class: string | null,
  school: string | null,
  transactionId: string
}
export type CourseRegistrationResponse = {
  parentGender: string,
  parentMobile: string,
  parentName: string,
  studentList: CourseRegistrationStudentResponse[]
}

export const requestAdminCourseList = async<T = any>():Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("GET", "/admin/course");
    return { items, error: null };
  } catch (err: unknown) {
    let message = 'An unexpected error occurred';
    if (err instanceof ApiError) {
      message = `Server returned ${err.status}: ${JSON.stringify(err.data)}`;
    }
    return { items: null, error: message };
  }
}

export const requestAdminCourseRegistration = async<T = any>(courseId:string):Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("POST", "/admin/course/get-registration", {data: {courseId}});
    return { items, error: null };
  } catch (err: unknown) {
    let message = "UNKNOWN";
    if (err instanceof ApiError) {
      message = err.data.error;
    }
    return { items: null, error: message };
  }
}
export const requestAdminCourseRegistrationStatusUpdate = async<T = any>(regId:string, status:string, courseId:string):Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("POST", "/admin/course/registration/update-status", {data: {regId, status, courseId}});
    return { items, error: null };
  } catch (err: unknown) {
    let message = "UNKNOWN";
    if (err instanceof ApiError) {
      message = err.data.error;
    }
    return { items: null, error: message };
  }
}

export const requestAdminLogin = async<T = any>(username:string, password:string):Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("POST", "/auth/admin-login", {data: {username, password}});
    return { items, error: null };
  } catch (err: unknown) {
    let message = "UNKNOWN";
    if (err instanceof ApiError) {
      message = err.data.error;
    }
    return { items: null, error: message };
  }
}