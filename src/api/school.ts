import { apiRequest } from "./axios"

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

export const requestSchoolList = async() => {
  const data = await apiRequest<SchoolResponse[]>("GET", "/school");
  return data;
}

export const requestSchoolGrade = async() => {
  const data = await apiRequest<SchoolGradeResponse[]>("GET", "/school/grade");
  return data;
}

export const requestSchoolClass = async(schoolId:string) => {
  const data = await apiRequest<SchoolClassResponse[]>("GET", "/school/class", {params: {schoolId: schoolId}});
  return data;
}