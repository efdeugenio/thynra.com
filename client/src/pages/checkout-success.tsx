import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

/**
 * Landing page after the Onvo iframe widget reports a successful payment.
 *
 * Onvo's webhook (subscription.renewal.succeeded) is what actually activates
 * the subscription on the receptionist side — it fires server-to-server and
 * is the source of truth for "you're paid". This page is just the visual
 * confirmation for the customer; the subscription may take a few seconds
 * to flip to active in the dashboard.
 */
export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6 mr-2" />
              ¡Pago confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              Gracias. Recibimos tu pago. En unos minutos vas a recibir un
              correo de bienvenida con un enlace para completar la configuración
              de tu AI Receptionist (toma 5 minutos).
            </p>
            <p>
              Cuando termines ese formulario, terminamos la configuración
              técnica y activamos a Sofia (normalmente el mismo día).
            </p>
            <p>
              Si el correo no llega en una hora, escríbenos a{" "}
              <a href="mailto:hello@thynra.com" className="underline">
                hello@thynra.com
              </a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
