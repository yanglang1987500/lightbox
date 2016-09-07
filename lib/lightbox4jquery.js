/**
 * Created by yanglang on 2015/4/1.
 * 全屏查看图片 灯箱模块
 * @author yanglang
 */
(function($){
        var $box,$wrap,$img,$mask,imgFocus = false,ratio=false,initRect = null,initIndex = 0,index = 0,
            html = '<div class="lightbox" onselectstart="return false">' +
                '<div class="pictureWrap shadow"><img src=""/><span class="close"></span>' +
                '</div>' +
                '<span class="prev"></span>' +
                '<span class="next"></span>' +
                '<span class="tip">小提示：您可以使用鼠标滚轮切换与缩放图片，单击图片以激活缩放功能。</span>' +
                '<span class="message"></span></div>';
        /**
         * 重新计算图片大小
         * @param img
         */
        var calImg = function(img){
            var $img = $(img),tempImage = new Image();
            tempImage.onload = function() {
                //获取当前窗口容许图片显示的最大宽高值
                var winWidth = $(window).width(),winHeight = $(window).height(),maxWidth = winWidth*80/100,maxHeight = winHeight*95/100,
                    wrapWidth = $wrap.width();
                //若图片大小大于阈值 则调整大小
                var rect = {
                    width:tempImage.width,
                    height:tempImage.height
                };
                if(tempImage.height>maxHeight || tempImage.width> maxWidth)
                    rect = resizeImg(img,maxWidth,maxHeight,tempImage.width,tempImage.height);
                //重置包裹层大小与位置
                if($.browser.msie && parseInt($.browser.version,10)<10){
                    $wrap.removeClass('shadow').stop().animate({
                        'margin-top':(-rect.height/2)+"px",
                        'margin-left':(-rect.width/2)+"px",
                        width:rect.width+"px",
                        height:rect.height+"px",
                        left:'50%',
                        top:'50%'
                    },function(){
                        $wrap.addClass('shadow');
                        //调整左右按钮位置
                        $('.prev',$box).animate({'left':(winWidth-wrapWidth)/4+"px"});
                        $('.next',$box).animate({'right':(winWidth-wrapWidth)/4+"px"});
                    });
                }else{
                    $wrap.css({
                        'margin-top':(-rect.height/2)+"px",
                        'margin-left':(-rect.width/2)+"px",
                        width:rect.width+"px",
                        height:rect.height+"px",
                        left:'50%',
                        top:'50%'
                    });
                    //调整左右按钮位置
                    $('.prev',$box).css({'left':(winWidth-rect.width)/4+"px"});
                    $('.next',$box).css({'right':(winWidth-rect.width)/4+"px"});
                }

                $img.css({
                    width:'100%',
                    height:'100%'
                });
            };
            tempImage.src = $img.attr('src');
        };
        /**
         * resizeImg 重新调整图片大小
         * @param ImgD 图片dom对象
         * @param MaxWidth 最大宽值
         * @param MaxHeight 最大高值
         */
        var resizeImg = function(ImgD, MaxWidth, MaxHeight,width,height) {
            var image = new Image();
            image.src = ImgD.src;
            image.width = width;
            image.height = height;
            if (image.width > 0 && image.height > 0) {
                if (image.width / image.height >= MaxWidth / MaxHeight) {
                    return image.width > MaxWidth?{
                        width:  MaxWidth,
                        height: (image.height * MaxWidth) / image.width
                    }:{
                        width:  image.width,
                        height: image.height
                    };
                } else {
                    return image.height > MaxHeight?{
                        height:  MaxHeight,
                        width:(image.width * MaxHeight) / image.height
                    }:{
                        width:  image.width,
                        height: image.height
                    };
                }
            }
        };

        var dragUtil = {
            drag:false,
            startFunc:function(e){
                var that = this;
                imgFocus = true;
                dragUtil.master = that;
                dragUtil.drag = true;
                //记录初始位置
                dragUtil.offsetX = parseFloat($img.css('left'),10);
                dragUtil.offsetY = parseFloat($img.css('top'),10);
                dragUtil.x = e.clientX;
                dragUtil.y = e.clientY;
                $(document).bind("mousemove", dragUtil.movingFunc).bind("mouseup",
                    dragUtil.endFunc).bind('selectstart',function(){return false});
            },
            endFunc:function(e){
                dragUtil.drag = false;
                e.cancelBubble = true;
                $(document).unbind("mousemove").unbind("mouseup").unbind('selectstart');
                return false;
            },
            movingFunc:function(e){
                if (dragUtil.drag) {
                    var top = e.clientY-dragUtil.y + dragUtil.offsetY;
                    var left = e.clientX - dragUtil.x+dragUtil.offsetX;
                    $img.css({
                        'left':left,
                        'top':top
                    });
                }
            }
        };

        var LightBox = {
            init:function(images,i,rect){
                var that = this;
                $mask = $('<div class="mask" onselectstart="return false"></div>').appendTo($('body'))
                    .css({opacity:0.7}).fadeIn(200);

                this.images = images;
                $box = $(html).appendTo($('body'));
                $wrap = $('.pictureWrap',$box);
                if($.browser.msie && parseInt($.browser.version,10)<9){
                    rect =null;
                }
                if(rect){
                    initRect = rect;
                    $wrap.css({
                        'margin-top':"0px",
                        'margin-left':"0px",
                        left:rect.left,
                        top:rect.top,
                        width:rect.width,
                        height:rect.height
                    });
                }
                $wrap.addClass('ani');
                $img = $('img',$box);
                index = i;
                initIndex = i;
                //1 绑定onload事件
                $img[0].onload = function() {
                    calImg(this);
                };
                $img.mousedown(function(e){
                    dragUtil.startFunc.apply(that,[e]);
                });
                //禁用浏览器自身的拖拽事件
                document.ondragstart = function () { return false; };
                //2 设置图片src属性
                //这两步不能颠倒，否则在IE低版本上会触发不了onload事件
                $img.attr('src',images[index]);
                //绑定上一张图片按钮事件
                $('.prev',$box).click(function(){
                    that.prevImage();
                });
                //绑定下一张图片按钮事件
                $('.next',$box).click(function(){
                    that.nextImage();
                });
                if(that.images.length == 1){
                    $('.prev,.next').hide();
                }
                $('.close',$box).click(function(){
                    that.close();
                });
                that.bindMouseWheelEvent();

                $box.click(function(){
                    imgFocus = false;
                });
                $img.click(function(){
                    imgFocus = true;
                    return false;
                });
                window.setTimeout(function(){
                    $img.dblclick(function(e){
                        if(ratio){
                            $img.animate({
                                left:0,
                                top:0,
                                width:$wrap.width(),
                                height:$wrap.height()
                            });
                            ratio = false;
                            imgFocus = false;
                        }else{
                            that.zoomInImage(e,2);
                        }
                        return false;
                    });
                    $wrap.dblclick(function(){
                        $img.animate({
                            left:0,
                            top:0,
                            width:$wrap.width(),
                            height:$wrap.height()
                        })
                    });
                    $('.close',$wrap).fadeIn();
                },500);

            },
            /**
             * 跳到下一张图片
             */
            nextImage:function(){
                if(index == this.images.length-1){
                    if($('.message',$box).is(':visible'))
                        return;
                    $('.message',$box).html('此图片已是最后一张').show();
                    window.setTimeout(function(){
                        $('.message',$box).hide();
                    },1200);
                    return;
                }
                if($img.is(':animated'))
                    return;
                var that = this;
                $img.css('left',0).css('top',0)
                    .attr('src',that.images[++index]);
                ratio = false;
            },
            /**
             * 跳到上一张图片
             */
            prevImage:function(){
                if(index == 0){
                    if($('.message',$box).is(':visible'))
                        return;
                    $('.message',$box).html('此图片已是第一张').show();
                    window.setTimeout(function(){
                        $('.message',$box).hide();
                    },1200);
                    return;
                }
                if($img.is(':animated'))
                    return;
                var that = this;
                $img.css('left',0).css('top',0)
                    .attr('src',that.images[--index]);
                ratio = false;
            },
            /**
             * 放大图片
             */
            zoomInImage:function(event,scale){
                var width, height, left, top, offsetLeft, offsetTop, wrapLeft, wrapTop, newLeft, newTop;
                if ($img.is(':animated') || (width = $img.width()) > 5000)
                    return;
                height = $img.height();
                left = parseFloat($img.css('left'), 10);
                top = parseFloat($img.css('top'), 10);
                offsetLeft = $img.offset().left;
                offsetTop = $img.offset().top;
                wrapLeft = $wrap.offset().left;
                wrapTop = $wrap.offset().top;
                newLeft = -((event.pageX - offsetLeft) / (width / 2 )) * (width * (scale ? (scale - 1) / 2 : .2)) + left;
                newTop = -((event.pageY - offsetTop ) / (height / 2)) * (height * (scale ? (scale - 1) / 2 : .2)) + top;
                $img.animate({
                    width: width * (scale ? scale : 1.4),
                    height: height * (scale ? scale : 1.4),
                    left: newLeft,
                    top: newTop
                }, 300);
                ratio = true;
            },
            /**
             * 缩小图片
             */
            zoomOutImage:function(event,scale){
                var width, height, left, top, offsetLeft, offsetTop, wrapLeft, wrapTop, newLeft, newTop;
                if ($img.is(':animated') || (width = $img.width()) < 200)
                    return;
                height = $img.height();
                left = parseFloat($img.css('left'), 10);
                top = parseFloat($img.css('top'), 10);
                offsetLeft = $img.offset().left;
                offsetTop = $img.offset().top;
                wrapLeft = $wrap.offset().left;
                wrapTop = $wrap.offset().top;
                newLeft = ((event.pageX - offsetLeft) / (width / 2 )) * (width * (scale ? (1 - scale) / 2 : .2)) + left;
                newTop = ((event.pageY - offsetTop ) / (height / 2)) * (height * (scale ? (1 - scale) / 2 : .2)) + top;
                $img.animate({
                    width: width * (scale ? scale : .6),
                    height: height * (scale ? scale : .6),
                    left: newLeft,
                    top: newTop
                }, 300);
                ratio = true;
            },
            mousedot : 0,
            bindMouseWheelEvent:function() {
                var that = this;
                $(document).bind('mousewheel', function(event, delta, deltaX, deltaY) {
                    that.mousedot += delta;
                    if(that.mousedot>2){
                        if(imgFocus){
                            //图片具有焦点（模拟） 则放大图片
                            that.zoomInImage(event);
                        }else{
                            //图片不具有焦点 则直接上下切换图片
                            that.prevImage();
                        }
                        that.mousedot = 0;
                    }else if(that.mousedot<-2){
                        if(imgFocus){
                            //图片具有焦点（模拟） 则缩小图片
                            that.zoomOutImage(event);
                        }else{
                            //图片不具有焦点 则直接上下切换图片
                            that.nextImage();
                        }
                        that.mousedot = 0;
                    }
                    return false;
                });
            },
            unbindMouseWheelEvent:function (){
                $(document).unbind('mousewheel');
                this.mousedot = 0;
            },
            /**
             * 关闭方法
             */
            close:function(){
                if(initRect && initIndex == index){
                    $('.close',$box).hide();

                    $img.animate({
                        left:0,
                        top:0,
                        width:'100%',
                        height:'100%'
                    },200);

                    if($.browser.msie && parseInt($.browser.version,10)<10){
                        $wrap.removeClass('shadow').animate({
                            'margin-top':"0px",
                            'margin-left':"0px",
                            left:initRect.left,
                            top:initRect.top,
                            width:initRect.width,
                            height:initRect.height
                        },function(){
                            $box.remove();
                        });
                    }else{
                        $wrap.removeClass('shadow').css({
                            'margin-top':"0px",
                            'margin-left':"0px",
                            left:initRect.left,
                            top:initRect.top,
                            width:initRect.width,
                            height:initRect.height
                        });
                        window.setTimeout(function(){
                            $box.remove();
                        },400);
                    }
                }else{
                    $box.fadeOut(200,function(){
                        $(this).remove();
                    });
                }

                $mask.fadeOut(200,function(){
                    $(this).remove();
                });
                this.unbindMouseWheelEvent();
                //启用浏览器自身的拖拽事件
                document.ondragstart = function () { return true; };
            }
        };
        $.lightbox = function(images,i,rect){
            LightBox.init(images,i,rect);
            return {
                images:[],
                nextImage:function(){
                    LightBox.nextImage();
                },
                prevImage:function(){
                    LightBox.prevImage();
                },
                close:function(){
                    LightBox.close();
                }
            };
        };

})(jQuery);


