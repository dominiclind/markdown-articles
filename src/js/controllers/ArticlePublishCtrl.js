app.controller('ArticlePublishCtrl', ['$scope', '$rootScope', '$stateParams', '$state' ,'Storage', function ($scope, $rootScope, $stateParams, $state, Storage) {

	var savedArticle = Storage.getArticle($stateParams.id) || {
		id : $stateParams.id,
		text : '',
	};

	$scope.article = savedArticle;
	$scope.savedTags = Storage.getAllTags();

	$scope.$watch('article.tags', function(tags){
		console.log(tags);
		if(angular.isDefined(tags)){
			if(tags.length > 0){
				Storage.saveArticle($scope.article);
			}
		}
	},true);


	//
	// public
	//
	$scope.goToArticles = function(){
		$state.go('articles');
	}

}])