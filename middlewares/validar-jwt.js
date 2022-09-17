import { request, response } from 'express';
import jwt from 'jsonwebtoken';

import { Usuario } from '../models/usuario.js';


const validarJWT = async(req =request , res = response, next) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const uAuth = await Usuario.findById( uid );

        if( !uAuth ){
            return res.status(401).json({
                msg: 'Usuario no existe en DB'
            });
        }

        // Verificar si el uid tiene estado en true
        if( !uAuth.estado ){
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        req.uAuth = uAuth;

        next();
    } catch (err) {

        console.log(err);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

export{
    validarJWT
}