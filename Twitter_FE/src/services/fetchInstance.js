const apiUrl = import.meta.env.VITE_API_URL;
export async function fetchWithAuth(url, options) {
  const res = await fetch(`${apiUrl}${url}`, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    window.location.href = "/login";
    return;
  }

  return res;
}
