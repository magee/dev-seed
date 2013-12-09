angular.module('admin-consults', [
  'resources.consults',
  'resources.users',
  'services.crud',
  'security.authorization'
])

.config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

  var getAllUsers = ['Consults', 'Users', '$route', function(Consults, Users, $route){
    return Users.all();
  }];

  crudRouteProvider.routesFor('Consults', 'admin')
    .whenList({
      consults: ['Consults', function(Consults) { return Consults.all(); }],
      adminUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenNew({
      consult: ['Consults', function(Consults) { return new Consults(); }],
      users: getAllUsers,
      adminUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenEdit({
      consult: ['Consults', 'Users', '$route', function(Consults, Users, $route) { return Consults.getById($route.current.params.itemId); }],
      users: getAllUsers,
      adminUser: securityAuthorizationProvider.requireAdminUser
    });
}])

.controller('ConsultsListCtrl', ['$scope', 'crudListMethods', 'consults', function($scope, crudListMethods, consults) {
  $scope.consults = consults;

  angular.extend($scope, crudListMethods('/admin/consults'));
}])

.controller('ConsultsEditCtrl', ['$scope', '$location', 'i18nNotifications', 'users', 'consult', function($scope, $location, i18nNotifications, users, consult) {

  $scope.consult = consult;
  $scope.users = users;

  $scope.onSave = function(consult) {
    i18nNotifications.pushForNextRoute('crud.consult.save.success', 'success', {id : consult.$id()});
    $location.path('/admin/consults');
  };

  $scope.onError = function() {
    i18nNotifications.pushForCurrentRoute('crud.consult.save.error', 'error');
  };

}])

.controller('TeamMembersController', ['$scope', function($scope) {
  $scope.consult.teamMembers = $scope.consult.teamMembers || [];

  //prepare users lookup, just keep references for easier lookup
  $scope.usersLookup = {};
  angular.forEach($scope.users, function(value, key) {
    $scope.usersLookup[value.$id()] = value;
  });

  $scope.stylistCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.consult.canActAsStylist(user.$id());
    });
  };

  $scope.mentorCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.consult.canActAsMentor(user.$id());
    });
  };

  $scope.teamMemberCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.consult.canActAsDevTeamMember(user.$id()) && !$scope.consult.isDevTeamMember(user.$id());
    });
  };

  $scope.selTeamMember = undefined;

  $scope.addTeamMember = function() {
    if($scope.selTeamMember) {
      $scope.consult.teamMembers.push($scope.selTeamMember);
      $scope.selTeamMember = undefined;
    }
  };

  $scope.removeTeamMember = function(teamMember) {
    var idx = $scope.consult.teamMembers.indexOf(teamMember);
    if(idx >= 0) {
      $scope.consult.teamMembers.splice(idx, 1);
    }
    // If we have removed the team member that is currently selected then clear this object
    if($scope.selTeamMember === teamMember) {
      $scope.selTeamMember = undefined;
    }
  };
}]);