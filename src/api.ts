const API_KEY = "084e953c1df79f2c7ddadf09c05f84e3";
const BASE_PATH = "https://api.themoviedb.org/3";

// movies
export interface IMovie {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  id: number;
}

export interface IGetMoviesResult {
  // dates: {
  //   maximum: string;
  //   minimum: string;
  // };
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
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((res) =>
    res.json()
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

export function getMovieDetail(movieId: string | undefined) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

// tv shows
export interface IShow {
  backdrop_path: string;
  name: string;
  overview: string;
  id: number;
}

export interface IGetShowsResult {
  page: number;
  results: IShow[];
  total_pages: number;
  total_results: number;
}

export function getShows() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
export function getTodayShows() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
export function getPopularShows() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
export function getTopShows() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export interface IShowDetail {
  backdrop_path: string;
  genres: {
    id: number;
    name: string;
  }[];
  created_by: { name: string }[];
  name: string;
  overview: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  id: number;
}

export function getShowDetail(showId: string | undefined) {
  return fetch(`${BASE_PATH}/tv/${showId}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

// search

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
