import * as Yup from 'yup';
import Order from '../models/Order';
import Student from '../models/Student';
import User from '../models/User';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class OrderControllerInternalUser {
    async update(req, res) {
        const schema = Yup.object().shape({
            answer: Yup.string().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(400).json({
                error: 'You do not have the required permissions assigned',
            });
        }

        const { id } = req.params;
        const { answer } = req.body;
        const order = await Order.findByPk(id);
        if (!order || order.answer) {
            return res.status(400).json({ error: 'Invalid order' });
        }

        const student = await Student.findByPk(order.student_id);

        const orderBodyToInsert = {
            answer,
            answer_at: new Date(),
        };

        await order.update(orderBodyToInsert);

        Queue.add(AnswerMail.key, {
            order,
            student,
        });

        return res.json(order);
    }

    async index(req, res) {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(400).json({
                error: 'You do not have the required permissions assigned',
            });
        }

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
