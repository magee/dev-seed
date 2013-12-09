angular.module('dashboard', ['resources.projects', 'resources.tasks'])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'dashboard/dashboard.tpl.html',
    controller:'DashboardCtrl',
    resolve:{
      projects:['Projects', function (Projects) {
        //TODO: need to know the current user here
        return Projects.all();
      }],
      consults:['Consults', function (Consults) {
        //TODO: need to know the current user here
        return Consults.all();
      }],
      tasks:['Tasks', function (Tasks) {
        //TODO: need to know the current user here
        return Tasks.all();
      }]
    }
  });
}])

.controller('DashboardCtrl', ['$scope', '$location', 'projects', 'consults', 'tasks', function ($scope, $location, projects, consults, tasks) {
  $scope.projects = projects;
  $scope.consults = consults;
  $scope.tasks = tasks;

  $scope.managePastConsults = function (consultId) {
    $location.path('/consults/' + consultId + '/pastconsults');
  };

  $scope.manageBacklog = function (projectId) {
    $location.path('/projects/' + projectId + '/productbacklog');
  };

  $scope.manageSprints = function (projectId) {
    $location.path('/projects/' + projectId + '/sprints');
  };
}]);