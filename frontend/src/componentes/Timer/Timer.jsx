import './Timer.css';

function Timer(){
    let tiempo = "03:09";
    return(
        <div className="containerView">
            <div className="containerTimer">
                <h1>¡Bien Hecho!</h1>
                <h2>Tiempo {tiempo}</h2>
                <button>Nuevo Juego</button>
            </div>
        </div>
    );
}

export default Timer;