
import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos,
         validarJWT,
         esAdminRole,
         tieneRol } from '../middlewares/index.js';

import { esRoleValido,
         emailExiste,
         existeUsuarioPorId } from '../helpers/db-validators.js';

import { usuarioDelete,
         usuarioGet,
         usuarioPatch,
         usuarioPost,
         usuarioPut } from '../controllers/users.controllers.js';

const router = Router();


router.get('/', usuarioGet );

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({ min:6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
] , usuarioPost ); 

// : ese tipo de params es directamente despues del slash /
//  los query params como son opciones no se colocan aqui
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({ min:6 }),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuarioPut ); 

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuarioDelete ); 

router.patch('/', usuarioPatch );


export {
    router
}