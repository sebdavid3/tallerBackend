import fs from 'node:fs';
const prompt = (mensaje) => {
    process.stdout.write(mensaje + " ");
    return fs.readFileSync(0, "utf8").trim();
};

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
       

const mounstrosNorm = infoMounstros.map(m => 
    {
    const immunities = m.damage_immunities || [];
    const resistances = m.damage_resistances || [];
    const vulnerabilities = m.damage_vulnerabilities || [];

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


// Part B

const crearFiltro = (mensaje) => {
    const input = prompt(mensaje);
    return new Function('m', `return ${input}`);
};


const mFilter = mounstrosNorm.filter(crearFiltro("Filtro para mFilter (ej: m.cr >= 5):"));
console.log(mFilter);

const mFind = mounstrosNorm.find(crearFiltro("Filtro para mFind (ej: m.type === 'dragon'):"));
console.log(mFind);

const mSome = mounstrosNorm.some(crearFiltro("Algun monstruo cumple? (ej: m.hasLegendary):"));
console.log(mSome);

const mEvery = mounstrosNorm.every(crearFiltro("Todos cumplen? (ej: m.hp > 0):"));
console.log(mEvery);


const tipoElegido = prompt("que propiedad quieres agrupar en mReduce? (ej: type)", "type");

const mReduce = mounstrosNorm.reduce((acc, m) => {
    const tipo = m[tipoElegido]; 

    if (!acc[tipo]) {
        acc[tipo] = { count: 0, avgCR: 0, maxHP: 0 };
    }

    acc[tipo].count++;
    acc[tipo].avgCR += m.cr;

    if (m.hp > acc[tipo].maxHP) {
        acc[tipo].maxHP = m.hp;
    }

    return acc;
}, {});

for (let tipo in mReduce) {
    mReduce[tipo].avgCR = Number((mReduce[tipo].avgCR / mReduce[tipo].count).toFixed(2));
}
console.log(mReduce);

const mBuckets = mounstrosNorm.reduce((acc, m) => {
    let bucket = "";

    if (m.cr <= 1) bucket = "0-1";
    else if (m.cr <= 4) bucket = "2-4";
    else if (m.cr <= 9) bucket = "5-9";
    else bucket = "10+";

    acc[bucket] = (acc[bucket] || 0) + 1;

    return acc;
}, {});

console.log(mBuckets);