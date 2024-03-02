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

let __dirname = dirname(fileURLToPath(import.meta.url));
__dirname = join(__dirname, '..');

const router = Router();

router.get('/informes', async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const [inspectionData] = await pool.query(`
        WITH RankedInspections AS (
            SELECT 
                i.Inspection_Id, 
                u.User_FirstName, 
                u.User_FirstLastName, 
                u.User_SecondLastName, 
                v.Vehicle_Plate, 
                tv.TypeVehicle_Name, 
                b.Belongs_Text, 
                cv.CompanyVehicle_Name,
                id.InspectionDate_Id,
                id.InspectionDate_Date,
                ROW_NUMBER() OVER (PARTITION BY YEAR(id.InspectionDate_Date), MONTH(id.InspectionDate_Date), v.Vehicle_Plate ORDER BY id.InspectionDate_Date DESC) AS RowNum
            FROM 
                evasys_inspection i
            INNER JOIN 
                evasys_users u ON u.User_Id = i.Inspection_IdUser
            INNER JOIN 
                evasys_vehicle v ON v.Vehicle_Id = i.Inspection_IdVehicle
            INNER JOIN 
                evasys_typevehicle tv ON tv.TypeVehicle_Id = v.Vehicle_IdType
            INNER JOIN 
                evasys_belongs b ON b.Belongs_Id = v.Vehicle_IdBelongs
            INNER JOIN 
                evasys_companyvehicle cv ON cv.CompanyVehicle_Id = v.Vehicle_IdCompanyVehicle
            INNER JOIN 
                evasys_inspectiondate id ON id.InspectionDate_IdInspection = i.Inspection_Id
        )
        SELECT 
            Inspection_Id, 
            User_FirstName, 
            User_FirstLastName, 
            User_SecondLastName, 
            Vehicle_Plate, 
            TypeVehicle_Name, 
            Belongs_Text, 
            CompanyVehicle_Name,
            InspectionDate_Id,
            DATE_FORMAT(InspectionDate_Date, '%Y-%m-%d') AS InspectionDate_Date,
            DATE_FORMAT(InspectionDate_Date, '%Y-%m') AS InspectionDate_DateFormat
        FROM 
            RankedInspections
        WHERE 
            RowNum = 1
        ORDER BY 
            YEAR(InspectionDate_Date) DESC, 
            MONTH(InspectionDate_Date) DESC,
            Vehicle_Plate;
        `);
            const listInformes = true;
            req.session.date = null;
            req.session.radioAnswers = null;

            const [user] = await pool.query('SELECT User_IdRole FROM evasys_users WHERE User_UserName =  ?', req.session.user);

            let rolDriver = true;

            if (user && user.length > 0) {
                const userRole = user[0].User_IdRole;
                if (userRole === 1 || userRole === 2) {
                    rolDriver = false;
                }
            }

            res.render('informes/listInformes.hbs', { inspectionData, listInformes: listInformes, rolDriver: rolDriver, user: req.session.user, inspectDriver: req.session.inspectionDriver });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        const error = true;
        res.render('error/error.hbs', { error: error });
    }
});

