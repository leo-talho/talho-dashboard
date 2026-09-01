'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [comparisonMode, setComparisonMode] = useState('YTD');

  const validUsers = {
    'leo@talho.com.br': 'talho2026',
    'mauricio@talho.com.br': 'talho2026',
    'sergio@talho.com.br': 'talho2026',
  };

  const kpiData = {
    YTD: {
      current: { value: 6717703.99, prev: 5805210.83 },
      ecommerce: { value: 592709.82, prev: 356978.97 },
      ecomPercent: { value: 0.088231, prev: 0.061493 },
      fdsSales: { value: 3958186.28, prev: 3486463.55 },
      fdsPercent: { value: 0.589217, prev: 0.600575 },
      dailySales: { value: 2759517.71, prev: 2318747.28 },
      dailyPercent: { value: 0.410783, prev: 0.399425 },
      orders: { value: 19392, prev: 16622 },
      ticketAvg: { value: 2422.70, prev: 2453.64 },
      ordersPerDay: { value: 643.59, prev: 552.27 },
      salesKg: { value: 52818.07, prev: 47388.95 },
      avgKgPerOrder: { value: 19.06, prev: 20.05 },
      cashInflow: { value: 6828941.24, prev: 5879982.07 },
      cashOutflow: { value: 7086436.99, prev: 5979764.60 },
      cashBalance: { value: -257495.75, prev: -99782.53 },
      payableAccounts: { value: 5412597.70, prev: 4364920.82 },
      receivableAccounts: { value: 557643.93, prev: 666266.10 },
      bankBalance: { value: 768100.32, prev: 1986545.06 },
      stockMeat: { value: 2303292.33, prev: 2057582.40 },
      stockOther: { value: 1048662.60, prev: 820470.22 },
    },
    MoM: {
      current: { value: 988126.63, prev: 1087621.94 },
      ecommerce: { value: 105240.00, prev: 98500.00 },
      ecomPercent: { value: 0.1065, prev: 0.0904 },
      fdsSales: { value: 575000.00, prev: 650000.00 },
      fdsPercent: { value: 0.582, prev: 0.597 },
      dailySales: { value: 413126.00, prev: 437621.94 },
      dailyPercent: { value: 0.418, prev: 0.403 },
      orders: { value: 2923, prev: 3097 },
      ticketAvg: { value: 338.05, prev: 351.19 },
      ordersPerDay: { value: 94.29, prev: 103.23 },
      salesKg: { value: 7720.65, prev: 8409.14 },
      avgKgPerOrder: { value: 2.64, prev: 2.72 },
      cashInflow: { value: 913888.39, prev: 1103370.12 },
      cashOutflow: { value: 913888.39, prev: 1103370.12 },
      cashBalance: { value: 0.00, prev: 0.00 },
      payableAccounts: { value: 818313.27, prev: 813977.97 },
      receivableAccounts: { value: 72477.85, prev: 49773.37 },
      bankBalance: { value: 768100.32, prev: 850000.00 },
      stockMeat: { value: 2303292.33, prev: 2200000.00 },
      stockOther: { value: 1048662.60, prev: 1000000.00 },
    },
    YoY: {
      current: { value: 988126.63, prev: 798048.91 },
      ecommerce: { value: 105240.00, prev: 45000.00 },
      ecomPercent: { value: 0.1065, prev: 0.0564 },
      fdsSales: { value: 575000.00, prev: 480000.00 },
      fdsPercent: { value: 0.582, prev: 0.601 },
      dailySales: { value: 413126.00, prev: 318048.91 },
      dailyPercent: { value: 0.418, prev: 0.399 },
      orders: { value: 2923, prev: 2400 },
      ticketAvg: { value: 338.05, prev: 332.53 },
      ordersPerDay: { value: 94.29, prev: 77.42 },
      salesKg: { value: 7720.65, prev: 6800.00 },
      avgKgPerOrder: { value: 2.64, prev: 2.83 },
      cashInflow: { value: 913888.39, prev: 790000.00 },
      cashOutflow: { value: 913888.39, prev: 800000.00 },
      cashBalance: { value: 0.00, prev: -10000.00 },
      payableAccounts: { value: 818313.27, prev: 700000.00 },
      receivableAccounts: { value: 72477.85, prev: 80000.00 },
      bankBalance: { value: 768100.32, prev: 650000.00 },
      stockMeat: { value: 2303292.33, prev: 2100000.00 },
      stockOther: { value: 1048662.60, prev: 900000.00 },
    },
  };

  const caixaData = {
    'Jul/26': {
      boleto: 45793.72,
      creditCard: 579178.62,
      debitCard: 60954.84,
      creditInCC: 180000.00,
      danfe: 48000.00,
      cash: 5000.00,
    },
    'Jun/26': {
      boleto: 65782.09,
      creditCard: 711070.16,
      debitCard: 84574.99,
      creditInCC: 189000.00,
      danfe: 53000.00,
      cash: 6000.00,
    },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validUsers[user] && validUsers[user] === password) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Email ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser('');
    setPassword('');
  };

  const calculateVariation = (current, prev) => {
    if (prev === 0) return 0;
    return ((current - prev) / prev) * 100;
  };

  const downloadCSV = () => {
    const data = kpiData[comparisonMode];
    let csv = 'TALHO CARNES - Relatório de KPIs\n';
    csv += `Período: ${comparisonMode}\n`;
    csv += `Atualizado: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n\n`;
    csv += 'RECEITA,Valor Atual,Valor Anterior,Variação %\n';
    csv += `Venda Bruta,${data.current.value},${data.current.prev},${calculateVariation(data.current.value, data.current.prev).toFixed(2)}\n`;
    csv += `Ecommerce,${data.ecommerce.value},${data.ecommerce.prev},${calculateVariation(data.ecommerce.value, data.ecommerce.prev).toFixed(2)}\n`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `talho-kpi-${comparisonMode}-${Date.now()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e1e0d9', borderRadius: '8px', padding: '2rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#0b0b0b', marginBottom: '0.5rem', textAlign: 'center' }}>Talho Carnes</h1>
            <p style={{ fontSize: '14px', color: '#52514e', marginBottom: '2rem', textAlign: 'center' }}>Dashboard financeiro</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#52514e', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input type="email" value={user} onChange={(e) => setUser(e.target.value)} placeholder="leo@talho.com.br" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e1e0d9', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#52514e', display: 'block', marginBottom: '0.5rem' }}>Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" style={{ width: '100%', padding: '0.75rem', border: '1px solid #e1e0d9', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              {loginError && <div style={{ fontSize: '13px', color: '#d03b3b', padding: '0.75rem', background: '#fcebeb', borderRadius: '6px' }}>{loginError}</div>}
              <button type="submit" style={{ background: '#533ab7', color: '#ffffff', border: 'none', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '1rem' }}>Entrar</button>
            </form>
            <div style={{ fontSize: '12px', color: '#898781', marginTop: '1.5rem', textAlign: 'center' }}>
              Usuários de teste:<br />leo@talho.com.br<br />mauricio@talho.com.br<br />sergio@talho.com.br
            </div>
          </div>
        </div>
      </div>
    );
  }

  const data = kpiData[comparisonMode];

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfb', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e1e0d9', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#0b0b0b', margin: '0 0 0.5rem 0' }}>Talho Carnes | Painel Financeiro</h1>
            <p style={{ fontSize: '13px', color: '#52514e', margin: 0 }}>Última atualização: 01/09/2026 às 17:32 | Dados de Jul/26</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', border: '1px solid #b4b2a9', background: 'transparent', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#52514e' }}>Sair</button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['YTD', 'MoM', 'YoY'].map((mode) => (
              <button key={mode} onClick={() => setComparisonMode(mode)} style={{ padding: '0.5rem 1rem', background: comparisonMode === mode ? '#533ab7' : 'transparent', color: comparisonMode === mode ? '#ffffff' : '#52514e', border: comparisonMode === mode ? 'none' : '1px solid #e1e0d9', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                {mode}
              </button>
            ))}
          </div>
          <button onClick={downloadCSV} style={{ padding: '0.5rem 1rem', border: '1px solid #b4b2a9', background: 'transparent', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#52514e' }}>↓ Exportar CSV</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
          <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ RECEITA</h2>
          </div>

          <MetricCard label="Venda Bruta" current={data.current.value} previous={data.current.prev} />
          <MetricCard label="Ecommerce" current={data.ecommerce.value} previous={data.ecommerce.prev} />
          <MetricCard label="% Ecom/Venda" current={data.ecomPercent.value} previous={data.ecomPercent.prev} isPercent={true} />
          <MetricCard label="Venda FDS" current={data.fdsSales.value} previous={data.fdsSales.prev} />
          <MetricCard label="% FDS/Venda" current={data.fdsPercent.value} previous={data.fdsPercent.prev} isPercent={true} />
          <MetricCard label="Venda Dia a Dia" current={data.dailySales.value} previous={data.dailySales.prev} />
          <MetricCard label="% Dia a Dia" current={data.dailyPercent.value} previous={data.dailyPercent.prev} isPercent={true} />

          <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '0.5rem' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ OPERACIONAL</h2>
          </div>

          <MetricCard label="Pedidos" current={data.orders.value} previous={data.orders.prev} isInteger={true} />
          <MetricCard label="Ticket Médio" current={data.ticketAvg.value} previous={data.ticketAvg.prev} />
          <MetricCard label="Pedidos/Dia" current={data.ordersPerDay.value} previous={data.ordersPerDay.prev} />
          <MetricCard label="Venda em kg" current={data.salesKg.value} previous={data.salesKg.prev} />
          <MetricCard label="Média kg/pedido" current={data.avgKgPerOrder.value} previous={data.avgKgPerOrder.prev} />

          <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '0.5rem' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ CAIXA</h2>
          </div>

          <MetricCard label="Entrada de Caixa" current={data.cashInflow.value} previous={data.cashInflow.prev} />
          <MetricCard label="Saída de Caixa" current={data.cashOutflow.value} previous={data.cashOutflow.prev} />
          <MetricCard label="Saldo Caixa" current={data.cashBalance.value} previous={data.cashBalance.prev} />

          <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '0.5rem' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ BALANÇO</h2>
          </div>

          <MetricCard label="Contas a Pagar" current={data.payableAccounts.value} previous={data.payableAccounts.prev} />
          <MetricCard label="Contas a Receber" current={data.receivableAccounts.value} previous={data.receivableAccounts.prev} />
          <MetricCard label="Banco + Cofre" current={data.bankBalance.value} previous={data.bankBalance.prev} />
          <MetricCard label="Estoque Carnes" current={data.stockMeat.value} previous={data.stockMeat.prev} />
          <MetricCard label="Estoque Outros" current={data.stockOther.value} previous={data.stockOther.prev} />
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #e1e0d9', paddingTop: '1.5rem' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', marginBottom: '1rem' }}>Composição do Caixa - Jul/26</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e1e0d9' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#52514e', fontWeight: '400' }}>Método de Pagamento</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: '#52514e', fontWeight: '400' }}>Jul/26</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: '#52514e', fontWeight: '400' }}>Jun/26</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem', color: '#52514e', fontWeight: '400' }}>Var %</th>
                </tr>
              </thead>
              <tbody>
                {[{ label: 'Boleto', key: 'boleto' }, { label: 'Cartão Crédito', key: 'creditCard' }, { label: 'Cartão Débito', key: 'debitCard' }, { label: 'Crédito em CC', key: 'creditInCC' }, { label: 'DANFE', key: 'danfe' }, { label: 'Dinheiro', key: 'cash' }].map((method, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e1e0d9' }}>
                    <td style={{ padding: '0.75rem', color: '#0b0b0b' }}>{method.label}</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem', color: '#0b0b0b' }}>R$ {caixaData['Jul/26'][method.key].toLocaleString('pt-BR')}</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem', color: '#0b0b0b' }}>R$ {caixaData['Jun/26'][method.key].toLocaleString('pt-BR')}</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem', color: calculateVariation(caixaData['Jul/26'][method.key], caixaData['Jun/26'][method.key]) >= 0 ? '#008300' : '#d03b3b' }}>
                      {calculateVariation(caixaData['Jul/26'][method.key], caixaData['Jun/26'][method.key]).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, current, previous, isPercent, isInteger, unit = 'currency' }) {
  const variation = ((current - previous) / previous) * 100;
  const isPositive = variation >= 0;

  let displayCurrent, displayPrevious;

  if (isPercent) {
    displayCurrent = (current * 100).toFixed(2) + '%';
    displayPrevious = (previous * 100).toFixed(2) + '%';
  } else if (isInteger) {
    displayCurrent = current.toLocaleString('pt-BR');
    displayPrevious = previous.toLocaleString('pt-BR');
  } else if (unit === 'kg') {
    displayCurrent = (current / 1000).toFixed(1) + ' kg';
    displayPrevious = (previous / 1000).toFixed(1) + ' kg';
  } else if (unit === 'number') {
    displayCurrent = current.toFixed(2);
    displayPrevious = previous.toFixed(2);
  } else {
    displayCurrent = 'R$ ' + (current / 1000).toFixed(0) + 'k';
    displayPrevious = 'R$ ' + (previous / 1000).toFixed(0) + 'k';
  }

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e1e0d9', borderRadius: '6px', padding: '1rem' }}>
      <p style={{ fontSize: '12px', color: '#52514e', margin: '0 0 0.75rem 0' }}>{label}</p>
      <p style={{ fontSize: '16px', fontWeight: '600', color: '#0b0b0b', margin: '0 0 0.5rem 0' }}>{displayCurrent}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '11px', color: '#898781', margin: 0 }}>Ant: {displayPrevious}</p>
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#ffffff', background: isPositive ? '#008300' : '#d03b3b', padding: '2px 6px', borderRadius: '4px' }}>
          {isPositive ? '↑' : '↓'} {Math.abs(variation).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
