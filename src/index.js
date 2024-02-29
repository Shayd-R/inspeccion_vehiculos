import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pool from './database.js'




import inspeccionesRoutes from './routes/inspecciones.routes.js'
import conductoresRoutes from './routes/conductores.routes.js'
import informesRoutes from './routes/informes.routes.js'
// Alerts
// Flash messages
import flash from 'connect-flash'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import toastr from 'express-toastr'
import { body, validationResult, check } from 'express-validator'
import dotenv from "dotenv";
dotenv.config();
//INICIALIZATION
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//SETTINGS
app.set('port', process.env.PORT);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        eq: function (a, b) { return a === b; },
        // isEqual: function (a, b, options) {return a === b ? options.fn(this) : options.inverse(this)},
        or: function (a, b, c) { return a || b || c; },
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
app.get('/', async (req, res) => {
    if ((req.session.user && req.session.tocken) == undefined || "") {
        const code = req.query.code;
        const tocken = req.query.tocken;
        if ((code && tocken) == undefined) {
            const error = true;
            res.render('error/error.hbs', { error: error });
        } else {
            req.session.user = code;
            req.session.tocken = tocken;
            const [user] = await pool.query('SELECT * FROM evasys_users WHERE User_UserName = ? AND User_Password =  ?', [code, tocken]);
            if (user[0].User_IdRole == 1) {
                const index = true;
                res.render('index.hbs', { index: index });
            } else if (user[0].User_IdRole == 3) {
                const [user_valid] = await pool.query('SELECT * FROM evasys_users WHERE User_UserName = ?', user[0].User_UserName);
                const [inspection] = await pool.query('SELECT * FROM evasys_inspection WHERE Inspection_IdUser = ? AND Inspection_IdStatus = 1', user_valid[0].User_Id);
                req.session.inspectionDriver = inspection[0].Inspection_Id;
                res.redirect(`/inspectVehiculo/${inspection[0].Inspection_Id}`);
            }


        }
    } else {
        const [user] = await pool.query('SELECT * FROM evasys_users WHERE User_UserName = ? AND User_Password =  ?', [req.session.user, req.session.tocken]);
        if (user[0].User_IdRole == 1) {
            const index = true;
            res.render('index.hbs', { index: index });
        } else if (user[0].User_IdRole == 3) {
            const [user_valid] = await pool.query('SELECT * FROM evasys_users WHERE User_UserName = ?', user[0].User_UserName);
            const [inspection] = await pool.query('SELECT * FROM evasys_inspection WHERE Inspection_IdUser = ? AND Inspection_IdStatus = 1', user_valid[0].User_Id);
            res.redirect(`/inspectVehiculo/${inspection[0].Inspection_Id}`);
        }
    }

});

app.use(inspeccionesRoutes);
app.use(conductoresRoutes);
app.use(informesRoutes);

//PUBLIC FILES
app.use(express.static(join(__dirname, 'public')));

//RUN SERVER
app.listen(app.get('port'), () =>
    console.log('Server inicializado en el puerto: ', app.get('port')));
