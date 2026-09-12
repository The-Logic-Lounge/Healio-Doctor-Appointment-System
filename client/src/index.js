import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";

// Configure default baseURL for API requests. 
// In development, it defaults to "" (using package.json proxy). 
// In production, it uses REACT_APP_API_URL.
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
reportWebVitals();
