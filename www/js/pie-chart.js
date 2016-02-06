angular.module('pie-chart.controllers', ['chart.js','ionic','ionic-color-picker'])
.controller('pie-chartCtrl',function($scope,$ionicModal, $ionicPopup,$cordovaSQLite,$state,$stateParams,$filter){
      
      $scope.Portrait = function() {
        screen.unlockOrientation('portrait');
      }
      
      $scope.chartTabShow = false;
      $scope.showChartAvaliable = function() {
            $scope.chartTabShow = $scope.chartTabShow == false ? true : false;
      };

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

      var queryx = "SELECT pengeluaran.*,sum(pengeluaran.jumlah) totalP,substr(tanggal, 1, 7) grouBlnP FROM pengeluaran join kategori on pengeluaran.kategori=kategori.id group by grouBlnP";
      var data =  $cordovaSQLite.execute(db, queryx).then(function(res) {
             if(res.rows.length > 0) {            
                 for(i=0;i<res.rows.length;i++){                    
                  var b = $filter('date')(new Date(res.rows.item(i).tanggal), "MMMM");                
                     pengeluaranLabels[i] = b;
                     pengeluarantotal += res.rows.item(i).totalP;                                 
                     pengeluaranarr[b] = pengeluarantotal;
                     pengeluaranNilai[i] = res.rows.item(i).totalP;                   
                 }                                                                   
                 // $scope.totalBulanArr = arr;
                 // console.log(arr); 
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
        
        $scope.onClick = function (points, evt) {  
        var labelClick = points[0]['label'];                  
        $state.go('app.detil-grafik',{'bln' : labelClick });
      };

      $scope.onClicks = function (points, evt) {  
        var labelClick = points[0]['label'];                  
        $state.go('app.detil-grafik-pengeluaran',{'blnP' : labelClick });
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