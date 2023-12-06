import { Router } from "express"
import pool from '../database.js'
import { body, validationResult, check } from 'express-validator'
import { escape } from "mysql2";

const router = Router();

router.get('/addInspect', async (req, res) => {
    const addInspect = true;
    res.render('inspeccionar/addInspect.hbs', { addInspect: addInspect, recuperationData: req.session.recuperationData || [] });
});

router.post('/addInspect', async (req, res) => {
    try {
        const { idLicensePlate, driverId, opcion, driversLicenseExpiration, technomechanicsReviewExpiry, soatExpiration, expiryLifeLine, expiryCivilLiabilityPolicy, expiryCivilHydrocarbonsPolicy,
            idTrailerPlate, capacityTable, hydrostaticExpiration, expiryFifthWheel, kingPinExpiry } = req.body;
        let vehicleType = '';
        if (opcion === 'otro') {
            vehicleType = req.body.vehicleType;
        } else {
            vehicleType = opcion;
        }
        const newVehicle = {
            idLicensePlate, vehicleType, driverId, driversLicenseExpiration, technomechanicsReviewExpiry, soatExpiration, expiryLifeLine, expiryCivilLiabilityPolicy, expiryCivilHydrocarbonsPolicy,
            idTrailerPlate, capacityTable, hydrostaticExpiration, expiryFifthWheel, kingPinExpiry
        }
        const [driverVerificationData] = await pool.query("SELECT * FROM drivers WHERE idDriver = ?", driverId);
        const driverVerification = driverVerificationData[0];

        if (!vehicleVerification) {
            const [driverVerificationData] = await pool.query("SELECT * FROM drivers WHERE idDriver = ?", driverId);
            const driverVerification = driverVerificationData[0];
            if (!driverVerification) {
                req.session.recuperationData = newVehicle;
                req.toastr.info('Debe registrar el conductor para seguir', 'Registrar condunctor', { "positionClass": "toast-top-right my-custom-class" });
                req.toastr.warning('No hay conductores con esta cédula ' + driverId, 'Conductor no registrado', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/addInspect');
            } else {
                await pool.query('INSERT INTO vehicleinformation SET ?', [newVehicle]);
                req.toastr.success('Se ha registrado el vehiculo con la placa ' + idLicensePlate, 'Registrar exitoso', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/listInspect');
            }
        } else {
            req.session.recuperationData = newVehicle;
            req.toastr.warning('Ya hay un vehiculo registrado con esta placa ' + idLicensePlate, 'Error de duplicación', { "positionClass": "toast-top-right my-custom-class" });
            res.redirect('/addInspect');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listInspect', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT vehicleinformation.`driverId`, drivers.`name`, vehicleinformation.`idLicensePlate`, vehicleinformation.`vehicleType` FROM vehicleinformation INNER JOIN drivers ON vehicleinformation.`driverId` = drivers.`idDriver`');
        const listInspect = true;
        req.session.recuperationData = null;
        res.render('inspeccionar/listInspect.hbs', { inspections: result, listInspect: listInspect });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/edit/:idLicensePlate', async (req, res) => {
    try {
        const idLicensePlate = req.params.idLicensePlate;
        const [vehicle] = await pool.query("SELECT * FROM vehicleinformation WHERE idLicensePlate = '" + idLicensePlate + "'");
        const vehicleEdit = vehicle[0];
        const edit = true;
        res.render('inspeccionar/edit.hbs', { vehicle: vehicleEdit, edit: edit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/edit/:idLicensePlate', async (req, res) => {
    try {
        const idLicensePlate = req.params.idLicensePlate;
        const { driverId, opcion, driversLicenseExpiration, technomechanicsReviewExpiry, soatExpiration, expiryLifeLine, expiryCivilLiabilityPolicy, expiryCivilHydrocarbonsPolicy,
            idTrailerPlate, capacityTable, hydrostaticExpiration, expiryFifthWheel, kingPinExpiry
        } = req.body;
        let vehicleType = '';
        if (opcion === 'otro') {
            vehicleType = req.body.vehicleType;
        } else {
            vehicleType = opcion;
        }
        const editVehicle = {
            driverId, vehicleType, driversLicenseExpiration, technomechanicsReviewExpiry, soatExpiration, expiryLifeLine, expiryCivilLiabilityPolicy, expiryCivilHydrocarbonsPolicy,
            idTrailerPlate, capacityTable, hydrostaticExpiration, expiryFifthWheel, kingPinExpiry
        }
        const [driverVerificationData] = await pool.query("SELECT * FROM drivers WHERE idDriver = ?", driverId);
        const driverVerification = driverVerificationData[0];

        if (!driverVerification) {
            req.session.recuperationData = editVehicle;
            req.toastr.info('Debe registrar el conductor para seguir', 'Registrar condunctor', { "positionClass": "toast-top-right my-custom-class" });
            req.toastr.warning('No hay conductores con esta cédula ' + driverId, 'Conductor no registrado', { "positionClass": "toast-top-right my-custom-class" });
            res.redirect(`/editInspect/${idLicensePlate}`);
        } else {
            //verificar que el driver se pueda cambiar
            await pool.query('UPDATE vehicleinformation SET ? WHERE idLicensePlate = ?', [editVehicle, idLicensePlate]);
            req.toastr.success('Se actualizo correctamente', 'Actualizacion', { "positionClass": "toast-top-right my-custom-class" });
            res.redirect('/listInspect');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/inspectVehiculo/:idLicensePlate', async (req, res) => {
    try {
        const idLicensePlate = req.params.idLicensePlate;
        const [specifications] = await pool.query('SELECT * FROM specifications');
        const [subspecifications] = await pool.query('SELECT *  FROM subspecifications');
        const inspectVehicle = true;
        res.render('inspeccionar/inspectVehiculo.hbs', { specifications, subspecifications, idLicensePlate, inspectVehicle: inspectVehicle, radioAnswers: req.session.radioAnswers || [], date: req.session.date || [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/inspectVehiculo/:idLicensePlate', async (req, res) => {
    try {
        const [total] = await pool.query('SELECT COUNT(*) as total FROM subspecifications;');
        const numberOfQuestions = total[0].total;
        const idLicensePlate = req.params.idLicensePlate;
        const date = req.body.date;
        // const radioQuestions = [];
        const radioRes = [];
        for (let i = 1; i <= numberOfQuestions; i++) {
            const pregunta = parseInt(`${i}`, 10);
            const respuesta = req.body[`${pregunta}`];
            // radioQuestions.push(respuesta);
            radioRes.push({ pregunta, respuesta });
        }
        const validations = Array(numberOfQuestions).fill().map((_, index) =>
            check(`${index + 1}`, `Selecciona una opción válida para la pregunta ${index + 1}`).isIn(['1', '2', '3'])
        );
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.toastr.error(error.msg, 'Error de validación', {
                    "positionClass": "toast-top-right my-custom-class"
                });
            });
            req.session.date = date;
            req.session.radioAnswers = radioRes;
            return res.redirect(`/inspectVehiculo/${idLicensePlate}`);
        } else {
            const licensePlateId = idLicensePlate;

            const [driver] = await pool.query('SELECT driverId FROM vehicleinformation WHERE idLicensePlate = ?', [idLicensePlate]);
            const driverId = driver[0].driverId;
            const [date_bd] = await pool.query("SELECT * FROM inspectiondata WHERE driverId = ? AND licensePlateId = ? AND date = ?", [driverId, idLicensePlate, date]);


            if (date_bd[0] === undefined) {
                const inspectiondata = { driverId, licensePlateId, date };
                await pool.query('INSERT INTO inspectiondata SET ?', [inspectiondata]);

                var sql = "SELECT idInspection FROM inspectiondata WHERE driverId = ? AND licensePlateId = ? AND date = ?";
                const [idInspection] = await pool.query(sql, [inspectiondata.driverId, inspectiondata.licensePlateId, inspectiondata.date]);
                const inspectionId = idInspection[0].idInspection;
                const answers = [];
                for (let i = 1; i <= numberOfQuestions; i++) {
                    const pregunta = `${i}`;
                    const respuesta = req.body[`${pregunta}`];
                    answers.push([inspectionId, pregunta, respuesta]);
                }

                sql = 'INSERT INTO inspection (inspectionId, subSpecificationsId, conventionId) VALUES ?';
                await pool.query(sql, [answers]);
                req.toastr.success('Realizo la inspeccion diaria', 'Inspeccion exitosa', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/informes');

            } else if (date_bd[0].date === date) {
                const sql = "SELECT idInspection FROM inspectiondata WHERE driverId = ? AND licensePlateId = ? AND date = ?";
                const [idIns] = await pool.query(sql, [driverId, licensePlateId, date]);
                const inspectionId = idIns[0].idInspection;
                const [total] = await pool.query('SELECT COUNT(*) as total FROM subspecifications;');
                for (let i = 1; i <= total[0].total; i++) {
                    const pregunta = `${i}`;
                    const respuesta = req.body[pregunta];
                    await pool.query("UPDATE inspection SET conventionId= " + `${respuesta}` + " WHERE inspectionId = " + inspectionId + " AND subSpecificationsId= " + `${pregunta}`)
                }
                req.toastr.success('Actualizo la inspección: ' + inspectionId, 'Actualización exitosa', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/informes');
            }

        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/deleteVehicle', async (req, res) => {
    try {
        const idLicensePlate = req.body.idLicensePlate;
        const [idInspectionData] = await pool.query('SELECT * FROM inspectiondata WHERE licensePlateId = ?', idLicensePlate)
        const driverId = idInspectionData[0].driverId;
        console.log(idLicensePlate[0]);
        console.log(idLicensePlate);   

        await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
        for (const row of idInspectionData) {
            const idInspection = row.idInspection;
            await pool.query('DELETE FROM inspection WHERE inspectionId = ?', idInspection);
        }
        await pool.query('DELETE FROM inspectiondata WHERE driverId = ?', driverId);
        await pool.query('DELETE FROM vehicleinformation WHERE idLicensePlate = ?', idLicensePlate);
        await pool.query('SET FOREIGN_KEY_CHECKS = 1;');
        req.toastr.success('Se ha eliminado el vehiculo con la placa ' + idLicensePlate[0], 'Eliminación', { "positionClass": "toast-top-right my-custom-class" });
        res.redirect('/listInspect');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar vehiculo');
    }
});



export default router;