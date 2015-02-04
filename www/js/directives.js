angular.module('starter.directives', [])

    .directive('swipable', function($timeout) {
        return {
            restrict: 'A',
            link: function (scope, el, attrs) {

                var width = el[0].offsetWidth;
                var dragging = false;

                el.on('touch', function(e) {
                    document.addEventListener("touchmove", preventBehavior, false);
                });

                el.on('dragstart', function(e) {

                    var deltaX = Math.abs(e.gesture.deltaX);
                    var deltaY = Math.abs(e.gesture.deltaY);
                    var momenY = Math.abs(e.gesture.velocityY + deltaY);

                    if (momenY < 5 && deltaX > 1) {
                        dragging = true;
                        unanimate();
                    } else {
                        document.removeEventListener("touchmove", preventBehavior, false);
                    }

                    e.preventDefault();
                    e.stopPropagation();
                });

                el.on('drag', function(e) {
                    if (dragging) {
                        translate(e.gesture.deltaX);
                    }
                });

                el.on('dragend', function(e) {
                    dragging = false;
                    e.preventDefault();
                    e.stopPropagation();
                });

                el.on('release', function(e) {

                    if (!dragging) {

                        var deltaX = e.gesture.deltaX;
                        var velX = e.gesture.velocityX;
                        var momentum = Math.abs(deltaX * velX);

                        animate();
                        if (deltaX > width*.5 || velX > .5) {
                            remove(deltaX < 0);
                        } else {
                            translate(0);
                        }

                        document.removeEventListener("touchmove", preventBehavior, false);
                    }

                    e.stopPropagation();
                    e.preventDefault();
                });

                el.on('mouseout', function(e) {
                    if (dragging) {
                        animate();
                        translate(0);
                        dragging = false;
                        document.removeEventListener("touchmove", preventBehavior, false);
                    }
                });

                function translate(x) {
                    el.css('transform', 'translate3d(' + x + 'px, 0, 0)');
                    el.css('-webkit-transform', 'translate3d(' + x + 'px, 0, 0)');
                }

                function animate(_ms) {
                    var ms = _ms || 256;
                    el.css('transition', ms + 'ms all ease');
                }

                function unanimate() {
                    el.css('transition', '0 all ease');
                }

                function flatten() {
                    $timeout(function () {
                        scope.$emit('remove', attrs.swipable);
                    }, 256);

                    unanimate();

                    el.css('visibility', 'hidden');
                    el.css('border-width', 0);

                    setTimeout(function () {
                        animate(128);
                        el.css('height', 0);
                        //el.css('width', 0);
                        el.css('padding', 0);
                        el.css('margin', 0);
                    }, 16);
                }

                function remove(isLeft) {
                    var dist, event;
                    if (isLeft) {
                        dist  = -width*1.25;
                        event = 'swipe left';
                    } else {
                        dist  = width*1.25;
                        event = 'swipe right';
                    }
                    translate(dist);
                    setTimeout(flatten, 256);
                }

                function preventBehavior(e) {
                    e.preventDefault();
                }
            }
        };
    });