/**
 * Created by IBM on 2015/3/31.
 * 灯箱演示
 * @author yanglang
 */
require.config({
    baseUrl: './lib',
    paths: {
        'jquery':'jquery-1.8.3.min',
        'domReady':'domReady-2.0.1',
        'jquery.mousewheel':'jquery.mousewheel',
        'lightbox':'lightbox'
    },
    shim: {
        'jquery.mousewheel':['jquery'],
        'lightbox':['jquery','jquery.mousewheel']
    },
    waitSeconds:0
});


var transformSupport = false;
require(['domReady', 'jquery','lightbox'], function (doc, $,lightbox) {
    alert(1)
    var supports = (function() {
        var div = document.createElement('div'),
            vendors = 'Khtml O Moz Webkit'.split(' '),
            len = vendors.length;
        return function(prop) {
            if ( prop in div.style ) return true;
            if ('-ms-' + prop in div.style) return true;
            prop = prop.replace(/^[a-z]/, function(val) {
                return val.toUpperCase();
            });
            while(len--) {
                if ( vendors[len] + prop in div.style ) {
                    return true;
                }
            }
            return false;
        };
    })();
    transformSupport = supports('transform')&&supports('transition');

    Project.initPictureScroll(lightbox);

});

var Project = {
    /**
     * 初始化第三个签下的 影像资料 幻灯片
     * @param lightbox 灯箱模块插件
     */
    initPictureScroll:function(lightbox){
        var that = this;
        var $ul = $('#picScroll>ul').attr('left',0);
        $ul.width(158*$('li',$ul).length+100);
        var count = $('li',$ul).length;//计算总图片数
        //若总数小于等于5 不需要滚动
        if(count<=5){
            $('#prev,#next').addClass('disabled');
            return;
        }
        //绑定下一张图片按钮事件
        $('#next').click(function(){
            var left;
            if(transformSupport){
                left = parseInt($ul.attr('left'),10);
                if((-left+795)>=count*148)
                    return;
                $ul.css({
                    'transform':'translate3d('+(left-158)+'px,0,0)',
                    '-webkit-transform':'translate3d('+(left-158)+'px,0,0)',
                    '-o-transform':'translate3d('+(left-158)+'px,0,0)',
                    '-moz-transform':'translate3d('+(left-158)+'px,0,0)'
                }).attr('left',left-158);
            }else{
                if($ul.is(':animated'))
                    return;
                left = parseInt($ul.css('left'),10);
                if((-left+795)>=count*148)
                    return;
                $ul.animate({'left':left-158},function(){
                    that.changeScrollBtnStatus($ul,count);
                });
            }

        });
        //绑定前一张图片按钮事件
        $('#prev').click(function(){
            var left;
            if(transformSupport){
                left = parseInt($ul.attr('left'),10);
                if(left == 0)
                    return;
                $ul.css({
                    'transform':'translate3d('+(left+158)+'px,0,0)',
                    '-webkit-transform':'translate3d('+(left+158)+'px,0,0)',
                    '-o-transform':'translate3d('+(left+158)+'px,0,0)',
                    '-moz-transform':'translate3d('+(left+158)+'px,0,0)'
                }).attr('left',left+158);
            }else {
                if ($ul.is(':animated'))
                    return;
                left = parseInt($ul.css('left'), 10);
                if (left == 0)
                    return;
                $ul.animate({'left': left + 158}, function () {
                    that.changeScrollBtnStatus($ul, count);
                });
            }
        });

        //绑定图片的点击事件 调用 灯箱模块 进行处理
        $ul.on('click','li',function(){
            var that = this;

            lightbox.lightbox(function(){
                var array = [];
                $('img',$ul).each(function(){
                    array.push($(this).attr('src'));
                });
                return array;
            }(),$(this).index(),{
                left:function(){
                    return $(that).offset().left-$(window).scrollLeft();
                }(),
                top:function(){
                    return $(that).offset().top-$(window).scrollTop();
                }(),
                width:$(this).width(),
                height:$(this).height()
            });
        });

    },
    /**
     * 修改灯箱左移右移按钮状态
     */
    changeScrollBtnStatus:function($ul,count){
        var left = parseInt($ul.css('left'),10);
        $('#prev,#next').removeClass('disabled');
        if(left == 0){
            $('#prev').addClass('disabled');
        }
        if((-left+795)>=count*148){
            $('#next').addClass('disabled');
        }
    }
};

