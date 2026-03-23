const icy = require('icy');
const mysql = require('mysql2');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Radar SPC Attivo 🚀'));
app.listen(process.env.PORT || 10000);

const db = mysql.createPool({
  host: '31.11.39.174',
  user: 'Sql1816337',
  password: 'Spcmusic2024%()@',
  database: 'Sql1816337_5',
  waitForConnections: true,
  connectionLimit: 10
});

// URL AGGIORNATI E TESTATI ORA
const stations = [
  { name: 'Radio Deejay', url: 'http://icecast.unitedradio.it/Deejay.mp3' },
  { name: 'Radio Italia', url: 'http://stream1.radioitalia.it/' },
  { name: 'RDS', url: 'http://rds-stream6.fluidstream.eu/rds.mp3' }
];

function updateDb(name, title) {
  const cleanTitle = title.replace(/['"]/g, ""); // Pulisce il titolo per il DB
  const query = "UPDATE radio SET ultimo_titolo = ?, ultimo_controllo = NOW(), attiva = 1 WHERE nome LIKE ?";
  db.execute(query, [cleanTitle, `%${name}%`], (err) => {
    if (!err) console.log(`✅ ${name}: ${cleanTitle}`);
    else console.log(`❌ Errore Database: ${err.message}`);
  });
}

function scan() {
  stations.forEach(s => {
    try {
      icy.get(s.url, (res) => {
        res.on('metadata', (metadata) => {
          const parsed = icy.parse(metadata);
          if (parsed.StreamTitle) updateDb(s.name, parsed.StreamTitle);
        });
      }).on('error', () => console.log(`⚠️ Riprovo connessione a ${s.name}...`));
    } catch (e) { }
  });
}

setInterval(scan, 60000); // Controlla ogni minuto
scan(); // Parte subito

console.log("🚀 RADAR SPC: SCANSIONE IN CORSO...");
