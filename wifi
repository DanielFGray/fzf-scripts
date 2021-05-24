#!/usr/bin/env bash

has() {
  local verbose=false
  if [[ $1 == '-v' ]]; then
    verbose=true
    shift
  fi
  for c in "$@"; do c="${c%% *}"
    if ! command -v "$c" &> /dev/null; then
      [[ "$verbose" == true ]] && err "$c not found"
      return 1
    fi
  done
}

err() {
  printf '\e[31m%s\e[0m\n' "$*" >&2
}

die() {
  (( $# > 0 )) && err "$*"
  exit 1
}

has -v nmcli fzf || die

nmcli -f 'bssid,signal,bars,freq,ssid' --color yes device wifi |
  fzf \
  --with-nth=2.. \
  --ansi \
  --height=40% \
  --reverse \
  --cycle \
  --inline-info \
  --header-lines=1 \
  --bind="enter:execute:nmcli -a device wifi connect {1}"
