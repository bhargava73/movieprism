import "./components/home.css";
import movieAlt from "./components/movieAlt.png";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Movie from "./components/Movie";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useTheme from "./components/useTheme";

const FEATURED_API = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f35d024e5f08ff59223ea908d806fe4f&page=1";
const PAGINATION_API = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f35d024e5f08ff59223ea908d806fe4f&page=";
const SEARCH_API = "https://api.themoviedb.org/3/search/movie?&api_key=f35d024e5f08ff59223ea908d806fe4f&query=";
const IMG_API = "https://image.tmdb.org/t/p/w1280";

function App() {
	let [theme, icon] = useTheme();
	const [movies, setMovies] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchEles, setSearchEles] = useState("");
	const [cancelEles, setCancelEles] = useState("");
	const [formEles, setFormEles] = useState("");
	let [prevPage, setPrevPage] = useState(0);
	let [currentPage, setCurrentPage] = useState(1);
	let [nextPage, setNextPage] = useState(2);
	let [totalPages, setTotalPages] = useState(100);
	let [prevState, setPrevState] = useState("disabled");
	let [nextState, setNextState] = useState("disabled");
	let [api, setApi] = useState("");

	useEffect(() => {
		getMovies(FEATURED_API);
		setApi(PAGINATION_API);
	}, []);

	const getMovies = (API) => {
		fetch(API)
			.then((res) => res.json())
			.then((data) => {
				if (data.results.length > 0) {
					setMovies(data.results);
					setTotalPages(data.total_pages);
					setCurrentPage(data.page);
					setPrevPage(data.page - 1);
					setNextPage(data.page + 1);
					scrollToTop();
					if (data.page <= 1) {
						setPrevState("disabled");
					} else {
						setPrevState("");
					}
					if (data.page < data.total_pages) {
						setNextState("");
					} else {
						setNextState("disabled");
					}
				} else {
					alert("No results found.");
				}
			});
	};
	const handleOnSubmit = (e) => {
		e.preventDefault();
		if (searchTerm) {
			getMovies(SEARCH_API + searchTerm);
			setApi(SEARCH_API + searchTerm + "&page=");
			onCancelClick();
			setSearchTerm("");
		}
	};
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleOnChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const onSearchClick = () => {
		setFormEles("active");
		setSearchEles("hide");
		setCancelEles("show");
	};

	const onCancelClick = () => {
		setSearchEles("");
		setCancelEles("");
		setFormEles("");
	};

	const pageCall = (pageNumber) => {
		getMovies(api + pageNumber);
	};

	const nextPageClick = () => {
		if (nextPage <= totalPages) {
			pageCall(nextPage);
		}
	};

	const prevPageClick = () => {
		if (prevPage > 0) {
			pageCall(prevPage);
		}
	};

	let paginationDiv;
	if (movies.length > 0) {
		paginationDiv = (
			<div id="app" className="pagination">
				<ul className="page">
					<li onClick={prevPageClick} className={"page__btn " + prevState}>
						<span className="prev">
							<ChevronLeftIcon />
						</span>
					</li>
					<li className="current">{currentPage}</li>
					<li onClick={nextPageClick} className={"page__btn " + nextState}>
						<span className="next">
							<ChevronRightIcon />
						</span>
					</li>
				</ul>
			</div>
		);
	}

	return (
		<Router>
			<Switch>
				<Route exact path="/movieprism">
					<div className={theme}>
						<nav>
							<Link to="/" className="logo">
								Movieprism
							</Link>
							<div className="items">
								<div onClick={onSearchClick} className={"search-icon " + searchEles}>
									<span>
										<SearchIcon />
									</span>
								</div>
								<div onClick={onCancelClick} className={"cancel-icon " + cancelEles}>
									<span>
										<ClearIcon />
									</span>
								</div>
								<form onSubmit={handleOnSubmit} className={formEles}>
									<input type="search" className="search" placeholder="search..." value={searchTerm} onChange={handleOnChange} autoComplete="off" required />
									<button type="submit">
										<SearchIcon />
									</button>
								</form>
								<div className="theme-icon">
									<span>{icon}</span>
								</div>
							</div>
						</nav>
						<div className="wrapper">
							{movies.length > 0 &&
								movies.map((movie) => (
									<div key={movie.id} className="card">
										<img src={movie.poster_path ? IMG_API + movie.poster_path : movieAlt} alt="{title}" />
										<div className="description">
											<h1>{movie.title}</h1>
											<p>{movie.overview}</p>
											<div className="vote">
												{movie.vote_average}
											</div>
											{movie.overview === "" ? (
												""
											) : (
												<Link to={`/${movie.id}`} className="btn">
													Know more
												</Link>
											)}
										</div>
									</div>
								))}
						</div>
						{paginationDiv}
					</div>
				</Route>
				<Route exact path="/:id" component={Movie} />
			</Switch>
		</Router>
	);
}

export default App;
