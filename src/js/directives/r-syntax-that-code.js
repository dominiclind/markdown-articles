app.directive('rSyntaxThatCode', ['$timeout', function ($timeout) {
	return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        	console.log(elm);

        	$timeout(function(){
                if(elm.find('code').length > 0){
            		scope.$apply(function(){
            			hljs.highlightBlock(elm.find('code')[0]);
            		})
                }
        	},0);  
    	}
    }
}])