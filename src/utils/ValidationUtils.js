export class ValidationUtils {
  validationPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  validationEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validationTel = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validationWhatsapp = /^\d{10,15}$/;

  static password(value) {
    //Minimum eight characters, at least one letter and one number:
    return this.validationPassword.test(value)
      ? true
      : 'A senha precisa ter no mínimo 8 caracteres, pelo menos uma letra e um número.';
  }

  static email(value) {
    return this.validationEmail.test(value) ? true : 'Email inválido.';
  }

  static whatsapp(value) {
    return this.validationWhatsapp.test(value) ? true : 'Whatsapp inválido.';
  }

  static ownerName(value) {
    return value && value.length >= 3 && value.length <= 70
      ? true
      : 'O nome do proprietário precisa ter no mínimo 3 letras e no máximo 70 letras.';
  }

  static fantasyName(value) {
    return value && value.length >= 3 && value.length <= 70
      ? true
      : 'O nome do seu negócio precisa ter no mínimo 3 letras e no máximo 70 letras.';
  }

  static description(value) {
    return value && value.length >= 20 && value.length <= 200
      ? true
      : 'A descrição precisa ter no mínimo 20 letras e no máximo 200 letras.';
  }
 
  static string(value) {
    return value && value.length >= 3 && value.length <= 70
      ? true
      : 'O nome do seu negócio precisa ter no mínimo 3 letras e no máximo 70 letras.';
  }
}
