# fzf-scripts

This is a collection of scripts I've written that use [fzf](https://github.com/junegunn/fzf)

Almost all of them require various tools from coreutils like `awk` `sed` `cut`.

## fv

Lists or searches for files and opens them with a command, defaults to `vim`. Kind of a shortcut for `vim $(ag 'foo' | fzf)`, lists files if no search string is given.

## fzgit

Interactive git wrapper.

*depends on `git`*

## fzmp

Lists and searches for songs in an MPD library by artist, album, or playlist.

*depends on `mpc`*

## fzmv

Interactively move files.

## ix

Uploads files to http://ix.io and allows listing and editing of uploads.

*depends on `curl`*

## pkgsearch

Searches Debian/Ubuntu and Arch repos (including the AUR) and installs multiple packages.

## sshget

Lists files from remote servers and `rsync`s them to the current directory

## wifi

List and connect to wifi networks

*depends on `nmcli`*
