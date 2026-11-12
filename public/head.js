/* 2026-11-12: runs before first paint (CSP allows only same-origin scripts, so it is a file). Lets the phone header start collapsed instead of jumping 86px when app.js arrives. */
document.documentElement.classList.add('js');
