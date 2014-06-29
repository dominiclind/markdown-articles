app.directive('rEditor', ['$timeout','$rootScope', function ($timeout, $rootScope) {
	
	var myEditor;

	var controls = {
        'bold': function() {
            toggleWrapping('**', '**');
        },
        'italic': function() {
            toggleWrapping('_', '_');
        },
        'heading': function() {
        	console.log("fire heading");
            toggleHeading();
        },
        'code': function() {
            toggleWrapping('`', '`');
        },
        'code-block': function() {
            //myEditor.indent('    ');
            toggleWrapping('\n```', '\n```');
        },
        'quote': function() {
            myEditor.indent('> ');
        },
        'ul-list': function() {
            var sel = myEditor.selection(),
                added = "";
            if (sel.value.length > 0) {
                myEditor.indent('', function() {
                    myEditor.replace(/^[^\n\r]/gm, function(str) {
                        added += '- ';
                        return str.replace(/^/, '- ');
                    });
                    myEditor.select(sel.start, sel.end + added.length);
                });
            } else {
                var placeholder = '- List Item';
                myEditor.indent(placeholder, function() {
                    myEditor.select(sel.start + 2, sel.start + placeholder.length);
                });
            }
        },
        'ol-list': function() {
            var sel = myEditor.selection(),
                ol = 0,
                added = "";
            if (sel.value.length > 0) {
                myEditor.indent('', function() {
                    myEditor.replace(/^[^\n\r]/gm, function(str) {
                        ol++;
                        added += ol + '. ';
                        return str.replace(/^/, ol + '. ');
                    });
                    myEditor.select(sel.start, sel.end + added.length);
                });
            } else {
                var placeholder = '1. List Item';
                myEditor.indent(placeholder, function() {
                    myEditor.select(sel.start + 3, sel.start + placeholder.length);
                });
            }
        },
        'link': function() {
            var sel = myEditor.selection(),
                title = prompt('Link Title:', 'Link title goes here...'),
                url = prompt('Link URL:', 'http://'),
                placeholder = 'Your link text goes here...';
            if (url && url !== "" && url !== 'http://') {
                myEditor.wrap('[' + (sel.value.length === 0 ? placeholder : ''), '](' + url + (title !== "" ? ' \"' + title + '\"' : '') + ')', function() {
                    myEditor.select(sel.start + 1, (sel.value.length === 0 ? sel.start + placeholder.length + 1 : sel.end + 1));
                });
            }
            return false;
        },
        'image': function() {
            var url = prompt('Image URL:', 'http://'),
                alt = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')).replace(/[\-\_\+]+/g, " ").capitalize();
            alt = alt.indexOf('/') < 0 ? decodeURIComponent(alt) : 'Image';
            if (url && url !== "" && url !== 'http://') {
                myEditor.insert('\n\n![' + alt + '](' + url + ')\n\n');
            }
            return false;
        },
        'h1': function() {
            heading('#');
        },
        'h2': function() {
            heading('##');
        },
        'h3': function() {
            heading('###');
        },
        'h4': function() {
            heading('####');
        },
        'h5': function() {
            heading('#####');
        },
        'h6': function() {
            heading('######');
        },
        'hr': function() {
            myEditor.insert('\n\n---\n\n');
        }
    };


    function toggleWrapping(open, close) {
        var s = myEditor.selection();
        if (s.before.slice(-open.length) != open && s.after.slice(0, close.length) != close) {
            myEditor.wrap(open, close);
        } else {
            var cleanB = s.before.substring(0, s.before.length - open.length),
                cleanA = s.after.substring(close.length);
            myEditor.area.value = cleanB + s.value + cleanA;
            myEditor.select(cleanB.length, cleanB.length + s.value.length, function() {
                myEditor.updateHistory();
            });
        }
    }

    var HL = 0;

    function toggleHeading() {
        var h = [
                '',
                '# ',
                '## ',
                '### ',
                '#### ',
                '##### ',
                '###### '
            ],
            s = myEditor.selection();
            HL = HL < h.length - 1 ? HL + 1 : 0;
        if (s.value.length > 0) {
            if (!s.before.match(/\#+ $/)) {
                myEditor.wrap(h[HL], "", function() {
                    myEditor.replace(/^\#+ /, ""); // Remove leading hash inside selection
                });
            } else {
                var cleanB = s.before.replace(/\#+ $/, ""), // Clean text before selection without leading hash
                    cleanV = s.value.replace(/^\#+ /, ""); // Clean text selection without leading hash
                myEditor.area.value = cleanB + h[HL] + cleanV + s.after;
                myEditor.select(cleanB.length + h[HL].length, cleanB.length + h[HL].length + cleanV.length, function() {
                    myEditor.updateHistory();
                });
            }
        } else {
            var placeholder = 'Heading Text Goes Here';
            HL = 1;
            myEditor.insert(h[HL] + placeholder, function() {
                s = myEditor.selection().end;
                myEditor.select(s - placeholder.length - h[HL].length + 2, s, function() {
                    myEditor.updateHistory();
                });
            });
        }
    }

  
	return {
		restrict: 'AE',
		transclude : true,
		templateUrl : 'partials/editor.html',
		link: function (scope, elm, attr) {
       		//myEditor = new Editor(elm[0]);
       		var textarea = elm.find('textarea')[0],
       		editorWrap   = elm.find('.editor'),
            tooltip      = elm.find('.editor-tooltip');

            console.log(editorWrap[0].offsetTop);
            editorWrap.css({
                'min-height' : (window.innerHeight - editorWrap[0].offsetTop) + 'px'
            })



       		myEditor = new Editor(textarea);

       		var defaults = [
       			{
       				action : 'italic',
       				name : 'i'
       			},
       			{
       				action : 'heading',
       				name : 'h'
       			},
                {
                    action : 'code-block',
                    name : 'code'
                }
       		];

       		scope.buttons = defaults;
       		scope.showTooltip = false;

       		function toggleTooltip(range, forceClose){
				var coordinates       = {};
				coordinates.start = getCaretCoordinates(myEditor.area, range.start);
				coordinates.end   = getCaretCoordinates(myEditor.area, range.end);

				(coordinates.start.top == coordinates.end.top) ? multiline = false : multiline = true;

				var tipDimensions = tooltip[0].getBoundingClientRect();
				
				if(!multiline){
					left = ( coordinates.start.left + range.length * 5 ) + 'px';
				}else{
					left = '50%';
				}

				// show popup
				if(range.length > 0){
					tooltip.css({
						top : ( coordinates.start.top - tipDimensions.height ) + 'px',
						left: left 
					});

					scope.showTooltip = true;
				}else{
					scope.showTooltip = false;
				}

				if(forceClose){
					scope.showTooltip = true;
				}

			}

       		// public methods
		    scope.fireControl = function(action){
		    	if(controls[action]){
		    		controls[action]();
		    	}
		    };
			
       		// events

			// on mouseup show popmenu
			angular.element(textarea).on('mouseup mouseout', function(){
				var $e = $(this);
				$timeout(function(){
					var range = $e.range();
					toggleTooltip(range);
				},10);
			});

		    var pressed = 0;
		   	angular.element(textarea).on('keydown', function(e){
		        var sel = myEditor.selection();
				
					// show/hide tooltip
				var $e = $(this);
				$timeout(function(){
					var range = $e.range();
					toggleTooltip(range);
				},10);
				
				// Update history data on every 5 key presses
				if (pressed < 3) {
					pressed++;
				} else {
					myEditor.updateHistory();
					pressed = 0;
				}

		        if (e.keyCode == 13) {
		            var isListItem = /(^|\n)( *?)([0-9]+\.|[\-\+\*]) (.*?)$/;
		            if (sel.before.match(isListItem)) {
		                var take = isListItem.exec(sel.before),
		                    list = /[0-9]+\./.test(take[3]) ? parseInt(take[3], 10) + 1 + '.' : take[3]; // <ol> or <ul> ?
		                myEditor.insert('\n' + take[2] + list + ' ');
		                return false;
		            }
		        }

		        if (e.keyCode == 8 && sel.value.length === 0 && sel.before.match(/( *?)([0-9]+\.|[\-\+\*]) $/)) {
		            myEditor.outdent('( *?)([0-9]+\.|[\-\+\*]) ');
		            return false;
		        }

		        // Press `Shift + Tab` to outdent
		        if (e.shiftKey && e.keyCode == 9) {
		            // Outdent from quote
		            // Outdent from ordered list
		            // Outdent from unordered list
		            // Outdent from code block
		            myEditor.outdent('(> |[0-9]+\. |- |    )'); 
		            return false;
		        }

		        // Press `Tab` to indent
		        if (e.keyCode == 9) {
		            myEditor.indent('    ');
		            return false;
		        }

		    });

		}
    }
}])