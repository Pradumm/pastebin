
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import DbConnect from './config/db.js';

import path from 'path';
import pasteRoutes from './routes/paste.routes.js';
import { fileURLToPath } from 'url';

DbConnect();

const app = express();
app.use(express.json());



app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.use(pasteRoutes);


