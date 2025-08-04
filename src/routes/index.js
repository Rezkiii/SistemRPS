
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '..', 'database', 'users.json');
const rpsPath = path.join(__dirname, '..', 'database', 'rps.json');

// Middleware khusus admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Forbidden');
}

// Halaman admin: validasi user
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  const rawData = fs.readFileSync(usersPath);
  const users = JSON.parse(rawData);
  // Tampilkan semua user kecuali admin utama
  const filtered = users.filter(u => u.role !== 'admin' || u.email !== 'admin@example.com');
  res.render('admin', { title: 'Admin - Validasi User', user: req.session.user, users: filtered });
});

// Proses validasi user
router.post('/admin/validate/:id', isAuthenticated, isAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const rawData = fs.readFileSync(usersPath);
  const users = JSON.parse(rawData);
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].status = 'active';
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  }
  res.redirect('/admin');
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Register process
router.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.render('register', { title: 'Register', error: 'Semua field wajib diisi.' });
  }
  const rawData = fs.readFileSync(usersPath);
  const users = JSON.parse(rawData);
  if (users.find(u => u.email === email)) {
    return res.render('register', { title: 'Register', error: 'Email sudah terdaftar.' });
  }
  const newUser = {
    id: users.length ? users[users.length-1].id + 1 : 1,
    email,
    username,
    password,
    role: 'dosen',
    status: 'pending' // Harus divalidasi admin
  };
  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  res.render('login', { title: 'Login', error: 'Registrasi berhasil! Tunggu validasi admin.' });
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Login process
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const rawData = fs.readFileSync(usersPath);
  const users = JSON.parse(rawData);

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    if (user.status && user.status !== 'active') {
      return res.render('login', { title: 'Login', error: 'Akun Anda belum divalidasi admin.' });
    }
    req.session.user = user;
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    res.redirect('/');
  } else {
    res.render('login', { title: 'Login', error: 'Invalid email or password' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// RPS form
router.get('/', isAuthenticated, (req, res) => {
  res.render('rps', { title: 'RPS Form', user: req.session.user });
});

// Save RPS data
router.post('/save-rps', isAuthenticated, (req, res) => {
  const rpsData = req.body;
  rpsData.userId = req.session.user.id;
  // Pastikan field multi-value selalu array
  const multiFields = ['dosen_pengampu', 'pustaka_utama', 'pustaka_pendukung', 'cpl'];
  multiFields.forEach(field => {
    if (rpsData[`${field}[]`]) {
      if (!Array.isArray(rpsData[`${field}[]`])) {
        rpsData[`${field}[]`] = [rpsData[`${field}[]`]];
      }
      // Untuk konsistensi, simpan juga ke field tanpa []
      rpsData[field] = rpsData[`${field}[]`];
    }
  });
  const rawData = fs.readFileSync(rpsPath);
  const rps = JSON.parse(rawData);

  // Generate id unik
  let newId = 1;
  if (rps.length > 0) {
    const maxId = Math.max(...rps.map(r => r.id || 0));
    newId = maxId + 1;
  }
  rpsData.id = newId;

  rps.push(rpsData);

  fs.writeFileSync(rpsPath, JSON.stringify(rps, null, 2));

  res.redirect('/history?saved=1');
});

// History page
router.get('/history', isAuthenticated, (req, res) => {
    const rawData = fs.readFileSync(rpsPath);
    const rps = JSON.parse(rawData);
    const userRps = rps.filter(r => r.userId === req.session.user.id);
    res.render('history', { title: 'History', user: req.session.user, rps: userRps });
});


module.exports = router;
// Hapus RPS
router.post('/delete-rps/:id', isAuthenticated, (req, res) => {
  const id = parseInt(req.params.id);
  const rawData = fs.readFileSync(rpsPath);
  let rps = JSON.parse(rawData);
  const before = rps.length;
  rps = rps.filter(r => r.id !== id || r.userId !== req.session.user.id);
  fs.writeFileSync(rpsPath, JSON.stringify(rps, null, 2));
  if (rps.length < before) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Data tidak ditemukan atau bukan milik Anda.' });
  }
});