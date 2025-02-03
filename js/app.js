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
    this.#render();
  }

  addWorkout(workout) {
    this.#workouts.push(workout);
    this.#totalCalories -= workout.calories;
    this.#render();
  }

  getInfo() {
    console.log(this.#totalCalories);
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

const tracker = new CalorieTracker();

const breakfast = new Meal("breakfast", 500);
const dinner = new Meal("dinner", 500);
tracker.addMeal(breakfast);
tracker.addMeal(dinner);

const run = new Workout("morning run", 200);
tracker.addWorkout(run);

tracker.getInfo();
