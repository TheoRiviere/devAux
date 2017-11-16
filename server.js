var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;



// Inclusion de la mongodb
var MongoClient = require("mongodb").MongoClient;
var MongoObjectID = require("mongodb").ObjectID;
// Inclusion de Mongoose
var mongoose = require('mongoose');

//Inclusion de asynch pour synchroniser la fermeture de la connection a la db apres les inserts à effectuer
var async = require("async");


var todolistSchema = new mongoose.Schema({
			"nom": String, "prenom" :  String,
			"todo" : [String]
			});
// Création du Model pour les commentaires
var todolistModel = mongoose.model('todolists', todolistSchema);




/* On utilise les sessions */
app.use(session({secret: 'todotopsecret'}))
/* Le paramètre secret envoyé au module de session est obligatoire : il permet de sécuriser les cookies de session */

/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
})





/* On affiche la todolist et le formulaire */

.get('/todo', function(req, res) { 
	var namelist=[];
	var idlist=[];
	var firstnamelist=[];
	mongoose.connect('mongodb://127.0.0.1:27017/todolist', function(err,db) {
		if (err) { throw err; }
		
		console.log('Connecté à la base de données todolist.');
			
		todolistModel.find({}, function(err, lists) {
			if (err) { throw err; }
			else
			{
				for (var i = 0, l = lists.length; i < l; i++) 
				{
					namelist.push(lists[i].nom);
					firstnamelist.push(lists[i].prenom);
					idlist.push(lists[i].id);
				}
			}
		});
		res.render('todo.ejs', {namelist : namelist,firstnamelist : firstnamelist,idlist : idlist, todolist: req.session.todolist });
		
	}).then(() => {	mongoose.connection.close();
					console.log('Déconnecté de la base de données.');
					}); // Fermeture de la connexion
})


/* On affiche la todolist de la personne selectionnée */

.get('/todo/listof/:id', function(req, res) { 
	var name=[];
	var todo=[];
	var objToFind     = { _id: new MongoObjectID(req.params.id) };
	mongoose.connect('mongodb://127.0.0.1:27017/todolist', function(err,db) {
		if (err) { throw err; }
		
		console.log('Connecté à la base de données todolist.');
			
		todolistModel.findOne(objToFind, function(err, list) {
			if (err) { throw err; }
			else
			{
				name.push(list.nom);
				for (var i = 0, l = list.todo.length; i < l; i++) 
				{
				todo.push(list.todo[i]);
				}
			}
		});
		res.render('todoof.ejs', {	name : name,
									todo : todo});
		
	}).then(() => {	mongoose.connection.close();
					console.log('Déconnecté de la base de données.');
					}); // Fermeture de la connexion
})


/* On enregistre une tooliste dans la db */

.post('/todo/enregistrer/', urlencodedParser, function(req, res) {
	console.log(req.body.todolistsfirstname);
	console.log(req.body.todolistsname);
	console.log(req.session.todolist);
	var rowsToSave = [];
   if (req.body.todolistsfirstname != '' && req.body.todolistsname != '' & req.session.todolist!=[] ) {
        mongoose.connect('mongodb://127.0.0.1:27017/todolist', function(err,db) {
		if (err) { throw err; }
		
		console.log('Connecté à la base de données todolist.');
		//On crée la model de données à insérer dans la db
		var matodolist = new todolistModel({	"nom": req.body.todolistsname, "prenom" : req.body.todolistsfirstname,
						"todo" : req.session.todolist});
		console.log(matodolist);
		
		//On insère
		matodolist.save(function (err) {
		if (err) { throw err; }
		console.log('Liste ajoutée avec succès !');
		mongoose.connection.close(function () 
		{// Fermeture de la connexion
			console.log('Déconnecté de la base de données.');	
		});
		//On redirige vers a page d'acceuil
		res.redirect('/todo');
		});
		
		
		
		
		}) 
    }
	else
	{
		console.log('Todolist non enregistrée. Champ nom ou prénom non complété OU liste des tâches vide.');
		res.redirect('/todo');
	}
    
})


/* On ajoute un élément à la todolist */

.post('/todo/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/todo');
})

/* Supprime un élément de la todolist */
.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

/* On redirige vers la todolist si la page demandée n'est pas trouvée */

.use(function(req, res, next){
    res.redirect('/todo');
})


app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
console.log('Server currently listening...');