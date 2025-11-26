import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AhorcadoGame } from "../../games/ahorcado";
import "./Ahorcado.css";

import img1 from "../../Imagenes/Ahorcado1.jpg";
import img2 from "../../Imagenes/Ahorcado2.jpg";
import img3 from "../../Imagenes/Ahorcado3.jpg";
import img4 from "../../Imagenes/Ahorcado4.jpg";
import img5 from "../../Imagenes/Ahorcado5.jpg";
import img6 from "../../Imagenes/Ahorcado6.jpg";
import img7 from "../../Imagenes/Ahorcado7.jpg";

function Ahorcado() {
    const location = useLocation();
    const [palabra, pista] = location.state;   

    const imagenes = [img1, img2, img3, img4, img5, img6, img7];

    const [juego] = useState(new AhorcadoGame(palabra));
    const [oculta, setOculta] = useState(juego.obtenerPalabraOculta());
    const [estado, setEstado] = useState("jugando");
    const [usadas, setUsadas] = useState({});

    const manejarClick = (letra) => {
        if (estado !== "jugando") return;

        const resultado = juego.verificarLetra(letra);

        setUsadas((prev) => ({
            ...prev,
            [letra]: resultado.estado
        }));

        setOculta(juego.obtenerPalabraOculta());
        setEstado(juego.verificarEstado());
    };

    const errores = 6 - juego.intentos;
    const imagenMostrada = imagenes[Math.min(errores, imagenes.length - 1)];

    return (
        <>
            <div className='divPantallaA'>
                <div className='divMetadatosA'>
                    <div className='MdatoA' style={{ width: "940px" }}>
                        <h1
                            style={{
                                color: "#FFFF33",
                                textShadow: "0 0 3px rgb(216,191,255), 0 0 6px rgb(216,191,255)"
                            }}
                        >
                            Ahorcado
                        </h1>
                    </div>

                    <div className='MdatoA' style={{ width: "60px" }}>
                        <h2 style={{ textShadow: "0 0 3px #fff" }}>09:25</h2>
                    </div>
                </div>

                <div className='principal'>

                    <div className='pistaA'>
                        <p style={{ color: "#0D0D0D", fontSize: "16px" }}>
                            {pista}
                        </p>
                    </div>

                    <div className='figura'>
                        <img src={imagenMostrada} alt="Ahorcado" />
                    </div>

                    <div className='letras'>
                        {["ABCD", "EFGH", "IJKL", "MNÑO", "PQRS", "TUVW", "XYZ"].map(
                            (fila, index) => (
                                <div className='rowL' key={index}>
                                    {fila.split("").map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => manejarClick(l)}
                                            disabled={!!usadas[l]}
                                            className={`colL 
                                                ${usadas[l] === "correcta" ? "correcta" : ""} 
                                                ${usadas[l] === "incorrecta" ? "incorrecta" : ""}`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className='secundario'>
                    {oculta.split(" ").map((c, i) => (
                        <input key={i} value={c} readOnly maxLength={1} className='letraA' />
                    ))}
                </div>

                <h2 style={{ color: "white" }}>
                    {estado === "jugando" ? "Adivina la palabra" : estado.toUpperCase()}
                </h2>

                <h3 style={{ color: "white" }}>Intentos restantes: {juego.intentos}</h3>
            </div>
        </>
    );
}

export default Ahorcado;
