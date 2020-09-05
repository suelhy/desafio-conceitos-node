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

  const repository = { id: uuid(), title, url, techs };
    
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

  const repository = { id, title, url, techs };

  repositories[repositoryIndex] = repository;

  return response.json(repository);

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
  
  return response.json(like);
});

app.get("/repositories/likes", (request, response) => {
  const { id } = request.query;
  
  if(!repositories.find(repository => repository.id == id)){
    return response.status(400).json({ error: "Repository not found." });
  }

  const likes_repository = likes.filter(like => like.id_repository == id);  

  return response.json({ repository: id, 
                         likes: likes_repository.length
                       });
});

module.exports = app;   
