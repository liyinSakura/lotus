$(function(){
  // 获取我的荷卡
  getCard();
  $('.js-lyr1-tigger').on('click',function(){
    $('.js-lyr1').fadeIn();
  })

  $('.js-close').on('click',function(){
      $('.js-lyr').fadeOut();
  })

  // 点击卡片
  $('body').on('click','.js-gift-tigger',function () {
    if ($(this).hasClass('disable')) {
      return false;
    }
    var style = $(this).css('background-image');
    var num = $(this).find('.js-num').html();
    var id = $(this).attr('data-id');
    $('.js-num-lg').html(num)
    $('.js-sendbtn').attr("data-id",id)
    $('.js-carditem-lg').css('background-image',style)
    $('.js-lyr2').fadeIn();
  })
  $('body').on('click','.js-newyear-tigger',function () {
    if ($(this).hasClass('disable')) {
      return false;
    }
    // var style = $(this).css('background-image');
    var num = $(this).find('.js-num').html();
    $('.js-num-lg').html(num)
    // $('.js-carditem-lg').css('background-image',style)
    $('.js-lyr3').fadeIn();
  })
  // 赠送卡片
  $('.js-sendbtn').on('click',function(){
    $(".js-share-mask1").show();
    // window.location.href = '/index/game/send?card_id='+$(this).attr('data-id')
  })
  // 向好友拜年
  $('.js-ny-link').on('click',function(){
      $(".js-share-mask").show();
  })
  // 关闭分享
  $('.share-mask').click(function(){
    $(this).hide()
  })
  // 合成窗花
  $('.js-mix').on('click',function(){
    $.get('/api/Compose/cardToPapercut',function(res){
      if (res.code == 200) {
        window.location.href = '/index/game/cardflip?token=' + res.token+"&act=papercut"
      } else if(res.code==301){
          layer.msg(res.msg,function(){
              location.href = "/index/user/address?type=1&act=papercut";
          });
      }else if(res.code!=301){
          layer.msg(res.msg)
      }
    },'json')
  })
  //合成年糕
  $('.js-cake').on('click',function(){
    $.get('/api/Compose/papercutToYearcake',function(res){
      if (res.code == 200) {
        window.location.href = '/index/game/cardflip?token='+res.token+"&act=yearcake"
      } else if(res.code==301){
          layer.msg(res.msg,function() {
              location.href = "/index/user/address?type=1&act=yearcake";
          })
      }else if(res.code!=301){
          layer.msg(res.msg)
      }
    },'json')
  })

  //合成中国结
  $('.js-knot').on('click',function(){
    $.get('/api/Compose/yearcakeToChineseknot',function(res){
      if (res.code == 200) {
        window.location.href = '/index/game/cardflip?token=' + res.token+"&act=chineseknot"
      } else if(res.code==301){
          layer.msg(res.msg,function() {
              location.href = "/index/user/address?type=1&act=chineseknot";
          })
      }else if(res.code!=301){
          layer.msg(res.msg)
      }
    },'json')
  })
  // 窗花兑奖
  $('.js-paper-reward').on('click',function(){
    $.get('/api/Prize/papercut',function(res){
      if (res.code == 200) {
        $('.js-lyr-paper').fadeIn()
        $('.js-msg').html(res.msg)
      }
      else if(res.code==301){
          layer.msg(res.msg,function() {
              location.href = "/index/user/address?type=2&act=papercut";
          })
      }
      else {
          layer.msg(res.msg)
      }
    },'json')
  })

  // 年糕兑奖
  $('.js-cake-reward').on('click',function(){
    $.get('/api/prize/yearcake',function(res){
      if (res.code == 200) {
        $('.js-lyr-cake').fadeIn();
        $('.js-msg').html(res.msg)
      }
      else if(res.code==301){
          layer.msg(res.msg,function() {
              location.href = "/index/user/address?type=2&act=yearcake";
          })
      }
      else {
          layer.msg(res.msg)
      }
    },'json')
  })

  // 中国结兑奖
  $('.js-knot-reward').on('click',function(){
    $.get('/api/prize/chineseknot',function(res){
      if (res.code == 200) {
        $('.js-lyr-knot').fadeIn()
        $('.js-msg').html(res.msg)
      }
      else if(res.code==301){
          layer.msg(res.msg,function() {
              location.href = "/index/user/address?type=2&act=chineseknot";
          })
      }
      else {
          layer.msg(res.msg)
      }
    },'json')
  })
})
function getCard(){
  $.get('/api/center/myCard',function(res){
    if (res.code == 200) {
      var data  = res.data;
      var htmlt = ''
      var htmlb = ''

      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var isNull = ''
        if (item.num == 0) {
          isNull = 'disable'
        }
        if (item.num >= 99) {
          item.num = 99;
        }
        if (item.type_id == '2') {
          htmlt += '  <div class="carditem js-gift-tigger '+isNull+'" style="background-image: url('+item.image+');" data-id="'+item.id+'"> <div class="card-num js-num">X'+item.num+'</div> <a href="javascript:;" class="card-gift ell">可赠送</a> </div>'

        }else if(item.type_id == '1') {
          htmlb += '  <div class="carditem js-gift-tigger '+isNull+'" style="background-image: url('+item.image+');" data-id="'+item.id+'"> <div class="card-num js-num">X'+item.num+'</div> <a href="javascript:;" class="card-gift ell">可赠送</a> </div>'
        }else {
          htmlb += '  <div class="carditem js-newyear-tigger '+isNull+'" style="background-image: url('+item.image+');" data-id="'+item.id+'"> <div class="card-num js-num">X'+item.num+'</div> <a href="javascript:;" class="card-gift ell">可兑换</a> </div>'
        }

      }
      $('.js-r-w').html(htmlt)
      $('.js-ssr-w').html(htmlb)
    }
  },'json')
}
