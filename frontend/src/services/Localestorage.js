// Gestion centralisé des localstorage

// delete storage
export function removeItem(itemToRemove) {
    window.localStorage.removeItem(itemToRemove);
}

// getstorage (token)
export function getItem(item) {
    return window.localStorage.getItem(item);
}

// create storage
export function addItem(localStorageName, newItem) {
    window.localStorage.setItem(localStorageName, newItem);
}