import Cookies from "js-cookie";
import { redirect } from "react-router-dom";

export function getAuthToken() {
  const token = Cookies.get("token");
  return token || null; // Return null if token is undefined or empty
}

export function loader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/Auth?mode=login");
  }
  return token;
}
