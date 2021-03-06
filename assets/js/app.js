const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songImg = $(".player--song__image");
const songName = $(".player--infor__name");
const songSinger = $(".player--infor__singer");
const audio = $("#audio");
const timeLimit = $(".player-time__end");
const btnNext = $(".icon_next");
const btnPre = $(".icon_previous")
const btnRandom = $(".icon_random")
const btnReload = $(".icon_reload")
const playBtn = $(".icon_play");
const pauseBtn = $(".icon_pause");
const playlist = $('.playlist');

const PLAYER_STORAGE_KEY = "F8 PLAYER";
const app = {
    
    currentIndex : 0,
    isRandom : false,
    isRepeat : false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
    {
        name: "Hold on",
        singer: "Justin Bieber",
        time : "2:50",
        path: "assets/music/hold-on.mp3",
        image: "assets/img/hold-on.jpg",
        roll_number: "01"
    },
    {
        name: "Peaches",
        singer: "Justin Bieber, Daniel Caesar, Giveon",
        time : "3:18",
        path: "assets/music/Peaches.mp3",
        image: "assets/img/peaches.png",
        roll_number: "02"
    },
    {
        name: "Calling My Phone",
        singer: "Lil Tjay, 6LACK",
        time : "3:25",
        path: "assets/music/call.mp3",
        image: "assets/img/calling.jpg",
        roll_number: "03"
    },
    {
        name: "Watermelon Sugar",
        singer: "Harry Styles",
        time : "2:54",
        path: "assets/music/wtmelon.mp3",
        image: "assets/img/watermelon.jpg",
        roll_number: "04"
    },
    {
        name: "Say so",
        singer: "Doja Cat",
        time : "3:57",
        path: "assets/music/sayso.mp3",
        image: "assets/img/say-so.jpg",
        roll_number: "05"
    },
    {
        name: "I see red",
        singer: "Everybody Loves An Outlaw",
        time : "3:50",
        path: "assets/music/red.mp3",
        image: "assets/img/red.jpg",
        roll_number: "06"
    }
],
    setConfigs: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },
    // render array song then inner to HTML
    render : function(){
        const htmls = this.songs.map((song,index) =>{
            return  `
                <div class="playlist__item ${index === this.currentIndex ? 'active' : ''} "data-index = "${index}">
                <div class="playlist__song__rollNumber">${song.roll_number}</div>
                <img
                    src="${song.image}"
                    alt=""
                    class="playlist__song__image"
                />
                <div class="playlist__song__content">
                <h4>${song.name}</h4>
                <h5>${song.singer}</h5>
                </div>
                <div class="playlist__song__icon">
                <i class="fas fa-ellipsis-h song_icon"></i>
                </div>
            </div>
            `;
        });
       playlist.innerHTML = htmls.join("");
    },

    // define thu???c t??nh currentSong

    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get : function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    // x??? l?? s??? ki???n 
    handleEvent:function(){
        const _this = this;
        // thu nh??? dashboard
        //const dashboard = $('.player--song__banner')
        const dashboard = document.querySelector(".player--song__image");
        const cdWidth = dashboard.offsetWidth ;
        const cdHeight = dashboard.offsetHeight;
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            const newHeigh = cdHeight  - scrollTop;
            dashboard.style.width = newWidth > 0 ? newWidth + "px" : 0
            dashboard.style.height = newHeigh > 0 ? newHeigh + "px" : 0
            dashboard.style.opacity = newWidth / cdWidth; 
        }

        // nh???n button play, pause
       
        playBtn.onclick = function(){
            audio.play();
            
        };
        pauseBtn.onclick = function(){
            audio.pause();
            
        }
        // khi song play
        audio.onplay = function(){
            playBtn.style = `display: none`;
            pauseBtn.style = `display : block`;
        }
        // khi song pause
        audio.onpause = function(){
            playBtn.style = `display: block`;
            pauseBtn.style = `display : none`;
        }
        
        // khi ti???n ????? b??i h??t thay ?????i
        const progress = $(".player__handle__progress-percent");
        const timeStart = $(".player-time__start");
        var item = this.currentSong.time.split(":");
        var totalTime = parseInt(item[0]) * 60 + parseInt(item[1]);

            //function convert second to minute second
            function convertSecond(second){
                var minutes = Math.floor(second / 60);
                    var seconds = Math.floor(second % 60);
                    var secondFormat = "0";
                    if(seconds >= 0 && seconds <=9){
                        secondFormat = secondFormat + seconds.toString();
                    }
                    else{
                        secondFormat = seconds
                    }
                    if(minutes == 0){
                        minutes = "00";
                    }
                    return minutes + ":" + secondFormat;
            }

        // cho text time ch???y theo b??i h??t
        audio.ontimeupdate = function(){
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = `${progressPercent}%`;
                var timeFormat = convertSecond(audio.currentTime)
                timeStart.innerHTML = timeFormat;
        }
        

        const progressParent = $(".player__handle__progress");
        //tua nh???c
        progressParent.onclick = function(e){
            var width = progressParent.offsetWidth;
            var position = e.offsetX;
            const duration = audio.duration;
            audio.currentTime = (position / width) * duration;
        }

        

        //next b??i h??t
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
        }


        // l??i b??i h??t 
        btnPre.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.previousSong();
            }
            audio.play();
            _this.render();
            
        }

        // option random b??i h??t ch???n

        btnRandom.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfigs("isRandom",_this.isRandom);
            if(_this.isRandom){
                btnRandom.style.color = `#dc93c9`;
            }
            else{
            btnRandom.style.color = `#000`;
            }
        }

        // option reload b??i h??t ???? ch???n
        btnReload.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfigs("isRepeat",_this.isRepeat);
            if(_this.isRepeat){
                btnReload.style.color = `#dc93c9`;
            }
            else{
                btnReload.style.color = `#000`;
            }
        }

        // auto sang b??i h??t m???i khi h???t b??i

        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                btnNext.click();
            }
        }

        // l???ng nghe s??? ki???n click v??o playlist
        playlist.onclick = function(e){
            const songItem = e.target.closest('.playlist__item:not(.active)');
            if(songItem || e.target.closest('.song_icon')){
                //x??? l?? khi click v??o song
                if(songItem){
                    _this.currentIndex = parseInt(songItem.dataset.index); // d??ng dataset thay cho getAttribute (?????t t??n class data-index)
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                //x??? l?? khi click v??o song option
                if(e.target.closest('.song_icon')){

                }
            }
        }
    }
    
    ,

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    }
    ,
    previousSong :function(){
        this.currentIndex--;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length-1;
        }
        
        this.loadCurrentSong();
    },

    playRandomSong : function(){
        var newIndex ;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    }
    ,


    loadConfig : function(){
        //Object.assign(this,this.config);
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    }
    ,
    // load b??i h??t hi???n t???i

    loadCurrentSong : function(){
        
        songImg.src = this.currentSong.image;
        songName.textContent = this.currentSong.name;
        songSinger.textContent = this.currentSong.singer;
        audio.src = this.currentSong.path;
        timeLimit.textContent = this.currentSong.time;
    }
    
    ,
    
    start : function(){

        // g??n c???uhinf
        this.loadConfig();

        //?????nh ngh??a  c??c thu???c t??nh cho object
        this.defineProperties();

        // l???ng nghe v?? x??? l?? c??c s??? ki???n
        this.handleEvent();
        
        //t???i th??ng tin b??i h??t khi ch???y UI
        this.loadCurrentSong();

        // render  playlist
        this.render();
        
    }

};
app.start();