### Terminal command for running the project
```cmd
# Command for running the project
uv run python -m app.main
```


### Docker commands for running the vector database (qdrant) in docker:

```bash
# for checking the containers
docker ps
# for checking the images
docker images
# for creating a persistant storage
docker volumne create qdrant-volumne
# for checking the volumne is created or not
docker volume ls
# running qdrant as container
docker run -d \
  --name qdrant \
  -p 127.0.0.1:6333:6333 \
  -p 127.0.0.1:6334:6334 \
  -v qdrant-storage:/qdrant/storage \
  qdrant/qdrant

# Once the container has been created we can freely do.
# for running qdrant
docker start qdrant
# stop
docker stop qdrant
```