const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const Orcamento = require('../models/Orcamento');
const User = require('../models/User');

// Listar orçamentos
router.get('/', autenticar, async (req, res) => {
  try {
    const orcamentos = await Orcamento.find({ usuarioId: req.usuarioId });
    res.json(orcamentos);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao listar orçamentos', erro: error.message });
  }
});

// Criar orçamento
router.post('/', autenticar, async (req, res) => {
  try {
    const usuario = await User.findById(req.usuarioId);
    
    // Verificar limite para plano free
    if (usuario.plano === 'free' && usuario.orcamentosUsados >= 10) {
      return res.status(403).json({ 
        mensagem: 'Limite de orçamentos atingido. Faça upgrade para plano PRO.' 
      });
    }
    
    const { numero, cliente, itens, desconto, validade, notas } = req.body;
    
    // Calcular totais
    const subtotal = itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
    const total = subtotal - (desconto || 0);
    
    const orcamento = new Orcamento({
      usuarioId: req.usuarioId,
      numero,
      cliente,
      itens: itens.map(item => ({
        ...item,
        subtotal: item.quantidade * item.valorUnitario
      })),
      subtotal,
      desconto: desconto || 0,
      total,
      validade,
      notas
    });
    
    await orcamento.save();
    usuario.orcamentosUsados += 1;
    await usuario.save();
    
    res.status(201).json({
      mensagem: 'Orçamento criado com sucesso',
      orcamento
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar orçamento', erro: error.message });
  }
});

// Obter orçamento específico
router.get('/:id', autenticar, async (req, res) => {
  try {
    const orcamento = await Orcamento.findOne({ _id: req.params.id, usuarioId: req.usuarioId });
    
    if (!orcamento) {
      return res.status(404).json({ mensagem: 'Orçamento não encontrado' });
    }
    
    res.json(orcamento);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter orçamento', erro: error.message });
  }
});

// Atualizar orçamento
router.put('/:id', autenticar, async (req, res) => {
  try {
    const { cliente, itens, desconto, validade, status, notas } = req.body;
    
    const orcamento = await Orcamento.findOne({ _id: req.params.id, usuarioId: req.usuarioId });
    
    if (!orcamento) {
      return res.status(404).json({ mensagem: 'Orçamento não encontrado' });
    }
    
    // Atualizar campos
    if (cliente) orcamento.cliente = cliente;
    if (itens) {
      orcamento.itens = itens.map(item => ({
        ...item,
        subtotal: item.quantidade * item.valorUnitario
      }));
      orcamento.subtotal = itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
      orcamento.total = orcamento.subtotal - (desconto || orcamento.desconto);
    }
    if (desconto !== undefined) orcamento.desconto = desconto;
    if (validade) orcamento.validade = validade;
    if (status) orcamento.status = status;
    if (notas) orcamento.notas = notas;
    
    orcamento.dataAtualizacao = new Date();
    await orcamento.save();
    
    res.json({
      mensagem: 'Orçamento atualizado com sucesso',
      orcamento
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar orçamento', erro: error.message });
  }
});

// Deletar orçamento
router.delete('/:id', autenticar, async (req, res) => {
  try {
    const orcamento = await Orcamento.findOneAndDelete({ _id: req.params.id, usuarioId: req.usuarioId });
    
    if (!orcamento) {
      return res.status(404).json({ mensagem: 'Orçamento não encontrado' });
    }
    
    res.json({ mensagem: 'Orçamento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar orçamento', erro: error.message });
  }
});

module.exports = router;
