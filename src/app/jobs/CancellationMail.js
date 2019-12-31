import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'CancellationMail';
    }

    async handle({ data }) {
        const { enrollment, student, plan } = data;

        console.log('Fila executando');
        console.log('enrollment', enrollment);

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancellation',
            context: {
                name: student.name,
                age: student.idade,
                heigth: student.altura,
                Weight: student.peso,
                selectedPlan: plan.title,
                price: enrollment.price,
                enddate: format(
                    parseISO(enrollment.end_date),
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    { locale: pt }
                ),
                startDate: format(
                    parseISO(enrollment.start_date),
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    { locale: pt }
                ),
            },
        });
        console.log('Após mail');
    }
}

export default new CancellationMail();
