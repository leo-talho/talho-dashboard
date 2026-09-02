// pages/index.js
import { useState, useEffect } from 'react';

const VALID_USERS = {
  'leo@talho.com.br': 'talho2026',
  'mauricio@talho.com.br': 'talho2026',
  'sergio@talho.com.br': 'talho2026',
};

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const YEARS = Array.from({ length: 7 }, (_, i) => String(2022 + i)); // 2022–2028

// One list drives both the cards and the CSV export
const SECTIONS = [
  {
    title: 'RECEITA',
    metrics: [
      { key: 'value', label: 'Venda Bruta', unit: 'currency' },
      { key: 'ecommerce', label: 'Ecommerce', unit: 'currency' },
      { key: 'ecomPercent', label: '% Ecom/Venda', unit: 'percent' },
      { key: 'fdsSales', label: 'Venda FDS', unit: 'currency' },
      { key: 'fdsPercent', label: '% FDS/Venda', unit: 'percent' },
      { key: 'dailySales', label: 'Venda Dia a Dia', unit: 'currency' },
      { key: 'dailyPercent', label: '% Dia a Dia/Venda', unit: 'percent' },
    ],
  },
  {
    title: 'OPERACIONAL',
    metrics: [
      { key: 'orders', label: 'Pedidos', unit: 'integer' },
      { key: 'ticketAvg', label: 'Ticket Médio', unit: 'currencyFull' },
      { key: 'ordersPerDay', label: 'Pedidos/Dia', unit: 'number' },
      { key: 'salesKg', label: 'Venda em kg', unit: 'kg' },
      { key: 'avgKgPerOrder', label: 'Média kg/pedido', unit: 'number' },
    ],
  },
  {
    title: 'CAIXA',
    metrics: [
      { key: 'cashInflow', label: 'Entrada de Caixa', unit: 'currency' },
      { key: 'cashOutflow', label: 'Saída de Caixa', unit: 'currency' },
      { key: 'cashBalance', label: 'Saldo Caixa', unit: 'currency' },
    ],
  },
  {
    title: 'BALANÇO',
    metrics: [
      { key: 'payableAccounts', label: 'Contas a Pagar', unit: 'currency' },
      { key: 'receivableAccounts', label: 'Contas a Receber', unit: 'currency' },
      { key: 'bankBalance', label: 'Banco + Cofre', unit: 'currency' },
      { key: 'stockMeat', label: 'Estoque Carnes', unit: 'currency' },
      { key: 'stockOther', label: 'Estoque Não Carnes', unit: 'currency' },
    ],
  },
];

const MODES = {
  mom: { label: 'MoM', prevLabel: 'Mês ant.' },
  yoy: { label: 'YoY', prevLabel: 'Mesmo mês ano ant.' },
  ytd: { label: 'YTD', prevLabel: 'YTD ano ant.' },
};

