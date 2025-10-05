// Espera todo o conteúdo da página carregar antes de executar o código
document.addEventListener('DOMContentLoaded', function() {

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const carrinhoLateral = document.getElementById('carrinho-lateral');
    const iconeCarrinho = document.getElementById('icone-carrinho');
    const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
    const overlay = document.getElementById('overlay');
    const continuarComprandoBtn = document.getElementById('continuar-comprando');
    const carrinhoBody = document.querySelector('.carrinho-body'); // Onde os itens serão adicionados
    const subtotalInfo = document.querySelector('.subtotal-info'); // Onde o subtotal será exibido
    const productCards = document.querySelectorAll('.product-card'); // Todos os cards de produto

    // --- ESTADO DO CARRINHO (A "MEMÓRIA" DO CARRINHO) ---
    let itensDoCarrinho = [];

    // --- FUNÇÕES PRINCIPAIS DO CARRINHO ---

    /**
     * Pega os dados de um card de produto e adiciona ao carrinho
     */
    function adicionarAoCarrinho(event) {
        // Pega o card do produto inteiro, que é o 'pai' do botão clicado
        const card = event.target.closest('.product-card');

        // Extrai as informações do produto
        const nome = card.querySelector('h3').innerText;
        const precoTexto = card.querySelector('.price').innerText;
        const imagemSrc = card.querySelector('img').src;

        // Converte o preço de "R$99,99" para um número (99.99)
        const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.'));

        // Verifica se o item já existe no carrinho
        const itemExistente = itensDoCarrinho.find(item => item.nome === nome);

        if (itemExistente) {
            // Se já existe, apenas aumenta a quantidade
            itemExistente.quantidade++;
        } else {
            // Se não existe, adiciona o novo item à lista
            itensDoCarrinho.push({
                nome: nome,
                preco: preco,
                imagem: imagemSrc,
                quantidade: 1,
            });
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
        // 1. Limpa o carrinho antes de adicionar os itens atualizados
        carrinhoBody.innerHTML = '';

        // 2. Verifica se o carrinho está vazio
        if (itensDoCarrinho.length === 0) {
            carrinhoBody.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio.</p>';
            atualizarSubtotal(); // Garante que o subtotal zere
            return; // Para a execução da função aqui
        }

        // 3. Adiciona cada item da lista ao HTML do carrinho
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

        // 4. Atualiza o valor do subtotal
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
        subtotalInfo.innerHTML = `
            <span>Subtotal</span>
            <span>R$${totalFormatado}</span>
        `;
    }

    /**
     * Lida com cliques dentro do corpo do carrinho (remover item, mudar qtd)
     */
    function manipularCarrinho(event) {
        const target = event.target;
        const itemElemento = target.closest('.item-carrinho');
        if (!itemElemento) return;

        const nomeDoItem = itemElemento.dataset.nome;

        // Se clicou no botão de remover
        if (target.classList.contains('remover-item-btn')) {
            // Filtra o array, mantendo apenas os itens que NÃO são o que queremos remover
            itensDoCarrinho = itensDoCarrinho.filter(item => item.nome !== nomeDoItem);
        }
        
        // Se mudou a quantidade no input
        if (target.classList.contains('item-qtd')) {
            const novaQuantidade = parseInt(target.value);
            const itemParaAtualizar = itensDoCarrinho.find(item => item.nome === nomeDoItem);

            if (itemParaAtualizar && novaQuantidade > 0) {
                itemParaAtualizar.quantidade = novaQuantidade;
            } else {
                // Se a quantidade for inválida, remove o item
                 itensDoCarrinho = itensDoCarrinho.filter(item => item.nome !== nomeDoItem);
            }
        }
        
        // Redesenha o carrinho com os dados atualizados
        renderizarCarrinho();
    }


    // --- FUNÇÕES PARA ABRIR/FECHAR O CARRINHO ---
    function abrirCarrinho() {
        if (carrinhoLateral && overlay) {
            overlay.classList.remove('hidden');
            carrinhoLateral.classList.remove('hidden');
        }
    }

    function fecharCarrinho() {
        if (carrinhoLateral && overlay) {
            overlay.classList.add('hidden');
            carrinhoLateral.classList.add('hidden');
        }
    }

    // --- "OUVINTES" DE EVENTOS (EVENT LISTENERS) ---

    // Adicionar item ao carrinho
    productCards.forEach(card => {
        const addButton = card.querySelector('.add-to-cart-btn');
        addButton.addEventListener('click', adicionarAoCarrinho);
    });

    // Manipular itens já no carrinho (remover, alterar quantidade)
    carrinhoBody.addEventListener('change', manipularCarrinho); // Para inputs de quantidade
    carrinhoBody.addEventListener('click', manipularCarrinho);    // Para botões de remover

    // Abrir e Fechar a aba do carrinho
    iconeCarrinho.addEventListener('click', (e) => { e.preventDefault(); abrirCarrinho(); });
    fecharCarrinhoBtn.addEventListener('click', fecharCarrinho);
    overlay.addEventListener('click', fecharCarrinho);
    continuarComprandoBtn.addEventListener('click', (e) => { e.preventDefault(); fecharCarrinho(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !carrinhoLateral.classList.contains('hidden')) {
            fecharCarrinho();
        }
    });

    // Inicia a renderização para mostrar "carrinho vazio" ao carregar a página
    renderizarCarrinho();

    // Espera todo o conteúdo da página carregar antes de executar o código
document.addEventListener('DOMContentLoaded', function() {

    // ... (todo o seu código JS existente do carrinho vai aqui) ...
    
    // --- "OUVINTES" DE EVENTOS (EVENT LISTENERS) ---
    
    // ... (os event listeners do seu carrinho vão aqui) ...

    // Inicia a renderização para mostrar "carrinho vazio" ao carregar a página
    renderizarCarrinho();


    /* =================================================== */
    /* ADICIONE O NOVO CÓDIGO PARA AS CATEGORIAS AQUI    */
    /* =================================================== */
    
    // Seleciona todos os itens de categoria
    const categoryItems = document.querySelectorAll('.category-item');

    // Para cada item de categoria, adiciona um "ouvinte" de clique
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Pega o nome da categoria que está dentro do elemento <span>
            const categoryName = item.querySelector('span').innerText;

            // Mostra um alerta com o nome da categoria clicada
            // No futuro, você pode trocar este alerta por uma função de filtro de produtos!
            alert(`Você clicou na categoria: ${categoryName}`);
        });
    });

}); // <-- Esta é a chave de fechamento final do seu addEventListener
});