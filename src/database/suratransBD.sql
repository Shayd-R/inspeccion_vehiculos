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
  `driversLicenseExpiration` date DEFAULT NULL COMMENT 'Fecha de vencimiento de la licencia',
  PRIMARY KEY (`idDriver`),
  KEY `licenseCategoryId` (`licenseCategoryId`),
  CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`licenseCategoryId`) REFERENCES `licensecategory` (`idLicenseCategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `drivers` */

insert  into `drivers`(`idDriver`,`name`,`cellPhoneNumber`,`licenseNumber`,`licenseCategoryId`,`driversLicenseExpiration`) values 
(1006663258,'shayd ruano','3107531564','1111222',1,'2023-11-05');

/*Table structure for table `firms` */

DROP TABLE IF EXISTS `firms`;

CREATE TABLE `firms` (
  `idFirms` int NOT NULL AUTO_INCREMENT COMMENT 'Id de la firma',
  `signature` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Firmas',
  PRIMARY KEY (`idFirms`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `firms` */

insert  into `firms`(`idFirms`,`signature`) values 
(33,'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXwAAAC0CAYAAACXK5enAAAAAXNSR0IArs4c6QAAEddJREFUeF7tnb/LLkcVx0/AwkIhnYIJUbBIYyGkUFBiKi0tUiRVFCwsTaeVCf4B+g8EYyFXMK1op4EUFilSWEQsYiCFRcAUFnaRb9zjHec+++yvmdkzO5+Fy33f59k5c+Zz5v3Oz519zLggAAEIQGAIAo8NUUoKCQEIQAAChuBTCSAAAQgMQgDBHyTQFBMCEIAAgk8dgAAEIDAIAQR/kEBTTAhAAAIIPnUAAhCAwCAEEPxBAk0xIQABCCD41AEIQAACgxBA8AcJNMWEAAQggOBTByAAAQgMQgDBHyTQFBMCEIAAgk8dgAAEIDAIAQR/kEBTTAhAAAIIPnUAAhCAwCAEEPxBAk0xIVCZwBfN7O+V88D8QQII/kGAJIfA4AS+Z2a/nBi8YmavDs4jdPER/NDhwTkIhCfwRzP71uTln83s6+E9HthBBH/g4FN0CBQgoN69evm6/mRmzxWwiYlKBBD8SmAxC4FBCDCl01GgEfyOgoWrEAhI4AUzezD59SUWbgNGKHEJwY8dH7yDQHQCaQ8fwQ8eLQQ/eIBwDwLBCfzUzLQ7Rxd6EjxYBCh4gHAPAsEJuOBrD756+FyBCSD4gYODaxDogIALPjt0OggWgt9BkHARAoEJ+LZMHroKHCR3DcHvIEi4CIHABD6efPu+mb0e2E9cY5GFOgABCBwgoPNz3pvSs0PnAMhWSenhtyJNPhC4HgEX/HfM7KvXK971SoTgXy+mlAgCrQj4gi3z962IH8wHwT8IkOQQGJgAC7adBR/B7yxguAuBQAQ0f69pHR2Ypm2ZXMEJIPjBA4R7EAhKwOfveeAqaIBuuYXgdxQsXIVAIAI6A19n4TN/HygoS64g+EuE+B4CELhFwBds2Y7ZUf1A8DsKFq5CIAgBpnOCBGKrGwj+VmLcDwEI+JHIPF3bWV1A8DsLGO5CIAAB7c7RYi2vMwwQjC0uIPhbaHEvBCDgvfsXzew34OiLAILfV7zwFgJnE9DOHM3hc/b92ZHYkT+CvwMaSSAwKAFfrGUrZqcVAMHvNHC4DYETCLAV8wToJbNE8EvSxBYErkvAe/e82arjGCP4HQcP1yHQkID37jk3pyH00lkh+KWJYg8C1ySgN1txbk7nsUXwOw8g7kOgAQHv3fOgVQPYNbNA8GvSxTYErkGA3v014mgI/kUCSTEgUIkAc/eVwJ5hFsE/gzp5QqAPAuzM6SNOq71E8Fej4kYIDEfAX2HIEcgXCT2Cf5FAUgwIFCbAC04KA41gDsGPEAV8gEAsAprK0Zk5ujgzJ1ZsDnmD4B/CR2IIXJKAn4jJVM7FwovgXyygFAcCBQhoGyYHpBUAGc0Egh8tIvgDgXMJcPzxufyr5o7gV8WLcQh0RUALtQ/MTC830SFpXBcjgOBfLKAUBwI7CfhC7etm9upOGyQLTgDBDx4g3INAIwI+laPTMHVIGtcFCSD4FwwqRYLARgK+556jjzeC6+12BL+3iOEvBMoTeG+as9dpmFwXJoDgXzi4FA0CKwhwfMIKSFe5BcG/SiQpBwS2E/AHrJjK2c6uyxQIfpdhw2kIFCGgB6x4R20RlH0YQfD7iBNeQqA0AXbllCbagT0Ev4Mg4SIEChPgpSaFgfZiDsHvJVL4CYEyBDj2uAzHLq0g+F2GDachsIuAP02rB6u0UMs1GAEEf7CAU9yhCWjeXj18jj0etBog+IMGnmIPR4B5++FC/miBEXwqAQSuT4B5++vHeFUJEfxVmLgJAl0T0H57nYLJ0Qldh/G48wj+cYZYgEBkAv5uWhZpI0epkW8IfiPQZAOBEwiwSHsC9MhZIviRo4NvENhPgHNy9rO7bEoE/7KhpWADE9B+ex15rDl7zd1zQeATAgh+XxVBf8j+76nE9b+a2beT7/SVHq7Rq+p4N2lfMS7hLfP2JShe0AaCHyuoLubPTg/IyDv/bI+nEn318hD9PfT6TKPz7VVnWKTtM35VvUbwq+JdNK4/TO2RVm9dc676vfT1Ci+lLo00rD2J/dNm9iLvpQ0bo1MdQ/Db45eovzQJvcS+9sXLLWoTjmHfH65i3j5GPEJ6geC3C4uEXo+3qyc/d31kZv82s3eTaZj3p5s1LfOEmX1qGgloVOAjgs+Y2TPTfekogd59u/iemZOLPQ9XnRmFDvJG8OsHaUnoJeT692bBuXblqfl7rjEI8OaqMeJ8uJQI/mGEswYkuppTvTVto553SYGvVwosRyfgD1cxdRc9UgH8Q/DLB2GuR/+Bmb1hZi+XzxKLgxJQh0JThIj9oBVga7ER/K3E7t+v3rxvi/M7NbWiuVXtieeCQCkC/iQt6zSliA5gB8EvF2Q/bxyhL8cUS7cJ+CKt1n7Yb08tWU0AwV+N6u6NvzWz55M7/BVyLJyW4YuVhwQQe2rDbgII/m50nyT0P77UCkPsY0xJfZ+AzsjROhGvKaSmbCaA4G9G9r8EPofqH2hR9ptsh9wPlJSLBHxHDg9XLaLihlsEEPx99SLv2fPAyz6OpFpPwNeIGEGuZ8adGQEEf1+V8J6WUv/LzD67zwypILCKgIs9i7SrcHHTHAEEf3vdyKdyGF5vZ0iK9QRYpF3PijsXCCD426uIL5opJVM52/mRYj0BF3t2fa1nxp13CCD426uHzi3x6zUz+8F2E6SAwCIBf2sVYr+IihvWEkDw15J6eN8/zezx6VftzHlyuwlSQGCRAGfkLCLihq0EEPytxP57domOT/CLhbTtDElxnwBiTw2pQgDB34c13aUjCxJ9Ld7yZO0+nqR6SIC99tSGagQQ/H1ofX41Tc0haftYkuohAT/9ks0A1IoqBBD8/Vg1taP90fl7aP9hZj+ZdvDst07K0Qh4J4IpwtEi37C8CP4x2P5+Wj39mF/q8etIZPXWuCBwjwBiT/1oQgDBL4P53msMJfya31fPjQsCOQHVHc3b69KBaFwQqEYAwS+Ldq7H7/P7v2Jhtyzwzq252HP6ZeeB7MV9BL9OpJaEn7df1eHem1U9tf1pM3uREWBvoevTXwS/btzmXmTOjp663HuwzvbLHqJ0MR8R/DYBndvRw8JuG/7RcnGxZ/tltMhc3B8Ev12AfZpH4p9v5UT428Xh7Jx8rz3bL8+OxID5I/jtg760lVO9PhZ328elRY6IfQvK5DFLAME/r3JI+HX87UvT/7knzPOfF5saOafHcfA+2hqEsblIAMFfRNTkBu/1qwHQv/zS8P93ZvY2uzmaxKN0Jt6zl93niGFpvNhbSwDBX0uq3X3e8392ylINgD7TqxQ/nD5TA6ARwJuIR7vA7MwJsd8JjmTlCSD45ZnWsOiir0bAf1Y+fjqn/tc/n/vn1M4aUdhuE7HfzowUFQkg+BXhVjStHr9PA/mIwLNzsdcoQCMA/c6xDhWDMWM6FXudtcTDdu1jQI4ZAQT/GlXCRf+paQSQrwP4CCBtBBgF1Iu9TlH1A/UQ+3qcsbyRAIK/EVgnt/sIQP/n00DpSICpoPIBRezLM8ViIQIIfiGQHZhJF4PTBiF3PR0NvD9NCflnHRTzVBc1svKTL3mw6tRQkPktAgj+2PUiFX49D6Dr1rbQfFSg3yVoahB0eYMw8jQRYj/231IXpUfwuwhTcyfzEYDWBvyze41CvmvIGwM1DGogZCO9p3nBKmWYHnNMz74SZMweJ4DgH2c4uoV0RJCeEeTPEUjgdU/a+9d5Qm+Y2V/MTD9rB4vu93vSqaS0kUhHGrW438rvXl7fMLOfJWXUg1Ujj3RqxQW7BQgg+AUgYmIXARdWbyTSEYSPKCScvvYwJ8R+T+pEKrhKl48u8sPrlNbvS+2kvuXrGJ7v18zsaTPTu4z1HMTnkofiPL3nr0bNG7M0z7TRTEdA/vnctlq/Ny0Pjc2u6jhGIgR/jDhfrZRzgn2vnBJNH2mkjcQRgdzzYFXa0Lkftxqt9L68vD56ykc8akx8pJSXNc9DjZPWbfS50qmRzddkPN+0Ecr9v1rdunR5EPxLh5fCVSSwR+wrurPZdNog3Fqoz6fn1ECoMfHP9VCfNzzeCOSNZ9qApI0HDcjmcJVJgOCX4YiVsQi8YGYPpiLrBfU60prr/wncGoXpjrSh8Wkt/Z9Od81Nfclm+l2eR9rgpNNd6Uiq1Oiuy3gj+F2GDadPJJBuv/yFmb18oi+jZp2u58w1LOmakDcoPn2Vbyjw0YtvMEi3HDtjX0dJG4/u+CP43YUMh08kwF77E+E3zjptSPLGwzcVvGZmX55GHZri8itd4D+yRlS8yAh+caQYvCgB/dG/l5SNc+0vGugNxZobaahjkC6e+zSWRgkaTZx2mCGCvyG63DosgbRnLwgciDZsVdhVcN9arJGB6o56/RJ9jRDe2mVxZyIEfyc4kg1DQH+sOh8n3VOv3j0XBPYS0MOGGgF8fnqGQw8eNln4R/D3hox0IxDIxV49M56kHSHybcqo+qXTVdUANBk1IvhtAksufRJI99qrBMzb9xnH6F77CFIvt696IfhV8WK8YwLM23ccvM5c12YA9fYl+FV39SD4ndUM3G1CIN+Roz/C6r2vJiUjk2gENJ2jkWSTESSCHy38+BOBAFM5EaIwhg+azvGjLarrcfUMxogZpbwQAaZyLhTMwEXRKFIdCxd77dLRMR1VLwS/Kl6Md0jg48RnpnI6DGBwlyXwEvr8SOsmu78Q/OC1A/eaEkhfQN5kTrVp6cjsLAISdx1Frfn6/OwfPYClnn3VxVovOIJ/VhUg32gE8oXaJvuio0HAn2IEJO56slY9+lvHT39gZr82sx8Xy3GFIQR/BSRuGYLA36aDsFRYpnKGCHmRQvrBan4C5w+nJ2jnjKtuab5eT9c2vxD85sjJMCCBdGuc3OOM+4BBCuKSeut+Lr//vMa1U4WeKZ01IeKeUQikW+M01H5ylIJTzlkCPteuuXf9rE7B0iVRf9zM3jWzP0w369jk007HzB2mh78UQr4fgUC6M4e5+xEi/mgZ0xMtby2u3qLivXZ9p9c5NjkA7Uh4EPwj9Eh7BQL5vnvOy7lCVOfLkM65+8+3FlVzC/5SE38bVnhxv4UAwb925aZ0ywTyrZj8TSwz6+GOdEpG/vp8+9wrEdMy+Xn1/krELsUdwe+hmuJjawLp/L16b5x13zoCx/PzLZCy5FMzS8Lu+95d3JU21Hz7cSyPWqA3U4MqNnsi8HMz+9Hk8EfTS8kv06PrKRCZrz7N4sKtPe0u6Ok7ZrVA+p3pu/ThpfS9svrae+upwHeMZ5/rCP4+bqS6FoHfm9lXzOwLiXCot+89viZPQXaC1N/jOteD9s/z7yXYWtj0F4CLaXrvXDrHonikIi5bvvvFfSJOC5UIwe/krww3mxDw6QA9RJNuw5OQvG1mzySPwOszfzl1LjQuQGmPNL3n3nSD7nvHzL47CVq+oJinvSVyqZjmP7tPS0DzdB+a2fNT+ZemS3Lbt3xIp1S8B67/JeT+e95LX/KZ7xF86gAEDhFwcXsieRLXDfo0g//u9+YiLBHLP7vXG00bExdoF808XdogpMKqdN6r9p9TQb0HRT1nb7Rk33vX3sClAn2rAaGnfajK1UtMD78eWyxDAAIQCEUAwQ8VDpyBAAQgUI8Agl+PLZYhAAEIhCKA4IcKB85AAAIQqEcAwa/HFssQgAAEQhFA8EOFA2cgAAEI1COA4Ndji2UIQAACoQgg+KHCgTMQgAAE6hFA8OuxxTIEIACBUAQQ/FDhwBkIQAAC9Qgg+PXYYhkCEIBAKAIIfqhw4AwEIACBegQQ/HpssQwBCEAgFAEEP1Q4cAYCEIBAPQIIfj22WIYABCAQigCCHyocOAMBCECgHgEEvx5bLEMAAhAIRQDBDxUOnIEABCBQjwCCX48tliEAAQiEIoDghwoHzkAAAhCoRwDBr8cWyxCAAARCEUDwQ4UDZyAAAQjUI4Dg12OLZQhAAAKhCCD4ocKBMxCAAATqEUDw67HFMgQgAIFQBBD8UOHAGQhAAAL1CCD49dhiGQIQgEAoAgh+qHDgDAQgAIF6BBD8emyxDAEIQCAUAQQ/VDhwBgIQgEA9Agh+PbZYhgAEIBCKAIIfKhw4AwEIQKAeAQS/HlssQwACEAhFAMEPFQ6cgQAEIFCPwH8A5v5604PYXa8AAAAASUVORK5CYII=');

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
(70,1,2),
(70,2,2),
(70,3,2),
(70,4,2),
(70,5,2);

/*Table structure for table `inspectiondata` */

DROP TABLE IF EXISTS `inspectiondata`;

CREATE TABLE `inspectiondata` (
  `idInspection` int NOT NULL AUTO_INCREMENT COMMENT 'Id de datos de inspeccion',
  `driverId` int DEFAULT NULL COMMENT 'Id foranea de los conductores(cedula)',
  `licensePlateId` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL COMMENT 'Id foranea de la placa de los vehiculos',
  `date` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Fecha de cuando se realiza la inspeccion',
  `firmsId` int DEFAULT NULL COMMENT 'Firma foranea',
  PRIMARY KEY (`idInspection`),
  KEY `placa_id` (`licensePlateId`),
  KEY `driverId` (`driverId`),
  KEY `firmsId` (`firmsId`),
  CONSTRAINT `inspectiondata_ibfk_1` FOREIGN KEY (`driverId`) REFERENCES `drivers` (`idDriver`),
  CONSTRAINT `inspectiondata_ibfk_2` FOREIGN KEY (`firmsId`) REFERENCES `firms` (`idFirms`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `inspectiondata` */

insert  into `inspectiondata`(`idInspection`,`driverId`,`licensePlateId`,`date`,`firmsId`) values 
(70,1006663258,'xxxxxx','2023-11-07',33);

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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `trafficLicenseNumber` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL COMMENT 'Numero de licencia de transito',
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

insert  into `vehicleinformation`(`idLicensePlate`,`driverId`,`trafficLicenseNumber`,`vehicleType`,`driversLicenseExpiration`,`technomechanicsReviewExpiry`,`soatExpiration`,`expiryLifeLine`,`expiryCivilLiabilityPolicy`,`expiryCivilHydrocarbonsPolicy`,`idTrailerPlate`,`capacityTable`,`hydrostaticExpiration`,`expiryFifthWheel`,`kingPinExpiry`) values 
('xxxxxx',1006663258,'asd321123','Tracto camión','2023-11-06','2023-11-06','2023-11-06','2023-11-06','2023-11-06','2023-11-06','asdjlñlkas','sfdfsdf','2023-11-23','2023-11-06','2023-11-06');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
