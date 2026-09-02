import { google } from 'googleapis';
import * as XLSX from 'xlsx';

const FILE_ID = '1dJtFM2_qzgFMzOUZG2ShQb-tfJAKve4I';

const monthMap = {
  'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04', 'mai': '05', 'jun': '06',
  'jul': '07', 'ago': '08', 'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
};

export default async function handler(req, res) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.get(
      { fileId: FILE_ID, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const workbook = XLSX.read(response.data, { type: 'array' });
    const dadosSheet = XLSX.utils.sheet_to_json(workbook.Sheets["Dados"]);

    const monthlyData = formatKPIData(dadosSheet);

    res.status(200).json(monthlyData);
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    res.status(500).json({ error: 'Failed to fetch KPI data', details: error.message });
  }
}

function formatKPIData(dadosRows) {
  const formatted = {};

  dadosRows.forEach((row) => {
    const mesStr = row['Mês'];
    if (!mesStr) return;

    // Parse date format: "jan-24" → "2024-01"
    const parts = mesStr.toLowerCase().split('-');
    if (parts.length !== 2) return;
    
    const monthStr = parts[0];
    const yearStr = parts[1];
    const month = monthMap[monthStr];
    const year = '20' + yearStr;
    const key = `${year}-${month}`;

    if (!formatted[key]) {
      formatted[key] = {
        current: {},
        previous: {},
        previousYear: {},
      };
    }

    // Map columns from "Dados" sheet
    const vendaBruta = parseFloat(row['Venda Bruta'] || 0);
    const ecommerce = parseFloat(row['Ecommerce'] || 0);
    const vendaFDS = parseFloat(row['Vendas "FDS"'] || 0);
    const pedidosMes = parseInt(row['Pedidos por Mês'] || 0);

    formatted[key].current = {
      value: vendaBruta,
      ecommerce: ecommerce,
      ecomPercent: vendaBruta > 0 ? ecommerce / vendaBruta : 0,
      fdsSales: vendaFDS,
      fdsPercent: vendaBruta > 0 ? vendaFDS / vendaBruta : 0,
      dailySales: vendaBruta - vendaFDS,
      dailyPercent: vendaBruta > 0 ? (vendaBruta - vendaFDS) / vendaBruta : 0,
      orders: pedidosMes,
      ticketAvg: parseFloat(row['Ticket Médio'] || 0),
      ordersPerDay: parseFloat(row['Pedidos por Dia'] || 0),
      salesKg: parseFloat(row['Venda em kg'] || 0),
      avgKgPerOrder: parseFloat(row['Média kg/pedido'] || 0),
      cashInflow: parseFloat(row['Entrada de Caixa'] || 0),
      cashOutflow: parseFloat(row['Saída de Caixa'] || 0),
      cashBalance: parseFloat(row['SALDO CAIXA'] || 0),
      payableAccounts: parseFloat(row['Contas a Pagar'] || 0),
      receivableAccounts: parseFloat(row['Contas a Receber'] || 0),
      bankBalance: parseFloat(row['Banco + Cofre'] || 0),
      stockMeat: parseFloat(row['Estoque Carnes'] || 0),
      stockOther: parseFloat(row['Estoque Não Carnes'] || 0),
    };
  });

  return formatted;
}
