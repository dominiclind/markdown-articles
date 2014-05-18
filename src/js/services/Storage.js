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