import { Router } from "express"
import pool from '../database.js'

const router = Router();

router.get('/addconductor', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM licensecategory');
        res.render('conductores/add.hbs', {category: result});
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

router.get('/listconductores', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT Drivers.`idDriver`, Drivers.`name`, Drivers.`cellPhoneNumber`, Drivers.`licenseNumber`, licenseCategory.`category`, Drivers.`driversLicenseExpiration`  FROM Drivers INNER JOIN licenseCategory ON Drivers.`licenseCategoryId` = licenseCategory.`idLicenseCategory`');
        res.render('conductores/list.hbs', { drivers: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



export default router;