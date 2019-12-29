import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

class PlanController {
    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required(),
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

        const { id, title, duration, price } = await Plan.create(req.body);
        return res.json({
            id,
            title,
            duration,
            price,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required(),
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

        const plan = await Plan.findOne({
            where: {
                id: req.params.id,
                canceled_at: null,
            },
        });
        if (!plan) {
            return res.status(400).json({
                error: 'Select a valid Plan',
            });
        }

        const { id, title, duration, price } = await plan.update(req.body);

        return res.json({
            id,
            title,
            duration,
            price,
        });
    }

    async delete(req, res) {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(400).json({
                error: 'You do not have the required permissions assigned',
            });
        }

        const plan = await Plan.findByPk(req.params.id, {
            attributes: ['id', 'title', 'duration', 'price'],
        });
        if (!plan) {
            return res.status(400).json({
                error: 'Select a valid Plan',
            });
        }
        plan.canceled_at = new Date();

        await plan.save(plan);

        return res.json(plan);
    }

    async index(req, res) {
        const { page = 1 } = req.query;

        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(400).json({
                error: 'You do not have the required permissions assigned',
            });
        }

        const plansList = await Plan.findAll({
            where: {
                canceled_at: null,
            },
            attributes: ['id', 'title', 'duration', 'price'],
            limit: 20,
            offset: (page - 1) * 20,
            order: ['price'],
        });
        return res.json(plansList);
    }
}

export default new PlanController();
