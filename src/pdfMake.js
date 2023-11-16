import PdfPrinter from 'pdfmake'
import fs from 'fs'

const fonts = require('./models/pdfMake/fonts.js');
const styles = require('./models/pdfMake/styles.js');
const {content} = require('./models/pdfMake/pdfContent.js');

const content = pdfContent.generateContent(title, body);

let docDefinition = {
    content: content,
    styles: styles
};

const printer = new PdfPrinter(fonts);

let pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('./models/pdfMake/pdfs/shayd.pdf'));
pdfDoc.end();

