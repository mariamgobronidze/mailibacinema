// ბილეთებისა და VIP ოთახების დაჯავშნა მხოლოდ ამ ბრაუზერში მუშავდება.
const ticketDialog = document.querySelector("#ticket-dialog");
const vipDialog = document.querySelector("#vip-dialog");
const ticketContent = document.querySelector("#ticket-content");
const ticketConfirmation = document.querySelector("#ticket-confirmation");
const ticketConfirmationDetails = document.querySelector("#ticket-confirmation-details");
const ticketMessage = document.querySelector("#ticket-message");
const ticketSessions = document.querySelector("#ticket-sessions");
const seatGrid = document.querySelector("#seat-grid");
const selectedSeatsText = document.querySelector("#selected-seats");
const ticketTotal = document.querySelector("#ticket-total");
const ticketMovieText = document.querySelector("#ticket-movie");
const ticketUnitPrice = document.querySelector("#ticket-unit-price");
const vipOpenButton = document.querySelector("#vip-open");
const vipRoomsList = document.querySelector("#vip-rooms-list");
const vipTimesList = document.querySelector("#vip-times");
const vipMessage = document.querySelector("#vip-message");
const vipContent = document.querySelector("#vip-content");
const vipConfirmation = document.querySelector("#vip-confirmation");
const vipConfirmationDetails = document.querySelector("#vip-confirmation-details");
const bookingStorageKey = "maliba-cinema-reserved-seats";

let activeMovie = null;
let activeSession = null;
let selectedSeats = new Set();
let selectedVipRoom = null;
let selectedVipTime = null;

function readSeatReservations() {
  let savedReservations;
  try {
    savedReservations = window.localStorage.getItem(bookingStorageKey);
  } catch {
    throw new Error("ადგილების შენახვა ბრაუზერში მიუწვდომელია.");
  }

  if (savedReservations === null) {
    return {};
  }

  let reservations;
  try {
    reservations = JSON.parse(savedReservations);
  } catch {
    throw new Error("შენახული ადგილების მონაცემი დაზიანებულია. წაშალეთ MALIBA Cinema Team-ის დაჯავშნის ჩანაწერი ბრაუზერის საცავიდან.");
  }

  if (!reservations || typeof reservations !== "object" || Array.isArray(reservations)) {
    throw new Error("შენახული ადგილების მონაცემის ფორმატი არასწორია.");
  }

  Object.entries(reservations).forEach(([sessionKey, seats]) => {
    if (!sessionKey || !Array.isArray(seats) || seats.some((seat) => typeof seat !== "string")) {
      throw new Error("შენახული ადგილების მონაცემის ფორმატი არასწორია.");
    }
  });

  return reservations;
}

function saveSeatReservations(reservations) {
  try {
    window.localStorage.setItem(bookingStorageKey, JSON.stringify(reservations));
  } catch {
    throw new Error("ადგილების შენახვა ბრაუზერში ვერ მოხერხდა.");
  }
}

function showMessage(element, message) {
  element.textContent = message;
}

function makeSeatSessionKey(movieId, date, time) {
  return `${movieId}|${date}|${time}`;
}

function formatSessionLabel(date, time) {
  return `${formatCinemaDate(date)} · ${time}`;
}

function updateTicketSummary() {
  if (selectedSeats.size === 0) {
    selectedSeatsText.textContent = "ადგილი ჯერ არ არის არჩეული";
  } else {
    selectedSeatsText.textContent = Array.from(selectedSeats)
      .sort((first, second) => first.localeCompare(second, "en", { numeric: true }))
      .map((seat) => `რ${seat.slice(1)}`)
      .join(", ");
  }

  ticketTotal.textContent = `${selectedSeats.size * cinemaPrices.ticket} ლარი`;
}

function renderSeats() {
  const fragment = document.createDocumentFragment();
  let reservedSeats = [];

  if (activeSession && activeMovie) {
    try {
      const reservations = readSeatReservations();
      reservedSeats = reservations[makeSeatSessionKey(
        activeMovie.id,
        activeSession.date,
        activeSession.time
      )] || [];
    } catch (error) {
      showMessage(ticketMessage, error.message);
    }
  }

  for (let row = 1; row <= 6; row += 1) {
    for (let number = 1; number <= 8; number += 1) {
      const seatId = `r${row}-${number}`;
      const seatButton = document.createElement("button");
      const isReserved = reservedSeats.includes(seatId);

      if (isReserved) {
        selectedSeats.delete(seatId);
      }

      seatButton.className = `seat${selectedSeats.has(seatId) ? " is-selected" : ""}${isReserved ? " is-taken" : ""}`;
      seatButton.type = "button";
      seatButton.dataset.seatId = seatId;
      seatButton.textContent = `${row}-${number}`;
      seatButton.setAttribute("aria-label", `რიგი ${row}, ადგილი ${number}${isReserved ? ", დაკავებულია" : ""}`);
      seatButton.setAttribute("aria-pressed", String(selectedSeats.has(seatId)));
      seatButton.disabled = !activeSession || isReserved;
      fragment.append(seatButton);
    }
  }

  seatGrid.replaceChildren(fragment);
  updateTicketSummary();
}

