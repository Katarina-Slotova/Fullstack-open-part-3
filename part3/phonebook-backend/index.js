require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
let morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

/* let persons = [
	{ 
		"id": 1,
		"name": "Arto Hellas", 
		"number": "040-123456"
	  },
	  { 
		"id": 2,
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	  },
	  { 
		"id": 3,
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	  },
	  { 
		"id": 4,
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	  }
] */

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons)
	})
})

app.get('/api/info', (request, response) => {
	response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
	Person.findById(request.params.id).then((person) => {
		if (person) {
			response.json(person)
		  } else {
			response.status(404).end()
		  }
	})
})

app.delete('/api/persons/:id', (request, response) => {
	Person.deleteOne(request.params.id).then((result) => {
		response.status(204).end()
	})
	
})

const generateId = (maxVal) => {
	const randomId = persons.length > 0 ? Math.floor(Math.random(maxVal) * maxVal) : 0
	return randomId
}

app.post('/api/persons', (request, response) => {
	const body = request.body
	const checker = persons.find(person => person.name === body.name)
	
	if (!body.name){
		response.status(400).json({
			error: 'name is missing'
		})
	}

	if (!body.number){
		response.status(400).json({
			error: 'number is missing'
		})
	}

	if(checker){
		console.log('This name already is in your phonebook')
		response.status(400).json({
			error: 'This name already is in your phonebook'
		})
	}


	const person = {
		id: generateId(100000),
		name: body.name,
		number: body.number
	}

	persons = persons.concat(person)

	response.json(person)
	console.log(persons)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})