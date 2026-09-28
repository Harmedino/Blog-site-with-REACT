import { Navigate, useParams } from "react-router";

/** Old post URLs were `/more/:id`. */
export default function LegacyPostRedirect() {
  const { id } = useParams();
  return <Navigate to={`/blog/${id}`} replace />;
}
