// $.fn.apihost = 'http://www.jike365.com';
$.fn.apihost = '';
$.fn.csrf_xhy = '';
$.fn.luckyTime = 15;

$.fn.globalInit = function(){
    $.fn.csrf_xhy = $('#csrf_xhy').val()
}

$.fn.showLoginModal = function(){

    $('.login-modal').modal();
}

$.fn.showFlash = function(){

    var infoObj = $('#info').eq(0);
    var info = infoObj ? infoObj.val() : false;
    if(info && infoObj.attr('show')==1){

        $.x_say_x({cont : info, btn : []});
    }
}

//floater
$(function(){

    $.fn.globalInit();
    $.fn.showFlash();



    $('.floater').each(function(){

        var t = $(this)
        var position = t.attr('position');
        var relativeTop=0;

        if(position == 'middle') {

            relativeTop = $(window).height() / 2 - (parseInt($(this).css('height'))/2);
        } else {
            relativeTop = 87;
        }

        var scrolltop=document.documentElement.scrollTop||document.body.scrollTop;

        scrolltop = (parseInt(scrolltop) + relativeTop) + 'px';

        $('.floater').animate({top: scrolltop}, 30)

        $(window).scroll(function(){

            setTimeout(function(){
                var scrolltop=document.documentElement.scrollTop||document.body.scrollTop;
                scrolltop = (parseInt(scrolltop) + relativeTop) + 'px';
                $('.floater').animate({top: scrolltop}, 30)
            },500)
        })
    })


    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        html : true
    });

    $.fn.ajax_update_html();
})

$.fn.ajax_update_html = function(callBack){

    var fn = null
    if (callBack && callBack.fn){
        fn = callBack.fn;
    }

    $('.data-ajax-update-html').each(function(){

        if($(this).attr('data-data')){

            var t = $(this);
            var id = $(this).attr('data-id');
            var dataUrl = $(this).attr('data-url');
            var data =  $(this).attr('data-data');
            data = $.parseJSON(data)

            $.ajax({
                data : data,
                url : dataUrl,
                type : 'post',
                dataType : 'json',
                success : function(json){

                    if(json.status == 1){
                        var value = json.data.result ? json.data.result : json.data.times;
                        t.html(value)
                        if(fn != null)
                            fn()
                    }
                    else
                        t.html(json.message)
                }
            })
        }
    })
}


/**
 * modals 垂直居中显示
 * Vertically center Bootstrap 3 modals so they aren't always stuck at the top
 */
$(function() {
    function reposition() {
        var modal = $(this),
            dialog = modal.find('.modal-dialog');
        modal.css('display', 'block');

        // Dividing by two centers the modal exactly, but dividing by three
        // or four works better for larger screens.
        dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
    }
    // Reposition when a modal is shown
    $('.modal').on('show.bs.modal', reposition);
    // Reposition when the window is resized
    $(window).on('resize', function() {
        $('.modal:visible').each(reposition);
    });
});

