import SignIn from "./Components/SignIn"
import SignUp from "./Components/SignUp"
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import "./index.css";
import Home from "./Components/Home/Home";
import { isAuthenticated } from "./Components/Base/helper/helper";
const PrivateRoute = ({ element, ...props }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: props.location }} />
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={
            <PrivateRoute
              element={
                <>
                  <Outlet />
                </>
              }
            />
          }
        >
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
