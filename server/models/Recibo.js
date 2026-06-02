const mongoose = require('mongoose');

const ReciboSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numero: {
    type: String,
    required: true,
    unique: true
  },
  orcamentoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orcamento'
  },
  cliente: {
    nome: { type: String, required: true },
    email: { type: String },
    cpfCnpj: { type: String },
    telefone: { type: String },
    endereco: { type: String }
  },
  itens: [
    {
      descricao: { type: String, required: true },
      quantidade: { type: Number, required: true },
      valorUnitario: { type: Number, required: true },
      subtotal: { type: Number, required: true }
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  impostos: {
    type: Number,
    default: 0
  },
  desconto: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  metodoPagamento: {
    type: String,
    enum: ['dinheiro', 'cartao', 'boleto', 'transferencia', 'outro'],
    required: true
  },
  dataPagamento: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'pago', 'cancelado'],
    default: 'pago'
  },
  notas: {
    type: String
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recibo', ReciboSchema);
