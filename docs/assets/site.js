const search = document.querySelector('#search');
if (search) {
  const cards = [...document.querySelectorAll('.archive-card')];
  const status = document.querySelector('#search-status');
  search.addEventListener('input', () => {
    const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      card.hidden = !words.every(word => card.dataset.search.includes(word));
      if (!card.hidden) visible++;
    }
    status.textContent = words.length ? `${visible} ${visible === 1 ? 'issue' : 'issues'} found${visible ? '' : '. Try a different topic or date.'}` : '';
  });
}
