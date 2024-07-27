import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthRequired from "./routes/auth-required";
import ErrorPage from "./routes/error-page";
import LoginForm from "./routes/login-form";
import Root from "./routes/root";
import BillsTable from "./routes/bills-table";

import Layout from "./routes/layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/",
            element: (
              <AuthRequired>
                <Root />
              </AuthRequired>
            ),
          },
          {
            path: "/login",
            element: <LoginForm />,
          },
          {
            path: "/bills",
            element: <BillsTable />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
