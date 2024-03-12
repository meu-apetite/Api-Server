export default function(code, name) {
	return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password HTML Email Template</title>
    <style type="text/css">
      body {
        margin: 0;
        background-color: #eceff1;
        font-family: sans-serif;
      }
      table {
        border-spacing: 0;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #eceff1;
        padding-bottom: 60px;
      }
      .main {
        background-color: #ffffff;
        margin: auto;
        max-width: 600px;
        border-spacing: 0;
        color: #000000;
        border-radius: 10px;
        border-color: #ebebeb;
        border-width: 1px;
        border-style: solid;
        padding: 10px 30px;
        line-height: 20px;
      }
      .button {
        background-color: #000000;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 20px;
        font-weight: bold;
        border-radius: 5px;
      }
      .logo {
        width: 600px;
        margin: 0px auto;
      }
      .link {
        color: #535353;
        text-decoration-color: #535353;
      }
      .footer {
        margin-top: 20px auto;
        width: 600px;
      }
      .content {
        line-height: 25px;
      }
    </style>
  </head>
  <body>
    <center class="wrapper">
      <table class="logo" width="100%">
        <tr>
          <td style="text-align: center">
            <a href="https://meuapetite.com">
              <img src="https://res.cloudinary.com/dzcmjryzc/image/upload/v1703627095/meuapetite/q5mrsnczph25gycqkwee.png" width="120" style="max-width: 100%; margin-top: 8px; margin-bottom: 8px;" />
            </a>
          </td>
        </tr>
      </table>
      <table class="main" width="100%">
        <tr>
          <td style="text-align: start">
            <p style="font-size: 30px">Olá, <strong>${name}</strong>!</p>
          </td>
        </tr>
        <tr>
          <td style="font-size: 16px; text-align: start; width: 100%">
            <p class="content">
              Aqui está o seu código de verificação. Por favor, não compartilhe este código com mais ninguém.            </p>
          </td>
        </tr>
        <tr style="text-align: center; padding: 15px 0px">
          <td>
            <div class="button" style="width: 150px; margin: auto; font-size: 1.5rem;">${code}</div>
          </td>
        </tr>
        <tr>
          <td
            style="
              font-size: 16px;
              text-align: start;
              width: 100%;
              color: #858585;
              padding-top: 15px;
            "
          >
            <p class="content">
              Caso não tenha sido você quem solicitou a verificação, por favor, ignore este e-mail. <br>
              suporte: <a class="link" href="mailto:support@appname.com"
                >contato@meuapetite.com</a
              >
            </p>
            <p>Obrigado!</p>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table class="footer">
        <tr>
          <td style="text-align: center; padding: 15px; color: #858585">
            <p>Enviado por <a href="https://meuapetite.com" target="_blank" class="link">Meu apetite</a></p>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
  `
}