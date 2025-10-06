// Espera todo o conteúdo da página carregar antes de executar o código
document.addEventListener('DOMContentLoaded', function() {

    // --- SELEÇÃO DOS ELEMENTOS DO DOM DO CARRINHO ---
    const carrinhoBody = document.querySelector('.carrinho-body'); // Onde os itens serão adicionados
    const subtotalInfo = document.querySelector('.subtotal-info'); // Onde o subtotal será exibido
    const productCards = document.querySelectorAll('.product-card'); // Todos os cards de produto
    const carrinhoLateral = document.getElementById('carrinho-lateral');
    const iconeCarrinho = document.getElementById('icone-carrinho');
    const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
    const overlay = document.getElementById('overlay');
    const continuarComprandoBtn = document.getElementById('continuar-comprando');

    // --- ESTADO DO CARRINHO (A "MEMÓRIA" DO CARRINHO) ---
    let itensDoCarrinho = [];

    // --- FUNÇÕES PRINCIPAIS DO CARRINHO ---

    /**
     * Pega os dados de um card de produto e adiciona ao carrinho
     */
    function adicionarAoCarrinho(event) {
        const card = event.target.closest('.product-card');
        const nome = card.querySelector('h3').innerText;
        const precoTexto = card.querySelector('.price').innerText;
        const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.'));
        const imagemSrc = card.querySelector('img').src;

        // Verifica se o item já existe no carrinho
        const itemExistente = itensDoCarrinho.find(item => item.nome === nome);
        if(itemExistente){
            // Se já existe, apenas aumenta a quantidade
            itemExistente.quantidade++;
        } else {
            // Se não existe, adiciona o novo item à lista
            itensDoCarrinho.push({nome, preco, imagem: imagemSrc, quantidade:1});
        }

        // Atualiza a exibição do carrinho na tela
        renderizarCarrinho();
        // Abre o carrinho para o usuário ver o que adicionou
        abrirCarrinho();
    }

    /**
     * Desenha os itens do carrinho na aba lateral
     */
    function renderizarCarrinho() {
        // Limpa o carrinho antes de adicionar os itens atualizados
        carrinhoBody.innerHTML = '';

        // Se o carrinho estiver vazio, exibe mensagem
        if(itensDoCarrinho.length === 0){
            carrinhoBody.innerHTML = '<p style="text-align:center;color:#666;">Seu carrinho está vazio.</p>';
            atualizarSubtotal(); // Garante que o subtotal zere
            return;
        }

        // Adiciona cada item da lista ao HTML do carrinho
        itensDoCarrinho.forEach(item => {
            const itemHTML = `
                <div class="item-carrinho" data-nome="${item.nome}">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="item-info">
                        <p class="item-nome">${item.nome}</p>
                        <div class="item-controles">
                            <input type="number" class="item-qtd" value="${item.quantidade}" min="1">
                            <p class="item-preco">R$${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
                            <button class="remover-item-btn">Remover</button>
                        </div>
                    </div>
                </div>
            `;
            carrinhoBody.innerHTML += itemHTML;
        });

        // Atualiza o subtotal após adicionar os itens
        atualizarSubtotal();
    }

    /**
     * Calcula e exibe o preço total dos itens no carrinho
     */
    function atualizarSubtotal() {
        // Calcula o total somando (preço * quantidade) de cada item
        const total = itensDoCarrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

        // Formata o número para o padrão brasileiro (R$ 123,45)
        const totalFormatado = total.toFixed(2).replace('.', ',');

        // Exibe no HTML
        subtotalInfo.innerHTML = `<span>Subtotal</span><span>R$${totalFormatado}</span>`;
    }

    /**
     * Lida com cliques dentro do corpo do carrinho (remover item, mudar quantidade)
     */
    function manipularCarrinho(event){
        const target = event.target;
        const itemElemento = target.closest('.item-carrinho');
        if(!itemElemento) return;

        const nomeDoItem = itemElemento.dataset.nome;

        // Se clicou no botão de remover
        if(target.classList.contains('remover-item-btn')){
            itensDoCarrinho = itensDoCarrinho.filter(item => item.nome !== nomeDoItem);
        }

        // Se mudou a quantidade no input
        if(target.classList.contains('item-qtd')){
            const novaQtd = parseInt(target.value);
            const itemParaAtualizar = itensDoCarrinho.find(item => item.nome === nomeDoItem);
            if(itemParaAtualizar && novaQtd > 0){
                itemParaAtualizar.quantidade = novaQtd;
            } else {
                // Se a quantidade for inválida, remove o item
                itensDoCarrinho = itensDoCarrinho.filter(item => item.nome !== nomeDoItem);
            }
        }

        // Redesenha o carrinho com os dados atualizados
        renderizarCarrinho();
    }

    // --- FUNÇÕES PARA ABRIR/FECHAR O CARRINHO ---
    function abrirCarrinho(){
        overlay.classList.remove('hidden');
        carrinhoLateral.classList.remove('hidden');
    }

    function fecharCarrinho(){
        overlay.classList.add('hidden');
        carrinhoLateral.classList.add('hidden');
    }

    // --- "OUVINTES" DE EVENTOS (EVENT LISTENERS) ---
    productCards.forEach(card => {
        const addButton = card.querySelector('.add-to-cart-btn');
        addButton.addEventListener('click', adicionarAoCarrinho);
    });

    carrinhoBody.addEventListener('change', manipularCarrinho); // Para inputs de quantidade
    carrinhoBody.addEventListener('click', manipularCarrinho);  // Para botões de remover

    iconeCarrinho.addEventListener('click', (e)=>{ e.preventDefault(); abrirCarrinho(); });
    fecharCarrinhoBtn.addEventListener('click', fecharCarrinho);
    overlay.addEventListener('click', fecharCarrinho);
    continuarComprandoBtn.addEventListener('click', (e)=>{ e.preventDefault(); fecharCarrinho(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && !carrinhoLateral.classList.contains('hidden')) fecharCarrinho(); });

    // Renderiza o carrinho vazio ao iniciar
    renderizarCarrinho();


    // --- PLAYLIST ---
    const playlistLateral = document.getElementById("playlist-lateral");
    const playlistOverlay = document.getElementById("playlist-overlay");
    const iconePlaylist = document.getElementById("icone-playlist");
    const fecharPlaylist = document.getElementById("fechar-playlist");
    const addPlaylistBtn = document.getElementById("addPlaylistBtn");
    const playlistInput = document.getElementById("playlistInput");
    const playlistContainer = document.getElementById("playlistContainer");

    // Abre playlist
    iconePlaylist.addEventListener('click', (e)=>{
        e.preventDefault();
        carrinhoLateral.classList.add('hidden'); // Fecha carrinho se estiver aberto
        playlistLateral.classList.add('active');
        playlistOverlay.classList.remove('hidden');
    });

    // Fecha playlist clicando no X ou overlay
    fecharPlaylist.addEventListener('click', ()=>{
        playlistLateral.classList.remove('active');
        playlistOverlay.classList.add('hidden');
    });
    playlistOverlay.addEventListener('click', ()=>{
        playlistLateral.classList.remove('active');
        playlistOverlay.classList.add('hidden');
    });

    // Adiciona links à playlist
    addPlaylistBtn.addEventListener('click', function() {
        const link = playlistInput.value.trim();
        if(link){
            let embedLink = "";
            if(link.includes("spotify.com")){
                embedLink = link.replace("open.spotify.com","open.spotify.com/embed").split("?")[0];
            } else if(link.includes("deezer.com")){
                const parts = link.split("/");
                const trackId = parts[parts.length - 1].split("?")[0];
                embedLink = `https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=false&width=100%&height=300&color=007FEB&layout=dark&size=medium&type=tracks&id=${trackId}&app_id=1`;
            }

            if(embedLink){
                const iframe = document.createElement("iframe");
                iframe.src = embedLink;
                iframe.width = "100%";
                iframe.height = "300";
                iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
                iframe.style.border = "none";
                iframe.style.borderRadius = "12px";
                playlistContainer.appendChild(iframe);
                playlistInput.value = "";
            } else {
                alert("Link não suportado. Cole um link do Spotify ou Deezer.");
            }
        } else {
            alert("Cole o link da playlist antes de adicionar!");
        }
    });


    // --- CÂMBIO ---
    const cambioLateral = document.getElementById('cambio-lateral');
    const iconeCambio = document.getElementById('icone-cambio');
    const fecharCambio = document.getElementById('fechar-cambio');
    const moedaSelect = document.getElementById('moedaSelect');
    const valorConvertido = document.getElementById('valorConvertido');

    const precoProduto = 99.99; // exemplo — depois dá pra pegar do produto clicado

    iconeCambio.addEventListener('click', ()=>{
        carrinhoLateral.classList.add('hidden');  // Fecha carrinho se estiver aberto
        playlistLateral.classList.remove('active'); // Fecha playlist se estiver aberto
        playlistOverlay.classList.add('hidden'); // Oculta overlay
        cambioLateral.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });

    fecharCambio.addEventListener('click', ()=>{
        cambioLateral.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    moedaSelect.addEventListener('change', async ()=>{
        const moeda = moedaSelect.value;
        try {
            const response = await fetch(`https://api.exchangerate.host/latest?base=BRL&symbols=${moeda}`);
            const data = await response.json();
            const taxa = data.rates[moeda];
            const convertido = (precoProduto * taxa).toFixed(2);
            valorConvertido.innerHTML = `<p>💰 Valor em ${moeda}: <strong>${convertido} ${moeda}</strong></p><p>(Baseado em R$ ${precoProduto})</p>`;
        } catch (err) {
            valorConvertido.innerHTML = `<p>Erro ao carregar a cotação 😕</p>`;
        }
    });

});
