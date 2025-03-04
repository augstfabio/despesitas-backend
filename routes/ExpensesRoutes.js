import express from 'express';
import { Despesa } from '../models/Expenses.js';
import { authenticateToken } from '../middlewares/auth.js';
import { atualizarHistorico } from '../middlewares/History.js';

export const expenses = express.Router();

expenses.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const despesas = await Despesa.find({ usuario: userId }).populate('historico');
        if (despesas.length === 0) {
            return res.status(404).json({ message: "Nenhuma despesa encontrada para este usuário." });
        }
        return res.status(200).json(despesas);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar despesas.' });
    }
});

expenses.post('/', authenticateToken, async (req, res) => {
    const { valor, dataPagamento, status, tipo,  parcelasPagas, parcelasTotais, nome } = req.body;
    const userId = req.user.id;

    if (!valor || !dataPagamento || !status || !tipo ||  !nome) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        const novaDespesa = new Despesa({
            nome,
            valor,
            dataPagamento,
            status,
            tipo,
            usuario: userId,
            parcelasPagas: parcelasPagas || 0,
            parcelasTotais: parcelasTotais || 0,
        });
        

        await novaDespesa.save();
        return res.status(201).json({ message: 'Despesa criada com sucesso!', despesa: novaDespesa });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao criar despesa.' });
    }
});
expenses.put('/:id', authenticateToken, atualizarHistorico, async (req, res) => {
    const { id } = req.params;
    const { valor, dataPagamento, status, tipo, historico, parcelasPagas, parcelasTotais } = req.body;
    const userId = req.user.id;

    try {
        const despesa = await Despesa.findOneAndUpdate(
            { _id: id, usuario: userId },
            { valor, dataPagamento, status, tipo, historico, parcelasPagas, parcelasTotais },
            { new: true }
        );

        if (!despesa) {
            return res.status(404).json({ message: "Despesa não encontrada." });
        }
        return res.status(200).json({ message: 'Despesa atualizada com sucesso!', despesa });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar despesa.' });
    }
});

expenses.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const despesa = await Despesa.findOneAndDelete({ _id: id, usuario: userId });

        if (!despesa) {
            return res.status(404).json({ message: "Despesa não encontrada." });
        }
        return res.status(200).json({ message: 'Despesa deletada com sucesso!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao deletar despesa.' });
    }
});
