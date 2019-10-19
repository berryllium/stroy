function calculateRadio(radio, radioval, radioname, radiotext, radioimage, radioid) {
  radio = document.getElementById(radio);
  radiocena = jQuery(radio).next().html();
  radioval = document.getElementById(radioval);
  radiotext = document.getElementById(radiotext);
  radiotext = jQuery(radiotext).html();
  radioimage = document.getElementById(radioimage);
  radioimage = jQuery(radioimage).html();
  radioid = document.getElementById(radioid);
  radioid = jQuery(radioid).html();
  jQuery('input[type=radio][name=' + radioname + ']').parent().find('i').html('0');
  jQuery(radioval).parent().parent().parent().find('label').removeClass('active');
  if (radio.checked) {
    jQuery(radioval).html(radiocena);
    jQuery(radio).parent().addClass('active');
    jQuery(radio).parent().parent().parent().parent().parent().find('.calc-body-right span').html(radiotext);
    jQuery(radio).parent().parent().parent().parent().parent().find('.cws1b1b2-p2 i').html(radiotext);
    jQuery(radio).parent().parent().parent().parent().parent().find(".calc-body-right img").attr("src", radioimage);
    jQuery(radio).parent().parent().parent().find('.idVal').html(radioid);
  }
  calculateSumm();
}

function calculateCheckbox(cbx, cbxtext, cbxid, cbxselected) {
  cbx = document.getElementById(cbx);
  cbxtext = document.getElementById(cbxtext);
  cbxtext = jQuery(cbxtext).html();
  cbxid = document.getElementById(cbxid);
  cbxid = jQuery(cbxid).html();
  cbxselected = document.getElementById(cbxselected);
  if (cbx.checked) {
    if (cbxid === 'work-1') {
      jQuery('.cws3b1b2-work1').html(cbxtext);
      jQuery('.cws3b1b2-work1').removeClass('dspn');
      jQuery('.inh3').val(cbxtext);
    }
    if (cbxid === 'work-2') {
      jQuery('.cws3b1b2-work2').html(cbxtext);
      jQuery('.cws3b1b2-work2').removeClass('dspn');
      jQuery('.inh4').val(cbxtext);
    }
    if (cbxid === 'work-3') {
      jQuery('.cws3b1b2-work3').html(cbxtext);
      jQuery('.cws3b1b2-work3').removeClass('dspn');
      jQuery('.inh5').val(cbxtext);
    }
    if (cbxid === 'work-4') {
      jQuery('.cws3b1b2-work4').html(cbxtext);
      jQuery('.cws3b1b2-work4').removeClass('dspn');
      jQuery('.inh6').val(cbxtext);
    }
    if (cbxid === 'work-5') {
      jQuery('.cws3b1b2-work5').html(cbxtext);
      jQuery('.cws3b1b2-work5').removeClass('dspn');
      jQuery('.inh7').val(cbxtext);
    }
    jQuery(cbxselected).html(cbxid);
    jQuery(cbx).parent().addClass('active');
  } else {
    if (cbxid === 'work-1') {
      jQuery('.cws3b1b2-work1').empty();
      jQuery('.cws3b1b2-work1').addClass('dspn');
      jQuery('.inh3').val('');
    }
    if (cbxid === 'work-2') {
      jQuery('.cws3b1b2-work2').empty();
      jQuery('.cws3b1b2-work2').addClass('dspn');
      jQuery('.inh4').val('');
    }
    if (cbxid === 'work-3') {
      jQuery('.cws3b1b2-work3').empty();
      jQuery('.cws3b1b2-work3').addClass('dspn');
      jQuery('.inh5').val('');
    }
    if (cbxid === 'work-4') {
      jQuery('.cws3b1b2-work4').empty();
      jQuery('.cws3b1b2-work4').addClass('dspn');
      jQuery('.inh6').val('');
    }
    if (cbxid === 'work-5') {
      jQuery('.cws3b1b2-work5').empty();
      jQuery('.cws3b1b2-work5').addClass('dspn');
      jQuery('.inh7').val('');
    }
    jQuery(cbxselected).empty();
    jQuery(cbx).parent().removeClass('active');
  }
  calculateSummStep3();
}
var a, L, epl = jQuery("#area-mc");

function epl3() {
  a = epl.val();
  if (a < 1) {
    ae = 0;
  } else {
    ae = a;
  }
  jQuery(".cws1b1b2-p1 i").html(ae);
  jQuery(".input-area-mc").val(ae);
  calculateSumm();
};
epl3();
jQuery("#area-mc").click(function () {
  setTimeout('epl3()', 100);
});
epl.bind('mouseout mousemove keydown keypress keyup', function (e) {
  setTimeout('epl3()', 100);
});

