import React, { useContext, forwardRef } from "react";
import { TextInput } from "../../ui/TextInput";
import { JobFormContext } from "@/contexts/JobFormContext";

export const JobTitleInput = forwardRef<
  HTMLDivElement,
  { error?: string | null; readOnly?: boolean }
>(({ error, readOnly = false }, ref) => {
  const context = useContext(JobFormContext);
  if (context === undefined) {
    throw new Error("JobTitleInput must be used within a JobFormProvider");
  }
  const { jobTitle, setJobTitle, setJobTitleError } = context;

  const handleChange = (value: string) => {
    if (readOnly) return;
    setJobTitle(value);
    if (value.trim() !== "") {
      setJobTitleError(null);
    }
  };

  return (
    <div ref={ref}>
      <TextInput
        label="Job Title"
        placeholder="Enter job title"
        value={jobTitle}
        onChange={handleChange}
        error={error ?? null}
        disabled={readOnly}
      />
    </div>
  );
});
JobTitleInput.displayName = "JobTitleInput";
