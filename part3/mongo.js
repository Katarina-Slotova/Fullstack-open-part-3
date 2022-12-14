const mongoose = require('mongoose')

if(process.argv.length < 3){
	console.log('Please provide your password, name and phone number as parameters: node mongo.js <password> <name> <number>')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://kata-phonebook:${password}@cluster0.nf9bulr.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
	mongoose
		.connect(url)
		.then((result) => {
			console.log('phonebook:')
			Person.find({}).then(result => {
				result.forEach(person => {
					console.log(person.name, person.number)
					
				})
				mongoose.connection.close()
			})
		})
} else {
	mongoose
		.connect(url)
		.then((result) => {
			const person = new Person({
				name: process.argv[3],
				number: process.argv[4],
			})
			return person.save()
		})
	.then(() => {
		console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
		return mongoose.connection.close()
	})
	.catch((err) => console.log(err))
}