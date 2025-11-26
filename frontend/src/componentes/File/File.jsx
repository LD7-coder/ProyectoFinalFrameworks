import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import "./File.css";
import imgFile from "../../assets/imgFile.png";

let title = "¡SUBE UN ARCHIVO!";

const File = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();  

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            setError(null);
        } else {
            setSelectedFile(null);
            setError("Por favor, selecciona un archivo PDF válido.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('pdfFile', selectedFile);

        const token = localStorage.getItem("token");

        try {
            const response = await fetch('http://localhost:3000/api/analyze-pdf', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Hubo un problema al analizar el PDF.');
            }
            localStorage.removeItem("finalData");

            localStorage.setItem("finalData", JSON.stringify(data));

            console.log("FINALDATA GUARDADO EN LOCALSTORAGE:", data);
            navigate("/home");

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const onDropZoneClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="contenedor-file">
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <h1>{title}</h1>

            <div className="archivo">
                <div onClick={onDropZoneClick} style={{ cursor: 'pointer' }}>
                    {!selectedFile ? (
                        <>
                            <img src={imgFile} alt="File" />
                            <p>Haz clic para subir tu PDF</p>
                        </>
                    ) : (
                        <div>
                            <p>Archivo seleccionado:</p>
                            <p><strong>{selectedFile.name}</strong></p>
                        </div>
                    )}
                </div>
            </div>

            <div className="upload-controls">
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                >
                    {isLoading ? 'Analizando con IA...' : 'Generar Juegos'}
                </button>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default File;
