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
    overrides: {
      symb: (symbol: djot.Symb, renderer: djot.HTMLRenderer) => {
        if (symbol.alias.startsWith("si-")) {
          const iconName = symbol.alias.substring(3);
          return `<img class="text-icon" src="/icons/${iconName}.svg">`;
        }
        return renderer.renderAstNodeDefault(symbol);
      },
    },
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
site.copy("/icons")

export default site;
