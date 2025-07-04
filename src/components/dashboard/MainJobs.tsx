"use client";

import { useState } from "react";
import JobCard from "./JobCard";
import { Typography } from "../ui/Typography";
import EmptyState from "../common/EmptyState";
import DeleteDialog from "../common/DeleteDialog";
import { useJobs } from "@/hooks/useJobs";
import JobCardSkeleton from "../skeleton/JobCardSkeleton";
import { useWalletConnectionContext } from "@/contexts/WalletConnectionContext";
import { WalletConnectionCard } from "../common/WalletConnectionCard";
import { useDeleteJob } from "@/hooks/useDeleteJob";
import { ErrorMessage } from "../common/ErrorMessage";

type MainJobsProps = {
  selectedType?: string;
};
const MainJobs = ({ selectedType = "All Types" }: MainJobsProps) => {
  const [expandedJobs, setExpandedJobs] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [expandedJobDetails, setExpandedJobDetails] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedLinkedJobDetails, setExpandedLinkedJobDetails] = useState<{
    [key: number]: boolean;
  }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<number | null>(null);

  const { jobs, loading, error } = useJobs();
  const { isConnected } = useWalletConnectionContext();
  const { deleteJob, loading: deleteLoading } = useDeleteJob();

  const toggleJobExpand = (jobId: number) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
    // Close all expanded job details when a linked job is expanded
    setExpandedJobDetails({});
  };

  const toggleJobDetails = (jobId: number) => {
    setExpandedJobDetails((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const toggleLinkedJobDetails = (jobId: number) => {
    setExpandedLinkedJobDetails((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const showDeleteConfirmation = (jobId: number) => {
    setJobIdToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (jobIdToDelete == null) return;
    await deleteJob(jobIdToDelete);
    setDeleteDialogOpen(false);
    setJobIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setJobIdToDelete(null);
  };

  const getFilteredJobs = () => {
    if (selectedType !== "All Types") {
      return jobs.filter((job) => job.taskDefinitionId === selectedType);
    }
    return jobs;
  };

  // Map selectedType to allowed JobTypeTab values
  const mapToJobTypeTab = (
    type: string,
  ): "All Types" | "Time-based" | "Event-based" | "Condition-based" => {
    if (
      type === "Time-based" ||
      type === "Event-based" ||
      type === "Condition-based"
    )
      return type;
    return "All Types";
  };

  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        onCancel={handleCancelDelete}
        onConfirm={handleDelete}
        confirmText={deleteLoading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />

      {loading ? (
        <div className="text-white text-center py-10">
          <JobCardSkeleton />
        </div>
      ) : !isConnected ? (
        <WalletConnectionCard className="border-0" />
      ) : (
        <>
          {getFilteredJobs().length === 0 && !error && (
            <EmptyState
              jobType={mapToJobTypeTab(selectedType)}
              type="All Types"
            />
          )}

          {error && <ErrorMessage error={error} />}

          {!error && getFilteredJobs().length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 xl:grid-cols-3">
              {getFilteredJobs().map((job) => (
                <div key={job.id} className="col-span-1">
                  <JobCard
                    job={job}
                    expanded={!!expandedJobs[job.id]}
                    expandedDetails={!!expandedJobDetails[job.id]}
                    onToggleExpand={toggleJobExpand}
                    onToggleDetails={toggleJobDetails}
                    onDelete={showDeleteConfirmation}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div>
        {getFilteredJobs().map((job) =>
          job.linkedJobs &&
          job.linkedJobs.length > 0 &&
          expandedJobs[job.id] ? (
            <div key={job.id}>
              <Typography
                variant="h2"
                color="white"
                align="left"
                className=" my-7"
              >
                Linked Jobs
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 xl:grid-cols-3">
                {job.linkedJobs.map((linkedJob) => (
                  <JobCard
                    key={linkedJob.id}
                    job={linkedJob}
                    expanded={false}
                    expandedDetails={!!expandedLinkedJobDetails[linkedJob.id]}
                    onToggleExpand={() => {}}
                    onToggleDetails={toggleLinkedJobDetails}
                    onDelete={showDeleteConfirmation}
                  />
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>
    </>
  );
};

export default MainJobs;
