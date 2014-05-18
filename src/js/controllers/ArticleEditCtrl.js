app.controller('ArticleEditCtrl', ['$scope', '$rootScope', '$stateParams', '$state' ,'Storage', function ($scope, $rootScope, $stateParams, $state, Storage) {

	var savedArticle = Storage.getArticle($stateParams.id) || {
		id : $stateParams.id,
		text : '',
	};

	$scope.livePreview = false;
	$scope.fullPreview = false;
	$scope.article = savedArticle;
	
	$scope.$watch('article.text', function(text){
		if(text.length > 0){
			Storage.saveArticle($scope.article);
		}
	});

	$scope.$watch('article.title', function(text){
		if(text.length > 0){
			Storage.saveArticle($scope.article);
		}
	});

	// public
	$scope.toggleLiveView = function() {
		console.log("toggle live preview");
		$scope.fullPreview = false;
		$scope.livePreview = !$scope.livePreview;
	}

	$scope.toggleFullPreview = function() {
		console.log("toggle full preview");
		$scope.livePreview = false;
		$scope.fullPreview = !$scope.fullPreview;
	}
	$scope.viewArticles = function () {
		$state.go('articles');
	}

	$scope.publishArticle = function () {
		$state.go('.publish', {id : $stateParams.id});	
	}

}])