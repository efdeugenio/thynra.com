import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function CancelPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <XCircle className="h-16 w-16 text-orange-600 mx-auto" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-orange-800 mb-4">
                Payment Cancelled
              </h1>
              
              <p className="text-lg text-orange-700 mb-6">
                Your payment was cancelled. No charges have been made to your account.
              </p>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Don't worry! You can try again anytime. If you're experiencing issues, 
                  please contact our support team.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setLocation('/')}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return Home
                  </Button>
                  
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  If you're having trouble with the payment process, please contact us at{" "}
                  <a href="mailto:support@thynra.com" className="text-orange-600 hover:underline">
                    support@thynra.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
