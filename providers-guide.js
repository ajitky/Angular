// Code goes here

var myModule = angular.module('myApp',[]);

// module.value( 'name', value );
myModule.value('myValue', {key1: 'value', key2: 22});

// module.constant( 'name', value );
myModule.constant('myConstant', {key3: 'constant', key4: 44});

// module.service( 'serviceName', function );
myModule.service('myService', ['myValue', function(myValue){
  this.prop1 = 'myService prop1';
  this.prop2 = myValue;
}]);

// module.factory( 'factoryName', function );
myModule.factory('myFactory', ['myConstant', function(myConstant){
  return {
    prop1: 'myFactory prop1',
    prop2: myConstant
  };
}]);

// module.provider( 'providerName', function );
myModule.provider('myProvider', [function(){
  this.$get = ['myValue', function(myValue){
    return {
      prop1: 'myProvider prop1',
      prop2: myValue,
      prop3: config
    };
  }];
  
  var config = 'DEFAULT VALUE';
  this.setConfig = function(newVal){
    config = newVal;
  };
}]);

myModule.config(['myProviderProvider','$provide', function(myProviderProvider, $provide) {
    myProviderProvider.setConfig('ABCXYZ');
    
    $provide.decorator('myService', function($delegate) {
      $delegate.prop1 = 'DECORATED';
      return $delegate;
    });
}]);

myModule.controller('myCtrl',['$scope','myValue','myConstant','myService','myFactory','myProvider', function($scope, myValue, myConstant, myService, myFactory, myProvider){
  $scope.myValue = myValue;
  $scope.myConstant = myConstant;
  $scope.myService = myService;
  $scope.myFactory = myFactory;
  $scope.myProvider = myProvider;
}]);

