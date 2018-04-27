#!/usr/bin/env bash

# /usr/share/bash-completion/completions/git
# https://github.com/junegunn/fzf/wiki/examples#git

# declare BOLD=$(tput bold || tput md)
declare c_reset=$(tput sgr0)
declare c_green=$(tput setaf 2 || tput AF 2)
declare c_red=$(tput setaf 1 || tput AF 1)

has() { # {{{
  command -v "$1" &> /dev/null
}
# }}}

ask() { # {{{
  read -r -n1 -p "$* " ans
  echo
  [[ ${ans^} == Y* ]]
}
# }}}

err() { # {{{
    printf "${c_red}%s${c_reset}" "$*" >&2
}
# }}}

die() { # {{{
  [[ -n "$1" ]] && err "$1"
  exit 1
}
# }}}

has fzf || die 'fzf not found'
# [[ -d "$PWD/.git" ]] || die 'not a git repo'

fzf() { # {{{
  local prompt
  if [[ $1 == --prompt=* ]]; then
    prompt="${1##*=}>"
    shift
  fi
  branch=$(git status 2> /dev/null | sed 's/On branch />/;q')
  opts=( +s -e -i --reverse --cycle --prompt="fzgit${branch}>${prompt} " )
  [[ -v FZMP_FZF_OPTIONS ]] && opts=( $FZMP_FZF_OPTIONS )
  command fzf "${opts[@]}" \
    --inline-info \
    --ansi \
    --no-clear \
    "$@"
}
# }}}

