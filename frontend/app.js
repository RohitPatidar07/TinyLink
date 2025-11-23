const apiBase = 'http://localhost:4000';

const form = document.getElementById('shorten-form');
const urlInput = document.getElementById('url-input');
const result = document.getElementById('result');
const linksDiv = document.getElementById('links');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return alert('Enter a URL');
  try {
    const res = await fetch(`${apiBase}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (res.ok) {
      result.innerHTML = `<p>Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>`;
      urlInput.value = '';
      loadLinks();
    } else {
      result.textContent = data.error || 'Error creating short link';
    }
  } catch (err) {
    console.error(err);
    result.textContent = 'Network error';
  }
});

async function loadLinks() {
  try {
    const res = await fetch(`${apiBase}/api/links`);
    const rows = await res.json();
    linksDiv.innerHTML = rows.map(r => `
      <div class="link-item">
        <a href="http://localhost:4000/${r.code}" target="_blank">http://localhost:4000/${r.code}</a>
        <div class="meta">Original: <a href="${r.url}" target="_blank">${r.url}</a> — visits: ${r.visits}</div>
      </div>
    `).join('');
  } catch (err) {
    linksDiv.textContent = 'Could not load links';
  }
}

// initial load
loadLinks();