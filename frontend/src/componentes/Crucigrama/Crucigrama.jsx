import CrucigramaGame from "../../games/crucigrama";
import './Crucigrama.css';
//import { useEffect, useRef, useState } from "react";
import { useState, useEffect, useRef} from "react";
import Popup from "../Popup/Popup";
import { useNavigate } from "react-router-dom";

function Crucigrama() {

    const finalData = JSON.parse(localStorage.getItem("finalData"));
    const palabrasDesdeAI = finalData?.crucigrama?.map(item => item[0].toUpperCase()) ?? [];
    const pistasDesdeAI = finalData?.crucigrama?.map(
        (item, i) => `${i + 1}. ${item[1]}`
    ) ?? [];

    let objeto = CrucigramaGame(palabrasDesdeAI, 20),
        crucigrama = objeto.matriz;

    console.log(crucigrama)

    let pistas = pistasDesdeAI;
    let palabras_ingresadas = [];

    //let pistas prueba = []

    //Espacios donde se guardaran los cambios de onChange
    crucigrama.forEach(row => {
        palabras_ingresadas.push([]);
        row.forEach(() => {
            palabras_ingresadas[palabras_ingresadas.length - 1].push('');
        });
    });

    const [palabrasIngresadas, setIngresadas] = useState(palabras_ingresadas);
    const actSeg = useRef(0);
    const actMin = useRef(0);
    const intervalo = useRef(null);

    const [seg, setSeg] = useState(0);
    const [min, setMin] = useState(0);
    const [bandera, setBandera] = useState(null);
    const divRef = useRef([]);
    const inputRef = useRef([]);
    const [estado, setEstado] = useState("jugando");

    const setLink = useNavigate();

    const setDivRef = (div, rowIndex, colIndex) => {
        if(!divRef.current[rowIndex]){
            divRef.current[rowIndex] = [];
        }
        divRef.current[rowIndex][colIndex] = div;
    }

    const setInputRef = (div, rowIndex, colIndex) => {
        if(!inputRef.current[rowIndex]){
            inputRef.current[rowIndex] = [];
        }
        inputRef.current[rowIndex][colIndex] = div;
    }

    const getDivRef = (rowIndex, colIndex) => {
        return divRef.current[rowIndex]?.[colIndex] ?? null;
    }

    const getInputRef = (rowIndex, colIndex) => {
        return inputRef.current[rowIndex]?.[colIndex] ?? null;
    }

    let c = 0;

    const validarCrucigrama = () => {

        let noCoincide = false;

        for(let i = 0; i < crucigrama.length; i++){
            for(let j = 0; j < crucigrama[i].length; j++){
                let div = getDivRef(i, j);
                let input = getInputRef(i, j);
                if(crucigrama[i][j].length === 2){
                    if(crucigrama[i][j][0].toUpperCase() !== palabrasIngresadas[i][j].toUpperCase()){
                        noCoincide = true;
                        if(div !== null && input !==  null){
                            div.classList.add("incorrectaCru");
                            input.classList.add("incorrectaCru");
                            input.value = "";
                        }
                    }else{
                        if(div !== null && input !==  null){
                            div.classList.remove("incorrectaCru");
                            input.classList.remove("incorrectaCru");
                        }
                    } 
                }else{
                    if(crucigrama[i][j].toUpperCase() !== palabrasIngresadas[i][j].toUpperCase()){
                        noCoincide = true;
                        if(div !== null && input !==  null){
                            div.classList.add("incorrectaCru");
                            input.classList.add("incorrectaCru");
                            input.value = "";
                        }
                    }else{
                        if(div !== null && input !==  null){
                            div.classList.remove("incorrectaCru");
                            input.classList.remove("incorrectaCru");
                        }
                    }
                }
            }
        }

        if(noCoincide){
            setBandera(true)
        }else{
            setBandera(false)
        }
    };

    useEffect(() => {
        if(bandera){
            setBandera(null)
        }else if(bandera === false){
            setEstado("ganaste")
            setBandera(null)
        }
    }, [bandera])

    // Intervalo creado cuando se monta el componente
    useEffect(() => {
        console.log("Hola, estoy existiendo");
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

        // Función que detiene la ejecución en cuanto se desmonta el componente
        return () => {
            clearInterval(intervalo.current);
        };

    }, []);

    const regresarComponente = () => {
        clearInterval(intervalo.current);
        return <Popup min={min} seg={seg} intentos={null} resultado={estado} estado={estado.toUpperCase()}></Popup>
    };

    return (
        <>
            <div className="divPantallaC">
                <div className="divCrucigrama" style={{ gridTemplateColumns: `repeat(${crucigrama[0].length}, 1fr)` }}>
                    {crucigrama.map((arreglo, rowKey) => (
                        arreglo.map((item, colKey) =>
                            item !== ""
                                ? (<div key={`${rowKey}${colKey}`}>
                                    {item === item.toUpperCase() || item.length === 2
                                        ? (<div className="organizarI" ref={(div) => setDivRef(div, rowKey, colKey)}>
                                            <div style={{ width: "20px", height: "15px", fontSize: "10px", color: "#0d0d0d", textShadow: "0 0 4px rgba(0, 0, 0, 0.6),0 0 8px rgba(0, 0, 0, 0.4)" }}>{item.length === 2 ? `${c += 1} ${c +=1}` : c += 1}</div>
                                            <input className="divLetraC" maxLength={1}
                                                onChange={(e) => {
                                                    setIngresadas(palabrasIngresadas => {
                                                        palabrasIngresadas[rowKey][colKey] = e.target.value;
                                                        return [...palabrasIngresadas];
                                                    })
                                                }} ref={(div) => setInputRef(div, rowKey, colKey)}>
                                            </input>
                                        </div>)
                                        : (<div className="organizarI" ref={(div) => setDivRef(div, rowKey, colKey)}>
                                            <div style={{ width: "15px", height: "15px" }}><h2></h2></div>
                                            <input className="divLetraC" maxLength={1}
                                                onChange={(e) => {
                                                    setIngresadas(palabrasIngresadas => {
                                                        palabrasIngresadas[rowKey][colKey] = e.target.value;
                                                        return [...palabrasIngresadas];
                                                    })
                                                }} ref={(div) => setInputRef(div, rowKey, colKey)}>
                                            </input>
                                        </div>)}
                                </div>)
                                : (<div key={`${rowKey}${colKey}`}></div>)
                        )
                    ))}
                </div>

                <div className="secundarioC">
                    <div className="divMetadatosC">

                        <div style={{ width: "330px" }}>
                            <h1 className="MdatoC" style={{ color: "#FFFF33", textShadow: "0 0 3px rgb(216, 191, 255), 0 0 6px rgb(216, 191, 255)" }}>Crucigrama</h1>
                        </div>

                        <div style={{ width: "370px", display: "flex", gap: "20px", alignItems: "center" }}>
                            <h2 className="MdatoC" style={{ color: "0 0 3px #fff"}}>
                                {min >= 10 ? min :  `0${min}`}:{seg >= 10 ? seg :  `0${seg}`}
                            </h2>
                            <button className="Bcomprobar" style={{ color: "#0D0D0D" }} onClick={() => {validarCrucigrama()}}>Comprobar</button>
                            <button className="Bsalir" style={{ color: "#0D0D0D" }} onClick={() => setLink("/home")}>Salir</button>
                        </div>
                    </div>

                    <div className="liPalabraC">
                        <div style={{color: "#0d0d0d", fontSize: "30px", textShadow: "0 0 6px rgb(138, 43, 226), 0 0 12px rgb(138, 43, 226)"}}>¡SIGUE LAS PISTAS!</div>
                        {pistas.map((item, key) => (
                            <div key={key} className="pistaC"><h4>{item.toUpperCase()}</h4></div>
                        ))}
                    </div>
                </div>
                {(estado === 'ganaste') && regresarComponente()}
            </div>
        </>
    );
}

export default Crucigrama;
