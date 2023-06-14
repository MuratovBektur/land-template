const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const fs = require("fs");
const replace = require("gulp-replace");
const beautify = require("gulp-jsbeautifier");
const strip = require("gulp-strip-comments");

const dataJsonPath = "src/data.json";

const distFolder = "dist-ftp";

// clean css style before updating style
gulp.task("clean", function () {
  return del([`${distFolder}/assets/style/main.css`]);
});

gulp.task("styles", () =>
  gulp
    .src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie11" }))
    .pipe(gulp.dest(`${distFolder}/assets/style`))
);

gulp.task("copy-vendor-styles", function () {
  return gulp
    .src("src/vendor-styles/*.css")
    .pipe(gulp.dest(`${distFolder}/assets/style`));
});

gulp.task("copy-img", function () {
  return gulp
    .src("src/images/**/*")
    .pipe(gulp.dest(`${distFolder}/assets/images/`));
});

gulp.task("copy-js", function () {
  return gulp
    .src("src/script/*.js")
    .pipe(strip())
    .pipe(gulp.dest(`${distFolder}/assets/script`));
});
gulp.task("copy-doc", function () {
  return gulp.src("src/doc/*").pipe(gulp.dest(`${distFolder}/assets/doc`));
});
gulp.task("copy-conf", function () {
  return gulp.src("src/conf.json").pipe(gulp.dest(`${distFolder}/`));
});

gulp.task("template", () => {
  const templateData = JSON.parse(fs.readFileSync(dataJsonPath));

  const templateOptions = {
    ignorePartials: true,
    batch: ["./src/template/partials"],
    helpers: {
      math: function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue,
        }[operator];
      },
      ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  };

  return gulp
    .src("src/template/ftp/*.hbs")
    .pipe(handlebars(templateData, templateOptions))
    .pipe(
      rename(function (path) {
        path.extname = ".html";
      })
    )
    .pipe(replace('<div class="template-content"></div>', "{{@content}}"))
    .pipe(replace('<div class="payment-start"></div>', "{{@payment}}"))
    .pipe(replace('<div class="payment-end"></div>', "{{@end-payment}}"))
    .pipe(gulp.dest(`${distFolder}/`));
});

gulp.task("beautify", () =>
  gulp
    .src(`${distFolder}/*.html`)
    .pipe(beautify())
    .pipe(gulp.dest(`${distFolder}`))
);

gulp.task(
  "default",
  gulp.series([
    "clean",
    "styles",
    "copy-vendor-styles",
    "copy-conf",
    "copy-img",
    "copy-js",
    "copy-doc",
    "template",
    "beautify",
  ])
);
