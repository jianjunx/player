/**
 * by Jsung 谢建军
 * 2017-7-22
 */

// 媒体对象控制类
class PlayControl {
	// 属性
	constructor(opt) {
		// 必要参数检测&抛出错误		
		if (!opt) throw new Error(`Error:参数错误，PlayControl构造函数需要传入opt对象，请参照说明文档！`)
		let errorTest = `media playPause curTime totalTime progressBox progressSeat progressSilder mainCdCover mediaCover mainPingBox volBox volSeat volSilder`.split(' ');
		errorTest.forEach((val) => {
			if (!opt[val]) throw new Error(`Error：参数错误，缺少 ${val} 参数，请查看说明文档补全参数！`)
		});
		// 混入属性
		for (let key in opt) {
			this[key] = opt[key]
		}
		this.flang = false;
		this.init()
	};
	// 方法
	// 播放方法
	_play() {
		this.media.play()
	}
	// 暂停方法
	_pause() {
		this.media.pause()
	}
	// 切换音乐方法
	songChange(url) {
		this.media.src = url;
		this._play()
	}
	// 播放进度的方法
	playLine() {
		let boxW = this.progressBox.offsetWidth,
			startX = 0,
			startCurr = 0,
			that = this;
		this.progressSilder.addEventListener('touchstart', (e) => {
			that._pause();
			startX = e.touches[0].clientX;
			startCurr = that.media.currentTime / that.media.duration * 100;
		});
		this.progressSilder.addEventListener("touchend", () => {
			that._play();
		})
		this.progressSilder.addEventListener("touchmove", e => {
			let step = (e.touches[0].clientX - startX) / boxW * 100;
			step = startCurr + step;
			if (step > 100) {
				return;
			} else if (step < 0) {
				return
			}
			that.progressSeat.style.width = step + "%";
			that.media.currentTime = (step / 100) * that.media.duration;
		});
	}
	// 音量调节；
	volLine() {
		let boxW = this.volBox.offsetWidth,
			startX = 0,
			startCurr = 0,
			that = this;
		this.media.volume = 0.5;
		this.volSeat.style.width = this.media.volume * 100 + "%"
		this.volSilder.addEventListener("touchstart", e => {
			startX = e.touches[0].clientX;
			startCurr = that.media.volume * 100;
		})
		this.volSilder.addEventListener("touchmove", e => {
			let step = (e.touches[0].clientX - startX) / boxW * 100;
			step = startCurr + step;
			if (step > 100) {
				return;
			} else if (step < 0) {
				return
			}
			that.volSeat.style.width = step + "%";
			that.media.volume = step / 100;
		})
	}
	// 播放结束触发的事件
	ended(calBack) {
		this.media.addEventListener('ended', e => {
			if (typeof (calBack) == 'function') calBack();
		});
	}
	// 播放暂停时执行的事件
	pauseing(calBack) {
		let that = this;
		this.media.addEventListener('pause', e => {
			that.playPause.className = 'play-pause iconfont icon-icon-test1'
			that.mainCdCover.style.animationPlayState = 'paused';
			that.mediaCover.style.animationPlayState = 'paused';
			that.mainPingBox.style.transform = `translateX(-55%) rotate(-50deg)`;
			if (typeof (calBack) == 'function') calBack();
		});
	}
	// 播放开始执行的函数
	playing(calBack) {
		let that = this;
		this.media.addEventListener('play', e => {
			that.flang = true;
			that.playPause.className = 'play-pause iconfont icon-icon-test';
			that.mainCdCover.style.animationPlayState = 'running';
			that.mediaCover.style.animationPlayState = 'running';
			that.mainPingBox.style.transform = `translateX(-55%) rotate(-20deg)`;
			if (typeof (calBack) == 'function') calBack();
		});
	}
	// 播放进度改变执行的函数
	timeupdate(calBack) {
		let that = this;
		this.media.addEventListener('timeupdate', e => {
			// 改变播放进度条显示进度
			that.progressSeat.style.width = that.media.currentTime / that.media.duration * 100 + "%";
			that.upDataCurrentTime();
			if (that.flang) that.upDataTotalTime();
			if (typeof (calBack) == 'function') calBack();
		});
	}
	// 获取并显示音乐当前播放的时间
	upDataCurrentTime() {
		let ct = this.media.currentTime / 60;
		ct < 10 ? this.curTime.innerHTML = `0${String(ct).slice(0,4).replace('.',':')}` : String(ct).slice(0, 4).replace('.', ':')
	}
	// 获取并显示音乐总时间
	upDataTotalTime() {
		let dt = this.media.duration / 60;
		if (dt) this.flang = false;
		dt < 10 ? this.totalTime.innerHTML = `0${String(dt).slice(0,4).replace('.',':')}` : String(dt).slice(0, 4).replace('.', ':')
	}
	// 初始化
	init() {
		this.ended();
		this.pauseing();
		this.playing();
		this.timeupdate();
		this.playLine();
		this.volLine();
	}


}
// 实例
let playControl = new PlayControl({
	media: document.querySelector('.media'),
	playPause: document.querySelector('.play-pause'),
	curTime: document.querySelector('.current-time'),
	totalTime: document.querySelector('.total-time'),
	progressBox: document.querySelector('.progress-box'),
	progressSeat: document.querySelector('.progress-seat'),
	progressSilder: document.querySelector('.progress-silder'),
	mainCdCover: document.querySelector('.main-cd-cover'),
	mediaCover: document.querySelector('.media-cover'),
	mainPingBox: document.querySelector('.main-ping-box'),
	volBox: document.querySelector('.vol-box'),
	volSeat: document.querySelector('.vol-seat'),
	volSilder: document.querySelector('.vol-silder'),

});

