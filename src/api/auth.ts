import { apiRequest } from "./axios";

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

export type SessionResponse = {
  id: string,
  expiry: string
}

export const requestCreateProfile = async(request:CreateProfileRequest) => {
  const data = await apiRequest<SessionResponse>("POST", "/auth", {data: request});
  return data;
}