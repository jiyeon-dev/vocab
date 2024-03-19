import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaPencilAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface EditButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  editUrl?: string;
}
interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<EditButtonProps, "editUrl"> {}
interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  imageURL?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, editUrl, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "h-36 relative rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {children}
      <CardEditButton editUrl={editUrl} />
    </div>
  )
);
Card.displayName = "Card";

const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, imageURL, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-cover bg-center bg-no-repeat rounded-s-lg",
          className
        )}
        style={{
          backgroundImage: `url('${imageURL}'), url('/no-image.jpeg')`,
          ...props.style,
        }}
        {...props}
      />
    );
  }
);
CardImage.displayName = "CardImage";

const CardEditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ className, editUrl, ...props }, ref) => {
    if (!editUrl) return <></>;
    return (
      <Link to={editUrl}>
        <Button
          ref={ref}
          variant='ghost'
          className={cn("absolute top-0 right-0 rounded-full", className)}
          {...props}
        >
          <FaPencilAlt />
        </Button>
      </Link>
    );
  }
);
CardEditButton.displayName = "CardEditButton";

const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  );
});
CardBody.displayName = "CardBody";

const CardTitle = ({
  className,
  children,
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className={cn("leading-none tracking-tight truncate", className)}>
    {children}
  </h1>
);
CardTitle.displayName = "CardTitle";

export { Card, CardImage, CardBody, CardTitle };
