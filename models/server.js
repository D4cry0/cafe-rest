import express from 'express';
import cors from 'cors';

import { router as routerUser } from '../routes/user.routes.js';
import { router as routerAuth } from '../routes/auth.routes.js';
import { dbConnection } from '../db/config.js';

export class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        // Conectar a DB
        this.conectarDB();

        // Middlewares (subfunciones para el web server)
        this.middlewares();

        // Rutas de la app
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {

        //  CORS
        this.app.use(cors());

        // Parsing y Lectura Body
        this.app.use( express.json() );

        // DIrectorio Public
        this.app.use( express.static('public') );

    }

    routes() {
        this.app.use( this.usuariosPath, routerUser );
        this.app.use( this.authPath, routerAuth );
    }


    listen() {
        this.app.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto', this.port );
        });
    }
}