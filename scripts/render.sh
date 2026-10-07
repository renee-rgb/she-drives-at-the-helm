#!/usr/bin/env bash
# Render one lesson or every lesson.
#   scripts/render.sh 07-sound-signals
#   scripts/render.sh all
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
render() {
  local id="$1"
  echo "== rendering $id"
  npx remotion render src/index.ts AtTheHelm "out/$id.mp4" --props="lessons/$id.json" --codec=h264 --crf=18 --log=error
}
if [ "${1:-}" = "all" ]; then
  for f in lessons/*.json; do render "$(basename "$f" .json)"; done
else
  render "$1"
fi
