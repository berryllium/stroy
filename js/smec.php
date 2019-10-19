
<?php

/**
 * Send mail

 * @category File
 * @package  MyPackage
 * @author   NVK Other <username@example.com>
 * @license  http://www.gnu.org/copyleft/gpl.html GNU General Public License
 * @version  GIT: $Id$ In development.
 * @link     http://www.hashbangcode.com/
 * @since    1.0.0
 */

if (isset($_POST[name])) {

    $site = $_SERVER['HTTP_HOST'];
    $dt = date("d F Y, H:i:s"); // дата и время
    $hidden = trim(urldecode(htmlspecialchars($_POST[hidden])));
    $name = trim(urldecode(htmlspecialchars($_POST[name])));
    $phone = trim(urldecode(htmlspecialchars($_POST[phone])));
    $area_mc = trim(urldecode(htmlspecialchars($_POST[area])));
    $summa = trim(urldecode(htmlspecialchars($_POST[summa])));
    $inh1 = trim(urldecode(htmlspecialchars($_POST[inh1])));
    $inh2 = trim(urldecode(htmlspecialchars($_POST[inh2])));
    $inh3 = trim(urldecode(htmlspecialchars($_POST[inh3])));
    $inh4 = trim(urldecode(htmlspecialchars($_POST[inh4])));
    $inh5 = trim(urldecode(htmlspecialchars($_POST[inh5])));
    $inh6 = trim(urldecode(htmlspecialchars($_POST[inh6])));
    $inh7 = trim(urldecode(htmlspecialchars($_POST[inh7])));

    $subject = "Заказ с сайта";

    $body = "<html><body style='font-family:Arial,sans-serif;'>";
    $body .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>
  Поздравляем, новый заказ с сайта с расчетом стоимости работ :" . $site . "</h2>\n";
    $body .= " <p><strong> Дата и  Время заполнения формы:</strong> " . $dt . "</p>\n ";
    $body .= " <p><strong> Наименование формы :</strong> " . $hidden . "</p>\n";
    $body .= " <p><strong> Имя :</strong> " . $name . "</p>\n";
    $body .= " <p><strong> Телефон :</strong> +" . $phone . "</p>\n";
    $body .= " <p><strong> Площадь :</strong> " . $area_mc . " <span>м²</span> </p>\n ";
    $body .= " <p><strong> Стоимость :</strong> " . $summa . "</p>\n";
    $body .= " <p><strong> Материал кровли :</strong> " . $inh1 . "</p>\n";
    $body .= " <p><strong> Форма крыши :</strong> " . $inh2 . "</p>\n";
    $body .= " <p><strong> Дополнительные работы :</strong> </p>\n";
    $body .= " <p>" . $inh3 . "</p>\n";
    $body .= " <p>" . $inh4 . "</p>\n";
    $body .= " <p>" . $inh5 . "</p>\n";
    $body .= " <p>" . $inh6 . "</p>\n";
    $body .= " <p>" . $inh7 . "</p>\n";

    $body .= "</body></html>";
    $to = 'me-invest@bk.ru';//здесь укажите адрес почты, куда отправляются сообщения

    $headers = "From : SiteRobot <noreply@" . $_SERVER['HTTP_HOST'] . ">\n";
    $headers .= 'MIME-Version: 1.0' . "\n";
    $headers .= 'Content-Type: text/html;charset=utf-8' . "\n";

// отправка сообщения
    $sendmail = mail($to, $subject, $body, $headers);
    if ($sendmail) {
        echo true;
        return;
    } else {
        echo ('Ошибка в отправке почты! Попробуйте еще раз позже!');
        return;
    }
}
echo (" Поля не заполнены ");
?>