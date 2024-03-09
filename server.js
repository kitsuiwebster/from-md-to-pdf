const express = require('express');
const app = express();
const port = 4005;

app.use('/pictures', express.static('/home/ash/kitsui/pdf-gen-js/pictures'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
