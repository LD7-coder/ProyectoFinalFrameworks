import { Routes, Route } from "react-router-dom";
import Login from "../src/componentes/Login/Login";
import Registro from "../src/componentes/Registro/Registro";
import Home from "../src/componentes/Home/Home";
import File from "../src/componentes/File/File";
import Sopa from "../src/componentes/Sopa/Sopa";
import Crucigrama from "../src/componentes/Crucigrama/Crucigrama";
import Ahorcado from "../src/componentes/Ahorcado/Ahorcado";
import Parrafo from "../src/componentes/Parrafo/Parrafo";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/file" element={<ProtectedRoute><File /></ProtectedRoute>} />
      <Route path="/ahorcado" element={<ProtectedRoute><Ahorcado /></ProtectedRoute>} />
      <Route path="/sopa" element={<ProtectedRoute><Sopa /></ProtectedRoute>} />
      <Route path="/crucigrama" element={<ProtectedRoute><Crucigrama /></ProtectedRoute>} />
      <Route path="/parrafo" element={<ProtectedRoute><Parrafo /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
