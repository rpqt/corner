import lume from "lume/mod.ts";
import nav from "lume/plugins/nav.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import djotPlugin from "./_djot.ts";
import djot from "@djot/djot";

const site = lume();

site.filter("lowercasePL", (lang: string) => {
  switch (lang) {
    case "C++":
      return "cpp";
    case "C#":
      return "csharp";
    case "Python 3":
      return "python3";
    default:
      return lang.toLowerCase();
  }
});

site.use(nav());
site.use(codeHighlight());

site.use(djotPlugin({
  renderOptions: {
  },
}));

site.use(googleFonts({
  cssFile: "/styles/main.css",
  placeholder: "/* import fonts */",
  fonts: {
    "Atkinson Hyperlegible Next":
      "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800",
    "JetBrains Mono": "https://fonts.google.com/share?selection.family=JetBrains+Mono:ital,wght@0,100..800;1,100..800",
  },
}));

site.copy("/styles");
site.copy("favicon.svg");

export default site;
