const mongoose = require('mongoose');

const OrcamentoSchema = new mongoose.Schema({
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
  cliente: {
    nome: { type: String, required: true },
    email: { type: String },
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
  desconto: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'aceito', 'rejeitado'],
    default: 'pendente'
  },
  validade: {
    type: Date,
    required: true
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

module.exports = mongoose.model('Orcamento', OrcamentoSchema);
