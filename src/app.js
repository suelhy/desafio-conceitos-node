const express = require("express");
const cors = require("cors");

const { v4: uuid, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes= [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {    
  const { title, url, techs } = request.body;
    
  const repository = { id: uuid(), title, url, techs,  likes: 0};
    
  repositories.push(repository);
  
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if( !validate(id) ){
    return response.status(400).json({error: "Invalid repository ID."})
  }

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if( repositoryIndex < 0 ){
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories[repositoryIndex].title = title || repositories[repositoryIndex].title;
  repositories[repositoryIndex].url = url || repositories[repositoryIndex].url;
  repositories[repositoryIndex].techs = techs || repositories[repositoryIndex].techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if( !validate(id) ){
    return response.status(400).json({error: "Invalid repository ID."})
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if( repositoryIndex < 0 ){
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const id_repository = request.params.id; 

  if(!repositories.find(repository => repository.id == id_repository)){
    return response.status(400).json({ error: "Repository not found." });
  }

  const like = { id: uuid(), id_repository };
    
  likes.push(like);

  const likes_repository = likes.filter(like => like.id_repository == id_repository).length;

  const indexRepository = repositories.findIndex(repository => repository.id == id_repository);

  repositories[indexRepository].likes = likes_repository;

  return response.json({ likes: likes_repository });
  
}); 

module.exports = app;   
