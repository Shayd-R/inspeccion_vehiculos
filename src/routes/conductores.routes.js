import { Router } from "express"
import pool from '../database.js'

const router = Router();

router.get('/addconductor', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM licensecategory');
        const addconductor = true;
        res.render('conductores/add.hbs', { category: result, addconductor: addconductor, errorDriver: req.session.recuperationData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/addDriver', async (req, res) => {
    try {
        const { idDriver, name, cellPhoneNumber, licenseNumber, licensecategoryId, driversLicenseExpiration } = req.body;
        const newDriver = { idDriver, name, cellPhoneNumber, licenseNumber, licensecategoryId, driversLicenseExpiration }
        const signature = req.body.signature;
        const [driverVerificationData] = await pool.query("SELECT * FROM drivers WHERE idDriver = ?", idDriver);
        const driverVerification = driverVerificationData[0];
        if (!driverVerification) {
            if (!signature) {
                req.session.recuperationData = newDriver;
                req.toastr.info('Debe subir una firma', 'Digitalización de firma', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/addconductor');
            } else {
                await pool.query("INSERT INTO firms (signature) VALUES ('" + signature + "')");
                const [idFirms] = await pool.query("SELECT idFirms FROM firms WHERE signature='" + signature + "'");
                newDriver.firmsId = idFirms[0].idFirms;
                await pool.query('INSERT INTO drivers SET ?', [newDriver]);
                req.toastr.success('El conductor ha sido registrado', 'Creación', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/listconductores');
            }
        } else {
            req.session.recuperationData = newDriver;
            req.toastr.info('Esta cedula ya esta registrada', 'Error de registro', { "positionClass": "toast-top-right my-custom-class" });
            res.redirect('/addconductor');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/editDriver/:idDriver', async (req, res) => {
    try {
        const idDriver = req.params.idDriver;
        const [driverE] = await pool.query("SELECT idDriver, name, cellPhoneNumber, licenseNumber, idlicensecategory, category, driversLicenseExpiration, firmsId ,signature FROM drivers INNER JOIN licensecategory ON drivers.`licensecategoryId` = licensecategory.`idlicensecategory` INNER JOIN firms ON drivers.`firmsId`=firms.`idFirms`WHERE idDriver = " + idDriver);
        const driverEdit = driverE[0];
        const [result] = await pool.query('SELECT * FROM licensecategory');
        const edit = true;
        res.render('conductores/edit.hbs', { category: result, driver: driverEdit, edit: edit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editdriver/:idDriver/:firmsId', async (req, res) => {
    try {
        const driverId = req.params.idDriver;
        const idFirms = req.params.firmsId;
        const signature = req.body.signature;
        const signature1 = req.body.signature_cp;
        if (signature === "" && signature1 === "" || signature === undefined && signature1 === undefined) {
            req.toastr.error('No ingreso la firma', 'Error', { "positionClass": "toast-top-right my-custom-class" });
        } else {
            const updateFirmsQuery = "UPDATE firms SET signature = ? WHERE idFirms = ?";
            const updatedriversQuery = "UPDATE drivers SET idDriver = ?, name = ?, cellPhoneNumber = ?, licenseNumber = ?, licenseCategoryId = ?, driversLicenseExpiration = ? WHERE idDriver = ?";
            const { idDriver, name, cellPhoneNumber, licenseNumber, licenseCategoryId, driversLicenseExpiration } = req.body;
            try {
                if (signature) {
                    await pool.query(updateFirmsQuery, [signature, idFirms]);
                } else if (signature1) {
                    await pool.query(updateFirmsQuery, [signature1, idFirms]);
                }
                await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
                await pool.query("UPDATE vehicleinformation SET driverId = ? WHERE driverId = ?", [idDriver, driverId]);
                await pool.query("UPDATE inspectiondata SET driverId = ? WHERE driverId = ?", [idDriver, driverId]);
                await pool.query(updatedriversQuery, [idDriver, name, cellPhoneNumber, licenseNumber, licenseCategoryId, driversLicenseExpiration, driverId]);
                await pool.query('SET FOREIGN_KEY_CHECKS = 1;');

                req.toastr.info('El conductor ha sido editado', 'Modificación', { "positionClass": "toast-top-right my-custom-class" });
                res.redirect('/listconductores');
            } catch (error) {
                throw error;
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/*router.get('/deleteDriver/:idDriver', async (req, res) => {
    //Hacer la eliminación
    try {
        const updateFirmsQuery = "UPDATE firms SET signature = ? WHERE idFirms = ?";
            const updatedriversQuery = "UPDATE drivers SET name = ?, cellPhoneNumber = ?, licenseNumber = ?, licensecategoryId = ?, driversLicenseExpiration = ? WHERE idDriver = ?";

        const idDriver = req.params.idDriver;
        const [driverE] = await pool.query("SELECT idDriver, name, cellPhoneNumber, licenseNumber, idlicensecategory, category, driversLicenseExpiration, firmsId ,signature FROM drivers INNER JOIN licensecategory ON drivers.`licensecategoryId` = licensecategory.`idlicensecategory` INNER JOIN firms ON drivers.`firmsId`=firms.`idFirms`WHERE idDriver = " + idDriver);

        res.redirect('/listconductores');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});*/

router.get('/listconductores', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT drivers.`idDriver`, drivers.`name`, drivers.`cellPhoneNumber`, drivers.`licenseNumber`, licensecategory.`category`, drivers.`driversLicenseExpiration` FROM drivers INNER JOIN licensecategory ON drivers.`licenseCategoryId` = licensecategory.`idLicenseCategory`');
        const listConductors = true;
        req.session.recuperationData = null;
        res.render('conductores/list.hbs', { drivers: result, listConductors: listConductors });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;