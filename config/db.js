// let knex      = require('knex');
// let bookshelf = require('bookshelf');
// let dbConfig  = require('./knexfile');

// require('dotenv').config();

// module.exports = bookshelf((knex(dbConfig)), { debug: process.env.APP_ENV === 'development' });

const knex = require('knex');
const knexfile = require('../knexfile');

const env = process.env.NODE_ENV || 'development';
const configOptions = knexfile[env];

module.exports = knex(configOptions);