declare -A git_cmds_descriptions=( # {{{
  ['add']='Add file contents to the index'
  ['am']='Apply a series of patches from a mailbox'
  ['annotate']='Annotate file lines with commit information'
  ['apply']='Apply a patch to files and/or to the index'
  ['archive']='Create an archive of files from a named tree'
  ['bisect']='Find by binary search the change that introduced a bug'
  ['blame']='Show what revision and author last modified each line of a'
  ['branch']='List, create, or delete branches'
  ['bundle']='Move objects and refs by archive'
  ['cat-file']='Provide content or type and size information for'
  ['check-attr']='Display gitattributes information'
  ['check-ignore']='Debug gitignore / exclude files'
  ['check-mailmap']='Show canonical names and email addresses of'
  ['check-ref-format']='Ensures that a reference name is well formed'
  ['checkout']='Checkout a branch or paths to the working tree'
  ['checkout-index']='Copy files from the index to the working tree'
  ['cherry']='Find commits yet to be applied to upstream'
  ['cherry-pick']='Apply the changes introduced by some existing commits'
  ['citool']='Graphical alternative to git-commit'
  ['clean']='Remove untracked files from the working tree'
  ['clone']='Clone a repository into a new directory'
  ['column']='Display data in columns'
  ['commit']='Record changes to the repository'
  ['commit-tree']='Create a new commit object'
  ['config']='Get and set repository or global options'
  ['count-objects']='Count unpacked number of objects and their disk'
  ['credential']='Retrieve and store user credentials'
  ['daemon']='A really simple server for Git repositories'
  ['describe']='Show the most recent tag that is reachable from a commit'
  ['diff']='Show changes between commits, commit and working tree, etc'
  ['diff-files']='Compares files in the working tree and the index'
  ['diff-index']='Compare a tree to the working tree or index'
  ['diff-tree']='Compares the content and mode of blobs found via two'
  ['difftool']='Show changes using common diff tools'
  ['fast-export']='Git data exporter'
  ['fast-import']='Backend for fast Git data importers'
  ['fetch']='Download objects and refs from another repository'
  ['fetch-pack']='Receive missing objects from another repository'
  ['filter-branch']='Rewrite branches'
  ['fmt-merge-msg']='Produce a merge commit message'
  ['for-each-ref']='Output information on each ref'
  ['format-patch']='Prepare patches for e-mail submission'
  ['fsck']='Verifies the connectivity and validity of the objects in the'
  ['fsck-objects']='Verifies the connectivity and validity of the'
  ['gc']='Cleanup unnecessary files and optimize the local repository'
  ['get-tar-commit-id']='Extract commit ID from an archive created using'
  ['grep']='Print lines matching a pattern'
  ['gui']='A portable graphical interface to Git'
  ['hash-object']='Compute object ID and optionally creates a blob from'
  ['help']='Display help information about Git'
  ['http-backend']='Server side implementation of Git over HTTP'
  ['http-fetch']='Download from a remote Git repository via HTTP'
  ['http-push']='Push objects over HTTP/DAV to another repository'
  ['imap-send']='Send a collection of patches from stdin to an IMAP'
  ['index-pack']='Build pack index file for an existing packed archive'
  ['init']='Create an empty Git repository or reinitialize an existing'
  ['init-db']='Creates an empty Git repository'
  ['instaweb']='Instantly browse your working repository in gitweb'
  ['log']='Show commit logs'
  ['ls-files']='Show information about files in the index and the'
  ['ls-remote']='List references in a remote repository'
  ['ls-tree']='List the contents of a tree object'
  ['mailinfo']='Extracts patch and authorship from a single e-mail'
  ['mailsplit']='Simple UNIX mbox splitter program'
  ['merge']='Join two or more development histories together'
  ['merge-base']='Find as good common ancestors as possible for a merge'
  ['merge-file']='Run a three-way file merge'
  ['merge-index']='Run a merge for files needing merging'
  ['merge-one-file']='The standard helper program to use with'
  ['merge-tree']='Show three-way merge without touching index'
  ['mergetool']='Run merge conflict resolution tools to resolve merge'
  ['mktag']='Creates a tag object'
  ['mktree']='Build a tree-object from ls-tree formatted text'
  ['mv']='Move or rename a file, a directory, or a symlink'
  ['notes']='Add or inspect object notes'
  ['pack-objects']='Create a packed archive of objects'
  ['pack-redundant']='Find redundant pack files'
  ['pack-refs']='Pack heads and tags for efficient repository access'
  ['patch-id']='Compute unique ID for a patch'
  ['prune']='Prune all unreachable objects from the object database'
  ['prune-packed']='Remove extra objects that are already in pack files'
  ['pull']='Fetch from and integrate with another repository or a local'
  ['push']='Update remote refs along with associated objects'
  ['quiltimport']='Applies a quilt patchset onto the current branch'
  ['read-tree']='Reads tree information into the index'
  ['rebase']='Forward-port local commits to the updated upstream head'
  ['receive-pack']='Receive what is pushed into the repository'
  ['reflog']='Manage reflog information'
  ['relink']='Hardlink common objects in local repositories'
  ['remote']='Manage set of tracked repositories'
  ['remote-ext']='Bridge smart transport to external command.'
  ['remote-fd']='Reflect smart transport stream back to caller'
  ['repack']='Pack unpacked objects in a repository'
  ['replace']='Create, list, delete refs to replace objects'
  ['request-pull']='Generates a summary of pending changes'
  ['rerere']='Reuse recorded resolution of conflicted merges'
  ['reset']='Reset current HEAD to the specified state'
  ['rev-list']='Lists commit objects in reverse chronological order'
  ['rev-parse']='Pick out and massage parameters'
  ['revert']='Revert some existing commits'
  ['rm']='Remove files from the working tree and from the index'
  ['send-pack']='Push objects over Git protocol to another repository'
  ['sh-i18n--envsubst']="Git's own envsubst(1) for i18n fallbacks"
  ['shell']='Restricted login shell for Git-only SSH access'
  ['shortlog']="Summarize 'git log' output"
  ['show']='Show various types of objects'
  ['show-branch']='Show branches and their commits'
  ['show-index']='Show packed archive index'
  ['show-ref']='List references in a local repository'
  ['stage']='Add file contents to the staging area'
  ['stash']='Stash the changes in a dirty working directory away'
  ['status']='Show the working tree status'
  ['stripspace']='Remove unnecessary whitespace'
  ['submodule']='Initialize, update or inspect submodules'
  ['subtree']='Merge subtrees together and split repository into'
  ['symbolic-ref']='Read, modify and delete symbolic refs'
  ['tag']='Create, list, delete or verify a tag object signed with GPG'
  ['unpack-file']="Creates a temporary file with a blob's contents"
  ['unpack-objects']='Unpack objects from a packed archive'
  ['update-index']='Register file contents in the working tree to the'
  ['update-ref']='Update the object name stored in a ref safely'
  ['update-server-info']='Update auxiliary info file to help dumb'
  ['upload-archive']='Send archive back to git-archive'
  ['upload-pack']='Send objects packed back to git-fetch-pack'
  ['var']='Show a Git logical variable'
  ['verify-commit']='Check the GPG signature of commits'
  ['verify-pack']='Validate packed Git archive files'
  ['verify-tag']='Check the GPG signature of tags'
  ['web--browse']='Git helper script to launch a web browser'
  ['whatchanged']='Show logs with difference each commit introduces'
  ['write-tree']='Create a tree object from the current index'
)
# }}}

