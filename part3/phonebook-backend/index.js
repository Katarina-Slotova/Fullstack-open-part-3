require('dotenv').config()
const express = require('express')
const app = express()
let morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons)
	})
})

app.get('/api/info', (request, response) => {
	response.send(`<p>Phonebook has info for ${Person.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => {
			next(error)
		})
})

const generateId = (maxVal) => {
	const randomId = Person.length > 0 ? Math.floor(Math.random(maxVal) * maxVal) : 0
	return randomId
}

app.post('/api/persons', (request, response) => {
	const body = request.body

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

	Person.find({}).then(persons => {
		const checker = persons.find(person => person.name === body.name)
		
		if(checker){
			console.log('This name already is in your phonebook')
			response.status(400).json({
				error: 'This name already is in your phonebook'
			})
		}
	
		const person = new Person ({
			id: generateId(100000),
			name: body.name,
			number: body.number
		})
	
		person.save().then(savedContact => {
			response.json(savedContact)
		})
	})
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})