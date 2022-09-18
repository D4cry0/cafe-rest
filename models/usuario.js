import pkg from 'mongoose';
const { Schema, model } = pkg;

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        require: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        require: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'],
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

// OJO debe ser funcion normal por el uso del this
// con esto eliminado información sensible o no util de la response
UsuarioSchema.methods.toJSON = function() {
    const { __v, _id, password, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}


const Usuario = model( 'Usuario', UsuarioSchema );

export {
    Usuario
}