//x_say插件
!(function(){

    $(function(){
        /*var obj = $.x_say_m({
            cont : "dd", btnOption : { yesLabel:'退出'}, time : 2000,
            contStyle : {
                padding : '80px 60px 40px 60px'
            }
        });*/
        /*$(document).scroll(function(){
            (obj.border).pos();
            (obj.cont).pos();
        })*/
    })

    $.x_alert = function(option){
        var opt = {
            btn : [],
            size : [300, 150],
            time : 1500,
            contStyle : {
                padding : '60px 40px 30px 40px'
            }
        };
        opt = $.extend(opt, option);
        return $.x_say(opt);
    }

    $.x_say_m = function(option){
        var opt = {
            size : [490, 280]
        };
        opt = $.extend(opt, option);
        return $.x_say(opt);
    }
    $.x_say_x = function (option) {

        var opt = {
            btn : [],
            size : [300, 150],
            time : 1500,
            contStyle : {
                padding : '60px 40px 30px 40px'
            }
        }
        opt = $.extend(opt, option);
        return $.x_say(opt);
    }

    $.x_say = function(option){
        var opt = {
            title : '',
            bg : false,
            cont : '欢迎使用x_say弹出框！ qq:258082291',
            btn : ['yes','no'],
            size : [300,70],
            zIndex : 1060,
            time : 3000,
            closeBtnCont : '',
            callback : function(){},
            yesCallback : function(){},
            noCallback : function(){},
            borderStyle : {
                size : 12,
                bgColor : '#000',
                opacity : 0.3
            },
            noBtnExit : true,
            yesBtnExit : true,
            contStyle : {
                bgColor : '#fff',
                padding : '80px 60px 40px 60px ',
                textAlign : 'center'
            },
            btnOption : {
                yesClass : 'btn-warning',
                yesLabel : '确定',
                noClass : 'btn-primary',
                noLabel : '取消',
                marginTop : '90px'
            }
        };

        var exports = {}
        var wrapper,border,cont,closeBtn,bg,btnGroup,yes,no;
        var setOption = function(){
            //参数配置
            option.borderStyle = $.extend(opt.borderStyle, option.borderStyle)
            option.contStyle = $.extend(opt.contStyle, option.contStyle)
            option.btnOption = $.extend(opt.btnOption, option.btnOption)
            opt = $.extend(opt, option);
        }
        var setDom = function(){
            //dom配置
            wrapper = $("<div class='x_say_wrapper'></div>");
            border = $("<div class='x_say_border'></div>");
            cont = $("<div class='x_say_cont'></div>");
            closeBtn = $("<span class='x_say_close_btn'></span>");
            titleCont = $("<span class='x_say_title'></span>");
            bg = $("<div class='x_say_bg'></div>");
            btnGroup = $("<div class='x_say_btn_group'></div>")
            yes = $("<button class='yes btn'>"+opt.btnOption.yesLabel+"</button>");
            no = $("<button class='no btn' >"+opt.btnOption.noLabel+"</button>");

            cont.append(opt.cont);
            closeBtn.append(opt.closeBtnCont);
            titleCont.append(opt.title)

            cont.append(closeBtn);

            if(opt.title){
                cont.append(titleCont)
            }

            if(opt.btn.length===2){
                for(i in opt.btn){
                    if(opt.btn[i] == 'yes')
                        btnGroup.append(yes)
                    else
                        btnGroup.append(no)
                }
            }
            opt.btn.length===1 && opt.btn[0] == 'no' && btnGroup.append(no)
            opt.btn.length===1 && opt.btn[0] == 'yes' && btnGroup.append(yes)
            opt.btn.length > 0 && cont.append(btnGroup)
            wrapper.append(border, cont);

            if(opt.bg == true)
                wrapper.append(bg);

            $('body').append(wrapper);
        }
        var setStyle = function(){
            //样式设置
            btnGroup.css({
                'margin-top' : opt.btnOption.marginTop
            });
            border.css({
                width : (opt.size[0] + opt.borderStyle.size) + 'px',
                height : (opt.size[1] + opt.borderStyle.size) + 'px',
                background : opt.borderStyle.bgColor,
                opacity : opt.borderStyle.opacity,
                'z-index' : opt.zIndex
            });
            cont.css({
                width : opt.size[0],
                height : opt.size[1],
                background : opt.contStyle.bgColor,
                'z-index' : opt.zIndex,
                padding : opt.contStyle.padding,
                'text-align' : opt.contStyle.textAlign
            });
            opt.btnOption.yesClass && yes.addClass(opt.btnOption.yesClass);
            opt.btnOption.noClass && yes.addClass(opt.btnOption.noClass);
            bg.css({
                'width': '100%', 'height' : $(window).outerHeight(true), 'z-index': opt.zIndex-1,
                'left': 0, 'top': 0,
                position: 'absolute',
            })
            bg.css({width:$(window).outerWidth(true), height:$(document).outerHeight(true), opacity:option.opcity})
        }

        setOption();
        setDom();
        setStyle();

        var exportsConstruct = function(){
            exports.wrapper = wrapper;
            exports.border = border;
            exports.cont = cont;
            exports.cont.closeBtn = closeBtn;
            exports.btnGroup = btnGroup;
            exports.yes = yes;
            exports.no = no;
            exports._pos = function(){
                //居中显示
                exports.cont.pos();
                exports.border.pos();
            }
            exports._autoRemove = function(){
                if(opt.time > 0)
                    setTimeout(function(){
                        exports.wrapper._del();
                    }, opt.time)
            }

            exports.wrapper._del = function(){
                border.animate({
                    top:$(document).scrollTop(),
                    opacity:0
                },function(){
                    exports.wrapper.remove();
                });
                cont.animate({
                    top:$(document).scrollTop(),
                    opacity:0
                },function(){
                    exports.wrapper.remove();
                });

                opt.callback();
            }
            exports.cont.closeBtn.on('click', function () {
               exports.wrapper._del();
            })

            exports.yes.on('click', function(){
                yesResult = opt.yesCallback(exports, yes);
                if(opt.yesBtnExit == true && yesResult !== false)
                    exports.wrapper._del();
            })
            exports.no.on('click', function(){
                opt.noCallback(exports, no);
                if(opt.noBtnExit == true)
                    exports.wrapper._del();
            })

            exports._pos();
            exports._autoRemove();
        }

        exportsConstruct();

        return exports;
    }

})(jQuery)


