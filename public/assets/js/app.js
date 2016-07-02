// var app = angular.module('myApp', ['ngRoute']);
var app = angular.module('myApp', ['ngRoute', 'myUsCtrl', 'myLoginCtrl']);

var myUsCtrl = angular.module('myUsCtrl', []);

var myLoginCtrl = angular.module('myLoginCtrl', []);