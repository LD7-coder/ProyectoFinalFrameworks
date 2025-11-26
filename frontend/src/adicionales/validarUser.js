export default function validarUser(usuario){
    usuario = usuario.trim();
    let regexUser = /^[A-Za-z0-9]{3,10}$/;

    return regexUser.test(usuario);
}
