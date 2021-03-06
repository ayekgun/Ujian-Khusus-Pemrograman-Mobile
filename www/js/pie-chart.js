angular.module('pie-chart.controllers', ['chart.js','ionic','ionic-color-picker'])
.controller('pie-chartCtrl',function($scope,$ionicModal, $ionicPopup,$cordovaSQLite,$state,$stateParams,$filter){
      $scope.refresh = function(){
        $scope.doRefresh();
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.Portrait = function() {
        screen.unlockOrientation('portrait');
      }
      
      $scope.chartTabShow = false;
      $scope.showChartAvaliable = function() {
            $scope.chartTabShow = $scope.chartTabShow == false ? true : false;
      };
      $scope.doRefresh = function (){
      var pemasukanLabels = [];
      var pemasukanNilai = [];
      var pemasukantotal = 0;      
      var pemasukanarr=[];

      var queryx = "SELECT pemasukan.*,sum(pemasukan.jumlah) total,substr(tanggal, 1, 7) grouBln FROM pemasukan join kategori on pemasukan.kategori=kategori.id group by grouBln";
      var data =  $cordovaSQLite.execute(db, queryx).then(function(res) {
             if(res.rows.length > 0) {            
                 for(i=0;i<res.rows.length;i++){                    
                  var b = $filter('date')(new Date(res.rows.item(i).tanggal), "MMMM");                
                     pemasukanLabels[i] = b;
                     pemasukantotal += res.rows.item(i).total;
                     console.log(pemasukantotal);                                 
                     pemasukanarr[b] = pemasukantotal;
                     pemasukanNilai[i] = res.rows.item(i).total;                   
                 }                                                                   
                 // $scope.totalBulanArr = arr;
                 // console.log(arr); 
             } else {

                 console.log("No results found");
             }           

           }, function (err) {
             console.error(err);
      });

      var pengeluaranLabels = [];
      var pengeluaranNilai = [];
      var pengeluarantotal = 0;      
      var pengeluaranarr=[];

      var query2 = "SELECT pengeluaran.*,sum(pengeluaran.jumlah) totalP,substr(pengeluaran.tanggal, 1, 7) grouBlnP FROM pengeluaran join kategoripengeluaran on pengeluaran.kategori=kategoripengeluaran.id group by grouBlnP";
      var data =  $cordovaSQLite.execute(db, query2).then(function(res) {
             if(res.rows.length > 0) {            
                 for(i=0;i<res.rows.length;i++){                    
                  var c = $filter('date')(new Date(res.rows.item(i).tanggal), "MMMM");                
                     pengeluaranLabels[i] = c;
                     pengeluarantotal += res.rows.item(i).totalP;                                 
                     pengeluaranarr[c] = pengeluarantotal;
                     pengeluaranNilai[i] = res.rows.item(i).totalP;                   
                 }                                                                   
                 // $scope.totalBulanArr = arr;
                 console.log(pengeluaranNilai); 
             } else {

                 console.log("No results found");
             }           

           }, function (err) {
             console.error(err);
      });      
      
        $scope.labels = pemasukanLabels;
        $scope.datas = pemasukanNilai;  
        $scope.labelsP = pengeluaranLabels;
        $scope.datasP = pengeluaranNilai;
        console.log($scope.datasP);  
        
      $scope.onClick = function (points, evt) {  
        var labelClick = points[0]['label'];                  
        $state.go('app.detil-grafik',{'bln' : labelClick });
      };

      $scope.onClicks = function (points, evt) {  
        var labelClick = points[0]['label'];                  
        $state.go('app.detil-grafik-pengeluaran',{'blnP' : labelClick });
      };
    };
    $scope.doRefresh();

      

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