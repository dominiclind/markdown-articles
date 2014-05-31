app.controller('ArticleCtrl', ['$scope', '$rootScope', '$stateParams', '$state' ,'Storage', function ($scope, $rootScope, $stateParams, $state, Storage) {

	var savedArticle = Storage.getArticle($stateParams.id);

	$scope.article = savedArticle;
	$scope.showComments = false;	
	//
	// public
	//
	$scope.toggleComments = function(){
		console.log("YO");
		$scope.showComments = !$scope.showComments;
		if($scope.showComments){
			$rootScope.hideOverflow = true;
		}else{
			$rootScope.hideOverflow = false;
		}
	}	

}])
