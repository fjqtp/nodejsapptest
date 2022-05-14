// --> https://core.telegram.org/bots/payments <--

const {Telegram, Keyboard, MessageContext} = require('puregram');

const {HearManager} = require('@puregram/hear');

require('dotenv').config();

const axios = require('axios')
const telegram = Telegram.fromToken(process.env.TELEGRAM_BOT_TOKEN);
const hearManager = new HearManager();

telegram.updates.on('message', hearManager.middleware);

hearManager.hear(/^\/pay/i,
    /** @param context {MessageContext} */
    async (context) => {
    // Sending an invoice to user
    let words = context.text.split(" ");
    let requestId = words[1] ?? 'netu';

    return context.sendInvoice({
        title: 'Оплатить заявку ' + requestId,
        description: 'Ну типа',
        //currency: 'RUB', // https://core.telegram.org/bots/payments#supported-currencies
        currency: 'UZS', // https://core.telegram.org/bots/payments#supported-currencies
        payload: {
            requestId: requestId,
            product: 'Заявка'
        },
        prices: [
            {
                label: 'Несколько команд',
                amount: 5000000 // 50,00$
            }
        ],

        provider_token: process.env.CLICK_TEST_TOKEN,

        start_parameter: 'test',

        //is_flexible: true,
        need_name: true
    });
});

hearManager.hear(
    {
        text: '/test',
        isPM: true
    },

    (context) => {
        const keyboard = Keyboard.keyboard([
            [
                Keyboard.webAppButton('Менюшка', 'https://calm-cliffs-51858.herokuapp.com/')
            ],

            [
                Keyboard.textButton('Two buttons'),
                Keyboard.textButton('In one row')
            ]
        ]).resize(); // keyboard will be much smaller

        return context.send('Sending you a keyboard, generated using `Keyboard`!', {
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
    }
)

telegram.updates.on('pre_checkout_query', async (context) => {
    // Triggered when user pressed "Pay" button and Telegram expecting
    // you to verify all the data and say if everything is OK

    await context.answerPreCheckoutQuery({ok: true});

    // alternative:

    // await context.answerPreCheckoutQuery({
    //   ok: false,
    //   error_message: `We have no ${context.invoicePayload.product} now!`
    // });
});

telegram.updates.on('successful_payment', async (context) => {
    // Triggered when the payment went OK and money has been sent to you
    let parsedPayload = JSON.parse(JSON.parse(context.eventPayment.invoicePayload));
    let requestId = parsedPayload.requestId; //TODO валидация хуйни
    let product = parsedPayload.product;

    context.reply(`Thank you, *${context.eventPayment.orderInfo.name}*, for purchasing *${product}*!`, {
        parse_mode: 'Markdown'
    }).then(() =>
        axios
            //.put('http://api/tournament_synch_requests/' + requestId + '/set_paid', {})
            .put('https://api.rating.chgk.net/tournament_synch_requests/' + requestId + '/set_paid', {})
            .then(res => {
                console.log(`statusCode: ${res.status}`)
                console.log(res)
            })
            .catch(error => {
                console.error(error)
            })
    );
});

telegram.api.setChatMenuButton({
    menu_button: {
        type: "web_app",
        text: "test",
        web_app: {
            url: "https://calm-cliffs-51858.herokuapp.com/"
        }
    }
});

telegram.updates.startPolling()
    .then(() => console.log('Started'))
    .catch(console.error);