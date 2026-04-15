document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 1. Alto Contraste
    // ----------------------------------------------------
    const btnContraste = document.getElementById('btn-contraste');
    const body = document.body;

    // Checa localStorage para manter preferência do usuário
    if (localStorage.getItem('alto-contraste') === 'true') {
        body.classList.add('alto-contraste');
    }

    btnContraste.addEventListener('click', () => {
        body.classList.toggle('alto-contraste');
        
        // Salva preferência
        if (body.classList.contains('alto-contraste')) {
            localStorage.setItem('alto-contraste', 'true');
        } else {
            localStorage.setItem('alto-contraste', 'false');
        }
    });

    // ----------------------------------------------------
    // 2. Ajuste de Tamanho da Fonte (Acessibilidade Visual)
    // ----------------------------------------------------
    const btnFonteAumentar = document.getElementById('btn-fonte-aumentar');
    const btnFonteDiminuir = document.getElementById('btn-fonte-diminuir');
    const btnFonteNormal = document.getElementById('btn-fonte-normal');
    
    // Configurações de limite (10px a 24px) - O padrão definido no CSS é 16px.
    let fonteAtual = parseInt(window.getComputedStyle(document.documentElement).fontSize) || 16;
    const fonteMax = 26;
    const fonteMin = 12;

    const setFonteGlobal = (tamanho) => {
        document.documentElement.style.fontSize = `${tamanho}px`;
    };

    btnFonteAumentar.addEventListener('click', () => {
        if (fonteAtual < fonteMax) {
            fonteAtual += 2;
            setFonteGlobal(fonteAtual);
        }
    });

    btnFonteDiminuir.addEventListener('click', () => {
        if (fonteAtual > fonteMin) {
            fonteAtual -= 2;
            setFonteGlobal(fonteAtual);
        }
    });

    btnFonteNormal.addEventListener('click', () => {
        fonteAtual = 16;
        setFonteGlobal(fonteAtual);
        document.documentElement.style.removeProperty('font-size'); // Retorna ao controle do CSS default
    });

    // ----------------------------------------------------
    // 3. Menu Mobile Acessível (Hamburguer)
    // ----------------------------------------------------
    const btnMenuMobile = document.getElementById('btn-menu-mobile');
    const listaMenu = document.querySelector('.lista-menu');

    btnMenuMobile.addEventListener('click', () => {
        const expanded = btnMenuMobile.getAttribute('aria-expanded') === 'true';
        btnMenuMobile.setAttribute('aria-expanded', !expanded);
        listaMenu.classList.toggle('ativo');
        
        // Se abriu, joga o foco pro primeiro link do menu
        if (!expanded) {
            const primeiroLink = listaMenu.querySelector('a');
            if(primeiroLink) primeiroLink.focus();
        }
    });

    // Fechar menu mobile com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (btnMenuMobile.getAttribute('aria-expanded') === 'true') {
                btnMenuMobile.setAttribute('aria-expanded', 'false');
                listaMenu.classList.remove('ativo');
                btnMenuMobile.focus(); // Retorna o foco pro botão do hamburger
            }
        }
    });

    // ----------------------------------------------------
    // 4. Navegação por Âncoras (Foco Preciso WCAG)
    // ----------------------------------------------------
    // Seleciona as âncoras locais (que começam com # e têm mais de um char)
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.skip-link)');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Pegamos o id do alvo
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return; // href="#" null safety

            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Foca o elemento via Javascript nativo.
                // O HTML já possui tabindex="-1" garantindo o suporte do focus()
                targetElement.focus();
                
                // Se for mobile e o usuário clicou num link interno do menu, devemos fechar o menu.
                if (btnMenuMobile.getAttribute('aria-expanded') === 'true' && this.closest('#menu-principal')) {
                    btnMenuMobile.setAttribute('aria-expanded', 'false');
                    listaMenu.classList.remove('ativo');
                }
            }
        });
    });

    // Processamento custom do Skip Link apenas para garantir comportamento impecável
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            const targetId = skipLink.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if(target) {
                target.focus();
            }
        });
    }
});
