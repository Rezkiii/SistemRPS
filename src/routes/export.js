const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const rpsPath = path.join(__dirname, '..', 'database', 'rps.json');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}




// Export RPS data to Word (single RPS by id) using docxtemplater and template.docx
router.get('/export/word/:id', isAuthenticated, (req, res) => {
  const rpsId = req.params.id;
  const rawData = fs.readFileSync(rpsPath);
  const rps = JSON.parse(rawData);
  const item = rps.find(r => String(r.id) === String(rpsId) && r.userId === req.session.user.id);
  if (!item) {
    return res.status(404).send('RPS tidak ditemukan');
  }

  // Siapkan data untuk template
  const data = { ...item };
  // CPL Descriptions (bisa dipakai di template)
  const allCplDescriptions = {
    CPL01: 'Menunjukkan sikap profesional yang berlandaskan ketakwaan, etika, integritas, nasionalisme, dan kepedulian sosial dalam menjalankan tugas di bidang teknik komputer dan jaringan',
    CPL02: 'Menerapkan konsep matematika, komputasi, dan kecerdasan buatan dalam penyelesaian masalah teknis jaringan secara sistematis.',
    CPL03: 'Mengelola pembelajaran sepanjang hayat untuk pengembangan profesional diri dalam lingkungan kerja global yang dinamis dan kompetitif.',
    CPL04: 'Menyelesaikan permasalahan dan tugas teknis jaringan komputer melalui perancangan, konfigurasi, pengujian, dan pengelolaan perangkat serta infrastruktur jaringan pada berbagai skala topologi dalam konteks operasional sistem komunikasi data dan administrasi jaringan.',
    CPL05: 'Merancang infrastruktur jaringan komputer serta sistem virtualisasi dan komputasi awan dalam konteks pembangunan dan pengelolaan layanan TIK yang fleksibel, skalabel, dan terotomasi. (C6)',
    CPL06: 'Mengintegrasikan teknologi jaringan wireless & mobile, sistem tertanam, dan komputasi terdistribusi dalam perancangan dan pengelolaan solusi komunikasi data nirkabel yang andal dan adaptif untuk lingkungan industri dan IoT.',
    CPL07: 'Mengembangkan solusi berbasis IoT dan sistem tertanam dalam integrasi perangkat keras, perangkat lunak, dan komunikasi data.',
    CPL08: 'Merancang solusi berbasis prinsip keamanan siber dan pembelajaran mesin untuk memitigasi risiko serta memperkuat ketahanan infrastruktur informasi',
    CPL09: 'Mengelola infrastruktur virtualisasi dan komputasi awan beserta pipeline DevOps dalam otomatisasi penyediaan layanan TIK yang skalabel, andal, dan berkelanjutan',
    CPL10: 'Mengkomunikasikan ide dan solusi teknis dalam kegiatan penelitian atau kerja sama tim multidisiplin secara ilmiah dan profesional.'
  };

  data.cplList = (item['cpl[]'] || item.cpl || []).map(cplCode => {
    return {
      code: cplCode,
      description: (item.cpl_descriptions && item.cpl_descriptions[cplCode])
                   ? item.cpl_descriptions[cplCode]
                   : (allCplDescriptions[cplCode] || 'No description available')
    };
  });

  // CPMK dan sub-CPMK untuk table (bisa diakses di template)
  data.cpmk = [];
  data.sub_cpmk = [];
  // CPMK
  Object.entries(item).forEach(([k, v]) => {
    const match = k.match(/^cpmk\[(CPMK\d+)\]\[(.+)\]$/);
    if (match) {
      const cpmkId = match[1];
      const field = match[2];
      let cpmkObj = data.cpmk.find(c => c.id === cpmkId);
      if (!cpmkObj) {
        cpmkObj = { id: cpmkId };
        data.cpmk.push(cpmkObj);
      }
      cpmkObj[field] = v;
    }
  });
  // sub-CPMK
  Object.entries(item).forEach(([k, v]) => {
    const match = k.match(/^sub_cpmk\[(CPMK\d+)\]\[(\d+)\]\[(.+)\]$/);
    if (match) {
      const cpmkId = match[1];
      const subId = match[2];
      const field = match[3];
      let sub = data.sub_cpmk.find(s => s.cpmkId === cpmkId && s.subId === subId);
      if (!sub) {
        sub = { cpmkId, subId };
        data.sub_cpmk.push(sub);
      }
      sub[field] = v;
    }
  });

  // Load template file
  const templatePath = path.join(__dirname, '../templates/template.docx');
  let content;
  try {
    content = fs.readFileSync(templatePath, 'binary');
  } catch (err) {
    return res.status(500).send('Template Word tidak ditemukan. Upload template.docx ke folder templates.');
  }

  try {
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.setData(data);
    doc.render();
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    res.setHeader('Content-Disposition', `attachment; filename="rps-${item.id}.docx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buf);
  } catch (err) {
    res.status(500).send('Gagal generate Word: ' + err.message);
  }
});

module.exports = router;
