
USE `suratrans`;

/*Table structure for table `conductores` */

DROP TABLE IF EXISTS `conductores`;

CREATE TABLE `conductores` (
  `id_conductor` INT NOT NULL,
  `nombre` VARCHAR(255) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `telefono` VARCHAR(15) DEFAULT NULL,
  PRIMARY KEY (`id_conductor`)
) ENGINE=INNODB DEFAULT CHARSET=utf16;

/*Data for the table `conductores` */

INSERT  INTO `conductores`(`id_conductor`,`nombre`,`telefono`) VALUES 
(1006663257,'shayd ruano','3107531564'),
(1006663258,'shayd augusto ruano','3107531564');

/*Table structure for table `convenciones` */

DROP TABLE IF EXISTS `convenciones`;

CREATE TABLE `convenciones` (
  `id_convenciones` INT NOT NULL,
  `detalle` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_convenciones`)
) ENGINE=INNODB DEFAULT CHARSET=utf16;

/*Data for the table `convenciones` */

INSERT  INTO `convenciones`(`id_convenciones`,`detalle`) VALUES 
(1,'Bueno'),
(2,'Malo'),
(3,'No_aplica');

/*Table structure for table `especificaciones` */

DROP TABLE IF EXISTS `especificaciones`;

CREATE TABLE `especificaciones` (
  `id_especificaciones` INT NOT NULL,
  `detalle` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_especificaciones`)
) ENGINE=INNODB DEFAULT CHARSET=utf16;

/*Data for the table `especificaciones` */

INSERT  INTO `especificaciones`(`id_especificaciones`,`detalle`) VALUES 
(1,'NIVELES'),
(2,'LLANTAS'),
(3,'SISTEMA MECANICO Y AMARRES'),
(4,'LUCES'),
(5,'ELECTRICO');

/*Table structure for table `estado` */

DROP TABLE IF EXISTS `estado`;

CREATE TABLE `estado` (
  `inspeccion_id` INT DEFAULT NULL,
  `subespecificaciones_id` INT DEFAULT NULL,
  `convenciones` INT DEFAULT NULL,
  KEY `convenciones` (`convenciones`),
  KEY `inspeccion_id` (`inspeccion_id`),
  KEY `subespecificaciones_id` (`subespecificaciones_id`),
  CONSTRAINT `estado_ibfk_3` FOREIGN KEY (`convenciones`) REFERENCES `convenciones` (`id_convenciones`),
  CONSTRAINT `estado_ibfk_5` FOREIGN KEY (`inspeccion_id`) REFERENCES `inspeccion` (`id_inspeccion`)
) ENGINE=INNODB DEFAULT CHARSET=utf16;

/*Data for the table `estado` */

/*Table structure for table `informacionvehiculo` */

DROP TABLE IF EXISTS `informacionvehiculo`;

