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
    }

    // Atualizar os resultados
    document.getElementById('totalInvested').textContent = `Total investido: R$ ${totalInvested.toFixed(2)}`;
    document.getElementById('totalQuotas').textContent = `Total de cotas acumuladas: ${totalQuotas.toFixed(2)}`;
    document.getElementById('totalBalance').textContent = `Saldo total (valor das cotas): R$ ${(totalQuotas * quotaPrice).toFixed(2)}`;
    document.getElementById('finalPassiveIncome').textContent = `Renda passiva mensal ao final: R$ ${monthlyIncome[monthlyIncome.length - 1].toFixed(2)}`;

    // Gerar o gráfico
    const ctx = document.getElementById('investmentChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: months }, (_, i) => `Mês ${i + 1}`),
            datasets: [
                {
                    label: 'Renda Passiva Acumulada (R$)',
                    data: monthlyIncome,
                    borderColor: '#007bff',
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
});
