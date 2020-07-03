const graphql = require('graphql');
const Customers = require('../db/customers.js');

const { 
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString, 
  GraphQLInt, 
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull
} = graphql;
  
const CustomersType = new GraphQLObjectType({
  name: 'Customers',
  fields: () => ({
    id: { type: GraphQLString },
    address: { type: GraphQLString },
    CompanyName: { type: GraphQLString },
    Name: { type: GraphQLString },
    Company: { type: GraphQLString },
    Contact: { type: GraphQLString },
    Company2: { type: GraphQLString },
    Phone: { type: GraphQLString },
    Email: { type: GraphQLString },
    Address: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    everyCustomers: {
      type: new GraphQLList(CustomersType),
      resolve() {
        return Customers.find({});
      }
    },
    customers: {
      type: CustomersType,
      args: { id: { type: GraphQLString}},
      resolve(parent, args) {
        return Customers.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomers: {
      type: CustomersType,
      args: {
        id: { type: GraphQLString },
        address: { type: GraphQLString },
        CompanyName: { type: GraphQLString },
        Name: { type: GraphQLString },
        Company: { type: GraphQLString },
        Contact: { type: GraphQLString },
        Company2: { type: GraphQLString },
        Phone: { type: GraphQLString },
        Email: { type: GraphQLString },
        Address: { type: GraphQLString }
      },
      resolve(parent, args) {
        const customers = new Customers(args);
        return customers.save();
      }
    },
    updateCustomers: {
      type: CustomersType,
      args: {
        id: { type: GraphQLString },
        address: { type: GraphQLString },
        CompanyName: { type: GraphQLString },
        Name: { type: GraphQLString },
        Company: { type: GraphQLString },
        Contact: { type: GraphQLString },
        Company2: { type: GraphQLString },
        Phone: { type: GraphQLString },
        Email: { type: GraphQLString },
        Address: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Customers.findByIdAndUpdate(args.id, args);
      }
    },
    deleteCustomers: {
      type: CustomersType,
      args: { id: { type: GraphQLString}},
      resolve(parent, args) {
        return Customers.findByIdAndRemove(args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});