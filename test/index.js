var path = require('path');
var Nightmare = require('nightmare');
var should = require('chai').should();

describe('Nightmare navigation test', function () {
    this.timeout(15000); // Set timeout to 15 seconds, instead of the original 2 seconds

    var url = 'http://localhost:8080/todo';

    describe('Start page', function () {
        it('should show two forms when loaded : todo form and save todolistform', function (done) {
            new Nightmare({show: false})
                .goto(url)
                .evaluate(function () {
                    return document.querySelectorAll('form').length;
                })
				.then((result) => {
					console.log(">>>>>>>>>"+result);
                    result.should.equal(2);
                    done();
                })
		});
	});
	describe("Save new todolist in database then delete it to keep database's integrity.", function () {
        it('should add an item in the todolist and save it in db', function (done) {
			const expected = 1;
            new Nightmare({show: true})
                .goto(url)
				.type('input[name="newtodo"]', "Avancer le projet")
				.click('input[name="todosubmit"]')
				.wait(1000)
				.type('input[name="todolistsname"]', "Smith")
				.type('input[name="todolistsfirstname"]', "John")
				.click('input[name="listsubmit"]')
				.wait(1000)
                .evaluate(function () {
					console.log(">>>>>>>>>"+document.querySelectorAll('li.Smith').length);
                    return document.querySelectorAll('li.Smith').length;
                })
				.then((result) => {
					console.log(">>>>>>>>>"+result);
                    result.should.equal(expected);
                    done();
                })
		});
		it("should delete John Smith's todolist from database", function (done) {
			const expected = 0;
            new Nightmare({show: true})
                .goto(url)
				.click('a[class="Smith"]')
				.wait(1000)
                .evaluate(function () {
					console.log(">>>>>>>>>"+document.querySelectorAll('li.Smith').length);
                    return document.querySelectorAll('li.Smith').length;
                })
				.then((result) => {
					console.log(">>>>>>>>>"+result);
                    result.should.equal(expected);
                    done();
                })
		});
	});
	
	
});