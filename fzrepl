#!/usr/bin/env bash

usage() {
  less -FEXR <<'HELP'
fzrepl
  interactively edit stdin using stream filters like awk, sed, jq

  -c, --cmd      command used to filter input
  -q, --query    default command string to use

command history can be saved to a file by setting the environment variable
FZREPL_FILE

examples:
  echo 'foo bar' | fzrepl -c 'awk {q}' -q '{print}'
  echo 'hello world' | fzrepl -q p 'sed -n {q}'
  FZREPL_FILE=jqhistory fzrepl jq package.json
HELP
}

# TODO: better "wrapping", this is painful:
# fzrepl 'node -e {q}' -q "done = data => data;\nlet A='';process.stdin.on('data',x=>A=A.concat(x.toString())).on('end',()=>{let d = done(A);process.stdout.write(`${String.prototype.trim.call(typeof d==='string'?d:JSON.stringify(d,null,2))}\n`)})"

declare tmpfile=/tmp/fzreplinput
declare cmd
declare default_query
declare output

declare -A colors
colors[red]=$(tput setaf 1)
colors[green]=$(tput setaf 2)
colors[reset]=$(tput sgr0)

cleanup() {
  [[ -e "$tmpfile" ]] && rm "$tmpfile"
}
trap cleanup SIGHUP SIGINT SIGTERM

color() {
  local color
  color="$1"; shift
  printf '%s' "${colors[$color]}" "$*" "${colors[reset]}"
}

err() {
  color red "$@" >&2
  return 1
}

die() {
  (( $# > 0 )) && err "$@"
  exit 1
}

for arg; do
  case $arg in
    -q|--query)
      [[ -z $2 || $2 = -* ]] && die "missing argument to $1"
      default_query="$2"
      shift 2 ;;
    -c|--cmd)
      [[ -z $2 || $2 = -* ]] && die "missing argument to $1"
      cmd="$2"
      shift 2 ;;
    -h|--help) usage; exit ;;
    *) break 2;
  esac
done

if [[ -z $cmd && -n $1 && ! -f $1 ]]; then
  cmd="$1"
  shift
fi

if [[ -z $cmd ]]; then
  usage
  exit 1
fi

if [[ $cmd != *'{q}'* ]]; then
  cmd+=' {q}'
fi

if [[ -n $1 && -f $1 ]]; then
  file=$1
  shift
fi

if [[ -z $file ]]; then
  file=/dev/stdin
fi

mapfile -t REPLY < <(
  tee "$tmpfile" < "$file" | fzf \
    --sync \
    --ansi \
    --height=100% \
    --phony \
    --print-query \
    --query="$default_query" \
    ${FZREPL_FILE:+--history=$FZREPL_FILE} \
    --preview="$cmd < '$tmpfile'"
)

q="${REPLY[0]}"
q=${q@Q}
echo "${cmd//'{q}'/$q}"
