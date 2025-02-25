console.groupCollapsed("🟢 Initialisation..."); // Message de débogage
getCookies()
load(); // Charge les cookies
setupUI(); // Initialise l'interface utilisateur
setupTest(); // Initialise les tests
console.log("🟢 Initialisation terminée."); // Message de débogage
console.groupEnd(); // Fin du groupe de logs