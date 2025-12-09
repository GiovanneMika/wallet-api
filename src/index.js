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
    const { cpf } = request;
    const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);
    if (customerAlreadyExists) {
        return response.status(403).json(
            {
                error: `Esse cpf ja está em uso!`,
            }
        );
    }
}

app.post("/account", (request, response) => {
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

// function onSuccess() {
//     customers.push({
//         cpf,
//         name,
//         id,
//         statemet: []
//     });
//     return response.status(201).send(
//         {
//             message: `Conta de ${name} criada!`,
//         }
//     );
// }

// function returnBrabo(ret) {
//     return ret;
// }

// customerAlreadyExists ? onSuccess() : returnBrabo(response.status(403).json(
//     {
//         error: `Esse cpf ja está em uso!`,
//     }
// ));


// if (!customers.find(customer => customer.cpf === cpf)) {
//     customers.push({
//         cpf,
//         name,
//         id,
//         statemet: []
//     });
// } else {
//     return response.status(403).send(
//         {
//             message: `Esse cpf ja está em uso!`,
//         }
//     );
// }

app.get("/accounts", (request, response) => {
    return response.send(customers);
})


app.get("/account/:id", verifyIfExistsAccountID, (request, response) => {

    const { customer } = request;

    return response.json(customer);
})


app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});

app.listen(3333);