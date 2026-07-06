import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const paymentsFile = path.join(__dirname, 'payments.json');

app.use(express.json());

async function readPayments() {
  try {
    const data = await fs.readFile(paymentsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writePayments(payments) {
  await fs.writeFile(paymentsFile, JSON.stringify(payments, null, 2));
}
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
  immutable: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

app.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', service, duration, receipt } = req.body;

    if (!amount || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay credentials are not configured.' });
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: Number(amount),
      currency: String(currency).toUpperCase(),
      receipt: receipt || `taroverse-${Date.now()}`,
      notes: {
        service: service || '',
        duration: duration || ''
      }
    });

    res.json({ keyId: RAZORPAY_KEY_ID, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/record-payment', async (req, res) => {
  try {
    const { paymentId, orderId, service, duration, amount, currency, receipt } = req.body;

    if (!paymentId || !orderId || !service || !amount || !currency) {
      return res.status(400).json({ error: 'Missing required payment data.' });
    }

    const payments = await readPayments();
    payments.push({
      paymentId,
      orderId,
      service,
      duration,
      amount: Number(amount),
      currency,
      receipt: receipt || '',
      createdAt: new Date().toISOString()
    });

    await writePayments(payments);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/export-payments', async (req, res) => {
  try {
    const month = req.query.month;
    const payments = await readPayments();
    const filtered = month ? payments.filter((payment) => payment.createdAt.startsWith(month)) : payments;
    const total = filtered.reduce((sum, payment) => sum + Number(payment.amount), 0);

    function escapeCsv(value) {
      if (value == null) return '';
      const text = String(value);
      if (/[\n",]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    }

    const rows = [
      'Payment ID,Order ID,Service,Duration,Amount,Currency,Receipt,Date',
      ...filtered.map((payment) =>
        [
          payment.paymentId,
          payment.orderId,
          payment.service,
          payment.duration,
          payment.amount.toFixed(2),
          payment.currency,
          payment.receipt,
          payment.createdAt
        ].map(escapeCsv).join(',')
      ),
      `,,Total, ,${total.toFixed(2)}, , , `
    ];

    const filename = `taroverse-payments${month ? `-${month}` : ''}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(rows.join('\n'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
