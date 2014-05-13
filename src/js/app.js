var app = angular.module('articles', ['ui.router' , 'ngAnimate', 'ngTagsInput']);


app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
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
		    .state('article-publish', {
		        url: "/article/:id/:isEdit/publish",
		        templateUrl: 'views/article-publish.html',
		        controller : 'ArticlePublishCtrl'
		    })

    }
]);

app.run(['$rootScope', '$urlRouter', '$state',
    function($rootScope, $urlRouter, $state) {
        
        $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
            $rootScope.currentStateName = toState.name;
            	
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



app.controller('MainCtrl', ['$scope', '$rootScope', '$state', '$stateParams', function ($scope, $rootScope, $state, $stateParams) {



	//state listens
	$rootScope.$on('new', function(e, note){
		console.log("Created article with id : " + note.id);
	});	

	$rootScope.$on('edited', function(e, note){
		console.log("Edited article with id : " + note.id);
	});	

	$rootScope.$on('deleted', function(e, note){
		console.log("Deleted article with id : " + note.id);
	});	



	//
	// public
	//

	// public
	$scope.goToArticles = function() {
		$state.go('articles');
	}
	$scope.newArticle = function() {
		$state.go('article-edit', {id : new Date().getTime(), isEdit : 'edit'});
	}
	// public
	$scope.editArticle = function() {
		$state.go('article-edit', {id : $stateParams.id, isEdit : 'edit'});
	}

}])

app.controller('ArticleCtrl', ['$scope', '$rootScope', '$stateParams', '$state' ,'Storage', function ($scope, $rootScope, $stateParams, $state, Storage) {

	var savedArticle = Storage.getArticle($stateParams.id);

	$scope.article = savedArticle;
}])

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
		$state.go('article-publish', {id : $stateParams.id});	
	}

}])

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

	console.log($scope.savedTags)

	console.log(savedArticle);

	//
	// public
	//

	$scope.goToArticles = function(){
		$state.go('articles');
	}

}])

app.controller('ArticlesCtrl', ['$scope', '$rootScope' ,'Storage', '$state', function ($scope, $rootScope, Storage, $state) {
	console.log("Articles ctrl");

	$scope.articles = Storage.getArticles();
	

	Storage.getAllTags().then(function(t){
		$scope.allTags = t;
	});

	$scope.viewArticle = function(article) {
		$state.go('article', {id : article.id});
	}

}])


app.controller('NavCtrl', ['$scope', '$rootScope', '$state' ,'Storage', function ($scope, $rootScope, $state, Storage) {



}])







// Storage
app.factory('Storage', ['$window', '$rootScope', '$q',function ($window, $rootScope, $q) {

	
	return {

		getArticles : function() {
			var articles = $window.localStorage.getItem('articles') || [];

			if(angular.isString(articles)){
				return JSON.parse(articles);
			}else{
				return articles;
			}
			
		},

		getArticle : function(id) {
			var articles = this.getArticles();

			var found = false;
			for(key in articles){
				if(articles[key].id == id){
					found = articles[key];
				}
			}

			return found;

		},

		deleteArticle : function(article) {
			var articles = this.getArticles();

			for(key in articles){
				if(articles[key].id == article.id){
					articles.splice(key,1);
				}
			}

			$window.localStorage.setItem('articles', JSON.stringify(articles));
			$rootScope.$emit('articles', articles);

		},
		
		saveArticle : function(article) {
			var articles = this.getArticles();

			var action = '';
			for(key in articles){

				if(articles[key].id == article.id){
					articles[key] = article;
					action = 'edited';
				}
			}

			if(action != 'edited'){
				articles.push(article);
				action = 'new';
			}


			console.log(articles);
			$window.localStorage.setItem('articles', JSON.stringify(articles));
			$rootScope.$emit(action, article);
		},

		getAllTags : function() {
			var deferred = $q.defer();
			var tags = [
				{
					text: 'ux'
				},
				{
					text: 'tech'
				},
				{
					text: 'python'
				},	
				{
					text: 'css'
				}
			]


			deferred.resolve(tags);

			return deferred.promise;
		}

	};

}])


// debounce
app.directive('debounce', ['$timeout',function ($timeout) {
	return {
      restrict: 'A',
      require: 'ngModel',
      priority: 99,
      link: function (scope, elm, attr, ngModelCtrl) {
          if (attr.type === 'radio' || attr.type === 'checkbox') {
              return;
          }

          var delay = parseInt(attr.debounce, 10);
          if (isNaN(delay)) {
              delay = 1000;
          }

          elm.unbind('input');
          
          var debounce;
          elm.bind('change', function () {
              $timeout.cancel(debounce);
              debounce = $timeout(function () {
                  scope.$apply(function () {
                      ngModelCtrl.$setViewValue(elm.val());

                      // highlight that code
                      $('code').each(function(i, e) {hljs.highlightBlock(e)});

              });
              }, delay);
          });
          elm.bind('keyup', function () {
              scope.$apply(function () {
                  ngModelCtrl.$setViewValue(elm.val());
                  $('code').each(function(i, e) {hljs.highlightBlock(e)});
              });
          });
          elm.bind('blur', function () {
              scope.$apply(function () {
                  ngModelCtrl.$setViewValue(elm.val());
                  $('code').each(function(i, e) {hljs.highlightBlock(e)});
              });
          });

          $('code').each(function(i, e) {hljs.highlightBlock(e)});
      }
    }

}])

app.directive('syntaxThatCode', ['$timeout', function ($timeout) {
	return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        	console.log(elm);

        	$timeout(function(){
        		hljs.highlightBlock(elm.find('code')[0]);
        	},0);
        	$('code').each(function(i, e) {
        		//hljs
        	});      
    }
    }

}])

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

    	console.log(elm);
			
		console.log("textarea");
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