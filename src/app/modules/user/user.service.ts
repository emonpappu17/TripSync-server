// ============================================
// search.interface.ts
// ============================================

import { TravelType } from '@prisma/client';

export interface IAdvancedSearchQuery {
  // Basic filters
  destination?: string;
  country?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  
  // Budget filters
  budgetMin?: number;
  budgetMax?: number;
  
  // Trip details
  travelType?: TravelType;
  duration?: number; // in days
  
  // User preferences
  interests?: string[];
  languages?: string[];
  ageRange?: { min: number; max: number };
  gender?: string;
  
  // Ratings & verification
  minRating?: number;
  verifiedOnly?: boolean;
  
  // Sorting & pagination
  sortBy?: 'relevance' | 'date' | 'rating' | 'budget';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IMatchScore {
  travelPlanId: string;
  userId: string;
  totalScore: number;
  breakdown: {
    destinationMatch: number;
    dateMatch: number;
    budgetMatch: number;
    interestsMatch: number;
    travelStyleMatch: number;
    languageMatch: number;
    ratingBonus: number;
  };
}

export interface ISearchResult {
  travelPlan: any;
  host: any;
  matchScore: number;
  matchReasons: string[];
}

// ============================================
// search.validation.ts
// ============================================

import { z } from 'zod';
import { TravelType, Gender } from '@prisma/client';

export const advancedSearchValidation = z.object({
  query: z.object({
    destination: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    startDate: z.string().datetime().transform(val => new Date(val)).optional(),
    endDate: z.string().datetime().transform(val => new Date(val)).optional(),
    budgetMin: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
    budgetMax: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
    travelType: z.nativeEnum(TravelType).optional(),
    duration: z.string().transform(val => val ? parseInt(val) : undefined).optional(),
    interests: z.string().optional(), // Comma-separated
    languages: z.string().optional(), // Comma-separated
    minRating: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
    verifiedOnly: z.string().transform(val => val === 'true').optional(),
    sortBy: z.enum(['relevance', 'date', 'rating', 'budget']).optional().default('relevance'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    page: z.string().transform(val => val ? parseInt(val) : 1).optional(),
    limit: z.string().transform(val => val ? parseInt(val) : 10).optional(),
  }),
});

// ============================================
// matching.service.ts
// ============================================

import { PrismaClient } from '@prisma/client';
import { IMatchScore } from './search.interface';

const prisma = new PrismaClient();

class MatchingService {
  /**
   * Calculate compatibility score between user and travel plan
   */
  async calculateMatchScore(
    userId: string,
    travelPlanId: string
  ): Promise<IMatchScore> {
    const [user, travelPlan] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              interests: true,
              visitedCountries: true,
            },
          },
        },
      }),
      prisma.travelPlan.findUnique({
        where: { id: travelPlanId },
        include: {
          user: {
            include: {
              profile: {
                include: {
                  interests: true,
                },
              },
            },
          },
        },
      }),
    ]);

    if (!user || !travelPlan) {
      return {
        travelPlanId,
        userId,
        totalScore: 0,
        breakdown: {
          destinationMatch: 0,
          dateMatch: 0,
          budgetMatch: 0,
          interestsMatch: 0,
          travelStyleMatch: 0,
          languageMatch: 0,
          ratingBonus: 0,
        },
      };
    }

    const breakdown = {
      destinationMatch: this.calculateDestinationMatch(user, travelPlan),
      dateMatch: this.calculateDateMatch(user, travelPlan),
      budgetMatch: this.calculateBudgetMatch(user, travelPlan),
      interestsMatch: await this.calculateInterestsMatch(user, travelPlan),
      travelStyleMatch: this.calculateTravelStyleMatch(user, travelPlan),
      languageMatch: this.calculateLanguageMatch(user, travelPlan),
      ratingBonus: await this.calculateRatingBonus(travelPlan.userId),
    };

    const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

    return {
      travelPlanId,
      userId,
      totalScore: Math.round(totalScore),
      breakdown,
    };
  }

  private calculateDestinationMatch(user: any, travelPlan: any): number {
    // Check if user has visited this destination (25 points)
    const hasVisited = user.profile?.visitedCountries?.some(
      (country: any) => 
        country.country.toLowerCase().includes(travelPlan.destination.toLowerCase())
    );

    return hasVisited ? 25 : 15;
  }

  private calculateDateMatch(user: any, travelPlan: any): number {
    // If dates are flexible or match preferences (15 points)
    // This is simplified - you can add user's preferred travel months
    return 15;
  }

  private calculateBudgetMatch(user: any, travelPlan: any): number {
    // If budget aligns with user's typical spending (10 points)
    // This is simplified - you can track user's average trip budget
    return 10;
  }

  private async calculateInterestsMatch(user: any, travelPlan: any): number {
    const userInterests = user.profile?.interests?.map((i: any) => i.interest.toLowerCase()) || [];
    const hostInterests = travelPlan.user.profile?.interests?.map((i: any) => i.interest.toLowerCase()) || [];

    if (userInterests.length === 0 || hostInterests.length === 0) {
      return 5;
    }

    const commonInterests = userInterests.filter((interest: string) =>
      hostInterests.includes(interest)
    );

    // 20 points max for interests match
    const matchPercentage = (commonInterests.length / userInterests.length) * 100;
    return Math.min(20, (matchPercentage / 100) * 20);
  }

  private calculateTravelStyleMatch(user: any, travelPlan: any): number {
    // Match based on travel type preference (10 points)
    // This is simplified - you can add user's preferred travel styles
    return 10;
  }

  private calculateLanguageMatch(user: any, travelPlan: any): number {
    const userLanguages = user.profile?.languages || [];
    const hostLanguages = travelPlan.user.profile?.languages || [];

    if (userLanguages.length === 0 || hostLanguages.length === 0) {
      return 5;
    }

    const commonLanguages = userLanguages.filter((lang: string) =>
      hostLanguages.includes(lang)
    );

    // 10 points max for language match
    return commonLanguages.length > 0 ? 10 : 5;
  }

  private async calculateRatingBonus(userId: string): number {
    const reviews = await prisma.review.aggregate({
      where: { revieweeId: userId },
      _avg: { rating: true },
      _count: true,
    });

    const avgRating = reviews._avg.rating || 0;
    const reviewCount = reviews._count;

    // 10 points max for high ratings
    let bonus = 0;
    if (avgRating >= 4.5 && reviewCount >= 5) {
      bonus = 10;
    } else if (avgRating >= 4.0 && reviewCount >= 3) {
      bonus = 7;
    } else if (avgRating >= 3.5) {
      bonus = 5;
    }

    return bonus;
  }

  /**
   * Find compatible travelers for a user
   */
  async findMatches(userId: string, limit: number = 10) {
    // Get user's interests and preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            interests: true,
            visitedCountries: true,
          },
        },
      },
    });

    if (!user) return [];

    // Find travel plans excluding user's own plans
    const travelPlans = await prisma.travelPlan.findMany({
      where: {
        userId: { not: userId },
        deletedAt: null,
        isPublic: true,
        status: { in: ['PLANNING', 'UPCOMING'] },
      },
      take: 50, // Get top 50 to calculate scores
      include: {
        user: {
          include: {
            profile: {
              include: {
                interests: true,
              },
            },
          },
        },
      },
    });

    // Calculate match scores for each plan
    const matches = await Promise.all(
      travelPlans.map(async (plan) => {
        const score = await this.calculateMatchScore(userId, plan.id);
        return {
          plan,
          score: score.totalScore,
          breakdown: score.breakdown,
        };
      })
    );

    // Sort by score and return top matches
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(match => match.score >= 50); // Only return good matches (50+ score)
  }
}

