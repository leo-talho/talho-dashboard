import { google } from 'googleapis';
import * as XLSX from 'xlsx';

const FILE_ID = '1dJtFM2_qzgFMzOUZG2ShQb-tfJAKve4I';

const monthMap = {
  'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
  'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
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
    console.log('Total rows read:', dadosSheet.length);
    console.log('First 5 rows:', dadosSheet.slice(0, 5));

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

    // Map columns from "Dados" sheet - using EXACT column names
    const vendaBruta = parseFloat(row['Venda Bruta'] || 0);
    const ecommerce = parseFloat(row['Ecomerce'] || 0); // Note: "Ecomerce" not "Ecommerce"
    const vendaFDS = parseFloat(row['Vendas "FDS"'] || 0);
    const vendaDiaADia = parseFloat(row['Vendas "Dia a Dia"'] || 0);
    const pedidosMes = parseInt(row['Pedidos No Mês'] || 0);
    const entradaCaixa = parseFloat(row['Entrada de Caixa'] || 0);
    const saidaCaixa = parseFloat(row['Saída de Caixa'] || 0);

    formatted[key].current = {
      value: vendaBruta,
      ecommerce: ecommerce,
      ecomPercent: vendaBruta > 0 ? ecommerce / vendaBruta : 0,
      fdsSales: vendaFDS,
      fdsPercent: vendaBruta > 0 ? vendaFDS / vendaBruta : 0,
      dailySales: vendaDiaADia,
      dailyPercent: vendaBruta > 0 ? vendaDiaADia / vendaBruta : 0,
      orders: pedidosMes,
      ticketAvg: parseFloat(row['Ticket Médio'] || 0),
      ordersPerDay: parseFloat(row['Pedidos por Dia'] || 0),
      salesKg: parseFloat(row['Venda em kg no mês'] || 0),
      avgKgPerOrder: parseFloat(row['Média de kg por pedido'] || 0),
      cashInflow: entradaCaixa,
      cashOutflow: saidaCaixa,
      cashBalance: entradaCaixa - saidaCaixa, // Calculate as Entrada - Saída
      payableAccounts: parseFloat(row['Ctas à Pagar'] || 0),
      receivableAccounts: parseFloat(row['Ctas à Receber'] || 0),
      bankBalance: parseFloat(row['Sdo Itaú + Cofre Último dia do mês'] || 0),
      stockMeat: parseFloat(row['Estoque Carnes'] || 0),
      stockOther: parseFloat(row['Estoque Não Carnes'] || 0),
    };
  });

  return formatted;
}
