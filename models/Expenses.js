import mongoose from 'mongoose';

const DespesaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    dataPagamento: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'pago'],
        required: true
    },
    tipo: {
        type: String,
        enum: ['parcelado', 'unico', 'fixa'],
        required: true
    },
    historico:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'historicos'
        }],
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    parcelasPagas: {
        type: Number,
        default: 0
    },
    parcelasTotais: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export const Despesa = mongoose.model('Despesa', DespesaSchema);
