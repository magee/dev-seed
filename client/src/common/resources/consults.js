angular.module('resources.consults', ['mongolabResource']);
angular.module('resources.consults').factory('Consults', ['mongolabResource', function ($mongolabResource) {

  var Consults = $mongolabResource('consults');

  Consults.forUser = function(userId, successcb, errorcb) {
    //TODO: get consults for this user only (!)
    return Consults.query({}, successcb, errorcb);
  };

  Consults.prototype.isStylist = function (userId) {
    return this.stylist === userId;
  };
  Consults.prototype.canActAsStylist = function (userId) {
    return !this.isMentor(userId) && !this.isDevTeamMember(userId);
  };
  Consults.prototype.isMentor = function (userId) {
    return this.mentor === userId;
  };
  Consults.prototype.canActAsMentor = function (userId) {
    return !this.isStylist(userId);
  };
  Consults.prototype.isDevTeamMember = function (userId) {
    return this.teamMembers.indexOf(userId) >= 0;
  };
  Consults.prototype.canActAsDevTeamMember = function (userId) {
    return !this.isStylist(userId);
  };

  Consults.prototype.getRoles = function (userId) {
    var roles = [];
    if (this.isStylist(userId)) {
      roles.push('PO');
    } else {
      if (this.isMentor(userId)){
        roles.push('SM');
      }
      if (this.isDevTeamMember(userId)){
        roles.push('DEV');
      }
    }
    return roles;
  };

  return Consults;
}]);