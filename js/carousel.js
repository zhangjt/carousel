;(function($){

	var Carousel = function(poster){
			var self = this;
			//保存单个旋转木马对象
			this.poster                  = poster;
			this.posterItemMain = poster.find("ul.poster-list");
			this.nextBtn               = poster.find("div.poster-next-btn");
			this.prevBtn               = poster.find("div.poster-prev-btn");
			this.posterItems        =poster.find("li.poster-item");
			if(this.posterItems.size()%2==0){
				this.posterItemMain.append(this.posterItems.eq(0).clone());
				this.posterItems = this.posterItemMain.children();
			};
			this.posterFirstItem  = this.posterItems.first();
			this.posterLastItem  = this.posterItems.last();
			this.rotateFlag   = true;
			//默认配置参数
			this.setting = {
									"width":"20rem",			//幻灯片的宽度
									"height":"5rem",				//幻灯片的高度
									"posterWidth":"10rem",	//幻灯片第一帧的宽度
									"posterHeight":"5rem",	//幻灯片第一帧的高度
									"scale":0.9,					//记录显示比例关系
									"speed":500,
									"autoPlay":false,
									"delay":5000,
									"verticalAlign":"middle" //top bottom
									};
			$.extend(this.setting,this.getSetting());
			// console.log(this.setting)
			//设置配置参数值
			this.setSettingValue();
			this.setPosterPos();
			//左旋转按钮
			this.nextBtn.click(function(){
				if(self.rotateFlag){
					self.rotateFlag = false;
					self.carouseRotate("left");
				};
			});
			//右旋转按钮
			this.prevBtn.click(function(){
				if(self.rotateFlag){
					self.rotateFlag = false;
					self.carouseRotate("right");
				};
			});
			//是否开启自动播放
			if(this.setting.autoPlay){
				this.autoPlay();
				this.poster.hover(function(){
											window.clearInterval(self.timer);
											},function(){
											self.autoPlay();
											});	
			};
			this.touchRotate();
	};
	Carousel.prototype = {
		autoPlay:function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			},this.setting.delay);

		},
		//触摸滑动
		touchRotate:function(){

			var self=this;
			//事件类型
			EVENT_TYPE = ('ontouchend' in document) ? 'touchstart' : 'click';
			var startPos;
			window.addEventListener('touchstart',function(event){
			  var target = event.target;
			  while (target.nodeType != 1) {
			  target = target.parentNode;
			  }
			  // if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'BUTTON') { event.preventDefault();}
			  startPos = {x:event.touches[0].pageX,y:event.touches[0].pageY,time:+new Date};
			  
			},false);
			window.addEventListener('touchend',function(event){
				var target = event.target;
				while (target.nodeType != 1) {
					target = target.parentNode;
				}
			   
			　  endPos = {x:event.changedTouches[0].pageX - startPos.x,y:event.changedTouches[0].pageY - startPos.y};
				if(endPos.x > 20){  
					if(self.rotateFlag){
						self.rotateFlag = false;
						self.carouseRotate("right");
					};
				}else if(endPos.x < -20){
					if(self.rotateFlag){
						self.rotateFlag = false;
						self.carouseRotate("left");
					};
				}
				// console.log('touchend')
			});  
		},
		//旋转
		carouseRotate:function(dir){
			var _this_  = this;
			var zIndexArr = [];
			//左旋转
			if(dir === "left"){
				this.posterItems .each(function(){
					var self = $(this),
						   prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
						   width = prev.get(0).style.width,
						   height =prev.get(0).style.height,
						   zIndex = prev.css("zIndex"),
						   opacity = prev.css("opacity"),
						   left = prev.get(0).style.left,
						   top = prev.get(0).style.top;
							zIndexArr.push(zIndex);	
						   self.animate({
							   					width:width,
												height:height,
												//zIndex:zIndex,
												opacity:opacity,
												left:left,
												top:top
												},_this_.setting.speed,function(){
													_this_.rotateFlag = true;
												});
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			}else if(dir === "right"){//右旋转
				this.posterItems .each(function(){
					var self = $(this),
						   next = self.next().get(0)?self.next():_this_.posterFirstItem,
						   width = next.get(0).style.width,
						   height =next.get(0).style.height,
						   zIndex = next.get(0).style.zIndex,
						   opacity = next.css("opacity"),
						   left = next.get(0).style.left,
						   top = next.get(0).style.top;
						   zIndexArr.push(zIndex);	
						   self.animate({
							   					width:width,
												height:height,
												//zIndex:zIndex,
												opacity:opacity,
												left:left,
												top:top
												},_this_.setting.speed,function(){
													_this_.rotateFlag = true;
												});
	
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			};
		},
		//设置剩余的帧的位置关系
		setPosterPos:function(){
				var   self = this;
				var 	sliceItems  = this.posterItems.slice(1),
						sliceSize     = sliceItems.size()/2,
						rightSlice   = sliceItems.slice(0,sliceSize),
						level            = Math.floor(this.posterItems.size()/2),
						leftSlice      =sliceItems.slice(sliceSize);
			
				//设置右边帧的位置关系和宽度高度top
				var  w=this.setting.width;
				var  rw = this.setting.posterWidth;
				var  rh  = this.setting.posterHeight;
				var	 wNum=Number(w.match(/[^a-zA-Z]*/g).join(''));
				var	 rwNum=Number(rw.match(/[^a-zA-Z]*/g).join(''));
				var	 rhNum=Number(rh.match(/[^a-zA-Z]*/g).join(''));
				var  Rem=rw.match(/[a-zA-Z]*/g).join('');
				var  gap = ((wNum-rwNum)/2)/level;
				
				var firstLeft = (wNum-rwNum)/2;
				var fixOffsetLeft = firstLeft+rwNum;
				//设置右边位置关系
				rightSlice.each(function(i){
					level--;
					rwNum = rwNum *self.setting.scale;
					rhNum = rhNum *self.setting.scale
					var j = i;
					$(this).css({
										zIndex:level,
										width:rwNum+Rem,
										height:rhNum+Rem,
										opacity:1/(++j),
										left:((fixOffsetLeft+(++i)*gap)-rwNum)+Rem,
										top:self.setVerticalAlign(rhNum,Rem)
										});
				});
				//设置左边的位置关系
				var lw = rightSlice.last().get(0).style.width,
					   lh  =rightSlice.last().get(0).style.height,
					   oloop = Math.floor(this.posterItems.size()/2);
			    var lwNum=Number(lw.match(/[^a-zA-Z]*/g).join(''));
			    var lhNum=Number(lh.match(/[^a-zA-Z]*/g).join(''));
			    var Rem=lw.match(/[a-zA-Z]*/g).join('');
			 
			    console.log(lw);
		
				leftSlice.each(function(i){
					$(this).css({
										zIndex:i,
										width:lwNum+Rem,
										height:lhNum+Rem,
										opacity:1/oloop,
										left:i*gap+Rem,
										top:self.setVerticalAlign(lhNum,Rem)
										});
					lwNum = lwNum/self.setting.scale;
					lhNum = lhNum/self.setting.scale;
					oloop--;
				});
		},
		//设置垂直排列对齐
		setVerticalAlign:function(hNum,Rem){
			
			var h=this.setting.height.match(/[^a-zA-Z]/g).join('');
			h=Number(h);
			var verticalType  = this.setting.verticalAlign,
					top = 0;
			if(verticalType === "middle"){
				top = ((h-hNum)/2)+Rem;
			}else if(verticalType === "top"){
				top = 0;
			}else if(verticalType === "bottom"){
				top = (h-hNum)+Rem;
			}else{
				top = ((h-hNum)/2)+Rem;
			};
			return top;
		},
		//设置配置参数值去控制基本的宽度高度。。。
		setSettingValue:function(){
			this.poster.css({
										width:this.setting.width,
										height:this.setting.height
									});
			this.posterItemMain.css({
										width:this.setting.width,
										height:this.setting.height
									});
			//计算上下切换按钮的宽度
			var wNum=this.setting.width.match(/[^a-zA-Z]/g).join('');
			var hNum=this.setting.height.match(/[^a-zA-Z]/g).join('');
			var rwNum=this.setting.posterWidth.match(/[^a-zA-Z]/g).join('');
			var rhNum=this.setting.posterHeight.match(/[^a-zA-Z]/g).join('');
			var Rem=this.setting.width.match(/[a-zA-Z]/g).join('');
			var wT = (wNum-rwNum)/2;
			//设置切换按钮的宽高，层级关系
			this.nextBtn.css({
										width:wT+Rem,
										height:hNum+Rem,
										zIndex:Math.ceil(this.posterItems.size()/2)
										});
			this.prevBtn.css({
										width:wT+Rem,
										height:hNum+Rem,
										zIndex:Math.ceil(this.posterItems.size()/2)
										});
			
			this.posterFirstItem.css({
										width:rwNum+Rem,
										height:rhNum+Rem,
										left:wT+Rem,
										top:0,
										zIndex:Math.floor(this.posterItems.size()/2)
										});
		},
		//获取人工配置参数
		getSetting:function(){
			
			var setting = this.poster.attr("data-setting");
			if(setting&&setting!=""){
				return $.parseJSON(setting);
			}else{
				return {};
			};
		}
	
	};
	Carousel.init = function(posters){
		var _this_ = this;
		posters.each(function(){
			new  _this_($(this));
		});
	};
	window["Carousel"] = Carousel;
})(jQuery);