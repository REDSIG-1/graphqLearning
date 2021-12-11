# graphql-playlist
All course files for the GraphQL tutorial playlist on The Net Ninja YouTube channel.

Node modules are not included in the course files. After download, run npm install to install the modules (client and server folders)


## Getting started

in the server directory run this command `node app`

This gets the express app up and running 

Or better: `nodemon app` will obvs listen for changes :)

Now go to `localhost:4000/graphql`

As we have passed `graphiql: true` into the app.use function we will be able to interact with GQL using the graphiql tool!


### Example Query

{
	book(id: 2){
    name 
    genre
  }
}


In the docs in graphiql you can explore the root queries which are of course evident in the schema.js

So root queries could be: book, author, books, authors.


##### Current Eposide

Episode 31 - wooooooooooooooo
