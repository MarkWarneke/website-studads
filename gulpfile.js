// generated on 2016-10-26 using generator-webapp 2.2.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
var ghPages = require('gulp-gh-pages');
const imagemin = require('gulp-imagemin');
var gutil = require('gulp-util');
var ftp = require( 'vinyl-ftp' );
var fs = fs = require('fs');
var shell = require('gulp-shell');

var conf = JSON.parse(fs.readFileSync('./ftp.conf'));

/** Configuration **/
var user = conf.user;
var password = conf.sec;  
var host = conf.host;  
var port = conf.port;    
var remoteFolder = conf.remoteFolder;

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*.{jpg,png}')
    .pipe(imagemin({
            progressive: true,
            use: [imagemin.jpegtran(), imagemin.optipng()]
        }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('cpSvg', shell.task([
  'cp app/images/*.svg dist/images'
]));

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
    browserSync({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }, 
      browser: 'google chrome canary'
    });

    gulp.watch([
      'app/*.html',
        'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('app/styles/**/*.scss', ['styles']);
      gulp.watch('app/scripts/**/*.js', ['scripts']);
      gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    },
    browser: 'google chrome canary'
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras', 'cpSvg'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  runSequence(['clean', 'wiredep'], 'build');
});

//git subtree push --prefix dist origin gh-pages
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages())
    .on('error', onError('gitPushHard'));
});

// Convenience handler for error-level errors.
// execute Gulp task by name for error handling
function onError(error) { gulp.start(error);}

// Task that emits an error that's treated as an error.
gulp.task('gitPushHard', shell.task([
  'git subtree push --prefix dist origin gh-pages'
]));

// helper function to build an FTP connection based on our configuration
function getFtpConnection() {  
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 5,
        log: gutil.log
    });
}

gulp.task( 'ftp', function () {

  console.log(user, host, port, remoteFolder);

  var conn = getFtpConnection();

    var globs = [
        'dist/**'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: './dist', buffer: false } )
        .pipe( conn.newer( '/studads' ) ) // only upload newer files
        .pipe( conn.dest( '/studads' ) );

} );
