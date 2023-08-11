import Cookies from "js-cookie";

export function getAuthToken() {
  const token = Cookies.get("token");
  return token;
}
