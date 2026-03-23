const icy = require('icy');
const mysql = require('mysql2');
const express = require('express');
const app = express();

// 1. Server per tenere sveglio Render (Porta 10000)
app.get('/', (req, res) => res.send('Radar SPC Attivo 🚀'));
app.listen(process.env.PORT || 10000);

// 2. Connessione al tuo DB Aruba
const db = mysql.createPool({
  host: '31.11.39.174',
  user: 'Sql1816337',
  password: 'Spcmusic2024%()@',
  database: 'Sql1816337_5'
});

// 3. Lista Radio con URL AGGIORNATI (Più stabili)
const stations = [
  { name: 'Radio Deejay', url: 'http://stream.deejay.it/radiodeejay' },
  { name: 'Radio Italia', url: 'https://stream.radioitalia.it/split/radioitalia' },
  { name: 'RDS', url: 'https://rds-stream6.fluidstream.eu/rds.mp3' }
];

function updateDb(name, title) {
  if (!title || title.includes("StreamUrl")) return;
  const query = "UPDATE radio SET ultimo_titolo = ?, ultimo_controllo = NOW(), attiva = 1 WHERE nome LIKE ?";
  db.execute(query, [title, `%${name}%`], (err) => {
    if (!err) console.log(`✅ ${name}: ${title}`);
    else console.log(`❌ Errore DB per ${name}: ${err.message}`);
  });
}

// 4. Funzione di scansione sicura (Non crasha se la radio è offline)
function startScanning() {
  stations.forEach(station => {
    try {
      icy.get(station.url, (res) => {
        res.on('metadata', (metadata) => {
          const parsed = icy.parse(metadata);
          if (parsed.StreamTitle) updateDb(station.name, parsed.StreamTitle);
        });
        res.on('error', (e) => console.log(`⚠️ Errore stream ${station.name}: ${e.message}`));
      }).on('error', (e) => console.log(`⚠️ Impossibile raggiungere ${station.name}`));
    } catch (err) {
      console.log(`⚠️ Errore critico su ${station.name}`);
    }
  });
}

// Esegui ogni 60 secondi
setInterval(startScanning, 60000);
startScanning(); // Parte subito al lancio

console.log("🚀 BIG RADAR NODE.JS AVVIATO E PROTETTO!");
