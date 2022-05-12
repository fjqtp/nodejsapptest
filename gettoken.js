const { API } = require("yoomoney-sdk");

const api = new API(process.env.YOOMONEY_TOKEN);

api.accountInfo().then((info) => console.log(info));