/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 10.6.12-MariaDB-0ubuntu0.22.04.1 : Database - suratrans
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`suratrans` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `suratrans`;

/*Table structure for table `Firms` */

DROP TABLE IF EXISTS `Firms`;

CREATE TABLE `Firms` (
  `id_Firms` int(10) NOT NULL,
  `signature` blob DEFAULT NULL COMMENT 'Firma de cada usuario',
  PRIMARY KEY (`id_Firms`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `Firms` */

/*Table structure for table `conductores` */

DROP TABLE IF EXISTS `conductores`;

CREATE TABLE `conductores` (
  `id_conductor` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id_conductor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

/*Data for the table `conductores` */

insert  into `conductores`(`id_conductor`,`nombre`,`telefono`) values 
(1006663257,'shayd ruano','3107531564'),
(1006663258,'shayd augusto ruano','3107531564');

/*Table structure for table `convenciones` */

DROP TABLE IF EXISTS `convenciones`;

CREATE TABLE `convenciones` (
  `id_convenciones` int(11) NOT NULL,
  `detalle` varchar(255) NOT NULL,
  PRIMARY KEY (`id_convenciones`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

/*Data for the table `convenciones` */

insert  into `convenciones`(`id_convenciones`,`detalle`) values 
(1,'Bueno'),
(2,'Malo'),
(3,'No_aplica');

/*Table structure for table `especificaciones` */

DROP TABLE IF EXISTS `especificaciones`;

CREATE TABLE `especificaciones` (
  `id_especificaciones` int(11) NOT NULL,
  `detalle` varchar(255) NOT NULL,
  PRIMARY KEY (`id_especificaciones`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

/*Data for the table `especificaciones` */

insert  into `especificaciones`(`id_especificaciones`,`detalle`) values 
(1,'NIVELES'),
(2,'LLANTAS'),
(3,'SISTEMA MECANICO Y AMARRES'),
(4,'LUCES'),
(5,'ELECTRICO');

/*Table structure for table `informacionvehiculo` */

DROP TABLE IF EXISTS `informacionvehiculo`;

CREATE TABLE `informacionvehiculo` (
  `id_placa` varchar(20) NOT NULL,
  `conductor_id` int(11) DEFAULT NULL,
  `numeroLicenciaTransito` varchar(20) DEFAULT NULL,
  `tipoVehiculo` varchar(20) DEFAULT NULL,
  `vencimientoLicenciaConduccion` varchar(20) DEFAULT NULL,
  `vencimientoRevisionTecnicoMecanica` varchar(20) DEFAULT NULL,
  `vencimientoSoat` varchar(20) DEFAULT NULL,
  `vencimientoLineaVida` varchar(20) DEFAULT NULL,
  `vencimientoPolizaResponsabilidadCivil` varchar(20) DEFAULT NULL,
  `vencimientoPolizaCivilHidrocarburos` varchar(20) DEFAULT NULL,
  `id_placaTrailer` varchar(20) DEFAULT NULL,
  `tablaAforo` varchar(20) DEFAULT NULL,
  `vencimientoHidroestatica` varchar(20) DEFAULT NULL,
  `vencimientoQuintaRueda` varchar(20) DEFAULT NULL,
  `vencimientoKingPin` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_placa`),
  KEY `tipoVehiculo_id` (`tipoVehiculo`),
  KEY `conductor_id` (`conductor_id`),
  CONSTRAINT `informacionvehiculo_ibfk_1` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id_conductor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

/*Data for the table `informacionvehiculo` */

insert  into `informacionvehiculo`(`id_placa`,`conductor_id`,`numeroLicenciaTransito`,`tipoVehiculo`,`vencimientoLicenciaConduccion`,`vencimientoRevisionTecnicoMecanica`,`vencimientoSoat`,`vencimientoLineaVida`,`vencimientoPolizaResponsabilidadCivil`,`vencimientoPolizaCivilHidrocarburos`,`id_placaTrailer`,`tablaAforo`,`vencimientoHidroestatica`,`vencimientoQuintaRueda`,`vencimientoKingPin`) values 
('1111',1006663258,'11111asd','Tracto_Camion','2023-10-25','2023-10-25','2023-10-25','2023-10-25','2023-10-25','2023-10-25','32mmm','321mma','2023-10-25','2023-10-25','2023-10-25'),
('12312',1006663257,'dasdasd','Doble_Troque','2023-10-09','2023-10-19','2023-10-19','2023-10-19','2023-10-19','2023-10-19','hlkjahfkjs','132a1sd5','2023-10-19','2023-10-19','2023-10-19'),
('asdasd123',1006663258,'11111111','Doble_Troque','2023-10-09','2023-10-08','2023-10-09','2023-10-09','2023-10-09','2023-10-09','asdasd3123','321321zzz','2023-10-15','2023-10-15','2023-10-15');

/*Table structure for table `informciontanque` */

DROP TABLE IF EXISTS `informciontanque`;

CREATE TABLE `informciontanque` (
  `id_placaTrailer` varchar(10) NOT NULL,
  `tablaAforo` varchar(255) NOT NULL,
  `vencimientoHidroestatica` date DEFAULT NULL,
  `vencimientoQuintaRueda` date DEFAULT NULL,
  `vencimientoKingPin` date DEFAULT NULL,
  PRIMARY KEY (`id_placaTrailer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

/*Data for the table `informciontanque` */

/*Table structure for table `inspeccion` */

DROP TABLE IF EXISTS `inspeccion`;

CREATE TABLE `inspeccion` (
  `id_inspeccion` int(11) NOT NULL AUTO_INCREMENT,
  `conductor_id` int(11) DEFAULT NULL,
  `placa_id` varchar(20) DEFAULT NULL,
  `fecha` varchar(20) DEFAULT NULL,
  `Firms_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id_inspeccion`),
  KEY `placa_id` (`placa_id`),
  KEY `conductor_id` (`conductor_id`),
  KEY `Firms_id` (`Firms_id`),
  CONSTRAINT `inspeccion_ibfk_4` FOREIGN KEY (`placa_id`) REFERENCES `informacionvehiculo` (`id_placa`),
  CONSTRAINT `inspeccion_ibfk_5` FOREIGN KEY (`Firms_id`) REFERENCES `Firms` (`id_Firms`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

/*Data for the table `inspeccion` */

insert  into `inspeccion`(`id_inspeccion`,`conductor_id`,`placa_id`,`fecha`,`Firms_id`) values 
(1,1006663258,'asdasd123','2023-10-15',NULL),
(9,1006663257,'12312','2023-10-18',NULL),
(42,1006663258,'1111','2023-10-27',NULL);

/*Table structure for table `subespecificaciones` */

DROP TABLE IF EXISTS `subespecificaciones`;

CREATE TABLE `subespecificaciones` (
  `id_subEspecificaciones` int(11) NOT NULL AUTO_INCREMENT,
  `detalle` varchar(255) NOT NULL,
  `especificacion_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_subEspecificaciones`),
  KEY `especificacion_id` (`especificacion_id`),
  CONSTRAINT `subespecificaciones_ibfk_1` FOREIGN KEY (`especificacion_id`) REFERENCES `especificaciones` (`id_especificaciones`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

/*Data for the table `subespecificaciones` */

insert  into `subespecificaciones`(`id_subEspecificaciones`,`detalle`,`especificacion_id`) values 
(1,'NIVEL DE ACPM',1),
(2,'AGUA RADIADOR (SE-DT-TC)',1),
(3,'ACEITE MOTOR (SE-DT-TC)',1),
(4,'AGUA LIMPIABRISAS (SE-DT-TC)',1),
(5,'ACEITE HIDRAULICO (SE-DT-TC)',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
