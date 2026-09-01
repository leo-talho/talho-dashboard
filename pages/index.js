'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [comparisonMode, setComparisonMode] = useState('current');
  const [selectedMonth, setSelectedMonth] = useState('07'); // Jul
  const [selectedYear, setSelectedYear] = useState('2026');

  const validUsers = {
    'leo@talho.com.br': 'talho2026',
    'mauricio@talho.com.br': 'talho2026',
    'sergio@talho.com.br': 'talho2026',
  };

  // Generate all months from 2022 to 2028
  const generateMonthRange = () => {
    const months = [];
    for (let year = 2022; year <= 2028; year++) {
      for (let month = 1; month <= 12; month++) {
        months.push({
          key: `${year}-${String(month).padStart(2, '0')}`,
          year,
          month: String(month).padStart(2, '0'),
          label: `${String(month).padStart(2, '0')}/${year}`,
        });
      }
    }
    return months;
  };

  const allMonths = generateMonthRange();
  const years = Array.from({ length: 7 }, (_, i) => 2022 + i); // 2022-2028

  // Data structure: monthlyData['2026-07'] = { current: {...}, previous: {...}, previousYear: {...}, ytd: {...}, ytdPreviousYear: {...} }
  const monthlyData = {
    '2026-07': {
      current: {
        value: 988126.63, ecommerce: 105240.00, ecomPercent: 0.1065, fdsSales: 575000.00, fdsPercent: 0.582,
        dailySales: 413126.00, dailyPercent: 0.418, orders: 2923, ticketAvg: 338.05, ordersPerDay: 94.29,
        salesKg: 7720.65, avgKgPerOrder: 2.64, cashInflow: 913888.39, cashOutflow: 913888.39, cashBalance: 0.00,
        payableAccounts: 818313.27, receivableAccounts: 72477.85, bankBalance: 768100.32, stockMeat: 2303292.33, stockOther: 1048662.60,
      },
      previous: {
        value: 1087621.94, ecommerce: 98500.00, ecomPercent: 0.0904, fdsSales: 650000.00, fdsPercent: 0.597,
        dailySales: 437621.94, dailyPercent: 0.403, orders: 3097, ticketAvg: 351.19, ordersPerDay: 103.23,
        salesKg: 8409.14, avgKgPerOrder: 2.72, cashInflow: 1103370.12, cashOutflow: 1103370.12, cashBalance: 0.00,
        payableAccounts: 813977.97, receivableAccounts: 49773.37, bankBalance: 850000.00, stockMeat: 2200000.00, stockOther: 1000000.00,
      },
      previousYear: {
        value: 798048.91, ecommerce: 45000.00, ecomPercent: 0.0564, fdsSales: 480000.00, fdsPercent: 0.601,
        dailySales: 318048.91, dailyPercent: 0.399, orders: 2400, ticketAvg: 332.53, ordersPerDay: 77.42,
        salesKg: 6800.00, avgKgPerOrder: 2.83, cashInflow: 790000.00, cashOutflow: 800000.00, cashBalance: -10000.00,
        payableAccounts: 700000.00, receivableAccounts: 80000.00, bankBalance: 650000.00, stockMeat: 2100000.00, stockOther: 900000.00,
      },
      ytd: {
        value: 6717703.99, ecommerce: 592709.82, ecomPercent: 0.088231, fdsSales: 3958186.28, fdsPercent: 0.589217,
        dailySales: 2759517.71, dailyPercent: 0.410783, orders: 19392, ticketAvg: 2422.70, ordersPerDay: 643.59,
        salesKg: 52818.07, avgKgPerOrder: 19.06, cashInflow: 6828941.24, cashOutflow: 7086436.99, cashBalance: -257495.75,
        payableAccounts: 5412597.70, receivableAccounts: 557643.93, bankBalance: 768100.32, stockMeat: 2303292.33, stockOther: 1048662.60,
      },
      ytdPreviousYear: {
        value: 5805210.83, ecommerce: 356978.97, ecomPercent: 0.061493, fdsSales: 3486463.55, fdsPercent: 0.600575,
        dailySales: 2318747.28, dailyPercent: 0.399425, orders: 16622, ticketAvg: 2453.64, ordersPerDay: 552.27,
        salesKg: 47388.95, avgKgPerOrder: 20.05, cashInflow: 5879982.07, cashOutflow: 5979764.60, cashBalance: -99782.53,
        payableAccounts: 4364920.82, receivableAccounts: 666266.10, bankBalance: 1986545.06, stockMeat: 2057582.40, stockOther: 820470.22,
      },
    },
    '2026-06': {
      current: {
        value: 1087621.94, ecommerce: 98500.00, ecomPercent: 0.0904, fdsSales: 650000.00, fdsPercent: 0.597,
        dailySales: 437621.94, dailyPercent: 0.403, orders: 3097, ticketAvg: 351.19, ordersPerDay: 103.23,
        salesKg: 8409.14, avgKgPerOrder: 2.72, cashInflow: 1103370.12, cashOutflow: 1103370.12, cashBalance: 0.00,
        payableAccounts: 813977.97, receivableAccounts: 49773.37, bankBalance: 850000.00, stockMeat: 2200000.00, stockOther: 1000000.00,
      },
      previous: {
        value: 1012277.69, ecommerce: 95000.00, ecomPercent: 0.0938, fdsSales: 600000.00, fdsPercent: 0.593,
        dailySales: 412277.69, dailyPercent: 0.407, orders: 2864, ticketAvg: 353.45, ordersPerDay: 95.47,
        salesKg: 7865.65, avgKgPerOrder: 2.75, cashInflow: 1050000.00, cashOutflow: 1050000.00, cashBalance: 0.00,
        payableAccounts: 800000.00, receivableAccounts: 60000.00, bankBalance: 800000.00, stockMeat: 2150000.00, stockOther: 950000.00,
      },
      previousYear: {
        value: 900000.00, ecommerce: 50000.00, ecomPercent: 0.0556, fdsSales: 500000.00, fdsPercent: 0.556,
        dailySales: 400000.00, dailyPercent: 0.444, orders: 2500, ticketAvg: 360.00, ordersPerDay: 83.33,
        salesKg: 7000.00, avgKgPerOrder: 2.80, cashInflow: 850000.00, cashOutflow: 850000.00, cashBalance: 0.00,
        payableAccounts: 750000.00, receivableAccounts: 70000.00, bankBalance: 700000.00, stockMeat: 2050000.00, stockOther: 900000.00,
      },
    },
    // Add more months here as data becomes available: '2026-08': {...}, '2026-09': {...}, etc.
  };

  const caixaData = {
    '2026-07': {
      boleto: 45793.72, creditCard: 579178.62, debitCard: 60954.84, creditInCC: 180000.00, danfe: 48000.00, cash: 5000.00,
    },
    '2026-06': {
      boleto: 65782.09, creditCard: 711070.16, debitCard: 84574.99, creditInCC: 189000.00, danfe: 53000.00, cash: 6000.00,
    },
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

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

  const getSelectedData = () => {
    const key = `${selectedYear}-${selectedMonth}`;
    const monthData = monthlyData[key];
    
    if (!monthData) return null;
    
    if (comparisonMode === 'current') {
      return { current: monthData.current, previous: monthData.previous, label: 'MoM' };
    } else if (comparisonMode === 'yoy') {
      return { current: monthData.current, previous: monthData.previousYear, label: 'YoY' };
    } else if (comparisonMode === 'ytd') {
      return { current: monthData.ytd, previous: monthData.ytdPreviousYear, label: 'YTD' };
    }
  };

  const downloadCSV = () => {
    const data = getSelectedData();
    if (!data) return;
    
    let csv = 'TALHO CARNES - Relatório de KPIs\n';
    csv += `Período: ${selectedMonth}/${selectedYear}\n`;
    csv += `Atualizado: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n\n`;
    csv += 'RECEITA,Valor Atual,Valor Anterior,Variação %\n';
    csv += `Venda Bruta,${data.current.value},${data.previous.value},${calculateVariation(data.current.value, data.previous.value).toFixed(2)}\n`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `talho-kpi-${selectedMonth}-${selectedYear}-${Date.now()}.csv`);
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
          </div>
        </div>
      </div>
    );
  }

  const data = getSelectedData();

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfb', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e1e0d9', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#0b0b0b', margin: '0 0 0.5rem 0' }}>Talho Carnes | Painel Financeiro</h1>
            <p style={{ fontSize: '13px', color: '#52514e', margin: 0 }}>Dados de {selectedMonth}/{selectedYear}</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', border: '1px solid #b4b2a9', background: 'transparent', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#52514e' }}>Sair</button>
        </div>

        {/* Month/Year Selector */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', color: '#52514e', fontWeight: '500' }}>Mês:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #e1e0d9', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, '0');
                return <option key={month} value={month}>{month} - {monthNames[i]}</option>;
              })}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', color: '#52514e', fontWeight: '500' }}>Ano:</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #e1e0d9', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setComparisonMode('current')} style={{ padding: '0.5rem 1rem', background: comparisonMode === 'current' ? '#533ab7' : 'transparent', color: comparisonMode === 'current' ? '#ffffff' : '#52514e', border: comparisonMode === 'current' ? 'none' : '1px solid #e1e0d9', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              MoM
            </button>
            <button onClick={() => setComparisonMode('yoy')} style={{ padding: '0.5rem 1rem', background: comparisonMode === 'yoy' ? '#533ab7' : 'transparent', color: comparisonMode === 'yoy' ? '#ffffff' : '#52514e', border: comparisonMode === 'yoy' ? 'none' : '1px solid #e1e0d9', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              YoY
            </button>
            <button onClick={() => setComparisonMode('ytd')} style={{ padding: '0.5rem 1rem', background: comparisonMode === 'ytd' ? '#533ab7' : 'transparent', color: comparisonMode === 'ytd' ? '#ffffff' : '#52514e', border: comparisonMode === 'ytd' ? 'none' : '1px solid #e1e0d9', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              YTD
            </button>
          </div>

          {data && <button onClick={downloadCSV} style={{ padding: '0.5rem 1rem', border: '1px solid #b4b2a9', background: 'transparent', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#52514e', marginLeft: 'auto' }}>↓ Exportar CSV</button>}
        </div>

        {/* Data Not Available Message */}
        {!data && (
          <div style={{ background: '#fef3e2', border: '1px solid #f0c959', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#8b6f47', margin: 0 }}>📊 Dados não disponíveis para {monthNames[parseInt(selectedMonth) - 1]}/{selectedYear}</p>
            <p style={{ fontSize: '12px', color: '#a88a52', margin: '0.5rem 0 0 0' }}>Selecione outro período ou aguarde a atualização dos dados.</p>
          </div>
        )}

        {/* KPI Grid */}
        {data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ RECEITA</h2>
            </div>

            <MetricCard label="Venda Bruta" current={data.current.value} previous={data.previous.value} />
            <MetricCard label="Ecommerce" current={data.current.ecommerce} previous={data.previous.ecommerce} />
            <MetricCard label="% Ecom/Venda" current={data.current.ecomPercent} previous={data.previous.ecomPercent} isPercent={true} />
            <MetricCard label="Venda FDS" current={data.current.fdsSales} previous={data.previous.fdsSales} />
            <MetricCard label="% FDS/Venda" current={data.current.fdsPercent} previous={data.previous.fdsPercent} isPercent={true} />
            <MetricCard label="Venda Dia a Dia" current={data.current.dailySales} previous={data.previous.dailySales} />
            <MetricCard label="% Dia a Dia" current={data.current.dailyPercent} previous={data.previous.dailyPercent} isPercent={true} />

            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '0.5rem' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ OPERACIONAL</h2>
            </div>

            <MetricCard label="Pedidos" current={data.current.orders} previous={data.previous.orders} isInteger={true} />
            <MetricCard label="Ticket Médio" current={data.current.ticketAvg} previous={data.previous.ticketAvg} unit="currency" />
            <MetricCard label="Pedidos/Dia" current={data.current.ordersPerDay} previous={data.previous.ordersPerDay} unit="number" />
            <MetricCard label="Venda em kg" current={data.current.salesKg} previous={data.previous.salesKg} unit="kg" />
            <MetricCard label="Média kg/pedido" current={data.current.avgKgPerOrder} previous={data.previous.avgKgPerOrder} unit="number" />

            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '0.5rem' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ CAIXA</h2>
            </div>

            <MetricCard label="Entrada de Caixa" current={data.current.cashInflow} previous={data.previous.cashInflow} />
            <MetricCard label="Saída de Caixa" current={data.current.cashOutflow} previous={data.previous.cashOutflow} />
            <MetricCard label="Saldo Caixa" current={data.current.cashBalance} previous={data.previous.cashBalance} />

            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '0.5rem' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ BALANÇO</h2>
            </div>

            <MetricCard label="Contas a Pagar" current={data.current.payableAccounts} previous={data.previous.payableAccounts} />
            <MetricCard label="Contas a Receber" current={data.current.receivableAccounts} previous={data.previous.receivableAccounts} />
            <MetricCard label="Banco + Cofre" current={data.current.bankBalance} previous={data.previous.bankBalance} />
            <MetricCard label="Estoque Carnes" current={data.current.stockMeat} previous={data.previous.stockMeat} />
            <MetricCard label="Estoque Outros" current={data.current.stockOther} previous={data.previous.stockOther} />
          </div>
        )}
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
