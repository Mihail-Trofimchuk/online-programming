"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash } from "lucide-react"

import { Button } from "@/components/ui/button";

import toast from 'react-hot-toast';
import { useState } from 'react';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface UserMessage {
	id: string;
	name: string; 
  username: string;
	motivation: string;
	education: string,
	email: string,
}

const ConfirmDeleteButton: React.FC<{ messageId: string }> = ({ messageId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
  
	const onDelete = async () => {
	  try {
		setIsLoading(true);
  
		await axios.delete(`/api/message/${messageId}`);
  
		toast.success("Message deleted");
		router.refresh();
		router.push(`/admin/messages`);
	  } catch (error) {
		console.error("Error deleting message:", error);
		toast.error("Something went wrong");
	  } finally {
		setIsLoading(false);
	  }
	};
  
	return (
	  <ConfirmModal onConfirm={onDelete}>
		<Button size="sm" disabled={isLoading}>
		  <Trash className="h-4 w-4" />
		</Button>
	  </ConfirmModal>
	);
  };
  
export const columns: ColumnDef<UserMessage>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Surname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "education",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Education
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "motivation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Motivation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

	  return <ConfirmDeleteButton messageId={id} />;
    }
  }
]
