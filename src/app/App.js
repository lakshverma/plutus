import React from "react";
import { Route, Routes } from "react-router-dom";
import Recover from "../features/login/Recover";
import SignIn from "../features/login/SignIn";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/recover" element={<Recover />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
