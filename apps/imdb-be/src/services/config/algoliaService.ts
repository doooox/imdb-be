import Movie from "../../models/Movies/movieModel"
import algoliasearch from "algoliasearch"

const client = algoliasearch(process.env.NX_ALGOLIA_APP_ID, process.env.NX_ALGOLIA_API_KEY)
const index = client.initIndex("movies")

export const syncWithAlgolia = async () => {
  const movies = await Movie.find({}, ['id', 'title'])
  const parsedMovies = movies.map((movie) => {
    return {
      objectID: movie._id,
      name: movie.title
    }
  })

  index.replaceAllObjects(parsedMovies).then(() => {
    console.log('Algolia successfuly syncked');
  }).catch((error) => {
    console.log(error);
  })
}
