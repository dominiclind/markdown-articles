app.controller('SearchCtrl', ['$scope', '$rootScope' ,'Storage', '$state', function ($scope, $rootScope, Storage, $state) {

	$scope.articles = Storage.getArticles();
	

	Storage.getAllTags().then(function(t){
		$scope.allTags = t;
	});


	// public
	$scope.viewArticle = function(article) {
		$state.go('article', {id : article.id});
	}

}])