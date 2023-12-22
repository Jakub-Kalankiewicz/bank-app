#!/bin/sh

npx prisma migrate dev

npm run dev &

echo "Waiting for server to be ready..."
until wget --spider http://web:3000/ 2>&1 | grep 'remote file exists'; do
    sleep 5
    echo "Retrying..."
done

echo "Server is up - executing addUsers.sh"
sh addUsers.sh

wait
