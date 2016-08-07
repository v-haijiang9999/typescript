// 依赖关系
// 全局安装 gulp typescript  npm install -g typescript gulp-cli

// 项目开发依赖
// 安装 gulp gulp-typescript  npm install --save-dev gulp gulp-typescript
// gulp-typescript 是typescript插件
var gulp = require("gulp");
var ts = require('gulp-typescript');
// 读取 tsconfig.json 文件   ts 配置源文件
var tsProject = ts.createProject('tsconfig.json');

// Browserify 前端模块管理器 生成的bundle.js可以直接插入网页
// Browserify 是tsify插件
// vinyl-source-stream 一个转换工具：  常规读取流转换为 vinyl 文件对象
// npm install --save-dev browserify tsify vinyl-source-stream
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');

// watchify是一个browserify的封装
var watchify = require('watchify');
// 最基础的工具  打日志
var gutil = require('gulp-util');
// 专业压缩 Javascript
var uglify = require('gulp-uglify');
// 处理 JavaScript 时生成 SourceMap
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

var paths = {
    pages: ['src/*.html']
};
// 添加自定义 browserify 选项  assign插件
var opts = {
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}
var watchedBrowserify = watchify(browserify(opts).plugin(tsify));

// 复制 paths路径源文件
gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});


function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

// 默认编译ts文件
gulp.task("tsc", function () {
    return tsProject.src()
        //  编译 ts文件
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("dist"));
});

// gulp.task('default', ['copy-html'], function () {
//     return browserify({
//         basedir: '.',
//         debug: true,
//         entries: ['src/main.ts'],
//         cache: {},
//         packageCache: {}
//     })
//     .plugin(tsify)
//     .bundle()
//     .pipe(source('bundle.js'))
//     .pipe(gulp.dest('dist'))
//     ;
// });

// gulp.task("default", ["copy-html"], bundle);



gulp.task("default", ["copy-html"], function () {

    // 在这里添加自定义 browserify 选项
    var customOpts = {
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    };
    return browserify(customOpts)
        .plugin(tsify)
        // 在这里加入变换操作
        .transform('babelify')
        .bundle()
        .pipe(source('bundle.js'))
        // 可选项，如果你不需要缓存文件内容，就删除
        .pipe(buffer())
        // 可选项，如果你不需要 sourcemaps，就删除
        .pipe(sourcemaps.init({ loadMaps: true })) // 从 browserify 文件载入 map
        .pipe(uglify())
        .pipe(sourcemaps.write('./')) //写入 .map 文件
        .pipe(gulp.dest("dist"));
});
// 当任何依赖发生改变的时候，运行打包工具
watchedBrowserify.on("update", bundle);
// 输出编译日志到终端
watchedBrowserify.on("log", gutil.log);


