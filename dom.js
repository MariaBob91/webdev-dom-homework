import { API } from "./api.js";
import { getDate } from "./util.js";
import { format } from "date-fns";

export const DOM = {
    container: document.querySelector('.container'),
    buttonElement: document.getElementById('add-button'),
    authButtonElement: document.getElementById('auth-button'),
    nameInputElement: document.getElementById('name-input'),
    textInputElement: document.getElementById('text-input'),
    listElement: document.getElementById('list'),

    users: [],
    userComment: "",

    state: {
        waitingUser: true,
        loginUser: false,
    },


    getComments() {
        API.getCommentsFromServer()
            .then((responseData) => {
                this.users = responseData.comments.map((comment) => {
                    const dateFromServer = new Date(comment.date);
                    console.log(dateFromServer);

                    return {
                        name: comment.author.name,
                        date: format(dateFromServer, "yyyy-MM-dd hh.mm.ss"),
                        comment: comment.text,
                        likes: comment.likes,
                        isLiked: comment.isLiked,
                    }
                });

                this.renderApp();

                document.getElementById('loading-new')?.classList.add("hidden");
            })
            .catch(error => {
                console.error("Ошибка загрузки комментариев:", error);
                alert('Ошибка загрузки комментариев');
            })
            .finally(() => {
                const element = document.getElementById('loading-new')

                if (!element || element.classList.contains('hidden'))
                    return

                document.getElementById('addComment-status').classList.add("hidden");
                document.querySelector('.add-form').classList.remove('hidden');
                element.classList.add('hidden');
                this.updateValue();
            })
    },

    sendComment(name, text) {
        const formElement = document.querySelector('.add-form')
        const loader = document.getElementById('loading-new')
        formElement.classList.add('hidden')
        loader.classList.remove('hidden')

        document.getElementById('addComment-status');

        API.sendCommentToServer(name, text)
            .then(() => {
                this.getComments();
                this.nameInputElement.value = '';
                this.textInputElement.value = '';

                this.buttonElement.disabled = false;

            })
            .catch((error) => {
                if (error.message === 'Failed to fetch') {
                    alert("Кажется, сломался интернет. Попробуйте позже");
                } else {
                    alert(error.message)
                }

                loader.classList.add('hidden')
                formElement.classList.remove('hidden')
            })
    },


    renderApp() {
        const parts = []

        if (this.state.loginUser) {
            parts.push(`<div class="auth-form">
                <input id="login-input" type="text" value="" class="input-form" placeholder="Введите логин" />
                <input id="password-input" type="password" class="textArea-form_pass" placeholder="Введите пароль">
                <div class="add-form-row add-form-row--center">
                    <button id="auth-button" class="add-form-button">Авторизоваться</button>
                </div>
            </div>
            <p><a href="#" id="auth-link">Вернуться к комментариям</a></p>`)
        } else {
            parts.push(`<ul class="comments" id="list">`)
            parts.push(...this.getCommentItems())
            parts.push(`</ul>`)

            if (this.state.waitingUser) {
                parts.push(`<p>Чтобы добавить комментарий, <a href="#" id="auth-link">авторизуйтесь</a></p>`)
            } else {
                parts.push(`<p class="loading hidden" id="loading-new">Комментарий добавляется...</p>
                <div class="add-form">
                    <input id="name-input" type="text" value="${API.userName}" disabled class="input-form" placeholder="Введите ваше имя" />
                    <textarea id="text-input" class="textArea-form" placeholder="Введите ваш комментарий"
                        rows="4">${this.userComment}</textarea>
                    <div class="add-form-row">
                        <button id="add-button" class="add-form-button">Написать</button>
                    </div>
                </div>`)
            }

            this.userComment = ""
        }

        this.container.innerHTML = parts.join('')

        document.getElementById("auth-link")?.addEventListener("click", () => {
            if (this.state.loginUser)
                this.state.loginUser = false
            else
                this.state.loginUser = true

            this.renderApp()
        })

        if (!this.state.waitingUser || this.state.loginUser)
            this.handleListeners()

        if (!this.state.loginUser) {
            this.initLikeButtonListeners()
            this.initAnswerComment()
        }
    },

    getCommentItems() {
        return this.users
            .map((user, index) =>
                `<li class="comment" data-index="${index}">
                    <div class="comment-header">
                        <div>${user.name}</div>
                        <div>${user.date}</div>
                    </div>
                    <div data-text="${user.comment}" class="comment-body">
                        <div class="comment-text">${user.comment}</div>
                    </div>
                    <div class="comment-footer">
                        <div class="likes">
                        <span class="likes-counter">${user.likes}</span>
                        <button data-like="${user.likes}" data-index="${index}" class="like-button ${user.isLiked ? '-active-like' : 'like-button'}"></button>
                        </div>
                    </div>
                </li>`
        )
    },

    initAnswerComment() {
        const commentsElements = document.querySelectorAll('.comment');
        const textInputElement = document.getElementById('text-input');
        for (const comment of commentsElements) {
            comment.addEventListener('click', () => {
                if (this.state.waitingUser)
                    return

                const indexComment = comment.dataset.index;
                const currentComment = this.users[indexComment].comment;
                const currentCommentName = this.users[indexComment].name;
                textInputElement.value = `> ${currentComment}\n\n${currentCommentName}, `;
            })
        }
    },


    initLikeButtonListeners() {
        const buttonElements = document.querySelectorAll('.like-button');

        for (const buttonElement of buttonElements) {
            const index = buttonElement.dataset.index;
            const counter = buttonElement.dataset.like;

            buttonElement.addEventListener('click', (event) => {
                event.stopPropagation();

                if (this.state.waitingUser)
                    return

                this.userComment = this.textInputElement.value

                if (this.users[index].isLiked === false) {
                    const result = Number(counter) + 1;
                    this.users[index].likes = result;

                    this.users[index].isLiked = true;
                } else if (this.users[index].isLiked === true) {
                    const result = Number(counter) - 1;
                    this.users[index].likes = result;

                    this.users[index].isLiked = false;
                }

                this.renderApp()
            });
        }
    },

    updateValue() {
        if (DOM.nameInputElement.value !== '' && DOM.textInputElement.value !== '') {
            DOM.buttonElement.disabled = false;
        } else {
            DOM.buttonElement.disabled = true;
        }
    },

    keyEvent(e) {
        if (e.code === 'Enter') {
            DOM.buttonElement.dispatchEvent(new Event('click'));
        }
    },

    handleListeners() {
        this.buttonElement = document.getElementById('add-button');
        this.authButtonElement = document.getElementById('auth-button');
        this.nameInputElement = document.getElementById('name-input');
        this.textInputElement = document.getElementById('text-input');
        this.listElement = document.getElementById('list');

        if (this.buttonElement) {
            this.buttonElement.disabled = true;
            this.nameInputElement.addEventListener('input', this.updateValue);
            this.textInputElement.addEventListener('input', this.updateValue);

            this.updateValue();

            this.nameInputElement.addEventListener('keyup', this.keyEvent);
            this.textInputElement.addEventListener('keyup', this.keyEvent);

            this.buttonElement.addEventListener('click', () => {

                this.nameInputElement.classList.remove('error');
                this.textInputElement.classList.remove('error');
                this.buttonElement.disabled = false;

                if (this.nameInputElement.value === '' || !this.nameInputElement.value.trim()) {
                    this.nameInputElement.classList.add('error');
                    this.nameInputElement.value = '';
                    this.buttonElement.disabled = true;
                    return;

                } else if (this.textInputElement.value === '' || !this.textInputElement.value.trim()) {
                    this.textInputElement.classList.add('error');
                    this.buttonElement.disabled = true;
                    return;
                }

                this.sendComment(this.nameInputElement.value, this.textInputElement.value);
            })
        } else { // authorization form
            const loginInput = document.getElementById("login-input");
            const passwordInput = document.getElementById("password-input");

            const keyEvent = () => {
                const isLoginEmpty = loginInput.value.trim() === ""
                const isPasswordEmpty = passwordInput.value.trim() === ""

                if (isLoginEmpty || isPasswordEmpty) {
                    this.authButtonElement.disabled = true

                    if (isLoginEmpty)
                        loginInput.classList.add('error');
                    if (isPasswordEmpty)
                        passwordInput.classList.add('error');
                }
                else {
                    this.authButtonElement.disabled = false
                    loginInput.classList.remove('error');
                    passwordInput.classList.remove('error');
                }
            }

            loginInput.addEventListener('keyup', keyEvent);
            passwordInput.addEventListener('keyup', keyEvent);

            this.authButtonElement.addEventListener('click', () => {
                loginInput.classList.remove('error');
                passwordInput.classList.remove('error');
                this.authButtonElement.disabled = false;
                
                if (loginInput.value.trim() === "") {
                    loginInput.classList.add('error');
                    loginInput.value = '';
                    this.authButtonElement.disabled = true;
                    return;

                } else if (passwordInput.value.trim() === "") {
                    passwordInput.classList.add('error');
                    this.authButtonElement.disabled = true;
                    return;
                }

                API.signIn(loginInput.value, passwordInput.value)
                    .then(() => {
                        if (!API.token)
                            return;

                        this.state.waitingUser = false;
                        this.state.loginUser   = false;

                        this.renderApp()
                    })
            })
        }
    },

    start() {
        this.getComments()
        console.log("It works!");
    },
}
