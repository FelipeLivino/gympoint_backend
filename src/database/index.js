import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import Users from '../app/models/User';
import Students from '../app/models/Student';
import Plans from '../app/models/Plan';
import Enrollments from '../app/models/Enrollment';
import Checkins from '../app/models/Checkin';

import databaseConfig from '../config/database';

const models = [Users, Students, Plans, Enrollments, Checkins];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models
            .map(model => model.init(this.connection))
            .map(model => {
                if (model.associate) {
                    model.associate(this.connection.models);
                }
            });
    }

    mongo() {
        this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
        });
    }
}

export default new Database();
