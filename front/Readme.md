## Front-end

This service is our simple interface for users to integrate

![Screenshot from 2023-02-16 23-28-36](https://user-images.githubusercontent.com/65229051/219795529-f17725ba-e46d-4507-8e4e-62923b7c8ddd.png)

## How I run the front-end?

It's simple, you only need to docker and run a few commands.

1. Create a `.env` file in root project, follow the `.env.example`, it should look something like this
```.env
API_URL=https://api-url.com
GOOGLE_API_KEY=api-key
```

2. So you must enter the `/front` directory, if you are already in `/front` just skip this step.
```bash
cd ./front
```

3. To finish, you should up the container docker using the docker-compose.yml

Obs:. To install docker, docker-compose and other tools, access this [tutorial](https://docs.docker.com/engine/install/ubuntu/  )    

```
docker-compose up
```

Thats it, now just access [http://localhost:3001](http://localhost:3001)
