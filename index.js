const icy = require('icy');
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST || '31.11.39.174',
  user: process.env.DB_USER || 'Sql1816337',
  password: process.env.DB_PASS || 'Spcmusic2024%()@',
  database: process.env.DB_NAME || 'Sql1816337_5'
});

const stations = [
  { name: 'Radio Deejay', url: 'https://stream.deejay.it/radiodeejay' },
  { name: 'Radio Italia', url: 'https://stream.radioitalia.it/split/radioitalia' },
  { name: 'RDS', url: 'https://rds-stream6.fluidstream.eu/rds.mp3' }
];

function updateDb(name, title) {
  if (!title || title.includes("StreamUrl")) return;
  const query = "UPDATE radio SET ultimo_titolo = ?, ultimo_controllo = NOW(), attiva = 1 WHERE nome LIKE ?";
  db.execute(query, [title, `%${name}%`], (err) => {
    if (!err) console.log(`✅ ${name}: ${title}`);
  });
}

stations.forEach(station => {
  setInterval(() => {
    icy.get(station.url, (res) => {
      res.on('metadata', (metadata) => {
        const parsed = icy.parse(metadata);
        if (parsed.StreamTitle) updateDb(station.name, parsed.StreamTitle);
      });
    });
  }, 30000); // Controlla ogni 30 secondi
});

console.log("🚀 BIG RADAR NODE.JS AVVIATO!");