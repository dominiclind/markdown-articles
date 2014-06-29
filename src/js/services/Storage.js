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

		deleteArticle : function(id) {
			var articles = this.getArticles();

			for(key in articles){
				if(articles[key].id == id){
					articles.splice(key,1);
				}
			}

			$window.localStorage.setItem('articles', JSON.stringify(articles));
			$rootScope.$emit('articles', articles);

		},
		
		saveArticle : function(article, publish) {
			var articles = this.getArticles(),
				action = '';

			if(article.title == undefined || article.title == ''){
				console.log("not saving article due to no content");
				return false;
			}

			for(key in articles){

				// EDIT ARTICLE
				if(articles[key].id == article.id){
					action = 'edited';
					
					if(publish == true){
						console.log("publish article, set it to published");
						article.published = true;
					}else{
						console.log("set article to non-published");
						article.published = false;
					}

					articles[key] = article;
					
				}
			}

			// NEW ARTICLE
			if(action != 'edited'){
				action = 'new';
				articles.push(article);
			}

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