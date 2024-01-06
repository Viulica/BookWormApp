const fs = require('fs');
const cors = require('cors');
const express = require('express');
const app = express();
const v4 = require("uuid").v4
const path = require("path")

app.use(cors())

app.use("/images", express.static(path.join(__dirname) + "/images"));
app.use(express.raw({ type: 'image/*', limit: '10mb' }));



app.post('/upload', (req, res) => {
    const contentType = req.headers['content-type'];
    console.log("Request received: ", req)

    let fileExtension;
    if (contentType === 'image/jpeg') {
        fileExtension = 'jpg';
    } else if (contentType === 'image/png') {
        fileExtension = 'png';
    } else {
       res.status(400).send("bad request");
       return;
    }

    const imageData = req.body;

    let name = v4();

    fs.writeFile(`./images/${name}.${fileExtension}`, imageData, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving the image');
        }
        res.send(name);
    });
});


const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});