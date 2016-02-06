angular.module('starter.controllers', ['chart.js','ionic','ionic-color-picker','starter.services'])


.controller('popoverCtrl', function($scope, $ionicPopover) {

  // .fromTemplate() method
  var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
})


.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $ionicModal, $timeout) {
  $ionicModal.fromTemplateUrl('templates/login.html', {    
  scope: $scope,
  animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Open the login modal
  $scope.openlogin = function() {
    $scope.loginModal.show();
  };

  // Triggered in the login modal to close it
  $scope.closelogin = function() {
    $scope.loginModal.hide();    
    
  };
   $scope.$on('$destroy', function() {      
      $scope.loginModal.remove();
  });
  
  $scope.data = {}; 
  $scope.login = function() {
      LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
          $state.go('app.home');
      }).error(function(data) {
          var alertPopup = $ionicPopup.alert({
              title: 'Login failed!',
              template: 'Please check your credentials!'
          });
      });
      $scope.loginModal.hide();
  }
})

.controller( 'daftarCtrl', function ($scope,$ionicPopup,$cordovaSQLite) {
  
  $scope.data = {};
  $scope.register = function() {
    var user = $scope.data.username;
    var pass = $scope.data.password;
    
      var query = "INSERT INTO users (username,password) VALUES (?,?)";
      $cordovaSQLite.execute(db, query, [user,pass]).then(function(res) {
          console.log("REGISTER ID -> " + res.insertId);
          var alertPopup = $ionicPopup.alert({
              title: 'Success',
              template: 'Selamat '+user+' Pendaftaran  Anda berhasil'
          });
          
      }, function (err) {
          console.error(err);
          var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: 'Maaf Pendaftaran Anda gagal'
          });  
          $scope.pemasukanModal.hide();
      });
    
    };


  $scope.remove = function (thing) {
    StorageService.remove(thing);
  };

})
.controller('tambahCtrl',function($scope, $ionicModal, $timeout , $ionicPopup, $cordovaSQLite, $filter, $state, $window){
$ionicModal.fromTemplateUrl('templates/tambah.html', {    
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.tambahModal = modal;
  });
  // Open the login modal
  $scope.tambah = function() {
    $scope.tambahModal.show();
  };

  // Triggered in the login modal to close it
  $scope.closeTambah = function() {
    $scope.tambahModal.hide();    
    
  };
   $scope.$on('$destroy', function() {      
      $scope.tambahModal.remove();
  });

  $scope.refresh = function(){
    // window.location = "#/app/home";
    $window.location.reload(true);
    // $state.go($state.current, {}, {reload: true});
    $scope.$broadcast('scroll.refreshComplete');
  };
  // $scope.$broadcast('scroll.refreshComplete');
  
  $scope.Portrait = function() {
      screen.unlockOrientation('portrait');
  }

  $scope.chartTabShow = false;
  $scope.showChartAvaliable = function() {
            $scope.chartTabShow = $scope.chartTabShow == false ? true : false;
  };
  
       
  // $scope.doRefresh = function (){

       // $scope.chartTabShow = false;
       
       var bulan = [];
       var sumtotal = [];
       var total = 0;
       var i = 0;
       sumtotal[i]  = 0;        

       var gb = "";
       var bulanP = [];
       var sumtotalP = [];
       var totalP = 0;


       var query = "SELECT pemasukan.*,sum(pemasukan.jumlah) as total,substr(tanggal, 1, 7) grouBln FROM pemasukan group by grouBln";
       var data =  $cordovaSQLite.execute(db, query).then(function(res) {
           if(res.rows.length > 0) {                
               for(i=0;i<res.rows.length;i++){                                      
                  sumtotal[i] = res.rows.item(i).total;
                  // total += (res.rows.item(i)).total;                                    
                  bulan[i] = $filter('date')(new Date(res.rows.item(i).tanggal), "MMMM");
                  sumtotalP[i] = 0;
                      gb = res.rows.item(i).grouBln;
                      var query2 = "SELECT pengeluaran.*, sum(pengeluaran.jumlah) as jumlah, substr(tanggal, 1, 7) grouBlns FROM pengeluaran group by grouBlns";
                      //var query2 = "SELECT tanggal,sum(jumlah) jumlah FROM pengeluaran where substr(tanggal, 1, 7)='"+gb+"' group by jumlah";
                      var data2 =  $cordovaSQLite.execute(db, query2).then(function(res) {
                         if(res.rows.length > 0) {                
                             for(i=0;i<res.rows.length;i++){                    
                                sumtotalP[i] = res.rows.item(i).jumlah;                                
                                bulanP[i] = $filter('date')(new Date(res.rows.item(i).tanggal), "MMMM");                
                             }                             
                         } else {                            
                            console.log(sumtotalP);
                         }
                      }, function (err) {
                         console.error(err);
                      });                      
               }               
           } else {
               console.log("No results found");
           }
       }, function (err) {
           console.error(err);
       });
       $scope.$broadcast('scroll.refreshComplete');        

       $scope.labels = bulan;
       $scope.series = ['Pemasukan','Pengeluaran'];
       $scope.colour = ['#00FF00','#FF0000'];
       $scope.datass = [sumtotal,sumtotalP];

  // };
  // $scope.doRefresh();
})
 
