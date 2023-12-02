const { createServer } = require('http');
const { parse } = require('url');
const axios = require('axios');

const server = createServer((req, res) => {
  const { query } = parse(req.url, true);
  const userId = query.id;
  const token = 'MTE0NjU4NTA3Mzc5ODM1MjkyNw.GjjM-S.DK6mpztzFJ5MCpnVPsKuOlppP5KavhE5FCUh2o';

  if (!userId) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'User ID is required in the query parameters.' }));
    return;
  }

  const headers = {
    Authorization: `Bot ${token}`,
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, { headers });

      if (response.status === 200) {
        const user = response.data;
        const responseData = {
          username: user.username,
          discriminator: user.discriminator,
          avatarURL: user.avatar ? `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png` : null,
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData));
      } else {
        console.error(`Failed to fetch user. Status code: ${response.status}`);
        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch user.' }));
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error.' }));
    }
  };

  getUser();
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
