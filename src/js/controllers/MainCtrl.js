app.controller('MainCtrl', ['$scope', '$rootScope', '$state', '$stateParams', function ($scope, $rootScope, $state, $stateParams) {

	//state listens
	$rootScope.$on('new', function(e, note){
		console.log("Created article with id : " + note.id);
	});	

	$rootScope.$on('edited', function(e, note){
		console.log("Edited article with id : " + note.id);
	});	

	$rootScope.$on('deleted', function(e, note){
		console.log("Deleted article with id : " + note.id);
	});	



	//
	// public
	//

	$scope.goToMe = function() {
		$state.go('me');
	}

	$scope.goToArticles = function() {
		$state.go('articles');
	}
	$scope.newArticle = function() {
		$state.go('article-edit', {id : new Date().getTime(), isEdit : 'edit'});
	}
	$scope.editArticle = function() {
		$state.go('article-edit', {id : $stateParams.id, isEdit : 'edit'});
	}


}])