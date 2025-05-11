import { ApiError, apiRequest, FetchResult } from "./axios";

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