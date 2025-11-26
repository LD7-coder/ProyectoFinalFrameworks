import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import handleLogin from "../../services/handleLogin";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLink = () => {
  handleLogin(usuario, password)
    .then((resultado) => {
      if (resultado.message === "Usuario no encontrado") {
        alert("Usuario no encontrado");
        return;
      }
      if (resultado.message === "Contraseña incorrecta") {
        alert("Contraseña incorrecta");
        return;
      }
      if (resultado.status === 500) {
        alert("Error en el servidor");
        return;
      }
      if (resultado.token) {
        localStorage.setItem("token", resultado.token);
      }

      navigate("/file");
    })
    .catch((err) => {
      console.error(err);
      alert("Error al conectar con el servidor");
    });
};



  return (
    <div className="login-container">
      <h1 className="titulo">ZABI</h1>

      <input
        type="text"
        placeholder="Usuario"
        className="input usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="input password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="boton" onClick={handleLink}>
        Iniciar sesión
      </button>

      <p className="texto">
        ¿No tienes una cuenta?
        <Link to="/registro" className="link">
          Registrarse
        </Link>
      </p>
    </div>
  );
}
export default Login;
