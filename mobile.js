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

  setInterval(function() {
    $('#front1').addClass('flip');
    $('#back1').addClass('flip');
    $('#front2').addClass('flip');
    $('#back2').addClass('flip');
    setTimeout(function() {
      $('#front1').removeClass('flip');
      $('#back1').removeClass('flip');
      $('#front2').removeClass('flip');
      $('#back2').removeClass('flip');
    }, 2000)
  }, 4000);


});
