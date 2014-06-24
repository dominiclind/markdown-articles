app.controller('MeCtrl', ['$scope', '$rootScope' ,'Storage', '$state', function ($scope, $rootScope, Storage, $state) {

	$scope.articles = Storage.getArticles();
	
	$scope.filters = [
		{
			name : 'My Articles',
			action : 'my'
		},
		{
			name : 'Favorites',
			action : 'fav'
		}
	];

	$scope.currentFilter = 'my';


	Storage.getAllTags().then(function(t){
		$scope.allTags = t;
	});


	// public
	$scope.viewArticle = function(article) {
		$state.go('article', {id : article.id});
	}
	$scope.filterArticles = function(action){
		$scope.currentFilter = action;
	}

}])