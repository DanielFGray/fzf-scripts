# fzf-scripts

This is a collection of scripts I've written that use [fzf](https://github.com/junegunn/fzf)

Almost all of them require various tools from coreutils like `awk` `sed` `cut`, and probably make use of GNU extensions.

## [fv](fv)

Lists or searches for files and opens them with a command, defaults to `vim`. Kind of a shortcut for `vim $(ag 'foo' | fzf)`, lists files if no search string is given.

## [fzgit](fzgit)

Interactive git wrapper. Very much still a work in progress, but it has some very cool functions already.

*depends on `git` and `perl`*

## [fzbuku](fzbuku)

A small wrapper around [buku](https://github.com/jarun/Buku) to search bookmarks

## [fzmp](fzmp)

Lists and searches for songs in an MPD library by artist, album, or playlist. I wrote a [blog post](https://danielfgray.gitlab.io/computers/fzmp) about writing this script.

*depends on `mpc`*

## [fzmv](fzmv)

Interactively move files. It was originally just an experiment to see what it would be like to make a file explorer with fzf.

## [fzrepl](fzrepl)

runs stdin against programs like sed, awk, jq and shows the result in the preview window

## [goog](goog)

Google search from the command line. This is now broken since google deprecated the API I used and I have yet to update to the newer version..

*depends on `jq` and `curl`*

## [igr](igr)

Interactive rg wrapper 

## [ix](ix)

Uploads files to [ix.io](http://ix.io) and allows listing and editing of uploads.

*depends on `curl`*

## [js](js)

Searches [npmjs.com](https://npmjs.com) and installs packages with `yarn` if available or `npm`.

*depends on npm and [jq](https://stedolan.github.io/jq/)*

## [pkgsearch](pkgsearch)

Searches repos and installs multiple packages. Currently works with Debian, Ubuntu and Arch, and experimental support for Fedora and Void.

## [pkgrm](pkgrm)

Lists and removes packages, optionally sorts by size.

*depends on `pacman`*

## [sshget](sshget)

Lists files from remote servers and `rsync`s them to the current directory

## [wifi](wifi)

List and connect to wifi networks

*depends on `nmcli`*

# Install

Currently there's no installation script, but if you clone the repo you can easily symlink the scripts here with something like:

``` sh
cd /path/to/repo/fzf-scripts
find -maxdepth 1 -executable -type f -exec ln -s -t $HOME/.local/bin $PWD/fzf-scripts/{} \;
```

# Notable Mentions

* [forgit](https://github.com/wfxr/forgit) - a better version of fzgit
* [fzf-tab](https://github.com/Aloxaf/fzf-tab) - use fzf to tab-complete everything in your shell

# Legal
Copyright (C) 2016 Daniel F Gray <DanielFGray@gmail.com>

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
