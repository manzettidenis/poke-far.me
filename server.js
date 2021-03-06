'use strict'

const express = require('express'),
	app = express(),
	path = require('path'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	Sequelize = require('sequelize'),
	db = require('./server/models'),
	Config = require('./config/config'),
	Router = require('./server/routes')

app.use((req, res, next) => {
	const allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://127.0.0.1:4000', 'http://localhost:4000']
	const origin = req.headers.origin
	if (allowedOrigins.indexOf(origin) > -1) {
		res.setHeader('Access-Control-Allow-Origin', origin)
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
	} else {
		res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
	}
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	res.header('Access-Control-Allow-Credentials', true)

	return next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json'}))

if(process.env.NODE_ENV === 'dev') {
    //use morgan to log at command line
    app.use(morgan('tiny'))
}

app.use('/', Router)
app.use(express.static(path.join(__dirname, 'public/dist')))
db.sequelize.sync().then(() => {
	console.log('all models are sync')
	app.listen(Config.application.port, () => {
		console.log('Express listening on port:', Config.application.port)
	})
})


module.exports = app
