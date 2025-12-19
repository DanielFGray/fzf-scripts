PREFIX ?= /usr/local
BINDIR = $(PREFIX)/bin

SCRIPTS = $(shell find . -maxdepth 1 -type f -executable -printf '%f\n')

install:
	install -d $(BINDIR)
	install -m 755 $(SCRIPTS) $(BINDIR)/

uninstall:
	cd $(BINDIR) && rm -f $(SCRIPTS)

install-%:
	install -d $(BINDIR)
	install -m 755 $* $(BINDIR)/

uninstall-%:
	rm -f $(BINDIR)/$*
