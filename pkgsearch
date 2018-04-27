#!/usr/bin/env bash

declare -r esc=$'\033'
declare -r c_reset="${esc}[0m"
declare -r c_red="${esc}[31m"
declare -r c_green="${esc}[32m"
declare -r c_blue="${esc}[34m"
declare distro
declare preview_pos='right:hidden'

usage() {
  LESS=-FEXR less <<HELP
pkgsearch [options] [query]
  lists and installs packages from your distro's repositories

  without any arguments pkgsearch will list all available packages from your cache
  note: on Arch Linux you must pass a string to query the AUR
HELP
}

err() {
  printf "${c_red}%s${c_reset}\n" "$*" >&2
}

die() {
  exit 1
}

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

select_from() {
  local cmd='command -v'
  for a; do
    case "$a" in
      -c)
        cmd="$2"
        shift 2
        ;;
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

fzf() {
  command fzf -e +s --multi --cycle --ansi \
    --bind='Ctrl-X:toggle-preview' \
    --no-hscroll --inline-info \
    --header='tab to select multiple packages, Ctrl-X for more info on a package' "$@"
}

install() {
  local pkgs count
  mapfile -t pkgs
  (( ${#pkgs} > 0 )) || exit
  count="${#pkgs[@]} package"
  (( ${#pkgs[@]} > 1 )) && count+='s'
  printf "installing %s: %s\n" "$count" "${pkgs[*]}"
  $1 "${pkgs[@]}" < /dev/tty
}

debian() {
  fzf --preview='apt-cache show {1}' \
      --query="$1" \
    < <(apt-cache search '.*' | sort |
      sed -u -r "s|^([^ ]+)|${c_green}\1${c_reset}|") |
    cut -d' ' -f1 |
    install "sudo $(select_from 'apt' 'aptitude' 'apt-get') install"
}

arch() {
  local search packages
  search='pacman'
  [[ -n "$1" ]] && search=$(select_from 'pacaur' 'trizen' 'yaourt' 'packer' 'apacman' 'pacman')
  packages=$(fzf --preview="$search -Si {2}" \
    < <( $search -Ss "$1" |
      gawk '{
        getline descr;
        sub(/ */,"", descr);
        repo = blue "[" gensub(/\/.*/, "", 1) "]" reset;
        name = green gensub(/.*\//, "", 1, $1) reset;
        info = gensub(/[^ ]* /, "", 1);
        print repo, name, info, descr;
      }' blue="$c_blue" green="$c_green" reset="$c_reset"
    ) | cut -d' ' -f2)
  [[ "$search" = "pacman" ]] && search="sudo pacman"
  install "$search -S" <<< "$packages"
}

void() {
  local package_list packagename='{ sub(/-[^\-]*$/, "", $2); print $2 }'
  package_list=$(xbps-query -Rs '' | sort)
  fzf --preview="p=\$(awk \"$packagename\" <<< {}); xbps-query -Rx \$p" \
      --query="$1" <<< "$package_list" |
    awk "$packagename" |
    install 'xbps-install -S'
}

fedora() {
  fzf --query="$*" --preview='p={}; p="${p%% *}"; dnf -q info "${p%.*}"' \
    < <(dnf -qC repoquery --qf "${c_green}%{name} ${c_reset} - %{summary}" \*) |
    awk '{ package=$1; sub(/\.\S+/, "", package); print package }' |
    install 'sudo dnf install'
}

while true; do
  case "$1" in
    -h|--help) usage; exit ;;
    -p|--preview) preview_pos="$2"; shift 2 ;;
    *) break
  esac
done

has -v fzf gawk || die

request="$*"

if [[ -r /etc/os-release ]]; then
  distro=$(awk -F'=' '"NAME" == $1 { gsub("\"", "", $2); print tolower($2); }' /etc/os-release)
  distro="${distro%% *}"
fi

case "$distro" in
  debian|ubuntu) debian "$request" ;;
  arch) arch "$request" ;;
  void) void "$request" ;;
  fedora) fedora "$request" ;;
  *) die 'unknown distro :(' ;;
esac

# TODO: homebrew: brew desc -s
# sample output: https://pastebin.com/raw/3frRf6C7
