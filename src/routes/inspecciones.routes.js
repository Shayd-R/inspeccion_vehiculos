import { Router } from "express"
import pool from '../database.js'

const router = Router();

router.get('/addInspect', async (req, res) => {
    res.render('inspeccionar/addInspect.hbs');
});

router.post('/addInspect', async (req, res) => {
    //hacer validaciones
    try {
        const { idLicensePlate, driverId, driversLicenseExpiration, technomechanicsReviewExpiry, soatExpiration, expiryLifeLine, expiryCivilLiabilityPolicy, expiryCivilHydrocarbonsPolicy,
            idTrailerPlate, capacityTable, hydrostaticExpiration, expiryFifthWheel, kingPinExpiry
        } = req.body;

        const opcionSeleccionada = req.body.opcion;
        let vehicleType = '';

        if (opcionSeleccionada === 'otro') {
            vehicleType = req.body.vehicleType;
        } else {
            vehicleType = opcionSeleccionada;
        }

        const newVehicle = {
            idLicensePlate, driverId, vehicleType, driversLicenseExpiration, technomechanicsReviewExpiry, soatExpiration, expiryLifeLine, expiryCivilLiabilityPolicy, expiryCivilHydrocarbonsPolicy,
            idTrailerPlate, capacityTable, hydrostaticExpiration, expiryFifthWheel, kingPinExpiry
        }

        await pool.query('INSERT INTO vehicleinformation SET ?', [newVehicle]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/list', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT vehicleinformation.`driverId`, drivers.`name`, vehicleinformation.`idLicensePlate`, vehicleinformation.`vehicleType` FROM vehicleinformation INNER JOIN drivers ON vehicleinformation.`driverId` = drivers.`idDriver`');
        res.render('inspeccionar/inspect.hbs', { inspections: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/edit/:idLicensePlate', async (req, res) => {
    try {
        const idLicensePlate = req.params.idLicensePlate;
        const [vehicle] = await pool.query("SELECT * FROM vehicleinformation WHERE idLicensePlate = '" + idLicensePlate + "'");
        const vehicleEdit = vehicle[0];
        res.render('inspeccionar/edit.hbs', { vehicle: vehicleEdit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/edit/:idLicensePlate', async (req, res) => {
    try {
        const { driverId, driversLicenseExpiration, technomechanicsReviewExpiry, soatExpiration, expiryLifeLine, expiryCivilLiabilityPolicy, expiryCivilHydrocarbonsPolicy,
            idTrailerPlate, capacityTable, hydrostaticExpiration, expiryFifthWheel, kingPinExpiry
        } = req.body;

        const idLicensePlate = req.params.idLicensePlate;
        const opcionSeleccionada = req.body.opcion;
        let vehicleType = '';

        if (opcionSeleccionada === 'otro') {
            vehicleType = req.body.vehicleType;
        } else {
            vehicleType = opcionSeleccionada;
        }

        const editVehicle = {
            driverId, vehicleType, driversLicenseExpiration, technomechanicsReviewExpiry, soatExpiration, expiryLifeLine, expiryCivilLiabilityPolicy, expiryCivilHydrocarbonsPolicy,
            idTrailerPlate, capacityTable, hydrostaticExpiration, expiryFifthWheel, kingPinExpiry
        }
        await pool.query('UPDATE vehicleinformation SET ? WHERE idLicensePlate = ?', [editVehicle, idLicensePlate]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/inspectVehiculo/:idLicensePlate', async (req, res) => {
    try {
        const idLicensePlate = req.params.idLicensePlate;
        const [specifications] = await pool.query('SELECT * FROM specifications');
        const [subspecifications] = await pool.query('SELECT *  FROM subspecifications');
        res.render('inspeccionar/inspectVehiculo.hbs', { specifications, subspecifications, idLicensePlate });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/inspectVehiculo/:idLicensePlate', async (req, res) => {
    try {
        const date = req.body.date;
        const idLicensePlate = req.params.idLicensePlate;
        const signature = req.body.signature;
        const licensePlateId = idLicensePlate;
        const [driver] = await pool.query('SELECT driverId FROM vehicleinformation WHERE idLicensePlate = ?', [idLicensePlate]);
        const driverId = driver[0].driverId;
        const [date_bd] = await pool.query("SELECT * FROM inspectiondata WHERE driverId = '" + driverId + "' AND licensePlateId = '" + idLicensePlate + "' AND date = '" + date + "'");

        if (date_bd[0] === undefined) {
            await pool.query("INSERT INTO firms (signature) VALUES ('" + signature + "')");
            const [idFirms] = await pool.query("SELECT idFirms FROM firms WHERE signature='" + signature + "'");
            const firmsId = idFirms[0].idFirms;
            const inspectiondata = { driverId, licensePlateId, date, firmsId };
            await pool.query('INSERT INTO inspectiondata SET ?', [inspectiondata]);
            const sql = "SELECT idInspection FROM inspectiondata WHERE driverId = ? AND licensePlateId = ? AND date = ?";
            const [idIns] = await pool.query(sql, [inspectiondata.driverId, inspectiondata.licensePlateId, inspectiondata.date]);
            const inspectionId = idIns[0].idInspection;
            const [total] = await pool.query('SELECT COUNT(*) as total FROM subspecifications;');
            const values = [];
            for (let i = 1; i <= total[0].total; i++) {
                const pregunta = `${i}`;
                const respuesta = req.body[pregunta];
                values.push(`(${inspectionId}, ${pregunta},  ${respuesta})`);
            }
            await pool.query('INSERT INTO inspection (inspectionId, subSpecificationsId, conventionId) VALUES ' + `${values.join(', ')}` + ';');

        } else if (date_bd[0].date === date) {

            const sql = "SELECT idInspection FROM inspectiondata WHERE driverId = ? AND licensePlateId = ? AND date = ?";
            const [idIns] = await pool.query(sql, [driverId, licensePlateId, date]);
            const inspectionId = idIns[0].idInspection;
            const [total] = await pool.query('SELECT COUNT(*) as total FROM subspecifications;');
            const values = [];
            for (let i = 1; i <= total[0].total; i++) {
                const pregunta = `${i}`;
                const respuesta = req.body[pregunta];
                await pool.query("UPDATE inspection SET conventionId= " + `${respuesta}` + " WHERE inspectionId = " + inspectionId + " AND subSpecificationsId= " + `${pregunta}`)
            }
        }
        //libreria para mostrar mensajes (para mostrar que se ha echo el resgistro de la inspeccion) y redireccionar a informes 
        res.redirect(`/inspectVehiculo/${idLicensePlate}`);
        //res.render('informes/informes.hbs');
        //res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/*
router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM final WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
*/
export default router;