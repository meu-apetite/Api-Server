export default function(order) {
	return `
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0;">
     <meta name="format-detection" content="telephone=no"/>
    <style>
    /* Reset styles */ 
    body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
    body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    #outlook a { padding: 0; }
    .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
    /* Rounded corners for advanced mail clients only */ 
    @media all and (min-width: 560px) {
      .container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}
    }
    /* Set color for auto links (addresses, dates, etc.) */ 
    a, a:hover { color: #127DB3; }
    .footer a, .footer a:hover { color: #999999; }
     </style>
    <title>Novo pedido</title>
  </head>
  
  <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; background-color: #F0F0F0; color: #000000;" bgcolor="#F0F0F0" text="#000000">
  <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#F0F0F0">
  <table border="0" cellpadding="0" cellspacing="0" align="center"
    width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
    max-width: 560px;" class="wrapper">
  
    <tr>
      <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
        padding-top: 20px;
        padding-bottom: 20px;">
  
        <!-- PREHEADER -->
        <!-- Set text color to background color -->
        <div style="display: none; visibility: hidden; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; height: 0; max-height: 0; max-width: 0; color: #F0F0F0;" class="preheader">
          Novo pedido na area, veja os detalhes do pedido e confime para o seu cliente  
        </div>
  
        <!-- LOGO -->
        <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2. URL format: http://domain.com/?utm_source={{Campaign-Source}}&utm_medium=email&utm_content=logo&utm_campaign={{Campaign-Name}} -->
        <a target="_blank" style="text-decoration: none;"
          href="https://github.com/konsav/email-templates/"><img border="0" vspace="0" hspace="0"
          src="https://raw.githubusercontent.com/konsav/email-templates/master/images/logo-black.png"
          width="100" height="30"
          alt="Logo" title="Logo" style="
          color: #000000;
          font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" /></a>
      </td>
    </tr>
  
  <!-- End of WRAPPER -->
  </table>
  
  <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: 90%; max-width: 560px;" class="container">
    <!-- HEADER -->
    <tr>
      <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%; padding-top: 25px; color: #000000; font-family: sans-serif;" class="header">
        ${order.client.name} - #${order.id}
      </td>
    </tr>
  
    <!-- PARAGRAPH -->
    <tr>
      <td align="left" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 100%; font-size: 17px; font-weight: 400; line-height: 160%; padding-top: 25px; color: #000000; font-family: sans-serif;" class="paragraph">
        <strong>Nome: </strong>${order.client.name} <br />
        <strong>Telefone: </strong>${order.client.phoneNumber} <br />
        <strong>Email: </strong>${order.client.email} <br />
        ${
          order.deliveryType === 'delivery' 
          ? `<strong>Endereço:</strong> ${order?.address.street?.length ? `${order.address.street}, ${order.address.number}, ${order.address.district}, ${order.address.city}` : 'Não informado'} <br />`
          : ''
        }
        **Pedido para ${(order.deliveryType === 'delivery') ? 'entrega' : 'retirada'} <br />
      </td>
    </tr>
    
    <!-- LINE -->
    <tr>	
      <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
        padding-top: 25px;" class="line"><hr
        color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
      </td>
    </tr>
  
    <!-- LIST -->
    <tr>
      <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%;" class="list-item"><table align="center" border="0" cellspacing="0" cellpadding="0" style="width: inherit; margin: 0; padding: 0; border-collapse: collapse; border-spacing: 0;">
      <!-- LIST ITEM -->
      ${order.products.map(item => `
        <tr>
          <td align='left' valign='top' style='border-collapse: collapse; border-spacing: 0; padding-top: 30px; padding-right: 20px;'>
            <img border='0' vspace='0' hspace='0' style='padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block; color: #000000;' src='${item.imageUrl}' alt='H' title='Highly compatible' width='50' height='50'>
          </td>

          <td align='left' valign='top' style='font-size: 16px; font-weight: 400; line-height: 160%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-top: 25px; color: #000000; font-family: sans-serif;' class='paragraph'>
            <b style='color: #333333;'>${item.productName}</b><br/>
            <strong>Preço: </strong>${item.priceTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <br />
            <strong>Quantidade: </strong>${item.quantity} <br />
            ${item?.complements.length ? `<strong style='color: #000;'>Complementos:</strong> ${item?.complements.map((c, i) => `<span style='color: #000;'>${c?.name}</span>${item?.complements.length === (i + 1) ? '' : ', '}`).join('')} <br />` : ''}
          </td>
        </tr>`
      ).join('')}
      </table></td>
    </tr>
  
    <!-- LINE -->
    <tr>
      <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 100%;
        padding-top: 25px;" class="line"><hr
        color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
      </td>
    </tr>

    <tr>
      <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 100%; font-size: 17px; font-weight: 400; line-height: 160%; padding-top: 16px; padding-bottom: 16px; color: #000000; font-family: sans-serif;" class="paragraph">
        <strong>Total: ${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'  })}</strong>
      </td>
    </tr>  
  </table>
  
  <!-- BUTTON -->
  <tr>
    <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; padding-top: 15px; padding-bottom: 15px;" class="button">
      <a href="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration: underline;">
        <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">
          <tr>
            <td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;" bgcolor="#E9703E">
              <a target="_blank" style="text-decoration: underline; color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href="https://github.com/konsav/email-templates/">
                Confirmar pedido
              </a>
            </td>
          </tr>
        </table>
      </a>
    </td>
  </tr>
  </table>
  </td></tr></table>
  </body>
  </html>
  `
}