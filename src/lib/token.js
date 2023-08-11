import Cookies from "js-cookie";

export function getAuthToken() {
  const token = Cookies.get("token");
  return token || null; // Return null if token is undefined or empty
}

export function loader() {
  return getAuthToken();
}
