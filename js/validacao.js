export function valida(input){
  const tipoDeInput = input.dataset.tipo;

  if(validadores[tipoDeInput]){
    validadores[tipoDeInput](input)
  }

  if(input.validity.valid){
    input.parentElement.classList.remove("input-container--invalido")
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML = ""
  }else{
    input.parentElement.classList.add("input-container--invalido")
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML = mostraMensagemDeErro(tipoDeInput, input)
  }
}

const tipoDeErro = [
  "valueMissing",
  "typeMismatch",
  "parentElement",
  "customError" 
]

const mensagensDeErro = {
  nome:{
    valueMissing: "O campo nome não pode estar vazio."
  },
  email:{
    valueMissing: "O campo e-mail não pode estar vazio.",
    typeMismatch: "O e-mail digitado não é válido."
  },
  senha:{
    valueMissing: "O campo senha não pode estar vazio.",
    patternMismatch: "A senha deve conter entre 8 e 12 caracteres, pelo menos um número, uma letra maiúscula, uma letra minúscula e um símbolo"
  },
  dataNascimento:{
    valueMissing: "A data de nascimento não pode estar vazia.",
    customError: "Você precisa ser maior que 18 anos para se cadastrar."
  },
  cpf:{
    valueMissing: "O campo CPF não pode ficar vazio.",
    customError: "O CPF digitado não é válido"
  }

}

const validadores = {
  dataNascimento:input => validaDataNascimento(input),
  cpf:input => validaCPF(input)
}

function mostraMensagemDeErro(tipoDeInput, input){
  let mensagem = ""
  tipoDeErro.forEach(erro => {
    if(input.validity[erro]){
      mensagem = mensagensDeErro[tipoDeInput][erro]
    }    
  });

  return mensagem
}

function validaDataNascimento(input) {
  const dataRecebida = new Date(input.value);
  let mensagem = "";
  
  if(!maiorQue18(dataRecebida)){
    mensagem = "Você precisa ser maior que 18 anos para se cadastrar.";
  }

  input.setCustomValidity(mensagem);
}

function maiorQue18(data) {
  const dataAtual = new Date();
  const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());

  return dataMais18 <= dataAtual;
}

function validaCPF(input){
  const cpfFormatado = input.value.replace(/\D/g, "")
  let mensagem = ""

  if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)){
    mensagem = "O CPF digitado não é válido"
  }

  input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf){
  const valoresRepetidos = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999"
  ]

  let cpfValido = true

  valoresRepetidos.forEach(valor =>{
    if(valor == cpf){
      cpfValido = false
    }
  })

  return cpfValido  
}

function checaEstruturaCPF(cpf){
  const multiplicador = 10

  return checaDigitoVericicador(cpf, multiplicador)
}

function checaDigitoVericicador(cpf, multiplicador){
  if(multiplicador >= 12){
    return = true
  }
  let multiplicadorInicial = multiplicador
  let soma = 0
  const cpfSemDigitos = cpf.substr(0, multiplicador -1).split("")
  const checaDigitoVericicador = cpf.charAt(multiplicador -1)
  for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--){
    soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
    contador++
  }

  if(checaDigitoVericicador == confirmaDigito(soma)){
    return checaDigitoVericicador(cpf, multiplicador +1)
  }

  return false
}

function confirmaDigito(soma){
  return 11 - (soma % 11)
}

