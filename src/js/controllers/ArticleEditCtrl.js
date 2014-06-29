app.controller('ArticleEditCtrl', ['$scope', '$rootScope', '$stateParams', '$state' ,'Storage', function ($scope, $rootScope, $stateParams, $state, Storage) {

	var savedArticle = Storage.getArticle($stateParams.id) || {
		id : $stateParams.id,
		text : '',
	};

	$scope.livePreview = false;
	$scope.fullPreview = false;
	$scope.article = savedArticle;
	
	var firstTime = true;
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

     		if(!firstTime){
				Storage.saveArticle($scope.article);
			}
			firstTime = false;
		}
	});

	$rootScope.$on('edit:isUrl', function(e, isUrl){
		$scope.isUrl = isUrl;
	});

	// public

	$scope.publishArticle = function () {
		$state.go('.publish', {id : $stateParams.id});	
	}

}])