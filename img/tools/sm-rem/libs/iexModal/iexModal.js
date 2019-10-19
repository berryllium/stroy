/**
 * iexModal
 * @constructor
 */
function IexModal($){
    var app = this;

    app.$window = $(window);
    app.$document = $(document);
    app.$html = $('html');
    app.$body = $('body');

    app.classWrap = 'iexmodal';
    app.classPopup = app.classWrap+'-popup';
    app.classClose = app.classWrap+'-close';
    app.classCloseAll = app.classWrap+'-close-all';
    app.classInner = app.classWrap+'-inner';
    app.classInnerWrap = app.classWrap+'-inner-wrap';
    app.classBtn = app.classWrap+'-show';
    app.classSprite = app.classWrap+'-sprite';
    app.classContent = app.classWrap+'-content';
    app.classContentWrap = app.classWrap+'-content-wrap';
    app.classDebugWrap = app.classWrap+'-debug-wrap';
    app.classDebugCode = app.classWrap+'-debug-code';

    app.classLoading = app.classWrap+'-loading';
    app.classBottom = app.classWrap+'-bottom';
    app.classOverflowY = app.classWrap+'-overflow-y';
    app.classOverflowX = app.classWrap+'-overflow-x';

    app.popupWidthDefault = '450px';
    app.popupIndentX = 10;
    app.popupIndentY = 10;

    app.windowWidth = 0;
    app.windowHeight = 0;

    app.fadeInTime = 500;
    app.fadeOutTime = 300;
    app.ajaxTimeOut = 25000;

    app.errLogMsg = 'iexModal: Ошибка показа окна!';
    app.errAjaxMsg = 'iexModal: Ошибка загрузки контента!';
    app.repAjaxMsg = 'iexModal: Отчет об ajax-запросе';

    /**
     * Поддерживаемые варианты получения html-контента для показа в модальном окне
     * @type {string[]}
     */
    app.loadTypes = [ 
        'url',
        'html',
        'id',
        'selector', 
        'jquery'
    ];

    /**
     * Атрибуты, которые разрешено считывать с кнопки/ссылки показа окна и враппера контента
     * и соответсвующие им параметры для app.show()
     */
    app.attrsAndParams = {
        'href':                         'url',
        'data-iexmodal-html':           'html',
        'data-iexmodal-selector':       'selector',
        'data-iexmodal-id':             'id',
        'data-iexmodal-mode':           'mode',
        'data-iexmodal-classes':        'classes',
        'data-iexmodal-width':          'width',
        'data-iexmodal-overlay':        'overlay',
        'data-iexmodal-scroll':         'scroll',
        'data-iexmodal-timeout':        'timeout',
        'data-iexmodal-ajax-report':    'ajaxReport'
    };

    /**
     * Атрибуты из app.attrsAndParams, которые разрешено использовать модулю iexForm на кнопках/ссылках показа всплывающих форм
     */
    app.iexFormAttrs = [
        'data-iexmodal-mode',
        'data-iexmodal-classes',
        'data-iexmodal-width',
        'data-iexmodal-overlay',
        'data-iexmodal-scroll',
        'data-iexmodal-timeout',
        'data-iexmodal-ajax-report'
    ];

    /**
     * Названия разрешенных пользовательских коллбэков
     * @type {Array}
     */
    app.userCallbackNames = [
        'onBeforeShow',
        'onAfterContentLoad',
        'onAfterShow',
        'onBeforeClose',
        'onAfterClose'
    ];

    /**
     * Массив разрешенных параметров для app.show().
     * Перечень параметров берется из:
     * 1) из самого массива
     * 2) app.attrsAndParams (эти параметры можно передавать как через API так и через data-атрибуты)
     * 3) app.userCallbackNames (эти параметры можно передавать только через API)
     * Заполняется в app.__init().
     */
    app.params = [
        'jquery'
    ];

    /**
     * Colorbox
     */
    app.$colorboxOverlay = null;
    app.$colorboxWindow = null;
    app.colorboxFound = false;

    /**
     * Возможные режимы показа модального окна.
     * @property {object}
     */
    app.modes = {
        'default':'default',
        'fullscreen':'fullscreen',
        'top':'top',
        'right':'right',
        'bottom':'bottom',
        'left':'left',
        'alert':'alert'
    };

    /**
     * Объект-коллекция модальных окон
     * @type {object}
     */
    app.modals = {};

    /**
     * Массив-стек для хранения порядока наложения окон
     * @type {Array}
     */
    app.modalsStack = [];

    /**
     * Id окна на вершине стека app.modalsStack
     * @type {boolean}
     */
    app.modalsTopId = false;

    /**
     * В мобильном IE console отсутствует и вызов его методов вызовет ошибки
     * Попутно используем app.debugPanel.log()
     */
    app.log = function(){
        if ( window.console && window.console.log ) {
            console.log.apply(console, arguments);
        }
        app.debugPanel.log.apply(app.debugPanel, arguments);
    };

    /**
     * Панель (окно) отладки для мобильных платформ (вместо console.log).
     *
     * Можно использовать после вызова:
     *      app.debugPanel.on()
     * Пример использования:
     *      app.debugPanel.log($x, $y, $z)
     * Стили можно править через CSS или:
     *      app.debugPanel.$wrap.css('стили')
     */
    app.DebugPanel = function(){
        var panel = this;

        panel.active = false;
        panel.time = false;
        panel.$wrap = $();
        panel.msg = '-----------------------\niexModal: Панель отладки\n-----------------------';
        panel.html = '<div class="iexmodal-debug-panel">'+panel.msg+'</div>';

        panel._add = function () {
            panel.$wrap = $(panel.html).appendTo(app.$body);
        };
        panel._remove = function () {
            panel.$wrap.remove();
            panel.$wrap = $();
        };

        panel._ts = function(){
            var time = new Date();

            function format2(val){
                return ("0"+val).slice(-2);
            }
            function format3(val){
                return (val+"00").slice(0,3);
            }

            return (
                format2(time.getHours()) + ':' +
                format2(time.getMinutes()) + ':' +
                format2(time.getSeconds()) + ':' +
                format3(time.getMilliseconds())
            )
        };

        panel.clear = function(){
            panel.$wrap.html(panel.msg)
        };

        panel.on = function(params){
            params = params || {};
            panel.time = (typeof params.time === 'boolean') ? params.time : false;

            if ( panel.$wrap.length ) {
                panel._remove();
            }
            panel._add();
            panel.active = true;
        };
        panel.off = function(){
            panel._remove();
            panel.active = false;
        };

        panel.log = function(){
            if ( !panel.active ) return;

            var time = panel.time ? panel._ts() + ' ' : '';

            var args = [].slice.call(arguments);
            var text = '';
            $(args).each(function (i,val) {
                text += typeof val === 'object' ? JSON.stringify(val) : val;
                text += ' ';
            });

            panel.$wrap.text(panel.$wrap.text() + '\n' + time + text);
            panel.$wrap[0].scrollTop = panel.$wrap[0].scrollHeight;
        };
    };
    app.debugPanel = new app.DebugPanel();

    /**
     * Возвращает объект модального окна
     * - окна с заданным id (если id задан)
     * - текущего (самого верхнего), если id не задан
     *
     * @param id {string} Необязательный параметр
     * @return {*}
     */
    app.getModal = function (id) {
        if ( typeof id === 'undefined') {
            if ( !(app.modalsTopId && app.modals[app.modalsTopId]) ) return false;
            return app.modals[app.modalsTopId];
        } else {
            if ( !(id && app.modals[id]) ) return false;
            return app.modals[id]
        }
    };

    /**
     * Имеется ли окно с заданным id в списке открытых
     *
     * @param id
     * @return {*}
     */
    app.isOpened = function (id){
        return id && app.modals[id];
    };

    /**
     * Возвращает UID из 5 цифр
     * @return {number}
     */
    app.getUid = function(){
        return Math.floor(10000 + Math.random()*89999);
    };

    app.inArray = function (val, arr) {
        if ( typeof arr !== 'object') return false;
        return arr.indexOf(val) > -1;
    };

    /**
     * Достает первое по порядку значение в объекте
     * @param obj
     * @returns {*}
     */
    app.firstInObj = function (obj) {
        if (typeof obj !== 'object') return false;
        return obj[Object.keys(obj)[0]];
    };

    /**
     * Возвращает последний элемент в массиве или false
     * @param arr {object}
     * @returns {*}
     */
    app.lastInArr = function (arr) {
        if (typeof arr !== 'object') return false;
        return arr.length ? arr[ arr.length-1 ] : false;
    };

    /**
     * Получает допустимый режим показа окна из кнопки/ссылки
     * @returns {string}
     */
    app.getMode = function (mode) {
        if (!mode) return app.firstInObj(app.modes);
        return app.modes[mode] ? mode : app.firstInObj(app.modes);
    };

    /**
     * Получает CSS-класс-модификатор для режима показа
     * @returns {string}
     */
    app.getModeClass = function (mode) {
        return mode==='default' ? '' : app.classWrap+'-'+mode;
    };

    /**
     * Вычисление ширины скробара (у каждого браузера она своя)
     * Позаимствовано из bootstrap.modal.js
     */
    app.getScrollbarWidth = function () {
        var divStyles =
            'position: absolute; '+
            'top: -9999px; '+
            'width: 50px; '+
            'height: 50px; '+
            'overflow: scroll;';
        var scrollDiv = document.createElement('div');
        scrollDiv.setAttribute('style', divStyles);
        app.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        app.$body[0].removeChild(scrollDiv);
        return scrollbarWidth
    };

    /**
     * Интеграция с Colorbox.
     * Нужна когда из iexModal-окна открываются Сolorbox-окна.
     * Устанавливаем Сolorbox-окну z-index больший чем у iexModal-окна.
     */
    app.onColorboxOpen = function(){
        if (app.modalsTopId) {
            var zIndex = app.getWrapZindex();
            app.$colorboxOverlay.css('z-index', zIndex+1);
            app.$colorboxWindow.css('z-index', zIndex+2);
        }
    };
    app.onColorboxClosed = function(){
        if (app.modalsTopId) {
            app.$colorboxOverlay.css('z-index', '');
            app.$colorboxWindow.css('z-index', '');
        }
    };
    app.colorboxInit = function(){
        app.$colorboxOverlay = $('#cboxOverlay');
        app.$colorboxWindow = $('#colorbox');
        app.colorboxFound = app.$colorboxOverlay.length && app.$colorboxWindow.length;
        if (app.colorboxFound) {
            app.$document
                .on('cbox_open', app.onColorboxOpen)
                .on('cbox_closed', app.onColorboxClosed);
        }
    };

    /**
     * Текущий размер окна браузера в виде объекта {width: 450px, height: 600px}.
     * @return {object}
     */
    app.getWindowSize = function () {
        app.windowWidth = app.$window.width();
        app.windowHeight = app.$window.height();
        // Алтернатива для вышерасположенный кода, если он срабатывает некорректно (замечено на некторых сайтах)
        // app.windowWidth = document.body.clientWidth;
        // app.windowHeight = document.body.clientHeight;
        return {width: app.windowWidth, height: app.windowHeight}
    };

    /**
     * Получить максимальный z-index на странице
     * @return {int}
     */
    app.getMaxZIndex = function (){
        var maxZ = -1;
        $('body *').not('.iexmodal-debug-panel').each(function(i,el){
            var pos = $(el).css('position');
            if(pos === 'absolute' || pos === 'fixed'){
                var z = parseInt($(el).css('z-index')) || 1;
                maxZ = Math.max(z, maxZ);
            }
        });
        return maxZ;
    };

    app.getWrapZindex = function () {
        var zMax = app.getMaxZIndex();
        /*
        var zCur = parseInt( app.$wrap.css('z-index') );
        return (zMax===zCur ? zMax : zMax+1);
        */
        return zMax+1;
    };

    /**
     * Корректировка размера и положения окна по горизонтали
     * @param modal {object} Объект модального окна из app.modals
     * @return {string} Ширина с единицами измерения (px,%, и т.д.)
     */
    app.correctPositionX = function (modal) {
        var popupWidth = modal.width || app.popupWidthDefault;
        var breakpointWidth = parseInt(popupWidth) + app.popupIndentX * 2;
        var width = app.windowWidth > breakpointWidth ? popupWidth : '';

        modal.$popup.css('width', width);

        if ( width ) {
            modal.$wrap.removeClass(app.classOverflowX);
            modal.$popup.css('margin-left', '-'+parseInt(modal.$popup.outerWidth()/2)+'px');

        } else {
            modal.$wrap.addClass(app.classOverflowX);
            modal.$popup.css('margin-left', '');
        }
    };

    /**
     * Корректировка размера и положения окна по вертикали
     * @param modal {object} Объект модального окна из app.modals
     * @return {string} Ширина с единицами измерения (px,%, и т.д.)
     */
    app.correctPositionY = function (modal) {
        var overflowY = (modal.$innerWrap.outerHeight() + parseInt(modal.$inner.css('padding-top'))*2 + app.popupIndentY*2) >= app.windowHeight;

        if ( overflowY ) {
            modal.$wrap.addClass(app.classOverflowY);
            modal.$popup.css('margin-top', '');
        } else {
            modal.$wrap.removeClass(app.classOverflowY);
            modal.$popup.css('margin-top', '-'+parseInt(modal.$popup.outerHeight()/2)+'px');
        }
    };

    /**
     * Корректировка размерров и положения открытых окон.
     * Автоматически выполняется при каждом изменении размера окна браузера (onresize) и повороте мобильного устройства (onorientationchange).
     * Нужно вызывать после изменения количества контента в окне/окнах, чтобы расположение на экране стало оптимальным.
     * @return {object} app
     */
    app.correctPosition = function(){
        if ( !app.modalsTopId ) return app;

        $.each(app.modals, function (wrapId, modal) {
            if ( modal.mode !== 'default' ) return true;
            app.correctPositionX(modal);
            app.correctPositionY(modal);
            if ( modal.ps ) {
                modal.ps.update();
            }
        });

        return app;
    };

    /**
     * Рендерит html-код для модального окна, добавляет его начало документа и возвращает jQuery-ссылку
     *
     * @param id {string} Уникальный id модального окна из app.modals
     * @return {jQuery} jQuery-ссылка на вставленный html
     */
    app.insertWrap = function(id) {
        var html =
            '<div class="' + app.classWrap + '" data-iexmodal-id="' + id + '">\n'+
            '    <div class="' + app.classClose + ' iexmodal-close-light">\n'+
            '        <svg class="iexmodal-icon"><use xlink:href="#close"></use></svg>\n'+
            '    </div>\n'+
            '    <div class="' + app.classPopup + '">\n'+
            '        <div class="' + app.classInner + '"><div class="'+app.classInnerWrap + '"></div></div>\n'+
            '        <div class="' + app.classClose + ' iexmodal-close-dark">\n'+
            '            <svg class="iexmodal-icon"><use xlink:href="#close"></use></svg>\n'+
            '        </div>\n'+
            '    </div>\n'+
            '    <div class="iexmodal-spinner"></div>\n'+
            '</div>';
        return $(html).prependTo('body');
    };

    /**
     * Вставляет SVG-спрайт в начало документа и возвращает jQuery-ссылку
     *
     * @return {jQuery}
     */
    app.insertSprite = function() {
        var html =
            '<svg class="' + app.classSprite + '" aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n'+
            '    <defs>\n'+
            '        <symbol id="close" viewBox="0 0 18 18">\n'+
            '            <title>close</title>\n'+
            '            <line x1="2" y1="2" x2="16" y2="16"/>\n'+
            '            <line x1="2" y1="16" x2="16" y2="2"/>\n'+
            '        </symbol>\n'+
            '    </defs>\n'+
            '</svg>';
        return $(html).prependTo('body');
    };

    /**
     * jQuery-ссылка на вставленный в документ SVG-спрайт.
     *
     * @type {*}
     */
    app.$sprite = false;

    /**
     * Используется при app.loadType равным 'selector' или 'jquery'
     *
     * @return {jQuery}
     */
    app.insertPlaceholder = function($sibling) {
        var html = '<div class="iexmodal-content-placeholder"></div>';
        return $(html).insertAfter($sibling);
    };

    /**
     * Получение data-атрибутов кнопки/ссылки
     * в виде объекта c параметрами для app.show()
     *
     * @param $btn - jQuery-ссылка на кнопку/ссылку
     * @return {*}
     */
    app.parseBtnAttrs = function ($btn) {
        if (!($btn instanceof jQuery && $btn.length)) return false;
        var obParsed = {};
        $.each(app.attrsAndParams, function (btnAttr, showParam) {
            obParsed[showParam] = $btn.attr(btnAttr) || ''; // $.data() может отдавать закэшированные (старые) значения при уже изменившемся DOM
        });
        return obParsed;
    };

    /**
     * Подсчет количества переданных способов загрузки html-контента.
     * Используется в app.validateParams() для проверки, что передан ровно один способ.
     *
     * @param params Параметры для app.show()
     * @return {number}
     */
    app.loadTypesCnt = function (params) {
        var cnt = 0;
        $.each(app.loadTypes, function (key,val) {
            cnt += params[val] ? 1 : 0;
        });
        return cnt;
    };

    /**
     * Получение способа загрузки html-контента из параметров app.show()
     *
     * @param params Параметры для app.show()
     * @return {boolean}
     */
    app.getLoadType = function (params) {
        var loadType = false;
        $.each(app.loadTypes, function (key,val) {
            if ( !!params[val] ) {
                loadType = val;
                return false
            }
        });
        return loadType;
    };

    app.getContentWrap = function(id){
        return app.$body.find('.'+app.classContent+'[data-iexmodal-id="' + id + '"]').first();
    };

    /**
     * Отчет об аякс-запросе, выполненного методом $.ajax()
     *
     * @param url {string} Урл загружаемого контента
     * @param jqXHR {jqXHR} jqXHR-объект, который вернул метод $.ajax()
     * @return {string} Html-код с отчетом
     */
    app.ajaxReport = function(url, jqXHR){
        if ( !url || !jqXHR ) return '';

        var responseText = jqXHR.responseJSON ? JSON.stringify(jqXHR.responseJSON) : jqXHR.responseText;
        responseText = $('<div></div>').text(responseText).html();

        return (
            '<div class="' + app.classDebugWrap + '">' +
            'URL: <a href="' + url + '" target="_blank">' + url + '</a><br>' +
            'Timeout: ' + app.ajaxTimeOut/1000 + ' sec<br>' +
            '<br>' +
            'jqXHR.readyState: ' + jqXHR.readyState + '<br>' +
            'jqXHR.status: ' + jqXHR.status + '<br>' +
            'jqXHR.statusText: ' + jqXHR.statusText +
            '<br><br>' +
            'jqXHR.responseText / jqXHR.responseJSON:' +
            '<div class="' + app.classDebugCode + '">' + responseText + '</div>' +
            '</div>'
        );
    };

    /**
     * Валидация параметров для app.show().
     * @param rawParams {object} Объект с 'сырыми' параметрами для проверки-исправления
     * @return {object} Объект с проверенными-исправленными параметрами
     */
    app.validateParams = function(rawParams){
        if (!rawParams) {
            app.log(app.errLogMsg+' Не задан объект с параметрами. Смотрите документацию по iexModal.show().');
            return false;
        }
        var validParams = {};

        $.each(app.params, function(key, param) {
            if ( app.inArray(param, app.userCallbackNames) ) {
                validParams[param] = (typeof rawParams[param] === 'function') ? (rawParams[param]) : (function () {});
            } else if ( app.inArray(param, ['jquery','selector']) || (typeof rawParams[param] === 'boolean' ) ) {
                validParams[param] = rawParams[param];
            } else {
                validParams[param] = $.trim(rawParams[param] || '');
            }

            if (
                param==='url' &&
                validParams[param] &&
                (
                    validParams[param].indexOf('#')===0 ||
                    validParams[param].indexOf('javascript:')>-1
                )
            ) {
                validParams[param] = '';
            }

            if ( param==='mode' ) {
                validParams[param] = app.getMode(validParams[param]);
            }

            if (
                (param==='overlay' || param==='ajaxReport') &&
                (typeof validParams[param] !== 'boolean')
            ) {
                validParams[param] = validParams[param]==='true';
            }

            if ( param==='scroll' && (typeof validParams[param] !== 'boolean') ) {
                validParams[param] = validParams[param]!=='false';
            }

            if ( param==='timeout' ) {
                validParams[param] = parseInt(validParams[param]) || 0;
            }
        });

        if ( validParams['mode'] && validParams['mode'] !== 'default') {
            validParams['classes'] = validParams['classes'] ? ' '+validParams['classes'] : '';
            validParams['classes'] = app.getModeClass(validParams['mode']) + validParams['classes'];
            validParams['width'] = '';
        }

        $.each(app.userCallbackNames, function (key, name) {
            if ( !validParams[name] ) {
                validParams[name] = function () {};
            }
        });

        var
            errMsg = '',
            loadType = app.getLoadType(validParams),
            loadTypesCnt = app.loadTypesCnt(validParams);

        if (
            !loadTypesCnt
        ) {
            errMsg = 'Не задан способ загрузки html-контента: ' + app.loadTypes.join(', ');

        } else if (
            app.loadTypesCnt(validParams) > 1
        ) {
            errMsg = 'Из списка параметров ' + app.loadTypes.join(', ') + ' одновременно можно передавать только ОДИН!';

        } else if (
            loadType==='selector' &&
            !$(validParams['selector']).length
        ) {
            errMsg = 'Элемент с селектором "' + validParams['selector'] + '" не найден на странице!';

        } else if (
            loadType==='jquery' &&
            !(validParams['jquery'] instanceof jQuery)
        ) {
            errMsg = 'Элемент, переданный в параметр jquery, не является экземпляром jQuery!';

        } else if (
            loadType==='jquery' &&
            !validParams['jquery'].length
        ) {
            errMsg = 'Элемент, переданный в параметр jquery, не найден на странице!';

        } else if (
            loadType==='id' &&
            !app.getContentWrap(validParams['id']).length
        ) {
            errMsg = 'Не найден враппер контента с data-iexmodal-id="' + validParams['id'] + '".';
        }

        if ( errMsg ) {
            app.log(app.errLogMsg +' ' + errMsg + ' Переданные параметры:', validParams);
            return false
        }

        return validParams;
    };

    /**
     * Добавляет модальное окно в HTML-кода и коллекцию app.modals
     *
     * @param params - параметры для app.show()
     * @return {object} - объект созданного модального окна
     */
    app.create = function (params) {
        var loadType = app.getLoadType(params);
        var wrapId = loadType + '-' + ( loadType==='id' ? params.id : app.getUid() );
        var $wrap = app.insertWrap(wrapId);

        var modal = app.modals[wrapId] = {
            wrapId: wrapId,
            loadType: loadType,
            timeoutId: false,
            contentArray: [],
            $wrap: $wrap,
            $popup: $wrap.find('.'+app.classPopup),
            $inner: $wrap.find('.'+app.classInner),
            $innerWrap: $wrap.find('.'+app.classInnerWrap),
            $currWrapper: null,
            $currContent: null,
            $contentPlaceholder: null,
            wrapInClass: app.animation.wrapClass('in'),
            wrapOutClass: app.animation.wrapClass('out'),
            popupInClass: app.animation.popupClass('in', params.mode),
            popupOutClass: app.animation.popupClass('out', params.mode),
            ps: null,
            psDragging: false
        };
        modal = $.extend(modal, params);

        modal.$wrap.on('click', '.'+app.classClose, function (e) {
            app.close();
            e.preventDefault();
        });

        modal.$popup.on('webkitAnimationEnd animationend', function (e) {
            if ( e.originalEvent.animationName === modal.popupInClass ) {
                app.animation.onInEnd(modal);
            }
            if ( e.originalEvent.animationName === modal.popupOutClass ) {
                app.animation.onOutEnd(modal);
            }
        });

        // Заботимся чтобы во время перетаскивании скроллбара мышью случайно не кликался .iexmodal и окно не закрывалось
        function resetWrapSetts() {
            modal.psDragging = false;
            modal.$wrap.css('cursor','');
        }

        if ( modal.scroll ) {
            modal.ps = new PerfectScrollbar( modal.$inner[0], {
                    wheelSpeed: 1, // сделать зависимой длинны (высоты контента) = parseInt(modal.$inner.outerHeight() / modal.$popup.outerHeight() * 2)
                    wheelPropagation: false,
                    minScrollbarLength: 60
                }
            );
            modal.$wrap.find('.ps__thumb-y')
                .on('mousedown', function (e) {
                    // e.which = 1 (левая), 2 (средня), 3 (правая)
                    modal.psDragging = true;
                    modal.$wrap.css('cursor','default');
                })
                .on('mouseup', function (e) {
                    resetWrapSetts();
                });
            modal.$wrap.find('.ps').on('mouseup', function (e) {
                if ( modal.psDragging ) {
                    resetWrapSetts();
                }
            });
        }

        modal.$wrap.on('click', function (e) {
            if ( e.target === this ) {
                if ( modal.ps && modal.psDragging ) {
                    resetWrapSetts();
                } else {
                    app.close();
                }
            }
        });

        app.modalsStack.push(wrapId);
        app.modalsTopId = wrapId;

        return modal;
    };

    /**
     * Перенос контента модального окна для типов загрузки 'selector' и 'jquery'
     * - moveToPopup() в модальное окно
     * - moveBack() обратно во враппер контента
     */
    app.contentArray = {

        moveToPopup: function (modal) {

            function arrayContentPush($el) {
                modal.contentArray.push({
                    '$currContent': $el,
                    '$contentPlaceholder': app.insertPlaceholder($el),
                });
                $el.appendTo( modal.$innerWrap );
            }

            if ( modal.loadType==='jquery' ) {
                modal.jquery.each(function (i, el) {
                   arrayContentPush($(el))
                });
            }

            // Cелекторы с запятыми разбиваем на отдельные jQuery-объекты, чтобы сохранить порядок выборки блоков
            // с контентом именно таким, как указано в селекторе, в противном случае порядок будет таким как в DOM-дереве.
            if ( modal.loadType==='selector' ) {
                var arSelectors = modal.selector.split(',');

                $.each(arSelectors, function (index,selector) {
                    selector = selector.trim();
                    if (selector) {
                        $(selector).each(function (i, el) {
                            arrayContentPush($(el))
                        });
                    }
                });
            }
        },

        moveBack: function (modal) {

            $.each( modal.contentArray, function (key, item) {
                item.$currContent.insertAfter(item.$contentPlaceholder);
                item.$contentPlaceholder.remove();
            });

        }

    };

    /**
     * Удаляет модальное окно из HTML-кода и коллекции app.modals
     *
     * @param {object} modal - удаляемое модальное окно (объект из коллекции app.modals)
     * @return {object} - объект модального окна следующего в коллекции, а в HTML-коде расположенного ниже (по z-index)
     */
    app.remove = function (modal) {
        if (modal.loadType==='selector' || modal.loadType==='jquery') {
            app.contentArray.moveBack(modal);
        }
        if (modal.loadType==='id') {
            modal.$currContent.appendTo( modal.$currWrapper );
        }
        if ( modal.ps ) {
            modal.ps.destroy();
            modal.ps = null; // to make sure garbages are collected
        }

        modal.$wrap.remove();

        delete app.modals[app.modalsTopId];
        app.modalsStack.pop();
        app.modalsTopId = app.lastInArr( app.modalsStack );

        return app.modalsTopId ? app.modals[app.modalsTopId] : false;
    };

    /**
     * Функционал для анимации
     *
     * @constructor
     */
    app.Animation = function(){
        var anim = this;

        anim.timeIn = 400;
        anim.timeOut = 300;

        anim.commonClass = app.classWrap+'-animate';

        anim.wrapClass = function(dir){
            return app.classWrap+'-animate-wrap-'+dir;
        };

        anim.popupClass = function(dir, mode){
            return app.classWrap+'-animate-'+mode+'-'+dir;
        };

        anim.wrapIn = function(modal) {
            modal.$wrap
                .css({
                    'display': 'block',
                    'z-index': app.getWrapZindex(),
                    'animation-duration': anim.timeIn+'ms'
                })
                .addClass( modal.classes + ' ' + app.classLoading + ' ' + anim.commonClass + ' ' + modal.wrapInClass )
        };

        anim.popupIn = function(modal) {
            modal.$popup
                .css('animation-timing-function', 'ease-out')
                .css('animation-duration', anim.timeIn+'ms')
                .addClass( anim.commonClass + ' ' + modal.popupInClass );
            modal.$wrap.removeClass( app.classLoading );
        };

        anim.allOut = function(modal) {
            modal.$wrap
                .css('opacity', 1)
                .removeClass(modal.wrapInClass)
                .css('animation-duration', anim.timeOut+'ms')
                .addClass(modal.wrapOutClass);
            modal.$popup
                //.css('opacity', 1)
                .removeClass(modal.popupInClass)
                .css('animation-timing-function', 'ease-in')
                .css('animation-duration', anim.timeOut+'ms')
                .addClass( modal.popupOutClass );
        };

        anim.onInEnd = function(modal){
            app.callbacks.onAfterShow(modal);
        };

        anim.onOutEnd = function(modal){
            app.callbacks.onAfterClose(modal);
        };
    };
    app.animation = new app.Animation();

    /**
     * Показ модального окна
     * @param {object} params
     * - selector {string} - jQuery-селектор на враппер с html-контентом
     * - jquery {jquery} - jQuery-ссылка на враппер с html-контентом
     * - html {string} - html-строка с контентом
     * - url {string} - урл загружаемого контента
     * - id {string}- Значение атрибута data-iexmodal-id враппера с контентом, который нужно показать
     * - mode {string} - Режим показа модального окна из app.modes (по-умолчанию 'default')
     * - classes {string}- Список CSS-классов (через пробел), которые нужно добавить к модальному окну
     * - width {string}- Ширина модального окна с единицами измерения (px, %, em и т.д.). По-умолчанию ширина равна 450px. Игнорируется при modal.mode !== 'default'.
     * - overlay {boolean} - true - новое окно нужно открыть поверх текущего, не закрывая его, false - сначала закрыть текущее окно (по-умолчанию)
     * - scroll {string} - Прокручивать контент, если он не умещается в окне: true | false (по-умолчанию true)
     * - timeout {integer} - Время в секундах, после которого окно само должно закрыться (по-умолчанию 0 сек)
     * - ajaxReport {boolean} - Включить отчет об ajax-запросе
     * - onBeforeShow {function}
     * - onAfterContentLoad {function}
     * - onAfterShow {function}
     * - onBeforeClose {function}
     * - onAfterClose {function}
     * Из списка параметров app.loadTypes одновременно можно передать только ОДИН!
     */
    app.show = function (params) {
        params = app.validateParams(params);
        if ( !params ) return app;

        if ( !params.overlay && app.modalsTopId ) {
            app.callbacks._onAfterClose = function () {
                app.show(params);
                app.callbacks._onAfterClose = function () {};
            };
            app.close();
            return;
        }

        var modal = app.create(params);

        app.callbacks.onBeforeShow(modal);
        app.animation.wrapIn(modal);

        if (modal.loadType==='selector' || modal.loadType==='jquery') {
            app.contentArray.moveToPopup(modal);
            app.callbacks.onAfterContentLoad(modal);
        }

        if (modal.loadType==='html') {
            modal.$innerWrap.html(modal.html);
            app.callbacks.onAfterContentLoad(modal);
        }

        if (modal.loadType==='url') {
            var modalId = modal.wrapId;
            $.ajax({
                url: modal.url,
                timeout: 25000, // ms, по-умолчанию таймаут отсутствует, зависит от браузера и может быть очень большим
                dataType: 'html',
                success: function (data, textStatus, jqXHR) {
                    if ( !app.isOpened(modalId) ) return; // если окно закрыли раньше срабатывания данного колбэка

                    var report = '';
                    if (modal.ajaxReport) {
                        report =
                            '<b>' + app.repAjaxMsg + '</b>' +
                            '<br><br>' +
                            app.ajaxReport(modal.url, jqXHR) +
                            '<br><br>';
                    }

                    modal.$innerWrap.html(report + data);
                    app.callbacks.onAfterContentLoad(modal);
                },
                error: function(jqXHR) {
                    if ( !app.isOpened(modalId) ) return; // если окно закрыли раньше срабатывания данного колбэка

                    var report =
                        '<b>' + app.errAjaxMsg + '</b>' +
                        '<br><br>' +
                        app.ajaxReport(modal.url, jqXHR);

                    modal.$innerWrap.html(report);
                    app.callbacks.onAfterContentLoad(modal);
                }
            });
        }

        if (modal.loadType==='id') {
            modal.$currWrapper = app.getContentWrap(modal.id);

            var wrapClasses = $.trim( modal.$currWrapper.attr('data-iexmodal-classes') );
            if ( wrapClasses ) {
                modal.$wrap.addClass( wrapClasses );
            }

            // Переносится в модальное окно только один элемент - дополнительная обертка контента, это особенность работы $.appendTo()
            modal.$currContent = modal.$currWrapper.children('.'+app.classContentWrap);
            modal.$currContent.appendTo( modal.$innerWrap );
            app.callbacks.onAfterContentLoad(modal);
        }

        return app;
    };

    /**
     * Аналог String.repeat(), поддерживаемый в IE11
     *
     * @param str Строка
     * @param cnt Количество повторений
     * @return {string}
     */
    app.strRepeat = function(str, cnt){
        if ( !str || !cnt ) return '';
        return Array(cnt + 1).join('<i></i>')
    };

    /**
     * Генератор нескольких одновременно открытых окон
     * Удобен для тестирования адативности и отладки
     * @param count Количество генерируемых окон
     */
    app.devShowMany = function (count) {
        var width, textTotal, textChunk;
        for (var $i=1; $i<=count; $i++) {
            width = (count +1 -$i)*100+200 + 'px';
            textChunk = 'Адаптивность у данного окна включается при ширине окна браузера < ' + width + '. ';
            textTotal = '<p>' + ( app.strRepeat(textChunk, (count-$i+1)*3) ) + '</p>';
            iexModal.show({
                'html': '<h2>Окно '+ width + '</h2><a href="#" class="iexmodal-close">Закрыть текущее окно</a>' + textTotal + '<a href="#" class="iexmodal-close-all">Закрыть все окна</a>',
                'width': width,
                'overlay': 'true'
            });
        }
        return app;
    };

    /**
     * Закрыть модальное окно, переданное либо первым параметром либо самое верхнее (параметр modal не передан)
     * @param modal {object}
     * @return {object} app
     */
    app.close = function (modal) {
        if ( !modal ) {
            modal = app.getModal();
        }
        if ( !modal ) return app;

        clearTimeout(modal.timeoutId);
        app.callbacks.onBeforeClose(modal);
        app.animation.allOut(modal);

        return app;
    };

    /**
     * Закрыть все модальные окна
     * @return {object} app
     */
    app.closeAll = function () {
        $.each( app.modals, function (id, modal) {
            app.close(modal);
        });
        return app;
    };

    /**
     * Функционал для блокировки прокрутки документа при открытом модальном окне
     *
     * @constructor
     */
    app.DocumentScroll = function(){
        var docScroll = this;

        this.disabled = false;
        this.scrollCurr = [0,0]; // [left,top]
        this.isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

        this.scrollGet = function () {
            return [
                app.$window.scrollLeft(),
                app.$window.scrollTop()
            ]
        };

        this.scrollSave = function () {
            docScroll.scrollCurr = docScroll.scrollGet();
        };

        this.scrollRestore = function () {
            app.$window.scrollLeft( docScroll.scrollCurr[0] );
            app.$window.scrollTop( docScroll.scrollCurr[1] );
        };

        /**
         * Массив строк, при наличии которых в контенте модального окна считаем,
         * что в окне есть поля формы, а значит не нужно блокировать необходимые для этих полей клавиши
         *
         * @type {string[]}
         */
        this.formTags = [
            'input', 'textarea'
        ];

        /**
         * Клавиши (их коды), которые будут блокироваться при открытом модальном окне во избежание прокрутки страницы
         * ---
         * 32 spacebar
         * 33 pageup
         * 34 pagedown
         * 35 end
         * 36 home
         * 37 left
         * 38 up
         * 39 right
         * 40 down
         * ---
         *
         * @type {{default: number[], form: number[]}}
         */
        this.keyCodeSets = {
            'default': [32, 33, 34, 35, 36, 37, 38, 39, 40],
            'form': [33, 34] // для корректной работы полей форм в модальном окне
        };

        this.keyCodes = [];

        this.setKeyCodes = function () {
            var
                html = app.getModal().$innerWrap.html(),
                regex = new RegExp( docScroll.formTags.join('|') );

            docScroll.keyCodes = docScroll.keyCodeSets['default'];
            if ( regex.exec(html) ) {
                docScroll.keyCodes = docScroll.keyCodeSets['form'];
            }
        };

        this.handleTouch = function(event) {
            event.preventDefault();
        };

        this.handleWheel = function(event) {
            event.preventDefault();
        };

        this.handleKeydown = function(event) {
            if ( docScroll.keyCodes.indexOf(event.keyCode) > -1 ) {
                event.preventDefault();
            }
        };

        this.handleScrollbar = function(event) {
            docScroll.scrollRestore();
        };

        this.off = function () {
            if ( docScroll.disabled ) return;

            docScroll.scrollSave();
            docScroll.setKeyCodes();

            app.$html
                .css('touch-action', 'none')
                .on("mousewheel DOMMouseScroll", docScroll.handleWheel)
                .on("keydown", docScroll.handleKeydown);

            if ( !docScroll.isIE11 ) {
                app.$html[0].addEventListener('touchmove', docScroll.handleTouch, {passive: false});
            }
            app.$window.on("scroll", docScroll.handleScrollbar);

            docScroll.disabled = true;
        };

        this.on = function () {
            app.$html
                .css('touch-action', 'auto')
                .off("mousewheel DOMMouseScroll", docScroll.handleWheel)
                .off("keydown", docScroll.handleKeydown);

            if ( !docScroll.isIE11 ) {
                app.$html[0].removeEventListener('touchmove', docScroll.handleTouch);
            }
            app.$window.off("scroll", docScroll.handleScrollbar);

            docScroll.disabled = false;
        }
    };
    app.documentScroll = new app.DocumentScroll;

    /**
     * Системные коллбэки, запускающие одноименные пользовательские.
     * Выполняются в приведенном порядке, сверху-вниз.
     */
    app.callbacks = {

        onBeforeShow: function(modal){
            modal.onBeforeShow(modal);
        },

        onAfterContentLoad: function (modal) {
            modal.onAfterContentLoad(modal);
            if ( app.modalsStack.length===1 ) {
                if ( modal.mode !== 'alert' ) {
                    app.documentScroll.off();
                }
                app.windowRelatedActions();
                app.$window.on('resize orientationchange', app.windowRelatedActions);
            }
            app.correctPosition();
            app.animation.popupIn(modal);
        },

        onAfterShow: function(modal){
            if ( modal.timeout ) {
                modal.timeoutId = setTimeout(function () {
                    app.close(modal);
                }, modal.timeout*1000)
            }
            modal.onAfterShow(modal);
        },

        onBeforeClose: function(modal){
            modal.onBeforeClose(modal);
        },

        onAfterClose: function(modal){
            app.remove(modal);

            if ( !app.modalsStack.length ) {
                if ( modal.mode !== 'alert' ) {
                    app.documentScroll.on();
                }
                app.$window.off('resize orientationchange', app.windowRelatedActions);
            }

            modal.onAfterClose(modal);
            app.callbacks._onAfterClose(modal);
        },

        // Используется в app.show() для предварительного закрытия текущего окна
        // и показа нового только после завершения анимации у текущего
        _onAfterClose: function () {}
    };

    /**
     * Обработчик нажатия Escape.
     * Вещаем его в $(document).ready() во избежание клонирования при повторном выполнении iexModal.init()
     */
    app.handleEscape = function (e) {
        if (app.modalsTopId && e.keyCode===27) {
            app.close();
        }
    };

    /**
     * Публичный этап инициализация модуля, который можно выполнять повторно.
     * Автоматически выполняется при каждой загрузке страницы.
     */
    app.init = function () {

        app.$body.find('.'+app.classContent)
        // предварительно удаляем дополнительные обертки контента
        // для возможности повторного выполнения app.init()
            .each(function () {
                var $firstChild = $(this).children('.'+app.classContentWrap).children().first();
                if ( $firstChild.parent().is('.'+app.classContentWrap) ) {
                    $firstChild.unwrap();
                }
            })
            // создаем дополнительные вложенные обертки контента, которые и будут переноситься в модальное окно методом $.appendTo()
            .wrapInner('<div class="'+app.classContentWrap+'"></div>');

        app.colorboxInit();
        app.getWindowSize();

        return app;
    };

    /**
     * Действия, связанные с событиями resize и orientationchange
     *
     * @return {app}
     */
    app.windowRelatedActions = function(){
        app.getWindowSize();
        app.correctPosition();
        return app;
    };

    /**
     * Приватный этап инициализация модуля, который нельзя/нежелательно выполнять повторно.
     * Автоматически выполняется при каждой загрузке страницы.
     * Некоторые обработчики вешаем здесь чтобы:
     * 1) работало делегирование
     * 2) избежать клонирования обработчиков при повторной публичной инициализации iexModal.init()
     *
     * @private
     */
    app.__init = function () {
        app.$sprite = app.insertSprite();

        app.$window.on('keyup', app.handleEscape);

        app.$body
            .on('click', '.'+app.classBtn, function (e) {
                app.show( app.parseBtnAttrs( $(this) ) );
                e.preventDefault();
            })
            .on('click', '.'+app.classCloseAll, app.closeAll);

        app.scrollbarWidth = app.getScrollbarWidth();

        $.each(app.attrsAndParams, function (key,val){
            app.params.push(val);
        });
        $.each(app.userCallbackNames, function (key,val){
            app.params.push(val);
        });
    };

    app.init();
    app.__init();
}

