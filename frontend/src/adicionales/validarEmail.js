export default function validarEmail(email){
    email = email.trim();
    let regexEmail = /^[A-Za-z0-9]+@[a-zA-Z0-9]{1,63}\.[a-z]{1,63}$/;

    return regexEmail.test(email);
}
