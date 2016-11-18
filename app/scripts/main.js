/*
	Spectral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    skel
        .breakpoints({
            xlarge: '(max-width: 1680px)',
            large: '(max-width: 1280px)',
            medium: '(max-width: 980px)',
            small: '(max-width: 736px)',
            xsmall: '(max-width: 480px)'
        });

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $wrapper = $('#page-wrapper'),
            $banner = $('#banner'),
            $header = $('#header');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
            

             $('#three').poptrox({
                caption: function($a) {
                    return $a.next('h3').text(); },
                overlayColor: '#2c2c2c',
                overlayOpacity: 0.85,
                popupCloserText: '',
                popupLoaderText: '',
                selector: '.ref-item a.image',
                usePopupCaption: true,
                usePopupDefaultStyling: false,
                usePopupEasyClose: false,
                usePopupNav: true,
                windowMargin: (skel.breakpoint('small').active ? 0 : 50)
            });

              $('#five').poptrox({
                caption: function($a) {
                    return $a.next('h3').text(); },
                overlayColor: '#2c2c2c',
                overlayOpacity: 0.85,
                popupCloserText: '',
                popupLoaderText: '',
                selector: '.ag-item a.image',
                usePopupCaption: true,
                usePopupDefaultStyling: false,
                usePopupEasyClose: false,
                usePopupNav: true,
                windowMargin: (skel.breakpoint('small').active ? 0 : 50)
            });
        });

        // Mobile?
        if (skel.vars.mobile)
            $body.addClass('is-mobile');
        else
            skel
            .on('-medium !medium', function() {
                $body.removeClass('is-mobile');
            })
            .on('+medium', function() {
                $body.addClass('is-mobile');
            });

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on medium.
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // Scrolly.
        $('.scrolly')
            .scrolly({
                speed: 1500,
                offset: $header.outerHeight()
            });

        // Menu.
        $('#menu')
            .append('<a href="#menu" class="close"></a>')
            .appendTo($body)
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                side: 'right',
                target: $body,
                visibleClass: 'is-menu-visible'
            });

        // Header.
        if (skel.vars.IEVersion < 9)
            $header.removeClass('alt');

        if ($banner.length > 0 && $header.hasClass('alt')) {

            $window.on('resize', function() { $window.trigger('scroll'); });

            $banner.scrollex({
                bottom: $header.outerHeight() + 1,
                terminate: function() { $header.removeClass('alt'); },
                enter: function() { $header.addClass('alt'); },
                leave: function() { $header.removeClass('alt'); }
            });

        }



    });


    /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   */

  $.fn.visible = function(partial) {
    
      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;
    
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  };
    


})(jQuery);


var win = $(window);
var allMods = $('.module');

// Already visible modules
allMods.each(function(i, el) {
  var el = $(el);
  if (el.visible(true)) {
    el.addClass('already-visible'); 
  } 
});

win.scroll(function(event) {
  
  allMods.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
      el.addClass('come-in'); 
    } 
  });
  
});