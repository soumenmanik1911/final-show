import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({
  page,
  totalPages,
  onPageChange,
}: Props) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        disabled={page === 1}
        variant="outline"
        size="sm"
        className="bg-black text-white border-white hover:bg-white hover:text-black transition-colors duration-150"
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Previous
      </Button>
      <Button
        disabled={page === totalPages || totalPages === 0}
        variant="outline"
        size="sm"
        className="bg-black text-white border-white hover:bg-white hover:text-black transition-colors duration-150"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Next
      </Button>
    </div>
  );
};
