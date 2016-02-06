// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// var db;

var app = angular.module('starter', ['ionic', 'starter.controllers','ionic-color-picker','ngCordova','pemasukan.controllers','pengeluaran.controllers','pie-chart.controllers','detil-grafik.controllers'])
var db;
app.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }    

    if (window.cordova) {            
            //db = $cordovaSQLite.openDB({ name: "my.database34" }); //device
            db = window.sqlitePlugin.openDatabase({name: "my.database35", androidDatabaseImplementation: 2});
        }
    else{
             db = window.openDatabase("my.database35", '1', 'my', 1024 * 1024 * 100); // browser
        }                
        
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS users(id integer primary key, username text, password text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS pemasukan (id integer primary key, jumlah int, tabung int, tanggal DATE, toggle BOOLEAN, kategori int)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS pengeluaran (id integer primary key, nama text, jumlah int, tanggal DATE, kategori int)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS kategori(id integer primary key, nama text, warna text )");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS kategoripengeluaran(id integer primary key, nama text, warna text )");
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
    // controller: 'AppCtrl'
  })

  .state('daftar', {
        url: '/daftar',
        templateUrl: 'templates/daftar.html',
        controller: 'daftarCtrl'
  })

  .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
  })

  // .state('app.login', {
  //     url: '/login',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/login.html',
  //         controller: 'LoginCtrl'
  //       }
  //     }
  //   })
 
  
  .state('app.kategori-pemasukan', {
      url: '/kategori-pemasukan',
      views: {
        'menuContent': {
          templateUrl: 'templates/pemasukan/kategori-pemasukan.html',
          controller: 'pemasukanCtrl'
        }
      }
    })
  .state('app.kategori-pengeluaran', {
      url: '/kategori-pengeluaran',
      views: {
        'menuContent': {
          templateUrl: 'templates/pengeluaran/kategori-pengeluaran.html',
          controller: 'pengeluaranCtrl'
        }
      }
    })

  .state('app.pemasukan', {
      url: '/pemasukan',
      views: {
        'menuContent': {
          templateUrl: 'templates/pemasukan/pemasukans.html',
          controller: 'pemasukanCtrl'          
        }
      }
    })

  .state('app.pengeluaran', {
      url: '/pengeluaran',
      views: {
        'menuContent': {
          templateUrl: 'templates/pengeluaran/pengeluarans.html',
          controller: 'pengeluaranCtrl'          
        }
      }
    })  
    
    
    .state('app.grafik', {
      clicked : false ,
      url: '/grafik',
      views: {
        'menuContent': {
          templateUrl: 'templates/grafik/grafik.html', 
          controller : 'pie-chartCtrl'                  
        }
      }
    })

    .state('app.forecast', {
      url: '/forecast',
      views: {
        'menuContent': {
          templateUrl: 'templates/grafik/forecast.html', 
          controller : 'forecastCtrl'         
        }
      }
    })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller : 'tambahCtrl'         
        }
      }
    })
  .state('app.detil-grafik', {
      url: '/detil-grafik/:bln',
      views: {
        'menuContent': {
          templateUrl: 'templates/grafik/detailgrafikpemasukan.html',
          controller : 'detil-grafikCtrl'         
        }
      }
    })
  .state('app.detil-grafik-pengeluaran', {
      url: '/detil-grafik-pengeluaran/:blnP',
      views: {
        'menuContent': {
          templateUrl: 'templates/grafik/detailgrafikpengeluaran.html',
          controller : 'detil-grafikCtrl'         
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/daftar');
});