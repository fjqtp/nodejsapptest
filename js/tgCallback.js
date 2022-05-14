let query_id = window.Telegram.WebApp.initDataUnsafe.query_id;
makeCallback = function () {
    $.ajax('/save', {
            data: JSON.stringify({
                "query_id": query_id,
                "text": 'dadadadad'
            }),
            contentType: 'application/json',
            type: 'POST'
        }
    );
}