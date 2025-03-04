import mongoose from 'mongoose';

const HistoricoSchema = new mongoose.Schema({
    despesa: { type: mongoose.Schema.Types.ObjectId, ref: 'Despesa', required: true },
    dataPagamento: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Historico = mongoose.model('historicos', HistoricoSchema);