$(document).ready(function () {
    (function () {
        if (!window.IexModal || !window.jQuery) return;
        window.iexModal = new IexModal(jQuery);
    })();
});

/**
 * END: iexModal
 */


/*!
 * perfect-scrollbar v1.3.0
 * (c) 2017 Hyunje Jun
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.PerfectScrollbar = factory());
}(this, (function () { 'use strict';

    function get(element) {
        return getComputedStyle(element);
    }

    function set(element, obj) {
        for (var key in obj) {
            var val = obj[key];
            if (typeof val === 'number') {
                val = val + "px";
            }
            element.style[key] = val;
        }
        return element;
    }

    function div(className) {
        var div = document.createElement('div');
        div.className = className;
        return div;
    }

    var elMatches =
        typeof Element !== 'undefined' &&
        (Element.prototype.matches ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.msMatchesSelector);

    function matches(element, query) {
        if (!elMatches) {
            throw new Error('No element matching method supported');
        }

        return elMatches.call(element, query);
    }

    function remove(element) {
        if (element.remove) {
            element.remove();
        } else {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }

    function queryChildren(element, selector) {
        return Array.prototype.filter.call(element.children, function (child) { return matches(child, selector); }
        );
    }

    var cls = {
        main: 'ps',
        element: {
            thumb: function (x) { return ("ps__thumb-" + x); },
            rail: function (x) { return ("ps__rail-" + x); },
            consuming: 'ps__child--consume',
        },
        state: {
            focus: 'ps--focus',
            active: function (x) { return ("ps--active-" + x); },
            scrolling: function (x) { return ("ps--scrolling-" + x); },
        },
    };

    /*
     * Helper methods
     */
    var scrollingClassTimeout = { x: null, y: null };

    function addScrollingClass(i, x) {
        var classList = i.element.classList;
        var className = cls.state.scrolling(x);

        if (classList.contains(className)) {
            clearTimeout(scrollingClassTimeout[x]);
        } else {
            classList.add(className);
        }
    }

    function removeScrollingClass(i, x) {
        scrollingClassTimeout[x] = setTimeout(
            function () { return i.isAlive && i.element.classList.remove(cls.state.scrolling(x)); },
            i.settings.scrollingThreshold
        );
    }

    function setScrollingClassInstantly(i, x) {
        addScrollingClass(i, x);
        removeScrollingClass(i, x);
    }

    var EventElement = function EventElement(element) {
        this.element = element;
        this.handlers = {};
    };

    var prototypeAccessors = { isEmpty: { configurable: true } };

    EventElement.prototype.bind = function bind (eventName, handler) {
        if (typeof this.handlers[eventName] === 'undefined') {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(handler);
        this.element.addEventListener(eventName, handler, false);
    };

    EventElement.prototype.unbind = function unbind (eventName, target) {
        var this$1 = this;

        this.handlers[eventName] = this.handlers[eventName].filter(function (handler) {
            if (target && handler !== target) {
                return true;
            }
            this$1.element.removeEventListener(eventName, handler, false);
            return false;
        });
    };

    EventElement.prototype.unbindAll = function unbindAll () {
        var this$1 = this;

        for (var name in this$1.handlers) {
            this$1.unbind(name);
        }
    };

    prototypeAccessors.isEmpty.get = function () {
        var this$1 = this;

        return Object.keys(this.handlers).every(
            function (key) { return this$1.handlers[key].length === 0; }
        );
    };

    Object.defineProperties( EventElement.prototype, prototypeAccessors );

    var EventManager = function EventManager() {
        this.eventElements = [];
    };

    EventManager.prototype.eventElement = function eventElement (element) {
        var ee = this.eventElements.filter(function (ee) { return ee.element === element; })[0];
        if (!ee) {
            ee = new EventElement(element);
            this.eventElements.push(ee);
        }
        return ee;
    };

    EventManager.prototype.bind = function bind (element, eventName, handler) {
        this.eventElement(element).bind(eventName, handler);
    };

    EventManager.prototype.unbind = function unbind (element, eventName, handler) {
        var ee = this.eventElement(element);
        ee.unbind(eventName, handler);

        if (ee.isEmpty) {
            // remove
            this.eventElements.splice(this.eventElements.indexOf(ee), 1);
        }
    };

    EventManager.prototype.unbindAll = function unbindAll () {
        this.eventElements.forEach(function (e) { return e.unbindAll(); });
        this.eventElements = [];
    };

    EventManager.prototype.once = function once (element, eventName, handler) {
        var ee = this.eventElement(element);
        var onceHandler = function (evt) {
            ee.unbind(eventName, onceHandler);
            handler(evt);
        };
        ee.bind(eventName, onceHandler);
    };

    function createEvent(name) {
        if (typeof window.CustomEvent === 'function') {
            return new CustomEvent(name);
        } else {
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(name, false, false, undefined);
            return evt;
        }
    }

    var processScrollDiff = function(
        i,
        axis,
        diff,
        useScrollingClass,
        forceFireReachEvent
    ) {
        if ( useScrollingClass === void 0 ) useScrollingClass = true;
        if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

        var fields;
        if (axis === 'top') {
            fields = [
                'contentHeight',
                'containerHeight',
                'scrollTop',
                'y',
                'up',
                'down' ];
        } else if (axis === 'left') {
            fields = [
                'contentWidth',
                'containerWidth',
                'scrollLeft',
                'x',
                'left',
                'right' ];
        } else {
            throw new Error('A proper axis should be provided');
        }

        processScrollDiff$1(i, diff, fields, useScrollingClass, forceFireReachEvent);
    };

    function processScrollDiff$1(
        i,
        diff,
        ref,
        useScrollingClass,
        forceFireReachEvent
    ) {
        var contentHeight = ref[0];
        var containerHeight = ref[1];
        var scrollTop = ref[2];
        var y = ref[3];
        var up = ref[4];
        var down = ref[5];
        if ( useScrollingClass === void 0 ) useScrollingClass = true;
        if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

        var element = i.element;

        // reset reach
        i.reach[y] = null;

        // 1 for subpixel rounding
        if (element[scrollTop] < 1) {
            i.reach[y] = 'start';
        }

        // 1 for subpixel rounding
        if (element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
            i.reach[y] = 'end';
        }

        if (diff) {
            element.dispatchEvent(createEvent(("ps-scroll-" + y)));

            if (diff < 0) {
                element.dispatchEvent(createEvent(("ps-scroll-" + up)));
            } else if (diff > 0) {
                element.dispatchEvent(createEvent(("ps-scroll-" + down)));
            }

            if (useScrollingClass) {
                setScrollingClassInstantly(i, y);
            }
        }

        if (i.reach[y] && (diff || forceFireReachEvent)) {
            element.dispatchEvent(createEvent(("ps-" + y + "-reach-" + (i.reach[y]))));
        }
    }

    function toInt(x) {
        return parseInt(x, 10) || 0;
    }

    function isEditable(el) {
        return (
            matches(el, 'input,[contenteditable]') ||
            matches(el, 'select,[contenteditable]') ||
            matches(el, 'textarea,[contenteditable]') ||
            matches(el, 'button,[contenteditable]')
        );
    }

    function outerWidth(element) {
        var styles = get(element);
        return (
            toInt(styles.width) +
            toInt(styles.paddingLeft) +
            toInt(styles.paddingRight) +
            toInt(styles.borderLeftWidth) +
            toInt(styles.borderRightWidth)
        );
    }

    var env = {
        isWebKit:
            typeof document !== 'undefined' &&
            'WebkitAppearance' in document.documentElement.style,
        supportsTouch:
            typeof window !== 'undefined' &&
            ('ontouchstart' in window ||
                (window.DocumentTouch && document instanceof window.DocumentTouch)),
        supportsIePointer:
            typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
        isChrome:
            typeof navigator !== 'undefined' &&
            /Chrome/i.test(navigator && navigator.userAgent),
    };

    var updateGeometry = function(i) {
        var element = i.element;

        i.containerWidth = element.clientWidth;
        i.containerHeight = element.clientHeight;
        i.contentWidth = element.scrollWidth;
        i.contentHeight = element.scrollHeight;

        if (!element.contains(i.scrollbarXRail)) {
            // clean up and append
            queryChildren(element, cls.element.rail('x')).forEach(function (el) { return remove(el); }
            );
            element.appendChild(i.scrollbarXRail);
        }
        if (!element.contains(i.scrollbarYRail)) {
            // clean up and append
            queryChildren(element, cls.element.rail('y')).forEach(function (el) { return remove(el); }
            );
            element.appendChild(i.scrollbarYRail);
        }

        if (
            !i.settings.suppressScrollX &&
            i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth
        ) {
            i.scrollbarXActive = true;
            i.railXWidth = i.containerWidth - i.railXMarginWidth;
            i.railXRatio = i.containerWidth / i.railXWidth;
            i.scrollbarXWidth = getThumbSize(
                i,
                toInt(i.railXWidth * i.containerWidth / i.contentWidth)
            );
            i.scrollbarXLeft = toInt(
                (i.negativeScrollAdjustment + element.scrollLeft) *
                (i.railXWidth - i.scrollbarXWidth) /
                (i.contentWidth - i.containerWidth)
            );
        } else {
            i.scrollbarXActive = false;
        }

        if (
            !i.settings.suppressScrollY &&
            i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight
        ) {
            i.scrollbarYActive = true;
            i.railYHeight = i.containerHeight - i.railYMarginHeight;
            i.railYRatio = i.containerHeight / i.railYHeight;
            i.scrollbarYHeight = getThumbSize(
                i,
                toInt(i.railYHeight * i.containerHeight / i.contentHeight)
            );
            i.scrollbarYTop = toInt(
                element.scrollTop *
                (i.railYHeight - i.scrollbarYHeight) /
                (i.contentHeight - i.containerHeight)
            );
        } else {
            i.scrollbarYActive = false;
        }

        if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
            i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
        }
        if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
            i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
        }

        updateCss(element, i);

        if (i.scrollbarXActive) {
            element.classList.add(cls.state.active('x'));
        } else {
            element.classList.remove(cls.state.active('x'));
            i.scrollbarXWidth = 0;
            i.scrollbarXLeft = 0;
            element.scrollLeft = 0;
        }
        if (i.scrollbarYActive) {
            element.classList.add(cls.state.active('y'));
        } else {
            element.classList.remove(cls.state.active('y'));
            i.scrollbarYHeight = 0;
            i.scrollbarYTop = 0;
            element.scrollTop = 0;
        }
    };

    function getThumbSize(i, thumbSize) {
        if (i.settings.minScrollbarLength) {
            thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
        }
        if (i.settings.maxScrollbarLength) {
            thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
        }
        return thumbSize;
    }

    function updateCss(element, i) {
        var xRailOffset = { width: i.railXWidth };
        if (i.isRtl) {
            xRailOffset.left =
                i.negativeScrollAdjustment +
                element.scrollLeft +
                i.containerWidth -
                i.contentWidth;
        } else {
            xRailOffset.left = element.scrollLeft;
        }
        if (i.isScrollbarXUsingBottom) {
            xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
        } else {
            xRailOffset.top = i.scrollbarXTop + element.scrollTop;
        }
        set(i.scrollbarXRail, xRailOffset);

        var yRailOffset = { top: element.scrollTop, height: i.railYHeight };
        if (i.isScrollbarYUsingRight) {
            if (i.isRtl) {
                yRailOffset.right =
                    i.contentWidth -
                    (i.negativeScrollAdjustment + element.scrollLeft) -
                    i.scrollbarYRight -
                    i.scrollbarYOuterWidth;
            } else {
                yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
            }
        } else {
            if (i.isRtl) {
                yRailOffset.left =
                    i.negativeScrollAdjustment +
                    element.scrollLeft +
                    i.containerWidth * 2 -
                    i.contentWidth -
                    i.scrollbarYLeft -
                    i.scrollbarYOuterWidth;
            } else {
                yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
            }
        }
        set(i.scrollbarYRail, yRailOffset);

        set(i.scrollbarX, {
            left: i.scrollbarXLeft,
            width: i.scrollbarXWidth - i.railBorderXWidth,
        });
        set(i.scrollbarY, {
            top: i.scrollbarYTop,
            height: i.scrollbarYHeight - i.railBorderYWidth,
        });
    }

    var clickRail = function(i) {
        i.event.bind(i.scrollbarY, 'mousedown', function (e) { return e.stopPropagation(); });
        i.event.bind(i.scrollbarYRail, 'mousedown', function (e) {
            var positionTop =
                e.pageY -
                window.pageYOffset -
                i.scrollbarYRail.getBoundingClientRect().top;
            var direction = positionTop > i.scrollbarYTop ? 1 : -1;

            i.element.scrollTop += direction * i.containerHeight;
            updateGeometry(i);

            e.stopPropagation();
        });

        i.event.bind(i.scrollbarX, 'mousedown', function (e) { return e.stopPropagation(); });
        i.event.bind(i.scrollbarXRail, 'mousedown', function (e) {
            var positionLeft =
                e.pageX -
                window.pageXOffset -
                i.scrollbarXRail.getBoundingClientRect().left;
            var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

            i.element.scrollLeft += direction * i.containerWidth;
            updateGeometry(i);

            e.stopPropagation();
        });
    };

    var dragThumb = function(i) {
        bindMouseScrollHandler(i, [
            'containerWidth',
            'contentWidth',
            'pageX',
            'railXWidth',
            'scrollbarX',
            'scrollbarXWidth',
            'scrollLeft',
            'x' ]);
        bindMouseScrollHandler(i, [
            'containerHeight',
            'contentHeight',
            'pageY',
            'railYHeight',
            'scrollbarY',
            'scrollbarYHeight',
            'scrollTop',
            'y' ]);
    };

    function bindMouseScrollHandler(
        i,
        ref
    ) {
        var containerHeight = ref[0];
        var contentHeight = ref[1];
        var pageY = ref[2];
        var railYHeight = ref[3];
        var scrollbarY = ref[4];
        var scrollbarYHeight = ref[5];
        var scrollTop = ref[6];
        var y = ref[7];

        var element = i.element;

        var startingScrollTop = null;
        var startingMousePageY = null;
        var scrollBy = null;

        function mouseMoveHandler(e) {
            element[scrollTop] =
                startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
            addScrollingClass(i, y);
            updateGeometry(i);

            e.stopPropagation();
            e.preventDefault();
        }

        function mouseUpHandler() {
            removeScrollingClass(i, y);
            i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
        }

        i.event.bind(i[scrollbarY], 'mousedown', function (e) {
            startingScrollTop = element[scrollTop];
            startingMousePageY = e[pageY];
            scrollBy =
                (i[contentHeight] - i[containerHeight]) /
                (i[railYHeight] - i[scrollbarYHeight]);

            i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
            i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

            e.stopPropagation();
            e.preventDefault();
        });
    }

    var keyboard = function(i) {
        var element = i.element;

        var elementHovered = function () { return matches(element, ':hover'); };
        var scrollbarFocused = function () { return matches(i.scrollbarX, ':focus') || matches(i.scrollbarY, ':focus'); };

        function shouldPreventDefault(deltaX, deltaY) {
            var scrollTop = element.scrollTop;
            if (deltaX === 0) {
                if (!i.scrollbarYActive) {
                    return false;
                }
                if (
                    (scrollTop === 0 && deltaY > 0) ||
                    (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)
                ) {
                    return !i.settings.wheelPropagation;
                }
            }

            var scrollLeft = element.scrollLeft;
            if (deltaY === 0) {
                if (!i.scrollbarXActive) {
                    return false;
                }
                if (
                    (scrollLeft === 0 && deltaX < 0) ||
                    (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)
                ) {
                    return !i.settings.wheelPropagation;
                }
            }
            return true;
        }

        i.event.bind(i.ownerDocument, 'keydown', function (e) {
            if (
                (e.isDefaultPrevented && e.isDefaultPrevented()) ||
                e.defaultPrevented
            ) {
                return;
            }

            if (!elementHovered() && !scrollbarFocused()) {
                return;
            }

            var activeElement = document.activeElement
                ? document.activeElement
                : i.ownerDocument.activeElement;
            if (activeElement) {
                if (activeElement.tagName === 'IFRAME') {
                    activeElement = activeElement.contentDocument.activeElement;
                } else {
                    // go deeper if element is a webcomponent
                    while (activeElement.shadowRoot) {
                        activeElement = activeElement.shadowRoot.activeElement;
                    }
                }
                if (isEditable(activeElement)) {
                    return;
                }
            }

            var deltaX = 0;
            var deltaY = 0;

            switch (e.which) {
                case 37: // left
                    if (e.metaKey) {
                        deltaX = -i.contentWidth;
                    } else if (e.altKey) {
                        deltaX = -i.containerWidth;
                    } else {
                        deltaX = -30;
                    }
                    break;
                case 38: // up
                    if (e.metaKey) {
                        deltaY = i.contentHeight;
                    } else if (e.altKey) {
                        deltaY = i.containerHeight;
                    } else {
                        deltaY = 30;
                    }
                    break;
                case 39: // right
                    if (e.metaKey) {
                        deltaX = i.contentWidth;
                    } else if (e.altKey) {
                        deltaX = i.containerWidth;
                    } else {
                        deltaX = 30;
                    }
                    break;
                case 40: // down
                    if (e.metaKey) {
                        deltaY = -i.contentHeight;
                    } else if (e.altKey) {
                        deltaY = -i.containerHeight;
                    } else {
                        deltaY = -30;
                    }
                    break;
                case 32: // space bar
                    if (e.shiftKey) {
                        deltaY = i.containerHeight;
                    } else {
                        deltaY = -i.containerHeight;
                    }
                    break;
                case 33: // page up
                    deltaY = i.containerHeight;
                    break;
                case 34: // page down
                    deltaY = -i.containerHeight;
                    break;
                case 36: // home
                    deltaY = i.contentHeight;
                    break;
                case 35: // end
                    deltaY = -i.contentHeight;
                    break;
                default:
                    return;
            }

            if (i.settings.suppressScrollX && deltaX !== 0) {
                return;
            }
            if (i.settings.suppressScrollY && deltaY !== 0) {
                return;
            }

            element.scrollTop -= deltaY;
            element.scrollLeft += deltaX;
            updateGeometry(i);

            if (shouldPreventDefault(deltaX, deltaY)) {
                e.preventDefault();
            }
        });
    };

    var wheel = function(i) {
        var element = i.element;

        function shouldPreventDefault(deltaX, deltaY) {
            var isTop = element.scrollTop === 0;
            var isBottom =
                element.scrollTop + element.offsetHeight === element.scrollHeight;
            var isLeft = element.scrollLeft === 0;
            var isRight =
                element.scrollLeft + element.offsetWidth === element.offsetWidth;

            var hitsBound;

            // pick axis with primary direction
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                hitsBound = isTop || isBottom;
            } else {
                hitsBound = isLeft || isRight;
            }

            return hitsBound ? !i.settings.wheelPropagation : true;
        }

        function getDeltaFromEvent(e) {
            var deltaX = e.deltaX;
            var deltaY = -1 * e.deltaY;

            if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
                // OS X Safari
                deltaX = -1 * e.wheelDeltaX / 6;
                deltaY = e.wheelDeltaY / 6;
            }

            if (e.deltaMode && e.deltaMode === 1) {
                // Firefox in deltaMode 1: Line scrolling
                deltaX *= 10;
                deltaY *= 10;
            }

            if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
                // IE in some mouse drivers
                deltaX = 0;
                deltaY = e.wheelDelta;
            }

            if (e.shiftKey) {
                // reverse axis with shift key
                return [-deltaY, -deltaX];
            }
            return [deltaX, deltaY];
        }

        function shouldBeConsumedByChild(target, deltaX, deltaY) {
            // FIXME: this is a workaround for <select> issue in FF and IE #571
            if (!env.isWebKit && element.querySelector('select:focus')) {
                return true;
            }

            if (!element.contains(target)) {
                return false;
            }

            var cursor = target;

            while (cursor && cursor !== element) {
                if (cursor.classList.contains(cls.element.consuming)) {
                    return true;
                }

                var style = get(cursor);
                var overflow = [style.overflow, style.overflowX, style.overflowY].join(
                    ''
                );

                // if scrollable
                if (overflow.match(/(scroll|auto)/)) {
                    var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
                    if (maxScrollTop > 0) {
                        if (
                            !(cursor.scrollTop === 0 && deltaY > 0) &&
                            !(cursor.scrollTop === maxScrollTop && deltaY < 0)
                        ) {
                            return true;
                        }
                    }
                    var maxScrollLeft = cursor.scrollLeft - cursor.clientWidth;
                    if (maxScrollLeft > 0) {
                        if (
                            !(cursor.scrollLeft === 0 && deltaX < 0) &&
                            !(cursor.scrollLeft === maxScrollLeft && deltaX > 0)
                        ) {
                            return true;
                        }
                    }
                }

                cursor = cursor.parentNode;
            }

            return false;
        }

        function mousewheelHandler(e) {
            var ref = getDeltaFromEvent(e);
            var deltaX = ref[0];
            var deltaY = ref[1];

            if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
                return;
            }

            var shouldPrevent = false;
            if (!i.settings.useBothWheelAxes) {
                // deltaX will only be used for horizontal scrolling and deltaY will
                // only be used for vertical scrolling - this is the default
                element.scrollTop -= deltaY * i.settings.wheelSpeed;
                element.scrollLeft += deltaX * i.settings.wheelSpeed;
            } else if (i.scrollbarYActive && !i.scrollbarXActive) {
                // only vertical scrollbar is active and useBothWheelAxes option is
                // active, so let's scroll vertical bar using both mouse wheel axes
                if (deltaY) {
                    element.scrollTop -= deltaY * i.settings.wheelSpeed;
                } else {
                    element.scrollTop += deltaX * i.settings.wheelSpeed;
                }
                shouldPrevent = true;
            } else if (i.scrollbarXActive && !i.scrollbarYActive) {
                // useBothWheelAxes and only horizontal bar is active, so use both
                // wheel axes for horizontal bar
                if (deltaX) {
                    element.scrollLeft += deltaX * i.settings.wheelSpeed;
                } else {
                    element.scrollLeft -= deltaY * i.settings.wheelSpeed;
                }
                shouldPrevent = true;
            }

            updateGeometry(i);

            shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
            if (shouldPrevent && !e.ctrlKey) {
                e.stopPropagation();
                e.preventDefault();
            }
        }

        if (typeof window.onwheel !== 'undefined') {
            i.event.bind(element, 'wheel', mousewheelHandler);
        } else if (typeof window.onmousewheel !== 'undefined') {
            i.event.bind(element, 'mousewheel', mousewheelHandler);
        }
    };

    var touch = function(i) {
        if (!env.supportsTouch && !env.supportsIePointer) {
            return;
        }

        var element = i.element;

        function shouldPrevent(deltaX, deltaY) {
            var scrollTop = element.scrollTop;
            var scrollLeft = element.scrollLeft;
            var magnitudeX = Math.abs(deltaX);
            var magnitudeY = Math.abs(deltaY);

            if (magnitudeY > magnitudeX) {
                // user is perhaps trying to swipe up/down the page

                if (
                    (deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight) ||
                    (deltaY > 0 && scrollTop === 0)
                ) {
                    // set prevent for mobile Chrome refresh
                    return window.scrollY === 0 && deltaY > 0 && env.isChrome;
                }
            } else if (magnitudeX > magnitudeY) {
                // user is perhaps trying to swipe left/right across the page

                if (
                    (deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth) ||
                    (deltaX > 0 && scrollLeft === 0)
                ) {
                    return true;
                }
            }

            return true;
        }

        function applyTouchMove(differenceX, differenceY) {
            element.scrollTop -= differenceY;
            element.scrollLeft -= differenceX;

            updateGeometry(i);
        }

        var startOffset = {};
        var startTime = 0;
        var speed = {};
        var easingLoop = null;

        function getTouch(e) {
            if (e.targetTouches) {
                return e.targetTouches[0];
            } else {
                // Maybe IE pointer
                return e;
            }
        }

        function shouldHandle(e) {
            if (e.pointerType && e.pointerType === 'pen' && e.buttons === 0) {
                return false;
            }
            if (e.targetTouches && e.targetTouches.length === 1) {
                return true;
            }
            if (
                e.pointerType &&
                e.pointerType !== 'mouse' &&
                e.pointerType !== e.MSPOINTER_TYPE_MOUSE
            ) {
                return true;
            }
            return false;
        }

        function touchStart(e) {
            if (!shouldHandle(e)) {
                return;
            }

            var touch = getTouch(e);

            startOffset.pageX = touch.pageX;
            startOffset.pageY = touch.pageY;

            startTime = new Date().getTime();

            if (easingLoop !== null) {
                clearInterval(easingLoop);
            }
        }

        function shouldBeConsumedByChild(target, deltaX, deltaY) {
            if (!element.contains(target)) {
                return false;
            }

            var cursor = target;

            while (cursor && cursor !== element) {
                if (cursor.classList.contains(cls.element.consuming)) {
                    return true;
                }

                var style = get(cursor);
                var overflow = [style.overflow, style.overflowX, style.overflowY].join(
                    ''
                );

                // if scrollable
                if (overflow.match(/(scroll|auto)/)) {
                    var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
                    if (maxScrollTop > 0) {
                        if (
                            !(cursor.scrollTop === 0 && deltaY > 0) &&
                            !(cursor.scrollTop === maxScrollTop && deltaY < 0)
                        ) {
                            return true;
                        }
                    }
                    var maxScrollLeft = cursor.scrollLeft - cursor.clientWidth;
                    if (maxScrollLeft > 0) {
                        if (
                            !(cursor.scrollLeft === 0 && deltaX < 0) &&
                            !(cursor.scrollLeft === maxScrollLeft && deltaX > 0)
                        ) {
                            return true;
                        }
                    }
                }

                cursor = cursor.parentNode;
            }

            return false;
        }

        function touchMove(e) {
            if (shouldHandle(e)) {
                var touch = getTouch(e);

                var currentOffset = { pageX: touch.pageX, pageY: touch.pageY };

                var differenceX = currentOffset.pageX - startOffset.pageX;
                var differenceY = currentOffset.pageY - startOffset.pageY;

                if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
                    return;
                }

                applyTouchMove(differenceX, differenceY);
                startOffset = currentOffset;

                var currentTime = new Date().getTime();

                var timeGap = currentTime - startTime;
                if (timeGap > 0) {
                    speed.x = differenceX / timeGap;
                    speed.y = differenceY / timeGap;
                    startTime = currentTime;
                }

                if (shouldPrevent(differenceX, differenceY)) {
                    e.preventDefault();
                }
            }
        }
        function touchEnd() {
            if (i.settings.swipeEasing) {
                clearInterval(easingLoop);
                easingLoop = setInterval(function() {
                    if (i.isInitialized) {
                        clearInterval(easingLoop);
                        return;
                    }

                    if (!speed.x && !speed.y) {
                        clearInterval(easingLoop);
                        return;
                    }

                    if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
                        clearInterval(easingLoop);
                        return;
                    }

                    applyTouchMove(speed.x * 30, speed.y * 30);

                    speed.x *= 0.8;
                    speed.y *= 0.8;
                }, 10);
            }
        }

        if (env.supportsTouch) {
            i.event.bind(element, 'touchstart', touchStart);
            i.event.bind(element, 'touchmove', touchMove);
            i.event.bind(element, 'touchend', touchEnd);
        } else if (env.supportsIePointer) {
            if (window.PointerEvent) {
                i.event.bind(element, 'pointerdown', touchStart);
                i.event.bind(element, 'pointermove', touchMove);
                i.event.bind(element, 'pointerup', touchEnd);
            } else if (window.MSPointerEvent) {
                i.event.bind(element, 'MSPointerDown', touchStart);
                i.event.bind(element, 'MSPointerMove', touchMove);
                i.event.bind(element, 'MSPointerUp', touchEnd);
            }
        }
    };

    var defaultSettings = function () { return ({
        handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
        maxScrollbarLength: null,
        minScrollbarLength: null,
        scrollingThreshold: 1000,
        scrollXMarginOffset: 0,
        scrollYMarginOffset: 0,
        suppressScrollX: false,
        suppressScrollY: false,
        swipeEasing: true,
        useBothWheelAxes: false,
        wheelPropagation: false,
        wheelSpeed: 1,
    }); };

    var handlers = {
        'click-rail': clickRail,
        'drag-thumb': dragThumb,
        keyboard: keyboard,
        wheel: wheel,
        touch: touch,
    };

    var PerfectScrollbar = function PerfectScrollbar(element, userSettings) {
        var this$1 = this;
        if ( userSettings === void 0 ) userSettings = {};

        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element || !element.nodeName) {
            throw new Error('no element is specified to initialize PerfectScrollbar');
        }

        this.element = element;

        element.classList.add(cls.main);

        this.settings = defaultSettings();
        for (var key in userSettings) {
            this$1.settings[key] = userSettings[key];
        }

        this.containerWidth = null;
        this.containerHeight = null;
        this.contentWidth = null;
        this.contentHeight = null;

        var focus = function () { return element.classList.add(cls.state.focus); };
        var blur = function () { return element.classList.remove(cls.state.focus); };

        this.isRtl = get(element).direction === 'rtl';
        this.isNegativeScroll = (function () {
            var originalScrollLeft = element.scrollLeft;
            var result = null;
            element.scrollLeft = -1;
            result = element.scrollLeft < 0;
            element.scrollLeft = originalScrollLeft;
            return result;
        })();
        this.negativeScrollAdjustment = this.isNegativeScroll
            ? element.scrollWidth - element.clientWidth
            : 0;
        this.event = new EventManager();
        this.ownerDocument = element.ownerDocument || document;

        this.scrollbarXRail = div(cls.element.rail('x'));
        element.appendChild(this.scrollbarXRail);
        this.scrollbarX = div(cls.element.thumb('x'));
        this.scrollbarXRail.appendChild(this.scrollbarX);
        this.scrollbarX.setAttribute('tabindex', 0);
        this.event.bind(this.scrollbarX, 'focus', focus);
        this.event.bind(this.scrollbarX, 'blur', blur);
        this.scrollbarXActive = null;
        this.scrollbarXWidth = null;
        this.scrollbarXLeft = null;
        var railXStyle = get(this.scrollbarXRail);
        this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
        if (isNaN(this.scrollbarXBottom)) {
            this.isScrollbarXUsingBottom = false;
            this.scrollbarXTop = toInt(railXStyle.top);
        } else {
            this.isScrollbarXUsingBottom = true;
        }
        this.railBorderXWidth =
            toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth);
        // Set rail to display:block to calculate margins
        set(this.scrollbarXRail, { display: 'block' });
        this.railXMarginWidth =
            toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
        set(this.scrollbarXRail, { display: '' });
        this.railXWidth = null;
        this.railXRatio = null;

        this.scrollbarYRail = div(cls.element.rail('y'));
        element.appendChild(this.scrollbarYRail);
        this.scrollbarY = div(cls.element.thumb('y'));
        this.scrollbarYRail.appendChild(this.scrollbarY);
        this.scrollbarY.setAttribute('tabindex', 0);
        this.event.bind(this.scrollbarY, 'focus', focus);
        this.event.bind(this.scrollbarY, 'blur', blur);
        this.scrollbarYActive = null;
        this.scrollbarYHeight = null;
        this.scrollbarYTop = null;
        var railYStyle = get(this.scrollbarYRail);
        this.scrollbarYRight = parseInt(railYStyle.right, 10);
        if (isNaN(this.scrollbarYRight)) {
            this.isScrollbarYUsingRight = false;
            this.scrollbarYLeft = toInt(railYStyle.left);
        } else {
            this.isScrollbarYUsingRight = true;
        }
        this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
        this.railBorderYWidth =
            toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
        set(this.scrollbarYRail, { display: 'block' });
        this.railYMarginHeight =
            toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
        set(this.scrollbarYRail, { display: '' });
        this.railYHeight = null;
        this.railYRatio = null;

        this.reach = {
            x:
                element.scrollLeft <= 0
                    ? 'start'
                    : element.scrollLeft >= this.contentWidth - this.containerWidth
                    ? 'end'
                    : null,
            y:
                element.scrollTop <= 0
                    ? 'start'
                    : element.scrollTop >= this.contentHeight - this.containerHeight
                    ? 'end'
                    : null,
        };

        this.isAlive = true;

        this.settings.handlers.forEach(function (handlerName) { return handlers[handlerName](this$1); });

        this.lastScrollTop = element.scrollTop; // for onScroll only
        this.lastScrollLeft = element.scrollLeft; // for onScroll only
        this.event.bind(this.element, 'scroll', function (e) { return this$1.onScroll(e); });
        updateGeometry(this);
    };

    PerfectScrollbar.prototype.update = function update () {
        if (!this.isAlive) {
            return;
        }

        // Recalcuate negative scrollLeft adjustment
        this.negativeScrollAdjustment = this.isNegativeScroll
            ? this.element.scrollWidth - this.element.clientWidth
            : 0;

        // Recalculate rail margins
        set(this.scrollbarXRail, { display: 'block' });
        set(this.scrollbarYRail, { display: 'block' });
        this.railXMarginWidth =
            toInt(get(this.scrollbarXRail).marginLeft) +
            toInt(get(this.scrollbarXRail).marginRight);
        this.railYMarginHeight =
            toInt(get(this.scrollbarYRail).marginTop) +
            toInt(get(this.scrollbarYRail).marginBottom);

        // Hide scrollbars not to affect scrollWidth and scrollHeight
        set(this.scrollbarXRail, { display: 'none' });
        set(this.scrollbarYRail, { display: 'none' });

        updateGeometry(this);

        processScrollDiff(this, 'top', 0, false, true);
        processScrollDiff(this, 'left', 0, false, true);

        set(this.scrollbarXRail, { display: '' });
        set(this.scrollbarYRail, { display: '' });
    };

    PerfectScrollbar.prototype.onScroll = function onScroll (e) {
        if (!this.isAlive) {
            return;
        }

        updateGeometry(this);
        processScrollDiff(this, 'top', this.element.scrollTop - this.lastScrollTop);
        processScrollDiff(
            this,
            'left',
            this.element.scrollLeft - this.lastScrollLeft
        );

        this.lastScrollTop = this.element.scrollTop;
        this.lastScrollLeft = this.element.scrollLeft;
    };

    PerfectScrollbar.prototype.destroy = function destroy () {
        if (!this.isAlive) {
            return;
        }

        this.event.unbindAll();
        remove(this.scrollbarX);
        remove(this.scrollbarY);
        remove(this.scrollbarXRail);
        remove(this.scrollbarYRail);
        this.removePsClasses();

        // unset elements
        this.element = null;
        this.scrollbarX = null;
        this.scrollbarY = null;
        this.scrollbarXRail = null;
        this.scrollbarYRail = null;

        this.isAlive = false;
    };

    PerfectScrollbar.prototype.removePsClasses = function removePsClasses () {
        this.element.className = this.element.className
            .split(' ')
            .filter(function (name) { return !name.match(/^ps([-_].+|)$/); })
            .join(' ');
    };

    return PerfectScrollbar;

})));
/**
 * END: perfect-scrollbar.js
 */