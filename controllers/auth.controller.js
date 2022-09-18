import { json, response } from "express";
import bcryptjs from "bcryptjs";

import { Usuario } from "../models/usuario.js";

import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - mail'
            });
        }

        // Si el usario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado false'
            });
        }

        // Verificar la contraseña
        const validPass = bcryptjs.compareSync( password, usuario.password );
        if( !validPass ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - pass'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id ); 

        res.json({
            usuario,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });

    }
}

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });
        
        if( !usuario ){
            // Crearlo si no existe
            const data = {
                nombre,
                correo,
                password: 'NO IMPORTA EL DATO',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si lo borraron del a DB para no darle acceso
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
    } catch (err) {
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

export{
    login,
    googleSignIn
}