// 控制音乐功能按钮类
class PlayerFun {
	// 构造器
	constructor(opt) {
		// 必要参数检测&抛出错误
		if (!opt) throw new Error(`Error:参数错误，PlayControl构造函数需要传入opt对象，请参照说明文档！`)
		let errTest = `songInfo musicList musicListClose songList loopMode prevSong playPause nextSong listContainer topName topSinger mediaCover mainLrc main`.split(' ')
		errTest.forEach((val) => {
			if (!opt[val]) throw new Error(`Error：参数错误，缺少 ${val} 参数，请查看说明文档补全参数！`)
		})
		// 混入属性
		for (let key in opt) {
			this[key] = opt[key]
		}
		this.index = 0;
		this.init();
	}
	// 方法
	// 点击关闭音乐列表
	_songListClose() {
		let that = this;
		this.musicListClose.addEventListener('click', e => {
			that.musicList.style.transform = 'translateY(100%)';
		});
	}
	// 点击显示音乐列表
	_songListShow() {
		let that = this;
		this.songList.addEventListener('click', e => {
			that.musicList.style.transform = 'none';
		});
	}
	// 音乐播放/暂停切换
	_playPause() {
		this.playPause.addEventListener('touchstart', e => {
			playControl.media.paused ? playControl._play() : playControl._pause();
		});
	}
	// 播放音乐
	_play() {
		playControl.songChange(this.songInfo[this.index].src)
	}
	// 播放信息同步
	_songPlayInfo() {
		let that = this;
		playControl.playing(() => {
			that.topName.innerHTML = that.songInfo[that.index].name
			that.topSinger.innerHTML = that.songInfo[that.index].author
			that.mediaCover.style.background = `url('${that.songInfo[that.index].imgSrc}')no-repeat center/100% 100%`;
			document.querySelector('body').style.background = `url('${that.songInfo[that.index].imgSrc}')no-repeat center/100% 100%`;
			let musicListAll = Array.from(document.querySelectorAll('.music-list-body li div'))
			musicListAll.forEach(val => {
				val.className = ''
			})
			musicListAll[that.index].className = 'current iconfont icon-icon-test4'
		})
	}
	// 播放结束自动播放下一首
	_autoNext() {
		let that = this;
		playControl.ended(() => {
			that._loopMode()
			that._play()
		})
	}
	// 点击播放
	_clickPlay() {
		let that = this;
		this.listContainer.addEventListener('click', e => {
			that.index = e.target.dataset.index;
			that._play();
		});
	}
	// 下一曲
	_nextSong() {
		let that = this;
		this.nextSong.addEventListener('touchstart', e => {
			that._loopMode()
			that._play();
		});
	}
	// 上一曲
	_prevSong() {
		let that = this;
		this.prevSong.addEventListener('touchstart', e => {
			that._loopMode(false)
			that._play();
		});
	}
	// 循环模式的功能
	_loopMode(next = true) {
		if (!window.localStorage.getItem('loopMode')) {
			window.localStorage.setItem('loopMode', 'loopPlay')
		}
		let loop = window.localStorage.getItem('loopMode')
		switch (loop) {
			case 'loopPlay':
				if (next) {
					this.index === this.songInfo.length - 1 ? this.index = 0 : this.index++;
				} else {
					this.index === 0 ? this.index = this.songInfo.length - 1 : this.index--;
				}
				break;
			case 'randomPlay':
				this.index = Math.floor(Math.random() * this.songInfo.length);
				break;
			case 'onePlay':
				this.index = this.index;
				break;
			default:
				break;
		}
	}
	// 实现播放模式切换按钮的功能
	_changeMode() {
		let that = this;
		this.loopMode.addEventListener('touchstart', e => {
			switch (window.localStorage.getItem('loopMode')) {
				case 'loopPlay':
					that.loopMode.className = "loop-mode iconfont icon-suiji"
					window.localStorage.setItem('loopMode', 'randomPlay')
					break;
				case 'randomPlay':
					that.loopMode.className = "loop-mode iconfont icon-danquxunhuan"
					window.localStorage.setItem('loopMode', 'onePlay')
					break;
				case 'onePlay':
					that.loopMode.className = "loop-mode iconfont icon-liebiaoxunhuan"
					window.localStorage.setItem('loopMode', 'loopPlay')
					break;
				default:
					break;
			}
		});
	}
	// 歌词页面切换
	_mainLrc() {
		let that = this;
		this.main.addEventListener('click', e => {
			if (e.target.className == 'main-lrc') {
				setTimeout(() => {
					that.mainLrc.style.zIndex = '-1';
				}, 500)
				that.mainLrc.style.opacity = '0';
			} else {
				that.mainLrc.style.opacity = '1';
				that.mainLrc.style.zIndex = '530';
			}
		});
	}
	// 初始化
	init() {
		this._play();
		this._songListClose();
		this._songListShow();
		this._playPause();
		this._clickPlay();
		this._songPlayInfo();
		this._nextSong();
		this._prevSong();
		this._autoNext();
		this._loopMode();
		this._changeMode();
		this._mainLrc();
	}
}
// 实例
let playerFun = new PlayerFun({
	songInfo: songInfo,
	musicList: document.querySelector('.music-list'),
	musicListClose: document.querySelector('.music-list-close'),
	songList: document.querySelector('.song-list'),
	loopMode: document.querySelector('.loop-mode'),
	prevSong: document.querySelector('.prev-song'),
	playPause: document.querySelector('.play-pause'),
	nextSong: document.querySelector('.next-song'),
	listContainer: document.querySelector('.music-list-body ol'),
	topName: document.querySelector('.top-name'),
	topSinger: document.querySelector('.top-singer'),
	mediaCover: document.querySelector('.media-cover'),
	mainLrc: document.querySelector('.main-lrc'),
	main: document.querySelector('main'),
})

