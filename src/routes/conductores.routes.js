import { Router } from "express"
import pool from '../database.js'

const router = Router();

router.get('/addconductor', async (req, res) => {
    res.render('conductores/add.hbs');
});

router.post('/addconductor', async (req, res) => {
    //hacer validaciones
    try {
        const { id_conductor, nombre, telefono } = req.body;

        const newConductor = {id_conductor, nombre, telefono}

        await pool.query('INSERT INTO conductores SET ?', [newConductor]);
        
        res.redirect('/listconductores');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listconductores', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM conductores');
        res.render('conductores/list.hbs', { conductores: result });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;