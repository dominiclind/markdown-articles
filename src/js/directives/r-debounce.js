// debounce
app.directive('rDebounce', ['$timeout',function ($timeout) {
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