import { Role } from "@prisma/enums";
// import { CheckAuth } from "app/middlewares/checkAuth";
// import { validationRequest } from "app/middlewares/validationRequest";
import { Router } from "express";
import reviewController from "./review.controller";
import { createReviewValidation, updateReviewValidation } from "./review.validation";
import { CheckAuth } from "src/app/middlewares/checkAuth";
import { validationRequest } from "src/app/middlewares/validationRequest";

const router = Router();

router.get(
    '/my-reviews',
    CheckAuth(Role.USER, Role.ADMIN),
    reviewController.getMyReviews);


router.get('/user/:userId', reviewController.getUserReviews);


router.post(
    '/',
    CheckAuth(Role.USER, Role.ADMIN),
    validationRequest(createReviewValidation),
    reviewController.createReview
);

router.patch(
    '/:id',
    CheckAuth(Role.USER, Role.ADMIN),
    validationRequest(updateReviewValidation),
    reviewController.updateReview
);

router.delete(
    '/:id',
    CheckAuth(Role.USER, Role.ADMIN),
    reviewController.deleteReview
);

export const reviewRoutes = router;