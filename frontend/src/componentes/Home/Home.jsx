import "./Home.css";
import imgSopa from "../../assets/sopaLetras.png";
import imgAhorcado from "../../assets/elAhorcado.png";
import imgFrase from "../../assets/completaFrase.png";
import imgCombo from "../../assets/comboTres.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
    const navigate = useNavigate();
    const [finalData, setFinalData] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem("finalData");
        if (!data) {
            navigate("/file");   
        } else {
            setFinalData(JSON.parse(data));
        }
    }, []);

    if (!finalData) return null; 

    return (
        <div className="contenedor-home">
            <h1>WELCOME</h1>
            <h3>¡Selecciona un juego!</h3>

            <div className="juegos">

                <div onClick={() => navigate("/sopa", { state: finalData.sopaDeLetras })}>
                    <img src={imgSopa} alt="SopaLetras" />
                </div>

                <div onClick={() => navigate("/ahorcado", { state: finalData.ahorcado })}>
                    <img src={imgAhorcado} alt="Ahorcado" />
                </div>

                <div onClick={() => navigate("/parrafo", { state: finalData.completarFrase })}>
                    <img src={imgFrase} alt="Frase" />
                </div>

                <div onClick={() => navigate("/crucigrama", { state: finalData.crucigrama })}>
                    <img src={imgCombo} alt="Crucigrama" />
                </div>

            </div>
        </div>
    );
}

export default Home;
