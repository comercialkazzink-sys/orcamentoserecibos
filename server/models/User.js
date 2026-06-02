const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  senha: {
    type: String,
    required: true
  },
  empresa: {
    type: String,
    required: false
  },
  telefone: {
    type: String,
    required: false
  },
  plano: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  orcamentosUsados: {
    type: Number,
    default: 0
  },
  recibosUsados: {
    type: Number,
    default: 0
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

// Hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.senha = await bcryptjs.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Comparar senha
UserSchema.methods.compararSenha = async function(senhaFornecida) {
  return await bcryptjs.compare(senhaFornecida, this.senha);
};

module.exports = mongoose.model('User', UserSchema);
