#import "main.typ": mkCV
#let languages = ("fr", "en")
#languages.map(mkCV).join()
