const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'appointments.json');
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function readAppointments() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}
function writeAppointments(items) { fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2)); }
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized. Check the admin password.' });
  }
  next();
}
app.get('/api/config', (req, res) => res.json({ onlinePaymentsConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET), clinicPhone: '9897348314' }));
app.post('/api/appointments', (req, res) => {
  const { name, phone, address, date, time, reason, paymentMethod } = req.body || {};
  if (![name, phone, address, date, time, paymentMethod].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }
  if (!/^[6-9]\d{9}$/.test(phone.trim())) return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number.' });
  if (!['cash', 'online'].includes(paymentMethod)) return res.status(400).json({ error: 'Choose cash or online payment.' });
  const item = { id: crypto.randomUUID(), name: name.trim(), phone: phone.trim(), address: address.trim(), date, time, reason: (reason || '').trim(), paymentMethod, paymentStatus: paymentMethod === 'cash' ? 'Pay at clinic' : 'Online payment not configured', status: 'New', createdAt: new Date().toISOString() };
  const all = readAppointments(); all.unshift(item); writeAppointments(all);
  res.status(201).json({ message: 'Appointment request received.', appointment: { id: item.id, status: item.status, paymentStatus: item.paymentStatus } });
});
app.post('/api/admin/login', (req, res) => {
  if (!process.env.ADMIN_PASSWORD || (req.body || {}).password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Incorrect admin password.' });
  res.json({ ok: true });
});
app.get('/api/admin/appointments', adminAuth, (req, res) => res.json(readAppointments()));
app.patch('/api/admin/appointments/:id', adminAuth, (req, res) => {
  const allowed = ['New', 'Confirmed', 'Completed', 'Cancelled'];
  if (!allowed.includes((req.body || {}).status)) return res.status(400).json({ error: 'Invalid appointment status.' });
  const all = readAppointments(); const item = all.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Appointment not found.' });
  item.status = req.body.status; writeAppointments(all); res.json(item);
});

// Online payments are intentionally disabled until valid Razorpay credentials are configured.
// Production integration should create an order server-side and verify the payment signature server-side.
app.post('/api/payments/order', (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: 'Online payment is not active yet. Please choose cash or contact the clinic.' });
  }
  res.status(501).json({ error: 'Payment gateway credentials are present, but the secure order and signature-verification flow must be completed before accepting real payments.' });
});
app.listen(PORT, () => console.log(`Dr. Sharma Dental Clinic website running at http://localhost:${PORT}`));
