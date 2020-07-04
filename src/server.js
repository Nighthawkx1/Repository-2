require('dotenv').config();
const express = require('express')
const serveIndex = require('serve-index')
const join = require('path').join;
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
// const mongoose = require('mongoose');
const { Parser } = require('json2csv');

const methodOverride = require('method-override')





const config = require('./config');
// const { init } = require('./db')
const routes = require('./routes')
// const cust = require(path.join(__dirname, 'models/customer'))


const app = express()
const port = 3000
const filesOut = './src/resources/files/out'
const files = '/src/resources/files'
const resources = '/resources/files'
const nodeModules = path.join(__dirname, '../node_modules');
//const models = join(__dirname, 'app/models');
const router = express.Router()

// const Customer = mongoose.model('Customers');

app.use(methodOverride())

app.use(express.static('src'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(routes)

//Indexing
app.use(files, express.static(files), serveIndex(files, { 'icons': true }))
app.use(filesOut, express.static(filesOut), serveIndex(filesOut, { 'icons': true }))


app.use((req, res) => {
  res.status(404).send({
    message: `${req.method} ${req.url} not found`,
  });
});




// app.get('/customers', async (req, res) => {
//   //const customers = await (await Customer.find());
//   await Customer.find({}, function (err, c) {


//     if (err) {
//       console.log(err);

//       return res.status(500).json({ err });
//     } else {



//       let fields = Object.keys(JSON.parse(JSON.stringify(c[0])));
//       //console.log(Object.values(c[0]));


//       const opts = { fields, header: false };

//       const parser = new Parser(opts);
//       let csv = parser.parse(c);
//       console.log(csv);
//       const filename = path.join(__dirname, 'resources/files/out', 'export.csv');
//       fs.writeFile(filename, csv, function (err) {
//         if (err) {
//           return res.json(err).status(500);
//         }
//         else {
//           setTimeout(function () {
//             fs.unlink(filename, function (err) { // delete this file after 30 seconds
//               if (err) {
//                 console.error(err);
//               }
//               console.log('File has been Deleted');
//             });

//           }, 30000);
//           res.download(filename);
//         }


//       });
//     }

//   });

// });


//Static
app.use(express.static(files))
app.use(express.static(nodeModules))

//Serve node modules
function staticfile(aFilepath) {
  return function (aReq, aRes, aNext) {
    aRes.sendfile(aFilepath);
  };
};
function npmls() {
  app.use('/node_modules/', express.static(nodeModules), serveIndex(nodeModules, { 'icons': true }))
  require('child_process').exec('npm ls --json', function (err, stdout, stderr) {
    if (err) return console.log(err)

    let npms = JSON.parse(stdout);
    npms = Object.keys(npms.dependencies);
   // console.log(npms);

    return npms.forEach(function (e, aIndex, aArray) {
      let p = path.join(__dirname, '../node_modules/', e);
      let fp = path.join(p, e);
      staticfile(fp);
      app.use(express.static(p))

      app.use(fp, express.static(p));

    });

  });
}
npmls();



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/demo.html');
});



app.get('/file/:name', function (req, res, next) {
  let fn = path.join(__dirname, resources, req.params.name);
  console.log(fn);
  res.sendFile(fn);

});


//Serve files
app.get('/files/:name', function (req, res, next) {
  var fName = req.params.name
  var filename = filesOut + '/' + fName;
  var out = path.join(__dirname, '/resources/files/out');
  var options = {
    root: out,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  res.sendFile(fName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fName)
    }
  })
});

app.post('/new', function (req, res, next) {
  //console.log(req.body);
  let filter = {};
  if (req.body.Phone) {
    filter = { Phone: req.body.Phone };
  }
 // console.log(filter);

  // Customer.countDocuments(filter, function (err, count) {
  //   if (count > 0) {
  //     let doc = Customer.findOneAndUpdate(filter, req.body, {
  //       new: true,
  //       upsert: true // Make this update into an upsert
  //     });
  //   } else {
      var cc = new Customer(req.body);
      cc.save(function (err, cc) {
        if (err) return console.error(err);

    //   });
    // }
  });
res.end();

});
app.post('/files/:name', function (req, res, next) {

  var fName = req.body.fName
  var filename = filesOut + '/' + fName;
  var out = path.join(__dirname, '/resources/files/out');
  console.log(req.body.data);

  fs.writeFileSync(path.join(out, fName), req.body.data);
  var options = {
    root: out,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }


  res.sendFile(fName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fName)
    }
  })

})






function listen() {
  if (app.get('env') === 'test') return;
  app.listen(port);
  console.log('Express app started on port ' + port);
}

// function connect() {
//   mongoose.connection
//     .on('error', console.log)
//     .on('disconnected', connect)
//     .once('open', listen);
//   return mongoose.connect(config.db, {
//     keepAlive: 1,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
// }


// mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

// let c = {
//   "CompanyName": "CompanyName",
//   "Name": "Name",
//   "Company": "Company",
//   "Contact": "Contact",
//   "Company2": "Company2",
//   "Phone": "Phone",
//   "Email": "Email",
//   "Address": "Address",
// };
// var cc = new Customer(c);
// cc.save(function (err, cc) {
//   if (err) return console.error(err);

// });
// Initialize the database
// init().then(() => {
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
// });
