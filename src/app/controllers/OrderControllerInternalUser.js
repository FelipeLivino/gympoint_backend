import * as Yup from 'yup';
import Order from '../models/Order';
import Student from '../models/Student';

class OrderControllerInternalUser {
    async update(req, res) {
        const schema = Yup.object().shape({
            answer: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { id } = req.params;
        const { answer } = req.body;
        const order = await Order.findByPk(id);
        const orderBodyToInsert = {
            answer,
            answer_at = new Date();
        };

        order = await order.update(orderBodyToInsert);
        // gympoint.com/help-orders/1/answer
        return res.json(order);
    }

    async index(req, res) {
        const orderList = await Order.findAll({
            where: {
                answer: null,
            },
            attributes: ['id', 'question'],
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: [
                        'id',
                        'name',
                        'email',
                        'idade',
                        'peso',
                        'altura',
                    ],
                },
            ],
        });
        return res.json(orderList);
    }
}

export default new OrderControllerInternalUser();
