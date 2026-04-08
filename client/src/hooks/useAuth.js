export const getToken = () => {
  return localStorage.getItem("ayurToken");
};

export const getUser = () => {
  const raw = localStorage.getItem("ayurUser");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    return user && user.id ? user : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("ayurToken");
  localStorage.removeItem("ayurUser");
  window.location.href = "/login";
};
