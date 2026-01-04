import api from "./axios";

export const applyLeave = (data) => api.post("/leave/", data);
export const getLeaves = () => api.get("/leave/");
export const approveLeave = (id, status) =>
  api.patch(`/leave/${id}/approve/`, { status });
