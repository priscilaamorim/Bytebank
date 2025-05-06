import { TipoTransacao } from "./TipoTransacao.js";
let saldo = Number(localStorage.getItem("saldo")) || 0;
const transacoesJSON = localStorage.getItem("transacoes");
let transacoes = [];
if (transacoesJSON) {
    transacoes = JSON.parse(transacoesJSON, (key, value) => {
        if (key === "data") {
            return new Date(value);
        }
        return value;
    });
}
function debitar(valor) {
    if (valor <= 0) {
        throw new Error("O valor deve ser maior que zero!");
    }
    if (valor > saldo) {
        throw new Error("Saldo insuficiente!");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}
function depositar(valor) {
    if (valor <= 0) {
        throw new Error("O valor deve ver maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}
const conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes
            .filter(t => t.data instanceof Date && !isNaN(t.data.getTime()))
            .sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: [],
                });
            }
            gruposTransacoes[gruposTransacoes.length - 1].transacoes.push(transacao);
        }
        return gruposTransacoes;
    },
    registrarTransacao(novaTransacao) {
        // ajusta o saldo dependendo do tipo de transação
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA ||
            novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
        }
        else {
            throw new Error("Tipo de Transação é inválido!");
        }
        transacoes.push(novaTransacao);
        console.log(conta.getGruposTransacoes());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    },
    agruparTransacoes() {
        const resumo = {
            totalDepositos: 0,
            totalTransferencias: 0,
            totalPagamentosBoleto: 0,
        };
        transacoes.forEach((transacao) => {
            switch (transacao.tipoTransacao) {
                case TipoTransacao.DEPOSITO:
                    resumo.totalDepositos += transacao.valor;
                    break;
                case TipoTransacao.TRANSFERENCIA:
                    resumo.totalTransferencias += transacao.valor;
                    break;
                case TipoTransacao.PAGAMENTO_BOLETO:
                    resumo.totalPagamentosBoleto += transacao.valor;
                    break;
            }
        });
        return resumo;
    }
};
export default conta;
