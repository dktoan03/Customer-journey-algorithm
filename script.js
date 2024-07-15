function displayResults(countMap) {
  const outputContainer = document.getElementById("output-container");
  outputContainer.innerHTML = ""; // Clear previous content

  countMap.forEach((nextMap, current) => {
    const layerTitle = document.createElement("div");
    layerTitle.classList.add("output-item");

    const title = document.createElement("h2");
    title.classList.add("output-title");
    title.textContent = `Layer: ${current}`;
    layerTitle.appendChild(title);

    const list = document.createElement("ul");
    list.classList.add("output-list");

    let sortedNextEntries = Array.from(nextMap.entries())
      .filter(([key]) => key !== "countTotal")
      .sort((a, b) => b[1] - a[1]);

    let countTotal = nextMap.get("countTotal");
    sortedNextEntries.forEach(([next, count]) => {
      const item = document.createElement("li");
      item.classList.add("output-item");
      item.innerHTML = `Percentage: ${((100 * count) / countTotal).toFixed(
        2
      )}%, Next interacted layer: ${next}`;
      list.appendChild(item);
    });

    layerTitle.appendChild(list);
    outputContainer.appendChild(layerTitle);
  });

  const outputElement = document.getElementById("output");
  outputElement.classList.remove("hidden");
}

document
  .getElementById("input-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const N = parseInt(document.getElementById("N").value);
    const numArrays = parseInt(document.getElementById("numArrays").value);
    const defaultArraySize = parseInt(
      document.getElementById("defaultArraySize").value
    );

    const arrays = generateArrays(N, numArrays, defaultArraySize);
    const countMap = countOccurrences(arrays, N);
    displayResults(countMap);
  });

function generateArrays(N, numArrays, defaultArraySize) {
  function generateRandomArray() {
    let size = Math.floor(Math.random() * (defaultArraySize - 1)) + 2; // Random size between 2 and defaultArraySize
    let arr = [1]; // Start with 1 at the beginning

    // Generate middle elements
    for (let i = 1; i < size - 1; i++) {
      let uniqueValue = arr[i - 1];
      while (uniqueValue === arr[i - 1]) {
        uniqueValue = Math.floor(Math.random() * (N - 2)) + 2; // Random value between 2 and N-1
      }
      arr.push(uniqueValue);
    }

    arr.push(N); // End with N at the end
    return arr;
  }

  let arrays = [];
  for (let i = 0; i < numArrays; i++) {
    arrays.push(generateRandomArray());
  }
  return arrays;
}

function countOccurrences(arrays, N) {
  let countMap = new SortedMap();

  arrays.forEach((arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      let current = arr[i];
      let next = arr[i + 1];

      if (!countMap.has(current)) {
        countMap.set(current, new Map());
      }

      let nextMap = countMap.get(current);
      if (nextMap.has(next)) {
        nextMap.set(next, nextMap.get(next) + 1);
      } else {
        nextMap.set(next, 1);
      }

      if (nextMap.has("countTotal")) {
        nextMap.set("countTotal", nextMap.get("countTotal") + 1);
      } else {
        nextMap.set("countTotal", 1);
      }
    }
  });

  return countMap;
}

class SortedMap {
  constructor() {
    this.map = new Map();
    this.keys = [];
  }

  set(key, value) {
    if (!this.map.has(key)) {
      this.keys.push(key);
      this.keys.sort((a, b) => a - b);
    }
    this.map.set(key, value);
  }

  get(key) {
    return this.map.get(key);
  }

  has(key) {
    return this.map.has(key);
  }

  forEach(callback) {
    for (const key of this.keys) {
      callback(this.map.get(key), key, this.map);
    }
  }
}
