const fs = require('fs');

export default class updateData {
    updateNumGames() {
        fs.readFile('data.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const jsonData = JSON.parse(data);
          const newNumGames = jsonData.numgames + 1;
          jsonData.numgames = newNumGames;
          fs.writeFile('data.json', JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
    }
    readNumGames() {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            const jsonData = JSON.parse(data);
            return jsonData.numgames;
        });
    }
}