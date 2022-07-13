import cors from 'cors';
import express, { Request, Response } from 'express';
import { glob } from 'glob';
import helmet from 'helmet';
import http from 'http';
import ip from 'ip';
import morgan from 'morgan';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import SwaggerDoc from './core/swagger-doc';
import { createDbIfNotExist, initSequelize } from './database/client';
import { errorHandler } from './middlewares/error-handler';
import { requestLogger } from './middlewares/logger';
import { notFound } from './middlewares/not-found';
import { Constants } from './utils/constants';
import UtilsENVConfig from './utils/utils-env-config';
import Log from './utils/utils-log';

export default class App {
  private app: express.Application;
  private port: number;
  private appName: string;
  private server: http.Server;
  private IP: string;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.IP = ip.address();
    this.port = UtilsENVConfig.getProcessEnv().PORT;
    this.appName = Constants.SERVICE_NAME;
  }

  static async create(): Promise<App> {
    const app = new App();

    await app.initRuntimeData();
    // await app.initDb();
    app.initMiddlewares();
    app.initControllers();
    app.initErrorHandling();

    return app;
  }

  //Инициализация Runtime данных
  private async initRuntimeData() {}

  private async initDb() {
    await createDbIfNotExist();
    await initSequelize();
  }

  private initMiddlewares() {
    this.app.use(express.json());
    // this.app.use(fileUpload());
    // this.app.use(multipartParser);

    this.app.use(morgan('dev'));

    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    this.app.use(cors());
  }

  private initControllers() {
    let ctrlArr: any[] = [];

    glob
      .sync(`${__dirname}/modules/controllers/**/*.controller.*`)
      .forEach((fileName) => ctrlArr.push(require(fileName).default as any));

    this.app.use(Constants.SWAGGER_DOC_MASK, swaggerUi.serve, swaggerUi.setup(SwaggerDoc.get()));

    this.app.use(requestLogger);

    this.app.all('/test', (req: Request, res: Response) => {
      res.status(200).json({
        message: `Service: ${this.appName} | working on port: ${this.port}`,
      });
    });

    ctrlArr.forEach((el) => this.app.use(el.path, el.router));
  }

  private initErrorHandling() {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  public async listen() {
    this.server.listen(this.port, () => {
      Log.info(`${this.appName} ready on address: http://${this.IP}:${this.port}`);
    });
  }

  public async cleanUp() {}
}
