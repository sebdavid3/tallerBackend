const url = "https://www.dnd5eapi.co/api/2014/monsters";
const baseApi = "https://www.dnd5eapi.co"
async function extraerDatos() {
    try {
        const response = await fetch(url);
        const datos = await response.json();
       
        return datos.results.slice(0, 40);
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}


async function extraerDatosMounstros(mounstros) {
    try {
   
        const promesas = mounstros.map(url => fetch(url));

        const respuestas = await Promise.all(promesas);

        const datos = await Promise.all(respuestas.map(r => r.json()));

        return datos;


    } catch(error){
        console.log(error);
    }
}



const mounstros = await extraerDatos();


const mounstrosUrl = mounstros.map(i => `${baseApi}${i.url}`);

const infoMounstros = await extraerDatosMounstros(mounstrosUrl);
console.log(infoMounstros);
       

const mounstrosNorm = infoMounstros.map(m => 
    {
    return{
     index:m.index,
     name:m.name,
     size:m.size,
     type:m.type,
     alignment:m.alignment,
     cr:m.challenge_rating,
     ac: m.armor_class?.[0]?.value ,
     hp:m.hit_points,
     speed:m.speed,
     stats: {
        str: m.strength,
        dex: m.dexterity,
        con: m.constitution,
        int: m.intelligence,
        wis: m.wisdom,
        cha: m.charisma
    },
        immuneCount: immunities.length,
        resistCount: resistances.length,
        vulnCount: vulnerabilities.length
    };
});

console.log(mounstrosNorm);