function calculateSumm() {
  s = parseInt(jQuery('.cws1b1b2-p1 i').html());
  cherepica1 = parseInt(jQuery('#cherepica1Val').html());
  cherepica2 = parseInt(jQuery('#cherepica2Val').html());
  cherepica3 = parseInt(jQuery('#cherepica3Val').html());
  cherepica4 = parseInt(jQuery('#cherepica4Val').html());
  cherepica = cherepica1 + cherepica2 + cherepica3 + cherepica4;
  sumcherepica = s * cherepica;
  jQuery('.cw-step1 .cbb1-step1 i').html(sumcherepica.toFixed(0));
  var em = String(sumcherepica);
  var emResult = em.replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ");
  jQuery(".cw-step1 .cbb1-step1 em").html(emResult);
  cherepicaid = jQuery('.cw-step1 .idVal').html();
  krushaid = jQuery('.cw-step2 .idVal').html();
  summkrusha = 0;
  step2summ = 0;
  if (krushaid === 'krusha-1') {
    jQuery('.cw-step2 .cbb1-step2 i').html(sumcherepica.toFixed(0));
    var em = String(sumcherepica);
    var emResult = em.replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ");
    jQuery(".cw-step2 .cbb1-step2 em").html(emResult);
  } else if (krushaid === 'krusha-2') {
    if (cherepicaid === 'cherepica-1') {
      summkrusha = s * 10;
      step2Summ();
    }
    if (cherepicaid === 'cherepica-2') {
      summkrusha = s * 20;
      step2Summ();
    }
    if (cherepicaid === 'cherepica-3') {
      summkrusha = s * 30;
      step2Summ();
    }
    if (cherepicaid === 'cherepica-4') {
      summkrusha = s * 30;
      step2Summ();
    }
  } else if (krushaid === 'krusha-3') {
    if (cherepicaid === 'cherepica-1') {
      summkrusha = s * 30;
      step2Summ();
    }
    if (cherepicaid === 'cherepica-2') {
      summkrusha = s * 50;
      step2Summ();
    }
    if (cherepicaid === 'cherepica-3') {
      summkrusha = s * 60;
      step2Summ();
    }
    if (cherepicaid === 'cherepica-4') {
      summkrusha = s * 80;
      step2Summ();
    }
  }

  function step2Summ() {
    step2summ = summkrusha + sumcherepica;
    jQuery('.cw-step2 .cbb1-step2 i').html(step2summ.toFixed(0));
    var em2 = String(step2summ);
    var emResult2 = em2.replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ");
    jQuery(".cw-step2 .cbb1-step2 em").html(emResult2);
  }
};

function calculateSummStep3() {
  s = parseInt(jQuery('.cws1b1b2-p1 i').html());
  step2summ = parseInt(jQuery('.cw-step2 .cbb1-step2 i').html());
  krushaid = jQuery('.cw-step2 .idVal').html();
  work1 = jQuery('#work1selected').html();
  work2 = jQuery('#work2selected').html();
  work3 = jQuery('#work3selected').html();
  work4 = jQuery('#work4selected').html();
  work5 = jQuery('#work5selected').html();
  work1Summ = 0;
  work2Summ = 0;
  work3Summ = 0;
  work4Summ = 0;
  work5Summ = 0;
  if (work1 === 'work-1') {
    work1Summ = s * 100;
  }
  if (work2 === 'work-2') {
    if (krushaid === 'krusha-1') {
      work2Summ = s * 450;
    } else if (krushaid === 'krusha-2') {
      work2Summ = s * 500;
    } else if (krushaid === 'krusha-3') {
      work2Summ = s * 550;
    }
  }
  if (work3 === 'work-3') {
    work3Summ = s * 210;
  }
  if (work4 === 'work-4') {
    work4Summ = s * 130;
  }
  if (work5 === 'work-5') {
    work5Summ = s * 70;
  }
  workSumm = work1Summ + work2Summ + work3Summ + work4Summ + work5Summ;
  step3summ = workSumm + step2summ;
  jQuery('.cw-step3 .cbb1-step3 i').html(step3summ.toFixed(0));
  jQuery('.cw-step4 .cbb1-step4 i').html(step3summ.toFixed(0));
  var em3 = String(step3summ);
  var emResult3 = em3.replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ");
  jQuery(".cw-step3 .cbb1-step3 em").html(emResult3);
  jQuery(".cw-step4 .cbb1-step4 em").html(emResult3);
  jQuery(".input-summa").val(emResult3);
}
jQuery('.step1-btnNext').click(function () {
  var cherepicaName = jQuery('.cws1b1-block2 .cws1b1b2-p2 i').html();
  jQuery('.cws2b1-block2 .cws2b1b2-p3').html(cherepicaName);
  jQuery('.cw-step1').hide();
  jQuery('.cw-step2').show();
  calculateSumm();
});
jQuery('.step2-btnPrev').click(function () {
  jQuery('.cw-step2').hide();
  jQuery('.cw-step1').show();
});
jQuery('.step2-btnNext').click(function () {
  var cherepicaName = jQuery('.cws1b1-block2 .cws1b1b2-p2 i').html();
  jQuery('.cws3b1-block2 .cws3b1b2-p3').html(cherepicaName);
  jQuery('.inh1').val(cherepicaName);
  var krushaName = jQuery('.cws2b1-block2 .cws1b1b2-p2 i').html();
  jQuery('.cws3b1-block2 .cws3b1b2-p4 i').html(krushaName);
  jQuery('.inh2').val(krushaName);
  jQuery('.cw-step2').hide();
  jQuery('.cw-step3').show();
  calculateSummStep3();
});
jQuery('.step3-btnPrev').click(function () {
  jQuery('.cw-step3').hide();
  jQuery('.cw-step2').show();
});
jQuery('.step3-btnNext').click(function () {
  var cherepicaName = jQuery('.cws1b1-block2 .cws1b1b2-p2 i').html();
  jQuery('.cws4b1-block2 .cws4b1b2-p3').html(cherepicaName);
  var krushaName = jQuery('.cws2b1-block2 .cws1b1b2-p2 i').html();
  jQuery('.cws4b1-block2 .cws4b1b2-p4 i').html(krushaName);
  jQuery('.cw-step3').hide();
  jQuery('.cw-step4').show();
});
jQuery('.step4-btnPrev').click(function () {
  jQuery('.cw-step4').hide();
  jQuery('.cw-step3').show();
});
jQuery("#form-main-calc").trigger('reset');


