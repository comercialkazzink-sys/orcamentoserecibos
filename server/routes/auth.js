const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registro
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha, empresa } = req.body;
    
    // Verificar se usuário já existe
    let usuario = await User.findOne({ email });
    if (usuario) {
      return res.status(400).json({ mensagem: 'Usuário já existe' });
    }
    
    // Criar novo usuário
    usuario = new User({
      nome,
      email,
      senha,
      empresa
    });
    
    await usuario.save();
    
    // Gerar token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || 'sua_chave_secreta',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      mensagem: 'Usuário registrado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        plano: usuario.plano
      }
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Validar entrada
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }
    
    // Buscar usuário
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }
    
    // Comparar senhas
    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }
    
    // Gerar token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || 'sua_chave_secreta',
      { expiresIn: '7d' }
    );
    
    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        plano: usuario.plano
      }
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro: error.message });
  }
});

module.exports = router;
