import { Router } from "express"
import pool from '../database.js'

const router = Router();

router.get('/add', async (req, res) => {
    res.render('inspeccionar/add.hbs');
});

router.post('/add', async (req, res) => {
    //hacer validaciones
    try {
        const { id_placa, conductor_id, numeroLicenciaTransito, vencimientoLicenciaConduccion, vencimientoRevisionTecnicoMecanica, vencimientoSoat, vencimientoLineaVida, vencimientoPolizaResponsabilidadCivil, vencimientoPolizaCivilHidrocarburos,
            id_placaTrailer, tablaAforo, vencimientoHidroestatica, vencimientoQuintaRueda, vencimientoKingPin
        } = req.body;

        const opcionSeleccionada = req.body.opcion;
        let tipovehiculo = '';

        if (opcionSeleccionada === 'otro') {
            tipovehiculo = req.body.otroValor;
        } else {
            tipovehiculo = opcionSeleccionada;
        }

        const newVehiculo = {
            id_placa, conductor_id, numeroLicenciaTransito, tipovehiculo, vencimientoLicenciaConduccion, vencimientoRevisionTecnicoMecanica, vencimientoSoat, vencimientoLineaVida, vencimientoPolizaResponsabilidadCivil, vencimientoPolizaCivilHidrocarburos,
            id_placaTrailer, tablaAforo, vencimientoHidroestatica, vencimientoQuintaRueda, vencimientoKingPin
        }

        await pool.query('INSERT INTO informacionvehiculo SET ?', [newVehiculo]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/list', async (req, res) => {
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
});

router.get('/edit/:id_placa', async (req, res) => {
    try {
        const id_placa = req.params.id_placa;
        const [vehiculo] = await pool.query("SELECT * FROM informacionVehiculo WHERE id_placa = '" + id_placa + "'");
        const vehiculoEdit = vehiculo[0];
        res.render('inspeccionar/edit.hbs', { vehiculo: vehiculoEdit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/edit/:id_placa', async (req, res) => {
    try {
        const { conductor_id, numeroLicenciaTransito, vencimientoLicenciaConduccion, vencimientoRevisionTecnicoMecanica,
            vencimientoSoat, vencimientoLineaVida, vencimientoPolizaResponsabilidadCivil, vencimientoPolizaCivilHidrocarburos,
            id_placaTrailer, tablaAforo, vencimientoHidroestatica, vencimientoQuintaRueda, vencimientoKingPin } = req.body;
        const id_placa = req.params.id_placa;
        console.log(id_placa);

        let tipoVehiculo = '';

        const opcionSeleccionada1 = req.body.opcion;
        console.log(opcionSeleccionada1);
        if (opcionSeleccionada1 === 'otro') {
            tipoVehiculo = req.body.otroValor;
        } else {
            tipoVehiculo = opcionSeleccionada1;
        }

        const editVehiculo = {
            conductor_id, numeroLicenciaTransito, tipoVehiculo, vencimientoLicenciaConduccion, vencimientoRevisionTecnicoMecanica,
            vencimientoSoat, vencimientoLineaVida, vencimientoPolizaResponsabilidadCivil, vencimientoPolizaCivilHidrocarburos,
            id_placaTrailer, tablaAforo, vencimientoHidroestatica, vencimientoQuintaRueda, vencimientoKingPin
        }
        console.log(editVehiculo);
        await pool.query('UPDATE informacionVehiculo SET ? WHERE id_placa = ?', [editVehiculo, id_placa]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/inspectVehiculo/:id_placa', async (req, res) => {
    try {
        const id_placa = req.params.id_placa;
        const [especificacion] = await pool.query('SELECT * FROM especificaciones');
        const [subespecificacion] = await pool.query('SELECT *  FROM subespecificaciones');
        res.render('inspeccionar/inspectVehiculo.hbs', { especificacion, subespecificacion, id_placa });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/inspectVehiculos/:id_placa', async (req, res) => {
    const id_placa = req.params.id_placa;
    const fecha = req.body.fecha;

    const [conductor] = await pool.query('SELECT conductor_id FROM informacionvehiculo WHERE id_placa = ?', [id_placa]);
    const conductor_id = conductor[0].conductor_id;
    const placa_id = id_placa;
    const inspeccion = { conductor_id, placa_id, fecha };
    await pool.query('INSERT INTO inspeccion SET ?', [inspeccion]);

    const sql = 'SELECT id_inspeccion FROM inspeccion WHERE conductor_id = ? AND placa_id = ? AND fecha = ?';
    const [id_inspecciones] = await pool.query(sql, [inspeccion.conductor_id, inspeccion.placa_id, inspeccion.fecha]);
    const inspeccion_id = id_inspecciones[0].id_inspeccion;


    const [total] = await pool.query('SELECT COUNT(*) as total FROM subespecificaciones;');

    const values = [];
    for (let i = 1; i <= total[0].total; i++) {
        const pregunta = `${i}`;
        const respuesta = req.body[pregunta];
        values.push(`(${inspeccion_id}, ${pregunta},  ${respuesta})`);
    }

    const query = 'INSERT INTO estado (inspeccion_id,subespecificaciones_id, convenciones) VALUES ' + `${values.join(', ')}`+ ';';
    await pool.query(query);


    //libreria para mostrar mensajes (para mostrar que se ha echo el resgistro de la inspeccion) y redireccionar a informes 
    res.redirect(`/inspectVehiculo/${id_placa}`);
});


//----------------------------------------------------------------
router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM final WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;