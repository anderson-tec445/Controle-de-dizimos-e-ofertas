let totalDizimos = 0;
let totalOfertas = 0;
let totalSaidas = 0;
let relatorioEntradas = [];
let relatorioSaidas = [];

function adicionarEntrada() {
    const tipo = document.getElementById("tipo").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const dataEntrada = document.getElementById("dataEntrada").value;

    if (!valor || !dataEntrada) {
        alert("Preencha todos os campos de entrada!");
        return;
    }

    if (tipo === "dizimo") {
        totalDizimos += valor;
    } else if (tipo === "oferta") {
        totalOfertas += valor;
    }

    relatorioEntradas.push(`Entrada: ${tipo} - Valor: R$ ${valor.toFixed(2)} - Data: ${dataEntrada}`);
    atualizarRelatorio();
    atualizarTotais();
}

function adicionarSaida() {
    const valorSaida = parseFloat(document.getElementById("valorSaida").value);
    const dataSaida = document.getElementById("dataSaida").value;

    if (!valorSaida || !dataSaida) {
        alert("Preencha todos os campos de saída!");
        return;
    }

    totalSaidas += valorSaida;
    relatorioSaidas.push(`Saída - Valor: R$ ${valorSaida.toFixed(2)} - Data: ${dataSaida}`);
    atualizarRelatorio();
    atualizarTotais();
}

function atualizarRelatorio() {
    const relatorioEntradasElement = document.getElementById("relatorioEntradas");
    relatorioEntradasElement.innerHTML = "";
    relatorioEntradas.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        relatorioEntradasElement.appendChild(li);
    });

    const relatorioSaidasElement = document.getElementById("relatorioSaidas");
    relatorioSaidasElement.innerHTML = "";
    relatorioSaidas.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        relatorioSaidasElement.appendChild(li);
    });
}

function atualizarTotais() {
    document.getElementById("totalDizimos").textContent = totalDizimos.toFixed(2);
    document.getElementById("totalOfertas").textContent = totalOfertas.toFixed(2);
    document.getElementById("totalSaidas").textContent = totalSaidas.toFixed(2);

    const saldoTotal = totalDizimos + totalOfertas - totalSaidas;
    document.getElementById("saldoTotal").textContent = saldoTotal.toFixed(2);
}

function gerarRelatorio() {
    let relatorio = "Relatório de Dízimos e Ofertas:\n\n";

    relatorio += "Entradas:\n";
    relatorioEntradas.forEach(item => {
        relatorio += item + "\n";
    });

    relatorio += "\nSaídas:\n";
    relatorioSaidas.forEach(item => {
        relatorio += item + "\n";
    });

    relatorio += `\nTotal de Dízimos: R$ ${totalDizimos.toFixed(2)}\n`;
    relatorio += `Total de Ofertas: R$ ${totalOfertas.toFixed(2)}\n`;
    relatorio += `Total de Saídas: R$ ${totalSaidas.toFixed(2)}\n`;
    relatorio += `Saldo Total: R$ ${(totalDizimos + totalOfertas - totalSaidas).toFixed(2)}\n`;

    return relatorio;
}

function baixarRelatorio() {
    const relatorio = gerarRelatorio();
    const blob = new Blob([relatorio], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio_dizimos_ofertas.txt";
    link.click();
}
