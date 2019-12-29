import Sequelize from 'sequelize';

import Users from '../app/models/User';
import Students from '../app/models/Student';
import Plans from '../app/models/Plan';

import databaseConfig from '../config/database';

const models = [Users, Students, Plans];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection));
    }
}

export default new Database();
