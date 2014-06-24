app.directive('rFloatyLabel', ['$window', function ($window) {
  
  var RIGHT_OFFSET = 10;

  return {
      restrict: 'A',
      scope : {
        placeholder : '@rFloatyLabel'
      },
      link: function (scope, elm, attr) {
          console.log(scope);

          elm.wrap('<div class="floaty">');
          elm.parent().append('<div class="floaty-label">'+ scope.placeholder +'</div>');

          var checkState = function(){
            elm.removeClass('has-text');
            elm.removeClass('empty');
            var label = elm.parent().find('.floaty-label');

            label.addClass('type-' + label.text());

            console.log(label);
            if(elm.val().length > 0){
              elm.addClass('has-text')
              console.log("HAS TEXTTT");

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

          window.setTimeout(function(){
            checkState();
          },0);

          elm.on('keydown change keyup', function(){
            checkState();
          });
      }
    }
}])