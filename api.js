export let token = "";
export let userName = "";

export const API = {
    userName: "",
    token: "",
    url: "https://wedev-api.sky.pro/api/v1/maria_bobrova/comments",
    status: 0,

    signIn(login, password) {
        return fetch("https://wedev-api.sky.pro/api/user/login", {
            method: "POST",
            body: JSON.stringify({
                login: login
                    .replaceAll("&", "&amp;")
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll('"', "&quot;"),
                password: password,
            }),
            header: { 'Content-Type': 'application/json' },
        })
            .then((response) => {
                this.status = response.status

                return response.json()
            })
            .then((responseData) => {
                if (this.status !== 201) {
                    throw new Error(responseData.error)
                }

                this.userName = responseData.user.name
                this.token    = responseData.user.token

                return responseData;
            })
    },

    getCommentsFromServer() {
        return fetch(this.url, {
            method: "GET"
        })
            .then((response) => {
                if (response.status === 500) {
                    throw newError("Сервер упал")
                };
                if (response.status === 401) {
                    throw newError("Нет авторизации")
                };
                return response.json();
            })
    },

    sendCommentToServer(name, text) {
        return fetch(this.url, {
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
                // forceError: true,
            }),
            header: { 'Content-Type': 'application/json' },
        })
            .then((response) => {
                this.status = response.status

                return response.json();
            })
            .then((responseData) => {
                if (this.status !== 201) {
                    throw new Error(responseData.error)
                }

                return responseData;
            })
    },
}