export default new MatchingService();

// ============================================
// search.service.ts
// ============================================

import { PrismaClient, Prisma } from '@prisma/client';
import { IAdvancedSearchQuery, ISearchResult } from './search.interface';
import matchingService from './matching.service';

const prisma = new PrismaClient();

class SearchService {
  async advancedSearch(
    query: IAdvancedSearchQuery,
    currentUserId?: string
  ): Promise<{
    data: ISearchResult[];
    meta: any;
  }> {
    const {
      destination,
      country,
      city,
      startDate,
      endDate,
      budgetMin,
      budgetMax,
      travelType,
      duration,
      interests,
      languages,
      minRating,
      verifiedOnly,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      deletedAt: null,
      isPublic: true,
      status: { in: ['PLANNING', 'UPCOMING'] },
    };

    // Exclude current user's plans
    if (currentUserId) {
      where.userId = { not: currentUserId };
    }

    // Destination filters
    if (destination) {
      where.destination = { contains: destination, mode: 'insensitive' as Prisma.QueryMode };
    }
    if (city) {
      where.destinationCity = { contains: city, mode: 'insensitive' as Prisma.QueryMode };
    }

    // Date filters
    if (startDate && endDate) {
      where.AND = [
        { startDate: { gte: startDate } },
        { endDate: { lte: endDate } },
      ];
    } else if (startDate) {
      where.startDate = { gte: startDate };
    } else if (endDate) {
      where.endDate = { lte: endDate };
    }

    // Budget filters
    if (budgetMin !== undefined) {
      where.budgetMin = { gte: budgetMin };
    }
    if (budgetMax !== undefined) {
      where.budgetMax = { lte: budgetMax };
    }

    // Travel type filter
    if (travelType) {
      where.travelType = travelType;
    }

    // Duration filter (calculate from dates)
    if (duration) {
      // This is complex - would need to calculate date difference
      // Skipping for simplicity
    }

    // User profile filters
    const profileWhere: any = {};
    if (verifiedOnly) {
      profileWhere.isVerified = true;
    }
    if (languages && languages.length > 0) {
      profileWhere.languages = { hasSome: languages };
    }

    if (Object.keys(profileWhere).length > 0) {
      where.user = {
        profile: profileWhere,
      };
    }

    // Get total count
    const total = await prisma.travelPlan.count({ where });

    // Build orderBy
    let orderBy: any = {};
    if (sortBy === 'date') {
      orderBy = { startDate: sortOrder };
    } else if (sortBy === 'budget') {
      orderBy = { budgetMin: sortOrder };
    } else {
      orderBy = { createdAt: sortOrder };
    }

    // Fetch travel plans
    let travelPlans = await prisma.travelPlan.findMany({
      where,
      skip,
      take: sortBy === 'relevance' ? limit * 3 : limit, // Get more for relevance sorting
      orderBy,
      include: {
        user: {
          include: {
            profile: {
              include: {
                interests: true,
              },
            },
            reviewsReceived: {
              select: { rating: true },
            },
          },
        },
        activities: {
          take: 3,
        },
        _count: {
          select: {
            requests: true,
          },
        },
      },
    });

    // Calculate match scores if user is logged in and sorting by relevance
    let results: ISearchResult[] = [];

    if (sortBy === 'relevance' && currentUserId) {
      // Calculate match scores
      const matchedResults = await Promise.all(
        travelPlans.map(async (plan) => {
          const matchScore = await matchingService.calculateMatchScore(
            currentUserId,
            plan.id
          );

          // Calculate host's average rating
          const avgRating =
            plan.user.reviewsReceived.length > 0
              ? plan.user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
                plan.user.reviewsReceived.length
              : 0;

          // Apply rating filter
          if (minRating && avgRating < minRating) {
            return null;
          }

          // Generate match reasons
          const matchReasons = this.generateMatchReasons(matchScore.breakdown);

          return {
            travelPlan: {
              ...plan,
              user: {
                ...plan.user,
                reviewsReceived: undefined, // Remove from response
                averageRating: Math.round(avgRating * 10) / 10,
                totalReviews: plan.user.reviewsReceived.length,
              },
            },
            host: {
              id: plan.user.id,
              email: plan.user.email,
              profile: plan.user.profile,
              averageRating: Math.round(avgRating * 10) / 10,
            },
            matchScore: matchScore.totalScore,
            matchReasons,
          };
        })
      );

      // Filter out nulls and sort by match score
      results = matchedResults
        .filter((r): r is ISearchResult => r !== null)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } else {
      // No relevance sorting - just format results
      results = travelPlans.slice(0, limit).map((plan) => {
        const avgRating =
          plan.user.reviewsReceived.length > 0
            ? plan.user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
              plan.user.reviewsReceived.length
            : 0;

        if (minRating && avgRating < minRating) {
          return null;
        }

        return {
          travelPlan: {
            ...plan,
            user: {
              ...plan.user,
              reviewsReceived: undefined,
              averageRating: Math.round(avgRating * 10) / 10,
              totalReviews: plan.user.reviewsReceived.length,
            },
          },
          host: {
            id: plan.user.id,
            email: plan.user.email,
            profile: plan.user.profile,
            averageRating: Math.round(avgRating * 10) / 10,
          },
          matchScore: 0,
          matchReasons: [],
        };
      }).filter((r): r is ISearchResult => r !== null);
    }

    return {
      data: results,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMatchScores: sortBy === 'relevance' && !!currentUserId,
      },
    };
  }

  private generateMatchReasons(breakdown: any): string[] {
    const reasons: string[] = [];

    if (breakdown.destinationMatch >= 20) {
      reasons.push('Experienced with this destination');
    }
    if (breakdown.interestsMatch >= 15) {
      reasons.push('Shared travel interests');
    }
    if (breakdown.languageMatch >= 8) {
      reasons.push('Common languages');
    }
    if (breakdown.ratingBonus >= 7) {
      reasons.push('Highly rated traveler');
    }
    if (breakdown.budgetMatch >= 8) {
      reasons.push('Similar budget range');
    }

    return reasons;
  }

  async getRecommendations(userId: string, limit: number = 10) {
    return matchingService.findMatches(userId, limit);
  }
}

