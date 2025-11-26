import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registro.css";
import handleRegister from "../../services/handleRegister";
import validarUser from "../../adicionales/validarUser";
import validarPassword from "../../adicionales/validarPassword";
import validarEmail from "../../adicionales/validarEmail";

function Registro() {
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLink = () => {
    handleRegister(usuario, correo, password)
      .then((resultado) => {

        if (resultado.message === "El usuario ya existe") {
          alert("El usuario ya existe");
          return;
        }

        if (resultado.status === 500) {
          alert("Error en el servidor");
          return;
        }

        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("Error al conectar con el servidor");
      });
  };

  return (
    <div className="registro-container">
      <h1 className="titulo">Crear cuenta</h1>

      <input
        type="text"
        placeholder="Usuario"
        className="input usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <input
        type="email"
        placeholder="Correo"
        className="input correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="input password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="boton"
        onClick={() => {
          if (!validarUser(usuario)) {
            alert("Usuario inválido:\nDebe tener entre 3 y 10 caracteres y solo letras/números.");
            return;
          }
          if (!validarEmail(correo)) {
            alert("Correo inválido:\nDebe tener formato correo@dominio.com");
            return;
          }
          if (!validarPassword(password)) {
            alert("Contraseña inválida:\nDebe ser de 10 a 15 caracteres");
            return;
          }

          handleLink();
        }}
      >
        Registrarse
      </button>
      <p className="texto">
        ¿Ya tienes cuenta?{" "}
        <Link to="/" className="link">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
export default Registro;
