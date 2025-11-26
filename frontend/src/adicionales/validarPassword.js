export default function validarPassword(password){
    password = password.trim();
    let regexPassword = /^[A-Za-z0-9#@?¿!¡%$&_-]{10,15}$/;

    return regexPassword.test(password);
}
