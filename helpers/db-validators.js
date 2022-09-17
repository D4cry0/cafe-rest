import { Role } from '../models/role.js';
import { Usuario } from '../models/usuario.js';

const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error( `El rol ${rol} no esta registrado en DB` );
    }
}

// validar el correo
const emailExiste = async( correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ){
        throw new Error( 'El correo ya existe' );
    }
}

// validad usuario
const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){
        throw new Error( `El id no existe ${ id }` );
    }
}


export {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}