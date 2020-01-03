import * as Yup from 'yup';
import Order from '../models/Order';

class OrderControllerStudent {
    async store(req, res) {
        const schema = Yup.object().shape({
            question: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;
        const { question } = req.body;
        const orderBodyToInsert = {
            student_id: id,
            question,
        };

        const order = await Order.create(orderBodyToInsert);

        return res.json(order);
    }

    async index(req, res) {
        const { id } = req.params;

        const orderList = await Order.findAll({
            where: {
                student_id: id,
            },
            attributes: ['id', 'student_id', 'question', 'answer', 'answer_at'],
        });
        return res.json(orderList);
    }
}

export default new OrderControllerStudent();
