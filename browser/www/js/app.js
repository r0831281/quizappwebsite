$(function(){
    document.addEventListener("deviceready", onDeviceReady, false);




});

function onDeviceReady() {
    console.log('Device is ready');
    screen.orientation.lock('portrait');
    console.log('Orientation is ' + screen.orientation.type);
    $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        indicators: true
    });

    $('select').formSelect();

    $(".changetab").click(function () {
        $('.spa').hide();
        $('#' + $(this).data('show')).show();
    });
    $('#stats').click(function(){
        Stats.init();
    })

    $('#startNewGame').click(function() {
        Game.init();
    });
    $('.backToMenu').click(function(){
        localStorage.clear();
        $('.answer').empty();
        $('.currentQuestion').empty();
        window.location = 'index.html';
        });
};
