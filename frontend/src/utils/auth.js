import api from "./api";

export const validateToken = async (token) => {
  try {
    // Make a simple authenticated request to validate token
    await api.get("/api/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const clearInvalidToken = () => {
  localStorage.removeItem("token");
};
