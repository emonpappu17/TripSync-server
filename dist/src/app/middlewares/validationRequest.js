export const validationRequest = (zodSchema) => async (req, res, next) => {
    try {
        // console.log('req.body.data==>', req?.body?.data);
        if (req?.body?.data) {
            const parsed = JSON.parse(req.body.data);
            req.body = await zodSchema.parseAsync(parsed);
            next();
        }
        else {
            req.body = await zodSchema.parseAsync(req.body);
            next();
        }
    }
    catch (err) {
        next(err);
    }
};
