"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button variant="outline" size="sm" onClick={() => router.back()}>
      Назад
    </Button>
  );
}

export default BackButton;