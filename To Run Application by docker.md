**To Run Application:**

cd "D:\\BPUT Hackathon\\By-Me-and-Pratik"
cd "A:\\OneDrive\\Desktop\\Folders\\Hackathon\\BPUT\\By Me and Pratik"
start-docker.bat

**To Stop:**

Ctrl + C

docker-compose down

**To Update After Changes (Pull from Git):**

docker-compose down

docker-compose build --no-cache

docker-compose --env-file .env.docker up

**After pulling changes, run:**

update-docker.bat

**rebuild Or manually**

docker-compose down
docker-compose build --no-cache
docker-compose --env-file .env.docker up

Copy


***🎯 What to Do:***

Type: http://localhost

Press Enter

**📝 Note**:

0.0.0.0 is an internal Docker address

Always use localhost in your browser

The backend runs on 0.0.0.0:8000 inside Docker

But you access it via localhost:8000 from your browser

Just go to: http://localhost 🚀