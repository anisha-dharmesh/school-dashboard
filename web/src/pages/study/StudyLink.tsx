import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";

/** A button that opens a Study page (a subject's chapter list, or one chapter). */
export default function StudyLink({ to, label }: { to: string; label: string }) {
  return (
    <Button size="xs" className="self-start" nativeButton={false} render={<Link to={to} />}>
      <BookOpen />
      {label}
    </Button>
  );
}
