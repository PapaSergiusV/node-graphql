const fs              = require('fs');
const path            = require('path');
const dotenv          = require('dotenv');
const express         = require('express');
const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');
const cors            = require('cors');
const graphqlHTTP     = require('express-graphql').graphqlHTTP;
const morgan          = require('morgan');
const schema          = require('./graphql/schema');

dotenv.config()

const { env } = process;

const app = express()

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// CORS configuration, in which the origin parameter
// is responsible for recalculation of hosts that enable 
// queries to the server and credentials to  
// pass cookies 
// const corsOptions = {
//   origin: ['*'],
//   credentials: true
// };

app
  .use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-type] ":referrer" ":user-agent"', { stream: accessLogStream }))
  .use(cors())
  .use('/graphql', graphqlHTTP({ schema, graphiql: true }))
  // .use(bodyParser.urlencoded({ extended: false }))
  // .use(bodyParser.json())
  // .use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(env.PORT, () => {
  console.log(`Server is running at ${env.HOST}:${env.PORT}`);
})


