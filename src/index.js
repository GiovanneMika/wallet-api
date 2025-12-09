const express = require('express');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];


function verifyIfExistsAccountCPF(request, response, next) {

    const { cpf } = request.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({ erro: "A conta não existe!" })
    }

    request.customer = customer;

    return next();

}

function getBalance(statement) {
    const balance = statement.reduce((acc, item) => {
        if (item.type === "credit")
            return acc + item.amount;
        if (item.type === "debit")
            return acc - item.amount;
    }, 0);

    return balance;

}

function verifyIfExistsAccountID(request, response, next) {

    const { id } = request.params;

    const customer = customers.find(customer => customer.id === id);

    if (!customer) {
        return response.status(400).json({ erro: "A conta não existe!" })
    }

    request.customer = customer;

    return next();

}

function verifyIfAccountAlreadyExists(request, response, next) {
    const { cpf } = request.body;
    const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);
    if (customerAlreadyExists) {
        return response.status(403).json(
            {
                error: `Esse cpf ja está em uso!`,
            }
        );
    }
    return next();
}

app.post("/account", verifyIfAccountAlreadyExists, (request, response) => {
    const { name, cpf } = request.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send(
        {
            message: `Conta de ${name} criada!`,
        }
    );
})

app.get("/accounts", (request, response) => {
    return response.send(customers);
})


app.get("/account/:id", verifyIfExistsAccountID, (request, response) => {

    const { customer } = request;

    return response.json(customer);
})

app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.status(200).json(customer);
})

app.put("/account", verifyIfExistsAccountCPF, (request, response) => {

    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(201).json({
        message: "Alteração feita com sucesso!"
    })
})

app.delete("/account", verifyIfExistsAccountCPF, (request, response)=>{
    const {customer} = request;
    customers.splice(customer, 1);

    return response.status(200).json(customers);
})


app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + " 00:00");
    console.log(dateFormat.toLocaleDateString());

    const statement = customer.statement.filter(statement => statement.created_at.toLocaleDateString() === new Date(dateFormat).toLocaleDateString());


    return response.json(statement);

});


app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;
    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).json({
        message: `Depósito de R$${amount} realizado na conta de ${customer.name}`,
        saldo: `${getBalance(customer.statement)}`
    })
})

function verifyEnoughBalance(request, response, next) {
    const { customer } = request;
    const { amount } = request.body;

    if (getBalance(customer.statement) - amount < 0) {
        return response.status(400).json({
            message: "Saldo insuficiente!"
        })
    }
    return next();

}

app.post("/withdraw", verifyIfExistsAccountCPF, verifyEnoughBalance, (request, response) => {

    const { customer } = request;
    const { description, amount } = request.body;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).json({
        message: `Débito de R$${amount} realizado na conta de ${customer.name}`,
        saldo: `${getBalance(customer.statement)}`
    })
})

app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
    const {customer} = request;
    const balance = getBalance(customer.statement);

    return response.status(200).json({
        message: `O saldo atual desse cpf é de R$${balance}`,
        statements: customer.statement
    })
})
app.listen(3333);