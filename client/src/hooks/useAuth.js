export const getToken = () => {
  return localStorage.getItem("ayurToken");
};

export const getUser = () => {
  const raw = localStorage.getItem("ayurUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("ayurToken");
  localStorage.removeItem("ayurUser");
  window.location.href = "/login";
};
