import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const demoPortalEnabled = process.env.NODE_ENV !== 'production';
const demoPortalCredentials = {
  paymentId: process.env.DEMO_PORTAL_PAYMENT_ID || 'TEST-PAYMENT-PORTAL',
  password: process.env.DEMO_PORTAL_PASSWORD || 'TAROVERSE2026',
  serviceId: 'love',
  portalToken: 'demo-portal-token'
};

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const paymentsFile = path.join(__dirname, 'payments.json');
const portalBaseUrl = process.env.PORTAL_BASE_URL || 'http://localhost:3000';
const adminExportToken = process.env.ADMIN_EXPORT_TOKEN || '';
const emailFrom = process.env.EMAIL_FROM || 'taroverse.readings@gmail.com';
const emailHost = process.env.EMAIL_HOST || '';
const emailPort = Number(process.env.EMAIL_PORT || 587);
const emailSecure = process.env.EMAIL_SECURE === 'true';
const emailUser = process.env.EMAIL_USER || 'taroverse.readings@gmail.com';
const emailPass = process.env.EMAIL_PASS || '';
const emailCc = process.env.EMAIL_CC || '';

app.use(express.json());

const portalSessions = new Map();
const portalSessionTtlMs = 15 * 60 * 1000;

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const [rawKey, ...rawValueParts] = part.trim().split('=');
    if (!rawKey) return acc;
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValueParts.join('=') || '');
    acc[key] = value;
    return acc;
  }, {});
}

function getPortalSessionFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies.taroverse_portal_session;
  if (!token) return null;
  const session = portalSessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    portalSessions.delete(token);
    return null;
  }
  return session;
}

function setPortalSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `taroverse_portal_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(portalSessionTtlMs / 1000)}${secure}`);
}

function clearPortalSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `taroverse_portal_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`);
}

function createPortalSession(res, user, paymentId, serviceId) {
  const token = crypto.randomBytes(24).toString('hex');
  portalSessions.set(token, {
    token,
    paymentId,
    serviceId,
    user,
    expiresAt: Date.now() + portalSessionTtlMs
  });
  setPortalSessionCookie(res, token);
  return token;
}

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

function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function generatePortalPassword() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function getPortalServiceLabel(serviceId) {
  const labels = {
    love: 'Love Spell Manifestation',
    career: 'Career Manifestation',
    money: 'Money Manifestation'
  };
  return labels[serviceId] || 'Manifestation Portal';
}

function getBookingCalendlyLink(serviceId) {
  const links = {
    single: 'https://calendly.com/shivangiarora424/tarot-reading?month=2026-06',
    three: 'https://calendly.com/shivangiarora424/new-meeting?month=2026-06',
    deep: 'https://calendly.com/shivangiarora424/new-meeting-1?month=2026-06'
  };
  return links[serviceId] || '';
}

async function sendBookingConfirmationEmail({ to, paymentId, serviceId, serviceLabel, duration, amount, currency }) {
  if (!to || !emailHost || !emailUser || !emailPass) {
    console.warn('[booking] SMTP not configured; skipping booking confirmation email.');
    return { sent: false, reason: 'smtp-not-configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const calendly = getBookingCalendlyLink(serviceId);
    const bookingText = calendly ? `<p><a href="${calendly}" style="display:inline-block;padding:10px 16px;background:#8b5e3c;color:#fff;text-decoration:none;border-radius:6px;">Choose your slot on Calendly</a></p>` : '';

    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      cc: emailCc || undefined,
      subject: `Your TaroVerse booking — ${serviceLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:640px;margin:0 auto;">
          <h2 style="margin-bottom:8px;">Thanks for your booking</h2>
          <p>We received your payment and your booking window is now unlocked.</p>
          <p><strong>Service:</strong> ${serviceLabel}</p>
          <p><strong>Duration:</strong> ${duration}</p>
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Amount:</strong> ${Number(amount).toFixed(2)} ${currency}</p>
          ${bookingText}
          <p>If you have any issues, reply to this email and we will assist.</p>
        </div>
      `
    });

    return { sent: Boolean(info.messageId), reason: info.messageId ? null : 'unknown' };
  } catch (error) {
    console.error('[booking] Failed to send booking confirmation email:', error);
    return { sent: false, reason: error.message || 'smtp-send-failed' };
  }
}

