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
  { name: 'Radio Deejay', url: 'http://capital.fluidstream.eu/deejay.mp3' }, // Link alternativo
  { name: 'Radio Italia', url: 'http://ice08.fluidstream.net:8080/RadioItalia.mp3' }, // Link diretto
  { name: 'RDS', url: 'http://stream.rds.it/rds.mp3' } // Link standard
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
