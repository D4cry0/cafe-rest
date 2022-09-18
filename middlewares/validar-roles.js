import { response } from "express"

const esAdminRole = ( req, res = response, next ) => {

    if( !req.uAuth ){
        return res.status(500).json({
            msg: 'Se requiere veririfiar el rol sin validar el token primero'
        });
    }

    const { rol, nombre } = req.uAuth;

    if( rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${ nombre } no es ADMIN`
        });
    }

    next();
}


const tieneRol = ( ...roles ) => {
    return ( req, res = response, next ) => {

        if( !req.uAuth ){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if( !roles.includes( req.uAuth.rol )){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}

export {
    esAdminRole,
    tieneRol
}