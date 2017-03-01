/**
**旋转木马轮播图
*1.布局
*2.控制布局并显示：对每个对象进行独立，传入参数并配置，初始化布局；
*3.事件的配置及操作：
**左切换：样式取上一个的，如果是第一个则取最后一个的，
**右切换：样式取下一个的，如果是最后一个则取第一个的，
*4.自动播放：判断是否自动播放，鼠标经过时停止播放，鼠标离开时恢复播放
**/
;(function(){//匿名函数;
	var Carousel = function(poster){//构造函数，（第一个字母大写），传入参数并配置
		//要做的就是将其他元素均匀分配位置；
		var _this = this;//区分作用域
		//容器，ul,li,左右按钮；
		this.poster = poster;//容器
		this.posterMain = poster.find('.poster-list');//ul
		this.posterItems = poster.find('.poster-item');//li;
		this.prev = poster.find('.poster-prev');//prev
		this.next = poster.find('.poster-next');//next
		if(this.posterItems.size()%2==0){//判断是奇数还是偶数
			this.posterMain.append(this.posterItems.eq(0).clone());//复制第一个到最后
			this.posterItems = this.posterMain.children();//获取到完整的li元素；
		};
		this.posterFirstItem = this.posterItems.first();//取得第一个li
		this.posterLastItem = this.posterItems.last();//取得最后一个li
		this.rotateFlag = true;

		//默认参数是不可缺少的一部分；
		this.setting={
			"width" : 1000,			//幻灯片的宽度
			"height" : 270,			//幻灯片的高度
			"posterWidth" : 640,	//幻灯片第一帧的宽度
			"posterHeight" : 270,	//幻灯片第一帧的高度
			"scale" : 0.8,			//记录显示比例关系
			"autoPlay" : true,
			"delay" : 2000,
			"speed" : 300,
			"verticalAlign" : "middle" //传入对其方式top bottom
		};
		//extend复制元素，当元素对象存在就覆盖，不存在则创建；
		$.extend(this.setting,this.getting());//复制
		//设置配置参数值 容器 ul li 第一个基础样式
		this.setSettingValue();
		this.setPosterPos();//初始化布局，除第一张图片以外的li显示
		this.initEvent();//初始化DOM元素
		if(_this.setting.autoPlay){
			_this.autoPlay();//调用自动播放；
			_this.poster.hover(function(){
				clearInterval(_this.timer);
			},function(){
				_this.autoPlay();
			})
		}
	};
	// Carousel.prototype 
	Carousel.prototype={
		//获取配置的参数；
		getting:function(){
			var setting = this.poster.attr("data-setting");//配置参数
			if(setting && setting!=""){
				return $.parseJSON(setting);//从字符串转为对象
			}
			return {};//判断如果为空，返回为空
		},
		//设置配置参数值 容器 ul li 第一个图片，左右按钮基础样式
		setSettingValue:function(){
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.posterMain.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight
			});
			var w = (this.setting.width-this.setting.posterWidth)/2;//取得一边按钮的宽度；
			this.next.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)//像上取整
			});
			this.prev.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)//像上取整
			});
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				zIndex:Math.ceil(this.posterItems.size()/2),//像上取整
				top:0,
				left:w
			});
		},
		//初始化布局，除第一张图片以外的li显示
		setPosterPos:function(){
			var _this = this;
			var sliceItems = this.posterItems.slice(1),//从第二个开始数组
				sliceSize = sliceItems.size()/2,//一半的个数
				rightSlice = sliceItems.slice(0,sliceSize),//取一半，右侧对象
				leftSlice = sliceItems.slice(sliceSize),//取一半左侧对象
				level = Math.floor(this.posterItems.size()/2);//向下取整，每一边的个数

			//设置右边帧的位置关系和宽度高度top
			var rw = this.setting.posterWidth,//获取木马的宽度；
				rh = this.setting.posterHeight,
				gap = ((this.setting.width-this.setting.posterWidth)/2)/level;//单个间隙
			var firstLeft = (this.setting.width-this.setting.posterWidth)/2 ;//按钮大小
			var rigoffer = firstLeft+rw;//便于右侧left值的计算
			//设置右边位置关系
			rightSlice.each(function(i){//i是4次
				level--;//逐个递减
				rw = rw*_this.setting.scale;//宽度显示的比例
				rh = rh*_this.setting.scale;//高度显示的比例
				var j =i;//因为下边自加会继承，先复制一份
				$(this).css({
					zIndex:level,
					width:rw,
					height:rh,
					left:rigoffer+(++j)*gap-rw,
					opacity:1/(++i),
					top:_this.setVerticalAlign(rh)
				});
			});
			//设置左边的位置关系
			var lw = rightSlice.last().width(),
				lh  =rightSlice.last().height(),
				oloop = Math.floor(this.posterItems.size()/2);
			leftSlice.each(function(i){
				$(this).css({
					zIndex:i,
					width:lw,
					height:lh,
					opacity:1/oloop,
					left:i*gap,
					top:_this.setVerticalAlign(lh)
				});
				lw = lw/_this.setting.scale;
				lh = lh/_this.setting.scale;
				oloop--;
			});
		},
		//两边图片剧中显示
		setVerticalAlign:function(height){
			var verticalType = this.setting.veritivalAlign;
			var top = 0;
			if(verticalType == "middle"){
				top = (this.setting.height-height)/2
			}else if(verticalType == "bottom"){
				top =this.setting.height-height;
			}else{
				top = (this.setting.height-height)/2;
			}
			return top;
		},
		//初始化DOM元素
		initEvent:function(){
			var _this = this;
			this.next.on('click',function(){//点击下一个按钮
				// debugger
				if(_this.rotateFlag){
					_this.carouselRotate('right');
					_this.rotateFlag = false;
				}else{
					console.log('点的太快了')
				}
			});
			this.prev.on('click',function(){//点击下一个按钮
				if(_this.rotateFlag){
					_this.carouselRotate('left');
					_this.rotateFlag = false;
				}else{
					console.log('点的太快了')
				}
				
			});
		},
		carouselRotate:function(dir){
			var _this = this;
			var zIndexArr=[];
			if(dir == "left"){
				this.posterItems.each(function(){//循环图片
					var this_ = $(this),
						prev = this_.prev().get(0)?this_.prev():_this.posterLastItem,//获取上一个元素
						width = prev.width(),
						height = prev.height(),
						zIndex = prev.css('zIndex'),
						opacity = prev.css('opacity'),
						left = prev.css('left'),
						top = prev.css('top');
					zIndexArr.push(zIndex);
					this_.animate({//运动
						width:width,
						height:height,
						left:left,
						top:top,
						opacity:opacity
					},_this.setting.speed,function(){
						_this.rotateFlag = true;//恢复
					});
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i]);
				})

			}else if(dir == "right"){
				this.posterItems.each(function(){//循环图片
					var this_ = $(this),
						next = this_.next().get(0)?this_.next():_this.posterFirstItem,//获取上一个元素
						width = next.width(),
						height = next.height(),
						zIndex = next.css('zIndex'),
						opacity = next.css('opacity'),
						left = next.css('left'),
						top = next.css('top');
					zIndexArr.push(zIndex);
					this_.animate({//运动
						width:width,
						height:height,
						left:left,
						top:top,
						opacity:opacity
					},_this.setting.speed,function(){
						_this.rotateFlag = true;//恢复
					});
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i]);
				})
			}else{
				return;
			}
		},
		//自动播放
		autoPlay:function(){
			var _this = this;
			this.timer=setInterval(function(){
				_this.next.click();//触发点击时间
			},_this.setting.delay)
		}
		
	};
	Carousel.init = function(poster){//init是静态对象；
		var _this = this;
		poster.each(function(i){//如果是多个。则用each循环遍历
			new _this($(this));//$(this)是传入的对象
		})

	};
	window["Carousel"] = Carousel;//像外界输出
})();//自执行函数