var http = require('http');
var url = require('url');
var querystring = require('querystring');

http.createServer(function (req, res) {  
    var params = querystring.parse(url.parse(req.url).query);
    res.writeHead(200, {"Content-Type": "text/plain"});
	if('prenom' in params && 'nom' in params){
		res.write('Vous vous appelez ' + params['prenom'] + ' ' + params['nom'] + ' ! Je vous connais bien maintenant.');
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
}).listen(8080, '127.0.0.1'); //prod : port 80
console.log('Server currently listening...');