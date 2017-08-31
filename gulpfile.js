var livereload = require('gulp-livereload'), // 网页自动刷新（服务器控制客户端同步刷新）
  webserver = require('gulp-webserver'); // 本地服务器
  gulp = require('gulp');
// 注册任务
gulp.task('webserver', function() {
  /*gulp.src( ['js/*.js','css/*.css','*.html'] ) // 服务器目录（./代表根目录）*/
  gulp.src('./')
  .pipe(webserver({ // 运行gulp-webserver
    livereload: true, // 启用LiveReload
    open: true // 服务器启动时自动打开网页
  }));
});

// 监听任务
gulp.task('watch',function(){
  gulp.watch( ['*.html']) // 监听根目录下所有.html文件
});

// 默认任务
gulp.task('default',['webserver','watch']);