router.get('/pdf/:Inspection_Id/:InspectionDate_Date', async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const Inspection_Id = req.params.Inspection_Id;
            const InspectionDate_Date = req.params.InspectionDate_Date;

            const [vehicleReport] = await pool.query(`
        SELECT Inspection_Id, User_UserName,User_FirstName, User_SecondName, User_FirstLastName, User_SecondLastName,  
        Driver_Phone, Driver_CategoryLicense, Driver_NumLicense, Driver_ExpirationDate, Vehicle_Id, Vehicle_Plate, Vehicle_IdType, Vehicle_Model, 
        TypeVehicle_Name, ColorVehicle_Name, Belongs_Text, CompanyVehicle_Name, ImagesProfile_Data 
        FROM evasys_inspection
        INNER JOIN evasys_users ON evasys_users.User_Id = evasys_inspection.Inspection_IdUser
        INNER JOIN evasys_driver ON evasys_driver.Driver_Id = evasys_users.User_Id
        INNER JOIN evasys_vehicle ON evasys_vehicle.Vehicle_Id = evasys_inspection.Inspection_IdVehicle
        INNER JOIN evasys_typevehicle ON evasys_typevehicle.TypeVehicle_Id = evasys_vehicle.Vehicle_IdType
        INNER JOIN evasys_colorvehicle ON evasys_colorvehicle.ColorVehicle_Id = evasys_vehicle.Vehicle_IdColorVehicle
        INNER JOIN evasys_belongs ON evasys_belongs.Belongs_Id = evasys_vehicle.Vehicle_IdBelongs
        INNER JOIN evasys_status ON evasys_status.StatusEvaSys_Id = evasys_vehicle.Vehicle_IdStatus
        INNER JOIN evasys_companyvehicle ON evasys_companyvehicle.CompanyVehicle_Id = evasys_vehicle.Vehicle_IdCompanyVehicle
        LEFT JOIN evasys_imagesprofile ON evasys_imagesprofile.ImagesProfile_UserName = evasys_users.User_UserName
        WHERE Inspection_Id = `+ Inspection_Id);

            const [inspection] = await pool.query(`
        SELECT InspectionDate_Date, InspectionSubSpecification_Id, InspectionSubSpecification_Name, InspectionConvention_Name, InspectionSubSpecification_IdSpecification  FROM evasys_inspectiondate
        INNER JOIN evasys_inspectiondata ON evasys_inspectiondata.InspectionData_IdDate = evasys_inspectiondate.InspectionDate_id
        INNER JOIN evasys_inspectionsubspecifications ON evasys_inspectionsubspecifications.InspectionSubSpecification_Id = evasys_inspectiondata.InspectionData_IdSubSpecification
        INNER JOIN evasys_inspectionconvetions ON evasys_inspectionconvetions.InspectionConvention_Id = evasys_inspectiondata.InspectionData_IdConvention
        WHERE InspectionDate_IdInspection = ${Inspection_Id} AND InspectionDate_Date LIKE '%${InspectionDate_Date}%'`);

            const [specification] = await pool.query(`SELECT * FROM evasys_inspectionsubspecifications`);
            //terminar pdf
            const content = generateContent(vehicleReport[0], inspection, specification);
            let docDefinition = {
                content: content,
                styles: styles,
                pageMargins: [10, 10, 10, 10],
                pageSize: 'EXECUTIVE',
                scale: 0.85,
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
            res.status(500).send('Error al generar el PDF');
        }
    } else {
        const error = true;
        res.render('error/error.hbs', { error: error });
    }
});

