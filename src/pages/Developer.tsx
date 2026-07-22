import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  GraduationCap,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Developer() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-12">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border">
            <CardContent className="p-10">

              <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-center">

                {/* Left Side */}

                <div className="flex flex-col items-center">

                  {/* Replace this later with your image */}

                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20 flex items-center justify-center">

                    <span className="text-6xl font-bold text-primary">
                      HG
                    </span>

                  </div>

                  <Badge className="mt-6">
                    Developer
                  </Badge>

                </div>

                {/* Right Side */}

                <div>

                  <p className="text-primary font-semibold uppercase tracking-wider">
                    Hello, I'm
                  </p>

                  <h1 className="text-5xl font-extrabold mt-2">
                    Hiral Goyal
                  </h1>

                  <h2 className="text-2xl text-muted-foreground mt-3">
                    Full-Stack Developer & Founder
                  </h2>

                  <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl">
                    Passionate about building secure, scalable and impactful
                    software that solves real problems for students.
                    I enjoy designing complete products—from UI/UX
                    to backend architecture, cloud deployment and
                    application security.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-8">

                    <Badge variant="secondary">
                      React
                    </Badge>

                    <Badge variant="secondary">
                      Firebase
                    </Badge>

                    <Badge variant="secondary">
                      TypeScript
                    </Badge>

                    <Badge variant="secondary">
                      Tailwind CSS
                    </Badge>

                    <Badge variant="secondary">
                      Vercel
                    </Badge>

                  </div>

                  <div className="flex flex-wrap gap-6 mt-8 text-muted-foreground">

                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      Gwalior, India
                    </div>

                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} />
                      Mathematics & Computing
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-4 mt-10">

                    <Button>
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>

                    <Button variant="outline">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>

                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>

                  </div>

                </div>

              </div>

            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
