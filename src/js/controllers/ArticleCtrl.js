app.controller('ArticleCtrl', ['$scope', '$rootScope', '$stateParams', '$state' ,'Storage', function ($scope, $rootScope, $stateParams, $state, Storage) {

	var savedArticle = Storage.getArticle($stateParams.id);

	$scope.article = savedArticle;
}])
