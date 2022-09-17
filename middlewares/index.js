// Funciona como en HTML si se apunta a la caprta va buscar el index.js


import { validarCampos }  from '../middlewares/validar-campos.js';
import { validarJWT }  from '../middlewares/validar-jwt.js';
import { esAdminRole, tieneRol } from '../middlewares/validar-roles.js';

export {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRol
}