import './Parrafo.css';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "../Popup/Popup";

function Parrafo() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;  


    useEffect(() => {
        if (!data) navigate("/file");
    }, []);

    if (!data) return null; 

    const textoOriginal = data[0];
    const palabrasCorrectas = data.slice(1);
    const total = palabrasCorrectas.length;

    function generarParrafoConHuecos(texto, palabras) {
        let mod = texto;
        palabras.forEach(p => {
            const regex = new RegExp(`\\b${p}\\b`, "i");
            mod = mod.replace(regex, "___");
        });
        return mod;
    }  

    const parrafoProcesado = generarParrafoConHuecos(textoOriginal, palabrasCorrectas);

    const [selecciones, setSelecciones] = useState(Array(total).fill(""));
    const [resultado, setResultado] = useState(null);

    function shuffleArray(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    const [palabrasDisponibles, setPalabrasDisponibles] = useState(
        shuffleArray([...palabrasCorrectas])
    );

    const regresarComponente = () => {
        clearInterval(intervalo.current);
        return <Popup min={min} seg={seg} intentos={null} resultado={resultado} estado={estado.toUpperCase()}></Popup>
    };

    const actSeg = useRef(0);
    const actMin = useRef(0);
    const intervalo = useRef(null);

    const [seg, setSeg] = useState(0);
    const [min, setMin] = useState(0);
    const [activar, setActivar] = useState(false);
    const [estado, setEstado] = useState('jugando');

    useEffect(() => {
        intervalo.current = setInterval(() => {
            if (actSeg.current === 60) {
                actSeg.current = 0;
                setSeg(actSeg.current);
                actMin.current += 1;
                setMin(actMin.current);
            } else {
                actSeg.current += 1;
                setSeg(actSeg.current);
            }
        }, 1100);

        return () => clearInterval(intervalo.current);
    }, []);

    function seleccionarPalabra(palabra) {
        const index = selecciones.indexOf("");

        if (index === -1) return;

        const nuevo = [...selecciones];
        nuevo[index] = palabra;

        setSelecciones(nuevo);
        setPalabrasDisponibles(prev => prev.filter(p => p !== palabra));
    }

    function quitarPalabra(i) {
        const palabraQuitada = selecciones[i];
        if (!palabraQuitada) return;

        const nuevo = [...selecciones];
        nuevo[i] = "";

        setSelecciones(nuevo);
        setPalabrasDisponibles(prev => [...prev, palabraQuitada]);
    }

    function revisar() {
        let correctas = 0;
        selecciones.forEach((p, i) => {
            if (p === palabrasCorrectas[i]) correctas++;
        });
        setResultado(correctas);
        setActivar(true);
    }

    useEffect(() => {
        if(resultado === total){
            setEstado('ganaste');
        }else{
            setEstado('perdiste');
        }
    }, [resultado])

    function renderParrafo() {
        const partes = parrafoProcesado.split("___");
        const final = [];

        for (let i = 0; i < partes.length; i++) {
            final.push(<span key={"t" + i}>{partes[i]}</span>);

            if (i < total) {
                final.push(
                    <span
                        key={"e" + i}
                        className="hueco"
                        onClick={() => quitarPalabra(i)}
                    >
                        {selecciones[i] || "_____"}
                    </span>
                );
            }
        }
        return final;
    }

    return (
        <div className='divPantallaP'>
            <div className='divMetadatos'>
                <div className='Mdato'>
                    <h2 className='tPalabras'>
                        Palabras: {resultado ?? selecciones.filter(s => s).length}/{total}
                    </h2>
                </div>

                <div className='Mdato'>
                    <h2 style={{ color: "#FFFF33" }}>Párrafo</h2>
                </div>

                <div className='Mdato'>
                    <h2>{min >= 10 ? min : `0${min}`}:{seg >= 10 ? seg : `0${seg}`}</h2>
                </div>
            </div>

            <div className='divGame'>
                <div className='palabrasB'>
                    {palabrasDisponibles.map((p, i) => (
                        <button key={i} className='palabraB' onClick={() => seleccionarPalabra(p)}>
                            {p}
                        </button>
                    ))}
                </div>

                <div className='divParrafo'>
                    <div className='contenedor-blanco'>
                        <p className='historia-texto'>{renderParrafo()}</p>
                    </div>

                    <button className='btnRevisar btn-revisar' onClick={revisar}>Revisar</button>

                    {resultado !== null && (
                        <h2 style={{ marginTop: "10px", color: "white" }}>
                            Aciertos: {resultado}/{total}
                        </h2>
                    )}
                </div>
            </div>
            {(activar) && regresarComponente()}
        </div>
    );
}

export default Parrafo;
