const inputCep = document.querySelector('#cep');

inputCep.addEventListener("change", () => consultarCep())

async function consultarCep() {
    let cep = inputCep.value.replace(/\D/g, '')
    let inputEndereco = document.querySelector('[name="endereco"]')
    let inputBairro = document.querySelector('[name="bairro"]')

    if(cep.length >= 8){
        let url = `https://viacep.com.br/ws/${cep}/json/`

        try {
            let res = await fetch(url)
            res = await res.json()
            inputEndereco.value = res.logradouro
            inputBairro.value = res.bairro
        } catch (erro) {
            alert('CEP Inválido')
            inputEndereco.value = ''
            inputBairro.value = ''
        }
    }


}
