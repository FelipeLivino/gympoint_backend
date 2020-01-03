import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'AnswerMail';
    }

    async handle({ data }) {
        const { order, student } = data;

        console.log('Fila executando');
        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Resposta ao seu pedido',
            template: 'answer',
            context: {
                question: order.question,
                answer: order.answer,
            },
        });
        console.log('Após mail');
    }
}

export default new CancellationMail();
