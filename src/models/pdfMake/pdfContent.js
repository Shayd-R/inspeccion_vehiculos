export const generateContent = (data, inspection, specification, breachedcriteria, sign) => {
    var formatoFechaMasActual;
    var mesAnio;

    if (inspection.length > 0) {
        let fechaMasActual = new Date(inspection[0].InspectionDate_Date);

        for (const insp of inspection) {
            const fechaInspeccion = new Date(insp.InspectionDate_Date);

            if (fechaInspeccion > fechaMasActual) {
                fechaMasActual = fechaInspeccion;
            }
        }

        mesAnio = `${fechaMasActual.getMonth() + 1}-${fechaMasActual.getFullYear()}`;
        formatoFechaMasActual = `${fechaMasActual.getDate()}-${fechaMasActual.getMonth() + 1}-${fechaMasActual.getFullYear()}`;
    }

    const tableBody = [];
    const inspectionByDate = {};

    for (const inspections of inspection) {
        const inspectionDate = inspections['InspectionDate_Date'];
        var fechaInspe = `${inspectionDate.getDate()}`;

        if (!inspectionByDate[fechaInspe]) {
            inspectionByDate[fechaInspe] = [];
        }
        inspectionByDate[fechaInspe].push(inspections);
    }
    const sortedDates = Array.from({ length: 31 }, (_, i) => String(i + 1));


    for (const spec of specification) {
        const rowHeader = [
            { fillColor: '#EEECE1', text: 'N°', style: ['subtitle', 'center'] },
            { fillColor: '#EEECE1', text: spec['InspectionSpecification_Name'], colSpan: 39, style: ['subtitle', 'center'] },
            ...Array.from({ length: 38 }, () => ({})), // Crear 37 columnas vacías
        ];
        tableBody.push(rowHeader);

        for (const inspe of inspection) {
            if (inspe['InspectionSubSpecification_IdSpecification'] == spec['InspectionSpecification_Id']) {
                const row = [
                    { text: inspe['InspectionSubSpecification_Id'], style: ['label', 'center'] },
                    { text: inspe['InspectionSubSpecification_Name'], colSpan: 8, style: 'label' },
                    ...Array.from({ length: 7 }, () => ({})), // Crear 7 columnas vacías

                    // Iterar sobre las fechas
                    ...sortedDates.map(date => {
                        const inspectionsForDate = inspectionByDate[date] || [];
                        const matchingInspection = inspectionsForDate.find(insp => insp['InspectionSubSpecification_Id'] === inspe['InspectionSubSpecification_Id']);

                        let conventionColor = {};
                        if (matchingInspection) {
                            if (matchingInspection['InspectionConvention_Name'] == 'Bueno') {
                                conventionColor = { fillColor: '#84b432', text: ' ', color: '#ffffff', alignment: 'right', border: [true, true, true, true] };
                            } else if (matchingInspection['InspectionConvention_Name'] == 'Malo') {
                                conventionColor = { fillColor: '#e30222', text: ' ', color: '#ffffff', alignment: 'right', border: [true, true, true, true] };
                            } else if (matchingInspection['InspectionConvention_Name'] == 'No aplica') {
                                conventionColor = { fillColor: '#ffb102', text: ' ', color: '#ffffff', alignment: 'right', border: [true, true, true, true] };
                            }
                        }
                        return conventionColor;
                    })
                ];
                tableBody.push(row);
            }
        }
    }



    const tableSign = [];
    const inspectionByDateSign = {};

    // Agrupar inspecciones por fecha
    for (const inspections of inspection) {
        const inspectionDate = inspections['InspectionDate_Date'];
        var fechaInspe = `${inspectionDate.getDate()}`;

        if (!inspectionByDateSign[fechaInspe]) {
            inspectionByDateSign[fechaInspe] = [];
        }
        inspectionByDateSign[fechaInspe].push(inspections);
    }
    const sortedDatesSign = Array.from({ length: 31 }, (_, i) => String(i + 1));

    const row = [
        { colSpan: 9, text: 'FIRMA CONDUCTOR', style: ['title', 'center', 'labelMiddletext'] },
        ...Array.from({ length: 8 }, () => ({})), // Crear 7 columnas vacías

        // Iterar sobre las fechas
        ...sortedDatesSign.map(date => {
            const inspectionsForDate = inspectionByDateSign[date] || [];
            const matchingInspection = inspectionsForDate.some(insp => {
                const inspectionDate = insp['InspectionDate_Date'];
                const fechaInspe = `${inspectionDate.getDate()}`;
                return fechaInspe === date; // Comparar la fecha de inspección con la fecha actual del map
            });

            if (matchingInspection) {
                return { image: sign, height: 90, style: ['center'] };
            } else {
                // Agregar una celda vacía si no hay datos en este día
                return {};
            }
        })
    ];
    tableSign.push(row);




    const tableTypeVehicle = [];
    switch (data.Vehicle_IdType) {
        case 1:
            tableTypeVehicle.push(
                [
                    { text: 'Tipo de vehiculo:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: 'Sencillo:', colSpan: 4, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 3 }, () => ({})),
                    { text: 'x', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Doble troque:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Tracto camion:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Contingencia:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Otro:', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                ],
            );
            break;
        case 2:
            tableTypeVehicle.push(
                [
                    { text: 'Tipo de vehiculo:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: 'Sencillo:', colSpan: 4, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 3 }, () => ({})),
                    { text: '', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Doble troque:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: 'x', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Tracto camion:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Contingencia:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Otro:', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                ],
            );
            break;
        case 3:
            tableTypeVehicle.push(
                [
                    { text: 'Tipo de vehiculo:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: 'Sencillo:', colSpan: 4, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 3 }, () => ({})),
                    { text: '', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Doble troque:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Tracto camion:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: 'x', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Contingencia:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Otro:', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                ],
            );
            break;
        case 4:
            tableTypeVehicle.push(
                [
                    { text: 'Tipo de vehiculo:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: 'Sencillo:', colSpan: 4, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 3 }, () => ({})),
                    { text: '', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Doble troque:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Tracto camion:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Contingencia:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: 'x', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Otro:', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                ],
            );
            break;
        case 5:
            tableTypeVehicle.push(
                [
                    { text: 'Tipo de vehiculo:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: 'Sencillo:', colSpan: 4, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 3 }, () => ({})),
                    { text: '', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Doble troque:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 2, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 1 }, () => ({})),
                    { text: 'Tracto camion:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Contingencia:', colSpan: 5, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 4 }, () => ({})),
                    { text: '', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'Otro:', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                    { text: 'x', colSpan: 3, style: ['labelheader', 'center'] },
                    ...Array.from({ length: 2 }, () => ({})),
                ],
            );
            break;
        default:
    }

    const tableCriteria = [];

    const headersRow = [
        { text: 'Nº Incumplimiento', colSpan: 5, style: ['labelheader', 'center'] },
        ...Array(4).fill({}),
        { text: 'Descripción', colSpan: 10, style: ['labelheader', 'center'] },
        ...Array(9).fill({}),
        { text: 'Acción de Cierre', colSpan: 10, style: ['labelheader', 'center'] },
        ...Array(9).fill({}),
        { text: 'Responsable', colSpan: 5, style: ['labelheader', 'center'] },
        ...Array(4).fill({}),
        { text: 'Fecha', colSpan: 5, style: ['labelheader', 'center'] },
        ...Array(4).fill({}),
        { text: 'Firma', colSpan: 5, style: ['labelheader', 'center'] },
        ...Array(4).fill({}),
    ];

    tableCriteria.push(headersRow);

    const dataRows = breachedcriteria.map((data, index) => [
        { text: index + 1, colSpan: 5, style: ['labelheader', 'center'] },
        ...Array(4).fill({}),
        { text: data.breachedCriteria_Description, colSpan: 10, style: ['labelheader', 'center'] },
        ...Array(9).fill({}),
        { text: data.breachedCriteria_ClosingAction, colSpan: 10, style: ['labelheader', 'center'] },
        ...Array(9).fill({}),
        { text: data.breachedCriteria_UserName, colSpan: 5, style: ['labelheader', 'center'] },
        ...Array(4).fill({}),
        { text: data.breachedCriteria_Date ? new Date(data.breachedCriteria_Date).toLocaleDateString() : '', colSpan: 5, style: ['labelheader', 'center'] },
        ...Array(4).fill({}),
        { text: data.breachedCriteria_UserName, colSpan: 5, style: ['labelheader', 'center'] },
        ...Array(4).fill({}),
    ]);

    tableCriteria.push(...dataRows);




    const content = [
        {
            table: {
                widths: Array.from({ length: 40 }, () => 10.5),
                body: [
                    [
                        { colSpan: 8, rowSpan: 3, image: 'src/public/img/logo/logo-number.png', width: 90, style: ['labelMiddle'] },
                        ...Array.from({ length: 7 }, () => ({})),
                        { text: 'SISTEMA INTEGRADO DE GESTION', colSpan: 24, style: ['header', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 23 }, () => ({})),
                        { text: 'codigo: \nCl-FO-01', colSpan: 8, style: ['header', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                    ],
                    [
                        ...Array.from({ length: 8 }, () => ({})),
                        { text: 'PROCESO DE CARGA LIQUIDA', colSpan: 24, style: ['header', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 23 }, () => ({})),
                        { text: 'Version:\n 03', colSpan: 8, style: ['header', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                    ],
                    [
                        ...Array.from({ length: 8 }, () => ({})),
                        { text: 'INSPECCION DIARIA PRE OPERACIONAL DE VEHICULO', colSpan: 24, style: ['header', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 23 }, () => ({})),
                        { text: 'Aplicacion: \n21/04/2022', colSpan: 8, style: ['header', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                    ],
                    [
                        { text: '1.INFORMACION DEL VEHICULO', colSpan: 20, style: ['title', 'center'] },
                        ...Array.from({ length: 19 }, () => ({})),
                        { text: 'MES-AÑO: ' + mesAnio, colSpan: 20, style: ['title', 'left'] },
                        ...Array.from({ length: 19 }, () => ({})),
                    ],
                    [
                        { text: 'Placa:', colSpan: 4, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 3 }, () => ({})),
                        { text: data.Vehicle_Plate, colSpan: 4, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 3 }, () => ({})),
                        { text: 'Conductor:', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 4 }, () => ({})),
                        { text: data.User_FirstName + ' ' + data.User_FirstLastName, colSpan: 7, style: ['labelheader', 'labelLeft'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: 'Telefono:', colSpan: 4, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 3 }, () => ({})),
                        { text: data.Driver_Phone, colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 4 }, () => ({})),
                        { text: 'N. licencia:', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 4 }, () => ({})),
                        { text: data.Driver_NumLicense, colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                    ],
                    ...tableTypeVehicle,
                    [
                        { text: 'VEN. LICENCIA DE CONDUCCION: ', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: data.Formatted_ExpirationDate, colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                        { text: 'VEN. REVISION TECNICO MECANICA: \n', colSpan: 9, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 8 }, () => ({})),
                        { text: data.Formatted_ExpiryMechanicalTechnicalReview, colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 4 }, () => ({})),
                        { text: 'VEN. SOAT:', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: data.Formatted_ExpirySoat, colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                    ],
                    [
                        { text: 'VEN. LINEA DE VIDA:', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: data.Formatted_ExpiryLifeline, colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                        { text: 'VEN. POLIZA DE RESPONSABILIDAD CIVIL:', colSpan: 9, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 8 }, () => ({})),
                        { text: data.Formatted_ExpiryCivilLiabilityPolicy, colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 4 }, () => ({})),
                        { text: 'VEN. POLIZA CIVIL HIDROCARBUROS:', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: data.Formatted_ExpiryCivilHydricarbidsPolicy, colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                    ],
                    [
                        { text: '2.INFORMACION DEL TANQUE', colSpan: 40, style: ['title', 'center'] },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    [
                        { text: 'PLACA TRAILER: \n'+data.tank_TrailerPlate+'\n', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: 'TABLA DE AFORO: \n'+data.tank_CapacityTable+'\n', colSpan: 8, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                        { text: 'VEN. HIDROESTATICA: \n'+data.Formatted_HydrostaticsExpiry+'\n', colSpan: 8, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                        { text: 'VEN. QUINTA RUEDA: \n'+data.Formatted_FifthWheelExpiry+'\n', colSpan: 8, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                        { text: 'VEN. KING PING: \n'+data.Formatted_KingPinExpiry+'\n', colSpan: 9, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 8 }, () => ({})),
                    ],
                    [
                        { text: ' ', fillColor: '#FFFF00', colSpan: 40 },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    [
                        { colSpan: 9, rowSpan: 2, text: 'ESPECIFICACIONES', style: ['title', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 8 }, () => ({})),
                        { text: 'DIAS', colSpan: 31, style: ['subtitle', 'center'] },
                        ...Array.from({ length: 30 }, () => ({})),
                    ],
                    [
                        ...Array.from({ length: 9 }, () => ({})),
                        { text: 1, style: ['label', 'center'] },
                        { text: 2, style: ['label', 'center'] },
                        { text: 3, style: ['label', 'center'] },
                        { text: 4, style: ['label', 'center'] },
                        { text: 5, style: ['label', 'center'] },
                        { text: 6, style: ['label', 'center'] },
                        { text: 7, style: ['label', 'center'] },
                        { text: 8, style: ['label', 'center'] },
                        { text: 9, style: ['label', 'center'] },
                        { text: 10, style: ['label', 'center'] },
                        { text: 11, style: ['label', 'center'] },
                        { text: 12, style: ['label', 'center'] },
                        { text: 13, style: ['label', 'center'] },
                        { text: 14, style: ['label', 'center'] },
                        { text: 15, style: ['label', 'center'] },
                        { text: 16, style: ['label', 'center'] },
                        { text: 17, style: ['label', 'center'] },
                        { text: 18, style: ['label', 'center'] },
                        { text: 19, style: ['label', 'center'] },
                        { text: 20, style: ['label', 'center'] },
                        { text: 21, style: ['label', 'center'] },
                        { text: 22, style: ['label', 'center'] },
                        { text: 23, style: ['label', 'center'] },
                        { text: 24, style: ['label', 'center'] },
                        { text: 25, style: ['label', 'center'] },
                        { text: 26, style: ['label', 'center'] },
                        { text: 27, style: ['label', 'center'] },
                        { text: 28, style: ['label', 'center'] },
                        { text: 29, style: ['label', 'center'] },
                        { text: 30, style: ['label', 'center'] },
                        { text: 31, style: ['label', 'center'] },
                    ],
                    [
                        { text: 'Convenciones :  SE= Sencillo   DT= Doble Troque  TC= Tracto Camion   CT= Contingencia ', colSpan: 28, style: ['label', 'center'] },
                        ...Array.from({ length: 27 }, () => ({})),
                        { text: 'Bueno=', colSpan: 3, style: ['label', 'center'] },
                        ...Array.from({ length: 2 }, () => ({})),
                        { fillColor: '#84b432', text: '         ' },
                        { text: 'Malo=', colSpan: 3, style: ['label', 'center'] },
                        ...Array.from({ length: 2 }, () => ({})),
                        { fillColor: '#e30222', text: '         ' }, // Cuadro de color rojo para =Malo
                        { text: 'No aplica=', colSpan: 3, style: ['label', 'center'] },
                        ...Array.from({ length: 2 }, () => ({})),
                        { fillColor: '#ffb102', text: '         ' }, // Cuadro de color amarillo para =No Aplica 
                    ],
                    [
                        { text: ' ', fillColor: '#FFFF00', colSpan: 40},
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    ...tableBody,
                ],
            },
            layout: {
                paddingLeft: function (i, node) {
                    return 1;
                },
                paddingRight: function (i, node) {
                    return 0;
                },
                paddingTop: function (i, node) {
                    return 2;
                },
                paddingBottom: function (i, node) {
                    return 0;
                }
            },
        },
        { text: ' ', pageBreak: 'after' },
        {
            table: {
                widths: Array.from({ length: 40 }, () => 10.5),
                body: [
                    [
                        { text: ' ', fillColor: '#FFFF00', colSpan: 40 },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    ...tableSign,

                    [
                        { colSpan: 9, text: ' \nFIRMA AUTORIZACION \n\n', style: ['title', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 8 }, () => ({})),
                        { colSpan: 31, text: ' ', style: ['labelheader', 'center'] },
                        ...Array.from({ length: 30 }, () => ({})),
                    ],
                    [
                        { text: ' ', fillColor: '#FFFF00', colSpan: 40},
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    [
                        { text: 'Los criterios con incumplimiento se deben cerrar mediante un plan de acción para continuar en la operación', fillColor: '#EEECE1', colSpan: 40, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    ...tableCriteria,
                    [
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                    ],
                    [
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                    ],
                    [
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                        { text: ' ', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array(4).fill({}),
                    ],
                    [
                        { text: 'Registro del Kilometraje actual a fin de mes:', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: 'Fecha de entrega de planilla:', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: 'Firma del conductor: \n\n', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: 'Firma de quien aprueba: \nCoordinador de Operaciones', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                    ],
                    [
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { image: data.ImagesSign_Data, width: 90, colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                    ],
                    [
                        { text: '*Nota: La Inspección diaria pre operacional de vehículo: CL.FO-01, debe ser reportadata por el conductor al Coordinador de Operaciones, durante máximo los primeros cinco (5) días hábiles del seguimiente mes, como requisito para ser programado a operación.', fillColor: '#EEECE1', colSpan: 40, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 39 }, () => ({})),
                    ]

                ],
            },
            layout: {
                paddingLeft: function (i, node) {
                    return 1;
                },
                paddingRight: function (i, node) {
                    return 0;
                },
                paddingTop: function (i, node) {
                    return 2;
                },
                paddingBottom: function (i, node) {
                    return 0;
                }
            }

        },

    ];

    return content;
};
