<!DOCTYPE html>
<html lang="ru">

<head>
  <title>Проект "Комменты"</title>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div class="container">
    <div class="loading" id="loading-status">Комментарии загружаются...</div>
    <ul class="comments" id="list">
      <!-- Список рендерится из JS -->
    </ul>
    <p class="loading" id="loading-new">Комментарий добавляется...</p>
    <div class="add-form">
      <input id="name-input" type="text" value="" class="add-form-name" placeholder="Введите ваше имя" />
      <textarea id="text-input" class="add-form-text" placeholder="Введите ваш комментарий"
        rows="4"></textarea>
      <div class="add-form-row">
        <button id="add-button" class="add-form-button">Написать</button>
      </div>
    </div>
    <div class="addComment" id="addComment-status">

    </div>
  </div>
</body>

<script>
  "use strict";

  const buttonElement = document.getElementById('add-button');
  const nameInputElement = document.getElementById('name-input');
  const textInputElement = document.getElementById('text-input');
  const listElement = document.getElementById('list');

  function getDate(date) {
    const options = {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    };
    const optionsTime = {
      hour: 'numeric',
      minute: 'numeric',
    };

    return `${date.toLocaleDateString('ru-RU', options)} ${date.toLocaleTimeString('ru-RU', optionsTime)}`;
  }


  function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/maria_bobrova/comments", {
      method: "GET"
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        users = responseData.comments.map((comment) => {
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

        renderUsers();
        document.getElementById('loading-status').classList.add("hidden");
      })
      .finally(() => {
        const element = document.getElementById('loading-new')

        if (element.classList.contains('hidden'))
          return

        document.getElementById('addComment-status').classList.add("hidden");
        document.querySelector('.add-form').classList.remove('hidden');
        element.classList.add('hidden');
        updateValue();
      })
      .catch(error => {
        console.error("Ошибка загрузки комментариев:", error);
        alert('Ошибка загрузки комментариев');
      })
  }

  function sendComment(name, text) {
    let status = 0
    
    const formElement = document.querySelector('.add-form')
    const loader = document.getElementById('loading-new')
    formElement.classList.add('hidden')
    loader.classList.remove('hidden')

    document.getElementById('addComment-status');

    fetch("https://wedev-api.sky.pro/api/v1/maria_bobrova/comments", {
      method: "POST",
      body: JSON.stringify({
        name: name
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;"),
        text: text
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("\n", "<br>"),
        forceError: true,
      }),
      header: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        status = response.status

        return response.json()
      })
      .then((responseData) => {
        if (status !== 201) {
          throw new Error(responseData.error)
        }  

        getComments();
        nameInputElement.value = '';
        textInputElement.value = '';

        buttonElement.disabled = false;

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
  }

  getComments()

  let users = [];

  const renderUsers = () => {
    const usersHtml = users
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

    listElement.innerHTML = usersHtml;

    initLikeButtonListeners();
    initAnswerComment();
  };

  const initAnswerComment = () => {
    const commentsElements = document.querySelectorAll('.comment');
    const textInputElement = document.getElementById('text-input');
    for (const comment of commentsElements) {
      comment.addEventListener('click', () => {
        const indexComment = comment.dataset.index;
        const currentComment = users[indexComment].comment;
        const currentCommentName = users[indexComment].name;
        textInputElement.value = `> ${currentComment}\n\n${currentCommentName}, `;
      }) 
    }
  }


  const initLikeButtonListeners = () => {
    const buttonElements = document.querySelectorAll('.like-button');

    for (const buttonElement of buttonElements) {

      const index = buttonElement.dataset.index;
      const counter = buttonElement.dataset.like;

      buttonElement.addEventListener('click', (event) => {
        event.stopPropagation();

        if (users[index].isLiked === false) {

          const result = Number(counter) + 1;
          users[index].likes = result;

          users[index].isLiked = true;
        } else if (users[index].isLiked === true) {

          const result = Number(counter) - 1;
          users[index].likes = result;

          users[index].isLiked = false;
        }

        renderUsers();
      });
    }
  };

  document.getElementById('loading-new').classList.add('hidden');
  buttonElement.disabled = true;
  nameInputElement.addEventListener('input', updateValue);
  textInputElement.addEventListener('input', updateValue);

  function updateValue() {
    if (nameInputElement.value !== '' && textInputElement.value !== '') {
      buttonElement.disabled = false;
    } else {
      buttonElement.disabled = true;
    }
  }

  updateValue();

  nameInputElement.addEventListener('keyup', keyEvent);
  textInputElement.addEventListener('keyup', keyEvent);

  function keyEvent(e) {
    if (e.code === 'Enter') {
      buttonElement.dispatchEvent(new Event('click'));
    }
  }

  buttonElement.addEventListener('click', () => {

    nameInputElement.classList.remove('error');
    textInputElement.classList.remove('error');
    buttonElement.classList.remove('add-form-button-inactive');

    if (nameInputElement.value === '' || !nameInputElement.value.trim()) {
      nameInputElement.classList.add('error');
      nameInputElement.value = '';
      buttonElement.classList.add('add-form-button-inactive');
      return;

    } else if (textInputElement.value === '' || !textInputElement.value.trim()) {
      textInputElement.classList.add('error');
      buttonElement.classList.add('add-form-button-inactive');
      return;
    }

    sendComment(nameInputElement.value, textInputElement.value);
  });

  console.log("It works!");
</script>

</html>