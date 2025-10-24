import djot from "@djot/djot";

function extractTitle(ast: djot.Doc): string {
  const firstSection = ast.children.find((c) => c.tag == "section");
  const firstHeading: djot.Heading | undefined = firstSection?.children.find(
    (c) => c.tag == "heading",
  );
  const headingContent = firstHeading?.children.at(0);
  const title = headingContent?.tag == "str" ? headingContent.text : undefined;
  return title ?? "No title";
}

export function djotRender(content: string): string {
  return djot.renderHTML(djot.parse(content));
}

export default async function djotLoader(path: string | URL) {
  const content = await Deno.readTextFile(path);

  const ast = djot.parse(content);

  djot.applyFilter(ast, () => {
    return {
      link: (el) => {
        if (el.destination) {
          el.destination = el.destination.replace(
            /(\.dj)(#[^.\s]+)?$/,
            (_match: string, _ext: string, section: string) => {
              return section ? section : "";
            },
          );
        }
      },
    };
  });
  
  const title = extractTitle(ast);
  const html = djot.renderHTML(ast);

  return {
    title,
    content: html,
  };
}
