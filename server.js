const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public'))); // Stellen Sie sicher, dass Ihre HTML-, JS- und CSS-Dateien im "public" Ordner liegen

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/:appName', (req, res) => {
  fs.readFile('versions.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const versions = JSON.parse(data);
    const appName = req.params.appName;
    if (versions.hasOwnProperty(appName)) {
      res.json(versions[appName]);
    } else {
      res.status(404).send('App not found');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
