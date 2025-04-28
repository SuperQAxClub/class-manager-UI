import { apiRequest } from "./axios"

export type SchoolResponse = {
  id: string,
  name: string
}

export const getSchoolList = async() => {
  const data = await apiRequest<SchoolResponse[]>("GET", "/api/school");
  return data;
}