var child_process = require('child_process')
var server = global.server;
var server_port = global.port;
var assert = require('assert');
var path = require('path');
var fs = require('fs');

describe('Single Instance APP', function() {
    var counter = [0,0,0];//true,false,default
    var i = 0;//true->0, false->1, default->2
    var pushData = function(socket) {
        socket.on('data', function(data) {
            counter[i] += 1;
        })
    };
    var run3App = function(path,fn) {
        var spawn = child_process.spawn;
        var child1 = spawn(process.execPath, [path, server_port]);
        var child2 = undefined;
        var child3 = undefined;
        setTimeout(function(){
            child2 = spawn(process.execPath, [path, server_port]);
            child3 = spawn(process.execPath, [path, server_port]);
            setTimeout(function(){
                child1.kill();
                child2.kill();
                child3.kill();
                if (typeof fn ==='function'){
                    (fn)();
                }
            },500);
        },500);
    };

    var app_path = path.join(global.tests_dir, 'app-single-instance','app');
    var manifest_path = path.join(global.tests_dir,'app-single-instance','app','package.json');
    var isTrue = function(fn){
        var manifest = {
            "name":"ASI",
            "main":"index.html",
            "single-instance":true
        };
        i = 0;
        fs.writeFileSync(manifest_path,JSON.stringify(manifest));
        run3App(app_path,fn);
    };
    var isFalse = function(fn){
        var manifest = {
            "name":"ASI",
            "main":"index.html",
            "single-instance":false
        };
        i = 1;
        fs.writeFileSync(manifest_path,JSON.stringify(manifest));
        run3App(app_path,fn);
    };
    var isDefault = function(fn){
        var manifest = {
            "name":"ASI",
            "main":"index.html"
        };
        i = 2;
        fs.writeFileSync(manifest_path,JSON.stringify(manifest));
        run3App(app_path,fn);
    };

    before(function(done) {
        this.timeout(0);
        server.on('connection', pushData);
        isTrue(function(){
            isFalse(function(){
                isDefault(done);
            });
        });
    });

    it('single-instance is true', function(done) {
        assert.equal(counter[0], 1);
        done();
    });

    it('single-instance is false', function(done) {
        assert.equal(counter[1], 3);
        done();
    });

    it('single-instance is default', function(done) {
        assert.equal(counter[2], 1);
        done();
    });

    after(function(done) {
        server.removeListener('connection', pushData);
        fs.unlinkSync(manifest_path);
        done();
    });
});