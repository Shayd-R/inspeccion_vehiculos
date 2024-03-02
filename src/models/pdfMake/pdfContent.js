export const generateContent = (data, inspection, specification, breachedcriteria) => {

    var formatoFechaMasActual;
    var mesAnio;

    if (inspection.length > 0) {
        let fechaMasActual = new Date(inspection[0].InspectionDate_Date);
        // console.log(fechaMasActual);
        // Recorrer el array para encontrar la fecha más actual
        for (const insp of inspection) {
            const fechaInspeccion = new Date(insp.InspectionDate_Date);

            // Comparar fechas
            if (fechaInspeccion > fechaMasActual) {
                fechaMasActual = fechaInspeccion;
            }
        }

        // Obtener mes y año de la fecha más actual
        mesAnio = `${fechaMasActual.getMonth() + 1}-${fechaMasActual.getFullYear()}`;

        // Formatear la fecha más actual
        formatoFechaMasActual = `${fechaMasActual.getDate()}-${fechaMasActual.getMonth() + 1}-${fechaMasActual.getFullYear()}`;

    }

    const tableBody = [];
    const inspectionByDate = {};

    // Agrupar inspecciones por fecha
    for (const inspections of inspection) {
        const inspectionDate = inspections['InspectionDate_Date'];
        var fechaInspe = `${inspectionDate.getDate()}`;

        if (!inspectionByDate[fechaInspe]) {
            inspectionByDate[fechaInspe] = [];
        }
        inspectionByDate[fechaInspe].push(inspections);
        // console.log(inspectionByDate);
    }

    // Ordenar fechas de forma ascendente
    const sortedDates = Array.from({ length: 31 }, (_, i) => String(i + 1));

    // Encabezado de la tabla
    // const tableHeader = [
    //     { text: 'N°', style: 'label' },
    //     { text: 'Especificaciones', colSpan: 8, style: 'label' },
    //     ...Array.from({ length: 7 }, () => ({})),
    //     ...sortedDates.map(date => ({ text: date, style: 'label' }))
    // ];
    // tableBody.push(tableHeader);

    // Iterar sobre las especificaciones y construir filas
    for (const [index, specifications] of specification.entries()) {
        const row = [
            { text: specifications['InspectionSubSpecification_Id'], style: ['label', 'center'] },
            // ...Array.from({ length: 1 }, () => ({})),
            { text: specifications['InspectionSubSpecification_Name'], colSpan: 8, style: 'label' },
            ...Array.from({ length: 7 }, () => ({})),
        ];

        // Agregar datos para cada fecha
        for (const date of sortedDates) {
            const inspectionsForDate = inspectionByDate[date] || [];
            const matchingInspection = inspectionsForDate.find(inspections => inspections['InspectionSubSpecification_Id'] === specifications['InspectionSubSpecification_Id']);

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

            row.push(conventionColor);
        }

        tableBody.push(row);
    }

    const tableTypeVehicle = [];
    switch (data.Vehicle_IdType) {
        case 1:
            tableTypeVehicle.push(
                [
                    { text: 'TIPO DE VEHÍCULO:', colSpan: 5, style: ['labelheader', 'center'] },
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
                    { text: 'TIPO DE VEHÍCULO:', colSpan: 5, style: ['labelheader', 'center'] },
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
                    { text: 'TIPO DE VEHÍCULO:', colSpan: 5, style: ['labelheader', 'center'] },
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
                    { text: 'TIPO DE VEHÍCULO:', colSpan: 5, style: ['labelheader', 'center'] },
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
                    { text: 'TIPO DE VEHÍCULO:', colSpan: 5, style: ['labelheader', 'center'] },
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
                widths: Array.from({ length: 40 }, () => 'auto'),
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
                        { text: 'VEN. LICENCIA DE CONDUCCION:', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: data.ExpirationDate, colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                        { text: 'VEN. REVISION TECNICO MECANICA:', colSpan: 9, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 8 }, () => ({})),
                        { text: '', colSpan: 5, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 4 }, () => ({})),
                        { text: 'VEN. SOAT:', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: '', colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                    ],
                    [
                        { text: 'VEN. LINEA DE VIDA:', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: '', colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                        { text: 'VEN. POLIZA DE RESPONSABILIDAD CIVIL:', colSpan: 9, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 8 }, () => ({})),
                        { text: '', colSpan: 5, style: ['label', 'labelLeft'] },
                        ...Array.from({ length: 4 }, () => ({})),
                        { text: 'VEN. POLIZA CIVIL HIDROCARBUROS:', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: '', colSpan: 6, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 5 }, () => ({})),
                    ],
                    [
                        { text: '2.INFORMACION DEL TANQUE', colSpan: 40, style: ['title', 'center'] },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    [
                        { text: 'PLACA TRAILER: \n\n\n', colSpan: 7, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 6 }, () => ({})),
                        { text: 'TABLA DE AFORO:', colSpan: 8, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                        { text: 'VEN. HIDROESTATICA:', colSpan: 8, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                        { text: 'VEN. QUINTA RUEDA', colSpan: 8, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 7 }, () => ({})),
                        { text: 'VEN. KING PING:', colSpan: 9, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 8 }, () => ({})),
                    ],
                    [
                        { text: ' ', fillColor: '#FFFF00', colSpan: 40, style: ['labelheader', 'center'] },
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
                        { text: ' ', fillColor: '#FFFF00', colSpan: 40, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    ...tableBody,
                    [
                        { text: ' ', fillColor: '#FFFF00', colSpan: 40, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    [
                        { colSpan: 10, text: ' \nFIRMA CONDUCTOR \n\n', style: ['title', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 9 }, () => ({})),
                        { colSpan: 30, text: '', style: ['title', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 29 }, () => ({})),
                    ],
                    [
                        { colSpan: 10, text: ' \nFIRMA AUTORIZACION \n\n', style: ['title', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 9 }, () => ({})),
                        { colSpan: 30, text: '', style: ['title', 'center', 'labelMiddle'] },
                        ...Array.from({ length: 29 }, () => ({})),
                    ],
                    [
                        { text: ' ', fillColor: '#FFFF00', colSpan: 40, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    [
                        { text: 'Los criterios con incumplimiento se deben cerrar mediante un plan de acción para continuar en la operación', fillColor: '#EEECE1', colSpan: 40, style: ['labelheader', 'center'] },
                        ...Array.from({ length: 39 }, () => ({})),
                    ],
                    ...tableCriteria,
                    [
                        { text: 'Registro del Kilometraje actual a fin de mes:', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: 'Fecha de entrega de planilla:', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: 'Firma del conductor: \n\n'+data.User_FirstName + ' ' + data.User_FirstLastName + '\n\n', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: 'Firma de quien aprueba:', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                    ],
                    [
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: ' ', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: 'conductor', colSpan: 10, style: ['labelheader', 'center'] },
                        ...Array(9).fill({}),
                        { text: 'Coordinador de Operaciones', colSpan: 10, style: ['labelheader', 'center'] },
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
