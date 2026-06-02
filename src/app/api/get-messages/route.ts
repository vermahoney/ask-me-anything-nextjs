import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User.model';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: 'Not authenticated',
      },
      {
        status: 401,
      }
    );
  }

  try {
    const userId = new mongoose.Types.ObjectId(_user._id);

    const user = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: {
          path: '$messages',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          'messages.createdAt': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          messages: {
            $push: '$messages',
          },
        },
      },
    ]);

    // User doesn't exist
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        {
          status: 404,
        }
      );
    }

    // Handle empty messages array
    const messages =
      user[0].messages?.filter(
        (message: any) => message !== null && message !== undefined
      ) || [];

    return Response.json(
      {
        success: true,
        messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);

    return Response.json(
      {
        success: false,
        message: 'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}