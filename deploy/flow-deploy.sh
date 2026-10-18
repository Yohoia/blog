#!/usr/bin/env bash
set -euo pipefail

# Aliyun Flow host deployment entry point.
# Usage: flow-deploy.sh /path/to/flow-artifact.tgz
package=${1:-/tmp/yoho-blog-release.tgz}
base=/var/www/yoho-blog
extracted=$(mktemp -d /tmp/yoho-blog-flow.XXXXXX)

cleanup() {
  rm -rf "$extracted"
}
trap cleanup EXIT

if [[ ! -f "$package" ]]; then
  echo "Artifact not found: $package" >&2
  exit 1
fi

tar -xzf "$package" -C "$extracted"

if [[ -f "$extracted/server.js" ]]; then
  candidate=$extracted
elif [[ -f "$extracted/release/server.js" ]]; then
  candidate=$extracted/release
else
  candidate=$(find "$extracted" -type f -path "*/release/server.js" -print -quit 2>/dev/null || true)
  if [[ -z $candidate ]]; then
    echo "Unable to find Next.js standalone server.js in artifact" >&2
    exit 1
  fi
  candidate=${candidate%/server.js}
fi

for required in server.js package.json .next public; do
  if [[ ! -e "$candidate/$required" ]]; then
    echo "Invalid standalone release: missing $required" >&2
    exit 1
  fi
done

install -d -o root -g root "$base/releases" "$base/nginx-errors"
release="$base/releases/$(date +%Y%m%d%H%M%S)-$RANDOM"
previous=$(readlink -f "$base/current" 2>/dev/null || true)

install -d -o root -g root "$release"
cp -a "$candidate/." "$release/"
chown -R root:root "$release"
chmod -R u=rwX,go=rX "$release"

# Refresh the Nginx fallback page used when the Node upstream is unavailable.
if [[ -f "$release/.next/server/app/502.html" ]]; then
  install -m 0644 "$release/.next/server/app/502.html" "$base/nginx-errors/502.html"
fi

# The service file normally already exists on the host. Update it only when the
# artifact carries the tracked copy, then reload systemd when it changes.
service_source=
for path in "$extracted/deploy/yoho-blog.service" "$candidate/deploy/yoho-blog.service"; do
  if [[ -f "$path" ]]; then
    service_source=$path
    break
  fi
done
if [[ -n $service_source ]] && ! cmp -s "$service_source" /etc/systemd/system/yoho-blog.service; then
  install -m 0644 "$service_source" /etc/systemd/system/yoho-blog.service
  systemctl daemon-reload
fi

if [[ ! -f /etc/yoho-blog.env ]]; then
  echo "Missing /etc/yoho-blog.env" >&2
  exit 1
fi
chmod 0600 /etc/yoho-blog.env

systemctl stop yoho-blog
ln -sfn "$release" "$base/current"
systemctl start yoho-blog

healthy=false
for _ in {1..30}; do
  article=$(curl -fsSL --max-time 5 http://127.0.0.1:3000/sitemap.xml 2>/dev/null | grep -oE "https?://[^<]+/blog/[A-Za-z0-9_-]+" | head -n 1 || true)
  paths=(/ /blog /sitemap.xml)
  if [[ -n $article ]]; then paths+=("$article"); fi
  checked=true
  for path in "${paths[@]}"; do
    if ! curl -fsSL --max-time 10 "$path" >/dev/null 2>&1; then
      checked=false
      break
    fi
  done
  if [[ $checked == true ]]; then
    healthy=true
    break
  fi
  sleep 1
done

if [[ $healthy != true ]]; then
  echo "New release failed its local health check" >&2
  if [[ -n $previous && $previous != "$release" && -d $previous ]]; then
    ln -sfn "$previous" "$base/current"
    systemctl restart yoho-blog
    echo "Rolled back to $previous" >&2
  fi
  exit 1
fi

# Keep the current and recent rollback candidates, but avoid unbounded growth.
mapfile -t old_releases < <(find "$base/releases" -mindepth 1 -maxdepth 1 -type d | sort | head -n -5)
if ((${#old_releases[@]})); then
  rm -rf "${old_releases[@]}"
fi

echo "Deployed $release"
