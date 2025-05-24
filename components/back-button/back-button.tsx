"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

const BackButton = () => {
  const router = useRouter();
  const t = useTranslations("Navigation");

  return (
    <Button variant="outline" size="sm" onClick={() => router.back()}>
      {t('backButtonText')}
    </Button>
  );
}

export default BackButton;