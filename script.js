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

function baixarRelatorio() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // Adicionar título ao relatório
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Informe de Rendimentos", 14, 20);

    // Adicionar data de geração do relatório
    doc.setFontSize(10);
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    doc.text(`Gerado em: ${dataAtual}`, 14, 28);

    // Criar arrays separados para Dízimos, Ofertas e Saídas
    let dizimos = [];
    let ofertas = [];
    let saidas = [];

    // Separar os valores corretamente
    relatorioEntradas.forEach(item => {
        const dadosFormatados = extrairDadosRelatorio(item);
        if (dadosFormatados.tipo === "dizimo") {
            dizimos.push(["Dízimo", parseFloat(dadosFormatados.valor).toFixed(2), formatarData(dadosFormatados.data)]);
        } else if (dadosFormatados.tipo === "oferta") {
            ofertas.push(["Oferta", parseFloat(dadosFormatados.valor).toFixed(2), formatarData(dadosFormatados.data)]);
        }
    });

    // Adicionar saídas com categorias
    relatorioSaidas.forEach(item => {
        const dadosFormatados = extrairDadosRelatorio(item, true);
        saidas.push([dadosFormatados.tipo, parseFloat(dadosFormatados.valor).toFixed(2), formatarData(dadosFormatados.data)]);
    });

    // Função para adicionar tabelas ao PDF
    function adicionarTabela(titulo, dados, startY) {
        if (dados.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(titulo, 14, startY);
            doc.autoTable({
                startY: startY + 5,
                head: [["Tipo de Rendimento", "Valor Bruto (R$)", "Data do Pagamento"]],
                body: dados,
                theme: "grid",
                styles: { fontSize: 10 },
                headStyles: { fillColor: [64, 64, 64], textColor: [255, 255, 255] },
                columnStyles: {
                    0: { cellWidth: 50 },
                    1: { cellWidth: 40, halign: "right" },
                    2: { cellWidth: 40, halign: "center" }
                }
            });
            return doc.lastAutoTable.finalY + 10; // Retorna a posição Y abaixo da tabela para a próxima seção
        }
        return startY;
    }

    // Gerar as tabelas no PDF
    let y = 35;
    y = adicionarTabela("Dízimos", dizimos, y);
    y = adicionarTabela("Ofertas", ofertas, y);
    y = adicionarTabela("Saídas", saidas, y);

    // Adicionar saldo total
    let saldoTotal = totalDizimos + totalOfertas - totalSaidas;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Saldo Total: R$ ${saldoTotal.toFixed(2)}`, 14, y + 10);

    // Salvar e baixar o PDF
    doc.save("Informe_Rendimentos_2024.pdf");
}

function adicionarSaida() {
    const valorSaida = parseFloat(document.getElementById("valorSaida").value);
    const dataSaida = document.getElementById("dataSaida").value;
    const categoria = document.getElementById("categoriaSaida").value;

    if (!valorSaida || !dataSaida) {
        alert("Preencha todos os campos de saída!");
        return;
    }

    totalSaidas += valorSaida;
    relatorioSaidas.push(`${categoria} - Valor: R$ ${valorSaida.toFixed(2)} - Data: ${dataSaida}`);
    atualizarTotais();
}

// Função auxiliar para extrair os dados corretamente
function extrairDadosRelatorio(texto, isSaida = false) {
    const partes = texto.split(" - ");
    return {
        tipo: isSaida ? partes[0] : partes[0].split(": ")[1],
        valor: partes[1].split(": ")[1].replace("R$ ", "").replace(",", "."),
        data: partes[2].split(": ")[1]
    };
}

// Função para formatar a data no padrão DD/MM/AAAA
function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}
