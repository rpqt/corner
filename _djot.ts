import djot from "@djot/djot";
import Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";

// Djot does not export these types
type Filter = object;
type HTMLRenderOptions = object;

export interface Options {
  /** The list of file extensions this plugin applies to */
  extensions?: string[];

  filters?: Filter[];

  /** Options passed to djot library */
  renderOptions?: HTMLRenderOptions;
}

// Default options
export const defaults: Options = {
  extensions: [".dj", ".djot"],
};

function extractTitle(ast: djot.Doc): string {
  const firstSection = ast.children.find((c) => c.tag == "section");
  const firstHeading: djot.Heading | undefined = firstSection?.children.find(
    (c) => c.tag == "heading",
  );
  const headingContent = firstHeading?.children.at(0);
  const title = headingContent?.tag == "str" ? headingContent.text : undefined;
  return title ?? "No title";
}

export async function djotLoader(path: string | URL) {
  const content = await Deno.readTextFile(path);
  const ast = djot.parse(content);
  const title = extractTitle(ast);

  return {
    title,
    content,
  };
}

const stripMarkupSourceLinks: Filter = () => {
  return {
    link: (el: djot.Link) => {
      if (el.destination) {
        el.destination = el.destination.replace(
          /(.(?:dj|md))(#[^.\s]+)?$/,
          (_match: string, _ext: string, section: string) => {
            return section ?? "";
          },
        );
      }
    },
  };
};

const defaultFilters = [
  stripMarkupSourceLinks,
];

export class DjotEngine implements Lume.Engine {
  filters: Filter[];
  renderOptions?: HTMLRenderOptions;

  constructor(filters: Filter[] = [], renderOptions?: HTMLRenderOptions) {
    this.filters = [...defaultFilters, ...filters];
    this.renderOptions = renderOptions;
  }

  render(
    content: string | djot.Doc,
    _data?: Record<string, unknown>,
    _filename?: string,
  ): string {
    if (typeof content === "string") {
      content = djot.parse(content);
    }

    this.filters.forEach((filter, _index, _array) => {
      djot.applyFilter(content, filter);
    });

    return djot.renderHTML(
      content,
      this.renderOptions,
    );
  }

  addHelper() {}

  deleteCache() {}
}

export default function (userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return function (site: Site) {
    const engine = new DjotEngine(options.filters, options.renderOptions);

    site.loadPages(options.extensions, {
      loader: djotLoader,
      engine,
    });

    site.filter("djot", (content) => engine.render(content as string));
  };
}