async function sendPortalEmail({ to, paymentId, portalToken, portalPassword, serviceId }) {
  if (!to || !emailHost || !emailUser || !emailPass) {
    console.warn('[portal] SMTP not configured; skipping portal email.');
    return { sent: false, reason: 'smtp-not-configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const portalUrl = `${portalBaseUrl}/portal?paymentId=${encodeURIComponent(paymentId)}&token=${encodeURIComponent(portalToken)}&video=${encodeURIComponent(serviceId)}`;
    // Ensure the payer's email is included in CC while preserving an optional admin CC
    const combinedCc = emailCc ? `${emailCc},${to}` : to;

    const info = await transporter.sendMail({
      from: emailFrom,
      to,
      cc: combinedCc,
      subject: 'Your TaroVerse manifestation portal is ready',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:640px;margin:0 auto;">
          <h2 style="margin-bottom:8px;">Your manifestation portal is ready</h2>
          <p>Thank you for your purchase. Your portal access has been created successfully.</p>
          <p><strong>Service:</strong> ${getPortalServiceLabel(serviceId)}</p>
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Password:</strong> ${portalPassword}</p>
          <p><a href="${portalUrl}" style="display:inline-block;padding:10px 16px;background:#8b5e3c;color:#fff;text-decoration:none;border-radius:6px;">Open your portal</a></p>
          <p>This portal is linked to one device for your privacy and security.</p>
        </div>
      `
    });

    return { sent: Boolean(info.messageId), reason: info.messageId ? null : 'unknown' };
  } catch (error) {
    console.error('[portal] Failed to send portal email:', error);
    return { sent: false, reason: error.message || 'smtp-send-failed' };
  }
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

async function verifyRazorpayPayment(paymentId, orderId) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return { verified: false, reason: 'razorpay-not-configured' };
  }

  try {
    const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    const payment = await razorpay.payments.fetch(paymentId);
    const verified = Boolean(payment && payment.order_id === orderId && ['captured', 'authorized'].includes(payment.status));
    return { verified, reason: verified ? null : 'payment-not-verified', payment };
  } catch (error) {
    return { verified: false, reason: error.message || 'payment-verification-failed' };
  }
}

app.post('/record-payment', async (req, res) => {
  try {
    const { paymentId, orderId, service, serviceId, duration, amount, currency, receipt, email } = req.body;

    if (!paymentId || !orderId || !service || !amount || !currency || !serviceId) {
      return res.status(400).json({ error: 'Missing required payment data.' });
    }

    const verification = await verifyRazorpayPayment(paymentId, orderId);
    if (!verification.verified) {
      return res.status(400).json({ error: 'Payment could not be verified securely.' });
    }

    const isPortalService = ['love', 'career', 'money'].includes(serviceId);
    const portalPassword = isPortalService ? generatePortalPassword() : '';
    const portalUser = isPortalService
      ? {
          serviceId,
          paymentId,
          portalToken: crypto.randomBytes(12).toString('hex'),
          portalPasswordHash: hashValue(portalPassword),
          email: String(email || '').trim(),
          deviceId: null,
          createdAt: new Date().toISOString()
        }
      : null;

    const payments = await readPayments();
    payments.push({
      paymentId,
      orderId,
      service,
      serviceId,
      duration,
      amount: Number(amount),
      currency,
      receipt: receipt || '',
      portalUser,
      createdAt: new Date().toISOString()
    });

    await writePayments(payments);

    let emailDelivery = { sent: false, reason: 'not-applicable' };
    if (portalUser && portalUser.email) {
      emailDelivery = await sendPortalEmail({
        to: portalUser.email,
        paymentId,
        portalToken: portalUser.portalToken,
        portalPassword,
        serviceId
      });
    } else if (!isPortalService && String(email || '').trim()) {
      // send booking confirmation for non-portal purchases
      emailDelivery = await sendBookingConfirmationEmail({
        to: String(email).trim(),
        paymentId,
        serviceId,
        serviceLabel: service,
        duration,
        amount,
        currency
      });
    }

    if (portalUser) {
      createPortalSession(res, portalUser, paymentId, serviceId);
    }

    res.json({ success: true, user: portalUser, emailDelivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/portal-session', (req, res) => {
  const session = getPortalSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: 'No active portal session.' });
  }
  res.json({ success: true, serviceId: session.serviceId, user: session.user });
});

app.post('/portal-logout', (req, res) => {
  clearPortalSessionCookie(res);
  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies.taroverse_portal_session;
  if (token) portalSessions.delete(token);
  res.json({ success: true });
});

app.post('/validate-portal', async (req, res) => {
  try {
    const { paymentId, portalToken, deviceId } = req.body;
    if (!paymentId || !portalToken) {
      return res.status(400).json({ error: 'Missing portal credentials.' });
    }

    if (demoPortalEnabled && paymentId === demoPortalCredentials.paymentId && portalToken === demoPortalCredentials.portalToken) {
      const user = {
        serviceId: demoPortalCredentials.serviceId,
        paymentId: demoPortalCredentials.paymentId,
        portalToken: demoPortalCredentials.portalToken,
        deviceId: deviceId || null,
        createdAt: new Date().toISOString()
      };
      createPortalSession(res, user, user.paymentId, user.serviceId);
      return res.json({ success: true, serviceId: demoPortalCredentials.serviceId, user });
    }

    const payments = await readPayments();
    const payment = payments.find((entry) => entry.paymentId === paymentId && entry.portalUser?.portalToken === portalToken);
    if (!payment) {
      return res.status(401).json({ error: 'Portal credentials are invalid.' });
    }

    if (payment.portalUser?.deviceId && payment.portalUser.deviceId !== deviceId) {
      return res.status(403).json({ error: 'This portal is already linked to another device.' });
    }

    if (!payment.portalUser.deviceId && deviceId) {
      payment.portalUser.deviceId = deviceId;
      await writePayments(payments);
    }

    createPortalSession(res, payment.portalUser, payment.paymentId, payment.serviceId);
    res.json({ success: true, serviceId: payment.serviceId, user: payment.portalUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/portal-login', async (req, res) => {
  try {
    const { paymentId, password, deviceId } = req.body;
    if (!paymentId || !password) {
      return res.status(400).json({ error: 'Payment ID and password are required.' });
    }

    if (demoPortalEnabled && paymentId === demoPortalCredentials.paymentId && password === demoPortalCredentials.password) {
      const user = {
        serviceId: demoPortalCredentials.serviceId,
        paymentId: demoPortalCredentials.paymentId,
        portalToken: demoPortalCredentials.portalToken,
        deviceId: deviceId || null,
        createdAt: new Date().toISOString()
      };
      createPortalSession(res, user, user.paymentId, user.serviceId);
      return res.json({ success: true, serviceId: demoPortalCredentials.serviceId, user });
    }

    const payments = await readPayments();
    const payment = payments.find((entry) => entry.paymentId === paymentId && entry.portalUser);
    if (!payment || !payment.portalUser) {
      return res.status(401).json({ error: 'Payment ID was not found. Please check the Payment ID from your purchase email.' });
    }

    if (hashValue(password) !== payment.portalUser.portalPasswordHash) {
      return res.status(401).json({ error: 'Password is incorrect. Please check the password emailed to you.' });
    }

    if (payment.portalUser.deviceId && payment.portalUser.deviceId !== deviceId) {
      return res.status(403).json({ error: 'This portal is already linked to another device.' });
    }

    if (!payment.portalUser.deviceId && deviceId) {
      payment.portalUser.deviceId = deviceId;
      await writePayments(payments);
    }

    createPortalSession(res, payment.portalUser, payment.paymentId, payment.serviceId);
    res.json({ success: true, serviceId: payment.serviceId, user: payment.portalUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/export-payments', async (req, res) => {
  try {
    const requestedToken = req.query.token || req.headers['x-admin-export-token'];
    if (!adminExportToken || requestedToken !== adminExportToken) {
      return res.status(403).json({ error: 'Admin export access denied.' });
    }

    const month = req.query.month;
    const payments = await readPayments();
    const filtered = month ? payments.filter((payment) => payment.createdAt.startsWith(month)) : payments;
    const total = filtered.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const userCount = filtered.length;

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
      `,,,,,,,
`,
      `Total Users:,${userCount}`,
      `Total Earnings:,${total.toFixed(2)} ${filtered[0]?.currency || 'INR'}`
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
