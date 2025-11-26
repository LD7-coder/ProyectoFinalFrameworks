import SopaLetras from "../../games/sopaletrascom";
import './Sopa.css';
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sopa() {
  //Haciendo prueba de push
  const location = useLocation();
  const palabrasAI = location.state;

  const [sopa, setSopa] = useState([]);
  const [palabras, setPalabras] = useState([]);

  const colores = ["#FFF9A6", "#FFB3B3", "#D7B7FF", "#AEE6FF", "#BFFFC8", "#FFD8A8", "#FFC0D9", "#B8FFE0"];

  const actSeg = useRef(0);
  const actMin = useRef(0);
  const intervalo = useRef(null);
  const [min, setMin] = useState(0);
  const [seg, setSeg] = useState(0);

  const divRef = useRef([]); 
  const divL = useRef([]);   

  const navigate = useNavigate();

  const [bandera, setBandera] = useState(false); 
  const [finalizar, setFinalizar] = useState(true); 
  const [letras_seleccionadas, setLetrasSeleccionadas] = useState([]); 
  const [modo, setModo] = useState(""); 
  const [correctas, setCorrectas] = useState(0);
  const [estado, setEstado] = useState("perdiste")

  /*Funcion que retorna el Pop-up al render */
    const regresarComponente = () => {
        clearInterval(intervalo.current);
        return <Popup min={min} seg={seg} intentos={null} resultado={correctas} estado={estado.toUpperCase()}></Popup>
    };

  useEffect(() => {
    if (!palabrasAI) return;
    try {
      const objeto = SopaLetras(palabrasAI, 15);
      setSopa(objeto.matriz || []);
      setPalabras(objeto.palabras || []);
    } catch (err) {
      console.error("Error generando sopa:", err);
      setSopa([]);
      setPalabras([]);
    }
  }, [palabrasAI]);

  useEffect(() => {
    intervalo.current = setInterval(() => {
      if (actSeg.current >= 59) {
        actSeg.current = 0;
        setSeg(actSeg.current);
        actMin.current += 1;
        setMin(actMin.current);
      } else {
        actSeg.current += 1;
        setSeg(actSeg.current);
      }
    }, 1000);

    return () => {
      clearInterval(intervalo.current);
    };
  }, []);

  useEffect(() => {
    if(correctas === palabras.length){
      setEstado("ganaste");
    }
  }, [correctas, estado])

  const setDivRef = (div, rowIndex, colIndex) => {
    if (!divRef.current[rowIndex]) divRef.current[rowIndex] = [];
    divRef.current[rowIndex][colIndex] = div;
  };

  const setDivL = (div, rowIndex) => {
    divL.current[rowIndex] = div;
  };

  const getDivRef = (rowIndex, colIndex) => {
    return divRef.current?.[rowIndex]?.[colIndex] ?? null;
  };

  const getDivL = (rowIndex) => {
    return divL.current?.[rowIndex] ?? null;
  };

  const normalizarCadena = useCallback((s) => {
    if (typeof s !== "string") return "";
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  }, []);

  const handleMouseDown = (e, rowIndex, colIndex) => {
    const div = getDivRef(rowIndex, colIndex);
    if (!bandera && div && (div === e.target || div.contains(e.target))) {
      setBandera(true);
      setLetrasSeleccionadas([{ rowIndex, colIndex, letra: div.textContent }]);
    }
  };

  const handleMouseMove = (e, rowIndex, colIndex) => {
    if (!bandera) return;
    const div = getDivRef(rowIndex, colIndex);
    if (!div) return;
    setLetrasSeleccionadas((prev) => {
      if (prev.some(obj => obj.rowIndex === rowIndex && obj.colIndex === colIndex)) return prev;
      return [...prev, { rowIndex, colIndex, letra: div.textContent }];
    });
  };

  const handleMouseUp = (e, rowIndex, colIndex) => {
    if (!bandera) return;
    const div = getDivRef(rowIndex, colIndex);
    setBandera(false);
    setFinalizar(false);
  };

  useEffect(() => {
    if (letras_seleccionadas.length === 0) return;

    const last = letras_seleccionadas[letras_seleccionadas.length - 1];
    const lastDiv = getDivRef(last.rowIndex, last.colIndex);
    if (lastDiv) lastDiv.style.backgroundColor = '#D3D3D3';

    if (letras_seleccionadas.length >= 2) {
      const a = letras_seleccionadas[letras_seleccionadas.length - 2];
      const b = letras_seleccionadas[letras_seleccionadas.length - 1];

      if (a.rowIndex === b.rowIndex) {
        if (b.colIndex < a.colIndex) setModo('RR');
        else if (b.colIndex > a.colIndex) setModo('R');
      } else if (a.colIndex === b.colIndex) {
        if (b.rowIndex < a.rowIndex) setModo('CR');
        else if (b.rowIndex > a.rowIndex) setModo('C');
      }
    }
  }, [letras_seleccionadas]);

  useEffect(() => {
    if (finalizar) return;

    let palabraC = "";
    letras_seleccionadas.forEach(l => {
      palabraC += l.letra;
    });

    const palabraNorm = normalizarCadena(palabraC);

    const indexC = palabras.findIndex(p => normalizarCadena(p) === palabraNorm);

    if (indexC > -1) {
      /*Cambios para el pop-up*/
      setCorrectas(correctas => (correctas+=1))
      letras_seleccionadas.forEach((l) => {
        const cell = getDivRef(l.rowIndex, l.colIndex);
        if (cell) cell.style.backgroundColor = colores[indexC % colores.length];
      });
      const listDiv = getDivL(indexC);
      if (listDiv) {
        listDiv.style.backgroundColor = '#C8FFC4';
        listDiv.style.borderColor = '#39FF14';
      }
    } else {
      letras_seleccionadas.forEach((l) => {
        const cell = getDivRef(l.rowIndex, l.colIndex);
        if (cell) cell.style.backgroundColor = '#5C5C5C';
      });
    }

    setLetrasSeleccionadas([]);
    setModo("");
    setFinalizar(true);

  }, [finalizar, letras_seleccionadas, palabras, normalizarCadena]);

  useEffect(() => {
    return () => {
      if (divRef.current && divRef.current.length) {
        for (let i = 0; i < divRef.current.length; i++) {
          const row = divRef.current[i];
          if (!row) continue;
          for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            if (cell) {
              cell.style.backgroundColor = "";
            }
          }
        }
      }
      if (divL.current && divL.current.length) {
        for (let k = 0; k < divL.current.length; k++) {
          const d = divL.current[k];
          if (d) {
            d.style.backgroundColor = "";
            d.style.borderColor = "";
          }
        }
      }
      clearInterval(intervalo.current);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setBandera(false);
      setLetrasSeleccionadas([]);
      setModo("");
    }
  };

  return (
    <>
      <div className="divPantalla" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="divMetadatosS">
          <div style={{ width: "405px" }}>
            <h1 className="MdatoS" style={{ color: "#FFFF33", textShadow: "0 0 3px rgb(216, 191, 255), 0 0 6px rgb(216, 191, 255)" }}>
              Sopa
            </h1>
          </div>
          <div style={{ width: "500px", display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
            <h2 className="MdatoS" style={{ textShadow: "0 0 3px rgb(216, 191, 255), 0 0 6px rgb(216, 191, 255)" }}>
              {min >= 10 ? min : `0${min}`}:{seg >= 10 ? seg : `0${seg}`}
            </h2>
            <button className="Bsalir" style={{ color: "#0D0D0D" }} onClick={() => { navigate("/home"); }}>Salir</button>
          </div>
        </div>

        <div className="divSecundario">
          <div
            className="divSopa"
            style={{
              gridTemplateColumns: `repeat(${sopa[0]?.length ?? 0}, 1fr)`
            }}
          >
            {sopa.map((arreglo, rowKey) => (
              arreglo.map((item, colKey) => (
                <div
                  key={`${rowKey}-${colKey}`}
                  ref={(div) => setDivRef(div, rowKey, colKey)}
                  className="divLetraS"
                >
                  <div
                    style={{
                      width: '50%',
                      height: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0D0D0D',
                      userSelect: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, rowKey, colKey)}
                    onMouseMove={(e) => handleMouseMove(e, rowKey, colKey)}
                    onMouseUp={(e) => handleMouseUp(e, rowKey, colKey)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleMouseDown(e, rowKey, colKey);
                    }}
                    onTouchMove={(e) => {
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleMouseUp(e, rowKey, colKey);
                    }}
                  >
                    {item}
                  </div>
                </div>
              ))
            ))}
          </div>

          <div className="liPalabra">
            {palabras.map((item, key) => (
              <div key={key} ref={(div) => setDivL(div, key)} className="palabraS">
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
        {(estado === 'ganaste' || estado === 'perdiste') && regresarComponente()}
      </div>
    </>
  );
}

export default Sopa;
