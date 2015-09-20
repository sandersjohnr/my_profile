$(function() {
  var $popup = $('.popup');
  var $portfolio = $('#portfolio');

  $popup.hide();
  $portfolio.on('mouseover', function(){
    $popup.fadeIn(500);
  });
  $portfolio.on('mouseleave', function(){
    $popup.fadeOut(500);
  });


});
