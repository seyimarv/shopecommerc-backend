import { defineRouteConfig } from "@medusajs/admin-sdk";
import { TagSolid } from "@medusajs/icons";
import {
  Container,
  Heading,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  useDataTable,
  Button,
  Input,
} from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";



type Announcement = {
  id: string;
  message: string;
};

type AnnouncementsResponse = {
  announcements: Announcement[];
  count: number;
  limit: number;
  offset: number;
};

const AnnouncementsPage = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<{ message: string }>();

  const PUBLISHABLE_API_KEY = import.meta.env.VITE_PUBLISHABLE_API_KEY
    

  const columnHelper = createDataTableColumnHelper<Announcement>();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("message", {
      header: "Messages",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          onClick={() => deleteMutation.mutate(row.original.id)}
          isLoading={deleteMutation.isPending}
        >
          Delete
        </Button>
      ),
    }),
  ];

  const limit = 15;
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });

  const offset = useMemo(() => pagination.pageIndex * limit, [pagination]);

  const { data, isLoading, error } = useQuery<AnnouncementsResponse>({
    queryFn: () =>
      sdk.client.fetch(`/store/announcements`, {
        query: { limit, offset },
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
      }),
    queryKey: [["announcements", limit, offset]],
  });

  console.log(data, error);

  const mutation = useMutation({
    mutationFn: async (newAnnouncement: { message: string }) => {
      return sdk.client.fetch(`/store/announcements`, {
        method: "POST",
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        body: newAnnouncement,
      });
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: [["announcements"]] });
      reset();
    },
    onError: (error) => {
      console.error("Mutation Failed:", error);
    },
  });

  const onSubmit = (data: { message: string }) => {
    mutation.mutate(data);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return sdk.client.fetch(`/store/announcements/${id}`, {
        method: "DELETE",
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["announcements"]] });
    },
    onError: (error) => {
      console.error("Deletion Failed:", error);
    },
  });

  const table = useDataTable({
    columns,
    data: data?.announcements || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  });

  return (
    <Container className="divide-y p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Announcements</Heading>
        </DataTable.Toolbar>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 p-4">
          <Input
            {...register("message")}
            placeholder="Enter announcement..."
            required
          />
          <Button type="submit" isLoading={mutation.isPending}>
            Post
          </Button>
        </form>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Announcements",
  icon: TagSolid,
});

export default AnnouncementsPage;
