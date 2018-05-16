#!/usr/bin/env bash

declare -a args
declare -a packages
declare savedev=0
declare global=0

declare -A colors
colors[red]=$(tput setaf 1)
colors[green]=$(tput setaf 2)
colors[reset]=$(tput sgr0)

usage() {
  LESS=-FEXR less <<-HELP
npmsearch [options] [packages]
  searches npm for packages

  -r, --remove
    list and remove packages from package.json

to increase the amount of packages shown when searching, try:
  npm config set searchlimit 40

HELP
}

color() {
  local color="$1"; shift
  printf '%s' "${colors[$color]}"
  printf '%s\n' "$@"
  printf '%s' "${colors[reset]}"
}

err() { color red "$@" >&2; return 1; }

die() {
  (( $# > 0 )) && err "$@"
  exit 1
}

has() {
  local v c
  if [[ $1 = '-v' ]]; then
    v=1
    shift
  fi
  for c; do c="${c%% *}"
    if ! command -v "$c" &> /dev/null; then
      (( v > 0 )) && err "$c not found"
      return 1
    fi
  done
}

select_from() {
  local cmd='command -v'
  for a; do
    case "$a" in
      -c) cmd="$2"; shift 2 ;;
    esac
  done
  for c; do
    if $cmd "${c%% *}" &> /dev/null; then
      echo "$c"
      return 0
    fi
  done
  return 1
}

has -v fzf npm || die

fzf() {
  command fzf --inline-info --ansi --reverse +s --no-hscroll "$@"
}

if [[ $1 = '-h' || $1 = '--help' ]]; then
  usage
  exit
fi

if [[ $1 = '-r' || $1 = '--remove' ]]; then
  shift
  mapfile -t rm < <(
    jq -r '{dependencies, devDependencies} | .[] | keys | .[]' package.json |
      fzf -m --cycle -e --reverse --query="$*")
    (( ${#rm} > 0 )) && $(select_from 'yarn remove' 'npm uninstall') "${rm[@]}"
  die
fi

printf '%ssearching...%s\r' "${colors[green]}" "${colors[reset]}"
search=$(npm search --json "$*") || exit

search=$(jq -r '.[] | "\(.name)|\(.version)|\(.description)"' <<< "$search" | column -t -s'|')

mapfile -t packages < <(fzf --multi \
  --bind='ctrl-x:toggle-preview' \
  --expect='ctrl-g,ctrl-d,enter,ctrl-v,esc' \
  --preview-window='hidden:down' \
  --preview="npm -s --json view {1} | jq -C \"del(.users, .time, .versions)\"" \
  --header='C-d saves as devDependency, C-g installs globally, C-v for specific version, C-x for more info, ' \
  <<< "$search")

key="${packages[0]}"
case "${key,,}" in
  esc) die ;;
  ctrl-d) savedev=1 ;;
  ctrl-g) global=1 ;;
  ctrl-v)
    package="${packages[1]%% *}"
    mapfile -t version < <(
      npm -s --json view "$package" |
        jq -r '.versions[]' |  # label with .dist-tags?
        fzf --header="choose version for $package  |  C-d saves as devDependency" --tac --expect='ctrl-d,esc')
    key="${version[0]}"
    case "${key,,}" in
      esc) die ;;
      ctrl-d) savedev=1 ;;
    esac
    packages=( "${package}@${version[1]}" )
    ;;
esac

(( ${#packages[@]} > 0 )) || die 'no packages to install'

if (( ${#packages[@]} > 1 )); then
  packages=( "${packages[@]:1}" )
  packages=( "${packages[@]%% *}" )
fi

printf '%sinstalling...%s\r' "${colors[green]}" "${colors[reset]}"
if (( global > 0 )); then
  npm install -g "${args[@]}" "${packages[@]}"
elif has yarn; then
  (( savedev > 0 )) && args+=( -D )
  yarn add "${args[@]}" "${packages[@]}"
else
  if (( savedev > 0 )); then
    args+=( -D )
  else
    args+=( -S )
  fi
  npm i "${args[@]}" "${packages[@]}"
fi
