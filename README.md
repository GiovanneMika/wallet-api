
# Wallet API

API simples de gerenciamento de contas bancárias, desenvolvida em Node.js com Express.

## Funcionalidades
- Criar conta bancária
- Atualizar dados da conta
- Consultar contas cadastradas
- Consultar extrato completo ou por data
- Realizar depósitos e saques
- Consultar saldo
- Deletar conta

## Rotas

### Criar conta
`POST /account`
```json
{
	"name": "Nome do Cliente",
	"cpf": "12345678900"
}
```

### Listar todas as contas
`GET /accounts`

### Consultar conta por CPF
`GET /account`  
Header: `cpf`

### Consultar conta por ID
`GET /account/:id`

### Atualizar nome da conta
`PUT /account`  
Header: `cpf`
```json
{
	"name": "Novo Nome"
}
```

### Deletar conta
`DELETE /account`  
Header: `cpf`

### Consultar extrato completo
`GET /statement`  
Header: `cpf`

### Consultar extrato por data
`GET /statement/date?date=YYYY-MM-DD`  
Header: `cpf`

### Realizar depósito
`POST /deposit`  
Header: `cpf`
```json
{
	"description": "Depósito inicial",
	"amount": 100
}
```

### Realizar saque
`POST /withdraw`  
Header: `cpf`
```json
{
	"description": "Saque",
	"amount": 50
}
```

### Consultar saldo
`GET /balance`  
Header: `cpf`

## Como rodar o projeto

1. Clone o repositório
2. Instale as dependências:
	 ```bash
	 npm install
	 ```
3. Inicie o servidor:
	 ```bash
	 node src/index.js
	 ```
4. Acesse as rotas usando ferramentas como Postman ou Insomnia.

---

> Projeto para fins de estudo, inspirado em desafios da Rocketseat.
