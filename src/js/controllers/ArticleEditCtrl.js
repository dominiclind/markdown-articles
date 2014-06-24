app.controller('ArticleEditCtrl', ['$scope', '$rootScope', '$stateParams', '$state' ,'Storage', function ($scope, $rootScope, $stateParams, $state, Storage) {

	var savedArticle = Storage.getArticle($stateParams.id) || {
		id : $stateParams.id,
		text : '',
	};

	$scope.livePreview = false;
	$scope.fullPreview = false;
	$scope.article = savedArticle;
	
	$scope.$watchCollection('article', function(article){
		if(angular.isDefined(article)){
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