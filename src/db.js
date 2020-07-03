const { MongoClient, ObjectId } = require('mongodb')
const mongoose = require('mongoose');

const path = require('path');
const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'db=noobjs_dev'
const cust = require(path.join(__dirname,'models/customer'))
const Customer = mongoose.model('Customers');






module.exports = (function(){
	return{
		index: function(req,res){
			console.log(":::::The backend controller has been asccessed, sir::::::::::");
			Customer.find({}, function(err, results){
				if(err){
					console.log(err+"ooooooo There seems to be a back controller error, sir oooooooo");
				}else{
					console.log("8888  Backend query selection was successful, sir  8888888888");
					res.json(results);
					// console.log(results);
				}
			})

		},
		create: function(req, res){
			// console.log(req.body);
			var customer = new Customer(req.body);
			customer.save(function(err, results){
				if(err){
					console.log("}}}}}}}}} Data Creation: Unsuccessful, sir {{{{{{{{{{")
				}else{
					console.log("-+-+-+-+  Backend creation was successful, sir  -+-+-+-+");
					res.json(results)
				}
			})
		},
		delete: function(req,res){
			// console.log(req.params)
			Customer.remove({_id: req.params._id}, function(err, end){
				if(err){
					console.log(err+" --------there seems to be a deletion from database error, sir----------");
				}else{
					console.log(end+" ::::::::  Deletion from DATABASE SUCCESSFUL, sir :::::::::::")
					res.json(end);
				}
			});
		}
	}
})();






// const init = (() => {
//   console.log('i');
  
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
    console.log(dbName);
    
    db = client.db(dbName)
  })
// })

//module.exports = { init}