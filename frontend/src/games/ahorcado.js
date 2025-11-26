export class AhorcadoGame {
    constructor(palabra) {
        this.palabra = palabra.toUpperCase();
        this.intentos = 6;
        this.letrasCorrectas = new Set();
        this.letrasIncorrectas = new Set();
    }

    verificarLetra(letra) {
        letra = letra.toUpperCase();

        if (this.letrasCorrectas.has(letra) || this.letrasIncorrectas.has(letra)) {
            return { estado: "repetida" };
        }

        if (this.palabra.includes(letra)) {
            this.letrasCorrectas.add(letra);
            return { estado: "correcta" };
        } else {
            this.letrasIncorrectas.add(letra);
            this.intentos -= 1;
            return { estado: "incorrecta" };
        }
    }

    obtenerPalabraOculta() {
        return this.palabra
            .split("")
            .map(c => (this.letrasCorrectas.has(c) ? c : "_"))
            .join(" ");
    }

    verificarEstado() {
        if (this.intentos <= 0) return "perdiste";
        if ([...this.palabra].every(l => this.letrasCorrectas.has(l))) return "ganaste";
        return "jugando";
    }
}
