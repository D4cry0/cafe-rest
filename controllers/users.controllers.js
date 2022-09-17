import { response, request } from 'express';
import bcryptjs from 'bcryptjs';

import { Usuario } from '../models/usuario.js';

const usuarioGet = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    // Con este filtramos los que se borraron ficticiamente
    const query = { estado: true };

    // const usuarios = await Usuario.find(query)
    //     .skip( Number(desde) )
    //     .limit( Number(limite) );

    // const total = await Usuario.countDocuments(query);

    // Usamos el await para esperar el resultado de todas las promesas
    const [ total, usuarios ] = await Promise.all([ 
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number(desde) )
            .limit( Number(limite) )
     ])

    res.json({
        total,
        usuarios
    });
}

const usuarioPost = async (req, res = response) => {

    // se puede validar un poco con las desestructuración
    const { nombre, correo, password, rol } = req.body;

    // La ventaja de mandarlo como parametro es que si hay campos
    // que no estan definidos en el modelo. Moongose los ignora
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // 10 valor por defecto
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save();

    res.json({
        msg: 'post API - controlador post',
        usuario
    });
}

const usuarioPut = async(req, res = response) => {
    const { id } = req.params;
    // El de google no se debe tocar
    const { _id, password, google, correo, _v, ...resto } = req.body;

    // TODO: Validar contra base de datos

    // Si quiere actualiar su password se encripta y ya
    if( password ){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    // Busca el ID y actualiza el resto de aergumentos
    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new:true } );

    res.json({
        usuario
    });
}

const usuarioPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador patch'
    });
}

const usuarioDelete = async(req, res = response) => {

    const { id } = req.params;

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrado logico
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, { new:true } );

    res.json({
        usuario
    });
}

export {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioPatch,
    usuarioDelete
}