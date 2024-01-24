import { Router } from "express"
import pool from '../database.js'
import { body, validationResult, check } from 'express-validator'
import { escape } from "mysql2";

const router = Router();

router.get('/listInspect', async (req, res) => {
    try {
        const [result] = await pool.query(`
        SELECT Inspection_Id, User_FirstName, User_FirstLastName, User_SecondLastName, Vehicle_Plate, TypeVehicle_Name, Belongs_Text, CompanyVehicle_Name, StatusEvaSys_Name 
        FROM evasys_inspection
        INNER JOIN evasys_users ON evasys_users.User_Id = evasys_inspection.Inspection_IdUser
        INNER JOIN evasys_vehicle ON evasys_vehicle.Vehicle_Id = evasys_inspection.Inspection_IdVehicle
        INNER JOIN evasys_typevehicle ON evasys_typevehicle.TypeVehicle_Id = evasys_vehicle.Vehicle_IdType
        INNER JOIN evasys_belongs ON evasys_belongs.Belongs_Id = evasys_vehicle.Vehicle_IdBelongs
        INNER JOIN evasys_companyvehicle ON evasys_companyvehicle.CompanyVehicle_Id = evasys_vehicle.Vehicle_IdCompanyVehicle
        INNER JOIN evasys_status ON evasys_status.StatusEvaSys_Id = evasys_inspection.Inspection_IdStatus
        `);
        const list = true;
        req.session.recuperationData = null;
        res.render('inspeccionar/listInspect.hbs', { inspections: result, list: list});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listVehicles', async (req, res) => {
    try {
        const [resultVehicles] = await pool.query(`
        SELECT Vehicle_Id, Vehicle_Plate, Vehicle_Model, TypeVehicle_Name, ColorVehicle_Name, Belongs_Text, CompanyVehicle_Name, StatusEvaSys_Name 
        FROM evasys_vehicle 
        INNER JOIN evasys_typevehicle ON evasys_typevehicle.TypeVehicle_Id = evasys_vehicle.Vehicle_IdType
        INNER JOIN evasys_colorvehicle ON evasys_colorvehicle.ColorVehicle_Id = evasys_vehicle.Vehicle_IdColorVehicle
        INNER JOIN evasys_belongs ON evasys_belongs.Belongs_Id = evasys_vehicle.Vehicle_IdBelongs
        INNER JOIN evasys_status ON evasys_status.StatusEvaSys_Id = evasys_vehicle.Vehicle_IdStatus
        INNER JOIN evasys_companyvehicle ON evasys_companyvehicle.CompanyVehicle_Id = evasys_vehicle.Vehicle_IdCompanyVehicle
        WHERE Vehicle_IdStatus = 1 AND NOT EXISTS (SELECT 1 FROM evasys_inspection WHERE Inspection_IdVehicle = Vehicle_Id AND Inspection_IdStatus = 1)`
        );

        const [resultUsers] = await pool.query(`
        SELECT User_Id, User_FirstName, User_SecondName, User_FirstLastName, User_SecondLastName, User_UserName, StatusEvaSys_Name FROM evasys_users 
        INNER JOIN evasys_status ON evasys_status.StatusEvaSys_Id = evasys_users.User_StatusId 
        WHERE User_IdRole = 3 AND User_StatusId = 1  AND NOT EXISTS (SELECT 1 FROM evasys_inspection WHERE Inspection_IdUser = User_Id AND Inspection_IdStatus = 1)
        `);

        const list = true;
        req.session.recuperationData = null;
        res.render('inspeccionar/listVehicles.hbs', { vehicles: resultVehicles, users: resultUsers, list: list });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listVehicles/:Vehicle_Id/linkUser/', async (req, res) => {
    try {
        const [result] = await pool.query(`
        SELECT User_Id, User_FirstName, User_SecondName, User_FirstLastName, User_SecondLastName, User_UserName, StatusEvaSys_Name FROM evasys_users 
        INNER JOIN evasys_status ON evasys_status.StatusEvaSys_Id = evasys_users.User_StatusId 
        WHERE User_IdRole = 3 AND User_StatusId = 1  AND NOT EXISTS (SELECT 1 FROM evasys_inspection WHERE Inspection_IdUser = User_Id AND Inspection_IdStatus = 1)
        `);
        const Vehicle_Id = req.params.Vehicle_Id;
        const list = true;
        req.session.recuperationData = null;
        res.render('inspeccionar/listUsers.hbs', { users: result, list: list, Vehicle_Id: Vehicle_Id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listVehicles/:Vehicle_Id/linkUser/:User_Id', async (req, res) => {
    try {
        const Inspection_IdVehicle = req.params.Vehicle_Id;
        const Inspection_IdUser = req.params.User_Id;
        const insertInspection = { Inspection_IdUser, Inspection_IdVehicle };
        await pool.query('INSERT INTO evasys_inspection SET ?', [insertInspection])
        req.toastr.success('Has hecho una vinculación', 'Vinculación exitosa', { "positionClass": "toast-top-right my-custom-class" });
        res.redirect('/listInspect');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/inspectVehiculo/:Inspection_Id', async (req, res) => {
    try {
        const Inspection_Id = req.params.Inspection_Id;
        const [specifications] = await pool.query('SELECT * FROM evasys_inspectionspecification');
        const [subspecifications] = await pool.query('SELECT *  FROM evasys_inspectionsubspecifications');
        const inspectVehicle = true;
        res.render('inspeccionar/inspectVehiculo.hbs', { specifications, subspecifications, Inspection_Id, inspectVehicle: inspectVehicle, radioAnswers: req.session.radioAnswers || [], date: req.session.date || [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/inspectVehiculo/:Inspection_Id', async (req, res) => {
    try {
        const [total] = await pool.query('SELECT COUNT(*) as total FROM evasys_inspectionsubspecifications;');
        const numberOfQuestions = total[0].total;
        const InspectionDate_IdInspection = req.params.Inspection_Id;
        const InspectionDate_Date = req.body.date;
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
            req.session.date = InspectionDate_Date;
            req.session.radioAnswers = radioRes;
            return res.redirect(`/inspectVehiculo/${InspectionDate_IdInspection}`);
        } else {

            //falta la validacion de que si la fecha
            const [date_bd] = await pool.query('SELECT * FROM evasys_inspectiondate WHERE InspectionDate_IdInspection = ? AND  InspectionDate_Date = ?', [InspectionDate_IdInspection, InspectionDate_Date]);
            console.log(date_bd);

            if (!date_bd[0]) {
                const inspectiondata = { InspectionDate_IdInspection, InspectionDate_Date };
                await pool.query('INSERT INTO evasys_inspectiondate SET ?', [inspectiondata]);

                const [idInspection] = await pool.query("SELECT InspectionDate_id FROM evasys_inspectiondate WHERE InspectionDate_IdInspection = ? AND  InspectionDate_Date = ?", [InspectionDate_IdInspection, InspectionDate_Date]);
                const InspectionDate_id = idInspection[0].InspectionDate_id;
                const answers = [];
                for (let i = 1; i <= numberOfQuestions; i++) {
                    const pregunta = `${i}`;
                    const respuesta = req.body[`${pregunta}`];
                    answers.push([InspectionDate_id, pregunta, respuesta]);
                }

                await pool.query('INSERT INTO evasys_inspectiondata (InspectionData_IdDate, InspectionData_IdSubSpecification, InspectionData_IdConvention) VALUES ?', [answers]);
                req.toastr.success('Realizo la inspeccion diaria', 'Inspeccion exitosa', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/informes');
            } else if (date_bd[0].InspectionDate_Date === InspectionDate_Date) {
                const [idInspection] = await pool.query("SELECT InspectionDate_id FROM evasys_inspectiondate WHERE InspectionDate_IdInspection = ? AND  InspectionDate_Date = ?", [InspectionDate_IdInspection, InspectionDate_Date]);
                const InspectionDate_id = idInspection[0].InspectionDate_id;

                for (let i = 1; i <= numberOfQuestions; i++) {
                    const pregunta = `${i}`;
                    const respuesta = req.body[pregunta];
                    await pool.query("UPDATE evasys_inspectiondata SET InspectionData_IdConvention = " + `${respuesta}` + " WHERE InspectionData_IdDate = " + InspectionDate_id + " AND InspectionData_IdSubSpecification = " + `${pregunta}`)
                }
                req.toastr.success('Actualizo la inspección: ' + InspectionDate_id, 'Actualización exitosa', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/informes');
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/addCriteria', (req, res) => {
    const { descripcion, accionCierre, responsable } = req.body;
    //hacer las tablas con las columns en ingles, editar la consulta y variables culas

    const sql = 'INSERT INTO tu_tabla (descripcion, accion_cierre, responsable) VALUES (?, ?, ?)';
    db.query(sql, [descripcion, accionCierre, responsable], (err, result) => {
        if (err) throw err;

        console.log('Data inserted:', result);

        //ajax table update- mirar styles de la table
        res.json({ success: true });
    });
});

router.get('/editLink/:Inspection_Id', async (req, res) => {
    try {
        const Inspection_Id = req.params.Inspection_Id;
        await pool.query("UPDATE evasys_inspection SET Inspection_IdStatus = CASE WHEN Inspection_IdStatus = 1 THEN 2 ELSE 1 END WHERE Inspection_Id = ?", [Inspection_Id]);
        req.toastr.success('Exitoso', 'Cambio de estado', { "positionClass": "toast-top-right my-custom-class" });
        res.redirect('/listInspect');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});





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
            //verificar que el driver se pueda cambiar hola como
            await pool.query('UPDATE vehicleinformation SET ? WHERE idLicensePlate = ?', [editVehicle, idLicensePlate]);
            req.toastr.success('Se actualizo correctamente', 'Actualizacion', { "positionClass": "toast-top-right my-custom-class" });
            res.redirect('/listInspect');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        console.log(error);
        res.status(500).send('Error al eliminar vehiculo');
    }
});

export default router;