.controller('MainCtrl', function($scope,$http, $ionicModal, $timeout , $ionicPopup, $cordovaSQLite, $stateParams){
    $scope.doSaveKategori = function() {            

            var data = $scope.kategoriData;
            //var data2 = $scope.datas;
            var query = "INSERT INTO kategori (nama) VALUES (?)";
            $cordovaSQLite.execute(db, query, [data.nama]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
                var alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'data '+res.insertId+' berhasil disimpan'
                });
                var query = "SELECT * FROM kategori order by id desc";
                var data =  $cordovaSQLite.execute(db, query).then(function(res) {
                    if(res.rows.length > 0) {                
                        for(i=0;i<res.rows.length;i++){
                            data[i] = res.rows.item(i);          
                        }                
                        $scope.kategoris =data;                                                
                    } else {
                        console.log("No results found");
                    }
                }, function (err) {
                    console.error(err);
                });
                    
            }, function (err) {
                console.error(err);
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'data gagal disimpan'
                });
                
            });
    };

  
})

.directive("formatDate", function(){
  return {
   require: 'ngModel',
    link: function(scope, elem, attr, modelCtrl) {
      modelCtrl.$formatters.push(function(modelValue){
        return new Date(modelValue);
      })
    }
  }
})

.filter('dates', function($filter){
   return function(input){
    if(input == null){ return ""; } 
   
    var _date = $filter('date')(new Date(input), 'dd MMM yyyy');
   
    return _date.toUpperCase();

   };
  })

.controller('forecastCtrl',function($scope, $ionicModal, $timeout , $ionicPopup,$cordovaSQLite, $filter){
    $scope.Portrait = function() {
      screen.unlockOrientation('portrait');
    }

    $scope.chartTabShow = false;
      $scope.showChartAvaliable = function() {
            $scope.chartTabShow = $scope.chartTabShow == false ? true : false;
    };

    var bulan = [];
    var pengeluaranY = [];
    var x=[];
    var xy=[];
    var x2=[];

    var total_pengeluaranY = 0;
    var total_x = 0;
    var total_xy = 0;
    var total_x2 = 0;
    var dataKu = [];
    var lastMonth = '';
    var lastX = 0;


    var query = "SELECT pengeluaran.*,sum(pengeluaran.jumlah) as total,substr(tanggal, 1, 7) grouBln FROM pengeluaran group by grouBln";
    var data =  $cordovaSQLite.execute(db, query).then(function(res) {
     if(res.rows.length > 0) {
        var jumdata = res.rows.length;      
        var std = jumdata/2;
        var isGanjil = (jumdata%2);
        var sxd = -(Math.floor(std)+1);

        for(i=0;i<jumdata;i++){
          //format bulan
          bulan[i] = $filter('date')(new Date(res.rows.item(i).tanggal), "MMMM");
          //mencari bulan terakhir
          lastMonth = new Date(res.rows.item(i).tanggal);
          //hitungan pengeluaran        
          pengeluaranY[i] = res.rows.item(i).total;
          total_pengeluaranY += res.rows.item(i).total;

          //mulai hitungan X
          sxd+=1 ;
          if(sxd==0 && isGanjil==0){
              sxd = 1;
          }
          x[i] = sxd;
          total_x +=sxd;
          lastX = sxd;
          //end of hitungan X

          //mulai hitungan XY               
          var tsxd = (res.rows.item(i).total*sxd);
          xy[i] = tsxd;
          total_xy +=tsxd;
          //end of hitungan XY

          //mulai hitungan XY               
          var tx2 = (sxd*sxd);
          x2[i] = tx2;
          total_x2 +=tx2;        
          //end of hitungan XY

          dataKu[i] = {
              'bulan' : bulan[i],
              'pengeluaranX' : pengeluaranY[i],
              'X' : x[i],
              'XY' : xy[i],
              'X2' : x2[i],
          };
        }

        var hasil1 = total_pengeluaranY/jumdata; // rumus : a = ∑ Y / n 
        var hasil2 = Math.round(total_xy/total_x2); // rumus : b = ∑ (XY) / ∑ X2
        var hasil3 = Math.round(hasil1+hasil2*(lastX+1)); // rumus : Y = a + bX
        
        /**
         * check data         
          console.log("data row");
          console.log(bulan);
          console.log(pengeluaranY); // Pengeluaran Y
          console.log(x); // X
          console.log(xy); // XY
          console.log(x2); // X2

          console.log("jumlah total row");
          console.log(total_pengeluaranY);
          console.log(total_x);
          console.log(total_xy);
          console.log(total_x2);
          
          console.log("hasil");
          console.log(hasil1); //a = ∑ Y / n 
          console.log(hasil2); //b = ∑ (XY) / ∑ X2
          console.log(hasil3); //Y = a + bX
          
          //cek data
          console.log(dataKu);
          * 
         */
          
          //bulan ditambah 1
          lastMonth.setMonth( lastMonth.getMonth() + 1 );
          lastMonth = ( lastMonth.getMonth() + 1 ) + '/' + lastMonth.getDate() + '/' + lastMonth.getFullYear();
          //tanggal di format mjd nama bulan
          var blnForecast = $filter('date')(new Date(lastMonth), "MMMM");
          //menggabungkan array dari data dan perhitungan forecast
          Array.prototype.push.apply(bulan, [blnForecast]);
          Array.prototype.push.apply(pengeluaranY,[hasil3]);
          
          //forecast grafik
          $scope.labels = bulan;
          $scope.series = ['Forecast'];
          $scope.data = [pengeluaranY];
          
          $scope.bulanKet = blnForecast;
          $scope.forecastJumlah = hasil3;

     } else {
         console.log("No results found");
     }
    }, function (err) {
        console.error(err);
    }); 

});