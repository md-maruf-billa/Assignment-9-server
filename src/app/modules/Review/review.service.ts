import { Prisma, Review } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import status from 'http-status';
import { IOptions, paginationHelper } from '../../utils/peginationHelper';
import { reviewSearchTerm } from './review.constant';

const getReview = async (
  filters: any,
  options: IOptions
) => {

  const { searchTerm, ...filterData } = filters;
  const {
    limit,
    page,
    skip,
    sortBy,
    sortOrder
  } = paginationHelper.calculatePagination(options);

  const andConditions: Prisma.ReviewWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          category: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    });
  }


  // if (Object.keys(filterData).length > 0) {
  //     andConditions.push({
  //         AND: Object.keys(filterData).map(key => ({
  //             [key]: {
  //                 contains: (filterData as any)[key],
  //                 mode: 'insensitive',
  //             },
  //         })),
  //     });
  // }

  // Filter Logic
  if (filterData.title) {
    andConditions.push({
      title: {
        contains: filterData.title,
        mode: 'insensitive',
      },
    });
  }

  if (filterData.rating) {
    andConditions.push({
      rating: {
        equals: Number(filterData.rating),
      },
    });
  }

  if (filterData.createdAt) {
    const date = new Date(filterData.createdAt);

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    andConditions.push({
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    });
  }



  andConditions.push({
    isDeleted: false
  });

  const whereConditions: Prisma.ReviewWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};


  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    include: {
      category: {
        select: {
          name: true
        }
      }
    }
  });

  const total = await prisma.review.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      skip,
      total
    },
    result
  };
};



const getSingleReview = async (id: string) => {
  const isExistReview = await prisma.review.findUnique({
    where: { id, isDeleted: false },
  });
  if (!isExistReview) {
    throw new AppError('Review not found !!', status.NOT_FOUND);
  }
  return isExistReview;
};

const getReviewByUserId = async (id: string) => {
  const result = await prisma.review.findMany({
    where: { accountId: id, isDeleted: false },
  });
  if (!result) {
    throw new AppError('Review not found !!', status.NOT_FOUND);
  }
  return result;
};

const createReview = async (reviewData: Review, userId: string) => {
  const isProfileUpdate = await prisma.account.findUnique({
    where: { id: userId },
  });
  if (!isProfileUpdate) {
    throw new AppError('User not found !!', status.NOT_FOUND);
  }
  if (isProfileUpdate.isCompleteProfile === false) {
    throw new AppError(
      'Please complete your profile first',
      status.BAD_REQUEST,
    );
  }
  const result = await prisma.review.create({
    data: reviewData,
  });
  return result;
};

const updateReview = async (
  updatedData: Partial<Review>,
  reviewId: string,
  userId: string,
) => {
  const existing = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId, isDeleted: false },
  });
  if (!existing || existing.accountId !== userId) {
    throw new AppError('Unauthorized or review not found', status.UNAUTHORIZED);
  }
  const result = await prisma.review.update({
    where: { id: reviewId },
    data: updatedData,
  });
  return result;
};
const deleteReview = async (reviewId: string, userId: string) => {
  const existing = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId, isDeleted: false },
  });

  if (existing?.accountId !== userId) {
    throw new AppError(
      'Unauthorized to delete this review',
      status.UNAUTHORIZED,
    );
  }

  const result = await prisma.review.update({
    where: { id: reviewId },
    data: { isDeleted: true },
  });

  return result;
};

export const reviewService = {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getSingleReview,
  getReviewByUserId,
};
