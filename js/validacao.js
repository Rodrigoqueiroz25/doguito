
//custom validação data do nascimento
function validaDataNascimento(input){
    const data = new Date(input.value);
    let mensagem = "";
    if(!maiorQue18(data)){
        mensagem = "Você deve ser maior que 18 anos para cadastro."
    }
    input.setCustomValidity(mensagem);
}

function maiorQue18(data){
    const dataAtual = new Date();
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
    return dataMais18 <= dataAtual;
}


//...........
const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCep(input)
}

const erros = [
    "valueMissing",
    "typeMismatch",
    "patternMismatch",
    "customError"
]
    

const mensagensErro = {
    nome: {
        valueMissing: "O campo nome não pode estar vazio."
    },
    email: {
        valueMissing: "O campo email não pode estar vazio.",
        typeMismatch: "O email digitado não é válido."
    },
    senha:{
        valueMissing: "O campo de senha não pode estar vazio.",
        patternMismatch: "A senha deve conter: entre 6 a 12 caracteres, letras maiusculas, minusculas e números apenas."
    },
    dataNascimento:{
        valueMissing: "O campo de data de nascimento não pode estar vazio.",
        customError: "Você deve ser maior que 18 anos para cadastro."
    },
    cpf:{
        valueMissing: "O campo de cpf não pode estar vazio.",
        customError: "O CPF digitado não é válido."
    },
    cep:{
        valueMissing: "O campo de cep não pode estar vazio.",
        patternMismatch: "O cep digitado não é válido.",
        customError: "Não foi possível buscar o CEP."
    },
    logradouro:{
        valueMissing: "O campo de logradouro não pode estar vazio."
    },
    cidade:{
        valueMissing: "O campo de cidade não pode estar vazio."
    },
    estado:{
        valueMissing: "O campo de estado não pode estar vazio."
    },
    preco:{
        valueMissing: "O campo de preço não pode estar vazio."
    }

}


function mostraMensagemErro(tipoInput,input){
    let mensagem = '';

    erros.forEach((erro) => {
        if(input.validity[erro]){
           mensagem = mensagensErro[tipoInput][erro];
        }
    })

    return mensagem;
}


function valida(input){
    const tipoInput = input.dataset.tipo;

    if(validadores[tipoInput]){
        validadores[tipoInput](input);
    }

    if(input.validity.valid){
        input.parentElement.classList.remove("input-container--invalido");
        input.parentElement.querySelector(".input-mensagem-erro").innerHTML = '';
    }
    else{
        input.parentElement.classList.add("input-container--invalido");
        input.parentElement.querySelector(".input-mensagem-erro").innerHTML = mostraMensagemErro(tipoInput,input);
    }

}

export default valida;


function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '')
    let mensagem = ''

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é válido.'
    }

    input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ];

    let cpfValido = true;

    valoresRepetidos.forEach(valor => {
        if(valor == cpf) {
            cpfValido = false;
        }
    })

    return cpfValido;
}

function checaEstruturaCPF(cpf) {
    const multiplicador = 10

    return checaDigitoVerificador(cpf, multiplicador);
}

function checaDigitoVerificador(cpf, multiplicador) {
    if(multiplicador >= 12) {
        return true;
    }

    let multiplicadorInicial = multiplicador;
    let soma = 0;
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('');
    const digitoVerificador = cpf.charAt(multiplicador - 1);
    for(let contador = 0; multiplicadorInicial > 1 ; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial;
        contador++;
    }

    if(digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1);
    }

    return false;
}

function confirmaDigito(soma) {
    return 11 - (soma % 11);
}


//cep
function recuperarCep(input){
    const cep = input.value.replace(/\D/g,'');
    const url = `https://viacep.com.br/ws/${cep}/json`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro){
                    input.setCustomValidity("Não foi possível buscar o CEP.");
                    return
                }
                input.setCustomValidity('');
                preencheCamposCep(data);
                return
            }
        )
    }

}

function preencheCamposCep(data){
    const logradouro = document.querySelector('[data-tipo="logradouro"]');
    const cidade = document.querySelector('[data-tipo="cidade"]');
    const estado = document.querySelector('[data-tipo="estado"]');


    logradouro.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;
}
