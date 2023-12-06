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


// let __dirname = dirname(fileURLToPath(import.meta.url));
// __dirname = join(__dirname, '..');

const router = Router();

router.get('/informes', async (req, res) => {
    try {
        const [inspectionData] = await pool.query(`SELECT * FROM inspectiondata
            INNER JOIN drivers ON drivers.idDriver = inspectiondata.driverId;`);
        const listInformes = true;
        req.session.date = null;
        req.session.radioAnswers = null;
        res.render('informes/listInformes.hbs', { inspectionData, listInformes: listInformes });
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
            INNER JOIN firms ON firms.idFirms = drivers.firmsId
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

        const currentDate = new Date();
        const date = currentDate.toISOString().replace(/[-T:\.Z]/g, '');

        res.setHeader('Content-disposition', 'attachment; filename=Inspeccion_' + date + '.pdf');
        res.setHeader('Content-type', 'application/pdf');

        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar el PDF');
    }

});


router.get('/informe/:idInspection', async (req, res) => {
    try {
        const idInspection = req.params.idInspection;
        const [vehicleReport] = await pool.query(`SELECT * FROM inspectiondata
            INNER JOIN drivers ON drivers.idDriver = inspectiondata.driverId
            INNER JOIN vehicleinformation ON vehicleinformation.idLicensePlate = inspectiondata.licensePlateId
            INNER JOIN licensecategory ON licensecategory.idLicenseCategory = drivers.licenseCategoryId
            INNER JOIN firms ON firms.idFirms = drivers.firmsId
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
        const currentDate = new Date();
        const date = currentDate.toISOString().replace(/[-T:\.Z]/g, '');
        res.setHeader('Content-disposition', 'inline; filename=Inspeccion_' + date + '.pdf');
        res.setHeader('Content-type', 'application/pdf');

        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar el PDF');
    }
});

router.get('/deleteReport/:idInspection', async (req, res) => {
    try {
        const idInspection = req.params.idInspection;
        await pool.query('DELETE FROM inspection WHERE inspectionId = ?', idInspection);
        await pool.query('DELETE FROM inspectiondata WHERE idInspection = ?', idInspection);
        req.toastr.success('Se ha eliminado el reporte ' + idInspection, 'Eliminación', { "positionClass": "toast-top-right my-custom-class" });
        res.redirect('/informes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar reporte');
    }
});

export default router;