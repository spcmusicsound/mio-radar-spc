const RadioBrowser = require('radio-browser');
const icy = require('icy');
const app = require('express')();

let lastData = {}; // La nostra "lavagna" con i titoli

app.get('/', (req, res) => res.json(lastData)); // Mostra i titoli a chiunque visiti l'URL di Render
app.listen(process.env.PORT || 10000);

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
              lastData[name] = title; // Salva il titolo sulla lavagna
              console.log(`🌍 [LIVE] ${name}: ${title}`);
            }
          });
        });
      }
    } catch (e) { console.log(`⚠️ Errore ${name}`); }
  }
}

setInterval(scanGlobal, 60000);
scanGlobal();
