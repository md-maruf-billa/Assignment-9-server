import { Prisma, Review, ReviewStatus } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import status from 'http-status';
import { IOptions, paginationHelper } from '../../utils/peginationHelper';
import { reviewSearchTerm } from './review.constant';

const getReview = async (filters: any, options: IOptions) => {
  const { searchTerm, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

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
    isDeleted: false,
  });

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      product: true,
    },
  });

  const total = await prisma.review.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      skip,
      total,
    },
    result,
  };
};

const getSingleReview = async (id: string) => {
  const isExistReview = await prisma.review.findUnique({
    where: { id, isDeleted: false },
    include: {
      category: true,
      product: true,
    },
  });
  if (!isExistReview) {
    throw new AppError('Review not found !!', status.NOT_FOUND);
  }
  return isExistReview;
};

const getReviewByUserId = async (email: string) => {
  const result = await prisma.review.findMany({
    where: { reviewerEmail: email, isDeleted: false },
    include: {
      product: true,
      category: true,
    },
  });
  if (!result) {
    throw new AppError('Review not found !!', status.NOT_FOUND);
  }
  return result;
};

const createReview = async (reviewData: Review, email: string) => {
  const isProfileUpdate = await prisma.account.findUnique({
    where: { email },
    include: {
      user: true,
      admin: true,
    },
  });

  // return isProfileUpdate;
  if (!isProfileUpdate) {
    throw new AppError('Account not found !!', status.NOT_FOUND);
  }
  // if (isProfileUpdate.isCompleteProfile === false) {
  //   throw new AppError(
  //     'Please complete your profile first',
  //     status.BAD_REQUEST,
  //   );
  // }
  const userData = {
    reviewerName: isProfileUpdate?.user?.name || isProfileUpdate?.admin?.name,
    reviewerEmail: isProfileUpdate?.email,
    reviewerProfilePhoto:
      isProfileUpdate?.admin?.profileImage ||
      isProfileUpdate?.user?.profileImage,
  };
  const data = {
    ...reviewData,
    ...userData,
  };
  const result = await prisma.review.create({
    data: { ...data, status: ReviewStatus.PENDING },
  });
  return result;
};

const updateReview = async (
  updatedData: Partial<Review>,
  reviewId: string,
  email: string,
) => {
  const existing = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId, isDeleted: false },
  });
  if (!existing || existing.reviewerEmail !== email) {
    throw new AppError('Unauthorized or review not found', status.UNAUTHORIZED);
  }
  const result = await prisma.review.update({
    where: { id: reviewId },
    data: updatedData,
  });
  return result;
};
const deleteReview = async (reviewId: string, email: string) => {
  const existing = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId, isDeleted: false },
  });

  if (existing?.reviewerEmail !== email) {
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

const getAllPremiumReview = async () => {
  const result = await prisma.review.findMany({
    where: { isDeleted: false, isPremium: true },
    include: {
      category: true,
      product: true,
    },
  });
  if (!result) {
    throw new AppError('No premium reviews found', status.NOT_FOUND);
  }
  return result;
};

const manage_votes_into_db = async (
  reviewId: string,
  type: string,
  email: string,
) => {
  if (!email) {
    throw new AppError('You are not authorized !!', status.BAD_REQUEST);
  }

  const isReviewExist = await prisma.review.findUnique({
    where: { id: reviewId, isDeleted: false },
  });
  if (!isReviewExist) {
    throw new AppError('Review not found !!', status.NOT_FOUND);
  }

  // Check if the email has already voted for this review
  const existingVote = await prisma.reviewEmailVote.findUnique({
    where: {
      reviewId_email: {
        reviewId: reviewId,
        email: email,
      },
    },
  });

  if (existingVote) {
    throw new AppError(
      'You have already voted for this review....',
      status.BAD_REQUEST,
    );
  }

  // Create a record that this email has voted for this review
  await prisma.reviewEmailVote.create({
    data: {
      reviewId: reviewId,
      email: email,
    },
  });

  if (type == 'up') {
    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        upVotes: isReviewExist.upVotes + 1,
      },
    });
  } else if (type == 'down') {
    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        downVotes: isReviewExist.downVotes + 1,
      },
    });
  }
  return;
};

const approveReview = async (
  reviewId: string,
  statuss: 'PENDING' | 'APPROVED' | 'REJECTED',
) => {
  console.log(reviewId, statuss);
  const review = await prisma.review.findUnique({
    where: { id: reviewId, isDeleted: false },
  });

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  const updateData: Prisma.ReviewUpdateInput = {
    status: statuss,
  };

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: updateData,
    include: {
      category: true,
      product: true,
    },
  });

  return updatedReview;
};

export const reviewService = {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getSingleReview,
  getReviewByUserId,
  getAllPremiumReview,
  manage_votes_into_db,
  approveReview,
};
