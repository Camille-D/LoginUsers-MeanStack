app.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl: "../../app/views/pages/home.html"
	}) 
	.when("/login",{
		templateUrl: "../../app/views/pages/login.html",
		controller: "loginCtrl"
	})
	.when("/newUser",{
		templateUrl: "../../app/views/pages/newUser.html"
	})
	.when("/editUser",{
		templateUrl: "../../app/views/pages/editUser.html"
	})
	.when("/test",{
		templateUrl: "../../app/views/pages/test.html",
		controller: "userCtrl"
	})
	// otherwise({
 //          redirectTo: '/'
 //    })
})