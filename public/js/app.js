// Configuração da API
const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let authToken = null;

// Elementos do DOM
const loginSection = document.getElementById('loginSection');
const loginForm = document.getElementById('loginForm');
const registroForm = document.getElementById('registroForm');
const toggleRegistro = document.getElementById('toggleRegistro');
const toggleLogin = document.getElementById('toggleLogin');
const registroContainer = document.getElementById('registroContainer');
const navbar = document.querySelector('.navbar');
const btnLogout = document.getElementById('btnLogout');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  carregarUsuarioSalvo();
  setupEventListeners();
});

function setupEventListeners() {
  loginForm.addEventListener('submit', handleLogin);
  registroForm.addEventListener('submit', handleRegistro);
  toggleRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    registroContainer.style.display = 'block';
  });
  toggleLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registroContainer.style.display = 'none';
    loginSection.style.display = 'block';
  });
  btnLogout.addEventListener('click', handleLogout);

  // Navegação
  document.getElementById('navDashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('dashboard');
  });
  document.getElementById('navOrcamentos')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('orcamentos');
    carregarOrcamentos();
  });
  document.getElementById('navRecibos')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('recibos');
    carregarRecibos();
  });
  document.getElementById('navPerfil')?.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('perfil');
  });
}

// Login
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      currentUser = data.usuario;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      alert('Login realizado com sucesso!');
      mostrarApp();
      carregarDashboard();
    } else {
      alert(data.mensagem || 'Erro ao fazer login');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao conectar com o servidor');
  }
}

// Registro
async function handleRegistro(e) {
  e.preventDefault();
  const nome = document.getElementById('registroNome').value;
  const email = document.getElementById('registroEmail').value;
  const senha = document.getElementById('registroSenha').value;
  const empresa = document.getElementById('registroEmpresa').value;

  try {
    const response = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, empresa })
    });

    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      currentUser = data.usuario;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      alert('Conta criada com sucesso!');
      mostrarApp();
      carregarDashboard();
    } else {
      alert(data.mensagem || 'Erro ao registrar');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao conectar com o servidor');
  }
}

// Logout
function handleLogout() {
  if (confirm('Deseja sair?')) {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    mostrarLogin();
  }
}

// Carregar usuário salvo
function carregarUsuarioSalvo() {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('currentUser');
  
  if (token && user) {
    authToken = token;
    currentUser = JSON.parse(user);
    mostrarApp();
    carregarDashboard();
  } else {
    mostrarLogin();
  }
}

// UI Functions
function mostrarLogin() {
  document.querySelector('.header').style.display = 'none';
  loginSection.classList.add('active');
}

function mostrarApp() {
  document.querySelector('.header').style.display = 'block';
  loginSection.classList.remove('active');
  showSection('dashboard');
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Dashboard
async function carregarDashboard() {
  showSection('dashboard');
  
  try {
    const [orcamentos, recibos] = await Promise.all([
      fetch(`${API_URL}/orcamentos`, { 
        headers: { 'Authorization': `Bearer ${authToken}` }
      }).then(r => r.json()),
      fetch(`${API_URL}/recibos`, { 
        headers: { 'Authorization': `Bearer ${authToken}` }
      }).then(r => r.json())
    ]);

    document.getElementById('totalOrcamentos').textContent = orcamentos.length;
    document.getElementById('limitOrcamentos').textContent = `${orcamentos.length}/10`;
    document.getElementById('totalRecibos').textContent = recibos.length;
    document.getElementById('limitRecibos').textContent = `${recibos.length}/10`;
    document.getElementById('userPlan').textContent = currentUser.plano?.toUpperCase() || 'FREE';

    document.getElementById('perfilNome').textContent = currentUser.nome;
    document.getElementById('perfilEmail').textContent = currentUser.email;
    document.getElementById('perfilPlano').textContent = currentUser.plano?.toUpperCase() || 'FREE';
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
  }
}

// Orçamentos
async function carregarOrcamentos() {
  try {
    const response = await fetch(`${API_URL}/orcamentos`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const orcamentos = await response.json();
    
    const container = document.getElementById('orcamentosList');
    container.innerHTML = '';
    
    if (orcamentos.length === 0) {
      container.innerHTML = '<p>Nenhum orçamento criado ainda.</p>';
      return;
    }

    orcamentos.forEach(orcamento => {
      container.innerHTML += `
        <div class="list-item">
          <div class="list-item-info">
            <h3>#${orcamento.numero}</h3>
            <p><strong>${orcamento.cliente.nome}</strong> - R$ ${orcamento.total.toFixed(2)}</p>
            <p>Status: <strong>${orcamento.status}</strong></p>
          </div>
          <div class="list-item-actions">
            <button class="btn-secondary" onclick="verOrcamento('${orcamento._id}')">Ver</button>
            <button class="btn-danger" onclick="deletarOrcamento('${orcamento._id}')">Deletar</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar orçamentos:', error);
  }
}

// Recibos
async function carregarRecibos() {
  try {
    const response = await fetch(`${API_URL}/recibos`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const recibos = await response.json();
    
    const container = document.getElementById('recibosList');
    container.innerHTML = '';
    
    if (recibos.length === 0) {
      container.innerHTML = '<p>Nenhum recibo criado ainda.</p>';
      return;
    }

    recibos.forEach(recibo => {
      container.innerHTML += `
        <div class="list-item">
          <div class="list-item-info">
            <h3>#${recibo.numero}</h3>
            <p><strong>${recibo.cliente.nome}</strong> - R$ ${recibo.total.toFixed(2)}</p>
            <p>Status: <strong>${recibo.status}</strong></p>
          </div>
          <div class="list-item-actions">
            <button class="btn-secondary" onclick="verRecibo('${recibo._id}')">Ver</button>
            <button class="btn-danger" onclick="deletarRecibo('${recibo._id}')">Deletar</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar recibos:', error);
  }
}

// Deletar funções
async function deletarOrcamento(id) {
  if (confirm('Tem certeza que deseja deletar este orçamento?')) {
    try {
      const response = await fetch(`${API_URL}/orcamentos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (response.ok) {
        alert('Orçamento deletado com sucesso!');
        carregarOrcamentos();
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  }
}

async function deletarRecibo(id) {
  if (confirm('Tem certeza que deseja deletar este recibo?')) {
    try {
      const response = await fetch(`${API_URL}/recibos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (response.ok) {
        alert('Recibo deletado com sucesso!');
        carregarRecibos();
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  }
}

function verOrcamento(id) {
  alert('Funcionalidade de visualizar orçamento em desenvolvimento');
}

function verRecibo(id) {
  alert('Funcionalidade de visualizar recibo em desenvolvimento');
}
