import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import inspeccionesRoutes from './routes/inspecciones.routes.js'
import conductoresRoutes from './routes/conductores.routes.js'
import informesRoutes from './routes/informes.routes.js'

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
        eq: function (a, b) { return a === b; }
    }
}))
app.set('views engine', '.hbs');

//MIDDLAWARES
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//ROUTES
app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.use(inspeccionesRoutes);
app.use(conductoresRoutes);
app.use(informesRoutes);

//PUBLIC FILES
app.use(express.static(join(__dirname, 'public')));

//RUN SERVER
app.listen(app.get('port'), () =>
    console.log('Server inicializado en el puerto: ', app.get('port')));
