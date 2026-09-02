// pages/api/fetch-kpi-data.js
// Reads Analytics.xlsx (sheet "Dados") from Google Drive and returns one entry per month
// with current / previous month / same month last year / YTD / YTD last year.

import { google } from 'googleapis';
import * as XLSX from 'xlsx';

const FILE_ID = '1dJtFM2_qzgFMzOUZG2ShQb-tfJAKve4I';
const SHEET_NAME = 'Dados';

// Accepts English AND Portuguese abbreviations, e.g. "Mar-23", "mar/23", "fev-24"
const MONTHS = {
  jan: '01', feb: '02', fev: '02', mar: '03', apr: '04', abr: '04', may: '05', mai: '05',
  jun: '06', jul: '07', aug: '08', ago: '08', sep: '09', set: '09', oct: '10', out: '10',
  nov: '11', dec: '12', dez: '12',
};

// ---------- helpers ----------

// Turns whatever is in the "Mês" cell (Date, Excel serial number, or text) into "YYYY-MM"
function toMonthKey(v) {
  if (v === null || v === undefined || v === '') return null;

  if (v instanceof Date) {
    if (isNaN(v.getTime())) return null;
    return `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}`;
  }

  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    if (!d) return null;
    return `${d.y}-${String(d.m).padStart(2, '0')}`;
  }

  const s = String(v).trim().toLowerCase();
  const m = s.match(/^([a-zç]{3})[a-zç]*[\s\-\/]*(\d{2,4})$/);
  if (!m) return null;
  const mm = MONTHS[m[1]];
  if (!mm) return null;
  const yy = m[2].length === 2 ? `20${m[2]}` : m[2];
  return `${yy}-${mm}`;
}

