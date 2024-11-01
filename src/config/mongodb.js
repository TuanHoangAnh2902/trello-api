/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { env } from '~/config/environment';

import { MongoClient, ServerApiVersion } from 'mongodb';

let trelloDatabaseInstance = null;

//khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
	//lưu ý: server API có từ ver 5.0.0 trở lên, có thể không cần dùng nó, nếu dùng nó là chúng ta sẽ chỉ định một stable API Version của MongoDB
	// đọc thêm: https://www.mongodb.com/docs/manual/reference/stable-api/
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

//kết nối đến Database
export const CONNECT_DB = async () => {
	//Gọi kêt nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
	await mongoClientInstance.connect();

	//sau khi kêt nối thành công thì lấy ra database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance đã khai báo ở trên
	trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

//đóng kết nối tới database
export const CLOSE_DB = async () => {
	await mongoClientInstance.close();
};

//function GET_DB (không async) có nhiệm vụ export ra trellDatabaseInstance đã kết nối tới MongoDB để sử dụng ở nhiều nơi khác nhau trong code
export const GET_DB = () => {
	if (!trelloDatabaseInstance)
		throw new Error('must connect to database first');
	return trelloDatabaseInstance;
};
