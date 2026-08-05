import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    timeline: [
      {
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        comment: { type: String }
      }
    ],
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required for application'],
    },
    resumeName: {
      type: String,
      default: 'Resume',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.timeline.push({ status: this.status, date: Date.now() });
  } else if (this.isModified('status')) {
    this.timeline.push({ status: this.status, date: Date.now() });
  }
  next();
});

// Prevent duplicate applications by the same user to the same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