declare -A implemented_git_cmds=(
  ['stash']='git_stash'
  ['add']='git_add'
  ['checkout']='git_checkout'
  ['commit']='git commit -v'
  ['push']='git push'
  ['log']='git_log'
)

git_log() { # {{{
  local show="git show --color=always \"\$(grep -m1 -o \"[a-f0-9]\{7\}\" <<< {})\""
  fzf --prompt='log' -e --no-sort --tiebreak=index \
    --bind="enter:execute:$show | less -R" \
    --preview="$show" \
  < <(git log --graph --color=always \
    --format="%C(auto)%h%d %s %C(black)%C(bold)%cr" "$@")
}
# }}}

git_checkout() { # {{{
  local list response key branch header
  list=$(git branch --all --color -vv; git tag) || return 1
    mapfile -t response < <(fzf --prompt='checkout' \
    --header="$header" --expect=ctrl-x <<< "$list")
  key="${response[0]}"
  branch=$(perl -pe 's/^\*?\s*(remotes\/[^\/]*\/)?([^ ]+).*/\2/' <<< "${response[1]}")
  git checkout "$branch" || return 1
}
# }}}

git_add() { # {{{
  local out response query key header
  header='use ctrl-p to add in patch mode'
  while out=$(git ls-files -mo --exclude-standard |
    fzf --prompt='add' --tac --multi \
        --header="$header" --query="$query" --print-query \
        --preview='git diff --color=always {} 2>&1' \
        --preview-window=up \
        --bind=ctrl-p:accept --expect=ctrl-p)
  do
    mapfile -t response <<< "$out"
    query="${response[0]}" && unset response[0]
    key="${response[1]}" && unset response[1]
    [[ "${#response[@]}" == 0 ]] && continue
    if [[ "$key" == 'ctrl-p' ]]; then
      git add -p "${response[@]}" < /dev/tty
    else
      git add "${response[@]}"
    fi
  done
}
# }}}

git_stash() { # {{{
  local out response query key sha header
  header='use ctrl-d to show a diff or ctrl-b to create a new branch'
  while out=$(git stash list \
      --pretty="%C(yellow)%h %>(14)%Cgreen%cr %C(blue)%gs" |
    fzf --prompt='stash' --no-sort --header="$header" \
      --query="$query" --print-query \
      --preview='git diff --color {1}' \
      --expect=ctrl-d,ctrl-b)
  do
    mapfile -t response <<< "$out"
    query="${response[0]}" && unset response[0]
    key="${response[1]}" && unset response[1]
    sha="${response[-1]}"
    sha="${sha%% *}"
    [[ -z "$sha" ]] && continue
    case "$key" in
      'ctrl-d') git diff "$sha" --color=always | less -R ;;
      'ctrl-b') git stash branch "stash-$sha" "$sha" ;;
      *) git stash show -p "$sha" --color=always | less -R  ;;
    esac
  done
}
# }}}

pick_cmd() {
  for c in "${!implemented_git_cmds[@]}"; do
    printf '%s%-15s%s -- %s\n' "${c_green}" "$c" "${c_reset}" "${git_cmds_descriptions[$c]}"
  done | fzf | awk '{print $1}'
}

main() {
  local pick
  while pick=$(pick_cmd); do
    if [[ -n $pick ]] && has "${implemented_git_cmds[${pick%% *}]}"; then
      ${implemented_git_cmds[$pick]}
    else
      break
    fi
  done
}

reset_screen() {
  tput rmcup
}

finish() {
  reset_screen
}

trap finish EXIT SIGINT SIGTERM
main