function fmt(v, unit) {
  if (v === null || v === undefined || isNaN(v)) return '—';
  switch (unit) {
    case 'percent':
      return (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
    case 'integer':
      return Math.round(v).toLocaleString('pt-BR');
    case 'number':
      return v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    case 'kg':
      return Math.round(v).toLocaleString('pt-BR') + ' kg';
    case 'currencyFull':
      return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case 'currency':
    default:
      if (Math.abs(v) >= 1_000_000) return 'R$ ' + (v / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + 'M';
      return 'R$ ' + Math.round(v / 1000).toLocaleString('pt-BR') + 'k';
  }
}

function variationPct(current, previous) {
  if (previous === null || previous === undefined || previous === 0 || current === null || current === undefined) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [mode, setMode] = useState('mom');
  const [selectedMonth, setSelectedMonth] = useState('07');
  const [selectedYear, setSelectedYear] = useState('2026');

  const [monthlyData, setMonthlyData] = useState({});
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Load data from the API once the user is logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setFetchError('');
      try {
        const res = await fetch('/api/fetch-kpi-data');
        const json = await res.json();
        if (!res.ok) throw new Error(json.details || json.error || `HTTP ${res.status}`);
        if (cancelled) return;
        const months = json.months || {};
        setMonthlyData(months);
        setMeta(json.meta || null);
        // default to the most recent month that has data
        const keys = Object.keys(months).sort();
        if (keys.length) {
          const [y, m] = keys[keys.length - 1].split('-');
          setSelectedYear(y);
          setSelectedMonth(m);
        }
      } catch (e) {
        if (!cancelled) setFetchError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (VALID_USERS[user] && VALID_USERS[user] === password) {
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
    setMonthlyData({});
    setMeta(null);
  };

  const key = `${selectedYear}-${selectedMonth}`;
  const entry = monthlyData[key];

  let data = null;
  if (entry) {
    if (mode === 'mom') data = { current: entry.current, previous: entry.previous };
    else if (mode === 'yoy') data = { current: entry.current, previous: entry.previousYear };
    else if (entry.ytd) data = { current: entry.ytd, previous: entry.ytdPreviousYear };
  }

  const availableKeys = Object.keys(monthlyData).sort();
  const rangeLabel = availableKeys.length
    ? `${availableKeys[0].split('-').reverse().join('/')} – ${availableKeys[availableKeys.length - 1].split('-').reverse().join('/')}`
    : '';

  const downloadCSV = () => {
    if (!data) return;
    const lines = [
      'TALHO CARNES - Relatório de KPIs',
      `Período;${selectedMonth}/${selectedYear};Comparação;${MODES[mode].label}`,
      `Gerado em;${new Date().toLocaleString('pt-BR')}`,
      '',
      'Seção;KPI;Valor Atual;Valor Anterior;Variação %',
    ];
    SECTIONS.forEach((s) => {
      s.metrics.forEach((m) => {
        const cur = data.current?.[m.key];
        const prev = data.previous?.[m.key];
        const v = variationPct(cur, prev);
        lines.push(`${s.title};${m.label};${cur ?? ''};${prev ?? ''};${v === null ? '' : v.toFixed(2)}`);
      });
    });
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `talho-kpi-${selectedYear}-${selectedMonth}-${mode}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // ---------- login ----------
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

  // ---------- dashboard ----------
  const btn = (active) => ({
    padding: '0.5rem 1rem',
    background: active ? '#533ab7' : 'transparent',
    color: active ? '#ffffff' : '#52514e',
    border: active ? '1px solid #533ab7' : '1px solid #e1e0d9',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  });
  const select = { padding: '0.5rem', border: '1px solid #e1e0d9', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', background: '#fff' };

  const updatedAt = meta?.modifiedTime ? new Date(meta.modifiedTime).toLocaleString('pt-BR') : null;

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfb', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e1e0d9', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#0b0b0b', margin: '0 0 0.5rem 0' }}>Talho Carnes | Painel Financeiro</h1>
            <p style={{ fontSize: '13px', color: '#52514e', margin: 0 }}>
              {updatedAt ? `Analytics.xlsx atualizado em ${updatedAt}` : 'Fonte: Analytics.xlsx (Google Drive)'}
              {rangeLabel ? ` | Dados disponíveis: ${rangeLabel}` : ''}
            </p>
          </div>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', border: '1px solid #b4b2a9', background: 'transparent', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#52514e' }}>Sair</button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', color: '#52514e', fontWeight: '500' }}>Mês:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={select}>
              {MONTH_NAMES.map((name, i) => {
                const m = String(i + 1).padStart(2, '0');
                return <option key={m} value={m}>{m} - {name}</option>;
              })}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', color: '#52514e', fontWeight: '500' }}>Ano:</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={select}>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {Object.entries(MODES).map(([k, v]) => (
              <button key={k} onClick={() => setMode(k)} style={btn(mode === k)}>{v.label}</button>
            ))}
          </div>
          {data && (
            <button onClick={downloadCSV} style={{ padding: '0.5rem 1rem', border: '1px solid #b4b2a9', background: 'transparent', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#52514e', marginLeft: 'auto' }}>↓ Exportar CSV</button>
          )}
        </div>

        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#52514e', fontSize: '14px' }}>Carregando dados do Analytics.xlsx…</div>
        )}

        {!loading && fetchError && (
          <div style={{ background: '#fcebeb', border: '1px solid #e8a0a0', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '14px', color: '#8b2f2f', margin: 0, fontWeight: '500' }}>Não foi possível carregar os dados</p>
            <p style={{ fontSize: '12px', color: '#8b2f2f', margin: '0.5rem 0 0 0', fontFamily: 'monospace' }}>{fetchError}</p>
          </div>
        )}

        {!loading && !fetchError && !data && (
          <div style={{ background: '#fef3e2', border: '1px solid #f0c959', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#8b6f47', margin: 0 }}>Sem dados para {MONTH_NAMES[parseInt(selectedMonth, 10) - 1]}/{selectedYear}</p>
            <p style={{ fontSize: '12px', color: '#a88a52', margin: '0.5rem 0 0 0' }}>
              {rangeLabel ? `Períodos disponíveis: ${rangeLabel}` : 'Selecione outro período.'}
            </p>
          </div>
        )}

        {!loading && data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
            {SECTIONS.map((section, si) => (
              <SectionBlock key={section.title} first={si === 0} title={section.title}>
                {section.metrics.map((m) => (
                  <MetricCard
                    key={m.key}
                    label={m.label}
                    unit={m.unit}
                    current={data.current?.[m.key]}
                    previous={data.previous ? data.previous[m.key] : null}
                    prevLabel={MODES[mode].prevLabel}
                  />
                ))}
              </SectionBlock>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Section header spanning the full grid width, followed by its cards
function SectionBlock({ title, first, children }) {
  return (
    <>
      <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #e1e0d9', paddingTop: first ? 0 : '1rem', paddingBottom: '1rem', marginTop: first ? 0 : '0.5rem' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#0b0b0b', margin: 0 }}>▌ {title}</h2>
      </div>
      {children}
    </>
  );
}

function MetricCard({ label, current, previous, unit, prevLabel }) {
  const v = variationPct(current, previous);
  const positive = v !== null && v >= 0;

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e1e0d9', borderRadius: '6px', padding: '1rem' }}>
      <p style={{ fontSize: '12px', color: '#52514e', margin: '0 0 0.75rem 0' }}>{label}</p>
      <p style={{ fontSize: '18px', fontWeight: '600', color: '#0b0b0b', margin: '0 0 0.5rem 0' }}>{fmt(current, unit)}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
        <p style={{ fontSize: '11px', color: '#898781', margin: 0 }}>{prevLabel}: {fmt(previous, unit)}</p>
        {v === null ? (
          <span style={{ fontSize: '12px', color: '#898781' }}>—</span>
        ) : (
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#ffffff', background: positive ? '#008300' : '#d03b3b', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
            {positive ? '↑' : '↓'} {Math.abs(v).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
