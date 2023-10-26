import { Router } from "express"
import pool from '../database.js'

const router = Router();

router.get('/informes', async (req, res) => {
    res.render('informes/informes.hbs');
});

export default router;