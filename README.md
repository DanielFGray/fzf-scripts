# fzf-scripts

This is a collection of scripts I've written that use [fzf](https://github.com/junegunn/fzf)

Almost all of them require various tools from coreutils like `awk` `sed` `cut`.

## fv

Lists or searches for files and opens them with a command, defaults to `vim`. Kind of a shortcut for `vim $(ag 'foo' | fzf)`, lists files if no search string is given.

## fzgit

Interactive git wrapper. Very much still a work in progress, but it has same very cool functions already.

*depends on `git`*

## fzmp

Lists and searches for songs in an MPD library by artist, album, or playlist. I wrote a [blog post](https://danielfgray.github.io/computers/fzmp) about writing this script.

*depends on `mpc`*

## fzmv

Interactively move files. It was originally just an experiment to see what it would be like to make a file explorer with fzf.

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

# Legal
Copyright (C) 2016 Daniel F Gray <DanielFGray@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