//say插件
!(function(){
    $.say = function(option){
        var opt    = $.extend({
                title : 0, // 是否有标题，有标题就会出现按钮
                bg : 0, // 遮罩
                cont: '弹出层',
                border : 1, // 是否显示边框
                timeout : 2, // 自动关闭时间 默认2s
                style : '', 	// 可以定义为白色
                callback : function(){}, // 关闭窗口时的回调
                btn : ['yes', 'no'], // 按钮组
                yes : function(){}, // 点击确定时的回调
                no : function(){}, // 点击取消时的回调
                typesize: 0, // 0小图标 1 大图标
                size: {width:0, height:0}, //弹窗大小，默认为自动适应
                type : '' // success, error, ask, not, bulb, info, news
            }, option);
        border  = $('<div class="ldf_say_border '+ opt.style +'"></div>');
        type    = opt.type && opt.typesize ? 'big_'+ opt.type : opt.type;
        width   = opt.size.width ? 'width:'+ opt.size.width +';' : '';
        height  = opt.size.height ? 'height:'+ opt.size.height +';' : '';
        cont    = $('<div class="ldf_say_cont" style="'+ width+height +'"><span class="'+ type +'"></span><span class="sayText">'+ opt.cont +'</span></div>');
        bg      = $('<div class="ldf_bg"></div>');
        titleBg = opt.type ? 't_'+opt.type : 'def';
        title   = $('<div class="ldf_say_title '+ titleBg +'">'+ opt.title +'</div>');
        btnCss  = opt.size.height ? 'style="width:100%;position: absolute; bottom:5px; left:0;"' : '';
        btnArea = $('<div class="ldf_say_btnArea" '+ btnCss +'></div>'); // 如果自定义高度，那么按钮就变为绝对定位
        yes     = $('<a class="ldf_say_btn btn yes '+ titleBg +'" href="javascript:;">确定</a>');
        no      = $('<a class="ldf_say_btn btn no" href="javascript:;">取消</a>');
        close		= $('<b class="ldf_say_close">×</b>');
        timer   = null, _ldf = {};
        (opt.btn.length ==2 && btnArea.append(yes, no)) || (opt.btn[0] == 'yes' && btnArea.append(yes)) || (opt.btn[0] == 'no' && btnArea.append(no)); // 显示按钮个数
        if(opt.btn.length==0)
            btnArea.hide();
        opt.bg && $('body').append(bg) && bg.css({height:$(document).height()}); //添加背景
        opt.title && cont.addClass('thinPad').prepend(title.append(close)).append(btnArea);//添加标题和按钮
        opt.border && $('body').append(border.show()); //将DOM添加到body
        $('body').append(cont.show()); //将DOM添加到body
        cont.pos(); //让内容居中显示
        var cw = cont.outerWidth(), cl = cont.position().left,
            ch = cont.outerHeight(), ct = cont.position().top,
            total = $('.ldf_say_cont').length-1; //当前弹出层个数
        cont.css({ top: ct+40*total}); //内容位置随个数调整
        opt.border && border.css({width:cw+20, height:ch+20, left:cl-11, top: ct-11+(40*total)}); //内容边框随着内容位置调整
        _ldf._del = function() { //删除DOM
            cont.animate({
                top:$(document).scrollTop(),
                opacity:0
            },function(){
                $(this).remove();
            });
            opt.border && border.animate({
                top:$(document).scrollTop(),
                opacity:0
            },function(){
                $(this).remove();
            });
            // cont.add(border).remove();
            opt.bg && bg.remove();
            opt.callback(); //回调函数
        }
        if(opt.timeout) {
            timer = setTimeout(_ldf._del, opt.timeout*1000);
        }
        $('body').keyup(function(e) { // 按下esc取消
            if(e.keyCode == 27) _ldf._del();
        });
        close.on('click', function(){ // 关闭
            _ldf._del();
        });
        yes.on('click', function(){
            opt.yes(_ldf, yes);
            // _ldf.del();
        });
        no.on('click', function(){
            opt.no(_ldf, no);
            _ldf._del();
        });
        return this;
    };
})(jQuery);
/**
 * 元素居中
 * @return {[type]} [description]
 */
!(function($){
    $.fn.pos = function (move, b) { //居中
        b = b || 2;
        var
            $t = $(this),
            t  = ($(window).outerHeight() - $t.outerHeight()) / b + $(window).scrollTop(),
            l  = ($(window).outerWidth() - $t.outerWidth()) / 2,
            ft = ($(window).outerHeight() - $t.outerHeight()) / b;
        // move ? $t.css('position', 'fixed') : $t.css({ top : t, left : l });
        // move ? $t.stop().animate({ top : t, left : l },30) : $t.css({ top : t, left : l });
        move ? $t.css({ top : ft, left : l}) : $t.css({ top : t, left : l });
        ($t.outerHeight() > $(window).outerHeight()) && $t.css({top: 10});
        return this;
    };
})(jQuery);

