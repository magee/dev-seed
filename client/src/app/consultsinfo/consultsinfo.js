angular.module('consultsinfo', [], ['$routeProvider', function($routeProvider){

  $routeProvider.when('/consultsinfo', {
    templateUrl:'consultsinfo/list.tpl.html',
    controller:'ConsultsInfoListCtrl',
    resolve:{
      consults:['Consults', function(Consults){
        return Consults.all();
      }]
    }
  });
}]);

angular.module('consultsinfo').controller('ConsultsInfoListCtrl', ['$scope', 'consults', function($scope, consults){
  $scope.consults = consults;
}]);