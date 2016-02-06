angular.module('pengeluaran.controllers', ['chart.js','ionic','ionic-color-picker'])
.controller('pengeluaranCtrl',function($scope,$http, $ionicModal, $timeout , $ionicPopup, $cordovaSQLite, $stateParams,$filter, $ionicPlatform){
  
  $scope.Landscape = function() {
      screen.unlockOrientation('landscape');
      console.log(screen.lockOrientation('landscape'));
  }      
  $scope.Portrait = function() {
      screen.unlockOrientation('portrait');
  }
  

  $scope.pengeluaranData = {};
  $scope.datas = {};


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/pengeluaran/pengeluaran.html', {    
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.pengeluaranModal = modal;
  });

  $scope.showAddChangeDialog = function(action) {
        $scope.action = action;
        $scope.pengeluaranModal.show();
      };
  
  // Open the login modal
  $scope.pengeluaran = function(action) {    
    $scope.showAddChangeDialog('add');   
  };

  // Triggered in the login modal to close it
  $scope.closePengeluaran = function() {
    $scope.pengeluaranModal.hide();    
  };

  $scope.getPengeluaran = function(id) {

        var dataDetil= [];        
        var query = "SELECT * FROM pengeluaran where id ="+id;
        var data =  $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {                
                for(i=0;i<res.rows.length;i++){
                    dataDetil = res.rows.item(i);          
                }                
                $scope.pengeluaranData = dataDetil;
                $scope.datas = dataDetil;                
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
        $scope.showAddChangeDialog('change');

        $scope.$on('$destroy', function() {       
          $scope.pengeluaranModal.remove();
       });
        //$scope.pemasukanModal.show();
    };

  $scope.doUpdatePengeluaran = function(){
    var data = $scope.pengeluaranData;    
    var dataDetil = [];
    var d = $filter('date')(new Date(data.tanggal), "yyyy-MM-dd");
    var query = "INSERT OR REPLACE INTO pengeluaran (id, nama, jumlah, tanggal, kategori)" + "VALUES (?,?,?,?,?)";    
    var data =  $cordovaSQLite.execute(db, query , [data.id, data.nama, data.jumlah, d, data.kategori]).then(function(res) {
            if(res.rows.length > 0) {                
                for(i=0;i<res.rows.length;i++){
                    dataDetil = res.rows.item(i);          
                }                
                $scope.pengeluaranData = dataDetil;                
            } else {
                console.log("No results found");
            }
                $scope.listPengeluaran();
                $scope.pengeluaranModal.hide();            
        }, function (err) {
            console.error(err);
        });

  };

  $scope.doDeletePengeluaran = function (){    
    var data = $scope.pengeluaranData;    
    var dataDetil = [];
    var query = "DELETE FROM pengeluaran where id =?";
    var data =  $cordovaSQLite.execute(db, query,[data.id]).then(function(res) {            
                 $scope.listPengeluaran();
                 $scope.pengeluaranModal.hide();
        }, function (err) {
            console.error(err);
        });
  };
  

  $scope.doSavePengeluaran = function() {
            

            var data = $scope.pengeluaranData;
            var d = $filter('date')(new Date(data.tanggal), "yyyy-MM-dd");
            var query = "INSERT INTO pengeluaran (nama, jumlah, tanggal, kategori) VALUES (?,?,?,?)";
            $cordovaSQLite.execute(db, query, [data.nama, data.jumlah, d, data.kategori]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
                var alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'data '+res.insertId+' berhasil disimpan'
                });
                $scope.pengeluaranModal.hide();
                $scope.listPengeluaran();
                $scope.getKategoriList();                    
            }, function (err) {
                console.error(err);
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'data gagal disimpan'
                });
                $scope.pengeluaranModal.hide();
            });
    };

  $scope.saveKategori = function() {            
            var data = $scope.kategoriData;                    
            var query = "INSERT INTO kategoripengeluaran (nama, warna) VALUES (?,?)";
            $cordovaSQLite.execute(db, query, [data.nama, data.warna]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
                var alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'data '+res.insertId+' berhasil disimpan'
                });
                var dataDetil=[];
                var query = "SELECT * FROM kategoripengeluaran order by id desc";
                var data =  $cordovaSQLite.execute(db, query).then(function(res) {
                    if(res.rows.length > 0) {                
                        for(i=0;i<res.rows.length;i++){
                                var nama = res.rows.item(i).nama;                    
                                dataDetil[i] = {
                                        'value' : res.rows.item(i).id, 
                                        'text' : res.rows.item(i).nama,
                                        'warna' : res.rows.item(i).warna,
                                        'nama' : nama.substring(0,1).toUpperCase(),                                  
                                    };                            
                        }                                
                        $scope.kategoriList = dataDetil;                                                                    
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

  $scope.listPengeluaran = function (){      
    //Fungsi Select Pemasukan
        var query = "SELECT pengeluaran.*,pengeluaran.nama as ket ,kategoripengeluaran.warna,kategoripengeluaran.nama FROM pengeluaran left join kategoripengeluaran on pengeluaran.kategori=kategoripengeluaran.id order by pengeluaran.id desc";
        var data =  $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length >= 0) {
                //console.log("SELECTED -> " + res.rows.item(0).nama_pemasukan + " " + res.rows.item(0).jumlah);                
                for(i=0;i<res.rows.length;i++){                    
                    var nama = res.rows.item(i).nama;                                                                            
                    data[i] = {
                                'id' : res.rows.item(i).id, 
                                'keterangan' : res.rows.item(i).ket, 
                                'jumlah' : res.rows.item(i).jumlah,
                                'tabung' : res.rows.item(i).tabung,
                                'tanggal' : res.rows.item(i).tanggal,
                                'toggle' : res.rows.item(i).toggle,
                                'kategori' : res.rows.item(i).kategori,
                                'nama' : (nama) ? nama.substring(0,1).toUpperCase() : "-",                                  
                                'namaKategori' : nama,                                  
                                'warna' : res.rows.item(i).warna,
                            };
                }                
                $scope.pengeluarans = data;  
                console.log(data);              
            }
            else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
    };
    $scope.listPengeluaran();
    if($stateParams.pengeluaranId){
        var dataDetil= [];
        var id = $stateParams.pengeluaranId;           
        var query = "SELECT * FROM pengeluaran where id ="+id;
        var data =  $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {                
                for(i=0;i<res.rows.length;i++){
                    dataDetil = res.rows.item(i);          
                }                
                $scope.pengeluaranDetil = dataDetil;
                console.log($scope.pengeluaranDetil);
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
    }
  else{
        console.log('params not found');
    }

   

  $scope.kategoriData = {
                        'nama':'',
                        'warna' : '#00ffff'
                    };

  $scope.getKategoriList = function() {

        var dataDetil= [];        
        var query = "SELECT * FROM kategoripengeluaran ";
        var data =  $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {                
                for(i=0;i<res.rows.length;i++){  
                    var nama = res.rows.item(i).nama;                    
                    dataDetil[i] = {
                        'value' : res.rows.item(i).id, 
                        'text' : res.rows.item(i).nama,
                        'warna' : res.rows.item(i).warna,
                        'nama' : nama.substring(0,1).toUpperCase(),
                    };
                             
                }                                
                $scope.kategoriList = dataDetil;                              
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });            
    };
    
    $scope.getKategoriList();  
  // $scope.kategoriList = [
  // { text: "Backbone", value: "bb" },
  // { text: "Angular", value: "ng" },
  // { text: "Ember", value: "em" },
  // { text: "Knockout", value: "ko" }
  // ];

  $scope.pengeluaranData = {
    kategori: 'em'
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
  });