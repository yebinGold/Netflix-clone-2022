const API_KEY = "084e953c1df79f2c7ddadf09c05f84e3";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  id: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}
export function getTopMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export interface IMovieDetail {
  backdrop_path: string;
  genres: {
    id: number;
    name: string;
  }[];
  release_date: string;
  runtime: number;
  title: string;
  overview: string;
  vote_average: number;
  id: number;
}

export function getMovieDetail(movieId: number) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export interface ISearchResult {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getSearchMovies(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((res) => res.json());
}
