var path = require('path');
var app_test = require('./nw_test_app');

describe('Plugin', function() {
  describe('flash', function(){
    this.timeout(0);
    it('should not crash', function(done) {
      var result = false;
      var crontab = undefined;

      var child = app_test.createChildProcess({
        execPath: process.execPath,
        appPath: path.join(global.tests_dir, 'plugin', 'flash'),
        end: function(data, app) {        
          if (crontab){
            clearTimeout(crontab);
          }
          result = true;
          app.kill();
          done();
        }
      });

      crontab = setTimeout(function(){
        if (!result) {
          done('nw crash.');
          child.close();
          //child.removeConnection();
        }
      }, 4000);


    })
  })
})
