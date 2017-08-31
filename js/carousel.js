;(function($){

	var Carousel=function(poster){
		var self=this;
		// 保存单个旋转木马对象
		
		this.poster=poster;

		this.posterItemMain=poster.find('ul.poster-list');
		this.prevBtn=poster.find('div.poster-prev-btn');
		this.nextBtn=poster.find('div.poster-next-btn');

		this.posterItems=poster.find('li.poster-item');
		this.posterFirstItem=this.posterItems.first();
		this.posterLastItem=this.posterItems.last();
		this.isAnimation=true;
		//默认配置参数
		this.setting={
			'width':1000,
			'height':270,
			'posterWidth':640,
			'posterHeight':270,
			'scale':0.9,                         //记录显示比例关系
			'speed':500,
			'verticalAlign':'middle'      //top bottom
		};
		$.extend(this.setting,this.getSetting());
		// console.log(this.getSetting());
		//设置配置参数值
		this.setSettingValue();
		this.setPosterPos();
		// this.posterItems.length==this.posterItems.size(); 除了计算字符串长度和数组元素个数外,都可以用size(),不然用length;
		this.nextBtn.click(function(){
			if (self.isAnimation) {
				self.isAnimation=false;
				self.carouselRoate('left');
			}
			
		});
		this.prevBtn.click(function(){
			if (self.isAnimation) {
				self.isAnimation=false;
				self.carouselRoate('right');
			}
			
		});
	};
	Carousel.prototype={
		// 旋转
		carouselRoate:function(dir){
			var _this_=this;
			var zIndexArr=[];
			
			if (dir==='left') {
				this.posterItems.each(function(){
					// get(0):把jQuery对象转成dom元素;
					var self=$(this),
						prev=self.prev().get(0)?self.prev():_this_.posterLastItem,
						width=prev.width(),
						height=prev.height(),
						zIndex=prev.css('zIndex'),
						opacity=prev.css('opacity'),
						left=prev.css('left'),
						top=prev.css('top');
						zIndexArr.push(zIndex);
						self.animate({
							width:width,
							height:height,
							opacity:opacity,
							left:left,
							top:top
						},function(){
							_this_.isAnimation=true;
						})

				})
				this.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i]);
				})
				
			}else if (dir==='right') {
				this.posterItems.each(function(){
					// get(0):把jQuery对象转成dom元素;
					var self=$(this),
						next=self.next().get(0)?self.next():_this_.posterFirstItem,
						width=next.width(),
						height=next.height(),
						zIndex=next.css('zIndex'),
						opacity=next.css('opacity'),
						left=next.css('left'),
						top=next.css('top');
						zIndexArr.push(zIndex);
						self.animate({
							width:width,
							height:height,
							opacity:opacity,
							left:left,
							top:top
						},function(){
							_this_.isAnimation=true;
						})

				});
				this.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i]);
				})
			}
		},
		//设置剩余的帧的位置关系
		setPosterPos:function(){
			var self=this;

			var sliceItems=this.posterItems.slice(1),//去掉第一个li后,只剩偶数个li
				sliceSize=Math.ceil(sliceItems.length/2),
				rightSlice=sliceItems.slice(0,sliceSize),
				leftSlice=sliceItems.slice(sliceSize),
				level = Math.ceil(sliceItems.length/2);

			// alert(level);
			// 设置右边帧的位置关系和宽度/高度/top
			var rw=this.setting.posterWidth;
			var rh=this.setting.posterHeight;
			var gap=(this.setting.width-this.setting.posterWidth)/2/level;
			var firstLeft=(this.setting.width-this.setting.posterWidth)/2+rw;

			rightSlice.each(function(i){
				level--;
				rw=rw*self.setting.scale;
				rh=rh*self.setting.scale;
				var j=i;
 
			
				$(this).css({
					zIndex:level,
					width:rw,
					height:rh,
					opacity:1/(++i),
					top:self.setVerticalAlign(rh),
					left:firstLeft+(++j)*gap-rw
				});
			});

			// 设置左边帧的位置关系和宽度/高度/top
			var lw=rightSlice.last().width();
			var lh=rightSlice.last().height();
			var oloop = Math.ceil(sliceItems.length/2);
			
			leftSlice.each(function(i){
				
				var j=i;

				$(this).css({
					zIndex:i,
					width:lw,
					height:lh,
					opacity:1/oloop,
					top:self.setVerticalAlign(lh),
					left:i*gap
				});
				oloop--;
				lw=lw/self.setting.scale;
				lh=lh/self.setting.scale;
			});


		},
		
		
		// 设置垂直排列对齐

		setVerticalAlign:function(h){
			var verticalType=this.setting.verticalAlign,
				top=0;
			if (verticalType==='top') {
				top=0;
			}else if (verticalType==='middle') {
				top=(this.setting.posterHeight-h)/2;
			}else if (verticalType==='bottom') {
				top=this.setting.posterHeight-h;
			}else{
				top=(this.setting.posterHeight-h)/2;
			}
			return top;
		},
		// 设置配置参数值去控制基本宽高
		setSettingValue:function(){
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			});
			// 计算上下切换按钮的宽度
			var w=(this.setting.width-this.setting.posterWidth)/2;

			this.posterItemMain.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				
			});
			this.prevBtn.css({
				width:w,
				height:this.setting.posterHeight,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
			this.nextBtn.css({
				width:w,
				height:this.setting.posterHeight,
				zIndex:Math.ceil(this.posterItems.size()/2)  //>=原值最小整数
			});
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				zIndex:Math.ceil(this.posterItems.size()/2)  //
			});
		},
		// 获取人工配置参数
		getSetting:function(){
			var setting=this.poster.attr('data-setting');
			if(setting&&setting!=''){
				return $.parseJSON(setting);
			}else{
				return {};
			}
		}
	}
	Carousel.init=function(posters){
		var _this_=this;
		posters.each(function(i,elem){
			new _this_($(elem));
		})
	}
	window['Carousel']=Carousel;
})(jQuery);