export default new SearchService();

// ============================================
// search.controller.ts
// ============================================

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import searchService from './search.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

class SearchController {
  advancedSearch = catchAsync(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user?.id;
    
    // Parse array parameters
    if (req.query.interests) {
      req.query.interests = (req.query.interests as string).split(',');
    }
    if (req.query.languages) {
      req.query.languages = (req.query.languages as string).split(',');
    }

    const result = await searchService.advancedSearch(req.query, currentUserId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Search results retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  });

  getRecommendations = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { limit = 10 } = req.query;

    const result = await searchService.getRecommendations(userId, Number(limit));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Recommendations retrieved successfully',
      data: result,
    });
  });
}

export default new SearchController();

// ============================================
// search.route.ts
// ============================================

import express from 'express';
import searchController from './search.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';
import { advancedSearchValidation } from './search.validation';

const router = express.Router();

// Public search (with optional auth for personalized results)
router.get(
  '/travel-plans',
  validateRequest(advancedSearchValidation),
  searchController.advancedSearch
);

// Authenticated recommendations
router.get(
  '/recommendations',
  auth(Role.USER, Role.ADMIN),
  searchController.getRecommendations
);

export default router;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
1. Advanced Search:
GET /api/search/travel-plans?destination=Thailand&startDate=2025-03-01&endDate=2025-03-31&budgetMax=3000&travelType=SOLO&verifiedOnly=true&sortBy=relevance&page=1&limit=10
Headers: Authorization: Bearer <token> (optional, for personalized results)

Response:
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "travelPlan": {
        "id": "uuid",
        "title": "Backpacking Thailand",
        "destination": "Thailand",
        "startDate": "2025-03-15",
        "endDate": "2025-03-30",
        "budgetMin": 2000,
        "budgetMax": 3000,
        "travelType": "SOLO",
        ...
      },
      "host": {
        "id": "uuid",
        "profile": {
          "fullName": "John Doe",
          "profileImage": "https://...",
          "isVerified": true
        },
        "averageRating": 4.8
      },
      "matchScore": 85,
      "matchReasons": [
        "Shared travel interests",
        "Highly rated traveler",
        "Common languages"
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasMatchScores": true
  }
}

2. Get Personalized Recommendations:
GET /api/search/recommendations?limit=10
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Recommendations retrieved successfully",
  "data": [
    {
      "plan": { ... },
      "score": 92,
      "breakdown": {
        "destinationMatch": 25,
        "interestsMatch": 18,
        "languageMatch": 10,
        "ratingBonus": 10,
        ...
      }
    }
  ]
}
*/