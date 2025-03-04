import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import 'dotenv/config';
import { auth } from './routes/AuthRoutes.js';
import { expenses } from './routes/ExpensesRoutes.js';

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor Express com import está funcionando!');
});
app.use('/auth', auth)
app.use('/despesas', expenses)
app.use('/test', (req, res) => {
  res.json({ message: "Login funcionando!" });
})
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
