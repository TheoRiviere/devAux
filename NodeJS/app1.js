var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res) {
    var params = querystring.parse(url.parse(req.url).query);
    res.writeHead(200, {"Content-Type": "text/plain"});
	if('prenom' in params && 'nom' in params){
		res.write('Vous vous appelez ' + params['prenom'] + '' + params['nom'] + ' ! Je vous connais bien maintenant.');
	}
    else if ('prenom' in params) {
        res.write('Bonjour ' + params['prenom'] + ', vous avez l\'air amical !');
    }
	else if('nom' in params){
		res.write('Encore un ' + params['nom'] + ', ils se ressemblent tous pour moi.');
	}
    else {
        res.write('Je ne vous connais pas du tout...');
    }
    res.end();
});
server.listen(8080);