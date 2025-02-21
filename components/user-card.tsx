import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image, { StaticImageData } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface UserCardProps {
  type: "Users" | "Admins" | "Managers";
  bgColor: "primary" | "secondary" | "tertiary";
  image?: StaticImageData;
  amount: number;
  isLoading?: boolean;
}

const UserCard = ({
  type,
  bgColor,
  image,
  amount,
  isLoading,
}: UserCardProps) => {
  const bgColorClasses = {
    primary: "bg-primary/70",
    secondary: "bg-secondary/70",
    tertiary: "bg-tertiary/70",
  };

  return (
    <>
      <Card className={`${bgColorClasses[bgColor]} relative`}>
        <CardHeader>
          {isLoading ? (
            <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
          ) : (
            <Badge variant="outline" className="max-w-max bg-white text-black">
              2025
            </Badge>
          )}
          <CardDescription className="hidden">{type}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-10 bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p className="text-5xl font-medium text-white">{amount}</p>
          )}
        </CardContent>
        <CardFooter>
          {isLoading ? (
            <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p className="text-sm text-gray-700 text-white">{type}</p>
          )}
        </CardFooter>

        {image && (
          <div className="absolute bottom-4 right-4">
            {isLoading ? (
              <Skeleton className="h-[100px] w-[100px] bg-gray-200 dark:bg-gray-700" />
            ) : (
              <Image
                src={image}
                alt={`${type} illustration`}
                width={100}
                height={100}
              />
            )}
          </div>
        )}
      </Card>
    </>
  );
};

export default UserCard;
