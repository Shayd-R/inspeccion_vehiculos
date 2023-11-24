import { Router } from "express";
import pool from '../database.js';
import PdfPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';

import fonts from '../models/pdfMake/fonts.js';
import styles from '../models/pdfMake/styles.js';
import { generateContent } from '../models/pdfMake/pdfContent.js';
import { join, dirname } from 'path'
import { fileURLToPath } from 'url';
import os from 'os';


//ruta_directorio_actual
let __dirname = dirname(fileURLToPath(import.meta.url));
__dirname = join(__dirname, '..');

const router = Router();

router.get('/informes', async (req, res) => {
    try {
        const find = req.query.find;
        if (find) {
            const [inspectionData] = await pool.query(`SELECT * FROM inspectiondata
            INNER JOIN drivers ON drivers.idDriver = inspectiondata.driverId
            WHERE driverId LIKE '%`+ find + `%'  OR licensePlateId LIKE '%` + find + `%';`);
            console.log(inspectionData);
            if (inspectionData[0] === undefined) {
                const noData = 'No hay registros con esa cedula.';
                res.render('informes/informes.hbs', { inspectionData, find, noData });
            } else {
                res.render('informes/informes.hbs', { inspectionData, find });
            }
        } else if (find === '') {
            const [inspectionData] = await pool.query(`SELECT * FROM inspectiondata
            INNER JOIN drivers ON drivers.idDriver = inspectiondata.driverId;`);
            res.render('informes/informes.hbs', { inspectionData });
        } else {
            const [inspectionData] = await pool.query(`SELECT * FROM inspectiondata
            INNER JOIN drivers ON drivers.idDriver = inspectiondata.driverId;`);
            res.render('informes/informes.hbs', { inspectionData });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.get('/pdf/:idInspection', async (req, res) => {
    try {
        const idInspection = req.params.idInspection;
        const [vehicleReport] = await pool.query(`SELECT * FROM inspectiondata
            INNER JOIN drivers ON drivers.idDriver = inspectiondata.driverId
            INNER JOIN vehicleinformation ON vehicleinformation.idLicensePlate = inspectiondata.licensePlateId
            INNER JOIN licensecategory ON licensecategory.idLicenseCategory = drivers.licenseCategoryId
            INNER JOIN firms ON firms.idFirms = inspectiondata.firmsId
            WHERE inspectiondata.idInspection = `+ idInspection + `;`);


        const [inspection] = await pool.query(`SELECT subSpecification, convention, s.specificationId FROM inspection i
            LEFT JOIN subspecifications s ON i.subSpecificationsId = s.idSubspecification
            RIGHT JOIN conventions c ON c.idConvention = i.conventionId
            WHERE inspectionId = `+ idInspection);

        const [specification] = await pool.query(`SELECT * FROM specifications`);

        const content = generateContent(vehicleReport[0], inspection, specification);

        let docDefinition = {
            content: content,
            styles: styles
        };

        const printer = new PdfPrinter(fonts);

        const downloadDirectory = join(os.homedir(), 'Downloads');
        console.log(downloadDirectory + "asd");

        const currentDate = new Date();
        const date = currentDate.toISOString().replace(/[-T:\.Z]/g, '');

        if (!fs.existsSync(downloadDirectory)) {
            fs.mkdirSync(downloadDirectory, { recursive: true });
        }
        console.log(downloadDirectory + "111");

        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        const pdfPath = join(downloadDirectory, 'Inspeccion_' + date + '.pdf');
        console.log(pdfPath);
        pdfDoc.pipe(fs.createWriteStream(pdfPath));
        pdfDoc.end();

        res.redirect('/informes');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/informe', async (req, res) => {
    res.render('informes/informe.hbs');
});

export default router;