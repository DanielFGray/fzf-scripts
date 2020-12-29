#!/usr/bin/env bash

declare -A aliases
declare -A helptext

err() { printf '%s\n' "$@" >&2; return 1; }

die() {
  (( $# > 0 )) && err "$@"
  exit 1
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
export -f has
 
aliases[s]=search
helptext['search']="search and install packages"
subcmd_search() {
  local init
  if [[ -n $1 ]]; then init=$(npm --json search "$*" | pretty_npm_search); fi
  # SHELL is needed to use exported functions if default shell is not bash
  SHELL=$(which bash) fzf \
    --inline-info \
    --query="$*" \
    --phony \
    --multi \
    --preview-window=hidden \
    --header='enter to install, C-d saves as devDependency, C-v to pick versions' \
    --bind='?:toggle-preview' \
    --bind='change:reload:npm --json search {q} | pretty_npm_search' \
    --bind='ctrl-v:execute:subcmd_ls-versions {1} <> /dev/tty' \
    --bind="enter:execute:subcmd_install {+1} <> /dev/tty" \
    --bind="ctrl-d:execute:subcmd_install -D {+1} <> /dev/tty" \
    --preview="npm view {1}" \
    <<< "$init"
}

aliases[lsv]='ls-versions'
helptext['ls-versions']='list and install versions'
subcmd_ls-versions() {
  local package="$1"
  fzf --tac --preview="npm view ${package}@{1}" \
    --header="choose version for $package | C-d saves as devDependency" \
    --bind="enter:execute:subcmd_install '${package}@{1}' <> /dev/tty" \
    --bind="ctrl-d:execute:subcmd_install -D '${package}@{1}' <> /dev/tty" \
    < <(npm --json view "$package" | jq -r '.versions[]')  # label with .dist-tags?)
}
export -f subcmd_ls-versions

aliases[un]=uninstall
helptext[uninstall]='uninstall packages'
subcmd_uninstall() {
  local rm
  mapfile -t rm < <(
    jq -r '{dependencies, devDependencies}[] | keys[]' package.json |
      fzf -m --query="$*")
  (( ${#rm} > 0 )) || return
  $(select_from 'yarn remove' 'npm uninstall') "${rm[@]}"
}

aliases[i]=install
helptext[install]='install packages'
subcmd_install() {
  if [[ -e yarn.lock ]] && has yarn; then
    yarn add "$@"
  else
    npm i -S "$@"
  fi
}
export -f subcmd_install

helptext[init]='guided project setup'
subcmd_init() {
  # shellcheck disable=2091
  $(select_from 'git-flow init -d' 'git init') > /dev/null
  npm init -y > /dev/null
  [[ -e .gitignore ]] || curl -sL https://raw.githubusercontent.com/toptal/gitignore/master/templates/Node.gitignore > .gitignore
  # install typescript? eslint? prettier? husky + lint-staged?
  # react? vue? bundlers etc
}

helptext[lint]='setup or use eslint'
subcmd_lint() { # TODO
  # should check if typescript, react, babel is installed, use relevant plugins
  if [[ $(jq '.devDependencies.eslint' package.json) = null ]]; then
    npx eslint --init
  fi
  npx eslint --ignore-path=.gitignore "$@"
}

aliases[fmt]=format
helptext[format]='setup or use prettier'
subcmd_format() { # TODO
  if [[ $(jq '.devDependencies.prettier' package.json) = null ]]; then
    subcmd_install -D prettier # eslint-{config,plugin}-prettier
  fi
  npx prettier --ignore-path .gitignore --write "$@"
}

aliases[-h]=help
helptext[help]='show this help '
subcmd_help() {
  LESS=-FEXR less <<-HELP
js [subcmd] [options]

$(for c in "${subcmds_avail[@]}"; do
  printf "    %s\n        %s\n" "$c" "${helptext[$c]}"
done)
HELP
}

pretty_npm_search() { jq -r '.[] | "\(.name) \(.version)\t\(.description[0:80])\t\(.author.name // .publisher.username)\t\((.keywords // []) | join(" "))"' | column -t -s $'\t'; }
export -f pretty_npm_search

has -v fzf jq npm || die

mapfile -t subcmds_avail < <(compgen -A function | awk '/^subcmd_/ { sub(/^subcmd_/, "", $0); print }')

if (( $# < 1 )); then
  err 'missing command'
  subcmd_help
  exit 1
elif has "subcmd_$1"; then
  subcmd="subcmd_$1"
  shift
  "$subcmd" "$@"
elif [[ -v aliases[$1] ]]; then
  subcmd=subcmd_${aliases[$1]}
  shift
  "$subcmd" "$@"
else
  err 'unknown command'
  subcmd_help
  exit 1
fi
