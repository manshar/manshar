'use strict';

$(document).ready(function(){
  $winWidth = $(window).width();

  var menuStatus = 'closed';

  $('.menu-icon, .menu').click(function(){
    if(menuStatus === 'closed') {
      $('.body-wrapper, header').css('left','150px');
      menuStatus = 'opened';
    } else {
      $('.body-wrapper, header').css('left','0px');
      menuStatus = 'closed';
    }
  });

  // show comments
  $('.comments').click(function(){
    $el = $(this);
    if($el.hasClass('collapsed')){
      $('.single-article').css('color','#ccc');
      $('.comments').hide();
      $el.show();
      $el.parent().css('color','#000');
      $('.comment-content').fadeOut();
      $el.find('.comment-content').fadeIn();
      $el.find('.comment-image').css('opacity',1);
      $el.removeClass('collapsed').addClass('expanded');
      if($winWidth < 767) {
        $('.content-wrapper').css('margin-right','150px');
      }
    }
  });

  $(window).scroll(function(){
    offset = $(window).scrollTop();

    if(offset > 66) {
    	$('header').css('top', '0');
      if($('.content-wrapper .listing-types-tabs').length > 0) {
        $('header .listing-types-tabs').html($('.content-wrapper .listing-types-tabs').html());
      }
    } else {
    	$('header').css('top', '-48px');
    }
  });

  $('.to-top').click(function(){
    $('body').stop().animate({scrollTop:0}, '500');
  });
});