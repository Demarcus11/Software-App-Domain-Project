import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserCardProps {
  type: "Users" | "Admins" | "Managers";
  bgColor: "primary" | "secondary";
}

const UserCard = ({ type, bgColor }: UserCardProps) => {
  return (
    <Card
      className={bgColor === "primary" ? "bg-primary/50" : "bg-secondary/50"}
    >
      <CardHeader>
        <Badge variant="default" className="max-w-max bg-white text-black">
          2025
        </Badge>
        <CardDescription className="hidden">{type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-medium">10</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-700">{type}</p>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
