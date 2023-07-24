const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const fs = require("fs");
const replace = require("gulp-replace");
const base64 = require("gulp-base64-inline");
const beautify = require("gulp-jsbeautifier");

const dataJsonPath = "src/data.json";

const distFolder = "dist-course";

gulp.task("styles", () =>
  gulp
    .src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie11" }))
    .pipe(gulp.dest(`${distFolder}/assets/style`))
);

gulp.task("template", () => {
  const templateData = JSON.parse(fs.readFileSync(dataJsonPath));

  const templateOptions = {
    ignorePartials: true,
    partials: {
      footer: "<footer>the end</footer>",
    },
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
    .src("src/template/course/index.hbs")
    .pipe(handlebars(templateData, templateOptions))
    .pipe(rename("index.html"))
    .pipe(
      replace(/<img.*?src="(.*?)".*\/>/g, function handleReplace(s) {
        const src = s.replace(/.*src="([^"]*)".*/, "$1");
        if (!src) return s;
        return s.replace(src, `inline(${src})`).replace("./assets", "../..");
      })
    )
    .pipe(
      base64(``, {
        prefix: "",
        suffix: "",
      })
    )
    .pipe(
      replace(/<link.*?href="(.*?)".*?>/g, function handleReplace(s) {
        const src = s.replace(/.*href="([^"]*)".*/, "$1");
        const filename = src.replace(
          "./assets/style",
          `${distFolder}/assets/style`
        );
        const style = fs.readFileSync(filename, "utf8");
        const styleTag = `<style> ${style} </style>`;
        return styleTag;
      })
    )
    .pipe(
      replace(/<script.*?src="(.*?)"><\/script>/g, function handleReplace(s) {
        const src = s.replace(/.*src="([^"]*)".*/, "$1");
        const filename = src.replace("./assets/script", "src/script");
        let script = fs.readFileSync(filename, "utf8");
        // remove all comments
        script = script.replaceAll(/\/\/.*?\n/g, "");
        const scriptTag = `<script defer> ${script} </script>`;
        return scriptTag;
      })
    )
    .pipe(gulp.dest(`${distFolder}/`));
});

gulp.task("clean", function () {
  return del([`${distFolder}/assets`]);
});

gulp.task("beautify", () =>
  gulp
    .src(`${distFolder}/*.html`)
    .pipe(beautify())
    .pipe(gulp.dest(`${distFolder}`))
);

gulp.task("default", gulp.series(["styles", "template", "clean", "beautify"]));
