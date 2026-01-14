import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Get In Touch</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            We&apos;re here to help! Whether you have a question about our courses or need assistance, feel free to reach out.
          </p>
        </div>
      </section>
      
      <section className="py-16 sm:py-24">
        <div className="container grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Phone className="w-8 h-8 text-primary"/>
                <CardTitle className="font-headline">By Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Our team is available during business hours.</p>
                <p className="text-lg font-semibold mt-2 text-primary">+1 (234) 567-890</p>
                <Button variant="link" className="p-0 h-auto mt-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4"/> Direct WhatsApp
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Mail className="w-8 h-8 text-primary"/>
                <CardTitle className="font-headline">By Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Send us an email anytime.</p>
                <p className="text-lg font-semibold mt-2 text-primary">contact@drivesafe.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <MapPin className="w-8 h-8 text-primary"/>
                <CardTitle className="font-headline">Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">123 Driving Lane, Safety City, 45678</p>
                <p className="text-lg font-semibold mt-2 text-primary">Working Hours:</p>
                <p className="text-sm text-muted-foreground">Mon-Fri: 9am - 7pm | Sat: 10am - 4pm</p>
              </CardContent>
            </Card>
            
            <a href="#" className="flex items-center gap-2 text-primary font-semibold hover:underline">
                <Facebook className="w-5 h-5"/> Follow us on Facebook
            </a>
          </div>
          
          <div className="h-96 md:h-full w-full rounded-lg overflow-hidden bg-muted">
            {/* Google Maps Embed Placeholder */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.256959546056!2d-122.419415484681!3d37.77492957975899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c1b95e1d9%3A0x4a501367f076adff!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1626359145831!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
