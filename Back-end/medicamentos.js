import express from "express";
import mysql from "mysql";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medicamentos'
});

conexion.connect(function (error) {
    if (error) {
        console.log("Error al conectar la base de datos");
    } else {
        console.log('Conexión exitosa');
    }
});

app.get('/obtenerNombreMedicamentos', (peticion, respuesta) => {
    const sql = "SELECT nombre FROM medicamentos";
    conexion.query(sql, (error, resultado) => {
        if (error) return respuesta.json({ error: "Error en la consulta" });
        const nombres = resultado.map((row) => row.nombre);
        return respuesta.json({ nombresMedicamentos: nombres });
    });
});

app.post('/registrarUsuario', (req, res) => {
    const { full_name, email, password } = req.body;
    const sql = 'INSERT INTO usuarios (full_name, email, password) VALUES (?, ?, ?)';
    conexion.query(sql, [full_name, email, password], (error, resultado) => {
      if (error) {
        console.error(error);
        return res.json({ error: 'Error al registrar el usuario' });
      }
      return res.json({ mensaje: 'Usuario registrado con éxito' });
    });
  });

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  
    conexion.query(sql, [email, password], (error, results) => {
      if (error) {
        console.error(error);
        return res.json({ error: 'Error en la consulta' });
      }
  
      if (results.length === 1) {
        return res.json({ mensaje: 'Autenticación exitosa' });
      } else {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }
    });
  });

app.post('/calcularSiguienteDosis', (req, res) => {
  const {
    nombre,
    dosis,
    frecuencia,
    duracion,
    comentarios,
    horaInicio,
    soloParaMalestar,
    horaTomado,
  } = req.body;

  console.log('Datos del medicamento recibidos:', data);


  const currentDate = new Date();
  const nextDoseTime = new Date(currentDate);
  nextDoseTime.setHours(currentDate.getHours() + parseInt(frecuencia));

  res.json({ nextDoseTime });
  res.json({ mensaje: 'Siguiente dosis calculada con éxito' });

});

app.listen(8084, () => {
    console.log('Servidor en el puerto 8084');
});
