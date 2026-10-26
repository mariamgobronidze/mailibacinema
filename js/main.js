// ფილმების სარჩევი, ბარათები და განრიგი მონაცემებიდან აიგება.
const movieNavigation = document.querySelector("#catalog-navigation");
const movieGrid = document.querySelector("#movie-grid");
const scheduleDialog = document.querySelector("#schedule-dialog");
const scheduleBody = document.querySelector("#schedule-body");
const scheduleOpenButton = document.querySelector("#schedule-open");

function formatCinemaDate(dateValue) {
  const monthNames = [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი"
  ];
  const [year, month, day] = dateValue.split("-").map(Number);

  return `${day} ${monthNames[month - 1]}, ${year}`;
}

function createPosterVisual(movie, extraClass = "") {
  const visual = document.createElement("div");
  visual.className = `poster-visual${extraClass ? ` ${extraClass}` : ""}`;
  visual.style.setProperty("--poster-color", movie.color);

  const placeholder = document.createElement("div");
  placeholder.className = "poster-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  const placeholderTitle = document.createElement("span");
  placeholderTitle.textContent = movie.title;
  placeholder.append(placeholderTitle);

  const image = document.createElement("img");
  image.className = "poster-image";
  image.alt = `${movie.title} — პოსტერი`;
  image.loading = "lazy";
  const posterExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  let extensionIndex = 0;

  const showPlaceholder = () => {
    image.hidden = true;
    visual.classList.remove("is-loaded");
  };

  image.addEventListener("error", () => {
    extensionIndex += 1;
    if (extensionIndex < posterExtensions.length) {
      image.src = `${movie.poster}${posterExtensions[extensionIndex]}`;
      return;
    }

    showPlaceholder();
  });
  image.addEventListener("load", () => {
    image.hidden = false;
    visual.classList.add("is-loaded");
  }, { once: true });
  image.src = `${movie.poster}${posterExtensions[extensionIndex]}`;

  visual.append(placeholder, image);

  if (image.complete) {
    if (image.naturalWidth > 0) {
      image.hidden = false;
      visual.classList.add("is-loaded");
    }
  }

  return visual;
}

function createMovieCard(movie) {
  const card = document.createElement("article");
  card.className = "movie-card";
  card.id = `movie-${movie.id}`;
  card.dataset.movieId = movie.id;

  const poster = document.createElement("div");
  poster.className = "movie-poster";
  poster.append(createPosterVisual(movie));

  const age = document.createElement("span");
  age.className = `age-badge${movie.ageLimit === "18+" ? " age-adult" : ""}`;
  age.textContent = movie.ageLimit;
  poster.append(age);

  const title = document.createElement("h2");
  title.textContent = movie.title;
  poster.append(title);

  const details = document.createElement("div");
  details.className = "movie-details";

  const meta = document.createElement("p");
  meta.className = "movie-meta";
  const year = document.createElement("span");
  year.textContent = String(movie.year);
  const genre = document.createElement("span");
  genre.textContent = movie.genre;
  const duration = document.createElement("span");
  duration.textContent = movie.duration;
  meta.append(year, genre, duration);

  const ticketButton = document.createElement("button");
  ticketButton.className = "button button-primary";
  ticketButton.type = "button";
  ticketButton.dataset.bookMovie = movie.id;
  ticketButton.textContent = "ბილეთის ყიდვა";

  details.append(meta, ticketButton);
  card.append(poster, details);

  return card;
}

function renderMovieCatalog() {
  const navigationFragment = document.createDocumentFragment();
  const movieFragment = document.createDocumentFragment();

  cinemaFilms.forEach((movie) => {
    const navigationButton = document.createElement("button");
    navigationButton.className = "nav-chip";
    navigationButton.type = "button";
    navigationButton.dataset.scrollTarget = `movie-${movie.id}`;
    navigationButton.textContent = movie.title;
    navigationFragment.append(navigationButton);
    movieFragment.append(createMovieCard(movie));
  });

  const vipNavigationButton = document.createElement("button");
  vipNavigationButton.className = "nav-chip";
  vipNavigationButton.type = "button";
  vipNavigationButton.dataset.scrollTarget = "vip-rooms";
  vipNavigationButton.textContent = "VIP ოთახები";
  navigationFragment.append(vipNavigationButton);

  movieNavigation.replaceChildren(navigationFragment);
  movieGrid.replaceChildren(movieFragment);
}

function renderSchedule() {
  const scheduleRows = [];

  cinemaFilms.forEach((movie) => {
    movie.sessions.forEach((session) => {
      scheduleRows.push({ movie, session });
    });
  });

  scheduleRows.sort((first, second) => {
    const dateOrder = first.session.date.localeCompare(second.session.date);
    return dateOrder || first.session.times[0].localeCompare(second.session.times[0]);
  });

  const fragment = document.createDocumentFragment();

  scheduleRows.forEach(({ movie, session }) => {
    const row = document.createElement("tr");
    const dateCell = document.createElement("td");
    const movieCell = document.createElement("td");
    const timesCell = document.createElement("td");
    const age = document.createElement("span");

    dateCell.textContent = formatCinemaDate(session.date);
    movieCell.append(document.createTextNode(movie.title));
    age.className = "schedule-age";
    age.textContent = movie.ageLimit;
    movieCell.append(age);
    timesCell.textContent = session.times.join(", ");
    row.append(dateCell, movieCell, timesCell);
    fragment.append(row);
  });

  if (scheduleRows.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "schedule-empty";
    cell.colSpan = 3;
    cell.textContent = "განრიგი ამჟამად მიუწვდომელია.";
    row.append(cell);
    fragment.append(row);
  }

  scheduleBody.replaceChildren(fragment);
}

movieNavigation.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scroll-target]");
  if (!button) {
    return;
  }

  document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

scheduleOpenButton.addEventListener("click", () => {
  scheduleDialog.showModal();
});

renderMovieCatalog();
renderSchedule();