router.get('/informe/:Inspection_Id/:InspectionDate_DateFormat', async (req, res) => {
    //if (req.session && req.session.user) {
    try {
        const Inspection_Id = req.params.Inspection_Id;
        const InspectionDate_Date = req.params.InspectionDate_DateFormat;

        const [vehicleReport] = await pool.query(`
            SELECT Inspection_Id, User_UserName,User_FirstName, User_SecondName, User_FirstLastName, User_SecondLastName,  
            Driver_Phone, Driver_CategoryLicense, Driver_NumLicense, Driver_ExpirationDate, Vehicle_Id, Vehicle_Plate, Vehicle_IdType, Vehicle_Model, 
            TypeVehicle_Name, ColorVehicle_Name, Belongs_Text, CompanyVehicle_Name, ImagesProfile_Data 
            FROM evasys_inspection
            INNER JOIN evasys_users ON evasys_users.User_Id = evasys_inspection.Inspection_IdUser
            INNER JOIN evasys_driver ON evasys_driver.Driver_Id = evasys_users.User_Id
            INNER JOIN evasys_vehicle ON evasys_vehicle.Vehicle_Id = evasys_inspection.Inspection_IdVehicle
            INNER JOIN evasys_typevehicle ON evasys_typevehicle.TypeVehicle_Id = evasys_vehicle.Vehicle_IdType
            INNER JOIN evasys_colorvehicle ON evasys_colorvehicle.ColorVehicle_Id = evasys_vehicle.Vehicle_IdColorVehicle
            INNER JOIN evasys_belongs ON evasys_belongs.Belongs_Id = evasys_vehicle.Vehicle_IdBelongs
            INNER JOIN evasys_status ON evasys_status.StatusEvaSys_Id = evasys_vehicle.Vehicle_IdStatus
            INNER JOIN evasys_companyvehicle ON evasys_companyvehicle.CompanyVehicle_Id = evasys_vehicle.Vehicle_IdCompanyVehicle
            LEFT JOIN evasys_imagesprofile ON evasys_imagesprofile.ImagesProfile_UserName = evasys_users.User_UserName
            WHERE Inspection_Id = `+ Inspection_Id);

        const [inspection] = await pool.query(`
            SELECT InspectionDate_Date, InspectionSubSpecification_Id, InspectionSubSpecification_Name, InspectionConvention_Name, InspectionSubSpecification_IdSpecification  FROM evasys_inspectiondate
            INNER JOIN evasys_inspectiondata ON evasys_inspectiondata.InspectionData_IdDate = evasys_inspectiondate.InspectionDate_id
            INNER JOIN evasys_inspectionsubspecifications ON evasys_inspectionsubspecifications.InspectionSubSpecification_Id = evasys_inspectiondata.InspectionData_IdSubSpecification
            INNER JOIN evasys_inspectionconvetions ON evasys_inspectionconvetions.InspectionConvention_Id = evasys_inspectiondata.InspectionData_IdConvention
            WHERE InspectionDate_IdInspection = ${Inspection_Id} AND InspectionDate_Date LIKE '%${InspectionDate_Date}%'`);

        const [breachedcriteria] = await pool.query(`
            SELECT DISTINCT breachedCriteria_Id, breachedCriteria_Description,breachedCriteria_ClosingAction, breachedCriteria_UserName,
            DATE_FORMAT(eid.InspectionDate_Date, '%Y-%m') AS MesAnioInspeccion,
            breachedCriteria_Date
            FROM evasys_inspectiondate eid
            LEFT JOIN evasys_breachedcriteria ebc ON eid.InspectionDate_IdInspection = ebc.breachedCriteria_IdInspection
                AND DATE_FORMAT(eid.InspectionDate_Date, '%Y-%m') = DATE_FORMAT(ebc.breachedCriteria_Date, '%Y-%m')
            WHERE DATE_FORMAT(eid.InspectionDate_Date, '%Y-%m') LIKE ? AND eid.InspectionDate_IdInspection = ?
                AND ebc.breachedCriteria_Date IS NOT NULL
            ORDER BY MesAnioInspeccion, ebc.breachedCriteria_Date;
            `, [InspectionDate_Date, Inspection_Id]);


        const [specification] = await pool.query(`SELECT * FROM evasys_inspectionsubspecifications`);
        //terminar pdf
        const content = generateContent(vehicleReport[0], inspection, specification, breachedcriteria);
        let docDefinition = {
            content: content,
            styles: styles,
            pageMargins: [10, 10, 10, 10],
            pageSize: 'EXECUTIVE',
            scale: 0.85,
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
        res.status(500).send('Error al generar el PDF');
    }
    //} else {
    //  const error = true;
    //res.render('error/error.hbs', { error: error });
    //}
});

router.get('/completedInspections/:Inspection_Id', async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const Inspection_Id = req.params.Inspection_Id;
            const listInformes = true;
            res.render('inspeccionar/completedInspections.hbs', { listInformes: listInformes, Inspection_Id });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        const error = true;
        res.render('error/error.hbs', { error: error });
    }
});

router.get('/getDatesReport/:Inspection_Id/:year/:month', async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const Inspection_Id = req.params.Inspection_Id;
            const year = req.params.year;
            const month = req.params.month;

            const query = `
            SELECT DAY(InspectionDate_Date) AS day 
            FROM evasys_inspectiondate 
            INNER JOIN evasys_inspection ON evasys_inspection.Inspection_Id = evasys_inspectiondate.InspectionDate_IdInspection
            WHERE MONTH(InspectionDate_Date) = ? AND Inspection_Id = ? AND YEAR(InspectionDate_Date) = ? `;

            const [fechasInforme] = await pool.query(query, [year, month, Inspection_Id]);

            res.json(fechasInforme);
        } catch (error) {
            console.error('Error al obtener fechas de informe:', error);
            res.status(500).json({ message: error.message });
        }
    } else {
        const error = true;
        res.render('error/error.hbs', { error: error });
    }
});



export default router;