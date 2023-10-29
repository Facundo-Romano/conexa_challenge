import { DataSource, DataSourceOptions } from "typeorm";
import entities from "./entities";

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: entities,
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;