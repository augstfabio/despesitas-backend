import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/User.js';


export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios!' });
    }
    try {
        const existingUser = await Usuario.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: "este email ja existe" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Usuario({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()
        const token = jwt.sign(
            { id: newUser._id, name: newUser.name, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(201).json({ message: "usuario registrado com sucesso!", token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
    }
    try {
        const user = await Usuario.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Usuario nao encontrado!" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Senha incorreta!' });
        }
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        res.status(200).json({ message: 'Login bem-sucedido!', token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
};
export const me = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}