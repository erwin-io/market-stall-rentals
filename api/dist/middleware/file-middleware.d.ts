import multer from 'multer';
export default class FileMiddleware {
    static readonly memoryLoader: multer.Multer;
    static readonly diskLoader: multer.Multer;
}
