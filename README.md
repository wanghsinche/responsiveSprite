# responsiveSprite
将css背景转成雪碧图，并输出用百分比表示的css，用于响应式背景图
# 待实现的功能
* 检测目标css文件
* 目标css代码仅仅是 background: url(../img1.png) 100% no-repeat; 即将一个背景图100%铺满元素
* 提取出其中的img1.png、img2.png等等背景图，按从上到下拼接成一张雪碧图（已完成）
* 输出每一张单独背景图在雪碧图中的位置，以及应该呈现的大小，均以百分比表示
* 将这些信息替换到原来的目标css代码，如:  

	``background: url(../img1.png) no-repeat;``  
    ``background-size: 100%;``      
	
	变成：   

	``background-image: url(../_dest.png) no-repeat 0 Y_position_percentage;``   

	`` background-size: auto Height_percentage;``  
* 其中计算公式如下：  
	
	**Y轴位置百分比为** ``原背景图片在雪碧图的Y坐标 / (雪碧图总高度 - 原背景图高度) x 100%``  

	**高度百分比为** ``雪碧图总高度 /  原背景图高度``