// 歌曲管理对象
class SongManage {
	// 构造器
	constructor(opt) {
		// 必要参数检出&抛出错误
		if (!opt) throw new Error(`Error:参数错误，PlayControl构造函数需要传入opt对象，请参照说明文档！`)
		let errorTest = `songList listContainer remove`.split(' ');
		errorTest.forEach((val) => {
			if (!opt[val]) throw new Error(`Error：参数错误，缺少 ${val} 参数，请查看说明文档补全参数！`)
		});
		//混入属性 
		for (let key in opt) {
			this[key] = opt[key];
		}
		this.index = 0;
		this.init();
	}
	// 方法
	// 添加歌曲
	add(song) {
		this.songList.push(song)
	}
	// 删除歌曲
	del() {
		let that = this;
		this.listContainer.addEventListener('click', e => {
			if (e.target.className == 'song-remove iconfont icon-cha') {
				that.index = e.target.parentElement.dataset.index;
				that.songList.splice(that.index, 1)
				playerFun.songInfo.splice(that.index, 1);
				that.renderer()
			}
		});
	}
	// 渲染歌曲列表
	renderer() {
		this.listContainer.innerHTML = this.songList.map((val, idx) => {
			return `<li data-index='${idx}'>	
						<div data-index='${idx}'>
							<p data-index='${idx}'>${val.name}</p>
							&nbsp;-&nbsp;
							<span data-index='${idx}'>${val.author}</span>
						</div>
						<i class="song-remove iconfont icon-cha"></i>
					</li>`
		}, this).join('');
	}
	// 清空歌曲列表
	removeAll() {
		let that = this
		this.remove.addEventListener('click', e => {
			that.songList = null;
			playerFun.songList = null;
			that.listContainer.innerHTML = '';
		});
	}
	// 初始化
	init() {
		this.renderer()
		this.del()
		this.removeAll()
		console.log('Hello！ ');
	}
}

// 实例
let songManage = new SongManage({
	songList: songInfo,
	listContainer: document.querySelector('.music-list-body ol'),
	remove: document.querySelector('.remove-all')
});

// end

// 实例1


