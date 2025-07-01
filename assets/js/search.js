// Implement Lunr.js search with fuzzy matching
(function() {
  const searchIndex = lunr(function() {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('content');
    this.field('tags', { boost: 5 });
    this.field('categories', { boost: 3 });
    this.field('summary', { boost: 2 });
    
    // Add fuzzy matching
    this.pipeline.add(lunr.stemmer);
    this.searchPipeline.add(lunr.stemmer);
    
    // Index documents
    window.searchIndex.forEach((doc) => {
      this.add(doc);
    });
  });
  
  // Search UI with keyboard navigation
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let selectedIndex = -1;
  
  searchInput.addEventListener('input', debounce(function(e) {
    const query = e.target.value;
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    
    const results = searchIndex.search(query);
    displayResults(results);
  }, 300));
  
  // Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    const items = searchResults.querySelectorAll('.search-result');
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        updateSelection(items);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection(items);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          window.location.href = items[selectedIndex].dataset.url;
        }
        break;
      case 'Escape':
        searchInput.blur();
        searchResults.innerHTML = '';
        selectedIndex = -1;
        break;
    }
  });
  
  function displayResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No results found</div>';
      return;
    }
    
    const html = results.map((result, index) => {
      const doc = window.searchIndex.find(d => d.id === result.ref);
      return `
        <div class="search-result" data-url="${doc.url}" data-index="${index}">
          <h4>${highlightText(doc.title, query)}</h4>
          <p>${highlightText(doc.summary, query)}</p>
          <div class="search-meta">
            <span class="search-type">${doc.type}</span>
            <span class="search-date">${formatDate(doc.date)}</span>
          </div>
        </div>
      `;
    }).join('');
    
    searchResults.innerHTML = html;
    selectedIndex = -1;
  }
  
  function updateSelection(items) {
    items.forEach((item, index) => {
      item.classList.toggle('selected', index === selectedIndex);
    });
    
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }
})();