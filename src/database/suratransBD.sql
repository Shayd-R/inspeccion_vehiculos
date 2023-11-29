/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 8.0.30 : Database - suratrans
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`suratrans` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `suratrans`;

/*Table structure for table `conventions` */

DROP TABLE IF EXISTS `conventions`;

CREATE TABLE `conventions` (
  `idConvention` int NOT NULL,
  `convention` varchar(10) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  PRIMARY KEY (`idConvention`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `conventions` */

insert  into `conventions`(`idConvention`,`convention`) values 
(1,'Bueno'),
(2,'Malo'),
(3,'No aplica');

/*Table structure for table `drivers` */

DROP TABLE IF EXISTS `drivers`;

CREATE TABLE `drivers` (
  `idDriver` int NOT NULL COMMENT 'id del conductor',
  `name` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT 'Nombre',
  `cellPhoneNumber` varchar(15) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL COMMENT 'Celular',
  `licenseNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Numero de licencia',
  `licenseCategoryId` int DEFAULT NULL COMMENT 'Categoria de la licencia',
  `driversLicenseExpiration` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Fecha de vencimiento de la licencia',
  PRIMARY KEY (`idDriver`),
  KEY `licenseCategoryId` (`licenseCategoryId`),
  CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`licenseCategoryId`) REFERENCES `licensecategory` (`idLicenseCategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `drivers` */

insert  into `drivers`(`idDriver`,`name`,`cellPhoneNumber`,`licenseNumber`,`licenseCategoryId`,`driversLicenseExpiration`) values 
(18126775,'harold bladimir ruano','3127887123','11112235',1,'2023-11-25'),
(123456789,'WILLINTONG FONSECA ','3208373085','1124858074',1,'2024-01-25'),
(1006663258,'SHAYD AUGUSTO RUANO RODRIGUEZ','3107531564','1111222',1,'2023-11-07');

/*Table structure for table `firms` */

DROP TABLE IF EXISTS `firms`;

CREATE TABLE `firms` (
  `idFirms` int NOT NULL AUTO_INCREMENT COMMENT 'Id de la firma',
  `signature` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Firmas',
  PRIMARY KEY (`idFirms`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `firms` */

insert  into `firms`(`idFirms`,`signature`) values 
(33,'data:image/png;base64,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'),
(34,'data:image/png;base64,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');

/*Table structure for table `inspection` */

DROP TABLE IF EXISTS `inspection`;

CREATE TABLE `inspection` (
  `inspectionId` int DEFAULT NULL COMMENT 'Id foranea de la inspeccion',
  `subSpecificationsId` int DEFAULT NULL COMMENT 'Id foranea de las subespecificaciones',
  `conventionId` int DEFAULT NULL COMMENT 'Id foranea de las convenciones',
  KEY `conventionId` (`conventionId`),
  KEY `inspectionId` (`inspectionId`),
  KEY `subSpecificationsId` (`subSpecificationsId`),
  CONSTRAINT `inspection_ibfk_1` FOREIGN KEY (`conventionId`) REFERENCES `conventions` (`idConvention`),
  CONSTRAINT `inspection_ibfk_2` FOREIGN KEY (`inspectionId`) REFERENCES `inspectiondata` (`idInspection`),
  CONSTRAINT `inspection_ibfk_3` FOREIGN KEY (`subSpecificationsId`) REFERENCES `subspecifications` (`idSubspecification`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `inspection` */

insert  into `inspection`(`inspectionId`,`subSpecificationsId`,`conventionId`) values 
(70,2,2),
(70,3,2),
(70,4,2),
(70,5,3),
(70,1,1),
(71,1,1),
(71,2,2),
(71,3,2),
(71,4,2),
(71,5,2);

/*Table structure for table `inspectiondata` */

DROP TABLE IF EXISTS `inspectiondata`;

CREATE TABLE `inspectiondata` (
  `idInspection` int NOT NULL AUTO_INCREMENT COMMENT 'Id de datos de inspeccion',
  `driverId` int DEFAULT NULL COMMENT 'Id foranea de los conductores(cedula)',
  `licensePlateId` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL COMMENT 'Id foranea de la placa de los vehiculos',
  `date` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Fecha de cuando se realiza la inspeccion',
  `firmsId` int DEFAULT NULL COMMENT 'Firma foranea',
  PRIMARY KEY (`idInspection`),
  KEY `driverId` (`driverId`),
  KEY `firmsId` (`firmsId`),
  KEY `licensePlateId` (`licensePlateId`),
  CONSTRAINT `inspectiondata_ibfk_1` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`idDriver`),
  CONSTRAINT `inspectiondata_ibfk_2` FOREIGN KEY (`firmsId`) REFERENCES `firms` (`idFirms`),
  CONSTRAINT `inspectiondata_ibfk_3` FOREIGN KEY (`licensePlateId`) REFERENCES `vehicleinformation` (`idLicensePlate`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `inspectiondata` */

insert  into `inspectiondata`(`idInspection`,`driverId`,`licensePlateId`,`date`,`firmsId`) values 
(70,1006663258,'xxxxxx','2023-11-07',33),
(71,1006663258,'ccccc','2023-11-11',34);

/*Table structure for table `licensecategory` */

DROP TABLE IF EXISTS `licensecategory`;

CREATE TABLE `licensecategory` (
  `idLicenseCategory` int NOT NULL AUTO_INCREMENT COMMENT 'Id de la categoria',
  `category` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Categoria de la licencia',
  PRIMARY KEY (`idLicenseCategory`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `licensecategory` */

insert  into `licensecategory`(`idLicenseCategory`,`category`) values 
(1,'C3');

/*Table structure for table `specifications` */

DROP TABLE IF EXISTS `specifications`;

CREATE TABLE `specifications` (
  `idSpecifications` int NOT NULL COMMENT 'Id de la especificacion',
  `specification` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT 'Detalle de la especificacion',
  PRIMARY KEY (`idSpecifications`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `specifications` */

insert  into `specifications`(`idSpecifications`,`specification`) values 
(1,'NIVELES'),
(2,'LLANTAS'),
(3,'SISTEMA MECANICO Y AMARRES'),
(4,'LUCES'),
(5,'ELECTRICO');

/*Table structure for table `subspecifications` */

DROP TABLE IF EXISTS `subspecifications`;

CREATE TABLE `subspecifications` (
  `idSubspecification` int NOT NULL AUTO_INCREMENT COMMENT 'Id de la subespecificaciones',
  `subSpecification` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL COMMENT 'Detalle de la subespecificaciones',
  `specificationId` int DEFAULT NULL COMMENT 'Id foranea de especificaciones',
  PRIMARY KEY (`idSubspecification`),
  KEY `especificacion_id` (`specificationId`),
  CONSTRAINT `subspecifications_ibfk_1` FOREIGN KEY (`specificationId`) REFERENCES `specifications` (`idSpecifications`),
  CONSTRAINT `subspecifications_ibfk_2` FOREIGN KEY (`specificationId`) REFERENCES `specifications` (`idSpecifications`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `subspecifications` */

insert  into `subspecifications`(`idSubspecification`,`subSpecification`,`specificationId`) values 
(1,'NIVEL DE ACPM',1),
(2,'AGUA RADIADOR (SE-DT-TC)',1),
(3,'ACEITE MOTOR (SE-DT-TC)',1),
(4,'AGUA LIMPIABRISAS (SE-DT-TC)',1),
(5,'ACEITE HIDRAULICO (SE-DT-TC)',1);

/*Table structure for table `vehicleinformation` */

DROP TABLE IF EXISTS `vehicleinformation`;

CREATE TABLE `vehicleinformation` (
  `idLicensePlate` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL COMMENT 'Id de la placa del vehiculo',
  `driverId` int DEFAULT NULL COMMENT 'Id foranea del conductor(cedula)',
  `vehicleType` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Tipo de vehiculo',
  `driversLicenseExpiration` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento licencia de conduccion',
  `technomechanicsReviewExpiry` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento revision tenico mecanica',
  `soatExpiration` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento de soat',
  `expiryLifeLine` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento linea de vida',
  `expiryCivilLiabilityPolicy` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento poliza de responsabilidad civil',
  `expiryCivilHydrocarbonsPolicy` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento poliza civil hidrocarburos',
  `idTrailerPlate` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL COMMENT 'Id de la placa trailer',
  `capacityTable` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL COMMENT 'Tabla de aforo',
  `hydrostaticExpiration` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento hidroestatica',
  `expiryFifthWheel` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento quinta rueda',
  `kingPinExpiry` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Vencimiento king pin',
  PRIMARY KEY (`idLicensePlate`),
  KEY `driverId` (`driverId`),
  KEY `vehicleTypeId` (`vehicleType`),
  CONSTRAINT `vehicleinformation_ibfk_1` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`idDriver`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `vehicleinformation` */

insert  into `vehicleinformation`(`idLicensePlate`,`driverId`,`vehicleType`,`driversLicenseExpiration`,`technomechanicsReviewExpiry`,`soatExpiration`,`expiryLifeLine`,`expiryCivilLiabilityPolicy`,`expiryCivilHydrocarbonsPolicy`,`idTrailerPlate`,`capacityTable`,`hydrostaticExpiration`,`expiryFifthWheel`,`kingPinExpiry`) values 
('asd123123',1006663258,'Doble troque','2023-11-25','2023-11-25','2023-11-07','2023-11-25','2023-11-25','2023-11-25','asdasd','asdasd','2023-11-25','2023-11-25','2023-11-25'),
('asdasss',1006663258,'Tracto camion','2023-11-25','2023-11-25','2023-11-25','2023-11-25','2023-11-25','2023-11-25','asdasd12312','asdasdfsdf','2023-11-25','2023-11-25','2023-11-25'),
('asdasss111',1006663258,'Sencillo','2023-11-25','2023-11-25','2023-11-25','2023-11-25','2023-11-25','2023-11-25','asdasd123122','asdasdfsdf2','2023-11-25','2023-11-25','2023-11-25'),
('ccccc',1006663258,'Contingencia','2023-11-11','2023-11-11','2023-11-11','2023-11-11','2023-11-11','2023-11-11','asccccc','sccccc','2023-11-11','2023-11-11','2023-11-11'),
('xxxxxx',1006663258,'Tracto camión','2023-11-06','2023-11-06','2023-11-06','2023-11-06','2023-11-06','2023-11-06','asdjlñlkas','sfdfsdf','2023-11-23','2023-11-06','2023-11-06');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
