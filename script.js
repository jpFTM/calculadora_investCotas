// Variáveis globais para armazenar as instâncias dos gráficos
let growthChart = null;
let incomeChart = null;

document.getElementById('investmentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar os inputs do usuário
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const months = parseInt(document.getElementById('months').value);
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    const quotaPrice = parseFloat(document.getElementById('quotaPrice').value);
    const returnPercentage = parseFloat(document.getElementById('returnPercentage').value) / 100;
    const reinvest = document.getElementById('reinvest').value === 'yes';

    // Variáveis para cálculo
    let totalInvested = initialInvestment;
    let totalQuotas = initialInvestment / quotaPrice;
    let monthlyIncome = [];
    let totalBalance = [];
    let tableData = [];

    // Simulação de investimento
    for (let month = 1; month <= months; month++) {
        // Adiciona novas cotas compradas
        const investedThisMonth = monthlyInvestment;
        totalQuotas += investedThisMonth / quotaPrice;
        totalInvested += investedThisMonth;

        // Gera renda passiva
        const passiveIncomeQuotas = reinvest ? Math.floor(totalQuotas * returnPercentage) : 0;
        totalQuotas += passiveIncomeQuotas;

        const monthlyPassiveIncome = totalQuotas * returnPercentage * quotaPrice;
        monthlyIncome.push(monthlyPassiveIncome);

        const currentBalance = totalQuotas * quotaPrice;
        totalBalance.push(currentBalance);

        // Adiciona dados à tabela
        tableData.push({
            month,
            invested: investedThisMonth.toFixed(2),
            passiveIncome: monthlyPassiveIncome.toFixed(2),
            balance: currentBalance.toFixed(2),
        });
    }

    // Valor final total (igual ao saldo total final)
    const finalTotal = totalBalance[totalBalance.length - 1];

    // Atualizar os resultados
    document.getElementById('totalInvested').textContent = `Total investido: R$ ${totalInvested.toFixed(2)}`;
    document.getElementById('totalQuotas').textContent = `Total de cotas acumuladas: ${totalQuotas.toFixed(2)}`;
    document.getElementById('totalBalance').textContent = `Saldo total (valor das cotas): R$ ${finalTotal.toFixed(2)}`;
    document.getElementById('finalPassiveIncome').textContent = `Renda passiva mensal ao final: R$ ${monthlyIncome[monthlyIncome.length - 1].toFixed(2)}`;
    document.getElementById('finalTotal').textContent = `Valor final total: R$ ${finalTotal.toFixed(2)}`;

    // Preencher a tabela
    const tableBody = document.getElementById('monthlyDetailsTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Limpar tabela
    tableData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>R$ ${row.invested}</td>
            <td>R$ ${row.passiveIncome}</td>
            <td>R$ ${row.balance}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Atualizar gráficos

    // Destruir gráficos antigos se existirem
    if (growthChart) {
        growthChart.destroy();
    }
    if (incomeChart) {
        incomeChart.destroy();
    }

    // Gerar gráfico de crescimento do investimento
    const growthCtx = document.getElementById('investmentGrowthChart').getContext('2d');
    growthChart = new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: months }, (_, i) => `Mês ${i + 1}`),
            datasets: [
                {
                    label: 'Saldo Total (R$)',
                    data: totalBalance,
                    borderColor: '#0056b3',
                    tension: 0.1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Meses' } },
                y: { title: { display: true, text: 'R$' } },
            },
        },
    });

    // Gerar gráfico de renda passiva mensal
    const incomeCtx = document.getElementById('monthlyIncomeChart').getContext('2d');
    incomeChart = new Chart(incomeCtx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: months }, (_, i) => `Mês ${i + 1}`),
            datasets: [
                {
                    label: 'Renda Passiva Mensal (R$)',
                    data: monthlyIncome,
                    backgroundColor: '#007bff',
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Meses' } },
                y: { title: { display: true, text: 'R$' } },
            },
        },
    });
});
