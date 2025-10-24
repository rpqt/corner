data := $(wildcard _data/**/*.yml)

all: all.pdf fr.pdf en.pdf

%.pdf: %.typ main.typ $(data)
	typst compile $*.typ
