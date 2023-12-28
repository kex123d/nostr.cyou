const fs = require('fs');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => {
        const jsonData = JSON.parse(data);
        const userData = `${jsonData.username}:${jsonData.key};\n`;

        fs.appendFile('.well-known/nostr.json', userData, (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
          } else {
            res.json({ message: 'Data saved successfully' });
          }
        });
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Invalid data format' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
