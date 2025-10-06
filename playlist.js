// Abrir e fechar o modal lateral
const foneIcon = document.getElementById("icone-fone"); // o ícone do fone da sua navbar
const playlistOverlay = document.getElementById("playlist-overlay");
const playlistLateral = document.getElementById("playlist-lateral");
const fecharPlaylist = document.getElementById("fechar-playlist");

if (foneIcon) {
  foneIcon.addEventListener("click", () => {
    playlistOverlay.classList.remove("hidden");
    playlistLateral.classList.remove("hidden");
  });
}

if (fecharPlaylist) {
  fecharPlaylist.addEventListener("click", () => {
    playlistOverlay.classList.add("hidden");
    playlistLateral.classList.add("hidden");
  });
}

if (playlistOverlay) {
  playlistOverlay.addEventListener("click", () => {
    playlistOverlay.classList.add("hidden");
    playlistLateral.classList.add("hidden");
  });
}

// Função para adicionar playlist
document.getElementById('addPlaylistBtn').addEventListener('click', addPlaylist);

function addPlaylist() {
  const link = document.getElementById('playlistInput').value.trim();
  const container = document.getElementById('playlistContainer');
  let embedCode = '';

  if (link.includes('spotify.com')) {
    const playlistId = link.split('/playlist/')[1].split('?')[0];
    embedCode = `
      <iframe style="border-radius:12px"
              src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator"
              width="100%" height="380" frameborder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
  } 
  else if (link.includes('deezer.com')) {
    const playlistId = link.split('/playlist/')[1].split('?')[0];
    embedCode = `
      <iframe scrolling="no" frameborder="0" allowtransparency="true"
              src="https://widget.deezer.com/widget/dark/playlist/${playlistId}"
              width="100%" height="380"></iframe>`;
  } 
  else {
    alert('Por favor, insira um link válido do Spotify ou Deezer!');
    return;
  }

  container.innerHTML = embedCode;
}
