import { ApiError, apiRequest } from "./axios";

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

export const requestCreateProfile = async(request:CreateProfileRequest) => {
  try {
    const data = await apiRequest<CreateProfileResponse>("POST", "/auth2", {data: request});
    return data;
  } catch (err) {
    return err;
  }
  
}