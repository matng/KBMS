/*
 * zxxFile.js 鍩轰簬HTML5 鏂囦欢涓婁紶鐨勬牳蹇冭剼鏈� http://www.zhangxinxu.com/wordpress/?p=1923
 * by zhangxinxu 2011-09-12
*/
var ZXXFILE = {
					//ajax鍦板潃
 	fileInput: $("#fileImage").get(0),
    dragDrop: $("#fileDragArea").get(0),//拖拽区域
    upButton: $("#fileSubmit").get(0),//上传按钮
    url: $("#uploadForm").attr("action"),//Ajax上传地址
	fileFilter: [],					//杩囨护鍚庣殑鏂囦欢鏁扮粍
	filter: function(files) {		//閫夋嫨鏂囦欢缁勭殑杩囨护鏂规硶
		return files;	
	},
	
	onSelect: function() {},		//当本地文件被选择之后执行的回调。支持一个参数(files)，为文件对象数组
//	onDelete: function() {},		//鏂囦欢鍒犻櫎鍚�
//	onDragOver: function() {},		//鏂囦欢鎷栨嫿鍒版晱鎰熷尯鍩熸椂
//	onDragLeave: function() {},	//鏂囦欢绂诲紑鍒版晱鎰熷尯鍩熸椂
//	onProgress: function() {},		//鏂囦欢涓婁紶杩涘害
	onSuccess: function() {},		//鏂囦欢涓婁紶鎴愬姛鏃�
	onFailure: function() {},		//鏂囦欢涓婁紶澶辫触鏃�,
	onComplete: function() {},		//鏂囦欢鍏ㄩ儴涓婁紶瀹屾瘯鏃�
	onDelete: function(file) {
        $("#uploadList_" + file.index).fadeOut();
    },
    onDragOver: function() {
        $(this).addClass("upload_drag_hover");
    },
    onDragLeave: function() {
        $(this).removeClass("upload_drag_hover");
    },
    onProgress: function(file, loaded, total) {
        var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100).toFixed(2) + '%';
        eleProgress.show().html(percent);
    },
	/* 寮€鍙戝弬鏁板拰鍐呯疆鏂规硶鍒嗙晫绾� */
	
	//当本地文件被拖到拖拽敏感元素上面时执行的方法。方法中的this指该敏感元素，也就是上面的dragDrop元素。
	funDragHover: function(e) {
		e.stopPropagation();
		e.preventDefault();
		this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
		return this;
	},
	//获取选择或拖拽文件�
	funGetFiles: function(e) {
		this.funDragHover(e);
		var files = e.target.files || e.dataTransfer.files;
		console.log(files);
		this.fileFilter = this.fileFilter.concat(this.filter(files));
		this.funDealFiles();
		return this;
	},
	
	//对选择文件进行处理
	funDealFiles: function() {
		for (var i = 0, file; file = this.fileFilter[i]; i++) {
			file.index = i;
		}
		this.onSelect(this.fileFilter);
		return this;
	},
	
	funDeleteFile:function(fileDelete) {
		var arrFile = [];
		for (var i = 0, file; file = this.fileFilter[i]; i++) {
			if (file != fileDelete) {
				arrFile.push(file);
			} else {
				this.onDelete(fileDelete);	
			}
		}
		this.fileFilter = arrFile;
		return this;
	},


	//上传相关
	funUploadFile: function() {
		var xhr=new XMLHttpRequest();
		var fd;
		var des;
		var file;
		const LENGTH=10 * 1024 * 1024;
		var start;
		var end;
		var blob;
		var pecent;
		var time;
		var timeArr = new Array();

		for (var k = 0 ;k < 10;k++){
			timeArr[k] = new Array();
			for(var i = 0; i < 3;i++){
				timeArr[k][i] = "";
			}
		}

		var timeindex = 0;
		var filename;
		if (location.host.indexOf("sitepointstatic") >= 0) {
			return;	
		}
		
		for (var i = 0, myfile; myfile = this.fileFilter[i]; i++) {
			if(this.fileFilter.length >= 2 ){
				if(myfile.size >= 10*1024*1024){
					alert("大文件请单独上传~~");
					return;
				}
			}else if(this.fileFilter.length > 10){
				alert("文件数目不可多于十个~~~");
				return;
			}
		}

		for (var i = 0, myfile; myfile = this.fileFilter[i]; i++) {
			console.log(myfile);
			time = (new Date()).valueOf();
			start = 0;
			end = LENGTH + start;
			file = myfile;
			if (file.size <= 10 * 1024 * 1024) {
				smallUp();
			} else {
				BigUp();
			}

		}

		function updatePro(percent){
			var p = (Math.floor(percent/100))*$("#load0").width();
			$("#load-bar-inner").width(p);
			$('#counter').html(percent+'%');
		}

		function smallUp() {
			time = (new Date()).valueOf();
			if (start < file.size) {
				xhr.open('POST', 'file/upload', true);
				xhr.onreadystatechange=function() {
					if (this.readyState==4) {
						if (this.status >= 200 && this.status < 300) {
							console.log(this.responseText);
							if (this.responseText.indexOf('failed') >=0) {
								alert('文件发送失败，请重新发送');
								des.style.width='0%';
							}else if(this.responseText == 'ok'){
								console.log(timeArr);
								for(i = 0;i < timeArr.length;i++){
									if(timeArr[i][0]){
										console.log("sss");
										var newxhr = new XMLHttpRequest();
										newxhr.open('POST', 'file/upload', true);
										fd.append('filename',  timeArr[i][1]);
										fd.append('myname', timeArr[i][0]);
										fd.append('succeed',"1");
										fd.append('filesize', timeArr[i][2]);
										fd.append('filefolder',preid);
										fd.append('filegrade',grade);
										console.log(grade+"当前的级别：");
										newxhr.send(fd);
										newxhr.onreadystatechange=function() {
											if (this.readyState==4) {
												if(this.responseText == 'succeed'){
													console.log('succeed');
													alert('上传成功~~~');
												}
											}
										}
									}
								}
							} else {
								start = end;
								end=start + LENGTH;
								setTimeout(smallUp(), 1000);
							}
						}
					}
				}
				xhr.upload.onprogress=function(ev) {
					if (ev.lengthComputable) {
						pecent=100 * (ev.loaded + start) / file.size;
						if (pecent > 100) {
							pecent = 100;
						}
						updatePro(pecent);
					}
				}
				blob=file.slice(start, end);
				fd=new FormData();
				fd.append('mof', blob);
				fd.append('test', file.name);
				fd.append('myname', time);
				fd.append('succeed',"-2");
				timeArr[timeindex][0] = time;
				timeArr[timeindex][1] = file.name;
				timeArr[timeindex][2] = file.size;
				timeindex++;
				xhr.send(fd);
			}else{
				return;
			}
		}

		function BigUp() {
			if (start < file.size) {
				xhr.open('POST', 'file/upload', true);
				xhr.onreadystatechange=function() {
					if (this.readyState==4) {
						if (this.status >= 200 && this.status < 300) {
							console.log(this.responseText);
							if (this.responseText.indexOf('failed') >=0) {
								alert('文件发送失败，请重新发送');
								des.style.width='0%';
							}else if(this.responseText == 'succeed'){
								alert('上传成功~~~');
							} else {
								start = end;
								end=start + LENGTH;
								setTimeout(BigUp(), 1000);
							}
						}
					}
				}
				xhr.upload.onprogress=function(ev) {
					if (ev.lengthComputable) {
						pecent=100 * (ev.loaded + start) / file.size;
						if (pecent > 100) {
							pecent = 100;
						}
						updatePro(pecent);
						//des.style.width=pecent + '%';
						//des.innerHTML=parseInt(pecent) + '%'
					}
				}
				blob=file.slice(start, end);
				fd=new FormData();
				fd.append('mof', blob);
				fd.append('test', file.name);
				fd.append('myname', time);
				fd.append('succeed',"-1");
				xhr.send(fd);
			}else{
				xhr.open('POST', 'file/upload', true);
				fd.append('filename', file.name);
				fd.append('myname', time);
				fd.append('succeed',"1");
				fd.append('filesize',file.size);
				fd.append('filefolder',preid);
				fd.append('filegrade',grade);
				console.log(grade+"当前的级别：");
				xhr.send(fd);
			}
		}
	},
	
	init: function() {
		var self = this;
		
		if (this.dragDrop) {
			this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
		}
		
		if (this.fileInput) {
			this.fileInput.addEventListener("change", function(e) { self.funGetFiles(e); }, false);	
		}
		
		if (this.upButton) {
			this.upButton.addEventListener("click", function(e) { 
				$("#load0").show();
				$("#fileSubmit").hide();
				self.funUploadFile(e);
			}, false);
		} 
	}
};