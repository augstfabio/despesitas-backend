import { Historico } from '../models/History.js';
import { Despesa } from '../models/Expenses.js';

export const atualizarHistorico = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status === 'pago') {
        try {
            const despesa = await Despesa.findById(id);
            if (!despesa) {
                return res.status(404).json({ error: 'Despesa não encontrada.' });
            }

            const novaEntradaHistorico = new Historico({
                despesa: id,
                dataPagamento: new Date()
            });

            await novaEntradaHistorico.save();

            const updateFields = { $push: { historico: novaEntradaHistorico._id } };

            if (despesa.tipo === 'parcelado') {
                updateFields.$inc = { parcelasPagas: 1 };
            }

            await Despesa.findByIdAndUpdate(id, updateFields);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar o histórico.' });
        }
    }
    next();
};