CREATE TABLE `informacionvehiculo` (
  `id_placa` VARCHAR(20) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `conductor_id` INT DEFAULT NULL,
  `numeroLicenciaTransito` VARCHAR(20) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `tipoVehiculo` VARCHAR(20) DEFAULT NULL,
  `vencimientoLicenciaConduccion` VARCHAR(20) DEFAULT NULL,
  `vencimientoRevisionTecnicoMecanica` VARCHAR(20) DEFAULT NULL,
  `vencimientoSoat` VARCHAR(20) DEFAULT NULL,
  `vencimientoLineaVida` VARCHAR(20) DEFAULT NULL,
  `vencimientoPolizaResponsabilidadCivil` VARCHAR(20) DEFAULT NULL,
  `vencimientoPolizaCivilHidrocarburos` VARCHAR(20) DEFAULT NULL,
  `id_placaTrailer` VARCHAR(20) DEFAULT NULL,
  `tablaAforo` VARCHAR(20) DEFAULT NULL,
  `vencimientoHidroestatica` VARCHAR(20) DEFAULT NULL,
  `vencimientoQuintaRueda` VARCHAR(20) DEFAULT NULL,
  `vencimientoKingPin` VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (`id_placa`),
  KEY `tipoVehiculo_id` (`tipoVehiculo`),
  KEY `conductor_id` (`conductor_id`),
  CONSTRAINT `informacionvehiculo_ibfk_1` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id_conductor`)
) ENGINE=INNODB DEFAULT CHARSET=utf16;

/*Data for the table `informacionvehiculo` */

INSERT  INTO `informacionvehiculo`(`id_placa`,`conductor_id`,`numeroLicenciaTransito`,`tipoVehiculo`,`vencimientoLicenciaConduccion`,`vencimientoRevisionTecnicoMecanica`,`vencimientoSoat`,`vencimientoLineaVida`,`vencimientoPolizaResponsabilidadCivil`,`vencimientoPolizaCivilHidrocarburos`,`id_placaTrailer`,`tablaAforo`,`vencimientoHidroestatica`,`vencimientoQuintaRueda`,`vencimientoKingPin`) VALUES 
('1111',1006663258,'11111asd','Tracto_Camion','2023-10-25','2023-10-25','2023-10-25','2023-10-25','2023-10-25','2023-10-25','32mmm','321mma','2023-10-25','2023-10-25','2023-10-25'),
('12312',1006663257,'dasdasd','Doble_Troque','2023-10-09','2023-10-19','2023-10-19','2023-10-19','2023-10-19','2023-10-19','hlkjahfkjs','132a1sd5','2023-10-19','2023-10-19','2023-10-19'),
('asdasd123',1006663258,'11111111','Doble_Troque','2023-10-09','2023-10-08','2023-10-09','2023-10-09','2023-10-09','2023-10-09','asdasd3123','321321zzz','2023-10-15','2023-10-15','2023-10-15');

/*Table structure for table `informciontanque` */

DROP TABLE IF EXISTS `informciontanque`;

CREATE TABLE `informciontanque` (
  `id_placaTrailer` VARCHAR(10) NOT NULL,
  `tablaAforo` VARCHAR(255) NOT NULL,
  `vencimientoHidroestatica` DATE DEFAULT NULL,
  `vencimientoQuintaRueda` DATE DEFAULT NULL,
  `vencimientoKingPin` DATE DEFAULT NULL,
  PRIMARY KEY (`id_placaTrailer`)
) ENGINE=INNODB DEFAULT CHARSET=utf16;

/*Data for the table `informciontanque` */

/*Table structure for table `inspeccion` */

DROP TABLE IF EXISTS `inspeccion`;

CREATE TABLE `inspeccion` (
  `id_inspeccion` INT NOT NULL AUTO_INCREMENT,
  `conductor_id` INT DEFAULT NULL,
  `placa_id` VARCHAR(20) DEFAULT NULL,
  `fecha` VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (`id_inspeccion`),
  KEY `placa_id` (`placa_id`),
  KEY `conductor_id` (`conductor_id`),
  CONSTRAINT `inspeccion_ibfk_4` FOREIGN KEY (`placa_id`) REFERENCES `informacionvehiculo` (`id_placa`)
) ENGINE=INNODB AUTO_INCREMENT=43 DEFAULT CHARSET=utf16;

/*Data for the table `inspeccion` */

INSERT  INTO `inspeccion`(`id_inspeccion`,`conductor_id`,`placa_id`,`fecha`) VALUES 
(1,1006663258,'asdasd123','2023-10-15'),
(9,1006663257,'12312','2023-10-18'),
(42,1006663258,'1111','2023-10-27');

/*Table structure for table `subespecificaciones` */

DROP TABLE IF EXISTS `subespecificaciones`;

CREATE TABLE `subespecificaciones` (
  `id_subEspecificaciones` INT NOT NULL AUTO_INCREMENT,
  `detalle` VARCHAR(255) NOT NULL,
  `especificacion_id` INT DEFAULT NULL,
  PRIMARY KEY (`id_subEspecificaciones`),
  KEY `especificacion_id` (`especificacion_id`),
  CONSTRAINT `subespecificaciones_ibfk_1` FOREIGN KEY (`especificacion_id`) REFERENCES `especificaciones` (`id_especificaciones`)
) ENGINE=INNODB AUTO_INCREMENT=28 DEFAULT CHARSET=utf16;

/*Data for the table `subespecificaciones` */

INSERT  INTO `subespecificaciones`(`id_subEspecificaciones`,`detalle`,`especificacion_id`) VALUES 
(1,'NIVEL DE ACPM',1),
(2,'AGUA RADIADOR (SE-DT-TC)',1),
(3,'ACEITE MOTOR (SE-DT-TC)',1),
(4,'AGUA LIMPIABRISAS (SE-DT-TC)',1),
(5,'ACEITE HIDRAULICO (SE-DT-TC)',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
