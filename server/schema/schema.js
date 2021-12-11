const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author')


const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// var books = [
//     { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
//     { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
//     { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
//     { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
//     { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
//     { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
// ];

// var authors = [
//     { name: 'Patrick Rothfuss', age: 44, id: '1' },
//     { name: 'Brandon Sanderson', age: 42, id: '2' },
//     { name: 'Terry Pratchett', age: 66, id: '3' }
// ];

// Type relations!  SHowing GQL that books have authors
const BookType  = new GraphQLObjectType({
    name: 'Book',
    // The reason that we have the fields as a function is because we want to load ALL the types before doing relations
    // Will not work otherwise
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve( parent, args ){
               console.log(parent);
            //    Here we are looking through the list of authors for one who has an authorId which matches the ID of the parent.aurthorId 
            //    return _.find(authors, { id: parent.authorId }) 
                return Author.findById(parent.authorId)
            }
        }
    })
})

// Type relations!  SHowing GQL that authors have books

const AuthorType  = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve( parent, args ){
                // Looking in the books array for any book which has an authorId of 2 for example and will return all of them as a list
                // return _.filter(books, {authorId: parent.id })
                return Book.find({
                    authorId: parent.id
                })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // args.id,
                // _.find is a lodash method
                // return _.find(books, { id: args.id })
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // args.id,
                // return _.find(authors, { id: args.id })
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve( parent,args ){
                // return books
                //  when you passs in an empty object it will return all the books as they will all match cause you are not setting any criteria
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors;
                return Author.find({})
            }
        }
    }
})


// const Mutation = newGraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//         type: AuthorType,
//         args: {
//             name: { type: GraphQLString },
//             age: { type: GraphQLInt }
//         },
//         resolve( parent, args){
//             let author = new Author
//         }
//     }
// })


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type:  new GraphQLNonNull( GraphQLString ) },
                age: { type:  new GraphQLNonNull( GraphQLInt ) }
            },
            resolve( parent, args ){
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull( GraphQLString ) },
                genre: { type:  new GraphQLNonNull( GraphQLString ) },
                authorId: { type:  new GraphQLNonNull( GraphQLID ) }
            }, 
            resolve ( parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
