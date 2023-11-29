export const generateContent = (data, inspection, specification) => {
    const tableBody = [];
    for (const [index, specifications] of specification.entries()) {
        tableBody.push([{ fillColor: '#e2e3e5', text: specifications['idSpecifications'] + ". " + specifications['specification'] },
        { fillColor: '#e2e3e5', text: " " },
        { fillColor: '#e2e3e5', text: " " }
        ]);

        for (const inspections of inspection) {
            if (specifications['idSpecifications'] === inspections['specificationId']) {
                var conventionColor = '';
                if (inspections['convention'] == 'Bueno') {
                    conventionColor = { fillColor: '#84b432', text: inspections['convention'], style: ['labelWhite', 'labelRight'], border: [true, true, true, true] };
                } if (inspections['convention'] == 'Malo') {
                    conventionColor = { fillColor: '#e30222', text: inspections['convention'], style: ['labelWhite', 'labelRight'], border: [true, true, true, true] };
                } if (inspections['convention'] == 'No aplica') {
                    conventionColor = { fillColor: '#ffb102', text: inspections['convention'], style: ['labelWhite', 'labelRight'], border: [true, true, true, true] };
                }
                tableBody.push([
                    inspections['subSpecification'],
                    ' ',
                    conventionColor
                ]);
            }
        }
    }

    const content = [

        {
            alignment: 'center',
            columns: [
                {
                    image: 'src/public/img/logo/logo.svg',
                    width: 110
                },
                { text: "LISTA DE INSPECCIÓN DE VEHÍCULO", style: ['header', 'labelRight'] },
            ]
        },

        '\n',
        { text: "DATOS DE INSPECCIÓN", style: ['labelHeader', 'labelLeft'] },
        '\n',
        {
            style: 'label',
            table: {
                widths: ["auto", '*', 'auto'],
                body: [
                    ["Fecha de aplicación", "", { text: data.date, style: ['label', 'labelRight'] }],
                    ["N° de inspección", "", { text: data.idInspection, style: ['label', 'labelRight'] }],
                    ["Placa", "", { text: data.licensePlateId, style: ['label', 'labelRight'] }],
                    ["Cédula", "", { text: data.idDriver, style: ['label', 'labelRight'] }],
                    ["Conductor", "", { text: data.name, style: ['label', 'labelRight'] }],
                    ["Celular", "", { text: data.cellPhoneNumber, style: ['label', 'labelRight'] }],
                    ["Categoria de licencia", "", { text: data.category, style: ['label', 'labelRight'] }],
                    ["N° de licencia de transito", "", { text: data.licenseNumber, style: ['label', 'labelRight'] }],
                    ["Tipo de vehiculo", "", { text: data.vehicleType, style: ['label', 'labelRight'] }],
                    ["Vencimiento licencia de conducción", "", { text: data.driversLicenseExpiration, style: ['label', 'labelRight'] }],
                    ["Vencimiento revisión tecnico mecanica", "", { text: data.technomechanicsReviewExpiry, style: ['label', 'labelRight'] }],
                    ["Vencimiento SOAT", "", { text: data.soatExpiration, style: ['label', 'labelRight'] }],
                    ["Vencimiento linea de vida", "", { text: data.expiryLifeLine, style: ['label', 'labelRight'] }],
                    ["Vencimiento poliza de responsabilidad civil", "", { text: data.expiryCivilLiabilityPolicy, style: ['label', 'labelRight'] }],
                    ["Vencimiento poliza civil hidrocarburos", "", { text: data.expiryCivilHydrocarbonsPolicy, style: ['label', 'labelRight'] }],
                    ["Placa trailer", "", { text: data.idTrailerPlate, style: ['label', 'labelRight'] }],
                    ["Tabla de aforo", "", { text: data.capacityTable, style: ['label', 'labelRight'] }],
                    ["Vencimiento hidroestatica", "", { text: data.hydrostaticExpiration, style: ['label', 'labelRight'] }],
                    ["Vencimiento quinta rueda", "", { text: data.expiryFifthWheel, style: ['label', 'labelRight'] }],
                    ["Vencimiento king pin", "", { text: data.kingPinExpiry, style: ['label', 'labelRight'] }],
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0) ? 0 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0;
                },
                hLineColor: function (i, node) {
                    return '#e2e3e5';
                },
                paddingLeft: function (i, node) {
                    return 0;
                },
                paddingRight: function (i, node) {
                    return 0;
                },
            },

        },

        { text: 'INSPECCIÓN', style: ['labelHeader', 'labelLeft'], pageBreak: 'before' },
        '\n',
        {
            style: 'label',
            table: {
                widths: ['auto', '*', 100],
                body: [...tableBody],
            },
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0) ? 0 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0;
                },
                hLineColor: function (i, node) {
                    return '#e2e3e5';
                },
                paddingLeft: function (i, node) {
                    return 0;
                },
                paddingRight: function (i, node) {
                    return 0;
                },
            },
        },
        "\n",
        { text: 'FINALIZACIÓN', style: ['labelHeader', 'labelLeft'] },
        { text: '\nNombre completo y firma del conductor', style: ['label', 'labelLeft'] },
        "\n",
        {
            alignment: 'left',
            columns: [
                { image: data.signature, width: 110, style: ['label','labelLeft'] },
                { text: data.name+"\n"+data.date, style: ['label', 'labelLeft'] }
            ]
        }
    ];

    return content;
};
