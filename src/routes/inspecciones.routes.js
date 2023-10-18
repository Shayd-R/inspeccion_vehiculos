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
            const query = 'SELECT informacionVehiculo.`conductor_id`,  conductores.nombre, informacionvehiculo.`id_placa`, informacionvehiculo.`tipoVehiculo` FROM informacionVehiculo INNER JOIN conductores ON informacionVehiculo.conductor_id = conductores.id_conductor WHERE informacionVehiculo.conductor_id = ' + find + ' OR informacionVehiculo.id_placa = ' + find
            const [result] = await pool.query(query, [find]);
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

        const opcionSeleccionada = req.body.tipoVehiculoInput;
        console.log(opcionSeleccionada);

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

router.get('/inpectVehiculo/:id_placa', async (req, res) => {
    try {
        const placa_id = req.params.id_placa;
        const [inspeccion] = await pool.query('SELECT * FROM inspeccion WHERE placa_id = ?', [placa_id]);
        if (inspeccion[0].placa_id == null) {
            const fecha = new Date().toISOString().slice(0, 10);
            const [conductor] = await pool.query('SELECT conductor_id FROM informacionvehiculo WHERE id_placa = ?', [placa_id]);
            const conductor_id = conductor[0].conductor_id;
            const newInspeccion = { conductor_id, placa_id, fecha };
            await pool.query('INSERT INTO inspeccion SET ?', [newInspeccion]);
        } 
        const [especificacion] = await pool.query('SELECT * FROM especificaciones');
        const [subespecificacion] = await pool.query('SELECT *  FROM subespecificaciones');
        res.render('inspeccionar/inspectVehiculo.hbs', { especificacion, subespecificacion });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/inpectVehiculos', async (req, res) => {
    const respuestas = req.body;
    console.log(respuestas);


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