import conta from "../types/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
import { formataMoeda, formatarData } from "../utils/formatadores.js";
import { TipoTransacao } from "../types/TipoTransacao.js";
const elementoExtrato = document.querySelector(".extrato .registro-transacoes");
renderizarExtro();
function renderizarExtro() {
    const grupoTransacoes = conta.getGruposTransacoes();
    elementoExtrato.innerHTML = "";
    let htmlRegistro = "";
    for (const grupoTransacao of grupoTransacoes) {
        let htmlItem = "";
        for (const transacao of grupoTransacao.transacoes) {
            htmlItem += `
         <div class="transacao-item">
                        <div class="transacao-info">
                            <span class="tipo">${transacao.tipoTransacao}</span>
                            <strong class="valor">  ${transacao.tipoTransacao === TipoTransacao.DEPOSITO
                ? ""
                : "-"}${formataMoeda(transacao.valor)}
                            </strong>
                        </div>
                        <time class="data">${formatarData(transacao.data, FormatoData.DIA_MES)}</time>
                    </div>
        `;
        }
        htmlRegistro += `
      <div class="transacoes-group">
        <strong class="mes-group">${grupoTransacao.label}</strong>
        ${htmlItem}
    </div>
    `;
    }
    if (htmlRegistro === "") {
        htmlRegistro = "<div>Não há transações registradas.</div>";
    }
    elementoExtrato.innerHTML = htmlRegistro;
}
const ExtratoComponet = {
    atualizar() {
        renderizarExtro();
    },
};
export default ExtratoComponet;
