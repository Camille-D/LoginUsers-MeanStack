myUsCtrl.controller('userCtrl', function($scope, $http, $window){

	$http.get('/api/user').then(function(response){// je récupére mes datas
 			$scope.myData = response.data; // je les stocks
 			// alert($scope.myData);
 	});

	
	$scope.message = "Bienvenue sur la page des utilisateurs";
	$scope.user = {name: '', username: '', password: ''};

	$scope.addUser = function(){
		$http.post('/api/user', $scope.user).then(function(data){
			if (data == 'err'){
				console.log("Désolé un problème est survenu lors de l'enregistrement");
			} else {
				console.log("L'utilisateur a bien été enregistré");
			}
		});
	};


	$scope.suppUs = function(item){
		$http.delete('/api/user/'+ item._id).then(function(data){
			if (data == 'err'){
				console.log("Désolé un problème est survenu lors de la suppression");
			} else {
				// window.location.reload(true);
				console.log("L'utilisateur a bien été supprimé");
			}
		});
	};

	$scope.editUs = function(item){
		$http.put('/api/user'+ item._id).then(function(data){
			if(data == 'err'){
				console.log("Désolé un problème est survenu lors de la modification");
			} else {
				// window.location.reload(true);
				console.log("L'utilisateur a bien été modifié");
			}
		});
	};




});