// Numbers come as numbers from XLSX; handle stray text like "1.234,56" or "-" just in case
function num(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  if (v === null || v === undefined) return 0;
  const s = String(v).trim();
  if (s === '' || s === '-') return 0;
  const cleaned = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

const ratio = (a, b) => (b > 0 ? a / b : 0);

// Metrics from one row of "Dados" (column names EXACTLY as in the sheet, trimmed)
function rowToMetrics(row) {
  const value = num(row['Venda Bruta']);
  const ecommerce = num(row['Ecomerce']); // sheet spells it "Ecomerce"
  const fdsSales = num(row['Vendas "FDS"']);
  const dailySales = num(row['Vendas "Dia a Dia"']);
  const orders = num(row['Pedidos No Mês']);
  const days = num(row['Dias/mês']);
  const salesKg = num(row['Venda em kg no mês']);
  const cashInflow = num(row['Entrada de Caixa']);
  const cashOutflow = num(row['Saída de Caixa']);

  return {
    value,
    ecommerce,
    ecomPercent: ratio(ecommerce, value),
    fdsSales,
    fdsPercent: ratio(fdsSales, value),
    dailySales,
    dailyPercent: ratio(dailySales, value),
    orders,
    days,
    ticketAvg: num(row['Ticket Médio']) || ratio(value, orders),
    ordersPerDay: num(row['Pedidos por Dia']) || ratio(orders, days),
    salesKg,
    avgKgPerOrder: num(row['Média de kg por pedido']) || ratio(salesKg, orders),
    cashInflow,
    cashOutflow,
    cashBalance: cashInflow - cashOutflow,
    payableAccounts: num(row['Ctas à Pagar']),
    receivableAccounts: num(row['Ctas à Receber']),
    bankBalance: num(row['Sdo Itaú + Cofre Último dia do mês']),
    stockMeat: num(row['Estoque Carnes']),
    stockOther: num(row['Estoque Não Carnes']),
  };
}

// YTD = Jan..month of a given year. Flows are summed, ratios recomputed, balances = last month.
function buildYtd(months, year, uptoMonth) {
  const keys = Object.keys(months)
    .filter((k) => k.startsWith(`${year}-`) && k.slice(5) <= uptoMonth)
    .sort();
  if (keys.length === 0) return null;

  const sum = (f) => keys.reduce((acc, k) => acc + (months[k][f] || 0), 0);
  const last = months[keys[keys.length - 1]];

  const value = sum('value');
  const ecommerce = sum('ecommerce');
  const fdsSales = sum('fdsSales');
  const dailySales = sum('dailySales');
  const orders = sum('orders');
  const days = sum('days');
  const salesKg = sum('salesKg');
  const cashInflow = sum('cashInflow');
  const cashOutflow = sum('cashOutflow');

  return {
    value,
    ecommerce,
    ecomPercent: ratio(ecommerce, value),
    fdsSales,
    fdsPercent: ratio(fdsSales, value),
    dailySales,
    dailyPercent: ratio(dailySales, value),
    orders,
    days,
    ticketAvg: ratio(value, orders),
    ordersPerDay: ratio(orders, days),
    salesKg,
    avgKgPerOrder: ratio(salesKg, orders),
    cashInflow,
    cashOutflow,
    cashBalance: cashInflow - cashOutflow,
    payableAccounts: last.payableAccounts,
    receivableAccounts: last.receivableAccounts,
    bankBalance: last.bankBalance,
    stockMeat: last.stockMeat,
    stockOther: last.stockOther,
    monthsIncluded: keys.length,
  };
}

// ---------- handler ----------

export default async function handler(req, res) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT env var is missing in Vercel');
    }
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const drive = google.drive({ version: 'v3', auth });

    // 1) metadata: tells us if it's a real .xlsx or a Google Sheet, and when it last changed
    const meta = await drive.files.get({
      fileId: FILE_ID,
      fields: 'name,mimeType,modifiedTime',
      supportsAllDrives: true,
    });
    const { name, mimeType, modifiedTime } = meta.data;

    // 2) download bytes (export if Drive converted it to a Google Sheet)
    let fileResp;
    if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      fileResp = await drive.files.export(
        { fileId: FILE_ID, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { responseType: 'arraybuffer' }
      );
    } else {
      fileResp = await drive.files.get(
        { fileId: FILE_ID, alt: 'media', supportsAllDrives: true },
        { responseType: 'arraybuffer' }
      );
    }

    // 3) parse workbook
    const workbook = XLSX.read(Buffer.from(fileResp.data), { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames.find((n) => n.trim() === SHEET_NAME);
    const sheet = sheetName ? workbook.Sheets[sheetName] : null;

    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    // trim header names ("Vendas \"FDS\" " has a trailing space in the sheet)
    const rows = rawRows.map((r) =>
      Object.fromEntries(Object.entries(r).map(([k, v]) => [String(k).trim(), v]))
    );

    // 4) one entry per month
    const months = {};
    const skipped = [];
    for (const row of rows) {
      const key = toMonthKey(row['Mês']);
      if (!key) {
        if (row['Mês'] !== null) skipped.push(String(row['Mês']));
        continue;
      }
      const m = rowToMetrics(row);
      if (m.value === 0 && m.orders === 0) continue; // future/empty months (Aug-26 onwards)
      months[key] = m;
    }

    // 5) derive comparisons
    const result = {};
    for (const key of Object.keys(months).sort()) {
      const [y, m] = key.split('-');
      const prevKey = m === '01' ? `${Number(y) - 1}-12` : `${y}-${String(Number(m) - 1).padStart(2, '0')}`;
      const prevYearKey = `${Number(y) - 1}-${m}`;
      result[key] = {
        current: months[key],
        previous: months[prevKey] || null,
        previousYear: months[prevYearKey] || null,
        ytd: buildYtd(months, y, m),
        ytdPreviousYear: buildYtd(months, String(Number(y) - 1), m),
      };
    }

    const availableKeys = Object.keys(result).sort();

    // cache 5 min at the edge so Google Drive isn't hit on every page load
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    res.status(200).json({
      months: result,
      meta: {
        fileName: name,
        mimeType,
        modifiedTime,
        rowsRead: rows.length,
        monthsFound: availableKeys.length,
        firstMonth: availableKeys[0] || null,
        lastMonth: availableKeys[availableKeys.length - 1] || null,
        skippedMesValues: skipped.slice(0, 10),
        headers: rows.length ? Object.keys(rows[0]) : [],
      },
    });
  } catch (error) {
    console.error('fetch-kpi-data error:', error);
    res.status(500).json({ error: 'Failed to fetch KPI data', details: error.message });
  }
}
