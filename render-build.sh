set -o errexit

bun install
bun run build
bunx prisma generate 
bunx prism migrate deploy