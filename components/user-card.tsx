import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image, { StaticImageData } from "next/image";

interface UserCardProps {
  type: "Users" | "Admins" | "Managers";
  bgColor: "primary" | "secondary" | "tertiary";
  image?: StaticImageData;
}

const UserCard = ({ type, bgColor, image }: UserCardProps) => {
  const bgColorClasses = {
    primary: "bg-primary/70",
    secondary: "bg-secondary/70",
    tertiary: "bg-tertiary/70",
  };

  return (
    <Card className={`${bgColorClasses[bgColor]} relative`}>
      <CardHeader>
        <Badge variant="outline" className="max-w-max bg-white text-black">
          2025
        </Badge>
        <CardDescription className="hidden">{type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-medium text-white">10</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-700 text-white">{type}</p>
      </CardFooter>

      {image && (
        <div className="absolute bottom-4 right-4">
          <Image
            src={image}
            alt={`${type} illustration`}
            width={100}
            height={100}
          />
        </div>
      )}
    </Card>
  );
};

export default UserCard;
