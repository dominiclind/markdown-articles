// debounce
app.directive('rPublishButton', ['$rootScope', '$state', 'Storage', function ($rootScope, $state, Storage) {

    var SHOW_TRIGGER = 20;

    return {
        restrict: 'A',
        link: function (scope, elm, attr) {

            scope.isPublished = Storage.getArticle($state.params.id).published || false;
            
            scope.$watch('isPublished', function(isPublished){
                if(isPublished){
                    elm.addClass('published');
                    angular.element(elm.children()[1]).text('Published');
                }else{
                    elm.removeClass('published');
                    angular.element(elm.children()[1]).text('Publish');
                }
            });


            // events
            $rootScope.$on('edited', function(e, note){
                var article = Storage.getArticle(note.id);
                scope.isPublished = Storage.getArticle($state.params.id).published || false;
            });

        }
    }
}])