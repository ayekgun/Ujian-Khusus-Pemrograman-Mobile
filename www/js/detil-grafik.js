angular.module('detil-grafik.controllers', ['chart.js','ionic','ionic-color-picker'])
.controller('detil-grafikCtrl',function($scope,$ionicModal, $ionicPopup,$cordovaSQLite, $stateParams,$filter, $rootScope){
       //routing detilbulan data
      //$rootScope.totalBulan = 0;
      // cuman percobaan gitttt      
      $scope.totalBulanP = 0;
            

          var total = 0;          
          var pemasukanLabels = [];
          var pemasukanNilai = [];
          var pemasukanWarna = [];
          var pemasukanKategori = [];        
          
          
          var totalP = 0;
          var pengeluaranLabels = [];
          var pengeluaranNilai = [];
          var pengeluaranWarna = [];
          var pengeluaranKategori = [];

          var cariBulan = "2000-"+$stateParams.bln+"20";
          var filterBln = $filter('date')(new Date(cariBulan), "MM");
          var queryx = "SELECT pemasukan.*,sum(pemasukan.jumlah) total,kategori.warna,kategori.nama namaKtg ,substr(pemasukan.tanggal,6,2) as tg FROM pemasukan join kategori on pemasukan.kategori=kategori.id where substr(tanggal, 6, 2)='"+filterBln+"' group by kategori.id";
          var data =  $cordovaSQLite.execute(db, queryx).then(function(res) {
              if(res.rows.length > 0) {            
                     for(i=0;i<res.rows.length;i++){                    
                         pemasukanLabels[i] = $filter('date')(new Date(res.rows.item(i).tanggal), "MMMM");                
                         total += (res.rows.item(i)).total;                         
                         pemasukanNilai[i] = res.rows.item(i).total;                   
                         pemasukanWarna[i] = res.rows.item(i).warna;                   
                         pemasukanKategori[i] = res.rows.item(i).namaKtg;
                     }                                                                   
                     
                     $rootScope.totalBulan = total;
                     
                     console.log();      
                 } else {
                     console.log("No results found");
                 }           

               }, function (err) {
                 console.error(err);
          });
          
          var cariBulanP = "2000 "+$stateParams.blnP+" 20";
        
          var filterBlnP = $filter('date')(new Date(cariBulanP), "MM");
          var queryY = "SELECT pengeluaran.*,sum(pengeluaran.jumlah) totalP,kategoripengeluaran.warna,kategoripengeluaran.nama namaKtgP ,substr(pengeluaran.tanggal,6,2) as tgP FROM pengeluaran join kategoripengeluaran on pengeluaran.kategori=kategoripengeluaran.id where substr(tanggal, 6, 2)='"+filterBlnP+"' group by kategoripengeluaran.id";
          
          var data =  $cordovaSQLite.execute(db, queryY).then(function(res) {
              if(res.rows.length > 0) {            
                     for(i=0;i<res.rows.length;i++){                    
                         pengeluaranLabels[i] = $filter('date')(new Date(res.rows.item(i).tanggal), "MMMM");                
                         totalP += (res.rows.item(i)).totalP;
                         pengeluaranNilai[i] = res.rows.item(i).totalP;                   
                         pengeluaranWarna[i] = res.rows.item(i).warna;                   
                         pengeluaranKategori[i] = res.rows.item(i).namaKtgP;
                         console.log(totalP);
                     }                                                                   
                     $scope.totalBulanP = totalP;                    
                           
                 } else {
                     console.log("No results found");
                 }           

               }, function (err) {
                 console.error(err);
          });        
      
        $scope.labelsdataDetilBulan = pemasukanKategori;
        $scope.dataDetilBulan = pemasukanNilai;
        $scope.dataDetilWarna = pemasukanWarna;

        $scope.labelsdataDetilBulanP = pengeluaranKategori;
        $scope.dataDetilBulanP = pengeluaranNilai;
        $scope.dataDetilWarnaP = pengeluaranWarna;
//****************************************************************************//
          var totals = 0;
          var tbg = 0;
          var pemasukantabung = [];
          $scope.totalpem = 0;          
          
          var totalsP = 0;          
          
  
  
          var cariBulan = "2000-"+$stateParams.bln+"-20";
          var filterBln = $filter('date')(new Date(cariBulan), "MM");
          var queryx = "SELECT sum(pemasukan.jumlah) totpem, sum(pemasukan.tabung) tbpem, substr(pemasukan.tanggal,6,2) as tg FROM pemasukan where substr(tanggal, 6, 2)='"+filterBln+"' ";
          var data =  $cordovaSQLite.execute(db, queryx).then(function(res) {
              if(res.rows.length > 0) {            
                     for(i=0;i<res.rows.length;i++){
                         var t = $filter('number')(new Number(res.rows.item(i).tbpem));                
                         //pemasukantabung[i] = t;                                  
                         totals += (res.rows.item(i)).totpem;
                         tbg += (res.rows.item(i).tbpem);                         
                         } 

                          var queryx = "SELECT sum(pengeluaran.jumlah) totpeng, substr(pengeluaran.tanggal,6,2) as tg FROM pengeluaran where substr(tanggal, 6, 2)='"+filterBln+"' ";
                          var data =  $cordovaSQLite.execute(db, queryx).then(function(res) {
                               if(res.rows.length > 0) {            
                                       for(i=0;i<res.rows.length;i++){
                                           totalsP += (res.rows.item(i)).totpeng;
                                           }

                                        $scope.totalpeng = totalsP;
                                        console.log($scope.totalpeng);
                                        $scope.totalpem = totals;
                                        $scope.totaltb = tbg;
                                        console.log($scope.totalpem);
                                        console.log($scope.totaltb);
                                        var makspeng = parseInt($scope.totalpem) * 80;
                                        var makspeng2 = makspeng / 100;                                        
                                        var tbg_peng = parseInt($scope.totalpeng) + parseInt($scope.totaltb);
                                        var sisa = parseInt($scope.totalpem) - tbg_peng;
                                        $scope.sisa = sisa;
                                        if (tbg_peng > makspeng2) {
                                              var pesan = "Kondisi Keuangan Anda Buruk"                                          
                                        }
                                        else { 
                                          var pesan = "Kondisi Keuangan Anda Baik"
                                        }
                                        $scope.pesan = pesan;
                                   } else {
                                       console.log("No results found");
                                   }           

                                 }, function (err) {
                                   console.error(err);
                            });                                                                  
                     
                     // $scope.totalpem = totals;
                     // $scope.totaltb = tbg;
                     // console.log($scope.totalpem);
                     // console.log($scope.totaltb);
                      //console.log($scope.totalpeng);
                     //var warning = parseInt($scope.totalpem);
                     //console.log(warning);      
                 } else {
                     console.log("No results found");
                 }           

               }, function (err) {
                 console.error(err);
          });

})