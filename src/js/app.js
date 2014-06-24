var app = angular.module('articles', [
	'ui.router' , 
	'ngAnimate', 
	'ngTagsInput', 
	'angular-loading-bar',
	'monospaced.elastic',
	'relativeDate']);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'cfpLoadingBarProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider) {
        $httpProvider.defaults.withCredentials = true;
        $urlRouterProvider.otherwise('articles');
        cfpLoadingBarProvider.includeSpinner = false;


		$stateProvider
		    .state('articles', {
		        url: "/articles",
		        templateUrl: 'views/articles.html',
		        controller : 'ArticlesCtrl'
		    })
		    .state('article', {
		        url: "/article/:id",
		        templateUrl: 'views/article.html',
		        controller : 'ArticleCtrl'
		    })
		    .state('article-edit', {
		        url: "/article/:id/:isEdit",
		        templateUrl: 'views/article-edit.html',
		        controller : 'ArticleEditCtrl'
		    })
		    .state('article-edit.publish', {
		        url: "/publish",
		        templateUrl: 'views/article.publish.html',
		        controller : 'ArticlePublishCtrl'
		    })
		    .state('me', {
		        url: "/me",
		        templateUrl: 'views/me.html',
		        controller : 'MeCtrl'
		    })

    }
]);
app.run(['$rootScope', '$urlRouter', '$state',
    function($rootScope, $urlRouter, $state) {
        
        $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
            $rootScope.currentStateName = toState.name;
            $rootScope.hideOverflow = false;
            
            if(toParams.isEdit == 'edit'){
           		$rootScope.isEdit = true;
			}else{
				$rootScope.isEdit = false;
			}

            if(toState.name == 'articles'){
            	$rootScope.editNote = false;
            }else{
            	$rootScope.editNote = true;
            }
        })
    }
]);



// markdown 
app.filter('markdown', function ($sce) {
    var converter = new Showdown.converter();
    return function (value) {
		var html = converter.makeHtml(value || '');
        return $sce.trustAsHtml(html);
    };
});