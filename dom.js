import { API } from "./api.js";
import { getDate } from "./util.js";

export const DOM = {
    buttonElement: document.getElementById('add-button'),
    nameInputElement: document.getElementById('name-input'),
    textInputElement: document.getElementById('text-input'),
    listElement: document.getElementById('list'),

    users: [],


    getComments() {
        API.getCommentsFromServer()
            .then((responseData) => {
                this.users = responseData.comments.map((comment) => {
                    const dateFromServer = new Date(comment.date);
                    console.log(dateFromServer);

                    return {
                        name: comment.author.name,
                        date: getDate(dateFromServer),
                        comment: comment.text,
                        likes: comment.likes,
                        isLiked: comment.isLiked,
                    }
                });

                this.renderUsers();
                document.getElementById('loading-status').classList.add("hidden");
            })
            .finally(() => {
                const element = document.getElementById('loading-new')

                if (element.classList.contains('hidden'))
                    return

                document.getElementById('addComment-status').classList.add("hidden");
                document.querySelector('.add-form').classList.remove('hidden');
                element.classList.add('hidden');
                this.updateValue();
            })
            .catch(error => {
                console.error("Ошибка загрузки комментариев:", error);
                alert('Ошибка загрузки комментариев');
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


    renderUsers() {
        const usersHtml = this.users
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
            .join('');

        this.listElement.innerHTML = usersHtml;

        this.initLikeButtonListeners();
        this.initAnswerComment();
    },

    initAnswerComment() {
        const commentsElements = document.querySelectorAll('.comment');
        const textInputElement = document.getElementById('text-input');
        for (const comment of commentsElements) {
            comment.addEventListener('click', () => {
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

                if (this.users[index].isLiked === false) {

                    const result = Number(counter) + 1;
                    this.users[index].likes = result;

                    this.users[index].isLiked = true;
                } else if (this.users[index].isLiked === true) {

                    const result = Number(counter) - 1;
                    this.users[index].likes = result;

                    this.users[index].isLiked = false;
                }

                this.renderUsers();
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

        document.getElementById('loading-new').classList.add('hidden');
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
    },

    start() {
        this.getComments()
        this.handleListeners()
        console.log("It works!");
    },
}
