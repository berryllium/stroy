
<?php
 /* Здесь проверяется существование переменных */
 if (isset($_POST['phone'])) {$phone = $_POST['phone'];}
 if (isset($_POST['name'])) {$name = $_POST['name'];}
 if (isset($_POST['param'])) {$param = $_POST['param'];}


 
/* Сюда впишите свою эл. почту */
//  $address = "me-invest@bk.ru";
$address = "gorkundp@yandex.ru";
 
/* А здесь прописывается текст сообщения, \n - перенос строки */

 $mes = "Тема: Заявка с Кровли!
\nИмя: $name
 \nТелефон: $phone";

//  if ($param) {
//   $mes = $mes."\n Параметры: $param";
// }

/* А эта функция как раз занимается отправкой письма на указанный вами email */
$sub="Заявка от $phone"; //сабж
$email='Заказ <Крволя>'; // от кого
 $send = mail ($address,$sub,$mes,"Content-type:text/plain; charset = utf-8\r\nFrom:$email");
 
ini_set('short_open_tag', 'On');

?>
<!DOCTYPE html>
<html>
<head>
    
       <!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-140055892-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('set', {'user_id': 'USER_ID'});
  gtag('config', 'UA-140055892-1');
</script>
    
<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(53280079, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/53280079" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Спасибо за заявку!</title>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
 </head>
<style type="text/css">
a,
a:focus,
a:hover {
  color: #eee;
}
h1, p {

	color: #000000;
}
html,
body {
  height: 100%;
  background-color: #fff;
  font-size: 14px;
}
body {
  display: -ms-flexbox;
  display: flex;
  color: #fff;
}
.cover-container {
  max-width: 42em;
}

.btn-outline-success{
margin-right: 20px;
}
@media (min-width: 48em) {
  .masthead-brand {
    float: left;
  }
  .nav-masthead {
    float: right;
  }
}
.cover {
  padding: 0 1.5rem;
}

.btn-outline-success{
margin-right: 0px;
}
.cover .btn-lg {
  padding: .75rem 1.25rem;
}
.mastfoot {
  color: rgba(255, 255, 255, .5);
}	
</style>
<script type="text/javascript">
/*Изменить текущий адрес страницы через 3 секунды (3000 миллисекунд)*/
</script> 
</head>
<body class="text-center" cz-shortcut-listen="true">

<div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
  <header class="masthead mb-auto">
    <div class="inner">
    </div>
  </header>

  <main role="main" class="inner cover">
    <h1 class="cover-heading">Спасибо за заявку!</h1>
    <p class="lead">Наши специалисты сряжуться с Вами в течение 7 минут.</p>
    <p class="lead">
      <a href="index.html" class="btn m-2 btn-lg btn-success">Вернуться назад</a>
    </p>
  </main>

  <footer class="mastfoot mt-auto">
    <div class="inner">
    </div>
  </footer>
</div>

</body>
</html>
