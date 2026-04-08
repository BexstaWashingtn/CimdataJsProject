// Hilfsfunktionen zur DOM-Manipulation

export const el = (css) => document.querySelector(css);
export const group = (css) => document.querySelectorAll(css);
export const create = (html) => document.createElement(html);

// Funktion zum Umschalten einer CSS-Klasse

export const toggleClass = (element, className, condition) => {
  if (element) {
    element.classList.toggle(className, condition);
  }
};

// Konvertiere eine Dezimalzahl in Prozent

export const intInProzent = function (number) {
  return Math.floor(number * 100);
};

const cache = new Map();

// Funktion zum Laden von Daten mit Caching

export const loadData = async (url, type = "json") => {
  if (cache.has(url)) {
    console.log(`Daten aus dem Cache für ${url}`);

    return cache.get(url);
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const data = await response[type]();

    cache.set(url, data);

    return data;
  } catch (error) {
    console.log("Es ist ein Fehler aufgetreten:", error.message);

    throw error;
  }
};
