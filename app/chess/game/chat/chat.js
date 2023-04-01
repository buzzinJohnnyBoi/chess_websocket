export default class chat {
    static createMessage(sender, message, currentUser) {
        const el = document.createElement('li');
        const user = (currentUser) ? document.createElement('h1') : document.createElement('h2');
        const messageEl = document.createElement('b');
        user.innerHTML = sender + " said: ";
        messageEl.innerHTML = message;
        el.appendChild(user);
        el.appendChild(messageEl);
        document.querySelector('ul').appendChild(el);
        document.querySelector('.chat').scrollTop = document.querySelector('.chat').scrollHeight;
    }
}