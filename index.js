const RadioBrowser = require('radio-browser');
const icy = require('icy');
const mysql = require('mysql2');
const app = require('express')();

app.get('/', (req, res) => res.send('Global Radar SPC Online 🌍'));
app.listen(process.env.PORT || 10000);

const db = mysql.createPool({
  host: '31.11.39.174', user: 'Sql1816337', password: 'Spcmusic2024%()@', database: 'Sql1816337_5'
});

const myStations = ['Radio Deejay', 'Radio Italia Solo Musica Italiana', 'RDS', 'Radio 105', 'RTL 102.5'];

async function scanGlobal() {
  for (let name of myStations) {
    try {
      const stations = await RadioBrowser.searchStations({ name: name, limit: 1 });
      if (stations.length > 0) {
        icy.get(stations[0].url, (res) => {
          res.on('metadata', (metadata) => {
            const title = icy.parse(metadata).StreamTitle;
            if (title) {
              db.execute("UPDATE radio SET ultimo_titolo = ?, ultimo_controllo = NOW() WHERE nome LIKE ?", [title, `%${name}%`]);
              console.log(`🌍 [GLOBAL] ${name}: ${title}`);
            }
          });
        });
      }
    } catch (e) { console.log(`⚠️ Errore ricerca ${name}`); }
  }
}

setInterval(scanGlobal, 60000);
scanGlobal();
