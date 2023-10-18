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
CREATE DATABASE /*!32312 IF NOT EXISTS*/`suratrans` /*!40100 DEFAULT CHARACTER SET utf16 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `suratrans`;

/*Table structure for table `conductores` */

DROP TABLE IF EXISTS `conductores`;

CREATE TABLE `conductores` (
  `id_conductor` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id_conductor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

/*Data for the table `conductores` */

insert  into `conductores`(`id_conductor`,`nombre`,`telefono`) values 
(1006663257,'shayd ruano','3107531564'),
(1006663258,'shayd','3107531564');

/*Table structure for table `convenciones` */

DROP TABLE IF EXISTS `convenciones`;

CREATE TABLE `convenciones` (
  `id_convenciones` int NOT NULL,
  `detalle` varchar(255) NOT NULL,
  PRIMARY KEY (`id_convenciones`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

/*Data for the table `convenciones` */

insert  into `convenciones`(`id_convenciones`,`detalle`) values 
(1,'bueno'),
(2,'malo'),
(3,'no aplica');

/*Table structure for table `especificaciones` */

DROP TABLE IF EXISTS `especificaciones`;

CREATE TABLE `especificaciones` (
  `id_especificaciones` int NOT NULL,
  `detalle` varchar(255) NOT NULL,
  PRIMARY KEY (`id_especificaciones`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

/*Data for the table `especificaciones` */

insert  into `especificaciones`(`id_especificaciones`,`detalle`) values 
(1,'NIVELES'),
(2,'LLANTAS'),
(3,'SISTEMA MECANICO Y AMARRES'),
(4,'LUCES'),
(5,'ELECTRICO'),
(6,'CABINA'),
(7,'VIDRIOS'),
(8,'TANQUE'),
(9,'CONDICIONES GENERALES'),
(10,'SISTEMA DE SEGURIDAD'),
(11,'KIT DE CONTINGENCIA');

/*Table structure for table `estado` */

DROP TABLE IF EXISTS `estado`;

CREATE TABLE `estado` (
  `inspeccion_id` int DEFAULT NULL,
  `subespecificaciones_id` int DEFAULT NULL,
  `convenciones` int DEFAULT NULL,
  KEY `inspeccion_id` (`inspeccion_id`),
  KEY `convenciones` (`convenciones`),
  KEY `subespecificaciones_id` (`subespecificaciones_id`),
  CONSTRAINT `estado_ibfk_1` FOREIGN KEY (`inspeccion_id`) REFERENCES `inspeccion` (`id_inspeccion`),
  CONSTRAINT `estado_ibfk_3` FOREIGN KEY (`convenciones`) REFERENCES `convenciones` (`id_convenciones`),
  CONSTRAINT `estado_ibfk_4` FOREIGN KEY (`subespecificaciones_id`) REFERENCES `subespecificaciones` (`id_subEspecificaciones`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

/*Data for the table `estado` */

/*Table structure for table `informacionvehiculo` */

DROP TABLE IF EXISTS `informacionvehiculo`;

CREATE TABLE `informacionvehiculo` (
  `id_placa` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `conductor_id` int DEFAULT NULL,
  `numeroLicenciaTransito` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
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
  CONSTRAINT `informacionvehiculo_ibfk_2` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id_conductor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

/*Data for the table `informacionvehiculo` */

insert  into `informacionvehiculo`(`id_placa`,`conductor_id`,`numeroLicenciaTransito`,`tipoVehiculo`,`vencimientoLicenciaConduccion`,`vencimientoRevisionTecnicoMecanica`,`vencimientoSoat`,`vencimientoLineaVida`,`vencimientoPolizaResponsabilidadCivil`,`vencimientoPolizaCivilHidrocarburos`,`id_placaTrailer`,`tablaAforo`,`vencimientoHidroestatica`,`vencimientoQuintaRueda`,`vencimientoKingPin`) values 
('12312',1006663257,'dasdasd','doble troque','2023-10-09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('asdasd123',1006663258,'11111111','carro','2023-10-09','2023-10-08','2023-10-09','2023-10-09','2023-10-09','2023-10-09','asdasd3123','321321zzz','2023-10-15','2023-10-15','2023-10-15'),
('asddddd',1006663258,'12qawsdas','sencillo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `informciontanque` */

DROP TABLE IF EXISTS `informciontanque`;

CREATE TABLE `informciontanque` (
  `id_placaTrailer` varchar(10) NOT NULL,
  `tablaAforo` varchar(255) NOT NULL,
  `vencimientoHidroestatica` date DEFAULT NULL,
  `vencimientoQuintaRueda` date DEFAULT NULL,
  `vencimientoKingPin` date DEFAULT NULL,
  PRIMARY KEY (`id_placaTrailer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

/*Data for the table `informciontanque` */

/*Table structure for table `inspeccion` */

DROP TABLE IF EXISTS `inspeccion`;

CREATE TABLE `inspeccion` (
  `id_inspeccion` int NOT NULL,
  `conductor_id` int DEFAULT NULL,
  `placa_id` varchar(20) DEFAULT NULL,
  `fecha` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_inspeccion`),
  KEY `placa_id` (`placa_id`),
  KEY `conductor_id` (`conductor_id`),
  CONSTRAINT `inspeccion_ibfk_4` FOREIGN KEY (`placa_id`) REFERENCES `informacionvehiculo` (`id_placa`),
  CONSTRAINT `inspeccion_ibfk_5` FOREIGN KEY (`conductor_id`) REFERENCES `informacionvehiculo` (`conductor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

/*Data for the table `inspeccion` */

insert  into `inspeccion`(`id_inspeccion`,`conductor_id`,`placa_id`,`fecha`) values 
(1,1006663258,'asdasd123','2023-10-15'),
(2,1006663258,'asddddd','2023-11-15'),
(3,1006663257,'12312','2023-11-19'),
(4,1006663257,'12312','2023-11-20');

/*Table structure for table `subespecificaciones` */

DROP TABLE IF EXISTS `subespecificaciones`;

CREATE TABLE `subespecificaciones` (
  `id_subEspecificaciones` int NOT NULL AUTO_INCREMENT,
  `detalle` varchar(255) NOT NULL,
  `especificacion_id` int DEFAULT NULL,
  PRIMARY KEY (`id_subEspecificaciones`),
  KEY `especificacion_id` (`especificacion_id`),
  CONSTRAINT `subespecificaciones_ibfk_1` FOREIGN KEY (`especificacion_id`) REFERENCES `especificaciones` (`id_especificaciones`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf16;

/*Data for the table `subespecificaciones` */

insert  into `subespecificaciones`(`id_subEspecificaciones`,`detalle`,`especificacion_id`) values 
(1,'NIVEL DE ACPM',1),
(2,'AGUA RADIADOR (SE-DT-TC)',1),
(3,'ACEITE MOTOR (SE-DT-TC)',1),
(4,'AGUA LIMPIABRISAS (SE-DT-TC)',1),
(5,'ACEITE HIDRAULICO (SE-DT-TC)',1),
(6,'REVISION DE LABRADO (DT-TC)',2),
(7,'INSP. PRESION LLANTAS DE AIRE (DT-TC)',2),
(8,'REVISION LLANTAS DE REPUESTO (DT-TC)',2),
(9,'FRENOS Y MANGUERAS (SE-DT-TC)',3),
(10,'CORREAS, VENTILADOR Y ALTERNADOR (SE-DT-TC)',3),
(11,'EMBRAGUE (SE-DT-TC)',3),
(12,'SISTEMA DIRECCION (SE-DT-TC)',3),
(13,'DRENADO DEL TANQUE  DE AIRE (SE-DT-TC)',3),
(14,'CALIBRACION DE RACHES DE LOS FRENOS (SE-DT-TC)',3),
(15,'QUINTA RUEDA (SEGURO) (TC)',3),
(16,'SUSPENCION AMORTIGUADORES (SE-DT-TC)',3),
(17,'FRONTALES (SE-DT-TC)',4),
(18,'TRASERAS (SE-DT-TC)',4),
(19,'LATERALES (SE-DT-TC)',4),
(20,'DIRECCIONALES (SE-DT-TC)',4),
(21,'REVERSA (SE-DT-TC)',4),
(22,'PARQUEO (SE-DT-TC)',4),
(23,'LUZ PLACA (SE-DT-TC)',4),
(24,'FRENO (SE-DT-TC)',4),
(25,'BATERIAS-BORNES-AGUA (DT-TC)',5),
(26,'INDICADORES DE TABLERO (DT-TC)',5),
(27,'CABLES ELECTRICOS (DT-TC)',5);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
