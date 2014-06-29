// debounce
app.directive('rStatus', [function () {

    return {
        restrict: 'E',
        scope : {
            article : '=article'
        },
        replace : true,
        template : '<span class="status published-{{article.published || false}} ">{{article.published ? "published" : "draft"}}</span>',
        link: function (scope, elm, attr) {
            console.log("asdasdasd")
            console.log(scope.article.published);

        }
    }
}])