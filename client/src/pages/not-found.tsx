import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { defineCopy, useCopy } from "@/i18n";

const copy = defineCopy({
  en: {
    title: "404 Page Not Found",
    message: "The page you're looking for doesn't exist or has moved.",
    backToHome: "Back to home",
  },
  es: {
    title: "404: página no encontrada",
    message: "La página que buscas no existe o se ha movido.",
    backToHome: "Volver al inicio",
  },
});

export default function NotFound() {
  const t = useCopy(copy);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {t.message}
          </p>

          {/* Inside the /es nest, "/" resolves to /es, so this stays in the current locale. */}
          <Link href="/" className="mt-6 inline-flex items-center text-primary hover:text-accent transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToHome}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
