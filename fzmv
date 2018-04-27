#!/usr/bin/env bash

declare -r esc=$'\033'
declare -r c_reset="${esc}[0m"
declare -r c_red="${esc}[31m"
declare dryrun verbose

set -e

err() {
  printf "${c_red}%s${c_reset}\n" "$*" >&2
}

die() {
  exit 1
}

has() {
  local verbose=0
  if [[ $1 == '-v' ]]; then
    verbose=1
    shift
  fi
  for c; do c="${c%% *}"
    if ! command -v "$c" &> /dev/null; then
      (( verbose > 0 )) && err "$c not found"
      return 1
    fi
  done
}

has -v fzf || die

fzf() {
  command fzf --cycle "$@"
}

pick_files() {
  local files fzpick
  find . -maxdepth 1 2> /dev/null |
    sort -h |
    sed '1d; s|^\./||' |
    while read -r f; do
      if [[ -d "$f" ]]; then
        printf '%s/\n' "$f"
      elif [[ -L "$f" ]]; then
        printf '%s@\n' "$f"
      else
        printf '%s\n' "$f"
      fi
    done |
    fzf --multi --header='move these files'  || return 1
}

pick_destination() {
  local cwd browse_dir browse_info query dirs
  cwd=$(pwd)
  while [[ "$browse_dir" != "$cwd" ]]; do
    mapfile -t browse_info < <(
    { echo '..'; find . -maxdepth 1 -type d 2> /dev/null; } |
      sed 's|^./||' |
      sort -h |
      fzf --print-query \
      --history="${HOME}/.cache/fzmv_history" \
      --header="${errors:-move files here}")
    query=${browse_info[0]}
    browse_dir=${browse_info[1]}
    files=( "${browse_info[@]:2}" )
    [[ -d "$query" ]] && browse_dir="$query"
    [[ ! -d "$browse_dir" ]] && return 1
    if [[ "$browse_dir" == '.' && $(realpath "$browse_dir") != "$cwd" ]]; then
      realpath "$browse_dir"
      break
    else
      cd "$browse_dir" || die
      continue
    fi
  done
}

while (( $# > 0 )); do
  case $1 in
    -t|--test) dryrun=true ;;
    -v|--verbose) verbose=1 ;;
  esac
  shift
done

mapfile -t files < <(pick_files)
(( ${#files[@]} > 0 )) || exit 1
destination=$(pick_destination) || exit 1
${dryrun:+echo} mv ${verbose:+-v} -t "$destination" "${files[@]}"
