const url = "https://www.dnd5eapi.co/api/2014/monsters";

async function extraerDatos() {
    try {
        const response = await fetch(url);
        const datos = await response.json();
        
        return datos.results.slice(0, 40); 
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

const mounstros = await extraerDatos();
const mounstrosUrl = mounstros.map(i=>i.url);
console.log(mounstrosUrl);




