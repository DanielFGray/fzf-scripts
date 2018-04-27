#!/usr/bin/env bash

declare by_size

has() {
  local verbose=0
  if [[ $1 = '-v' ]]; then
    verbose=1
    shift
  fi
  for c; do c="${c%% *}"
    if ! command -v "$c" &> /dev/null; then
      (( "$verbose" > 0 )) && err "$c not found"
      return 1
    fi
  done
}

err() {
  printf "\e[31m%s\e[0m\n" "$*" >&2
}

die() {
  (( $# > 0 )) && err "$*"
  exit 1
}

select_from() {
  local o c cmd OPTARG OPTIND
  cmd='command -v'
  while getopts 'c:' o; do
    case "$o" in
      c) cmd="$OPTARG" ;;
    esac
  done
  shift "$((OPTIND-1))"
  for c; do
    if $cmd "${c%% *}" &> /dev/null; then
      echo "$c"
      return 0
    fi
  done
  return 1
}

has -v fzf expac || die

fzf() {
  command fzf -e --multi --no-hscroll --inline-info --cycle --bind='Ctrl-a:toggle-all' "$@"
}

case $1 in
  -s|--size) by_size=1; shift;
esac

if (( $# > 0 )); then
  sudo pacman -Rcusn "$@"
  exit
fi

preview=$(select_from pacaur pacman)

if (( by_size )); then
  mapfile -t pkgs < <(expac -H M '%m\t%n' | sort -hr | fzf +s --preview="$preview --color=always -Si {3}" -q '!^lib ' | cut -f2)
else
  mapfile -t pkgs < <(expac '%n' | fzf +s --preview="$preview --color=always -Si {1}" -q '!^lib ' | cut -d' ' -f1)
fi

(( ${#pkgs[@]} > 0 )) && sudo pacman -Rcusn "${pkgs[@]}"
