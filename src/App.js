import React, { useEffect, useState } from "react";
import image from "./img.jpg";
import Register from "./Components/register";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/home";
import Login from "./Components/login";

const App = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    const checkUser = sessionStorage.getItem("user");
    setUser(checkUser);
  }, []);
  return (
    <>
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register />} />
          </>
        ) : (
          <Route path="/" element={<Home />} />
        )}
      </Routes>
    </>
  );
};

export default App;
