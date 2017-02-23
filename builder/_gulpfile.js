
// devDependencies
var gulp = require("gulp"),


        // TOOLS
            gulp_useref = require("gulp-useref"),
            gulp_if = require("gulp-if"),
            gulp_lazypipe = require("lazypipe"),
            gulp_rename = require("gulp-rename"),
            gulp_plumber  = require("gulp-plumber"),
            gulp_sourcemaps  = require("gulp-sourcemaps"),
            gulp_notify = require("gulp-notify"),
            gulp_connect = require("gulp-connect"),
            gulp_open = require("gulp-open"),
            gulp_clean = require("gulp-clean"),

        // CSS
             gulp_sass  = require("gulp-sass"),
             gulp_autoprefixer  = require("gulp-autoprefixer"),
             gulp_cssnano  = require("gulp-cssnano"),

           //JS
            gulp_uglify=require("gulp-uglify"),

            // IMAGES
            gulp_imagemin=require("gulp-imagemin");



// config
var config = {
    dist:"../dist/",
    src:"../src/"
}

// DEFAULT
gulp.task("default",["build"], function() {
gulp_notify("Gulp launched !");
})

// BUILD DIST FILES
gulp.task("build", ["fonts","sass","js-html","images","openBrowser","watch"], function() {
gulp_notify("dist built");
})

// WATCH FILES CHANGES

gulp.task("watch", function() {
    gulp.watch(config.src+"styles/**/*.scss", ["sass"]);
    gulp.watch(config.src+"js/**/*.js", ["js"]);
    gulp.watch(config.src+"**.html", ["js-html"]);
});



// BROWSER SYNC & LAUNCH

gulp.task('connect', function() {
  gulp_connect.server({
    root: '../dist/',
    port: 8888,
    livereload: true
  });
});

gulp.task("openBrowser", ["connect"], function() {
    gulp.src("./")
    .pipe(gulp_open({uri: 'http://localhost:8888', app:'chrome'}));
})



// GULP TASKS

    // Clean images directory --wip
gulp.task("clean", function() {
    return gulp.src(config.dist+"/img", {read: false})
        .pipe(gulp_clean({force:true}))
})

    // Move from src to dist
gulp.task("fonts", function() {
    return gulp.src(config.src+'fonts/**/**')
    .pipe(gulp.dest(config.dist+"fonts"))
})

    // Minimify images
gulp.task("images",["clean"], function() {
    gulp.src(config.src+'img/*')
        .pipe(gulp_imagemin())
        .pipe(gulp.dest(config.dist+'img'))
})

    // SASS --> CSS --> Autoprefix --> Rename
gulp.task('sass', function() {
return gulp.src(config.src+'styles/main.scss')
    .pipe(gulp_plumber({
        errorHandler: gulp_notify.onError('SASS Error: <%= error.message %>')
    }))
    .pipe(gulp_sourcemaps.init())
    .pipe(gulp_sass().on('error', gulp_sass.logError))
    .pipe(gulp_autoprefixer({
        browsers:["last 2 versions"]
    }))
    .pipe(gulp_cssnano())
    .pipe(gulp_sourcemaps.write())
    .pipe(gulp_rename("main.min.css"))
    .pipe(gulp.dest(config.dist+'assets/css'))
    .pipe(gulp_notify('SASS compiled: <%= file.relative %>'))
    .pipe(gulp_connect.reload())
});

    // All js --> One js --> Uglify
gulp.task('js-html', function () {
    return gulp.src(config.src+'*.html')
        .pipe(gulp_useref({}, gulp_lazypipe().pipe(gulp_sourcemaps.init, { loadMaps: true })))
        .pipe(gulp_if('*.js',
            gulp_uglify()
    ))
        .pipe(gulp_sourcemaps.write('maps'))
        .pipe(gulp.dest(config.dist))
        .pipe(gulp_connect.reload())
});
