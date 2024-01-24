"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash } from "lucide-react"

import { Button } from "@/components/ui/button";

interface CourseData {
  userId: string;
  question: string[];
  option: string[];
  chapter: string;
  course: string;

}
  
export const columns: ColumnDef<CourseData>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "course",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "chapter",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Chapter Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  
  {
    accessorKey: "question",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Question
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "option",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Option
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "percentageCorrect",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Result
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const percentageCorrect = parseFloat(row.getValue("percentageCorrect") || "0");
      const formattedPercentage = (percentageCorrect/100).toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });

      return <div>{formattedPercentage}</div>
    }
  },
]
