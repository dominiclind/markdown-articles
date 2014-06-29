app.controller('ArticlesCtrl', ['$scope', '$rootScope' ,'Storage', '$state', function ($scope, $rootScope, Storage, $state) {
	console.log("Articles ctrl");

	$scope.articles = Storage.getArticles();

	console.log($scope.articles);
	

	Storage.getAllTags().then(function(t){
		$scope.allTags = t;
	});

}])