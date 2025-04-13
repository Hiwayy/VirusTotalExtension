document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('save');
    const scanButton = document.getElementById('scan');
    const resultDiv = document.getElementById('result');
    const consoleOutput = document.getElementById('console-output');
    const logContent = document.getElementById('log-content');
    
    // Fonction pour ajouter des logs dans l'interface
    function logToUI(message, isTitle = false) {
      consoleOutput.style.display = 'block';
      const logEntry = document.createElement('div');
      logEntry.className = isTitle ? 'log-title' : 'log-entry';
      logEntry.textContent = message;
      logContent.appendChild(logEntry);
      
      // Pour les titres, ajouter un séparateur
      if (isTitle) {
        const separator = document.createElement('div');
        separator.className = 'log-separator';
        logContent.appendChild(separator);
      }
      
      // Aussi envoyer à la console
      console.log(message);
    }
    
    // Charger la clé API
    chrome.storage.local.get(['vtApiKey'], function(result) {
      if (result.vtApiKey) apiKeyInput.value = result.vtApiKey;
    });
    
    // Sauvegarder la clé API
    saveButton.addEventListener('click', function() {
      chrome.storage.local.set({vtApiKey: apiKeyInput.value});
      alert('Clé sauvegardée!');
    });
    
    // Scanner URL
    scanButton.addEventListener('click', function() {
      const apiKey = apiKeyInput.value;
      if (!apiKey) {
        alert('Veuillez entrer une clé API');
        return;
      }
      
      // Réinitialiser les résultats et les logs
      resultDiv.textContent = 'Scan en cours...';
      logContent.innerHTML = '';
      consoleOutput.style.display = 'none';
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const url = tabs[0].url;
        
        // Étape 1: Soumettre l'URL
        const formData = new URLSearchParams();
        formData.append('url', url);
        
        fetch('https://www.virustotal.com/api/v3/urls', {
          method: 'POST',
          headers: {
            'x-apikey': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          const analysisId = data.data.id;
          const urlId = analysisId.split('-')[1];
          
          // Étape 2: Attendre et récupérer les résultats
          setTimeout(() => {
            fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
              method: 'GET',
              headers: {'x-apikey': apiKey}
            })
            .then(response => response.json())
            .then(data => {
              const stats = data.data.attributes.last_analysis_stats;
              
              // Afficher les résultats basiques
              resultDiv.innerHTML = `
                <strong>URL:</strong> ${url}<br>
                <strong>Malveillant:</strong> ${stats.malicious}<br>
                <strong>Suspect:</strong> ${stats.suspicious}<br>
                <strong>Inoffensif:</strong> ${stats.harmless}<br>
                <strong>Non détecté:</strong> ${stats.undetected}<br>
                <br>
                <strong>Verdict:</strong> ${stats.malicious > 0 ? '⚠️ Potentiellement dangereux' : 
                                         stats.suspicious > 0 ? '⚠️ Suspect' : 
                                         '✅ Semble sûr'}
              `;
              
              // Afficher les logs détaillés dans l'interface
              logToUI("=== RÉSULTATS DE L'ANALYSE ===", true);
              logToUI(`URL analysée: ${url}`);
              
              // Extraire quelques informations clés
              logToUI(`Date d'analyse: ${new Date(data.data.attributes.last_analysis_date * 1000).toLocaleString()}`);
              logToUI(`Réputation: ${data.data.attributes.reputation || "Non disponible"}`);
              
              logToUI("=== ANALYSE IA SIMULÉE ===", true);
              logToUI(`Cette URL a été signalée par ${stats.malicious} moteurs de détection comme malveillante.`);
              
              if (stats.malicious > 5) {
                logToUI("VERDICT: URL dangereuse. Évitez absolument de visiter ce site.");
                logToUI("RISQUES POSSIBLES:", true);
                logToUI("- Phishing et vol d'informations personnelles");
                logToUI("- Distribution de logiciels malveillants");
                logToUI("- Tentatives d'arnaque ou d'escroquerie");
              } else if (stats.malicious > 0) {
                logToUI("VERDICT: URL suspecte. Procédez avec grande prudence.");
                logToUI("RISQUES POSSIBLES:", true);
                logToUI("- Contenu potentiellement indésirable");
                logToUI("- Publicités agressives ou trompeuses");
                logToUI("- Risque modéré de logiciels malveillants");
              } else {
                logToUI("VERDICT: URL probablement sûre. Aucune menace détectée.");
                logToUI("RECOMMANDATION:", true);
                logToUI("Cette URL n'a pas été signalée comme malveillante par les moteurs de sécurité.");
                logToUI("Vous pouvez naviguer sur ce site avec un niveau de confiance normal.");
              }
            })
            .catch(error => {
              resultDiv.textContent = `Erreur: ${error.message}`;
            });
          }, 3000);
        })
        .catch(error => {
          resultDiv.textContent = `Erreur: ${error.message}`;
        });
      });
    });
  });