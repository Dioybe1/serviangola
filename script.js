// 🔥 LOGIN
let usuario = localStorage.getItem("usuario");
let tipo = localStorage.getItem("tipo");

function iniciarSistema() {
    if (!usuario || !tipo) {
        usuario = prompt("Seu nome:");
        tipo = prompt("Digite: cliente ou prestador");

        localStorage.setItem("usuario", usuario);
        localStorage.setItem("tipo", tipo);
    }

    document.getElementById("userInfo").innerText =
        "👤 " + usuario + " (" + tipo + ")";

    carregarMenu();
}

// 🔥 LOGOUT
function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");

    location.reload(); // recarrega o site
}

// MENU
function carregarMenu() {
    let menu = document.getElementById("menu");

    if (tipo === "cliente") {
        menu.innerHTML = `<button onclick="verServicos()">Ver Serviços</button>`;
    } else {
        menu.innerHTML = `
            <button onclick="cadastrar()">Cadastrar Serviço</button>
            <button onclick="verServicos()">Ver Serviços</button>
        `;
    }
}

// DADOS
let prestadores = JSON.parse(localStorage.getItem("prestadores")) || [];

function salvarDados() {
    localStorage.setItem("prestadores", JSON.stringify(prestadores));
}

function mostrarVoltar() {
    document.getElementById("voltarBtn").style.display = "block";
}

function inicio() {
    document.getElementById("conteudo").innerHTML = "";
    document.getElementById("voltarBtn").style.display = "none";
}

// VER SERVIÇOS
function verServicos() {
    mostrarVoltar();

    let area = document.getElementById("conteudo");

    area.innerHTML = `<h2>Serviços</h2><div id="lista"></div>`;

    mostrarLista(prestadores);
}

// LISTA
function mostrarLista(lista) {
    let area = document.getElementById("lista");

    if (lista.length === 0) {
        area.innerHTML = "Sem serviços.";
        return;
    }

    let html = "";

    lista.forEach(function(p, index) {

        let media = 0;
        if (p.avaliacoes.length > 0) {
            let soma = p.avaliacoes.reduce((a, b) => a + b, 0);
            media = (soma / p.avaliacoes.length).toFixed(1);
        }

        let estrelas = "⭐".repeat(Math.round(media));

        html += `
            <div class="card">
                <h3>${p.nome}</h3>
                <p>${p.servico}</p>
                <p>${p.telefone}</p>
                <p class="estrelas">${estrelas} (${media})</p>

                ${tipo === "cliente" ? 
                    `<button onclick="avaliar(${index})">Avaliar</button>` : ""}

                <button class="whatsapp-btn" onclick="abrirWhatsApp('${p.telefone}')">
                    WhatsApp
                </button>

                ${tipo === "prestador" ? 
                    `<button class="delete-btn" onclick="apagar(${index})">Apagar</button>` 
                    : ""}
            </div>
        `;
    });

    area.innerHTML = html;
}

// AVALIAR
function avaliar(index) {
    let nota = Number(prompt("Nota 1 a 5"));

    if (nota < 1 || nota > 5) {
        alert("Inválido");
        return;
    }

    prestadores[index].avaliacoes.push(nota);

    salvarDados();
    verServicos();
}

// OUTROS
function abrirWhatsApp(numero) {
    window.open(`https://wa.me/${numero}`);
}

function cadastrar() {
    mostrarVoltar();

    document.getElementById("conteudo").innerHTML = `
        <h2>Cadastrar</h2>
        <input id="servico" placeholder="Serviço">
        <input id="telefone" placeholder="Telefone">
        <button onclick="enviar()">Salvar</button>
    `;
}

function enviar() {
    let servico = document.getElementById("servico").value;
    let telefone = document.getElementById("telefone").value;

    if (!servico || !telefone) {
        alert("Preencha!");
        return;
    }

    prestadores.push({
        nome: usuario,
        servico,
        telefone,
        avaliacoes: []
    });

    salvarDados();
    verServicos();
}

function apagar(index) {
    prestadores.splice(index, 1);
    salvarDados();
    verServicos();
}

// 🔥 iniciar sistema
iniciarSistema();