import conta from "../types/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
import { formataMoeda, formatarData } from "../utils/formatadores.js";



const elementoSaldo = document.querySelector(".saldo-valor .valor") as HTMLElement;
const elementoDataAcesso = document.querySelector(".block-saldo time") as HTMLElement;


if (elementoDataAcesso) {
    elementoDataAcesso.textContent = formatarData(conta.getDataAcesso(), 
        FormatoData.DIA_SEMANA_DIA_MES_ANO);
  
 }

 
 function renderizarSaldo(): void {
    
    if (elementoSaldo !== null ){
        elementoSaldo.textContent = formataMoeda(conta.getSaldo());
        }
}


const SaldoComponent = {
    atualizar(){
        renderizarSaldo();
    }
}
 export default SaldoComponent;