//弹出窗
!(function($){

    $(function(){
        $('body').on('click','.x_popup',function(){
            $t = $(this);
            $t.x_popup({
                title : $t.attr('data-title')
            });
        })
    })

    $.fn.x_popup = function(opt){

        var $t = $(this);

        var exports = {};
        var option;
        var winWrapper;
        var win;
        var title;
        var cont;
        var close;
        var bg;

        var setOption = function(){
            option = {
                title : '', //标题
                cont : 'content',  //内容
                size : [960, 540],  //窗口大小
                zIndex : 1050,
                opacity : 0.7,
                background: '#000',
                close : '×',
                callback : function(){},
                wrapClass : ''
            };
            option = $.extend(option, opt);
        };
        //dom结构设置
        var setDom = function(){
            winWrapper = $("<div class='xhy_popup_wrapper'></div>");
            win = $("<div class='xhy_popup' ></div>");
            title = $("<div class='title'>"+option.title+"</div>");
            cont = $("<div class='content'></div>");
            close = $("<div title='关闭' class='closeBtn'></div>")
            bg = $("<div class='xhy_popup_bg'></div>");

            cont.html(option.cont);
            title.html(option.title);
            close.html(option.close);
            win.append(title, cont, close);

            winWrapper.append(win, bg);
        };
        var setStyle = function(){

            $('html,body').css({'overflow-y':'hidden'});

            option.wrapClass != '' && winWrapper.addClass(option.wrapClass);
            $('body').append(winWrapper);

            win.css({
                width:option.size[0],
                height: option.size[1],
                'z-index' : option.zIndex,
                background : option.background
            });
            bg.css({
                'width': '100%', 'height' : $(window).outerHeight(true), 'z-index': option.zIndex-1,
                'left': 0, 'top': 0
            })
            bg.css({width:$(window).outerWidth(true), height:$(document).outerHeight(true), opacity:option.opacity})

            //布局居中
            win.pos();
        };

        setOption();
        setDom();
        setStyle();

        var exportsConstruct = function(){
            exports.wrapper = winWrapper;
            exports.win = win;
            exports.bg = bg;
            exports.cont = cont;
            exports.opt = opt;
            exports.close = close;
            exports.title = title;

            exports.wrapper._del = function(){
                winWrapper.remove();
                $('html,body').removeAttr('style');
                opt.callback();
            }
            //事件设置
            exports.close.click(function(){
                exports.wrapper._del()

            })
        }

        exportsConstruct();

        return exports;
    }
})(jQuery)


!(function($){
    $.fn.luckyDraw = function(option){
        var opt = {
            title : '',
            close : '退出',
            wrapClass : 'popup-lucky-wrap',
            url : '',
            size : [940, 540],
            link : '',
            opacity : 0.3
        }


        opt = $.extend(opt, option);

        if(opt.url != '' && opt.url.indexOf('?') != -1)
            opt.url += '&h=' + ( parseInt(opt.size[1]) + 49);

        opt.cont = "<div class='loading hide'>loading ...</div><iframe src='"+opt.url+"' scrolling=no width='940' height='540' class='show'></iframe> ";
        if(opt.link != '' && opt.link.length>0){
            opt.cont += "<a class='video_link' href='"+opt.link+"' target='_blank' style='width:100%; height: 100%;display: block; position: absolute; z-index:10; top:0;'></a>";
        }

        var draw = $.fn.x_popup(opt);
        var iframe = $(draw.wrapper).find('iframe');
        var loading = $('.loading');

        $(draw.wrapper).find('iframe').load(function(){
            loading.fadeOut();
            $(draw.wrapper).find('iframe').removeClass('hide')
        })

        return draw;
    }

    $.fn.iframe_x_say = function(option){
        var opt = {
            title : '',
            close : '退出',
            wrapClass : 'popup-lucky-wrap',
            url : '',
            size : [500, 300],
            contStyle : {
                padding : '20px 20px 20px 20px '
            },
            frameSize : [455,200],
            iframeClass : 'show'
        }

        opt = $.extend(opt, option);

        opt.cont = "<div class='loading hide'>loading ...</div><iframe src='"+opt.url+"' scrolling=no width='"+opt.frameSize[0]+"' height="+opt.frameSize[1]+" class='" + opt.iframeClass + "' style='border:0;'></iframe> ";

        var draw = $.x_say_m(opt);
        var iframe = $(draw.wrapper).find('iframe');
        var loading = $('.loading');

        $(draw.wrapper).find('iframe').load(function(){
            loading.fadeOut();
            $(draw.wrapper).find('iframe').removeClass('hide')
        })

        return draw;
    }
})(jQuery)

//$('body').popup({cont:'<iframe src="/index/luckydraw" scrolling=""></iframe>'});

$(function(){
    if($('.side-main').length>0 && $('.side-left').length>0){

        //左侧菜单高度调整
        setTimeout(function(){
            if(parseInt($('.side-left').css('height'))<parseInt($('.side-main').css('height'))){

                $('.side-left').css('height',$('.side-main').css('height'))
            }
        },300)
    }
})


