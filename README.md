# lightbox
这是一个灯箱组件，基于requirejs模块化定义。
提供多图浏览，针对CSS3特殊处理了动画流畅性；鼠标滚轮支持切换图片，支持缩放图片，支持拖拽图片，支持双击缩放还原图片。
使用方式如下：
require(['lightbox'], function(lightbox) {//引入灯箱模块
            //第一个参数为图片地址数组
            //第二个参数为初始显示第几张的索引值
            //第三个参数是位置对象，表示起始动画时的图片大小与位置
        		lightbox.lightbox(function(){
                    var array = [];
                    $('img',$ul).each(function(){
                        array.push($(this).attr('src'));
                    });
                    return array;
                }(),$(that).index(),{
                    left:function(){
                        return $(that).offset().left-$(window).scrollLeft();
                    }(),
                    top:function(){
                        return $(that).offset().top-$(window).scrollTop();
                    }(),
                    width:$(that).width(),
                    height:$(that).height()
            });
  });
