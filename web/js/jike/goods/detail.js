$(function(){

    $(".div_id").on('click', '.btn_one_prize', function(){

        var t = $(this)
        var prizeId = t.closest('.div_id').attr('data-prize_id');
        var url = $.fn.apihost + "/api/oneprize/prize";
        var data = {prize_id : prizeId, _csrf : $('#csrf_xhy').val()}

        $.ajax({
            url : url,
            data : data,
            dataType : 'json',
            type : 'post',
            success : function(json){

                if(json.status==1){

                    $('.playbtn-hide').attr('message', json.message);
                    $('.playbtn-hide').trigger('click');
                } else {
                    if(json.message == '您尚未登录,请先登录!'){
                        $.fn.showLoginModal();
                    } else {
                        $.x_say_x({cont : json.message ? json.message : "暂无抽奖活动!"});
                    }
                }
            }

        })

    })

    $.fn.updateProgress_xhy = function(){

        var timerUpdateProgress_xhy = setInterval(function(){
            if($.trim($('#join_number').html()) != '' && $.trim($('#left_number').html() != '')){

                clearInterval(timerUpdateProgress_xhy);

                numberJoin = $.trim($('#join_number').html());
                numberJoin = parseFloat(numberJoin);
                numberLeft = $.trim($('#left_number').html());
                numberLeft = parseFloat(numberLeft);
                $progressWidth = (numberJoin/(numberJoin+numberLeft))*parseFloat($('.progress_xhy_bg').width());

                $('.progress_xhy').width($progressWidth);
            }
        },300)
    }
    $.fn.updateProgress_xhy()
    $('#join_number,#left_number').change(function(){
        $.fn.updateProgress_xhy()
    })
})




//抽奖动画

$(function() {
    var $btn = $('.playbtn-hide');
    var clickfunc = function() {

        var data = [1, 2, 3, 4, 5, 6];
        //data为随机出来的结果，根据概率后的结果
        data = data[Math.floor(Math.random() * data.length)];
        switch(data) {
            case 1:
                rotateFunc(1, 0, '恭喜您获得2000元理财金!');
                break;
            case 2:
                rotateFunc(2, 60, '谢谢参与~再来一次吧~');
                break;
            case 3:
                rotateFunc(3, 120, '恭喜您获得5200元理财金!');
                break;
            case 4:
                rotateFunc(4, 180, '恭喜您获得100元京东E卡，将在次日以短信形式下发到您的手机上，请注意查收!');
                break;
            case 5:
                rotateFunc(5, 240, '谢谢参与~再来一次吧~');
                break;
            case 6:
                rotateFunc(6, 300, '恭喜您获得1000元理财金!');
                break;
        }
    }
    $btn.click(function() {

        /*
        //动画抽奖
        var $animater = $('<div class="g-content">  \
            <div class="g-lottery-case">  \
            <div class="g-left">  \
            <div class="g-lottery-box">  \
            <div class="g-lottery-img">  \
            <a class="playbtn" href="javascript:;" title="开始抽奖"></a> \
            </div> \
            </div> \
            </div> \
            </div> \
            </div>');

        $.x_say_m({'cont': $animater, time : 360000, size : [600, 550], btn:[]});
        clickfunc();return;*/


        //gif抽奖动画
        var animal = $.x_say_m({
            'cont':"<div><img src='/images/animal.gif?"+ new Date().getTime()  +"' /></div>",
            time : 2000,
            size : [600, 550],
            btn : [],
            contStyle : {padding: "35px 60px 40px 48px"},
            callback : function(){
                var message = $('.playbtn-hide').attr('message');
                if(message)
                    $.x_say_m({cont:message, time: 100000000, btn : []});
            }
        })

    });
    var rotateFunc = function(awards, angle, text) {
        $btn = $('.playbtn');
        $btn.stopRotate();
        $btn.rotate({
            angle: 0,
            duration: 4000, //旋转时间
            animateTo: angle + 1440, //让它根据得出来的结果加上1440度旋转
            callback: function() {

                //$('.x_say_wrapper').fadeOut();
                var message = $('.playbtn-hide').attr('message');
                if(message)
                    $.x_say_m({cont:message, time: 100000000, btn : []});
            }
        });
    };
});
