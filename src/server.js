import exitHook from 'async-exit-hook';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { env } from '~/config/environment';
import { APIs_V1 } from '~/routes/v1';
import { corsOptions } from './config/cors';

const START_SERVER = () => {
	const app = express();

	// Sử dụng cookie-parser
	app.use(cookieParser());

	// Xử lý CORS
	app.use(cors(corsOptions));

	//enable req.body json data
	app.use(express.json());

	//use APIs_V1
	app.use('/v1', APIs_V1);

	//middleware xử lý tập trung
	app.use(errorHandlingMiddleware);

	// Môi trường production (hiện tại là render.com)
	if (env.BUILD_MODE === 'production') {
		app.listen(process.env.PORT, () => {
			// eslint-disable-next-line no-console
			console.log(
				`3. Production: Hi ${env.AUTHOR}, Back-End Server is running successfully at Port: ${process.env.PORT}`,
			);
		});
	} else {
		// môi trường local development
		app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
			// eslint-disable-next-line no-console
			console.log(
				`3. Local: Hi ${env.AUTHOR}, Back-End Server is running successfully at: http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`,
			);
		});
	}

	// thực hiện cleanup trước khi dừng server
	//
	exitHook(() => {
		console.log('4. Server is shutting down...');
		CLOSE_DB();
	});
};

// chỉ khi kết nối đến batabase thành công thì mới chạy server back-end
// Immediately-Invoked / Anonymous Async function (IIFE)
(async () => {
	try {
		console.log('1. Connecting to MongoDB Cloud Atlas...');
		await CONNECT_DB();
		console.log('2. Connected to MongoDB Cloud Atlas!');
		//khởi động server back-end sau khi connect database thành công
		START_SERVER();
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
		process.exit(0);
	}
})();
