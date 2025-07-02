import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
  user: object;
  question: string;
  questionReplies: IComment[];
}

interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  // videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string;
  level: string;
  deomUrl: string;
  benifits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

const commentSchema = new Schema<IComment>(
  {
    user: Object,
    question: String,
    questionReplies: [Object]
  },
  { timestamps: true }
);

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Object,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    comment: {
      type: String,
      required: true,
    },
    commentReplies: [commentSchema],
  },
  { timestamps: true }
);

const linkSchema = new Schema<ILink>({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const courseDataSchema = new Schema<ICourseData>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    // videoThumbnail: {
    //   type: Object,
    //   required: true,
    // },
    videoSection: {
      type: String,
      required: true,
    },
    videoLength: {
      type: Number,
      required: true,
    },
    videoPlayer: {
      type: String,
      required: true,
    },
    links: [linkSchema],
    suggestion: {
      type: String,
      default: "",
    },
    questions: [commentSchema],
  },
  { timestamps: true }
);

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    deomUrl: {
      type: String,
      required: true,
    },
    benifits: [
      {
        title: {
          type: String,
          required: true,
        },
      },
    ],
    prerequisites: [
      {
        title: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
