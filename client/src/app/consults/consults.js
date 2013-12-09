angular.module('consults', ['resources.consults', 'pastconsults', 'sprints', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/consults', {
    templateUrl:'consults/consults-list.tpl.html',
    controller:'ConsultsViewCtrl',
    resolve:{
      consults:['Consults', function (Consults) {
        //TODO: fetch only for the current user
        return Consults.all();
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('ConsultsViewCtrl', ['$scope', '$location', 'consults', 'security', function ($scope, $location, consults, security) {
  $scope.consults = consults;

  $scope.viewConsult = function (consult) {
    $location.path('/consults/'+consult.$id());
  };

  $scope.managePastConsults = function (consult) {
    $location.path('/consults/'+consult.$id()+'/pastconsults');
  };

  $scope.manageSprints = function (consult) {
    $location.path('/consults/'+consult.$id()+'/sprints');
  };

  $scope.getMyRoles = function(consult) {
    if ( security.currentUser ) {
      return consult.getRoles(security.currentUser.id);
    }
  };
}]);
