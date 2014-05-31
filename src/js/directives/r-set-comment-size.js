app.directive('rSetCommentSize', ['$window', function ($window) {
	return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        	
            var TOP_OFFSET = 0;

            console.log(elm);
            
            elm.css({
                height : window.innerHeight - TOP_OFFSET + 'px'
            })
        	angular.element(window).bind('resize', function(){
                console.log("RESIZE");
                elm.css({
                    height : window.innerHeight - TOP_OFFSET + 'px'
                })
            })

    	}
    }
}])