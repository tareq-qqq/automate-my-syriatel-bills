import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function AuthRequired({ children }) {
  const loggedIn = Cookies.get("userId");
  return loggedIn ? children : <Navigate to="/login" />;
}
export default AuthRequired;
