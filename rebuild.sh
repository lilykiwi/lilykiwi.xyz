#!/usr/bin/env bash
# pulls the latest commit, builds it and publishes it; run on the server by the push action and the daily timer.
# a failed build stops here, before deploy.sh, so the live site stays as it was
set -euo pipefail

# everything's in a function, read in full before it runs, because the pull below can rewrite this file
main() {
  cd "$(dirname "$(readlink -f "$0")")"
  export PATH="$HOME/.bun/bin:$PATH"

  # waits rather than skips: a push landing mid-build still gets its own build afterwards
  exec 9> .git/rebuild.lock
  flock 9

  git pull --ff-only
  bun install --frozen-lockfile
  bun run build
  bash deploy.sh
}

main "$@"
exit
