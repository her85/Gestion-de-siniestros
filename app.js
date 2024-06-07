/**
 Nombre del proyecto
Claims Service Integrate (CSI)
 
Objetivo
Brindar una herramienta digital para gestionar de manera eficiente y 
centralizada la información relacionada con los siniestros de automóviles

 APis
 GET / 
 GET /ingresar_siniestro
 GET /consultar_siniestro
 GET /consultar_siniestro/datos
 POST /ingresar_siniestro
 DELETE /borrar_siniestro
 PUT /modificar_siniestro
 */
// Importamos las librerías necesarias
const express = require("express");
const path = require("path");
const ejs = require("ejs");
// Importamos las funciones de la base de datos
const {
  mostrarTodo,
  ingresarSiniestro,
  generarNumeroSiniestro,
  buscarSiniestros,
  borrarPorNumeroSiniestro,
  modificarSiniestro,
} = require("./db");
// Creamos una nueva aplicación Express
const app = express();
// Configuramos el servidor para usar archivos estáticos de la carpeta 'views'
app.use(express.static("views"));
// Configuramos el servidor para parsear el cuerpo de las solicitudes HTTP
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Configuramos el motor de plantillas a usar y la carpeta donde se encuentran
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Definimos las rutas de nuestra aplicación

// Renderizamos la página principal
app.get("/", (req, res) => {
  res.render("index");
});

// Renderizamos la página para ingresar un nuevo siniestro
app.get("/ingresar_siniestro", (req, res) => {
  res.render("ingresar_siniestro");
});

// Ruta para consultar siniestros y mostrar todos los siniestros
app.get("/consultar_siniestro", async (req, res) => {
  // Obtenemos todos los siniestros y los pasamos a la plantilla
  res.render("consultar_siniestro", {
    siniestros: await mostrarTodo(),
  });
});

// Ruta para consultar siniestros por diferentes consultas
app.get("/consultar_siniestro/datos", async (req, res) => {
  // Creamos un objeto vacío para la consulta
  const query = {};
  // Si el número de siniestro está presente en la consulta, lo agregamos al objeto de consulta
  if (req.query.numeroSiniestro) {
    query.numeroSiniestro = parseInt(req.query.numeroSiniestro);
  }
  // Si el documento del cliente está presente en la consulta, lo agregamos al objeto de consulta
  if (req.query.documentoCliente) {
    query.documento = parseInt(req.query.documentoCliente);
  }
  if (req.query.patente) {
    query.patente = req.query.patente.toUpperCase();
  }
  // Si las fechas desde y hasta están presentes en la consulta, las agregamos al objeto de consulta
  if (req.query.desdeFechaSiniestro || req.query.hastaFechaSiniestro) {
    query.fechaSiniestro = {};

    if (req.query.desdeFechaSiniestro) {
      query.fechaSiniestro.$gte = new Date(req.query.desdeFechaSiniestro);
    }

    if (req.query.hastaFechaSiniestro) {
      query.fechaSiniestro.$lte = new Date(req.query.hastaFechaSiniestro);
    }
    console.log(query.fechaSiniestro);
  }
  // Buscamos los siniestros que coincidan con la consulta
  const siniestros = await buscarSiniestros(query);
  if (siniestros && siniestros.length > 0) {
    // Si se encuentra el siniestro, renderizar la plantilla con el resultado
    res.render("consultas", { siniestros });
  } else {
    // Si no se encuentra el siniestro
    console.log("Siniestro no encontrado");
    res.render("consultas", { siniestros });
  }
});

// Ruta para ingresar siniestros
app.post("/ingresar_siniestro", async (req, res) => {
  // Generamos un nuevo número de siniestro
  const numeroSiniestro = await generarNumeroSiniestro();

  // Si la fecha del siniestro es válida, continuamos con el ingreso del siniestro
  await ingresarSiniestro({
    numeroSiniestro: numeroSiniestro,
    numeroPoliza: parseInt(req.body.numeroPoliza),
    tipoDocumento: req.body.tipoDocumento,
    documento: parseInt(req.body.documentoCliente),
    cliente: req.body.nombreCliente.toUpperCase(),
    direccionCliente: req.body.direccionCliente.toUpperCase(),
    telefonoCliente: req.body.telefonoCliente,
    mailCliente: req.body.mailCliente,
    tipoVehiculo: req.body.tipoVehiculo,
    patente: req.body.patente.toUpperCase(),
    marca: req.body.marca.toUpperCase(),
    modelo: req.body.modelo.toUpperCase(),
    anioFabricacion: req.body.anioFabricacion,
    numeroDeMotor: req.body.numeroDeMotor.toUpperCase(),
    numeroDeChasis: req.body.numeroDeChasis.toUpperCase(),
    tipoSiniestro: req.body.tipoSiniestro,
    fechaSiniestro: new Date(req.body.fechaSiniestro),
    direccionSiniestro: req.body.direccionSiniestro.toUpperCase(),
    descripcionSiniestro: req.body.descripcionSiniestro,
  });
  res.render("index");
});

// Ruta para borrar siniestros por número de siniestro
app.delete("/borrar_siniestro", async (req, res) => {
  // Obtiene el cuerpo de la solicitud
  const siniestro = parseInt(req.body);
  console.log(siniestro);
  //Borrar por numero de siniestro
  await borrarPorNumeroSiniestro(siniestro);
  console.log(1);
  console.log(siniestro);
  if (siniestro) {
    console.log("Se borro el siniestro");
  } else {
    console.log("No se borro el siniestro");
  }
});

// Ruta para modificar un siniestro por número de siniestro
app.put("/modificar_siniestro", async (req, res) => {
  console.log(1);
  // Obtiene el cuerpo de la solicitud
  const numeroSiniestro = parseInt(req.body.numeroSiniestro);
  const numeroPoliza = parseInt(req.body.numeroPoliza);
  const tipoDocumento = req.body.tipoDocumento;
  const documentoCliente = parseInt(req.body.documentoCliente);
  const nombreCliente = req.body.nombreCliente.toUpperCase();
  const direccionCliente = req.body.direccionCliente.toUpperCase();
  const telefonoCliente = req.body.telefonoCliente;
  const mailCliente = req.body.mailCliente;
  const tipoVehiculo = req.body.tipoVehiculo;
  const patente = req.body.patente.toUpperCase();
  const marca = req.body.marca.toUpperCase();
  const modelo = req.body.modelo.toUpperCase();
  const anioFabricacion = req.body.anioFabricacion;
  const numeroDeMotor = req.body.numeroDeMotor.toUpperCase();
  const numeroDeChasis = req.body.numeroDeChasis.toUpperCase();
  const tipoSiniestro = req.body.tipoSiniestro;
  const nuevaFecha = req.body.fechaSiniestro;
  const fechaSiniestro = new Date(nuevaFecha);
  fechaSiniestro.setMinutes(
    fechaSiniestro.getMinutes() + fechaSiniestro.getTimezoneOffset()
  );

  const direccionSiniestro = req.body.direccionSiniestro.toUpperCase();
  const descripcionSiniestro = req.body.descripcionSiniestro;

  console.log(fechaSiniestro);
  // Modificamos el siniestro en la base de datos
  await modificarSiniestro(
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
  );
  console.log(3);
});

// Iniciamos el servidor en el puerto 3000
app.listen(3000);
console.log("Escuchando puerto 3000");
