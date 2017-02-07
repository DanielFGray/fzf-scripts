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

nmcli -d wifi rescan 2> /dev/null
network=$(nmcli --color yes device wifi | fzf --ansi --height=40% --reverse --cycle --inline-info --header-lines=1)
[[ -z "$network" ]] && exit
network=$(sed -r 's/^\s*\*?\s*//; s/\s*(Ad-Hoc|Infra).*//' <<< "$network")
echo "connecting to \"${network}\"..."
nmcli -a device wifi connect "$network"
