// Importamos las clases necesarias de MongoDB
const { MongoClient, ServerApiVersion } = require("mongodb");

const  { MONGODB_USR, MONGODB_PWD } = require('./config.js');


const uri =
"mongodb+srv://" + MONGODB_USR + ":" + MONGODB_PWD + "@cluster0.hloqam6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Creamos un nuevo cliente de MongoDB con la versión estable de la API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Función para conectar a la base de datos
async function connectToDb() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB!");
    // Ahora puedes realizar operaciones de MongoDB usando el objeto `client`
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
}

// Conectamos a la base de datos
connectToDb();
// Seleccionamos la base de datos
//y la colección con la que vamos a trabajar
const database = client.db("database");
const siniestros = database.collection("siniestros");
const usuarios = database.collection("usuarios");

async function buscarUsuario(usuario) {
  return await usuarios.findOne(usuario);
}

// Función para obtener todos los siniestros
async function mostrarTodo() {
  return await siniestros.find({}).toArray();
}
// Función para ingresar un nuevo siniestro
async function ingresarSiniestro(siniestro) {
  await siniestros.insertOne(siniestro);
}
// Función para generar un nuevo número de siniestro
async function generarNumeroSiniestro() {
  let nuevoNumero = 1;
  const ultimoSiniestro = await siniestros.findOne(
    {},
    {
      sort: { numeroSiniestro: -1 },
    }
  );
  if (ultimoSiniestro) {
    nuevoNumero = ultimoSiniestro.numeroSiniestro + 1;
  }
  return nuevoNumero;
}

// Función para buscar siniestros según un criterio
async function buscarSiniestros(query) {
  const siniestro = await siniestros.find(query).toArray();
  return siniestro;
}

// Función para borrar un siniestro por número
async function borrarPorNumeroSiniestro(numeroSiniestro) {
  console.log(numeroSiniestro);
  // Borra un  siniestro por numero
  await siniestros.deleteOne({ numeroSiniestro: numeroSiniestro });
}

// Función para modificar un siniestro
async function modificarSiniestro(
  numeroSiniestro,
  numeroPoliza,
  tipoDocumento,
  documentoCliente,
  nombreCliente,
  direccionCliente,
  telefonoCliente,
  mailCliente,
  tipoVehiculo,
  patente,
  marca,
  modelo,
  anioFabricacion,
  numeroDeMotor,
  numeroDeChasis,
  tipoSiniestro,
  fechaSiniestro,
  direccionSiniestro,
  descripcionSiniestro
) {
  console.log(2);
  await siniestros.updateOne(
    { numeroSiniestro: numeroSiniestro },
    {
      $set: {
        numeroPoliza: numeroPoliza,
        tipoDocumento: tipoDocumento,
        documento: documentoCliente,
        cliente: nombreCliente,
        direccionCliente: direccionCliente,
        telefonoCliente: telefonoCliente,
        mailCliente: mailCliente,
        tipoVehiculo: tipoVehiculo,
        patente: patente,
        marca: marca,
        modelo: modelo,
        anioFabricacion: anioFabricacion,
        numeroDeMotor: numeroDeMotor,
        numeroDeChasis: numeroDeChasis,
        tipoSiniestro: tipoSiniestro,
        fechaSiniestro: fechaSiniestro,
        direccionSiniestro: direccionSiniestro,
        descripcionSiniestro: descripcionSiniestro,
      },
    }
  );
}

// Exportamos las funciones para que puedan ser
//utilizadas en otros módulos
module.exports = {
  mostrarTodo,
  ingresarSiniestro,
  generarNumeroSiniestro,
  buscarSiniestros,
  borrarPorNumeroSiniestro,
  modificarSiniestro,
  buscarUsuario,
};
