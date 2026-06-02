# Orçamentos e Recibos 📄

App para emitir recebos e fazer orçamentos com versão free/pro.

## Tecnologias

- **Backend:** Node.js + Express
- **Banco de Dados:** MongoDB
- **Frontend:** HTML/CSS/JavaScript
- **Geração de PDFs:** PDFKit
- **Autenticação:** JWT

## Funcionalidades

### ✅ Versão Free
- Criar orçamentos (limite: 10/mês)
- Emitir recibos (limite: 10/mês)
- Visualizar histórico básico
- Exportar em PDF

### 🚀 Versão Pro
- Orçamentos ilimitados
- Recibos ilimitados
- Relatórios detalhados
- Controle de clientes
- Customização de template
- Suporte prioritário

## Instalação

### Pré-requisitos
- Node.js (v14+)
- MongoDB (local ou cloud)

### Passos

1. Clone o repositório
```bash
git clone https://github.com/comercialkazzink-sys/orcamentoserecibos.git
cd orcamentoserecibos
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

5. Abra no navegador
```
http://localhost:5000
```

## Estrutura do Projeto

```
orcamentoserecibos/
├── server/
│   ├── models/              # Modelos MongoDB
│   │   ├── User.js
│   │   ├── Orcamento.js
│   │   └── Recibo.js
│   ├── routes/              # Rotas API
│   │   ├── auth.js
│   │   ├── orcamentos.js
│   │   └── recibos.js
│   ├── controllers/         # Controladores
│   │   ├── authController.js
│   │   ├── orcamentosController.js
│   │   └── recibosController.js
│   ├── middleware/          # Middlewares
│   │   └── auth.js
│   └── server.js            # Arquivo principal
├── public/                  # Frontend
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── .gitignore
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

### Autenticação
- `POST /api/auth/registro` - Criar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout

### Orçamentos
- `GET /api/orcamentos` - Listar orçamentos
- `POST /api/orcamentos` - Criar orçamento
- `GET /api/orcamentos/:id` - Obter orçamento específico
- `PUT /api/orcamentos/:id` - Atualizar orçamento
- `DELETE /api/orcamentos/:id` - Deletar orçamento
- `GET /api/orcamentos/:id/pdf` - Gerar PDF do orçamento

### Recibos
- `GET /api/recibos` - Listar recibos
- `POST /api/recibos` - Criar recibo
- `GET /api/recibos/:id` - Obter recibo específico
- `PUT /api/recibos/:id` - Atualizar recibo
- `DELETE /api/recibos/:id` - Deletar recibo
- `GET /api/recibos/:id/pdf` - Gerar PDF do recibo

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Suporte

Tem dúvidas? Abra uma issue no repositório!

---

**Desenvolvido com ❤️ por Comercial Kazzink**
