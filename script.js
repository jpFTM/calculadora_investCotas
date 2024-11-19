document.getElementById('investmentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar os inputs do usuário
    const months = parseInt(document.getElementById('months').value);
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    const quotaPrice = parseFloat(document.getElementById('quotaPrice').value);
    const returnPercentage = parseFloat(document.getElementById('returnPercentage').value) / 100;
    const reinvest = document.getElementById('reinvest').value === 'yes';

    // Variáveis para cálculo
    let totalInvested = 0;
    let totalQuotas = 0;
    let monthlyIncome = [];
    let passiveIncomeAccumulated = 0;
    let totalBalance = [];
    let totalPassiveIncome = [];

    // Simulação de investimento
    for (let month = 1; month <= months; month++) {
        // Adiciona novas cotas compradas
        totalQuotas += monthlyInvestment / quotaPrice;
        totalInvested += monthlyInvestment;

        // Gera renda passiva
        const passiveIncomeQuotas = reinvest ? Math.floor(totalQuotas * returnPercentage) : 0;
        totalQuotas += passiveIncomeQuotas;
        const monthlyPassiveIncome = totalQuotas * returnPercentage * quotaPrice;

        passiveIncomeAccumulated += monthlyPassiveIncome;
        monthlyIncome.push(monthlyPassiveIncome);
        totalBalance.push(totalQuotas * quotaPrice);
        totalPassiveIncome.push(passiveIncomeAccumulated);
    }

    // Atualizar os resultados
    document.getElementById('totalInvested').textContent = `Total investido: R$ ${totalInvested.toFixed(2)}`;
    document.getElementById('totalQuotas').textContent = `Total de cotas acumuladas: ${totalQuotas.toFixed(2)}`;
    document.getElementById('totalBalance').textContent = `Saldo total (valor das cotas): R$ ${totalBalance[totalBalance.length - 1].toFixed(2)}`;
    document.getElementById('finalPassiveIncome').textContent = `Renda passiva mensal ao final: R$ ${monthlyIncome[monthlyIncome.length - 1].toFixed(2)}`;

    // Gerar gráficos
    const growthCtx = document.getElementById('investmentGrowthChart').getContext('2d');
    const incomeCtx = document.getElementById('monthlyIncomeChart').getContext('2d');

    // Gráfico de crescimento do investimento
    new Chart(growthCtx, {
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
                {
                    label: 'Renda Passiva Acumulada (R$)',
                    data: totalPassiveIncome,
                    borderColor: '#f39c12',
                    tension: 0.1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
            scales: {
                x: { title: { display: true, text: 'Meses' } },
                y: { title: { display: true, text: 'R$' } },
            },
        },
    });

    // Gráfico de renda passiva mensal
    new Chart(incomeCtx, {
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
            plugins: {
                legend: { display: true },
            },
            scales: {
                x: { title: { display: true, text: 'Meses' } },
                y: { title: { display: true, text: 'R$' } },
            },
        },
    });
});