jQuery(document).ready(function () {
  jQuery("#form-main-calc").submit(function () {
    return false;
  });
  jQuery("#form-main-calc-send").on("click", function () {
    var err = false;
    var name = jQuery("#name-main-calc").val();
    var phone = jQuery("#phone-main-calc").val();
    var namelen = name.length;
    var phonelen = phone.length;
    if (namelen < 3) {
      jQuery("#name-main-calc").addClass("error");
      err = true;
    } else {
      jQuery("#name-main-calc").removeClass("error");
    }
    if (phonelen < 7) {
      jQuery("#phone-main-calc").addClass("error");
      err = true;
    } else {
      jQuery("#phone-main-calc").removeClass("error");
    }
    if (!err) {
      jQuery.ajax({
        type: 'POST',
        url: 'js/smec.php',
        data: jQuery("#form-main-calc").serialize(),
        success: function (data) {
          if (data == true) {
            jQuery(".cws4-success").fadeIn(900).delay(1000);
            jQuery('.cws4-body').hide();
            jQuery('.last-title').hide();
          }
        }
      });
    } else {}
  });
});

function mask(inputName, mask, evt) {
  try {
    var text = document.getElementById(inputName);
    var value = text.value;
    try {
      var e = (evt.which) ? evt.which : event.keyCode;
      if (e == 46 || e == 8) {
        text.value = "";
        return;
      }
    } catch (e1) {}
    var literalPattern = /[0\*]/;
    var numberPattern = /[0-9]/;
    var newValue = "";
    for (var vId = 0, mId = 0; mId < mask.length;) {
      if (mId >= value.length)
        break;
      if (mask[mId] == '0' && value[vId].match(numberPattern) == null) {
        break;
      }
      while (mask[mId].match(literalPattern) == null) {
        if (value[vId] == mask[mId])
          break;
        newValue += mask[mId++];
      }
      newValue += value[vId++];
      mId++;
    }
    text.value = newValue;
  } catch (e) {}
}

jQuery(function ($) {
  $("#phone-main-calc").attr("onkeyup", "javascript:mask('phone-main-calc', '+7(000)000-00-00', event);");
});

jQuery("#phone-main-calc").focus(function () {
  var phone = jQuery(this).val();
  var phonelen = phone.length;
  if (phonelen < 1) {
    jQuery(this).val('+7(');
    jQuery(this).focus();
  }
});
jQuery("#phone-main-calc").focusout(function () {
  var phone = jQuery(this).val();
  var phonelen = phone.length;
  if (phonelen < 4) {
    jQuery(this).val('');
  }
});


function setHeiHeightB1() {
  var heightB1 = jQuery(window).height() + 'px';
  jQuery('.block1').css('height', heightB1);
}
jQuery(document).ready(function () {
  setHeiHeightB1();
});
jQuery(window).resize(setHeiHeightB1);


function setWidthKrowlya() {
  var width = jQuery('.kib1m-title').width() + 'px';
  jQuery('.kib1m-title span').css('width', width);
}
jQuery(document).ready(function () {
  setWidthKrowlya();
});
jQuery(window).resize(setWidthKrowlya);


jQuery(function ($) {
  jQuery('.fancybox').fancybox();
});
jQuery(function ($) {
  jQuery('.fancybox-form').fancybox({
    wrapCSS: 'fancybox-form',
    maxHeight: '80%',
    maxWidth: '80%'
  });
});
jQuery(function ($) {
  jQuery('.fancybox-obrabotka').fancybox({
    wrapCSS: 'fancybox-obrabotka'
  });
});