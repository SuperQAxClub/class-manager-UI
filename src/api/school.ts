import { ApiError, apiRequest, FetchResult } from "./axios"

export type SchoolResponse = {
  id: string,
  name: string
}

export type SchoolGradeResponse = {
  id: string,
  grade: number
}

export type SchoolClassResponse = {
  id: string,
  name: string,
  grade_id: string,
  school_id: string
}

export type CourseResponse = {
  id: string;
  name: string;
  grade_id: string;
  room_name: string;
  advanced_class: boolean;
  start_date: string;
  end_date: string;
  room_id: string;
  actual_capacity: number;
  slots_left: number;
  subject_id: string;
  description: string | null;
  day: string;
  start_time: string;
  end_time: string;
  has_started: boolean;
}

export type CheckStudentResponse = {
  student_id: string,
  student_name: string,
  eligible: string,
  grade_name: string
}

export const requestSchoolList = async() => {
  return await apiRequest<SchoolResponse[]>("GET", "/school");
}

export const requestSchoolGrade = async() => {
  return await apiRequest<SchoolGradeResponse[]>("GET", "/school/grade");
}

export const requestSchoolClass = async() => {
  return await apiRequest<SchoolClassResponse[]>("GET", "/school/class");
}

export const requestCourseList = async<T = any>():Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("GET", "/school/course");
    return { items, error: null };
  } catch (err: unknown) {
    let message = 'An unexpected error occurred';
    if (err instanceof ApiError) {
      message = `Server returned ${err.status}: ${JSON.stringify(err.data)}`;
    }
    return { items: null, error: message };
  }
}

export const requestCheckStudent = async<T = any>(courseId:string, userId:string):Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("POST", "/school/check-student", {data: {courseId, userId}});
    return { items, error: null };
  } catch (err: unknown) {
    let message = 'An unexpected error occurred';
    if (err instanceof ApiError) {
      message = `Server returned ${err.status}: ${JSON.stringify(err.data)}`;
    }
    return { items: null, error: message };
  }
}

export const requestRegisterCourse = async<T = any>(courseId:string, studentList: string[], userId:string):Promise<FetchResult<T>> => {
  try {
    const items = await apiRequest<T>("POST", "/school/register-course", {data: {courseId, studentList, userId}});
    return { items, error: null };
  } catch (err: unknown) {
    let message = 'An unexpected error occurred';
    if (err instanceof ApiError) {
      message = `Server returned ${err.status}: ${JSON.stringify(err.data)}`;
    }
    return { items: null, error: message };
  }
}