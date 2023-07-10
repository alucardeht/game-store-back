import userRouter from './users';

const router = (app) => {
    app.use('/users', userRouter);
}
export default router;


