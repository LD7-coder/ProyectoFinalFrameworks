const handleLogin = async (usuario, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: response.status,
        message: data.message || "Error en la petición"
      };
    }

    return data;

  } catch (err) {
    console.error("Error handleLogin:", err);
    return {
      status: 500,
      message: "Error en el servidor"
    };
  }
};
export default handleLogin;
