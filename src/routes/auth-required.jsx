import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function AuthRequired({ children }) {
  const loggedIn =
    Cookies.get("username") === "admin" &&
    Cookies.get("password") === "admin123";
  return loggedIn ? children : <Navigate to="/login" />;
}
export default AuthRequired;
