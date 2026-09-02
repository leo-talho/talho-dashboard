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
  const [monthlyData, setMonthlyData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIData();
}, []);

async function fetchKPIData() {
  try {
    const response = await fetch('/api/fetch-kpi-data');
    const data = await response.json();
    setMonthlyData(data);
    setLoading(false);
  } catch (error) {
    console.error('Failed to load KPI data:', error);
    setLoading(false);
  }
}
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
        {loading && <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando dados...</div>}

{!loading && !data && (
  <div style={{ background: '#fef3e2', border: '1px solid #f0c959', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
    <p style={{ fontSize: '14px', color: '#8b6f47', margin: 0 }}>📊 Dados não disponíveis para {monthNames[parseInt(selectedMonth) - 1]}/{selectedYear}</p>
  </div>
)}

{!loading && data && (
  <div style={{ display: 'grid', ...

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
