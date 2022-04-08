const main = document.querySelector('main');
const buttonInsertText = document.querySelector('.btn-toggle');
const buttonReadText = document.querySelector('#read');
const divTextBox = document.querySelector('.text-box');
const closeDivTextBox = document.querySelector('.close');
const selectElement = document.querySelector('select');
const textArea = document.querySelector('textarea');

const humanExpressions = [
    {img: './img/drink.jpg', text: 'Estou com sede'},
    {img: './img/food.jpg', text: 'Estou com fome'},
    {img: './img/tired.jpg', text: 'Estou cansado'},
    {img: './img/hurt.jpg', text: 'Estou machucado'},
    {img: './img/happy.jpg', text: 'Estou feliz'},
    {img: './img/angry.jpg', text: 'Estou com raiva'},
    {img: './img/sad.jpg', text: 'Estou triste'},
    {img: './img/scared.jpg', text: 'Estou assustado'},
    {img: './img/outside.jpg', text: 'Quero ir lá fora'},
    {img: './img/home.jpg', text: 'Quero ir para casa'},
    {img: './img/school.jpg', text: 'Quero ir para a escola'},
    {img: './img/grandma.jpg', text: 'Quero ver a vovó'}
];

//representa uma solicitação de fala. Ele contém o conteúdo que o serviço de fala deve ler e informações sobre como lê-lo (por exemplo, idioma, tom e volume).
const utterance = new SpeechSynthesisUtterance();

//adicionar, no utterance, o texto/enunciado que será falado
const setTextMessege =  text => {
    utterance.text = text;
}
// para enfileirar todos os utterance(enunciados) e fala-los na ordem
const speakText = () => {
    speechSynthesis.speak(utterance);
}

//trocar a linguagem que será usada
const setVoice = event => {
   const selectedVoice = voices.find(voice => voice.name === event.target.value);
   utterance.voice = selectedVoice;
}

//cria as div de imagem e texto
const createExpressionBox = ({ img, text }) => {
    const div = document.createElement('div');

    div.classList.add('expression-box');
    div.innerHTML = `
        <img src="${img}" alt="${text}">
        <p class="info">${text}</p>
    `
     // aciona a fala da imagem
    div.addEventListener('click', () => {
        setTextMessege(text);
        speakText();

        //cria um sombreado na imagem clicada
        div.classList.add('active');
        setTimeout(() => {
            div.classList.remove('active')
        }, 1000 );
    });

   main.appendChild(div);
}

humanExpressions.forEach(createExpressionBox);

let voices = [];

//pegar todos as lingugens disponíveis no dispositvos com o "getVoices()" e coloca-los no array (voices) como objetos
speechSynthesis.addEventListener('voiceschanged', () => {
    voices = speechSynthesis.getVoices();

    // torna o "pt-br" com idioma padrão 
    const googleVoice = voices.find(voice => voice.name === "Google português do Brasil");

    const microsoftVoice = voices.find(voice => {
        voice.name === "Microsoft Daniel - Portuguese (Brazil)"});

    //através da Destructuring, extrair os atributos "name" e "lang" de cada objeto(voice) e colocá-los em uma tag optionna, que será adicionada na selectElement
    voices.forEach(({ name, lang }) => {

        const option = document.createElement('option');

        option.value = name;

        // torna o "pt-br" com idioma padrão
        if(googleVoice && option.value === googleVoice.name){
            utterance.voice = googleVoice;
            option.selected = true;
        } else if (microsoftVoice && option.value === microsoftVoice.name){
            utterance.voice = microsoftVoice;
            option.selected = true;
        }

        option.textContent = `${lang} | ${name}`
        selectElement.appendChild(option); 
    });
});

//adciona uma class "show" na divTextBox para aparecer a textarea
buttonInsertText.addEventListener('click', () => {
    divTextBox.classList.add('show');
});

// habilita o botão de fechar(X), para retirar a class"show" e sair a textarea
closeDivTextBox.addEventListener('click', () => {
    divTextBox.classList.remove('show');
});

//evento que identifica quando a linguangem menu é alterada, chama a função "setVoice()"
selectElement.addEventListener('change', setVoice);

//ler o texto que está na textarea
buttonReadText.addEventListener('click', () => {
    setTextMessege(textArea.value);
    speakText();
});