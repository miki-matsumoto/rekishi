import { Button, Text } from "@tremor/react";
import { Link } from "@tanstack/react-router";

export const AuditLogsPage = () => {
  return (
    <div>
      <div className="border-b-gray-200 border">
        <div className="my-0 mx-auto max-w-5xl h-16 flex justify-between items-center">
          <Button
            text="Back to App"
            color="gray"
            importance="secondary"
            size="sm"
          />
          <Text>Powerd by Rekishi</Text>
        </div>
      </div>
    </div>
  );
};
