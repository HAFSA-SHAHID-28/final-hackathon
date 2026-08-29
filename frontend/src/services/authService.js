import Api from "./api";

export const signupUser = async (userData) => {
  const response = await Api.post("/auth/signup", userData);
  return response.data;
};

export const signinUser = async (userData) => {
  const response = await Api.post("/auth/signin", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await Api.get("/auth/me");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await Api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (password, token) => {
  const response = await Api.post("/auth/reset-password", {
    password,
    token,
  });

  return response.data;
};