import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import inspeccionesRoutes from './routes/inspecciones.routes.js'
import conductoresRoutes from './routes/conductores.routes.js'
import informesRoutes from './routes/informes.routes.js'
// Alerts
// Flash messages
import flash from 'connect-flash'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import toastr from 'express-toastr'
import {  body, validationResult, check } from 'express-validator'


//INICIALIZATION
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//SETTINGS
app.set('port', process.env.PORT || 4000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        eq: function (a, b) { return a === b; },
        // isEqual: function (a, b, options) {return a === b ? options.fn(this) : options.inverse(this)},
        or: function (a, b, c) { return a || b || c ; },
        // isSelected: (value, selectedValues) => Array.isArray(selectedValues) && selectedValues.includes(value),
    }
}))
app.set('views engine', '.hbs');
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: true,
    // store: new MySQLSession(database)
}));

//MIDDLAWARES
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(toastr());
app.use(function (req, res, next) {
    req.validationResult = validationResult;
    req.check = check;
    res.locals.toastr = req.toastr.render();
    next();
});




//ROUTES
app.get('/', (req, res) => {
    const index = true;
    res.render('index.hbs', { index: index });
});

app.use(inspeccionesRoutes);
app.use(conductoresRoutes);
app.use(informesRoutes);

//PUBLIC FILES
app.use(express.static(join(__dirname, 'public')));

//RUN SERVER
app.listen(app.get('port'), () =>
    console.log('Server inicializado en el puerto: ', app.get('port')));
