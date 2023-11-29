import { Router } from "express"
import pool from '../database.js'

const router = Router();

router.get('/addconductor', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM licensecategory');
        const addconductor = true;
        res.render('conductores/add.hbs', { category: result, addconductor: addconductor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/addconductor', async (req, res) => {
    //hacer validaciones y la notificacion de creacion de conductor
    try {
        const { idDriver, name, cellPhoneNumber, licenseNumber, licenseCategoryId, driversLicenseExpiration } = req.body;
        const newDriver = { idDriver, name, cellPhoneNumber, licenseNumber, licenseCategoryId, driversLicenseExpiration }
        await pool.query('INSERT INTO drivers SET ?', [newDriver]);
        res.redirect('/listconductores');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/editDriver/:idDriver', async (req, res) => {
    try {


        const idDriver = req.params.idDriver;
        const [driverE] = await pool.query("SELECT idDriver, name, cellPhoneNumber, licenseNumber, idLicenseCategory, category, driversLicenseExpiration FROM drivers INNER JOIN licensecategory ON drivers.`licenseCategoryId` = licensecategory.`idLicenseCategory` WHERE idDriver = " + idDriver);
        const driverEdit = driverE[0];
        console.log(driverEdit);
        const [result] = await pool.query('SELECT * FROM licensecategory');
        res.render('conductores/edit.hbs', { category: result, driver: driverEdit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editdriver/:idDriver', async (req, res) => {
    //hacer validaciones y la notificacion de creacion de conductor
    try {
        const idDriver = req.params.idDriver;
        const { name, cellPhoneNumber, licenseNumber, licenseCategoryId, driversLicenseExpiration } = req.body;
        console.log("UPDATE drivers SET name = '" + name + "', cellPhoneNumber = '" + cellPhoneNumber + "', licenseNumber = '" + licenseNumber + "', licenseCategoryId = " + licenseCategoryId + ", driversLicenseExpiration = '" + driversLicenseExpiration + "' WHERE idDriver = " + idDriver);
        await pool.query("UPDATE drivers SET name = '" + name + "', cellPhoneNumber = '" + cellPhoneNumber + "', licenseNumber = '" + licenseNumber + "', licenseCategoryId = " + licenseCategoryId + ", driversLicenseExpiration = '" + driversLicenseExpiration + "' WHERE idDriver = " + idDriver);
        res.redirect('/listconductores');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listconductores', async (req, res) => {
    try {

        const [result] = await pool.query('SELECT Drivers.`idDriver`, Drivers.`name`, Drivers.`cellPhoneNumber`, Drivers.`licenseNumber`, licenseCategory.`category`, Drivers.`driversLicenseExpiration`  FROM Drivers INNER JOIN licenseCategory ON Drivers.`licenseCategoryId` = licenseCategory.`idLicenseCategory`');
        const listConductors = true;
        res.render('conductores/list.hbs', { drivers: result, listConductors: listConductors });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



export default router;