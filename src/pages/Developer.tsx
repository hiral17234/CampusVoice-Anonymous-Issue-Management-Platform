import { motion } from "framer-motion";
import {
  Github,
  BookOpen,
  FileText,
  Code2,
  Rocket,
  BadgeCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Developer() {
  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="border-b bg-card/70 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Developer Hub
              </h1>

              <p className="text-muted-foreground text-sm">
                CampusVoice Engineering Portal
              </p>
            </div>

          </div>

          <Badge className="rounded-full">
            v2.4.1
          </Badge>

        </div>
      </div>

      <div className="container mx-auto px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5 }}
        >

          <Card className="overflow-hidden">

            <CardContent className="p-10">

              <div className="grid lg:grid-cols-[140px_1fr] gap-8">

                {/* Logo */}

                <div className="flex justify-center">

                  <div className="w-32 h-32 rounded-full border-2 border-border bg-muted flex items-center justify-center">

                    <Rocket className="w-14 h-14 text-primary"/>

                  </div>

                </div>

                {/* Content */}

                <div>

                  <Badge
                    variant="secondary"
                    className="mb-4"
                  >
                    Anonymous Campus Issue Management Platform
                  </Badge>

                  <h2 className="text-5xl font-bold mb-4">

                    CampusVoice

                  </h2>

                  <p className="text-lg text-muted-foreground leading-8">

                    CampusVoice was originally developed during a hackathon.
                    Following the event, the platform was independently
                    redesigned, expanded and continuously maintained with
                    significant improvements to its architecture, backend,
                    security, user experience, scalability and campus ecosystem.

                  </p>

                  <div className="flex flex-wrap gap-3 mt-8">

                    <Button>

                      <Github className="w-4 h-4 mr-2"/>

                      GitHub

                    </Button>

                    <Button
                      variant="outline"
                    >

                      <BookOpen className="w-4 h-4 mr-2"/>

                      Documentation

                    </Button>

                    <Button
                      variant="outline"
                    >

                      <FileText className="w-4 h-4 mr-2"/>

                      Changelog

                    </Button>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-8">

                    <Badge variant="secondary">

                      Stable Release

                    </Badge>

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

                      Vercel

                    </Badge>

                    <Badge variant="secondary">

                      <BadgeCheck className="w-3 h-3 mr-1"/>

                      Production Ready

                    </Badge>

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
