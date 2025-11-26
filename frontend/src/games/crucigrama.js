function CrearMatriz(tam) { 
  return Array.from({ length: tam }, () => Array(tam).fill("")); 
}

function CrearMatrizIniciales(tam) {
  return Array.from({ length: tam }, () => Array(tam).fill(false));
}

function MostrarMatriz(matriz) { 
  matriz.forEach(fila => 
    console.log(fila.map(c => (c === "" ? " " : c)).join(" ")) 
  ); 
}

function NormalizarPalabra(palabra) { 
  return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase(); 
}

function Colocar(matriz, matrizIniciales, palabra, x, y, dir) { 
  palabra = NormalizarPalabra(palabra); 
  for (let i = 0; i < palabra.length; i++) { 
    const nx = dir === "H" ? x : x + i;
    const ny = dir === "H" ? y + i : y;

    const letraNueva = palabra[i];
    const esInicialNueva = i === 0;

    if (matriz[nx][ny] === "") {
      matriz[nx][ny] = letraNueva;
    } else {
      const letraExistente = matriz[nx][ny];
      const esInicialExistente = matrizIniciales[nx][ny];

      if (esInicialNueva && esInicialExistente && letraExistente.toUpperCase() === letraNueva.toUpperCase()) {
        matriz[nx][ny] = letraExistente + letraNueva; 
      }
    }

    if (esInicialNueva) matrizIniciales[nx][ny] = true;
  } 
}

function BuscarCoincidencias(matriz, palabra) { 
  let coincidencias = []; 
  palabra = palabra.toUpperCase(); 
  for (let x = 0; x < matriz.length; x++) { 
    for (let y = 0; y < matriz.length; y++) { 
      const letra = matriz[x][y].toUpperCase(); 
      if (letra && palabra.includes(letra)) { 
        coincidencias.push({ 
          x, 
          y, 
          letra, 
          indicePalabra: palabra.indexOf(letra) 
        }); 
      } 
    } 
  } 
  return coincidencias; 
}

function VerSiCabeConCruce(matriz, palabra, x, y, dir, indicePalabra) { 
  palabra = palabra.toUpperCase(); 
  const n = matriz.length; 
  for (let i = 0; i < palabra.length; i++) { 
    const nx = dir === "H" ? x : x + (i - indicePalabra); 
    const ny = dir === "H" ? y + (i - indicePalabra) : y; 
    if (nx < 0 || ny < 0 || nx >= n || ny >= n) return false; 
    const celda = matriz[nx][ny]; 
    if (celda !== "" && celda.toUpperCase() !== palabra[i]) return false; 
  } 
  return true; 
}

function ColocarConCruce(matriz, matrizIniciales, palabra, x, y, dir, indicePalabra) { 
  palabra = NormalizarPalabra(palabra); 
  for (let i = 0; i < palabra.length; i++) { 
    const nx = dir === "H" ? x : x + (i - indicePalabra); 
    const ny = dir === "H" ? y + (i - indicePalabra) : y; 
    const letraNueva = palabra[i];
    const esInicialNueva = i === 0;

    if (matriz[nx][ny] === "") {
      matriz[nx][ny] = letraNueva;
    } else {
      const letraExistente = matriz[nx][ny];
      const esInicialExistente = matrizIniciales[nx][ny];

      if (esInicialNueva && esInicialExistente && letraExistente.toUpperCase() === letraNueva.toUpperCase()) {
        matriz[nx][ny] = letraExistente + letraNueva; 
      }
    }

    if (esInicialNueva) matrizIniciales[nx][ny] = true;
  } 
}

function BuscarPalabraMasLarga(palabras) { 
  let palabraMasLarga = palabras[0]; 
  let indice = 0; 
  for (let i = 1; i < palabras.length; i++) { 
    if (palabras[i].length > palabraMasLarga.length) { 
      palabraMasLarga = palabras[i]; 
      indice = i; 
    } 
  } 
  return [palabraMasLarga, indice]; 
}

function ColocarPalabras(matriz, matrizIniciales, palabras) { 
  const n = matriz.length; 
  const [primera, indice] = BuscarPalabraMasLarga(palabras); 
  const startX = Math.floor(n / 2); 
  const startY = Math.floor((n - primera.length) / 2); 
  Colocar(matriz, matrizIniciales, primera, startX, startY, "H"); 
  palabras.splice(indice, 1); 
  let intentos = 0; 
  while (palabras.length > 0 && intentos < 2000) { 
    let palabra = palabras.shift(); 
    const palabraMayus = palabra.toUpperCase(); 
    const coincidencias = BuscarCoincidencias(matriz, palabraMayus); 
    let colocado = false; 
    for (const c of coincidencias) { 
      for (const dir of ["H", "V"]) { 
        if (VerSiCabeConCruce(matriz, palabraMayus, c.x, c.y, dir, c.indicePalabra)) { 
          ColocarConCruce(matriz, matrizIniciales, palabra, c.x, c.y, dir, c.indicePalabra); 
          colocado = true; 
          break; 
        } 
      } 
      if (colocado) break; 
    } 
    if (!colocado) { 
      for (let intento = 0; intento < 100; intento++) { 
        const dir = Math.random() < 0.5 ? "H" : "V"; 
        const x = Math.floor(Math.random() * n); 
        const y = Math.floor(Math.random() * n); 
        if (VerSiCabeConCruce(matriz, palabraMayus, x, y, dir, 0)) { 
          Colocar(matriz, matrizIniciales, palabra, x, y, dir); 
          colocado = true; 
          break; 
        } 
      } 
    } 
    if (!colocado) palabras.push(palabra); 
    intentos++; 
  } 
}

function CapitalizarIniciales(matriz, matrizIniciales) {
  const n = matriz.length;
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const c = matriz[x][y];
      if (c === "") continue;
      if (matrizIniciales[x][y]) {
        matriz[x][y] = c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
      } else {
        matriz[x][y] = c.toLowerCase();
      }
    }
  }
}

function Crucigrama(palabras, tam) { 
  const matriz = CrearMatriz(tam); 
  const matrizIniciales = CrearMatrizIniciales(tam);
  ColocarPalabras(matriz, matrizIniciales, palabras); 
  CapitalizarIniciales(matriz, matrizIniciales);
  MostrarMatriz(matriz); 
  return { matriz, palabras }; 
}

//Crucigrama(["FER", "DAVID", "LUIS", "FRAMEWORKS", "SOFTWARE","LUNES","MAPACHE","CARRUSEL","HALLOWEEN"], 15);

export default Crucigrama;
