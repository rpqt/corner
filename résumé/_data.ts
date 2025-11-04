function is_translation_dict(d: object): boolean {
  return Object.keys(d)[0].length == 2;
}

function localize_dict(s: object, lang: string) {
  if (is_translation_dict(s)) {
    return localize(lang, s[lang]);
  } else {
    let t = Object();
    for (const [k, v] of Object.entries(s)) {
      t[k] = localize(lang, v);
    }
    return t;
  }
}

let localize_array = (s: any[], lang: string) =>
  s.map((e) => localize(lang, e));

function localize(lang: string, s: object): object {
  if (Array.isArray(s)) return localize_array(s, lang);
  else if (typeof s === "object") return localize_dict(s, lang);
  else return s;
}

export function translated(data: object, lang: string): object {
  return localize(lang, data);
}
