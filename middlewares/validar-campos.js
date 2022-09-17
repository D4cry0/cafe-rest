import { validationResult } from 'express-validator';

// deben de ir con req y res
// next es lo que se llama si esto pasa bien
// es para pasar entre middlewares
const validarCampos = ( req, res, next ) => {

    // Enlistamos los errores que generaron los middlewares en las rutas
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    next();
}

export {
    validarCampos
}