$(document).ready(function() {
    // fadeIn animatie voor container
    $('.container').css('opacity', '1');

    // slideDown animatie voor header en footer
    $('header, footer').each(function(index) {
        $(this).css('opacity', '1');
        $(this).css('animation-delay', (index + 1) * 0.5 + 's');
    });

    // slideUp animatie voor elke sectie
    $('section').each(function(index) {
        $(this).css('opacity', '1');
        $(this).css('animation-delay', (index + 1) * 0.5 + 's');
    });
});
