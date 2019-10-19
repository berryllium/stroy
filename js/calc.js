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
  $('.js-pform-show').on("click", function () {
    let type = $('.head_form [name="build"]:checked').val()
    let rooms = $('.head_form__count1').val()
    let area = $('.head_form__count2').val()
    $('[data-remodal-id="modal_calc"] input[name="param"]').val(`Тип ремонта: ${type.toLowerCase()}, комнат: ${rooms}, площадь: ${area}`)
  });
};
headerCalc();