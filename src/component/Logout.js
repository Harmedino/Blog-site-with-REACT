import { redirect } from "react-router-dom";

export function action() {
  const cookieName = "token";
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  redirect("/blogList");
}