function renderTicketSessions(movie) {
  const fragment = document.createDocumentFragment();

  movie.sessions.forEach((session) => {
    session.times.forEach((time) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.dataset.sessionDate = session.date;
      button.dataset.sessionTime = time;
      button.textContent = formatSessionLabel(session.date, time);
      button.setAttribute("aria-pressed", "false");
      fragment.append(button);
    });
  });

  ticketSessions.replaceChildren(fragment);
}

function openTicketDialog(movieId) {
  activeMovie = cinemaFilms.find((movie) => movie.id === movieId);
  if (!activeMovie) {
    showMessage(ticketMessage, "ფილმის მონაცემი ვერ მოიძებნა.");
    return;
  }

  activeSession = null;
  selectedSeats = new Set();
  const moviePoster = createPosterVisual(activeMovie, "poster-visual-compact");
  const movieDetails = document.createElement("div");
  movieDetails.className = "ticket-movie-copy";
  const movieTitle = document.createElement("h3");
  movieTitle.textContent = activeMovie.title;
  const movieAge = document.createElement("span");
  movieAge.className = `age-badge${activeMovie.ageLimit === "18+" ? " age-adult" : ""}`;
  movieAge.textContent = activeMovie.ageLimit;
  movieDetails.append(movieTitle, movieAge);
  ticketMovieText.replaceChildren(moviePoster, movieDetails);
  ticketUnitPrice.textContent = `${cinemaPrices.ticket} ლარი`;
  ticketMessage.textContent = "";
  ticketContent.hidden = false;
  ticketConfirmation.hidden = true;
  renderTicketSessions(activeMovie);
  renderSeats();
  ticketDialog.showModal();
}

function makeConfirmationLine(label, value) {
  const paragraph = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;
  paragraph.append(strong, document.createTextNode(value));
  return paragraph;
}

function bookTickets() {
  ticketMessage.textContent = "";

  if (!activeSession) {
    showMessage(ticketMessage, "დაჯავშნამდე აირჩიეთ სეანსი.");
    return;
  }

  if (selectedSeats.size === 0) {
    showMessage(ticketMessage, "დაჯავშნამდე აირჩიეთ ერთი ან მეტი თავისუფალი ადგილი.");
    return;
  }

  try {
    const reservations = readSeatReservations();
    const sessionKey = makeSeatSessionKey(activeMovie.id, activeSession.date, activeSession.time);
    const alreadyReserved = reservations[sessionKey] || [];
    const unavailableSeat = Array.from(selectedSeats).find((seat) => alreadyReserved.includes(seat));

    if (unavailableSeat) {
      showMessage(ticketMessage, "ამ სეანსზე ერთ-ერთი არჩეული ადგილი უკვე დაკავებულია. აირჩიეთ სხვა ადგილი.");
      renderSeats();
      return;
    }

    reservations[sessionKey] = [...alreadyReserved, ...selectedSeats];
    saveSeatReservations(reservations);

    const seats = Array.from(selectedSeats)
      .sort((first, second) => first.localeCompare(second, "en", { numeric: true }))
      .map((seat) => `რ${seat.slice(1)}`)
      .join(", ");
    const total = selectedSeats.size * cinemaPrices.ticket;

    ticketConfirmationDetails.replaceChildren(
      makeConfirmationLine("ფილმი", `${activeMovie.title} · ${activeMovie.ageLimit}`),
      makeConfirmationLine("სეანსი", formatSessionLabel(activeSession.date, activeSession.time)),
      makeConfirmationLine("ადგილები", seats),
      makeConfirmationLine("ჯამური ფასი", `${total} ლარი`)
    );
    ticketContent.hidden = true;
    ticketConfirmation.hidden = false;
  } catch (error) {
    showMessage(ticketMessage, `დაჯავშნა ვერ შესრულდა: ${error.message}`);
  }
}

