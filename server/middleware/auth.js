const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ mensagem: 'Token não fornecido' });
    }
    
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
    req.usuarioId = decodificado.id;
    next();
  } catch (error) {
    res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
};

module.exports = { autenticar };
