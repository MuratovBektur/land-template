const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const pug = require("gulp-pug");
const uglify = require("gulp-uglify");
const data = require("gulp-data");
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
  return gulp.src("src/img/*").pipe(gulp.dest("dist/assets/img"));
});

// Minifying JS files
gulp.task("script", () =>
  gulp
    .src("src/script/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/assets/script"))
);
gulp.task("pug", () =>
  gulp
    .src("src/pug/index.pug")
    .pipe(
      data(function () {
        return JSON.parse(fs.readFileSync(dataJsonPath));
      })
    )
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest("dist"))
);

gulp.task("watch", () => {
  gulp.watch("src/scss/*.scss", (done) => {
    gulp.series(["clean", "styles"])(done);
  });
  gulp.watch("src/img/*", (done) => {
    gulp.series(["copy-img"])(done);
  });
  gulp.watch("src/script/*.js", (done) => {
    gulp.series(["script"])(done);
  });
  gulp.watch("src/pug/*.pug", (done) => {
    gulp.series(["pug"])(done);
  });
  gulp.watch(dataJsonPath, (done) => {
    gulp.series(["pug"])(done);
  });
});

gulp.task(
  "default",
  gulp.series(["clean", "styles", "copy-img", "script", "pug"])
);
