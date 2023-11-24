class Validation {
  validationPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  validationEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validationTel = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  password(value) {
    //Minimum eight characters, at least one letter and one number:
    return this.validationPassword.test(value)
      ? true
      : 'A senha precisa ter no mínimo 8 caracteres, pelo menos uma letra e um número.';
  }

  email(value) {
    return this.validationEmail.test(value) ? true : 'Email inválido.';
  }

  ownerName(value) {
    return value && value.length >= 3 && value.length <= 70
      ? true
      : 'O nome do proprietário precisa ter no mínimo 3 letras e no máximo 70 letras.';
  }

  fantasyName(value) {
    return value && value.length >= 3 && value.length <= 70
      ? true
      : 'O nome do seu negócio precisa ter no mínimo 3 letras e no máximo 70 letras.';
  }

  string(value) {
    return value && value.length >= 3 && value.length <= 70
      ? true
      : 'O nome do seu negócio precisa ter no mínimo 3 letras e no máximo 70 letras.';
  }
}

export default Validation;
