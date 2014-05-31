var app = angular.module('articles', ['ui.router' , 'ngAnimate', 'ngTagsInput', 'angular-loading-bar']);
app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'cfpLoadingBarProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider) {
        $httpProvider.defaults.withCredentials = true;
        $urlRouterProvider.otherwise('articles');


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








app.directive('textarea', ['$timeout', function ($timeout) {
	return {
      restrict: 'E',
      link: function (scope, elm, attr) {
        HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
		    return this.selectionStart;
		};
		HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
		    this.selectionStart = position;
		    this.selectionEnd = position;
		    this.focus();
		};
		HTMLTextAreaElement.prototype.hasSelection = function () { //if the textarea has selection then return true
		    if (this.selectionStart == this.selectionEnd) {
		        return false;
		    } else {
		        return true;
		    }
		};
		HTMLTextAreaElement.prototype.getSelectedText = function () { //return the selection text
		    return this.value.substring(this.selectionStart, this.selectionEnd);
		};
		HTMLTextAreaElement.prototype.setSelection = function (start, end) { //change the selection area of the textarea
		    this.selectionStart = start;
		    this.selectionEnd = end;
		    this.focus();
		};


		elm.bind('keydown', function(event){

			var textarea = elm[0];
	    
		    //support tab on textarea
		    if (event.keyCode == 9) { //tab was pressed
		        var newCaretPosition;
		        newCaretPosition = textarea.getCaretPosition() + "    ".length;
		        textarea.value = textarea.value.substring(0, textarea.getCaretPosition()) + "    " + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
		        textarea.setCaretPosition(newCaretPosition);
		        return false;
		    }
		    if(event.keyCode == 8){ //backspace
		        if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            var newCaretPosition;
		            newCaretPosition = textarea.getCaretPosition() - 3;
		            textarea.value = textarea.value.substring(0, textarea.getCaretPosition() - 3) + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
		            textarea.setCaretPosition(newCaretPosition);
		        }
		    }
		    if(event.keyCode == 37){ //left arrow
		        var newCaretPosition;
		        if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            newCaretPosition = textarea.getCaretPosition() - 3;
		            textarea.setCaretPosition(newCaretPosition);
		        }    
		    }
		    if(event.keyCode == 39){ //right arrow
		        var newCaretPosition;
		        if (textarea.value.substring(textarea.getCaretPosition() + 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            newCaretPosition = textarea.getCaretPosition() + 3;
		            textarea.setCaretPosition(newCaretPosition);
		        }
		    } 
		
		});

   		}
    }

}])

// markdown 

app.filter('markdown', function ($sce) {
    var converter = new Showdown.converter();
    return function (value) {
		var html = converter.makeHtml(value || '');
        return $sce.trustAsHtml(html);
    };
});