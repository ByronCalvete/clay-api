const express = require('express');
const cors = require('cors');

const app = express();
const logger = require('./loggerMiddlewares');

app.use(cors());
app.use(express.json());

app.use(logger);

let motorbikes = [
	{
		id: 1,
		name: 'Andrés Parra',
		date: '2019-05-30T17:30:31.098Z',
		active: true,
		phone: '11 1111 1111',
		price: 'ARS $200',
		role: 'Eventual',
		licensePlate: 'A123BCD',
	},
	{
		id: 2,
		name: 'Juan Díaz',
		date: '2019-05-30T18:39:34.091Z',
		active: false,
		phone: '22 2222 2222',
		price: 'ARS $230',
		role: 'Fijo',
		licensePlate: 'E345FGH',
	},
	{
		id: 3,
		name: 'Camila Rodríguez',
		date: '2019-05-30T19:20:14.298Z',
		active: true,
		phone: '33 3333 3333',
		price: 'ARS $180',
		role: 'Por pedido',
		licensePlate: 'I678JKL',
	},
];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, {  'Content-Type': 'application/json' })
//   response.end(JSON.stringify(motorbikes))
// })

app.get('/', (request, response) => {
	response.send('<h1>Hola Byron</h1>');
});

app.get('/api/motorbikes', (request, response) => {
	response.json(motorbikes);
});

app.get('/api/motorbikes/:id', (request, response) => {
	const id = Number(request.params.id);
	const motorbike = motorbikes.find((motorbike) => motorbike.id === id);

	if (motorbike) {
		response.json(motorbike);
	} else {
		response.status(404).end();
	}
});

app.delete('/api/motorbikes/:id', (request, response) => {
	const id = Number(request.params.id);
	motorbikes = motorbikes.filter((motorbike) => motorbike.id !== id);
	response.status(204).end();
});

app.post('/api/motorbikes', (request, response) => {
	const motorbike = request.body;
	if (!motorbike || !motorbike.name) {
		return response.status(400).json({
			error: 'motorbike.name is missing',
		});
	}

	const ids = motorbikes.map((motorbike) => motorbike.id);
	const maxId = Math.max(...ids);

	const newMotorbike = {
		id: maxId + 1,
		name: motorbike.name,
		date: new Date().toDateString(),
		active: typeof motorbike.active !== 'undefined' ? motorbike.active : false,
		phone: motorbike.phone,
		price: motorbike.price,
		role: motorbike.role,
		licensePlate: motorbike.licensePlate,
	};

	motorbikes = [...motorbikes, newMotorbike];

	response.status(201).json(newMotorbike);
});

app.use((request, response) => {
	console.log(request.path);
	response.status(404).json({
		error: 'Not found',
	});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
