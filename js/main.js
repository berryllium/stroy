$(document).ready(function() 
{
    $(".owl-carousel").owlCarousel({
        loop: !0,
        margin: 10,
        nav: !0,
        dots: !0,
        responsive: {
            0: {items: 1},
            600: {items: 1},
            1e3: {items: 1}
        }
    });
    var e = $(".owl-carousel");
    $(".prev_it").click(function() 
    {
        return e.trigger("prev.owl.carousel");
    });
    $(".next_it").click(function() 
    {
        return e.trigger("next.owl.carousel");
    });
    $(".accordeon dd").hide().prev().click(function() 
    {
        $(this).parents(".accordeon").find("dd").not(this).slideUp().prev().removeClass("active"); 
        $(this).next().not(":visible").slideDown().prev().addClass("active");
    });
    $(".btn_toogle").click(function() 
    {
        $("nav ul").slideToggle(500);
    }); 
    $(window).resize(function() 
    {
        $(window).width() > 500 && $("nav ul").removeAttr("style");
    });
    $('a[href^="#"].navbarlink').click(function() 
    {
        var e = $(this).attr("href");
        return $("html, body").animate({
            scrollTop: $(e).offset().top
        }, 800);
    });
});