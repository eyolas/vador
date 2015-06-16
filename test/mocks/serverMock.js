import Interfake from 'interfake';


export function createServer() {
  var interfake = new Interfake();

  interfake
    .get('/interceptors')
    .status(200)
    .body({'_embedded': [{"name": "lucke"}]});


  return interfake;
}