//城市
;(function(){
    $(function(){
        $('.zn_select_area').each(function(){
            $(this).zn_newArea();
        });
    });

    var newAreaCacheData = []; //地区数据缓存
    /**
     * 单选地区插件
     * @date 2014-12-15 15:00:18
     */
    $.fn.zn_newArea = function(option) {
        var
            $t    = $(this),
            title = $t.text(),
            name  = $t.attr('data-name') || 'Province,City,Country',
            val   = $t.attr('data-value') || false,
            show  = $t.attr('data-show') || false,
            ajaxurl = $t.attr('data-region-url') || '/api/region/getArea',
            opt   = $.extend({
                name:name.split(','),
                val:val ? val.split(',') : [0,0,0],
                show:show ? show.split(',') : [0,0,0],
                pfn : function(){}, // 省回调
                cfn : function(){}, // 市回调
                afn : function(){} // 区回调
            }, option);

        $t.ajax_get_area = function(id){ //同步获取地区数据
            var data = null, url = ajaxurl;
            if(newAreaCacheData[id]){ //缓存数据
                data = newAreaCacheData[id];
            }else{
                $.ajax({ url: url, type: 'POST', dataType: 'html', async : false, data: {id: id || 0},
                    success : function(re) {
                        if(re) data = re;
                        newAreaCacheData[id] = re;
                    }
                });
            }
            return data;
        }
        var // 定义所需DOM
            showName      = $('<span class="zn_showName">'+title+'</span>'),
            showProvince  = $('<b class="zn_showArea" id=" '+opt.name[0]+' "> </b>'),
            showCity      = $('<b class="zn_showArea" id=" '+opt.name[1]+' "> </b>'),
            showCountry   = $('<b class="zn_showArea" id=" '+opt.name[2]+' "> </b></span>'),
            arrow         = $('<i style="font-style:normal;" class="trans arrow"> ▲ </i>'),
            areaContent   = $('<div class="zn_areaContent"></div>'),  //下拉区域
            province      = $('<input type="hidden" value="'+opt.val[0]+'" name="'+opt.name[0]+'" />'), //input
            city          = $('<input type="hidden" value="'+opt.val[1]+'" name="'+opt.name[1]+'" />'), //input
            country       = $('<input type="hidden" value="'+opt.val[2]+'" name="'+opt.name[2]+'" />'), //input
            tab           = $('<div class="zn_title"></div>'),
            tabTitle      = $('<a class="act" href="javascript:">选择省份</a><a href="javascript:">选择市</a><a href="javascript:">选择区</a>'),
            tabCont       = $('<ul class="zn_cont"></ul>'),
            tabLiProvince = $('<li class="tabLiProvince act"> 请选择省份 </li>'),
            tabLiCity     = $('<li class="tabLiCity"> 请选择市 </li>'),
            tabLiCountry  = $('<li class="tabLiCountry"> 请选择区 </li>'),
            tabClose      = $('<span class="zn_close">×</span>');
        areaContent.append(tab.append(tabTitle, tabCont.append(tabLiProvince, tabLiCity, tabLiCountry)), tabClose); //内容区域添加表单元素-显示标题-和区域内容
        $t.html(showName) //默认显示名称
            .append(province, city, country, areaContent, showProvince,showCity,showCountry,arrow);
        //编辑状态====
        tabLiProvince.html($t.ajax_get_area()); //默认获得省数据  opt.val[0]

        if(opt.val[0]) { // 省编辑状态
            showName.text('');
            tabLiProvince.areaEdit(showProvince,opt.val[0]);
            tabLiCity.html($t.ajax_get_area(opt.val[0]));
            setTimeout(function(){
                tabLiCity.areaEdit(showCity,opt.val[1]);
            },1000);

        }

        if(opt.val[1]) { // 市编辑状态
            tabLiCountry.html($t.ajax_get_area(opt.val[1]));
            setTimeout(function(){
                tabLiCountry.areaEdit(showCountry,opt.val[2]);
            },1000);
        }

        //点击事件
        tabLiProvince.add(tabLiCity).add(tabLiCountry).on('click',function(e) {
            var $_t = $(this), $e = $(e.target), id = $e.attr('id'), txt = $e.text(), cname = $e.parent()[0].className;
            if(showName.text('')) showName.text('');
            $e.addClass('act').siblings().removeClass('act'); //选中a标签
            tabTitle.eq($e.parent().index()+1).addClass('act').siblings().removeClass('act'); //省市区名称变化

            if(cname.indexOf('tabLiProvince')!=-1) { //省市点击
                $e.parent().next().html($t.ajax_get_area(id)).show().siblings().hide(); //下级添加数据
                showProvince.text(txt).next().text('').next().text('');
                province.val(id); //隐藏域赋值
                country.add(city).val('');
                opt.pfn(id); //选中省后回调
            }else if(cname.indexOf('tabLiCity')!=-1){ //市点击
                $e.parent().next().html($t.ajax_get_area(id)).show().siblings().hide(); //下级添加数据
                showCity.text(txt).next().text('');
                city.val(id);
                country.val('');
                opt.cfn(id); //选中市后回调
            }else if(cname.indexOf('tabLiCountry')!=-1){ //区点击
                country.val(id);
                areaContent.hide(); //隐藏选择区域
                showCountry.text(txt);
                opt.afn(id); //选中区后回调
            }
        });


        //下拉菜单+tab切换+关闭事件
        $t.hover(function(){
            areaContent.show();
            arrow.text(' ▼ ');
        },function(){
            areaContent.hide();
            arrow.text(' ▲ ');
        });
        tabTitle.on('click', function(){
            $(this).addClass('act').siblings().removeClass('act');
            tabCont.find('li').eq($(this).index()).show().siblings().hide();
            return false;
        });
        tabClose.on('click', function(){ areaContent.hide(); });
    };


    $.fn.areaEdit = function(show, val) { //显示默认值
        $(this).find('a').each(function(){
            if($(this).attr('id') == val){
                $(this).addClass('act');
                show.text($(this).text());
            };
        });
    }
})(jQuery);

