app.controller('MainCtrl', ['$scope', '$rootScope', '$state', '$stateParams','Storage',function ($scope, $rootScope, $state, $stateParams, Storage) {

	$rootScope.deletePressed = false;

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

	$scope.viewArticle = function(article) {
		if(article.isUrl){
			window.open(article.title);
		}else{
			$state.go('article', {id : article.id});
		}
	}

	$scope.goToArticles = function() {
		$state.go('articles');
	}
	$scope.newArticle = function() {
		$state.go('article-edit', {id : new Date().getTime(), isEdit : 'edit'});
	}

	$scope.editArticle = function(id) {
		$state.go('article-edit', {id : id || $stateParams.id, isEdit : 'edit'});
	};

	$scope.deleteArticle = function(id){
		console.log("delete article");
		Storage.deleteArticle(id || $stateParams.id);
		$state.go(($rootScope.prevState.name.length > 0) ? $rootScope.prevState.name : 'articles');

	};
	$scope.toggleDelete = function(){
		$rootScope.deletePressed = !$rootScope.deletePressed;
	};

	$scope.previewArticle = function() {
		$state.go('article', {id : $stateParams.id});
	}
	$scope.publishArticle = function() {
		var article = Storage.getArticle($state.params.id);
		Storage.saveArticle(article, true);
	}


}])