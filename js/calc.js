function headerCalc() {
  $('.inp_range_2').on("change mousemove", function () {
    $('.head_form__count2').val($(this).val());
  });
  $('.inp_range_1').on("change mousemove", function () {
    $('.head_form__count1').val($(this).val());
  });

  $('.head_form__count2').on("change", function () {
    $('.inp_range_2').val($(this).val());
  });
  $('.head_form__count1').on("change", function () {
    $('.inp_range_1').val($(this).val());
  });
  // $('.js-pform-show').on("click", function () {

  // });
};
headerCalc();