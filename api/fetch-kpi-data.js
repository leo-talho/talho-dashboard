import { google } from 'googleapis';
import * as XLSX from 'xlsx';

const FILE_ID = '1dJtFM2_qzgFMzOUZG2ShQb-tfJAKve4I'; // Your Analytics.xlsx FILE_ID

export default async function handler(req, res) {
  try {
    // Parse service account credentials
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    
    // Create auth client
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    // Initialize Drive API
    const drive = google.drive({ version: 'v3', auth });

    // Download file from Google Drive
    const response = await drive.files.get(
      { fileId: FILE_ID, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    // Parse Excel file
    const workbook = XLSX.read(response.data, { type: 'array' });
    
    // Extract sheets
    const kpiSheet = XLSX.utils.sheet_to_json(workbook.Sheets["KPI's Dashboard"]);
    const caixaSheet = XLSX.utils.sheet_to_json(workbook.Sheets["CAIXA"]);

    // Format data into monthlyData structure
    const monthlyData = formatKPIData(kpiSheet, caixaSheet);

    res.status(200).json(monthlyData);
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    res.status(500).json({ error: 'Failed to fetch KPI data', details: error.message });
  }
}

function formatKPIData(kpiRows, caixaRows) {
  const formatted = {};

  // Process KPI rows
  kpiRows.forEach((row) => {
    // Your Excel structure: assume column "Mês" has date like "07/2026"
    // Adjust these column names to match your actual Excel
    const monthStr = row['Mês'] || row['Período']; // Try both column names
    if (!monthStr) return;

    const [month, year] = monthStr.split('/');
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (!formatted[key]) {
      formatted[key] = {
        current: {},
        previous: {},
        previousYear: {},
        ytd: {},
        ytdPreviousYear: {},
      };
    }

    // Map columns from Excel to data structure
    // ADJUST THESE COLUMN NAMES to match your Analytics.xlsx columns
    formatted[key].current = {
      value: parseFloat(row['Venda Bruta'] || 0),
      ecommerce: parseFloat(row['Ecommerce'] || 0),
      ecomPercent: parseFloat(row['% Ecom'] || 0) / 100,
      fdsSales: parseFloat(row['Venda FDS'] || 0),
      fdsPercent: parseFloat(row['% FDS'] || 0) / 100,
      dailySales: parseFloat(row['Venda Dia a Dia'] || 0),
      dailyPercent: parseFloat(row['% Dia a Dia'] || 0) / 100,
      orders: parseInt(row['Pedidos'] || 0),
      ticketAvg: parseFloat(row['Ticket Médio'] || 0),
      ordersPerDay: parseFloat(row['Pedidos/Dia'] || 0),
      salesKg: parseFloat(row['Venda em kg'] || 0),
      avgKgPerOrder: parseFloat(row['Média kg/pedido'] || 0),
      cashInflow: parseFloat(row['Entrada de Caixa'] || 0),
      cashOutflow: parseFloat(row['Saída de Caixa'] || 0),
      cashBalance: parseFloat(row['Saldo Caixa'] || 0),
      payableAccounts: parseFloat(row['Contas a Pagar'] || 0),
      receivableAccounts: parseFloat(row['Contas a Receber'] || 0),
      bankBalance: parseFloat(row['Banco + Cofre'] || 0),
      stockMeat: parseFloat(row['Estoque Carnes'] || 0),
      stockOther: parseFloat(row['Estoque Outros'] || 0),
    };
  });

  return formatted;
}
