const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const Recibo = require('../models/Recibo');
const User = require('../models/User');

// Listar recibos
router.get('/', autenticar, async (req, res) => {
  try {
    const recibos = await Recibo.find({ usuarioId: req.usuarioId });
    res.json(recibos);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar recibos', erro: error.message });
  }
});

// Criar recibo
router.post('/', autenticar, async (req, res) => {
  try {
    const usuario = await User.findById(req.usuarioId);
    
    // Verificar limite para plano free
    if (usuario.plano === 'free' && usuario.recibosUsados >= 10) {
      return res.status(403).json({ 
        mensagem: 'Limite de recibos atingido. Faça upgrade para plano PRO.' 
      });
    }
    
    const { numero, cliente, itens, impostos, desconto, metodoPagamento, dataPagamento, notas } = req.body;
    
    // Calcular totais
    const subtotal = itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
    const total = subtotal + (impostos || 0) - (desconto || 0);
    
    const recibo = new Recibo({
      usuarioId: req.usuarioId,
      numero,
      cliente,
      itens: itens.map(item => ({
        ...item,
        subtotal: item.quantidade * item.valorUnitario
      })),
      subtotal,
      impostos: impostos || 0,
      desconto: desconto || 0,
      total,
      metodoPagamento,
      dataPagamento,
      notas
    });
    
    await recibo.save();
    usuario.recibosUsados += 1;
    await usuario.save();
    
    res.status(201).json({
      mensagem: 'Recibo criado com sucesso',
      recibo
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar recibo', erro: error.message });
  }
});

// Obter recibo específico
router.get('/:id', autenticar, async (req, res) => {
  try {
    const recibo = await Recibo.findOne({ _id: req.params.id, usuarioId: req.usuarioId });
    
    if (!recibo) {
      return res.status(404).json({ mensagem: 'Recibo não encontrado' });
    }
    
    res.json(recibo);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter recibo', erro: error.message });
  }
});

// Atualizar recibo
router.put('/:id', autenticar, async (req, res) => {
  try {
    const { cliente, itens, impostos, desconto, metodoPagamento, dataPagamento, status, notas } = req.body;
    
    const recibo = await Recibo.findOne({ _id: req.params.id, usuarioId: req.usuarioId });
    
    if (!recibo) {
      return res.status(404).json({ mensagem: 'Recibo não encontrado' });
    }
    
    // Atualizar campos
    if (cliente) recibo.cliente = cliente;
    if (itens) {
      recibo.itens = itens.map(item => ({
        ...item,
        subtotal: item.quantidade * item.valorUnitario
      }));
      recibo.subtotal = itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
      recibo.total = recibo.subtotal + (impostos || recibo.impostos) - (desconto || recibo.desconto);
    }
    if (impostos !== undefined) recibo.impostos = impostos;
    if (desconto !== undefined) recibo.desconto = desconto;
    if (metodoPagamento) recibo.metodoPagamento = metodoPagamento;
    if (dataPagamento) recibo.dataPagamento = dataPagamento;
    if (status) recibo.status = status;
    if (notas) recibo.notas = notas;
    
    recibo.dataAtualizacao = new Date();
    await recibo.save();
    
    res.json({
      mensagem: 'Recibo atualizado com sucesso',
      recibo
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar recibo', erro: error.message });
  }
});

// Deletar recibo
router.delete('/:id', autenticar, async (req, res) => {
  try {
    const recibo = await Recibo.findOneAndDelete({ _id: req.params.id, usuarioId: req.usuarioId });
    
    if (!recibo) {
      return res.status(404).json({ mensagem: 'Recibo não encontrado' });
    }
    
    res.json({ mensagem: 'Recibo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar recibo', erro: error.message });
  }
});

module.exports = router;