//jqzoom
$(function(){

    try{
        $(".jqzoom").imagezoom({xzoom: 612, yzoom: 440, offset: 22});
        $("#thumblist li a").click(function(){
            $(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
            $(".jqzoom").attr('src',$(this).find("img").attr("mid"));
            $(".jqzoom").attr('rel',$(this).find("img").attr("big"));
        });
        $(".tb-booth a").click(function(){
            return false;
        })
    }catch(e){

    }

});

//jqzoom xhy
!(function($){

    $(function(){
        $.fn.jqzoom_xhy();
    })

    $.fn.jqzoom_xhy = function(opt){

        var option = {
            scrollLeft : '.scroll-left',
            scrollRight : '.scroll-right',
            scrollPx : 78,
            showLength : 5,
            scrollUl : '#thumblist'
        };

        //ul 下的第1个li元素

        var target = $('#thumblist').find('li:eq(0)');
        var scrollLength = $(option.scrollUl).find('li').length > option.showLength ? $(option.scrollUl).find('li').length - option.showLength : 0;

        var setOption = function(){
            option = $.extend(option, opt);
        }

        var getMarginleftPx = function(){
            var target = $("#thumblist").find('li:eq(0)');
            var marginLeft = target.css('margin-left');
            return marginLeft;
        }
        var scrollLeft = function(){
            $(option.scrollLeft).on('click', function(){

                var marginLeft = getMarginleftPx();
                marginLeft =  parseFloat(marginLeft);
                if( Math.abs( marginLeft / option.scrollPx ) == scrollLength){
                    return false;
                } else{
                    target.css({'margin-left': (marginLeft - option.scrollPx)+'px'});
                }

                scrollBottonDispay();
            })
        }
        var scrollRight = function(){
            $(option.scrollRight).on('click', function(){
                var marginLeft = getMarginleftPx();
                marginLeft = parseFloat(marginLeft);
                if(marginLeft / option.scrollPx == 0)
                    return false;
                else{
                    target.css({'margin-left': (marginLeft + option.scrollPx)+'px'});
                }

                scrollBottonDispay();
            })
        }
        var scrollBottonDispay = function(){
            var marginLeft = getMarginleftPx();
            marginLeft = parseFloat(marginLeft);

            var scrollNumber = marginLeft / option.scrollPx;
            scrollNumber = parseInt(scrollNumber);
            scrollNumber = Math.abs(scrollNumber);
            if(scrollNumber === 0){
                $(option.scrollRight).addClass("disabled")
            }else{
                $(option.scrollRight).removeClass("disabled");
            }

            if( Math.abs( scrollNumber ) == scrollLength ){
                $(option.scrollLeft).addClass("disabled")
            }else{
                $(option.scrollLeft).removeClass("disabled")
            }
        }
        var init = function(){
            setOption();
            scrollLeft();
            scrollRight();
            scrollBottonDispay();
        }

        init();
    }
})(jQuery);

//轮播插件
!(function(){
    //轮播控件
    //e.g: <div class="x_slider2"data-items = '[{"img":"http://jike.com/upload/prize_goods/1467988311.jpg","href":"javascript:void(0)"}]' style="width:700px; height:300px; border:1px solid gray;"></div>
    //加上初始化js: $.x_slider({wrap_class : '.x_slider'})
    $.x_slider = function(option){
        var opt = {
            wrap_class : '.x_slider',
            width : 30,
            active_index : 0
        };

        var timer;
        var exports={};
        opt = $.extend(opt, option);
        if($(opt.wrap_class).length < 1){
            console.log(opt.wrap_class+"不存在")
            return false;
        }

        var init = function(){

            //配置选项
            exports.option = opt;
            //总包容层
            exports.wrapper = $(opt.wrap_class);
            exports.wrapper.items = $.parseJSON((exports.wrapper).attr('data-items'));
            console.log(exports.wrapper.items)
            exports.option.width =exports.wrapper.css('width')
            exports.option.height =exports.wrapper.css('height')
            //wrap 按钮
            exports.wrapper.btns = $('<ul class="x_btns">');
            //wrap 内容
            exports.wrapper.cont = $('<ul class="x_content">');
            initItems(exports.wrapper.cont, exports.wrapper.items)
            initBtns(exports.wrapper.btns, exports.wrapper.items)

            exports.wrapper.append(exports.wrapper.cont)
            exports.wrapper.append(exports.wrapper.btns)

            exports.wrapper.cont.find('img').css('width',exports.option.width)
            exports.wrapper.cont.find('img').css('height',exports.option.height)

            initCss();
        }

        var initCss = function(){
            //设置样式
            exports.wrapper.css({position: 'relative',overflow: 'hidden'})
            exports.wrapper.btns.css({ position: 'absolute','z-index':20,'list-style-type' : 'none'})
            exports.wrapper.btns.find('li').css({
                width: '20px', height: '20px', background: '#eee', float:'left', margin: '3px 3px', 'text-align': 'center',cursor: 'pointer'
            })
            exports.wrapper.cont.find('li').css({
                'z-index': '1',
                'float': 'left'
            })
            exports.wrapper.cont.css({
                position: 'relative',
                'z-index': '1',
                'list-style-type' : 'none',
                width: '9999px',
                margin:'0',
                padding:0
            })

        }

        var initItems = function(cont, items){
            //初始化内容项
            for(var i in items){
                cont.append("<li><a href='"+items[i].href+"' target='_blank'><img src='"+items[i].img+"' /></a></li>")
            }
        }
        var initBtns = function(cont, items){
            //初始化按钮
            for(var i in items){
                cont.append("<li>  </li>")
            }
        }
        var afterInit = function(){
            //初始化完成后 1.轮播到指定的项
            slideToCurrent(exports.option.active_index);
            console.log(exports.option.active_index)
            //2.激活事件监听
            eventBtnListen();
        }
        var eventBtnListen = function(){
            //总长度
            exports.wrapper.btns.find('li').each(function(index,index2){
                $(this).click(function(){
                    slideToCurrent(index)
                })
            })
        }

        //定时滚动
        timer = setInterval(function(){

            exports.option.active_index = exports.option.active_index < exports.wrapper.btns.find('li').length-1 ? exports.option.active_index+1 : 0;
            slideToCurrent(exports.option.active_index)
        }, 4000)

        var slideToCurrent = function(index){
            //轮播动画
            exports.option.active_index = index;
            var left = -parseFloat(exports.option.width) * exports.option.active_index;
            exports.wrapper.cont.animate({
                left : left
            },500)

            exports.wrapper.btns.find('.active').removeClass('active');
            exports.wrapper.btns.find('li:eq('+exports.option.active_index+')').addClass('active')

        }

        init();
        afterInit();

        return exports;
    }
})(jQuery)


/**
 * 多地区选择
 * @author fangf
 */
function MultiRegionPicker(opt) {
    this.init(opt);
}
MultiRegionPicker.prototype = {
    constructor : MultiRegionPicker,
    init : function(opt) {
        this.picker 	= opt.picker;
        this.displayer 	= opt.displayer;
        this.regionName = opt.regionName;
        this.btn        = opt.btn;

        this.$picker 	= $(this.picker);
        this.$displayer = $(this.displayer);
        this.$btn 		= $(this.btn);

        var that 		= this;

        this.$picker.click(function(e){that.clickController(e);return false;});
        this.$btn.   click(function(){

            //console.log(that.$picker);
            //that.$picker.toggle();
            $('.area_picker_content').toggle();
            return false;
        });
        $('body').   click(function(){that.$picker.hide();});
    },
    /**
     * 对单击事件进行判断，分发
     */
    clickController : function(e) {

        var target  = e.target,$target = $(target),_this   = this;

        if (target.className.indexOf('unfile') !== -1) { 		// 弹出框事件
            $target.closest('ul').find('ul:visible').addClass('dn').end().find('.light').removeClass('light');
            $target.siblings('ul').children('.line').width($target.parent().width()-4);

            if($target.parent().parent().attr('class').indexOf('city abs fix')!=-1){
                $target.siblings('ul').children('.line').width($target.parent().width()+5);
            }

            $target.parent().children('.dn').removeClass('dn').end().addClass('light');
            return false;
        }
        if (target.className.indexOf('root') !== -1) { 			// 全国单击事件
            if (target.className.indexOf('checked') == -1) {
                this.$picker.find('.uncheck').addClass('checked');
                this.$displayer.html('').append('<span class="r1"><input type="hidden" name="'+this.regionName+'[]" value="r1">全国</span>');
            } else {
                this.$picker.find('.uncheck').removeClass('checked');
                this.$displayer.find('.r1').remove();
            }
            return false;
        }

        if (target.className.indexOf('area_name') !== -1) { 	// 大区单击事件
            this._commonAction(target, '.area');
            this.rootUpdate(this.$picker);
            return false;
        }
        if (target.className.indexOf('province_name') != -1) {  // 省份单击事件
            this._commonAction(target, '.province');
            this.areaUpdate($target.closest('.area'));
            return false;
        }

        if (target.className.indexOf('city_name') !== -1) { 	// 城市单击事件
            $target.parent().siblings().find('ul.country:visible').addClass('dn').end().removeClass('light');
            this._commonAction(target, '.city_item');
            this.provinceUpdate($target.closest('.province'));
            return false;
        }

        if (target.className.indexOf('country_name') !== -1) {  // 县/区单击事件
            target.className.indexOf('checked') == -1 ? $target.addClass('checked'):$target.removeClass('checked');
            this.cityUpdate($target.closest('.city_item'));
            return false;
        }

        if (target.className.indexOf('city_item') !== -1 || target.className.indexOf('city') !== -1 || target.className.indexOf('country_item') !== -1 || target.className.indexOf('country') !== -1) {
            $target.closest('ul').find('ul').addClass('dn').end().find('.light').removeClass('light');
            return false;
        }
        this.$picker.find('ul.city, ul.country').addClass('dn').end().find('.light').removeClass('light');
        return false;
    },
    rootUpdate : function($root) {

        this._commonUpdate($root, '.area_name', '.root');
    },
    areaUpdate : function($root) {

        this._commonUpdate($root, '.province_name', '.area_name');
        this.rootUpdate(this.$picker);
    },

    provinceUpdate : function($root) {

        var checkedNum = 0;
        $root.find('.city_item .checkedNum').each(function(){	// 省下区/县 计数
            var n = this.innerHTML.match(/(\d+)/);
            checkedNum += n ? parseInt(n[1]) : 0;
        });
        $root.find('.city_name').each(function(){				// 省下市 计数
            $(this).hasClass('checked') && (checkedNum++);
        });
        checkedNum = !!checkedNum ? '('+checkedNum+')' : '';
        $root.children('.checkedNum').html('');

        this._commonUpdate($root, '.city_name', '.province_name');

        this.areaUpdate($root.closest('.area'));
    },

    cityUpdate : function($root) {

        var checkedNum = 0;
        $root.find('.country_name').each(function(){			// 市下区/县 计数
            $(this).hasClass('checked') && (++checkedNum);
        });
        checkedNum = !!checkedNum ? '('+checkedNum+')' : '';
        $root.children('.checkedNum').html('');

        this._commonUpdate($root, '.country_name', '.city_name');
        this.provinceUpdate($root.closest('.province'));
    },

    _commonAction : function(target, haystack) {
        var $target = $(target);
        var _this = this;
        if (target.className.indexOf('checked') == -1) {
            $target.closest(haystack).find('.uncheck').addClass('checked')
                .end().find('.checkedNum').html('');	//清除checkedNum,因为都选中了呀
            // reset
            $target.closest(haystack).find('.checked').each(function() {
                _this.$displayer.find('.' + this.id).remove();
            });
        } else {
            $target.closest(haystack).find('.uncheck').removeClass('checked');
        }
    },
    _commonUpdate : function($root, $needle1, $needle2) {
        var $list = $root.find($needle1);
        var total = $list.length;
        var checkedNum = 0;
        var that = this;

        $list.each(function() {
            $(this).hasClass('checked') && (++checkedNum);
            that.$displayer.find('.' + this.id).remove();
        });

        if (total === checkedNum) {
            $root.find($needle2).addClass('checked');

            //clear checkedNum
            !!$root.children('.checkedNum').length && $root.children('.checkedNum').html('');

            !this.$displayer.find('.r1').length && this.$displayer.append('<span class="r1"><input type="hidden" name="'+that.regionName+'[]" value="r1">全国</span>');
        } else {
            $root.find($needle2).removeClass('checked');
            !!this.$displayer.find('.r1').length && this.$displayer.find('.r1').remove();
            $list.each(function() {
                var id = this.id, name = this.innerHTML;
                $(this).hasClass('checked')
                && !that.$displayer.find('.' + this.id).length
                && that.$displayer.append('<span class="'+id+'"><input type="hidden" name="'+that.regionName+'[]" value="'+id+'">' + name + ',&nbsp;</span>');
            });
        }
        if($root[0].className.indexOf('area_picker_content') !== -1){
            if(this.$displayer.find('span:last').length){
                //todo: 去除最后一个,
                //var html = this.$displayer.find('span:last').html().replace(/,&nbsp;/,'');
                //this.$displayer.find('span:last').html(html);
            }
        }
    }

};

