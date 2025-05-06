import { Transacao } from "./Transacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";

let saldo: number = Number(localStorage.getItem("saldo")) || 0;

const transacoesJSON = localStorage.getItem("transacoes");
let transacoes: Transacao[] = [];

if (transacoesJSON) {
  transacoes = JSON.parse(transacoesJSON, (key: string, value: string) => {
    if (key === "data") {
      return new Date(value);
    }
    return value;
  });
}

function debitar(valor: number): void {
  if (valor <= 0) {
    throw new Error("O valor deve ser maior que zero!");
  }
  if (valor > saldo) {
    throw new Error("Saldo insuficiente!");
  }
  saldo -= valor;
  localStorage.setItem("saldo", saldo.toString());
}

function depositar(valor: number): void {
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

  getDataAcesso(): Date {
    return new Date();
  },

  getGruposTransacoes(): GrupoTransacao[] {
    const gruposTransacoes: GrupoTransacao[] = [];
    const listaTransacoes: Transacao[] = structuredClone(transacoes);

    const transacoesOrdenadas: Transacao[] = listaTransacoes
    .filter(t => t.data instanceof Date && !isNaN(t.data.getTime()))
    .sort((t1, t2) => t2.data.getTime() - t1.data.getTime());

    let labelAtualGrupoTransacao: string = "";

    for (let transacao of transacoesOrdenadas) {
        let labelGrupoTransacao: string = transacao.data.toLocaleDateString(
        "pt-br",
        { month: "long", year: "numeric" }
      );

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


  registrarTransacao(novaTransacao: Transacao): void {
    // ajusta o saldo dependendo do tipo de transação
    if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
      depositar(novaTransacao.valor);
    } else if (
      novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA ||
      novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO
    ) {
      debitar(novaTransacao.valor);
     
    } else {
      throw new Error("Tipo de Transação é inválido!");
    }

    transacoes.push(novaTransacao);
    console.log(conta.getGruposTransacoes());
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  },

  agruparTransacoes(): ResumoTransacoes {
    const resumo: ResumoTransacoes = {
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
