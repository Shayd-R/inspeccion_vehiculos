import { Router } from "express"
import pool from '../database.js'

const router = Router();

router.get('/informes', async (req, res) => {

    try {
        const find = req.query.find;
        if (find) {
            const query = "SELECT informacionVehiculo.conductor_id, conductores.nombre, informacionvehiculo.id_placa, informacionvehiculo.tipoVehiculo FROM informacionVehiculo INNER JOIN conductores ON informacionVehiculo.conductor_id = conductores.id_conductor WHERE informacionVehiculo.conductor_id LIKE '%" + find + "%' OR informacionVehiculo.id_placa LIKE '%" + find + "%'"

            const [result] = await pool.query(query, [find]);
            if (result[0] === undefined) {
                const noData = 'No hay registros con esa cedula.';
                res.render('inspeccionar/inspect.hbs', { inspecciones: result, find, noData });
            } else {
                res.render('inspeccionar/inspect.hbs', { inspecciones: result, find });
            }

        } else if (find === '') {
            const [result] = await pool.query('SELECT informacionVehiculo.`conductor_id`,  conductores.nombre, informacionvehiculo.`id_placa`, informacionvehiculo.`tipoVehiculo` FROM informacionVehiculo INNER JOIN conductores ON informacionVehiculo.conductor_id = conductores.id_conductor');
            res.render('inspeccionar/inspect.hbs', { inspecciones: result });
        } else {
            const [result] = await pool.query('SELECT informacionVehiculo.`conductor_id`,  conductores.nombre, informacionvehiculo.`id_placa`, informacionvehiculo.`tipoVehiculo` FROM informacionVehiculo INNER JOIN conductores ON informacionVehiculo.conductor_id = conductores.id_conductor');
            res.render('inspeccionar/inspect.hbs', { inspecciones: result });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    res.render('informes/informes.hbs');
});



export default router;