#!/usr/bin/env bash

declare preview='bat --color=always --style=header,numbers -H {2} {1} | grep -C3 {q}'

while getopts ':l' x; do
  case "$x" in
    l) list_files=1
      preview='bat --color=always --style=header,numbers {1} | grep -C3 {q}'
      ;;
  esac
done
shift $(( OPTIND - 1 ))
unset x OPTARG OPTIND

rg --color=always -n ${list_files:+-l} "$1" 2> /dev/null |
fzf -d: \
--ansi \
--query="$1" \
--phony \
--bind="change:reload:rg -n ${list_files:+-l} --color=always {q}" \
--bind='enter:execute:v {1}' \
--preview="[[ -n {1} ]] && $preview"
