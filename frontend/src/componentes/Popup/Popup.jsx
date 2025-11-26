import './Popup.css';
import { useNavigate } from "react-router-dom";

function Popup(props){
    const setLink = useNavigate();

    return (
        <>  <div className='divPantallaPP'>
                <div className='resultados'>
                    <div className='datoR'><h1 style={{color: "#FFFF33"}}>Resultados</h1></div>
                    <div className='datoR'><h2 style={{textShadow: "1px 1px 3px rgba(0, 0, 0, 0.85)"}}>Tiempo: {props.min >= 10 ? props.min :  `0${props.min}`}:{props.seg >= 10 ? props.seg :  `0${props.seg}`}</h2></div>
                    {props.intentos !== null ? (<div className='datoR'><h2 style={{textShadow: "1px 1px 3px rgba(0, 0, 0, 0.85)"}}>Intentos restantes: {props.intentos}</h2></div>) : null}
                    {props.resultado !== null ? (<div className='datoR'><h2 style={{textShadow: "1px 1px 3px rgba(0, 0, 0, 0.85)"}}>Aciertos totales: {props.resultado}</h2></div>) : null}
                    {props.estado === "PERDISTE" ? (<div className='datoR'><h2 style={{color: "#d42323", textShadow: "0 0 10px rgba(212, 35, 35, 0.6)"}}>{`¡${props.estado}!`}</h2></div>) : (<div className='datoR'><h2 style={{color: "#39FF14", textShadow: "0 0 6px rgba(57, 255, 20, 0.7), 0 0 12px rgba(57, 255, 20, 0.45), 0 0 18px rgba(57, 255, 20, 0.3)"}}>{`¡${props.estado}!`}</h2></div>)}
                    <div className='datoR'><button className='botonA' style={{background: "#FFFACD", border: "solid #FFFF33", color: "#0D0D0D", outline: "none"}} onClick={() => {setLink("/home")}}>Aceptar</button></div>
                </div>
            </div>
        </>
    );
}
export default Popup;