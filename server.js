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
// Inclusion de Mongoose
var mongoose = require('mongoose');
// on se connecte à la db
mongoose.connect('mongodb://127.0.0.1:27017/todolist', function(err,db) {
	if (err) { throw err; }
	console.log('Connecté à la base de données todolist.');
	new Promise((resolve, reject) => {
		
		var todolistSchema = new mongoose.Schema({
		"nom": String, "prenom" :  String,
		"todo" : [String]
		});
		// Création du Model pour les commentaires
		var todolistModel = mongoose.model('todolists', todolistSchema);
		/*var matodolist = new todolistModel({	"nom": "Papi", "prenom" : "Michou",
						"todo" : ["Dormir", "Dormir"]});
		

		matodolist.save(function (err) {
		if (err) { throw err; }
		console.log('Liste ajoutée avec succès !');
		});*/
	  
	  
		var query = todolistModel.find(null);
		query.exec(function (err, lists) {
		if (err) { throw err; }
		// On va parcourir le résultat et les afficher joliment
		var list;
		for (var i = 0, l = lists.length; i < l; i++) {
			list = lists[i];
			console.log('------------------------------');
			console.log('Nom : ' + list.nom);
			console.log('Prenom : ' + list.prenom);
			console.log('Taches : ' + list.todo);
			console.log('------------------------------');
			}
		});
	}).then(() => mongoose.connection.close()); // Fermeture de la connexion
	
    
});












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
    res.render('todo.ejs', {todolist: req.session.todolist});
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