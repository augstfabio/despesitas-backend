import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado, token não fornecido!' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido!' });
        }
        req.user = user;
        next();
    });
}   