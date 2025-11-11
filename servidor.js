// ---------------------------------------------
// Paso 1: Importar librerías necesarias
// ---------------------------------------------
const express = require('express');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------
// Paso 2: Configuración inicial
// ---------------------------------------------
const app = express();
const PORT = 3000;
const NOMBRE_ARCHIVO = 'registros.csv';
const RUTA_ARCHIVO = path.join(__dirname, NOMBRE_ARCHIVO);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // carpeta donde está tu HTML, CSS, imágenes, etc.

// ---------------------------------------------
// Paso 3: Crear archivo CSV si no existe
// ---------------------------------------------
if (!fs.existsSync(RUTA_ARCHIVO)) {
  console.log(`📄 Creando el archivo ${NOMBRE_ARCHIVO}...`);
  const header = `"Fecha","Nombre_de_Cliente","Contacto","Zona","Canton","Parroquia","Tipo_de_Servicio","Marca","Residuos_evitados","Numero_de_beneficiarios","Costo_de_repuesto","Costo_de_servicio"\n`;
  fs.writeFileSync(RUTA_ARCHIVO, header, 'utf8');
}

// ---------------------------------------------
// Paso 4: Ruta para guardar formulario
// ---------------------------------------------
app.post('/guardar-formulario', (req, res) => {
  const {
    Fecha,
    Nombre_de_Cliente,
    Contacto,
    Zona,
    Canton,
    Parroquia,
    Tipo_de_Servicio,
    Marca,
    Descripcion,
    Residuos_evitados,
    Numero_de_beneficiarios,
    Costo_de_repuesto,
    Costo_de_servicio
  } = req.body;

  // Si el campo Tipo_de_Servicio tiene múltiples opciones (checkboxes)
  const servicio = Array.isArray(Tipo_de_Servicio)
    ? Tipo_de_Servicio.join('|')
    : (Tipo_de_Servicio || '');

  // Evitar problemas con comas en CSV
  const escapar = (valor) => `"${(valor || '').toString().replace(/"/g, '""')}"`;

  const nuevaLinea = [
    escapar(Fecha),
    escapar(Nombre_de_Cliente),
    escapar(Contacto),
    escapar(Zona),
    escapar(Canton),
    escapar(Parroquia),
    escapar(servicio),
    escapar(Marca),
    escapar(Descripcion),
    escapar(Residuos_evitados),
    escapar(Numero_de_beneficiarios),
    escapar(Costo_de_repuesto),
    escapar(Costo_de_servicio)
  ].join(',') + '\n';

  // Guardar en archivo CSV
  fs.appendFile(RUTA_ARCHIVO, nuevaLinea, (err) => {
    if (err) {
      console.error('❌ Error al guardar los datos:', err);
      return res.status(500).send('Error interno del servidor al guardar los datos.');
    }

    console.log(`✅ Registro guardado: ${Nombre_de_Cliente} (${Fecha})`);
    res.redirect('/gracias.html');
  });
});

// ---------------------------------------------
// Paso 5: Iniciar el servidor
// ---------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
