const pathJson = "../src/assets/metrics.json";
async function readJson(url: string = pathJson) {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`Error al cargar: ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error en la carga de datos:", error);
  }
}
