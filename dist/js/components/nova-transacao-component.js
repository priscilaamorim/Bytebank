import conta from "../types/Conta.js";
import ExtratoComponet from "./extrato-componet.js";
import SaldoComponent from "./saldo-component.js";
const elementoFormulario = document.querySelector(".block-nova-transacao form");
elementoFormulario.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        if (!elementoFormulario.checkValidity()) {
            alert("Por favor, preencha todos os compos de transação!");
            return;
        }
        const inputTipoTransacao = elementoFormulario.querySelector("#tipoTransacao");
        const inputValor = elementoFormulario.querySelector("#valor");
        const inputData = elementoFormulario.querySelector("#data");
        //Pega o tipo, o valor (em número) e a data (como um objeto Date).
        const tipoTransacao = inputTipoTransacao.value; //É a caixa de seleção (Depósito, etc)
        const valor = inputValor.valueAsNumber; // São os campos de entrada de texto/número/data
        const data = new Date(inputData.value);
        if (isNaN(data.getTime())) {
            throw new Error("Data inválida!");
        }
        const novaTransacao = {
            tipoTransacao,
            valor,
            data,
        };
        conta.registrarTransacao(novaTransacao);
        SaldoComponent.atualizar();
        ExtratoComponet.atualizar();
        elementoFormulario.reset();
    }
    catch (erro) {
        if (erro instanceof Error) {
            alert(erro.message);
        }
        else {
            alert("Erro inesperado!");
        }
    }
});
