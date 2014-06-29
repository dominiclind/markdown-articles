app.directive('rFloatyLabel', ['$window', '$rootScope', function ($window, $rootScope) {
  
  var RIGHT_OFFSET = 10;

  return {
      restrict: 'A',
      scope : {
        placeholder : '@rFloatyLabel'
      },
      link: function (scope, elm, attr) {

          elm.wrap('<div class="floaty">');
          elm.parent().append('<div class="floaty-label">'+ scope.placeholder +'</div>');

          var checkState = function(){
            elm.removeClass('has-text');
            elm.removeClass('empty');
            var label = elm.parent().find('.floaty-label');

            label.addClass('type-' + scope.placeholder);
            if(elm.val().length > 0){
              elm.addClass('has-text')

              label.addClass('showing');
              label.css({
                left : -( label.width() + RIGHT_OFFSET ) + 'px'
              })
              
            }else{
              elm.addClass('empty');
              label.removeClass('showing');
              label.css({
                left : '0px'
              })
            }
          }
          
          $rootScope.$on('edit:isUrl', function(e,isUrl){
            var label = elm.parent().find('.floaty-label');
            if(scope.placeholder == 'title'){
              var originalPlaceholder = attr.rFloatyLabel;
              
              if(isUrl){
                label.text('url');
              }else{
                label.text(originalPlaceholder);
              }
            }
          });

          window.setTimeout(function(){
            checkState();
          },0);

          elm.on('keydown change keyup', function(){
            checkState();
          });
      }
    }
}])