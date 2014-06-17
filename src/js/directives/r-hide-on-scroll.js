// debounce
app.directive('rHideOnScroll', [function () {

    var SHOW_TRIGGER = 20;

    return {
        restrict: 'A',
        link: function (scope, elm, attr) {
            var position  = angular.element(window).scrollTop(),
                start     = position,
                timer,
                navHeight = elm[0].getBoundingClientRect().height;


            angular.element(window).bind('scroll', function(){
                var scroll = angular.element(window).scrollTop();
                clearTimeout(timer);
  
                if(scroll > position){
                    elm.css({
                        '-webkit-transition' : 'none',
                        '-webkit-transform' : 'translateY(-'+ scroll +'px)'
                    })
                }else{
                    if( (start - scroll) > SHOW_TRIGGER ){
                        elm.css({
                            '-webkit-transition' : 'all 200ms ease',
                            '-webkit-transform'  : 'translateY(0px)'
                        })
                    }
                }

                if(scroll <= 0){
                    elm.css({
                        '-webkit-transition' : 'all 100ms ease',
                        '-webkit-transform'  : 'translateY(0px)',
                    })
                    elm.removeClass('black');
                }else{
                    if(scroll > navHeight){
                        elm.addClass('black');
                    }
                }

                position = scroll;

                timer = setTimeout(function(){
                    start = scroll;
                },100);

            });

            angular.element(window).bind('mouseup', function(){
                var scroll = angular.element(window).scrollTop();

                console.log("scrollend" + scroll);
            });
        }
    }
}])