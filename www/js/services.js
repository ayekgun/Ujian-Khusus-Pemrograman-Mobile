angular.module('starter.services', ['ngResource', 'ngStorage'])

.factory('Session', function ($resource) {
    return $resource('http://localhost:5000/sessions/:sessionId');
})

.factory ('StorageService', function ($localStorage) {

  $localStorage = $localStorage.$default({
    things: []
  });

  var _getAll = function () {
    return $localStorage.things;
  };

  var _add = function (thing) {
    $localStorage.things.push(thing);
  }

  var _remove = function (thing) {
    $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
  }

  return {
    getAll: _getAll,
    add: _add,
    remove: _remove
  };
})

.service('LoginService', function($q,$cordovaSQLite) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var query = "SELECT * FROM users where username=? and password=?";
            var data =  $cordovaSQLite.execute(db, query,[name,pw]).then(function(res) {
                //cek apakah user ada berdasar username dan passsword
                //nilai res.rows.length akan lebih dari 0 jika user sudah terdaftar di table.
                if(res.rows.length > 0) {                
                    //perulangan optional bisa di pakai atau tidak hanya digunakan untuk menampilkan data dg bentuk json array
                    for(i=0;i<res.rows.length;i++){
                        data[i] = res.rows.item(i);          
                    }
                    deferred.resolve('Selamat Datang ' + name + '!');                        
                    // console.log(data[0]);
                } else {
                    deferred.reject('Maaf Username atau Passsword Salah.');
                }
            }, function (err) {
                console.error(err);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
});