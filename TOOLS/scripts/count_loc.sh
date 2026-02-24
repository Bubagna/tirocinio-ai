#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-APP}"

if [ ! -d "$ROOT_DIR" ]; then
  echo "Directory not found: $ROOT_DIR" >&2
  exit 1
fi

EXTS=("js" "jsx" "ts" "tsx" "mjs" "cjs" "json" "css" "html" "md" "yml" "yaml")

# Build: ( -name "*.js" -o -name "*.ts" -o ... )
FIND_EXPR=()
for ext in "${EXTS[@]}"; do
  FIND_EXPR+=(-name "*.${ext}" -o)
done
unset 'FIND_EXPR[${#FIND_EXPR[@]}-1]'

echo "Counting LOC in: $ROOT_DIR"
echo "Extensions: ${EXTS[*]}"
echo

# Find files (exclude generated dirs)
files=$(
  find "$ROOT_DIR" \
    -type d \( -name node_modules -o -name dist -o -name build -o -name coverage -o -name .git \) -prune -false \
    -o -type f \( "${FIND_EXPR[@]}" \) -print
)

if [ -z "$files" ]; then
  echo "No files found."
  exit 0
fi

total=0
count=0

# Read line-by-line safely
while IFS= read -r f; do
  [ -z "$f" ] && continue
  lines=$(wc -l < "$f" | tr -d ' ')
  total=$((total + lines))
  count=$((count + 1))
done <<< "$files"

echo "Files counted: $count"
echo "Total LOC: $total"
