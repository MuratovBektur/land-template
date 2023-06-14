const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const fs = require("fs");

const dataJsonPath = "src/data.json";

// clean css style before updating style
gulp.task("clean", function () {
  return del(["dist/assets/style/main.css"]);
});

gulp.task("styles", () =>
  gulp
    .src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie11" }))
    .pipe(gulp.dest("dist/assets/style"))
);

gulp.task("copy-img", function () {
  return gulp.src("src/images/**/*").pipe(gulp.dest("dist/assets/images"));
});

gulp.task("copy-js", () =>
  gulp.src("src/script/*.js").pipe(gulp.dest("dist/assets/script"))
);
gulp.task("copy-doc", function () {
  return gulp.src("src/doc/*").pipe(gulp.dest("dist/assets/doc"));
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
    .src("src/template/index.hbs")
    .pipe(handlebars(templateData, templateOptions))
    .pipe(rename("index.html"))
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", () => {
  gulp.watch("src/scss/*.scss", (done) => {
    gulp.series(["clean", "styles"])(done);
  });
  gulp.watch("src/images/**/*", (done) => {
    gulp.series(["copy-img"])(done);
  });
  gulp.watch("src/script/*.js", (done) => {
    gulp.series(["copy-js"])(done);
  });
  gulp.watch("src/doc/*", (done) => {
    gulp.series(["copy-doc"])(done);
  });
  gulp.watch("src/template/**/*", (done) => {
    gulp.series(["template"])(done);
  });
  gulp.watch(dataJsonPath, (done) => {
    gulp.series(["template"])(done);
  });
});

gulp.task(
  "default",
  gulp.series([
    "clean",
    "styles",
    "copy-img",
    "copy-js",
    "copy-doc",
    "template",
  ])
);
