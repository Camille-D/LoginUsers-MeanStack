myLoginCtrl.controller('loginCtrl', function($scope, $http, $window){

	$http.get('/api/user').then(function(response){// je récupére mes datas
 			$scope.myData = response.data; // je les stocks
 			// console.log($scope.myData);
 	});

	$scope.access = false;
	$scope.user = {name: '', username: '', password: ''};

 // 	$scope.loginUser = function(){
 // 		for (var i = 0; i < $scope.myData.length; i++) {
 // 			// $scope.myData[i];
 // 			if ($scope.user.username == $scope.myData[i].username && $scope.user.password == $scope.myData[i].password) {
 // 			console.log("L'utilisateur peux acceder à la page user");
 // 			$window.location.assign('http://localhost:8080/#/test');
 // 		} else {
 // 			console.log("Error ! l'utilisateur n'a pas les accés à la page user");
 // 		}

 // 			i++;
 // 		}
 		
	// };


$scope.loginUser = function(){
		$http.post('/api/authenticate', $scope.user).then(function(data){
			if (data == 'err'){
				console.log("Désolé un problème est survenu lors de l'enregistrement.");
			} else {
				console.log("L'utilisateur peux acceder à la page user");
				// $window.location.assign('http://localhost:8080/#/test');
			}
		});
};

});