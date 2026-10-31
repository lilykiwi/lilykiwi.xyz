#!/usr/bin/env bash
# each deploy goes into /data/releases/<timestamp>, then /data/www (a symlink) is
# switched to it in one atomic rename, so visitors never see a half-copied site
set -euo pipefail

src=${1:-./dist}
releases=/data/releases
live=/data/www
keep=5

[ -d "$src" ] || { echo "$src not found, run 'bun run build' first" >&2; exit 1; }
mkdir -p "$releases"

# first run only: /data/www is still a real directory, so move it aside
if [ -e "$live" ] && [ ! -L "$live" ]; then
  mv "$live" "$releases/pre-symlink"
  ln -s "$releases/pre-symlink" "$live"
fi

rel="$releases/$(date +%Y%m%d-%H%M%S)"
mkdir "$rel"
cp -r "$src"/. "$rel"
chmod -R a+rX "$rel"

ln -sfn "$rel" "$live.tmp"
mv -T "$live.tmp" "$live"
echo "live: $rel"

# prune old releases, never the live one
current=$(readlink -f "$live")
ls -1dt "$releases"/2* 2>/dev/null | tail -n +$((keep + 1)) | while read -r old; do
  [ "$(readlink -f "$old")" = "$current" ] || rm -rf "$old"
done
