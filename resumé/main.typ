#import "localize.typ": localize

#let languages = ("fr", "en")

#set page(
  paper: "a4",
  columns: 2,
  margin: 10mm,
)

#languages.map(language => [

#set text(lang: language)
#let accent-color = rgb(0x06, 0x92, 0xaa, 255)

#let load-section(path) = localize(language, yaml(path))

#let education = load-section("_data/sections/education.yml")
#let experiences = load-section("_data/sections/experiences.yml")
#let hobbies = load-section("_data/sections/hobbies.yml")
#let languages = load-section("_data/sections/languages.yml")
#let skills = load-section("_data/sections/skills.yml")
#let introduction = load-section("_data/introduction.yml")

#let data = yaml("data.yml")
#let words = localize(language, yaml("_data/words.yml"))

#let tr(key) = key.split(".").fold(words, (d, k) => d.at(k)).at(language)

#let date-range(date) = [ #date.begin --- #date.end ]

#let dotted-line = line(length: 100%, stroke: (paint: black, thickness: 1pt, dash: "loosely-dotted"))

#set text(font: "Atkinson Hyperlegible Next", size: 10pt)

#show heading.where(level: 1): it => block(width: 100%, text(32pt, it.body))

#show heading.where(level: 2): it => text(
  14pt,
  fill: accent-color,
  it.body,
)
#show heading.where(level: 3): it => text(
  12pt,
  it.body,
)

#let contact-section = [
  == Contact \
  1 Rue Auguste Renoir \
  38400 Saint-Martin-d'Hères \
  (+33) 06 58 92 15 86 \
  #for email in data.emails [
    #link("mailto:" + email) \
  ]
  #link("https://rpqt.fr")
]

#place(
  top + left,
  float: true,
  scope: "parent",
  grid(
    columns: (1.3fr, 5fr, 3fr),
    align(horizon, image("profile-circle.png", width: 100%)),
    align(center + horizon, [
      = Romain Paquet
    ]),
    align(
      right,
      contact-section,
    )
  )
)

#place(
  top + left,
  float: true,
  scope: "parent",
  [
    #line(length: 100%)
    #introduction
    #line(length: 100%)
  ]
)

== #experiences.title

#experiences.items.map(experience => [
    === #experience.organisation.name --- _#(experience.position)_ \
    #date-range(experience.date), #experience.city

    *#words.context*: #eval(experience.description.context, mode: "markup")

    *#words.tasks*:
    #experience.description.tasks.map(t => [ - #t ]).join()

    *#words.themes*: #experience.themes.join(", ")

    *#words.stack*: #experience.stack.join(", ")

]).join(dotted-line);

== #skills.title

#eval(skills.content, mode: "markup")

#colbreak()

== #education.title

#education.items.map(ed => [

  === #ed.school \
  #date-range(ed.date)

  #eval(ed.description, mode: "markup")
]).join(dotted-line)

== #languages.title

#languages.items.filter(
  lang => not lang.keys().contains("_needed")
).map(lang => [
  #lang.flag #lang.name #if lang.keys().contains("level") [ (#lang.level) ]
]).join([ --- ])

== #hobbies.title

#for hobby in hobbies.items [
  #if hobby.keys().contains("items") [
    *#hobby.name*
    #hobby.items.map(i => [ - #i]).join()
  ] else [
    *#hobby.name* -- #hobby.at("content")
  ]

]

]).join()
