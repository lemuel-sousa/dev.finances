const Modal = {
    open() {
        // Abrir o modal
        // Adicionar a class active no modal
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },

    close() {
        // Fechar o modal
        // Remover a class active no modal
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

const Transaction = {
    all: [
        {
            description: 'Luz',
            amount: -50000,
            date: '23/01/2022',
        },
        {
            description: 'Criação Web Site',
            amount: 500000,
            date: '23/01/2022',
        },
        {
            description: 'Internet',
            amount: -20000,
            date: '23/01/2022',
        },
        {
            description: 'App',
            amount: 20000,
            date: '23/01/2022',
        },
        {
            description: 'Mentoria',
            amount: 80000,
            date: '23/01/2022',
        }],

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income;

    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })

        return expense;
    },

    total() {
        let total = Transaction.incomes() + Transaction.expenses();

        return total;
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-transactions tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHtmlTransition(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHtmlTransition(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"


        const amount = Utils.formatCurrency(transaction.amount)


        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove${(index)}" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },


    updateBalance() {
        document.getElementById('income-display')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expense-display')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('total-display')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100

        return value
    },

    formatDate(date){
        splitDate = date.split("-")

        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`

    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
        formattedValue = signal + value
        return formattedValue
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },


    
    validateFields() {
        const { description, amount, date} = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },
    
    formatedValues() {
        let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }

    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()
        
        try {
            // Verificar todas informações preenchidas
            Form.validateFields()
            // Formatar dados para salvar
            const transaction = Form.formatedValues()
            // salvar
            Transaction.add(transaction) //Reload na função add
            // Apagar os dados do formulário
            Form.clearFields()
            // Fechar Modal
            Modal.close()
           
        } catch (error) {
             alert(error.message)
        }



        
    }
}

const App = {
    init() {

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        DOM.updateBalance()
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()