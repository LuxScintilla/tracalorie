class CalorieTracker {
  #calorieLimit = 2000;
  #totalCalories = 0;
  #meals = [];
  #workouts = [];

  constructor() {
    this.#displayCaloriesLimit();
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemaining();
    this.#displayCaloriesTotal();
    this.#displayCaloriesProgress();
  }

  addMeal(meal) {
    this.#meals.push(meal);
    this.#totalCalories += meal.calories;
    this.#displayNewMeal(meal);
    this.#render();
  }

  addWorkout(workout) {
    this.#workouts.push(workout);
    this.#totalCalories -= workout.calories;
    this.#displayNewWorkout(workout);
    this.#render();
  }

  removeMeal(id) {
    const index = this.#meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this.#meals[index];
      this.#totalCalories -= meal.calories;
      this.#meals.splice(index, 1);
      this.#render();
    }
  }

  removeWorkout(id) {
    const index = this.#workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this.#workouts[index];
      this.#totalCalories += workout.calories;
      this.#workouts.splice(index, 1);
      this.#render();
    }
  }

  reset() {
    this.#totalCalories = 0;
    this.#meals = [];
    this.#workouts = [];
    this.#render();
  }

  setLimit(value) {
    this.#calorieLimit = value;
    this.#displayCaloriesLimit();
    this.#render();
  }

  #displayCaloriesTotal() {
    const totalCaloriesEl = document.querySelector("#calories-total");
    totalCaloriesEl.innerHTML = this.#totalCalories;
  }

  #displayCaloriesLimit() {
    const calorieLimitEl = document.querySelector("#calories-limit");
    calorieLimitEl.innerHTML = this.#calorieLimit;
  }

  #displayCaloriesConsumed() {
    const caloriesConsumedEl = document.querySelector("#calories-consumed");
    const consumed = this.#meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumedEl.innerHTML = consumed;
  }

  #displayCaloriesBurned() {
    const caloriesBurnedEl = document.querySelector("#calories-burned");
    const burned = this.#workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedEl.innerHTML = burned;
  }

  #displayCaloriesRemaining() {
    const caloriesRemainingEl = document.querySelector("#calories-remaining");
    const progressEl = document.querySelector("#calorie-progress");

    const remaining = this.#calorieLimit - this.#totalCalories;
    caloriesRemainingEl.innerHTML = remaining;

    if (remaining < 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      progressEl.classList.remove("bg-success");
      progressEl.classList.add("bg-danger");
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
      progressEl.classList.remove("bg-danger");
      progressEl.classList.add("bg-success");
    }
  }

  #displayCaloriesProgress() {
    const progressEl = document.querySelector("#calorie-progress");
    const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
    const width = Math.min(percentage);
    progressEl.style.width = `${width}%`;
  }

  #displayNewMeal(meal) {
    const mealsEl = document.querySelector("#meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("card", "my-2");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = `
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${meal.name}</h4>
        <div
          class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
        >${meal.calories}</div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    `;
    mealsEl.appendChild(mealEl);
  }

  #displayNewWorkout(workout) {
    const workoutsEl = document.querySelector("#workout-items");
    const workoutEl = document.createElement("div");
    workoutEl.classList.add("card", "my-2");
    workoutEl.setAttribute("data-id", workout.id);
    workoutEl.innerHTML = `
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${workout.name}</h4>
        <div
          class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
        >${workout.calories}</div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    `;
    workoutsEl.appendChild(workoutEl);
  }

  #render() {
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemaining();
    this.#displayCaloriesTotal();
    this.#displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class App {
  #tracker;
  constructor() {
    this.#tracker = new CalorieTracker();
    document
      .querySelector("#meal-form")
      .addEventListener("submit", this.#newItem.bind(this, "meal"));
    document
      .querySelector("#workout-form")
      .addEventListener("submit", this.#newItem.bind(this, "workout"));
    document
      .querySelector("#meal-items")
      .addEventListener("click", this.#removeItem.bind(this, "meal"));
    document
      .querySelector("#workout-items")
      .addEventListener("click", this.#removeItem.bind(this, "workout"));
    document
      .querySelector("#filter-meals")
      .addEventListener("keyup", this.#filterItems.bind(this, "meal"));
    document
      .querySelector("#filter-workouts")
      .addEventListener("keyup", this.#filterItems.bind(this, "workout"));
    document
      .querySelector("#reset")
      .addEventListener("click", this.#reset.bind(this));
    document
      .querySelector("#limit-form")
      .addEventListener("submit", this.#setLimit.bind(this));
  }

  #newItem(type, e) {
    e.preventDefault();
    const name = document.querySelector(`#${type}-name`);
    const calories = document.querySelector(`#${type}-calories`);

    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, Number(calories.value));
      this.#tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, Number(calories.value));
      this.#tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    const collapseType = document.querySelector(`#collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseType, {
      toggle: true,
    });
  }

  #removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").dataset.id;
        type === "meal"
          ? this.#tracker.removeMeal(id)
          : this.#tracker.removeWorkout(id);
        e.target.closest(".card").remove();
      }
    }
  }

  #filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    const elements = document.querySelectorAll(`#${type}-items .card`);
    elements.forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  #reset() {
    this.#tracker.reset();
    document.querySelector("#meal-items").innerHTML = "";
    document.querySelector("#workout-items").innerHTML = "";
    document.querySelector("#filter-meals").value = "";
    document.querySelector("#filter-workouts").value = "";
  }

  #setLimit(e) {
    e.preventDefault();
    const limit = document.querySelector("#limit");
    if (limit.value === "") {
      alert("Please add a limit!");
      return;
    }
    this.#tracker.setLimit(Number(limit.value));
    limit.value = "";

    const modalEl = document.querySelector("#limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
