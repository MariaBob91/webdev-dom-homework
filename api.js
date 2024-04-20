export const API = {
    url: "https://wedev-api.sky.pro/api/v1/maria_bobrova/comments",
    status: 0,

    getCommentsFromServer() {
        return fetch(this.url, {
            method: "GET"
        })
            .then((response) => {
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
