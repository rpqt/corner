import lume from "lume/mod.ts";
import nav from "lume/plugins/nav.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import { djotRender } from "./_djot.ts";

const site = lume();

site.use(nav());
site.use(codeHighlight());

site.use(googleFonts({
  cssFile: "/styles/main.css",
  placeholder: "/* import fonts */",
  fonts: {
    "Atkinson Hyperlegible": "https://fonts.google.com/share?selection.family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700",
    "JetBrains Mono": "https://fonts.google.com/share?selection.family=JetBrains+Mono:ital,wght@0,100..800;1,100..800",
  },
}));

site.copy("/styles");
site.copy("favicon.svg");

site.data("djot", djotRender);
site.filter("djot", djotRender);

export default site;
