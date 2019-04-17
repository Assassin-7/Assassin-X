(function () {
    //模拟数据

    let data=localStorage.getItem('mlist')?JSON.parse(localStorage.getItem('mlist')):[];
// 搜索框的歌
    let searchdata=[];
    //获取元素
    let start=document.querySelector('.start');
    let audio=document.querySelector('audio');
    let songsinger=document.querySelector('.ctrl-bars-box span')
    let logoimg=document.querySelector('.logo img');
    let listBox=document.querySelector('.play-list-box ul');
    let idelete=document.querySelector('.play-list-box ul i');
    let list=document.querySelector('.play-list-box');
    let up=document.querySelector('footer .prev');
    let next=document.querySelector('footer .next');
     let nowtime=document.querySelector('footer .times .nowtime');
     let alltime=document.querySelector('footer .times .alltime');
    let  ctrlbars=document.querySelector('footer .ctrl-bars');
    let nowBars=document.querySelector('footer .nowBars');
    let ctrlbtn=document.querySelector('footer .ctrl-btn');
    let way=document.querySelector('footer .mode');
    let xian=document.querySelector('.info');
    let volume=document.querySelector('.volume');
    let volumes=document.querySelector('.volumes');
    let nowvolume=document.querySelector('.nowvolume');
     let voice=document.querySelector('.voice')
    //变量
    let f=true;//控制音量的显示和关闭
    let index=0;//那首歌

    let tiemr=null;//旋转的定时器
    let modenum=0;//播放模式  0顺序  -35  -346不变 1单曲 -69 -346    2随机

    //方法
    //加载播放列表
    function load() {
        let str='';//用来累计播放项
        if(data.length){
            for(var i=0;i<data.length;i++){
                str +='<li>'
                str+='<i>×</i>'
                str +='<span>'+ data[i].name +'</span>'
                str +='<span>';
                for (var j=0;j<data[i].ar.length;j++){
                    str +=data[i].ar[j].name+' ';
                }
                str +='</span>';
                str +='</li>'
            }
            listBox.innerHTML=str;
            songs();
        }

    }
    load();

//格式化时间
    function formattime(time) {
        return time>9 ? time :'0'+time;
    }
    //显示模式文字
    function xians(str){
        xian.style.display='block';
        xian.innerHTML=str;
        setTimeout(function () {
            xian.style.display='none';
        },2000);
    }
    //当前播放的歌曲
    function checkplay(){
        let plist=document.querySelectorAll('.play-list-box li');

        if(!plist.length==0){
            for(let i=0;i<data.length;i++){
                plist[i].className='';
            }

            plist[index].className = 'active';
        }


    };
    //显示几首歌
    function songs() {
        $('.play-list').html(data.length);
    }
    //递归函数 不重复
    function get() {
        let random=Math.floor(Math.random()*data.length);
        if (random==index){
            random=get();
        }
        return random
    }
    //初始化播放
    function init(){

        //给audio设置播放路径
        clearInterval(tiemr);
        checkplay();
        load();
        if(!data.length==0) {
            var str='';
            audio.src = 'http://music.163.com/song/media/outer/url?id='+ data[index].id +'.mp3';
            str+=data[index].name+'-';
            for (var j=0;j<data[index].ar.length;j++){
                str+=data[index].ar[j].name+' ';
            }
            songsinger.innerHTML = str;
            logoimg.src = data[index].al.picUrl;
        }
    };
    //播放音乐
    function  plays() {
        let deg=0;//记录旋转角度
        audio.play();
        tiemr= setInterval(function () {

            deg++;
            logoimg.style.transform='rotate('+deg+'deg)';
        },30)
        start.style.backgroundPositionY='-165px'
    };
   init();
//播放和暂停
    start.addEventListener('click',function () {
        if(audio.paused){
           plays();
        }else{
            clearInterval(tiemr);
            audio.pause();
            start.style.backgroundPositionY='-204px'
        }
    });
    //上一首、下一首
    up.addEventListener('click',function () {
         index--;
         index= index<0 ? data.length-1:index;
         init();
        plays();
    });
    next.addEventListener('click',function () {

        index++;
        index= index>3 ? 0:index;
        init();
        plays();
    });
    //显示歌曲时间
   audio.addEventListener('canplay',function () {
       let num=audio.duration;
       let min=parseInt(num/60);
       let s=parseInt(num%60);
       alltime.innerHTML=formattime(min)+':'+formattime(s);
   });
   //音乐进度条
   audio.addEventListener('timeupdate',function () {
       let num=audio.currentTime;
       let min=parseInt(num/60);
       let s=parseInt(num%60);
       nowtime.innerHTML=formattime(min)+':'+formattime(s);
       let barwidth=ctrlbars.clientWidth;
       let nowwidth=num/audio.duration *barwidth;
       nowBars.style.width=nowwidth+'px';
       ctrlbtn.style.left=nowwidth-8+'px';
       if(audio.ended){
           switch (modenum){
               case 0:
                   next.click();
                   break;
               case  1:
                   init();
                   plays();
                   break;
               case  2:
                   index=get();
                   init();
                   plays();
                   break;
           }
       }

   });
   //进度条挑歌
    ctrlbars.addEventListener('click',function (e) {
        audio.currentTime=e.offsetX/ctrlbars.clientWidth * audio.duration;
    });
    //播放模式切换
    way.addEventListener('click',function () {
        modenum++;
        modenum = modenum>2 ? 0:modenum;
        switch(modenum){
            case 0:
                xians('顺序播放');
                way.style.backgroundPositionY='-346px';
                way.style.backgroundPositionX='-35px';
                break;
            case 1:
                xians('单曲循环');
                way.style.backgroundPositionY='-346px';
                way.style.backgroundPositionX='-69px';
                break;
            case 2:
                xians('随机播放');
                way.style.backgroundPositionY='-250px';
                way.style.backgroundPositionX='-68px';
                break;
        }
    });
  //调音量
    volumes.addEventListener('click',function (e) {
        nowvolume.style.height=volumes.clientHeight-e.offsetY+'px';
        volume.style.bottom=volumes.clientHeight-e.offsetY-5+'px';
       audio.volume=nowvolume.clientHeight/volumes.clientHeight;
    });
   //显示音量
    voice.addEventListener('click',function () {
       if(f){
          f=!f;
          volumes.style.display='block';
       } else {
           f=!f;
           volumes.style.display='none';
       }
    });
    //播放列表点击播放---jquery
    $(listBox).on('click','li',function () {
        index=$(this).index();
        init();
        plays();
    });
    //播放列表点击播放---原生js;
    /*listBox.addEventListener('click',function (e) {
        let e1=e.target;
        if(e1.tagName==='SPAN'){
            e1=e1.parentNode;
        }
        index=e1.index();
    });*/
    //搜歌
    $('.search').on('keydown',function (e) {
        if(e.keyCode===13){
            $.ajax({
                //服务器地址
                url:'https://api.imjad.cn/cloudmusic/',
                //参数
                data:{
                    type:'search',
                    s:this.value
                },
                success:function (data) {
                    /*console.log(data.result.songs[0].ar);*/
                    searchdata= data.result.songs;
                    let str ='';
                    for (var i=0;i<searchdata.length;i++){
                        str+='<li>';
                        str+='<span class="left song">';
                        str+=searchdata[i].name;
                        str+='</span>';
                        str+='<span class="right singer">';
                        for (var j=0;j<searchdata[i].ar.length;j++){
                            str+=searchdata[i].ar[j].name+' ';
                        }
                      str+='</span>';
                      str+='</li>';

                    }
                    $('.searchlist').html(str);
                },
                error:function (err) {
                    console.log(err);

                }
            });//里面的是对象
            this.value='';
        };

    });
    //点击播放搜索框里面的歌曲
    $('.searchlist').on('click','li',function () {
       data.push(searchdata[$(this).index()]) ;
       localStorage.setItem('mlist',JSON.stringify(data));
        load();
       index=data.length-1;
       init();
       plays();

    });
    let flag=false;
    //显示隐藏播放列表
    $('.play-list').on('click',function () {
        flag=!flag;
        if(flag){
            list.style.display='block';
        }else {
            list.style.display='none';
        }
    });
    //删除
    $(listBox).on('click','i',function (e) {
        data.splice($(this).parent().index(),1);
        localStorage.setItem('mlist',JSON.stringify(data));
        load();
        songs();
        e.stopPropagation();
    });
})();