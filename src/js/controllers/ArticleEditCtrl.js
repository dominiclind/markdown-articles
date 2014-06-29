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
 			
 			var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

     		if(regex.test(article.title)){
     			$rootScope.$emit('edit:isUrl', true);
     			article.isUrl = true;
     		}else{
     			$rootScope.$emit('edit:isUrl', false);
     			article.isUrl = false;
     		}

			Storage.saveArticle($scope.article);
		}
	});

	$rootScope.$on('edit:isUrl', function(e, isUrl){
		console.log("root emit;; is URL : " + isUrl);
		$scope.isUrl = isUrl;
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