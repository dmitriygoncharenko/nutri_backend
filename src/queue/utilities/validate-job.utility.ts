import { Job } from "bullmq";

export const validateJob = (job: Job, type?: "string"): string => {
  if (!type) type = "string";
  if (!job) throw new Error("No job found");
  if (!job.data) throw new Error("No job data found");
  if (typeof job.data !== type)
    throw new Error(
      `Wring job data type. Expected type is ${type}, ${JSON.stringify(
        job.data
      )} given`
    );
  if (type === "string") return job.data as string;
};
