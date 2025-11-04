#let is-translation-dict(d) = d.keys().first().len() == 2

#let localize(lang, s) = {
  
  let localize-dict(s) = {
    if is-translation-dict(s) {
      localize(lang, s.at(lang))
    } else {
      let t = (:)
      for (k, v) in s {
        t.insert(k, localize(lang, v))
      }
      t
    }
  }
  
  let localize-array(s) = s.map(localize.with(lang))
  
  if type(s) == array { localize-array(s) }
  else if type(s) == dictionary { localize-dict(s) }
  else { s }
}