const handleRegister = async (usuario, correo, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, correo, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        status: response.status,
        message: data.message || "Error en el servidor",
      };
    }
    return data;
  } catch (err) {
    console.error("Fallo la conexión:", err);
    return {
      status: 500,
      message: "No se pudo conectar con el servidor",
    };
  }
};
export default handleRegister;
