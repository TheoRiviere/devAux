var assert = require('assert');
var page = require('../server');

describe('page', function() {
    describe('test de rien', function() {
        it('test exemple', function () {
            var result = 1+1;
            assert.equal(result, 2);
        });
    });
});