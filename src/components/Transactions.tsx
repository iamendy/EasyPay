import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { useAccount } from "wagmi";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "../helpers";

export default function Transactions() {
  const { address } = useAccount();

  const getListings = async () => {
    const { data } = await axios.get(`/api/user/${address}/listings`);
    console.log(data);
    return data;
  };

  const { isPending, data: listings } = useQuery({
    queryKey: ["listings", address],
    queryFn: getListings,
    enabled: !!address,
  });

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Recent listings</CardTitle>
      </CardHeader>
      <CardContent>
        {listings?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sm:table-cell">Date</TableHead>
                <TableHead className="sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings?.map((l: any) => (
                <TableRow key={l?.id}>
                  <TableCell className="table-cell">
                    {formatDate(l?.createdAt)}
                  </TableCell>
                  <TableCell className="table-cell">
                    {l?.quantity - l?.sold == 0 && (
                      <Badge className="text-xs" variant="secondary">
                        {"soldOut "}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">x{l?.sold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                No listing found.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant={"secondary"}>
                <Link href={`/listings/create`}>Create New Listing</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
