app.controller('ArticlesCtrl', ['$scope', '$rootScope' ,'Storage', '$state', function ($scope, $rootScope, Storage, $state) {
	console.log("Articles ctrl");

	$scope.articles = Storage.getArticles();
	

	Storage.getAllTags().then(function(t){
		$scope.allTags = t;
	});

	$scope.viewArticle = function(article) {
		$state.go('article', {id : article.id});
	}

}])