function renderVipChoices() {
  const roomsFragment = document.createDocumentFragment();
  const timesFragment = document.createDocumentFragment();

  vipRooms.forEach((room) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.dataset.vipRoomId = room.id;
    button.textContent = `${room.name} — ${room.capacity} ადგილი`;
    button.setAttribute("aria-pressed", "false");
    roomsFragment.append(button);
  });

  vipTimes.forEach((day) => {
    day.times.forEach((time) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.dataset.vipDate = day.date;
      button.dataset.vipTime = time;
      button.textContent = formatSessionLabel(day.date, time);
      button.setAttribute("aria-pressed", "false");
      timesFragment.append(button);
    });
  });

  vipRoomsList.replaceChildren(roomsFragment);
  vipTimesList.replaceChildren(timesFragment);
}

function openVipDialog() {
  selectedVipRoom = null;
  selectedVipTime = null;
  [vipRoomsList, vipTimesList].forEach((list) => {
    list.querySelectorAll(".choice-button").forEach((button) => {
      button.classList.remove("is-selected");
      button.setAttribute("aria-pressed", "false");
    });
  });
  vipMessage.textContent = "";
  vipContent.hidden = false;
  vipConfirmation.hidden = true;
  vipDialog.showModal();
}

function bookVipRoom() {
  vipMessage.textContent = "";

  if (!selectedVipRoom || !selectedVipTime) {
    showMessage(vipMessage, "დაჯავშნამდე აირჩიეთ VIP ოთახი და დრო.");
    return;
  }

  vipConfirmationDetails.replaceChildren(
    makeConfirmationLine("ოთახი", `${selectedVipRoom.name} — ${selectedVipRoom.capacity} ადგილი`),
    makeConfirmationLine("დრო", formatSessionLabel(selectedVipTime.date, selectedVipTime.time)),
    makeConfirmationLine("ფასი", `${cinemaPrices.vip} ლარი`)
  );
  vipContent.hidden = true;
  vipConfirmation.hidden = false;
}

document.addEventListener("click", (event) => {
  const ticketButton = event.target.closest("[data-book-movie]");
  if (ticketButton) {
    openTicketDialog(ticketButton.dataset.bookMovie);
    return;
  }

  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) {
    closeButton.closest("dialog").close();
  }
});

ticketSessions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-session-date]");
  if (!button) {
    return;
  }

  activeSession = {
    date: button.dataset.sessionDate,
    time: button.dataset.sessionTime
  };
  selectedSeats.clear();
  ticketMessage.textContent = "";
  ticketSessions.querySelectorAll(".choice-button").forEach((sessionButton) => {
    const isSelected = sessionButton === button;
    sessionButton.classList.toggle("is-selected", isSelected);
    sessionButton.setAttribute("aria-pressed", String(isSelected));
  });
  renderSeats();
});

seatGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-seat-id]");
  if (!button || button.disabled) {
    return;
  }

  const seatId = button.dataset.seatId;
  if (selectedSeats.has(seatId)) {
    selectedSeats.delete(seatId);
  } else {
    selectedSeats.add(seatId);
  }

  button.classList.toggle("is-selected", selectedSeats.has(seatId));
  button.setAttribute("aria-pressed", String(selectedSeats.has(seatId)));
  updateTicketSummary();
});

vipRoomsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vip-room-id]");
  if (!button) {
    return;
  }

  selectedVipRoom = vipRooms.find((room) => room.id === button.dataset.vipRoomId);
  vipRoomsList.querySelectorAll(".choice-button").forEach((roomButton) => {
    const isSelected = roomButton === button;
    roomButton.classList.toggle("is-selected", isSelected);
    roomButton.setAttribute("aria-pressed", String(isSelected));
  });
  vipMessage.textContent = "";
});

vipTimesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vip-date]");
  if (!button) {
    return;
  }

  selectedVipTime = {
    date: button.dataset.vipDate,
    time: button.dataset.vipTime
  };
  vipTimesList.querySelectorAll(".choice-button").forEach((timeButton) => {
    const isSelected = timeButton === button;
    timeButton.classList.toggle("is-selected", isSelected);
    timeButton.setAttribute("aria-pressed", String(isSelected));
  });
  vipMessage.textContent = "";
});

document.querySelector("#ticket-submit").addEventListener("click", bookTickets);
document.querySelector("#vip-submit").addEventListener("click", bookVipRoom);
vipOpenButton.addEventListener("click", openVipDialog);
document.querySelector("#vip-price").textContent = `${cinemaPrices.vip} ლარი`;
renderVipChoices();
renderSeats();

[ticketDialog, vipDialog, document.querySelector("#schedule-dialog")].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

ticketDialog.addEventListener("close", () => {
  activeMovie = null;
  activeSession = null;
  selectedSeats.clear();
});

vipDialog.addEventListener("close", () => {
  selectedVipRoom = null;
  selectedVipTime = null;
});

window.addEventListener("storage", (event) => {
  if (event.key === bookingStorageKey && ticketDialog.open && activeSession) {
    renderSeats();
  }
});
