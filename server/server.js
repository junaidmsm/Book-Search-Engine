const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const path = require('path');
const db = require('./config/connection');
//const routes = require('./routes');

//connect to MongodDB
const MONGODB_URI = process.env.MONGOATLAS
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Cluster0');


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbUser:05December2022@cluster0.yduww1p.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



//import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

//create new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

//integrate our Apollo server with Express application as middleware


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 //if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

//integrate our Apollo server with Express application as middleware
const startApolloServer = async () => {
  await server.start();

server.applyMiddleware({app});

//app.use(routes); //comment this out in the end


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

  });
});
};
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

startApolloServer();