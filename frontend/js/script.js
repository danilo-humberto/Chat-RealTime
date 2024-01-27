// login 
const login = document.querySelector(".login")
const loginForm = document.querySelector(".login-form")
const loginInput = document.querySelector(".login-input")

// chat
const chat = document.querySelector(".chat")
const chatForm = document.querySelector(".chat-form")
const chatInput = document.querySelector(".chat-input")
const chatMessage = document.querySelector(".chat-messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

let websocket;

const user = {id: "", name: "", color: ""}

// funções

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getColor()

    login.style.display = 'none'
    chat.style.display = 'flex'

    websocket = new WebSocket("ws://localhost:3000") // vai conectar com o websocket

    websocket.onopen = () => {
        const joinMessage = { type: 'join', userName: user.name};
        websocket.send(JSON.stringify(joinMessage));
    }

    websocket.onmessage = processMessage // vai receber uma mensagem do servidor
}

const getColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length) 
    // vai gerar um número aleatório que vai servir como index do array das cores e, usando o floor, ele sempre vai arredondar para baixo //
    return colors[randomIndex]
}

const creatMessageSelf = (content) => {
    const div = document.createElement('div')
    div.classList.add("message-self")
    div.innerHTML = content

    return div
}

const creatMessageOther = (content, sender, senderColor) => {
    const div = document.createElement('div')
    const span = document.createElement('span')

    div.classList.add("message-other")

    //div.classList.add("message-self")
    span.classList.add("message-sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const creatMessageInto = (userName) => {
    const span = document.createElement('span')
    span.classList.add("message-into")
    span.innerHTML = `${userName} entrou no canal`

    return span
}

const processMessage = ({data}) => {
    const { type, userId, userName, userColor, content} = JSON.parse(data)
    // vai pegar a variavel "data" que é uma string e passar para um objeto

    if (type === 'join'){
        const joinMessage = creatMessageInto(userName)
        chatMessage.appendChild(joinMessage)
    } else {
        const message = userId == user.id ? creatMessageSelf(content) : creatMessageOther(content, userName, userColor)
        // verifica se o ID recebido é igual ao ID do user
    
        chatMessage.appendChild(message)
    }

    scrollScreen()
}

const sendMessage = (event) => {
    event.preventDefault() // não vai recarregar a página quando o user dar submit

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message)) // JSON.stringfy() => vai passar tudo que receber para string

    chatInput.value = ''
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

// eventos 
loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)