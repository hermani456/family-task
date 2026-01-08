import express from 'express';
import cors from 'cors';
import { SHARED_MESSAGE } from '@repo/shared';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        shared: SHARED_MESSAGE
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});